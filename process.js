const fs = require( 'fs' );
const Papa = require( 'papaparse' );

// MAIN DATA
const cleanURL = ( string ) => "https://" + string
  .replace( /https?:\/\//, '' )
  .split( '?' )[ 0 ]
  .split( '#' )[ 0 ]
  .replace( /\/$/, '' );
const url2key = ( url ) => url
  .replace( /https?:\/\//, '' )
  .replaceAll( ".", '' )
  .replaceAll( "/", '-' )
  .split( ':' )[ 0 ]
  .split( '?' )[ 0 ]
  .split( '#' )[ 0 ]
  .replace( "www", '' );

const file_list = fs.readdirSync( './out' ).filter( e => e.endsWith( '.json' ) );
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
// MAIN DATA

const google_process = async ( data ) => {
  const audit_data = Object.entries( data.audits ).map( ( [ key, value ] ) => {
    const { id, scoreDisplayMode, score } = value;
    return {
      id,
      score: scoreDisplayMode ? score : null,
      catagory: data.categories.accessibility.auditRefs.find( e => e.id === id ).group || "best-practices"
    };
  } );

  return {
    audits: audit_data,
    score: data.categories.accessibility.score
  }
};

const grouped = ( { audits, score } ) => {
  const grouped = audits.group( ( { catagory } ) => catagory );
  const list = Object.entries( grouped )

  let store = {
    "all-round": ~~( score * 100 )
  };
  list.forEach( ( [ key, value ] ) => {
    const scores = value.filter( e => e.score !== null ).map( e => e.score );
    let average = scores.reduce( ( a, b ) => a + b, 0 ) / scores.length;

    average = Number.isNaN( average ) ? null : ~~( average * 100 );
    store[ key ] = average;
  } );

  return store;
};

file_list.forEach( async ( file ) => {
  const fileText = await fs.readFileSync( "./out/" + file, 'utf-8' );
  const data = JSON.parse( fileText );

  const first_pass = await google_process( data );
  const grouped_data = grouped( first_pass );

  console.log( grouped_data );
} );

console.log( data );