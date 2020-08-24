const fs = require('fs')
const path = require('path')

module.exports = {
  getFixtureSet,
}

function getFixtureSet(dirName, fileName) {
  const testName = path.basename(fileName, '.test.js')

  return {
    source: fs.readFileSync(path.join(dirName, `${testName}.source.html`), 'utf8'),
    model: require(path.join(dirName, `${testName}.model`)),
    expected: require(path.join(dirName, `${testName}.result`)),
  }
}
