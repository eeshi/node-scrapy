import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'

export default {
  external: [
    // We don't use the domutils adapter on the browser, but it is imported by css-select even tho
    // it is never used because we provide an alternative adapter (css-select-browser-adapter).
    // domutils includes a massive list of markup entities, thus we strip it out of the browser
    // build to prevent huge file sizes.
    'domutils',
  ],
  output: {
    name: 'scrapy',
    globals: {
      domutils: 'DomUtils',
    },
  },
  plugins: [
    resolve(),
    commonjs(),
    json(),
    babel({
      babelHelpers: 'bundled',
    }),
  ],
}
