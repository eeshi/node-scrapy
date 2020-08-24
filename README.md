# node-scrapy

Simple, lightweight and expressive web scraping with Node.js

## Scraping made simple

```javascript
const scrapy = require('node-scrapy')
const fetch = require('node-fetch')

const url = 'https://github.com/expressjs/express'
const model = '.mb-3.h4 + .f4.mt-3'

fetch(url)
  .then((res) => res.text())
  .then((body) => {
    console.log(scrapy.extract(body, model))
  })
  .catch(console.error)

// Fast, unopinionated, minimalist web framework for node.
```

node-scrapy can resolve complex objects. Give it a data model:

```javascript
const fetch = require('node-fetch')

const url = 'https://github.com/strongloop/express'
const model = {
  author: '.author ($ | trim)',
  repo: '[itemprop="name"] ($ | trim)',
  stats: {
    commits: '.js-details-container > div:last-child strong',
    branches: '.octicon-git-branch + strong',
    releases: 'a[href$="/releases"] > span',
    contributors: 'a[href$="/graphs/contributors"] > span',
    social: {
      watch: '.pagehead-actions > li:nth-child(1) .social-count ($ | trim)',
      stars: '.pagehead-actions > li:nth-child(2) .social-count ($ | trim)',
      forks: '.pagehead-actions > li:nth-child(3) .social-count ($ | trim)',
    },
  },
  files: [
    '.js-active-navigation-container .Box-row > :nth-child(2)',
    {
      name: 'a',
      url: 'a (href)',
    },
  ],
}

fetch(url)
  .then((res) => res.text())
  .then((body) => {
    console.log(scrapy.extract(body, model))
  })
  .catch(console.error)

```

...and Scrapy will return:

```javascript
{
  author: 'expressjs',
  repo: 'express',
  stats: {
    commits: '5,592',
    branches: '9',
    releases: '280',
    contributors: '261',
    social: { watch: '1.8k', stars: '49.8k', forks: '8.3k' }
  },
  files: [
    { name: 'benchmarks', url: '/expressjs/express/tree/master/benchmarks' },
    { name: 'examples', url: '/expressjs/express/tree/master/examples' },
    { name: 'lib', url: '/expressjs/express/tree/master/lib' },
    { name: 'test', url: '/expressjs/express/tree/master/test' },
    { name: '.editorconfig', url: '/expressjs/express/blob/master/.editorconfig' },
    { name: '.eslintignore', url: '/expressjs/express/blob/master/.eslintignore' },
    { name: '.eslintrc.yml', url: '/expressjs/express/blob/master/.eslintrc.yml' },
    { name: '.gitignore', url: '/expressjs/express/blob/master/.gitignore' },
    { name: '.travis.yml', url: '/expressjs/express/blob/master/.travis.yml' },
    { name: 'Charter.md', url: '/expressjs/express/blob/master/Charter.md' },
    { name: 'Code-Of-Conduct.md', url: '/expressjs/express/blob/master/Code-Of-Conduct.md' },
    { name: 'Collaborator-Guide.md', url: '/expressjs/express/blob/master/Collaborator-Guide.md' },
    { name: 'Contributing.md', url: '/expressjs/express/blob/master/Contributing.md' },
    { name: 'History.md', url: '/expressjs/express/blob/master/History.md' },
    { name: 'LICENSE', url: '/expressjs/express/blob/master/LICENSE' },
    { name: 'Readme-Guide.md', url: '/expressjs/express/blob/master/Readme-Guide.md' },
    { name: 'Readme.md', url: '/expressjs/express/blob/master/Readme.md' },
    { name: 'Release-Process.md', url: '/expressjs/express/blob/master/Release-Process.md' },
    { name: 'Security.md', url: '/expressjs/express/blob/master/Security.md' },
    { name: 'Triager-Guide.md', url: '/expressjs/express/blob/master/Triager-Guide.md' },
    { name: 'appveyor.yml', url: '/expressjs/express/blob/master/appveyor.yml' },
    { name: 'index.js', url: '/expressjs/express/blob/master/index.js' },
    { name: 'package.json', url: '/expressjs/express/blob/master/package.json' }
  ]
}

```

For more examples, check the [test folder](./test).

## Install

```shell
npm install node-scrapy
```

## Features

🍠 **Simple**: No XPaths. No complex object inheritance. No extensive config files. Just JSON and the CSS selectors you're used to. Simple as [potatoes](https://youtu.be/efMHLkyb7ho).

⚡ **Lightweight:** node-scrapy relies on [htmlparser2](https://www.npmjs.org/package/htmlparser2) and [css-select](https://www.npmjs.org/package/css-select), known for [being fast](https://travis-ci.org/AndreasMadsen/htmlparser-benchmark/builds/10805007).

📢 **Expressive:** Web scrapping is all about data, so node-scrapy aims to make it declarative. Both, the model and its corresponding output are JSON-serializable.

## Alternatives

Here some alternative nodejs-based solutions similar to node-scrapy (in popularity order):

- [node-crawler](https://github.com/sylvinus/node-crawler)
- [node-scraper](https://github.com/mape/node-scraper)
- [skim](https://github.com/tcr/skim)
- [wscraper](https://github.com/kalise/wscraper)
- [html-scrapper](https://github.com/harish2704/html-scrapper)
- [scrapy](https://github.com/orkz/scrapy)

## Contributing

node-scrapy is in an early stage, we would love you to involve in its development! Go ahead and open a [new issue](https://github.com/eeshi/node-scrapy/issues).

## License

[MIT](./LICENSE) **❤**
