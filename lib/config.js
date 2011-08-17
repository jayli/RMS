// vim: set sw=2 ts=2:

/**
 * @fileoverview Config of RMS.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var config = module.exports = {

  title: 'Resource Management System',
  name: 'Async Workflow',

  // Enabled jobs w/ default configs.
  jobs: {
    nativeascii: {},
    compressor: {},
    syntaxChecker: {},
    typeChecker: {}
  },

  api: {
    endpoint: 'http://trade.ued.taobao.net:8080',
    port: 8080,
    version: '0.0.4'
  },

  debug: true,

  maxWorker: 5

};
