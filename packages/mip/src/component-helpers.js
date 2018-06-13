/**
 * @file polyfill for custom component
 * @author mj(zoumiaojiang@gmail.com)
 */

const requires = require.context('babel-runtime/helpers', true, /\.js$/)
const regenerator = require('babel-runtime/regenerator')

const cssBase = require('css-loader/lib/css-base')
const componentNormalizer = require('vue-loader/lib/runtime/componentNormalizer')
const addStylesClient = require('vue-style-loader/lib/addStylesClient')
const listToStyles = require('vue-style-loader/lib/listToStyles')

const promise = require('babel-runtime/core-js/promise').default
const symbol = require('babel-runtime/core-js/symbol').default
const arrayFrom = require('babel-runtime/core-js/array/from').default
const objectAssign = require('babel-runtime/core-js/object/assign').default

function mount (obj, name, host = window) {
  if (typeof host[name] === 'undefined') {
    host[name] = obj
    // Object.defineProperty(host, name, {
    //   value: obj,
    //   enumerable: true
    // })
  }
}

mount(promise, 'Promise')
mount(symbol, 'Symbol')
mount(arrayFrom, 'from', Array)
mount(objectAssign, 'assign', Object)

let helpers = {}

requires.keys().forEach(filename => {
  helpers[`babel-runtime/helpers/${filename.slice(2, -3)}`] = requires(filename)
})

helpers['babel-runtime/regenerator'] = regenerator

helpers['css-loader/lib/css-base'] = cssBase
helpers['vue-loader/lib/runtime/componentNormalizer'] = componentNormalizer
helpers['vue-style-loader/lib/addStylesClient'] = addStylesClient
helpers['vue-style-loader/lib/listToStyles'] = listToStyles

export default helpers
