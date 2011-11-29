// vim: set sw=2 ts=2:

/**
 * @fileoverview simple logger for service.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var fs = require('fs');
var path = require('path');
var rmsUtil = require('../rmsUtil');
var rmsConfig = require('../rmsConfig');
var logBase = rmsConfig.logBase;
var _ = require('underscore');

function logger(id) {
  this.id = id;
}

logger.prototype.set = function(key, value) {
  if (typeof key === 'object') {
    Log.save(this.id, _(Log.get(this.id)).extend(key));
  } else {
    var obj = Log.get(this.id);
    obj[key] = value;
    Log.save(this.id, obj);
  }
};

console.log(logBase);
var Log = {
  save: function(id, obj) {
    fs.writeFileSync(path.join(logBase, id), JSON.stringify(obj));
  },
  get: function(id) {
    try {
      return JSON.parse(fs.readFileSync(path.join(logBase, id)));
    } catch (ex) {
      return {};
    }
  }
};

module.exports = _(logger).extend(Log);
