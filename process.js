const {
  readFileSync,
  writeFileSync,
  existsSync
} = require( 'fs' );
const path = require( 'path' );
const { spawn } = require( 'child_process' );

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