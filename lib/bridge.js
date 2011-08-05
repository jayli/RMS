// vim: set sw=2 ts=2:

/**
 * @fileoverview Worker-AsyncWorkflow-Bridge.
 * @author yyfrankyy<yyfrankyy@gmail.com>
 */

var aw = require('./asyncWorkflow');
var sys = require('sys');

var bridge = module.exports = {

  onmessage: function(e) {
    var wf = new aw(e.content, e.config);
    wf.on('start', function() {
      console.log('worker started');
    });
    wf.on('complete', function(e) {
      postMessage({
        result: e.result,
        success: e.success
      });
    });
    wf.start();
  },

  onerror: function() {
    sys.debug('Worker is unexpected terminated.');
  }

};
