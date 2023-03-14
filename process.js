/*
Don't worry there will be a main()
meanwhile here is some long setup
*/

// imports
const fs = require( 'fs' );
const path = require( 'path' );
const { spawn } = require( 'child_process' );

const Papa = require( 'papaparse' );

const pa11y = require( 'pa11y' );
const axe = require( 'axe-core' );
const aChecker = require( "accessibility-checker" );

const root = path.resolve( __dirname, '.' );
const out = path.resolve( root, 'out' );

// primitives
const l = ( ln = 0, d, e = null ) => { console.log( ln, e || d ); return d }; // log and return (and error)
const read = ( loc, json = false ) => {
  let file = fs.readFileSync( loc, 'utf-8' );
  if ( json ) file = JSON.parse( file );

  return file;
};
const write = ( loc, data, json = false ) => {
  // TODO: REMOVE in prod
  if ( json ) data = JSON.stringify( data, null, 2 );
  fs.writeFileSync( loc, data );
};

// Setup
function csv2json ( filepath ) {
  const file = fs.createReadStream( filepath );
  return new Promise( ( resolve, reject ) => {
    Papa.parse( file, {
      header: true,
      complete ( results, file ) { resolve( results.data ) },
      error ( err, file ) { reject( err ) }
    } )
  } )
}
const data = csv2json( "./list.csv" ).then( d => {
  d = d.map( e => {
    const url = cleanURL( e.href );
    return {
      ...e, url,
      key: url2key( url )
    }
  } );

  return l( "csv2json", d )
} );

// Cleans a URL
const cleanURL = ( string ) => {
  // force https
  string = "https://" + string.replace( /https?:\/\//, '' );
  // get path only
  string = string.split( '?' )[ 0 ].split( '#' )[ 0 ];
  // remove trailing slash
  string = string.replace( /\/$/, '' );

  return string;
};


// Generates a key from a URL
const url2key = ( url ) => url
  .replace( /https?:\/\//, '' )
  .replace( "/\/g", '-' )
  .replaceAll( ".", '' )
  .replaceAll( "/", '-' );


const async_command = ( command ) => new Promise( ( resolve, reject ) => {
  const child = spawn( command, { shell: true, stdio: 'inherit' } );
  child.on( 'close', ( code ) => code === 0 ? resolve( code ) : reject( code ) );
} );

/*
0000000000_0000000000_0000000000_0000000000_0000000000_0000000000_0000000000
0000000000_0000000000_0000000000_0000000000_0000000000_0000000000_0000000000
0000000000_0000000000_0000000000_0000000000_0000000000_0000000000_0000000000
0000000000_0000000000_0000000000_0000000000_0000000000_0000000000_0000000000
0000000000_0000000000_0000000000_0000000000_0000000000_0000000000_0000000000
0000000000_0000000000_0000000000_0000000000_0000000000_0000000000_0000000000
*/
// LIGHTHOUSE
// https://www.npmjs.com/package/lighthouse
const getLighthouse = async ( url ) => {
  const key = url2key( url );
  // const command = `lighthouse "${ url }" --only-categories accessibility --output json --output-path "${ out }/${ key }.json"`;
  const command = `lighthouse "${ url }" --only-categories accessibility --output json --quiet --chrome-flags="--headless"`; // default for json is stdout

  const exec = await async_command( command );
  return JSON.parse( l( "getLighthouse", exec ) );
};
const processLighthouse = ( raw ) => {
  // TODO: Process the raw data
};

// AXE
// https://www.npmjs.com/package/axe-core
axe.configure( {} );
const getAxe = async ( url ) => {
  const axe_raw = axe.run()
    .then( results => {
      if ( results.violations.length ) return l( results.violations );
    } )
    .catch( err => l( "getAxe-catch", [], err ) );

  return axe_raw;
};
const processAxe = ( raw ) => {
  // TODO: Process the raw data
};

// aChecker
// https://www.npmjs.com/package/accessibility-checker
// Perform the accessibility scan using the aChecker.getCompliance API
aChecker.getCompliance( testDataFileContent, testLabel ).then( ( results ) => {
  const report = results.report;

  // Call the aChecker.assertCompliance API which is used to compare the results with baseline object if we can find one that
  // matches the same label which was provided.
  const returnCode = aChecker.assertCompliance( report );

  // In the case that the violationData is not defined then trigger an error right away.
  expect( returnCode ).toBe( 0, "Scanning " + testLabel + " failed." );
} );

// PA11Y
// https://github.com/pa11y/pa11y
const getP11y = async ( url ) => {
  const pa11y_raw = pa11y( url )
    .then( results => l( results ) )
    .catch( err => l( "getP11y-catch", [], err ) );
  return pa11y_raw
};
const processPally = ( raw ) => {
  // TODO: Process the raw data
};

// MAIN
const main = async () => {
  const url = "https://www.nic.in/";
  // await getAxe( url );

  // const p11y = await getP11y( url );
  // console.log( p11y );

  const lighthouse = await getLighthouse( url );
  console.log( lighthouse );
}; main();
