// vim: set sw=2 ts=2:

var compressor = require('../../lib/jobs/compressor');
var assert = require('assert');
exports.suite = {
  'compress javascript': {
    topic: function() {
      var str = '(function(kissy){})(KISSY)';
      var cps = new compressor({type: 'JavaScript'});
      cps.run(str, this.callback);
    },
    'should success': function(content) {
      assert.equal(22, content.length);
    }
  },
  'compress css': {
    topic: function() {
      var str = '#id{color:#ffffff}';
      var cps = new compressor({type: 'CSS'});
      cps.run(str, this.callback);
    },
    'should success': function(content) {
      assert.equal('#id{color:#fff}', content);
    }
  },
  'compress with chinese character': {
    topic: function() {
      var fs = require('fs');
      var str = fs.readFileSync(
          fs.realpathSync('./test/data/chinese.js')).toString();
      var cps = new compressor({type: 'JavaScript'});
      cps.run(str, this.callback);
    },
    'should success': function(content) {
      console.log(content);
      //assert.equal(22, content.length);
    }
  }
};
