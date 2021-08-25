const sourceMap = require('source-map')
const SourceMapConsumer = sourceMap.SourceMapConsumer
const Stacktracey = require('stacktracey')

const sourceMapFileContent = require('./app.a6e9bb6d.js.map') // sourcemap文件内容

async function run() {
  const sourceMapContent = sourceMapFileContent
  const consumer = await new SourceMapConsumer(sourceMapContent)

  const originalPosition = consumer.originalPositionFor({
    line: 1,
    column: 94166
  })

  const sourceContent = consumer.sourceContentFor(originalPosition.source)
  console.log(sourceContent.split('\n')[originalPosition.line - 1])
}

run()
