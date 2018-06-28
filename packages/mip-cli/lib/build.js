/**
 * @file build.js
 * @author clark-t (clarktanglei@163.com)
 */

const Builder = require('./builder')
const fs = require('fs-extra')
const path = require('path')
const cli = require('./cli')
const CWD = process.cwd()

module.exports = async function ({
  dir = CWD,
  output = 'dist',
  clean,
  asset = '/',
  ignore
} = {}) {
  output = path.resolve(CWD, output)
  dir = path.resolve(CWD, dir)

  const builder = new Builder({
    dir,
    output,
    dev: false,
    asset,
    ignore
  })

  try {
    if (clean) {
      await fs.remove(output)
    }
    await builder.build()
    // let mipComponentWebpackHelperFilePath = path.resolve(__dirname, '../node_modules/mip-components-webpack-helpers/dist/mip-components-webpack-helpers.js')
    // let targetFilePath = path.resolve(output, 'mip-components-webpack-helpers.js')
    // if (fs.existsSync(targetFilePath)) {
    //   fs.removeSync(targetFilePath)
    // }
    // fs.copySync(mipComponentWebpackHelperFilePath, targetFilePath)
    cli.info('编译成功！')
  } catch (e) {
    cli.error('编译失败')
    if (Array.isArray(e)) {
      e.forEach(err => {
        cli.error(err)
        cli.info(' ')
      })
    } else {
      cli.error(e)
    }

    throw e
  }
}
