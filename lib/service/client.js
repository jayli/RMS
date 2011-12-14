// vim: set sw=2 ts=2:

/**
 * @fileoverview rms client.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var util = require('util');
var rest = require('restler');
var _ = require('underscore');
var rmsConfig = require('../rmsConfig');
var rmsUtil = require('../rmsUtil');

function rmsClient(content, config) {
  var self = this;
  self.content = content || '';

  self.config = _(config).defaults({
    async: false
  });

  self._steps = [];
  self.__defineGetter__('steps', function() {
    return uniqSteps(self._steps);
  });
}
util.inherits(rmsClient, process.EventEmitter);

rmsClient.prototype.request = function() {
  var self = this;
  rest.post('http://' + rmsConfig.api.host + ':' + rmsConfig.api.port +
      '/precompile', {
    data: {
      content: self.content,
      config: JSON.stringify(_(self.config).extend({steps: self.steps}))
    }
  })
  .on('error', function(data, err) {
    self.emit('error', err);
  })
  .on('complete', function(data, res) {
    if (res.statusCode === 200) {
      self.emit('response', data)
    } else {
      self.emit('error', {statusCode: res.statusCode});
    }
  });
};

rmsClient.prototype.addStep = function(type, config) {
  this._steps.push([type, config || {}]);
};

function uniqSteps(steps) {
  var stepsKeys = {};
  var arr = [];
  _(steps).each(function(step, index) {
    if (!(step[0] in stepsKeys)) {
      arr.push(step);
      stepsKeys[step[0]] = arr.indexOf(step);
    } else {
      arr[stepsKeys[step[0]]] = step;
    }
  });
  return arr;
};

module.exports = rmsClient;
