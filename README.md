node-scrapy
===========

Simple, lightweight and expressive web scraping with Node.js

## Scraping made simple

```js
var scrapy = require('node-scrapy')
  , url = 'https://github.com/strongloop/express'
  , selector = '.repository-description'

scrapy.scrape(url, selector, function(err, data) {
    if (err) return console.error(err)
    console.log(data)
});

// 'Fast, unopinionated, minimalist web framework for node.'
```

Scrapy can resolve complex objects. Give it a data model:

```js
var scrapy = require('node-scrapy')
  , url = 'https://github.com/strongloop/express'
  , model =
    { author: '.author',
      repo: '.js-current-repository',
      stats:
       { commits: '.commits .num',
         branches: '.numbers-summary > li.commits + li .num',
         releases: '.numbers-summary > li.commits + li + li .num',
         contributors: '.numbers-summary > li.commits + li + li + li .num',
         social:
          { stars: '.star-button + .social-count',
            forks: '.fork-button + .social-count' } },
      files: '.js-directory-link' }

scrapy.scrape(url, selector, function(err, data) {
    if (err) return console.error(err)
    console.log(data)
});
```

Scrapy will return:

```js
{ author: 'strongloop',
  repo: 'express',
  stats:
   { commits: ' 4,925 ',
     branches: ' 12 ',
     releases: ' 223 ',
     contributors: ' 162 ',
     social: { stars: ' 16,132 ', forks: ' 3,340 ' } },
  files:
   [ 'benchmarks',
     'examples',
     'lib',
     'support',
     'test',
     '.gitignore',
     '.travis.yml',
     'Contributing.md',
     'History.md',
     'LICENSE',
     'Readme.md',
     'index.js',
     'package.json' ] }
```

## Install

```bash
npm install node-scrapy
```

## Features

__⚡ Lightweight:__ Scrapy relies only on [cheerio](https://www.npmjs.org/package/cheerio), [request](https://www.npmjs.org/package/request), and a [Lo-Dash custom build](https://lodash.com/custom-builds), all known for being fast.

__Expressive__: No XPaths. No complex object inheritance. No extensive config files. Just JSON and the CSS selector you're used to.

## Limitations

Scrapy wraps [cheerio](https://www.npmjs.org/package/cheerio) and [request](https://www.npmjs.org/package/request) to parse HTML files over the wire. Cheerio can't parse javascript nor Scrapy will, so with server-side rendered pages Scrapy may not behave as one would expect. You can always check this by visiting the page with your favorite browser and 

## API

So far, scrapy exposes only one method:

### .scrape( url, model, [options,] callback )

### url

### model

### options

#### options.itemOptions

#### options.cheerioOptions

#### options.requestOptions

### callback

## Contributing

## License

