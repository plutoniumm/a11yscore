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
const dataset = csv2json( "./list.csv" ).then( d => d.map( e => {
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

const errors = [];
const grouper = ( { audits, score } ) => {
  let list;
  try {
    const grouped = audits
      .filter( e => e.score !== null )
      .group( ( { catagory } ) => catagory );
    list = Object.entries( grouped );
  } catch ( e ) {
    errors.push( e );
    return;
  }

  let store = {
    "all-round": ~~( score * 100 )
  };
  list.forEach( ( [ key, value ] ) => {
    const scores = value.map( e => e.score );
    let average = scores.reduce( ( a, b ) => a + b, 0 ) / scores.length;

    average = Number.isNaN( average ) ? null : ~~( average * 100 );
    store[ key ] = average;
  } );

  return store;
};

dataset.then( async ( d ) => {
  let fulljson = d.map( async ( { key: fileName, url, name } ) => {
    let data;
    try {
      const fileText = await fs.readFileSync( `./out/${ fileName }.json`, 'utf-8' );
      data = JSON.parse( fileText );
    } catch ( e ) { return console.log( "NO FILE/JSON: ", fileName ); }

    if ( data === undefined ) return console.log( "undefined@", fileName );

    const first_pass = await google_process( data );
    const grouped_data = grouper( first_pass ) || {};

    grouped_data.name = name;
    grouped_data.id = fileName;
    grouped_data.url = url;

    return grouped_data;
  } );
  const array = await Promise.all( fulljson );

  // Find all possible keys
  const keys = new Set();
  array.forEach( obj => {
    if ( typeof obj === "object" && obj !== null )
      Object.keys( obj ).forEach( key => keys.add( key ) )
  } );

  // Set "N/A" for every object that does not have a key
  array.forEach( obj => {
    if ( typeof obj !== "object" || obj === null ) obj = {};
    keys.forEach( key => {
      if ( !( Object.hasOwn( obj, key ) ) ) obj[ key ] = "N/A";
    } )
  } );

  fs.writeFileSync( "./out.json", JSON.stringify( array ) );
} );