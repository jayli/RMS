// vim: set sw=2 ts=2:

/**
 * @fileoverview rms client.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var util = require('util');
var rest = require('restler');
var rmsConfig = require('../rmsConfig');
var _ = require('underscore');

function rmsClient(content, type, steps) {
  var self = this;
  self.content = content || '';
  self.type = type || '';

  self._steps = typeof steps === 'array' ? steps : [];
  self.__defineGetter__('steps', function() {
    return uniqSteps(self._steps);
  });
}
util.inherits(rmsClient, process.EventEmitter);

rmsClient.prototype.request = function() {
  var self = this;
  rest.post('http://127.0.0.1:' + rmsConfig.api.port + '/precompile', {data: {
    content: self.content,
    config: JSON.stringify({
      type: self.type,
      steps: self.steps
    })
  }})
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
