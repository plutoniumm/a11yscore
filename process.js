/*
Don't worry there will be a main()
meanwhile here is some long setup
*/
const fs = require( 'fs' );
const { spawn } = require( 'child_process' );

const Papa = require( 'papaparse' );

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
const data = csv2json( "./list.csv" ).then( d => d.map( e => {
  const url = cleanURL( e.href );
  return {
    name: e.name,
    url, key: url2key( url )
  }
} ) );

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
  .replaceAll( ".", '' )
  .replaceAll( "/", '-' )
  .split( ':' )[ 0 ]
  .split( '?' )[ 0 ]
  .split( '#' )[ 0 ]
  .replace( "www", '' );

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
const getLighthouse = async ( url, key ) => {
  const command = `sh ./lighthouse.sh ${ url } ${ key }`; // default for json is stdout

  return await async_command( command );
};
const processLighthouse = ( raw ) => {
  // TODO: Process the raw data
};


// MAIN
const main = async () => {
  const dataset = await data;

  const promises = dataset.map( ( { url, key } ) => getLighthouse( url, key ) );
  const results = await Promise.all( promises );
}; main();
