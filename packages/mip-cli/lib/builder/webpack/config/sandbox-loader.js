/**
 * @file sandbox-loader
 * @author clark-t (clarktanglei@163.com)
 */

const generate = require('mip-sandbox/lib/generate')
const detect = require('mip-sandbox/lib/unsafe-detect')
const mark = require('mip-sandbox/lib/global-mark')
const keywords = require('mip-sandbox/lib/keywords')
const path = require('path')
const sourceMap = require('../../../utils/source-map')
const cli = require('../../../cli')

module.exports = async function (source, map, meta) {
  this.cacheable = true
  let callback = this.async()

  try {
    let ast = mark(source)
    let list = detect(ast, keywords.WHITELIST)

    if (list.length) {
      let warnings = list.map(item => `[sandbox] ${item.name} (${item.loc.start.line}:${item.loc.start.column}, ${item.loc.end.line}:${item.loc.end.column})`).join('\n')
      cli.error('[sandbox] 以下对象将被注入 MIP.sandbox 前缀，可能会导致程序运行出错：')
      cli.error('\n' + warnings)
    }

    let output = generate(ast, keywords.WHITELIST_RESERVED, {
      escodegen: {
        sourceMapWithCode: true,
        sourceMap: path.basename(this.resourcePath),
        sourceMapRoot: path.relative(this.rootContext, this.context),
        sourceContent: source
      }
    })

    let newMap = JSON.parse(output.map.toString())
    let outputMap

    if (map) {
      outputMap = await sourceMap.merge(newMap, map)
    } else {
      outputMap = newMap
    }

    callback(null, output.code, outputMap)
  } catch (e) {
    callback(e)
  }
}
