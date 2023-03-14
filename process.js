/*
Don't worry there will be a main()
meanwhile here is some long setup
*/
const fs = require( 'fs' );
const path = require( 'path' );
const { spawn } = require( 'child_process' );

const Papa = require( 'papaparse' );

const pa11y = require( 'pa11y' );
const axe = require( 'axe-core' );
const aChecker = require( "accessibility-checker" );

const root = path.resolve( __dirname, '.' );
const out = path.resolve( root, 'out' );

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
const data = csv2json( "./list.csv" ).then( data => {
  data = data.map( e => {
    const url = cleanURL( e.href );
    return {
      ...e, url,
      key: url2key( url )
    }
  } )
  console.log( data );
} );

//
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


// LIGHTHOUSE
// https://www.npmjs.com/package/lighthouse
const getLighthouse = async ( url ) => {
  const key = url2key( url );
  // lighthouse "https://www.nic.in/" --only-categories accessibility --output json --output-path "./out/nic.in.json"
  const command = `lighthouse "${ url }" --only-categories accessibility --output json --output-path "${ out }/${ key }.json"`;

  return await async_command( command );
};

// AXE
// https://www.npmjs.com/package/axe-core
axe.configure( {} );
const getAxe = async ( url ) => {
  const axed = axe.run()
    .then( results => {
      if ( results.violations.length ) {
        console.log( results.violations );
        return results.violations;
      }
    } )
    .catch( err => {
      console.log( err );
      return [];
    } );

  return axed;
};

// aChecker
// https://www.npmjs.com/package/accessibility-checker
// Perform the accessibility scan using the aChecker.getCompliance API
// aChecker.getCompliance(testDataFileContent, testLabel).then((results) => {
//   const report = results.report;

//   // Call the aChecker.assertCompliance API which is used to compare the results with baseline object if we can find one that
//   // matches the same label which was provided.
//   const returnCode = aChecker.assertCompliance(report);

//   // In the case that the violationData is not defined then trigger an error right away.
//   expect(returnCode).toBe(0, "Scanning " + testLabel + " failed.");
// });

// PA11Y
// https://github.com/pa11y/pa11y
// pa11y('https://example.com/').then((results) => {
//     // Do something with the results
// });
const getP11y = async ( url ) => {
  const p11y = await pa11y( url )
    .then( results => {
      console.log( results );
    } )
    .catch( err => {
      console.log( err );
      return [];
    } );
}

// MAIN
const main = async () => {
  const url = "https://www.nic.in/";
  // await getLighthouse( url );
  // await getAxe( url );
  const p11y = await getP11y( url );
  console.log( p11y );
}; main();


const errorCodes = new Map( [
  // format: NAME, MSG
  [ , 'error' ],
] )



// Pally Schema
const pallySchema = {
  code: 'WCAG2AA.Principle4.Guideline4_1.4_1_1.F77',
  type: 'error',
  typeCode: 1,
  message: 'Duplicate id attribute value "particle-canvas" found on the web page.',
  context: '<div class="overlay" id="particle-canvas"> </div>',
  selector: '#particle-canvas',
  runner: 'htmlcs',
  runnerExtras: {}
}