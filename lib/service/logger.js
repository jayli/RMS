// vim: set sw=2 ts=2:

/**
 * @fileoverview simple logger for service.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var logBase = require('../rmsConfig').logBase;

function logger(id) {
  this.id = id;
}

logger.prototype.set = function(key, value) {
  if (typeof key === 'object') {
    logger.save(this.id, _(logger.get(this.id)).extend(key));
  } else {
    var obj = logger.get(this.id);
    obj[key] = value;
    logger.save(this.id, obj);
  }
};

logger.save = function(id, obj) {
  fs.writeFileSync(path.join(logBase, id), JSON.stringify(obj));
};

logger.get = function(id) {
  try {
    return JSON.parse(fs.readFileSync(path.join(logBase, id)));
  } catch (ex) {
    return {};
  }
};

module.exports = logger;
