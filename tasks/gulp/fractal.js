const fs = require('fs');

const config = require('./../config');

/*
* Are we in build mode?
*/
const buildMode = process.argv.indexOf('--build') > -1;

/*
* Require the path module
*/
const path = require('path');

/*
 * Require the Fractal module
 */
const fractal = module.exports = require('@frctl/fractal').create();

/*
 * Give your project a title
 */
fractal.set('project.title', config.fractalProjectTitle);

// require the Mandelbrot theme module
const mandelbrot = require('@frctl/mandelbrot');

// create a new instance with custom config options
const myCustomisedTheme = mandelbrot({
  skin: 'black',

  // The format to use when outputting context data.
  format: 'json',

  // The nav sections that should show up in the sidebar (and in which order)
  nav: ['search', 'components', 'docs', 'information'],

  // The component info panels that should be displayed in the component browser
  panels: ['html', 'view', 'context', 'notes', 'resources', 'info'],

  styles: [
    'default',
    '/styles/css/fractal.css',
  ],

  highlightStyles: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.5.0/styles/monokai.min.css',

  // scripts: [
  // 'http://mega-corp.com/js/custom-mandelbrot-scripts.js',
  // 'default',
  // '/another/script.js'
  // ],

  lang: 'en',
  rtl: false,
  // static: {
  //   mount: path.join(__dirname + '../../fractal/theme'), // Theme asset URLs would now look something like: '/no-clash/path/to/file.js'
  // },
  favicon: '/images/fractal.css',

  // Customize labels used in the templates, useful for translating the interface for example.
  info: 'Information',
  builtOn: 'Last built on',
  search: {
    label: 'Search',
    placeholder: 'Search…',
    clear: 'Clear search',
  },
  tree: {
    collapse: 'Collapse tree',
  },
});

myCustomisedTheme.addStatic(path.join(__dirname , '../../fractal/theme/assets'));
myCustomisedTheme.addStatic(path.join(__dirname , '../../src/Project/OAP/code/Fonts'));

myCustomisedTheme.addLoadPath(path.join(__dirname , '../../fractal/theme/views'));

// tell Fractal to use the configured theme by default
fractal.web.theme(myCustomisedTheme);


/*
 * Components Statuses
 */

fractal.components.set('statuses', {
  wip: {
    label: "WIP",
    description: "Work in progress. Implement with caution.",
    color: "#FF9233"
  },
  todo: {
    label: "Todo",
    description: "Some work is required. Do not implement.",
    color: "#FF9233"
  },
  ready: {
    label: "Ready",
    description: "Ready to implement.",
    color: "#29CC29"
  },
  deprecated: {
    label: "Deprecated",
    description: "Ready to implement.",
    color: "#e32847"
  },
  prototype: {
    label: "Prototype",
    description: "Do not implement.",
    color: "#e32847"
  },
});

fractal.docs.set('statuses', {
  draft: {
    label: 'Draft',
    description: 'Work in progress.',
    color: '#FF3333'
  },
  ready: {
    label: 'Ready',
    description: 'Ready for referencing.',
    color: '#29CC29'
  }
});

fractal.components.set('default.status', 'todo');
fractal.docs.set('default.status', 'draft');

/*
 * Tell Fractal where to look for components
 */
fractal.components.set('path', path.join(__dirname, '../../fractal/components'));
fractal.components.set('default.preview', '@preview');
fractal.components.set('default.context', {
  imgDir: `${buildMode ? config.fractalExternalBuildPrefix : '/'}themes/OAP/Images`,
  site: config.currentWebsite,
});

/*
 * Tell Fractal where to look for documentation pages
 */
//fractal.docs.set('path', path.join(__dirname, '../../fractal/docs'));

/*
 * Tell the Fractal web preview plugin where to look for static assets
 */
fractal.web.set('static.path', path.join(__dirname, `../../${config.directories.buildDirectory}/Website`));

/*
 * Publish path
 */
fractal.web.set('builder.dest', path.join(__dirname, `../../${config.directories.buildDirectory}/Fractal`));

fractal.web.set('server.syncOptions', {
  middleware: [
    {
      route: '/apioap',
      handle: (request, response) => {
        const mocksPath = '../../fractal/models/api/';
        const fileName = request.url.indexOf('?') !== -1 ?
          `${request.url.substring(1, request.url.indexOf('?'))}.json` :  // '/search?query=123' => 'search'
          `${request.url.substring(1)}.json`;
        const filePath = path.join(__dirname, `${mocksPath}${fileName}`);

        fs.exists(filePath, (exists) => {
          if (exists) {
            setTimeout(() => {
              response.writeHead(200, { 'Content-Type': 'application/json' });
              fs.createReadStream(filePath).pipe(response);
            }, 1500);
          } else {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('ERROR File does not exist');
          }
        });
      }
    }
  ]
});

/*
 * Extend Handlebars templates with custom helpers
 */

// Handlebars operators: reduceOp
// @see https://gist.github.com/servel333/21e1eedbd70db5a7cfff327526c72bc5
const reduceOp = function(args, reducer){
  args = Array.from(args);
  args.pop(); // => options
  let first = args.shift();
  return args.reduce(reducer, first);
};

const hbs = require('@frctl/handlebars')({
  helpers: {
    for(from, to, incr, block) {
      let accum = '';
      for (let i = from; i <= to; i += incr) {
        accum += block.fn(i);
      }
      return accum;
    },
    toJSON(obj) {
      return JSON.stringify(obj);
    },
    json(obj) {
      return JSON.stringify(obj);
    },

    times(n, block) {
      let acc = '';
      for(let i = 0; i < n; ++i) {
        block.data.index = i;
        block.data.first = i === 0;
        block.data.last = i === (n - 1);
        acc += block.fn(i);
      }
      return acc;
    },

    concat: (...args) => args.slice(0, -1).join(''),

    // Handlebars operators
    // @see https://gist.github.com/servel333/21e1eedbd70db5a7cfff327526c72bc5
    eq  : function(){ return reduceOp(arguments, (a,b) => a === b); },
    ne  : function(){ return reduceOp(arguments, (a,b) => a !== b); },
    lt  : function(){ return reduceOp(arguments, (a,b) => a  <  b); },
    gt  : function(){ return reduceOp(arguments, (a,b) => a  >  b); },
    lte : function(){ return reduceOp(arguments, (a,b) => a  <= b); },
    gte : function(){ return reduceOp(arguments, (a,b) => a  >= b); },
    and : function(){ return reduceOp(arguments, (a,b) => a  && b); },
    or  : function(){ return reduceOp(arguments, (a,b) => a  || b); },
  }
});

fractal.components.engine(hbs);

const logger = fractal.cli.console;

module.exports = (gulp) => {
  return () => {
    if (!buildMode) {
      const server = fractal.web.server({ sync: true });
      server.on('error', err => logger.error(err.message));
      return server.start().then(() => {
        logger.success(`Fractal server is now running at ${server.url} for project ${config.currentWebsite}`);
      });
    }
    const builder = fractal.web.builder();
    builder.on('error', err => logger.error(err.message));
    return builder.build().then(() => {
      logger.success(`Fractal static HTML build for project ${config.currentWebsite} complete!`);
    });
  };
};
