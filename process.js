const {
  readFileSync,
  writeFileSync,
  existsSync
} = require( 'fs' );
const path = require( 'path' );
const { spawn } = require( 'child_process' );

const root = path.resolve( __dirname, '.' );
const out = path.resolve( root, 'out' );

const getUrl = ( string ) => {
  // force https
  string = "https://" + string.replace( /https?:\/\//, '' );
  // get path only
  string = string.split( '?' )[ 0 ].split( '#' )[ 0 ];

  return string;
};