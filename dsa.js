function convertPa11ySchema ( schema ) {
  return {
    id: schema.code,
    title: schema.message,
    description: schema.context
  };
}
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




function convertGoogleSchema ( schema ) {
  const details = schema.details.items;
  const headings = schema.details.headings;

  const idIndex = headings.indexOf( 'ID' );
  const titleIndex = headings.indexOf( 'Name' );
  const descIndex = headings.indexOf( 'Description' );

  return details.map( ( item ) => {
    return {
      id: item[ idIndex ],
      title: item[ titleIndex ],
      description: item[ descIndex ]
    };
  } );
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