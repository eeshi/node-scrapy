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