// vim: set sw=2 ts=2:

var compressor = require('../../lib/jobs/compressor');
var assert = require('assert');
var rmsUtil = require('../../lib/rmsUtil');
exports.suite = {
  'compress javascript': {
    topic: function() {
      var str = '(function(kissy){})(KISSY)';
      var cps = new compressor({type: 'JavaScript'});
      cps.run(str, this.callback);
    },
    'should success': function(content) {
      assert.equal('(function(a){})(KISSY);', content);
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
      var str = fs.readFileSync(fs.realpathSync('./test/data/chinese.js'));
      str = rmsUtil.gbk2utf8(str).toString();
      var cps = new compressor({type: 'JavaScript'});
      cps.run(str, this.callback);
    },
    'should success': function(content) {
      assert.equal('var str="中文";', content);
    }
  }
};
