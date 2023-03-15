const pa11y = require( 'pa11y' );
const axe = require( 'axe-core' );
const aChecker = require( "accessibility-checker" );

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