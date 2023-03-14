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

const l = ( d, e = null ) => { console.log( e || d ); return d }; // log and return (and error)

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

  return l( d )
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
  // const command = `lighthouse "${ url }" --only-categories accessibility --output json --output-path "${ out }/${ key }.json"`;
  const command = `lighthouse "${ url }" --only-categories accessibility --output json`; // default for json is stdout

  const exec = await async_command( command );
  return JSON.parse( l( exec ) );
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
    .catch( err => l( [], err ) );

  return axe_raw;
};
const processAxe = ( raw ) => {
  // TODO: Process the raw data
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
const getP11y = async ( url ) => {
  const pa11y_raw = pa11y( url )
    .then( results => l( results ) )
    .catch( err => l( [], err ) );
  return pa11y_raw
};
const processPally = ( raw ) => {
  // TODO: Process the raw data
};

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
// This is going to be a pain.
const googleSchema = {
  "aria-allowed-attr": {
    "id": "aria-allowed-attr",
    "title": "`[aria-*]` attributes match their roles",
    "description": "Each ARIA `role` supports a specific subset of `aria-*` attributes. Mismatching these invalidates the `aria-*` attributes. [Learn how to match ARIA attributes to their roles](https://dequeuniversity.com/rules/axe/4.6/aria-allowed-attr).",
    "score": 1,
    "scoreDisplayMode": "binary",
    "details": {
      "type": "table",
      "headings": [],
      "items": []
    }
  },
} // take all values lol since the key is in the id, nice.