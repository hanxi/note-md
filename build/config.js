'use strict'
const pkg = require('../package')

module.exports = {
  port: 8080,
  title: '个人笔记 note-md',
  // when you use electron please set to relative path like ./
  // otherwise only set to absolute path when you're using history mode
  publicPath: '/',
  // add these dependencies to a standalone vendor bundle
  vendor: [
    'vue',
    'vuex',
    'promise-polyfill'
  ],
  // disable babelrc by default
  babel: {
    babelrc: false,
    presets: [
      ['es2015', {modules: false}],
      'stage-1'
    ],
    // support jsx in render function
    plugins: [
      'transform-vue-jsx',
      'transform-runtime'
    ]
  },
  postcss: [
    // add prefix via postcss since it's faster
    require('autoprefixer')({
      // Vue does not support ie 8 and below
      browsers: ['last 2 versions', 'ie > 8']
    }),
    require('postcss-nested')
  ],
  cssModules: false,
  proxyTable: {
      '/api/*' : 'http://localhost:3000'
  }
}
