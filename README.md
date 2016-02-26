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

scrapy.scrape(url, model, function(err, data) {
    if (err) return console.error(err)
    console.log(data)
});
```

...and Scrapy will return:

```js
{ author: 'strongloop',
  repo: 'express',
  stats:
   { commits: '4,925',
     branches: '12',
     releases: '223',
     contributors: '162',
     social: { stars: '16,132', forks: '3,340' } },
  files:
   [ 'benchmarks', 'examples', 'lib', 'support', 'test', '.gitignore','.travis.yml', 'Contributing.md', 'History.md', 'LICENSE', 'Readme.md', 'index.js', 'package.json' ] }
```

## Install

```bash
npm install node-scrapy
```

## Features
🍠 __Simple__: No XPaths. No complex object inheritance. No extensive config files. Just JSON and the CSS selectors you're used to. Simple as [potatoes](http://youtu.be/efMHLkyb7ho).

⚡ __Lightweight:__ Scrapy relies only on [cheerio](https://www.npmjs.org/package/cheerio), [request](https://www.npmjs.org/package/request), and a [Lo-Dash custom build](https://lodash.com/custom-builds), all known for being fast.

📢 __Expressive:__ It's easy to talk to Scrapy. It will assume a lot of handy defaults to get what you actually meant to get. If Scrapy misunderstands, you can try to express yourself better using its [options](#optionsitemoptions).


## Limitations

Scrapy wraps [cheerio](https://www.npmjs.org/package/cheerio) and [request](https://www.npmjs.org/package/request) to parse HTML files over the wire. Cheerio can't parse javascript and neither will Scrapy, so with client-side-rendered pages Scrapy may not behave as one would expect. You can always check this visiting the page with your favorite browser and disabling javascript.

If the page you're trying to scrape is client-side-rendered, you still can change the HTTP user-agent to let the server know it is a machine and, if lucky, the server will return a non-AJAX version of the page. You may check [this list of bots' user-agents](http://user-agent-string.info/list-of-ua/bots) and configure Scrapy through its [request options](#optionsrequestoptions) to present itself as a bot.

## API

So far, Scrapy exposes only one method:

### .scrape( url, model, [options,] callback )

### url

A `string` representing a valid URL of the resource to scrape.

### model

It can be either a `string` with the [CSS selector](#selector) of the element(s) to retrieve:

```js
var url = 'https://www.npmjs.org/package/mocha'
  , model = '.package-description'

scrapy.scrape(url, model, console.log)

// null 'simple, flexible, fun test framework'
// ^ no error passed to console.log
```

or an `object` whose enumerable properties hold [CSS selectors](#selector):

```js
var url = 'https://www.npmjs.org/package/mocha'  
  , model = { description: '.package-description', keywords: 'h3:contains(Keywords) + p a' }

scrapy.scrape(url, model, console.log)

/*
  { description: 'simple, flexible, fun test framework',
    keywords: 
     [ 'mocha',
       'test',
       'bdd',
       'tdd',
       'tap' ] }
*/
```

or nested objects with embeded [options](#optionsitemoptions) for each item, in which case the `selector` key holding a [CSS selector](#selector) is a must:

```js
var url = 'https://www.npmjs.org/package/mocha'
  , model = { description: { selector: '.package-description', required: true },
              maintainers: 
              { selector: '.humans li a',
                get: 'href',
                prefix: 'https://www.npmjs.org' } }

scrapy.scrape(url, model, console.log)

/*
  { description: 'simple, flexible, fun test framework',
    maintainers: 
     [ 'https://www.npmjs.org/~travisjeffery',
       'https://www.npmjs.org/~tjholowaychuk',
       'https://www.npmjs.org/~travisjeffery',
       'https://www.npmjs.org/~jbnicolai',
       'https://www.npmjs.org/~boneskull' ] }
*/
```

### options

This is an optional `Object`. It lets you set request's options, cheerio's load options, and/or your own default options for every item passed into the `model`.

You can always look at Scrapy's defaults into the [defaults.json](./defaults.json) file.

#### options.itemOptions

_Important:_ the following options can be set in a per-item basis inside the `model`. Setting these options into `options.itemOptions` will simply overwrite the defaults used for the current `.scrape()` call.

##### selector

A `string` representing a CSS selector. It must be compliant with [CSSselector's supported selectors](https://github.com/fb55/CSSselect#supported-selectors).

##### get

Part of the selected element(s) to retrieve.

`'text'`: the DOM equivalent of [`Node.textContent`](https://developer.mozilla.org/en-US/docs/Web/API/Node.textContent).

`'{attribute}'`: gets the value of the given `attribute`. e.g. `'src'`, '`href`', `'disabled'`, etc.

Default: `'text'`

##### required

`false`: nothing happens.

`true`: Scrapy will stop and call back with an `Error` as first argument if no element in the page matches the `selector`. `err.bodyString` holds the entire HTTP response body for debugging purposes.

Default: `false`

##### unique

_Heads up!_ - if no single element matched the `selector`, the result will always be `null`; except when [`required`](#required) is set to `true`, in which case calls back with an `Error`.

`'auto'`: if a single element matched the `selector`, a `string` will be returned with its result. If many elements matched the selector, will return an `Array` of strings holding the result of each element.

`true`: will return a single `string`, no matter if many elements matched the `selector`. Only the first one will be taken.

`false`: even if a single element matched the `selector`, it will be returned boxed into an `Array`.

Default: `'auto'`

##### trim

Trims the result, before any other tramsformation, like `prefix`/`suffix`.

`false`: will not trim.

`'left'`: trim left.

`'right'`: trim right.

`true`: will trim both sides.

Default: `true`

##### transform

A `function` applied after all other operations and transformations.

Default: `function() { return this.toString(); }`

##### prefix

A `string` to be prefixed to the result(s). Useful to transform relative URLs into absolute ones.

Default: `''` (empty string)

##### suffix

A `string` to be appended to the result(s).

Default: `''` (empty string)

#### options.cheerioOptions

These options are passed to cheerio on load. You can check all available options in [htmlparser2's wiki](https://github.com/fb55/htmlparser2/wiki/Parser-options) (in which cheerio relies).

Scrapy's default `cheerioOptions` are the following:

```json
{
  "normalizeWhitespace": true,
  "xmlMode": false,
  "lowerCaseTags": false
}
```

As a reminder: you can always look at Scrapy's defaults into the [defaults.json](./defaults.json) file.

#### options.requestOptions

These options are passed directly to request's options.

Some useful options include: `encoding: 'binary'` for old sites without character encoding declaration (try it if you're getting strange chars), authorization options (HTTP, Oauth, etc), proxies, SSL, cookies, among others.

### callback

A callback `Function` that follows the NodeJS error-first callback convention.

```js
function(err, data) {
    if (err) return console.error(err) // Handle error
    console.log(data) // Do something with data
}
```

## Alternatives

Here some alternative nodejs-based solutions similar to node-scrapy (in popularity order):

* [node-crawler](https://github.com/sylvinus/node-crawler)
* [node-scraper](https://github.com/mape/node-scraper)
* [skim](https://github.com/tcr/skim)
* [wscraper](https://github.com/kalise/wscraper)
* [html-scrapper](https://github.com/harish2704/html-scrapper)
* [scrapy](https://github.com/orkz/scrapy)

## Contributing

Scrapy is in an early stage, we would love you to involve in its development! Go ahead and open a [new issue](https://github.com/eeshi/node-scrapy/issues).

## License

 __❤__ [MIT](./LICENSE)

