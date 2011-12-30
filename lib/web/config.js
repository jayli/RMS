// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Web config.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

var producing = require('../rmsConfig').producing;

exports.url = producing ? 'http://rms.taobao.com' : 'http://feops.taobao.com';
exports.port = producing ? 7887 : 7889;

exports.apptypes = {
  assets: 0
//, php: 1
//, image: 2
};

exports.apps = {
  assets: 'Assets'
//, php: 'PHP'
//, image: 'Image'
};

exports.database = {
  host: producing ? '172.19.70.82' : '10.249.196.130',
  port: '3306',
  database: 'rms',
  user: producing ? 'rms_1' : 'rms',
  password: producing ? 'rms_1%mysql' : 'rms'
};

exports.actions = {
  show: true
, publog: true
, publish: true
, confirm: true
};

exports.pubtypes = {
  pre: { type: 4, text: '预发布' }
, beta: { type: 7, text: 'Beta发布' }
, formal: { type: 1, text: '正式发布' }
};

exports.statuses = [
  '开始启动预处理任务'
, '预处理完成'
, '写入磁盘，推送PUB100'
, '推送CDN'
, '发布完成'
];

exports.pagination = {
  itemPerPage: 10
, pageNumAtOneTime: 10
};

exports.noNeed2Auth = [
  /^\/status\.taobao/
];
