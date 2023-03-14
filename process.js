/*
Don't worry there will be a main()
meanwhile here is some long setup
*/
const {
  readFileSync,
  writeFileSync,
  existsSync
} = require( 'fs' );
const path = require( 'path' );
const { spawn } = require( 'child_process' );

const pa11y = require( 'pa11y' );
const axe = require( 'axe-core' );
const aChecker = require( "accessibility-checker" );

const root = path.resolve( __dirname, '.' );
const out = path.resolve( root, 'out' );

const cleanURL = ( string ) => {
  // force https
  string = "https://" + string.replace( /https?:\/\//, '' );
  // get path only
  string = string.split( '?' )[ 0 ].split( '#' )[ 0 ];

  return string;
};

const url2key = ( url ) => url
  .replace( /https?:\/\//, '' )
  .replace( "/\//g", '-' )
  .replace( ".", '' );

const async_command = ( command ) => new Promise( ( resolve, reject ) => {
  const child = spawn( command, { shell: true, stdio: 'inherit' } );
  child.on( 'close', ( code ) => code === 0 ? resolve( code ) : reject( code ) );
} );


// LIGHTHOUSE
const getLighthouse = async ( url ) => {
  const key = url2key( url );
  // lighthouse "https://www.nic.in/" --only-categories accessibility --output json --output-path "./out/nic.in.json"
  const command = `lighthouse "${ url }" --only-categories accessibility --output json --output-path "${ out }/${ key }.json"`;

  return await async_command( command );
};

// AXE
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
// pa11y('https://example.com/').then((results) => {
//     // Do something with the results
// });

// MAIN
const main = async () => {
  //
}; main();