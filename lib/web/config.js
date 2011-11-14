// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Web config.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

exports.url = 'http://rms.taobao.com';
exports.port = 7887;

exports.apptypes = {
  assets: 0,
  php: 1,
  image: 2
};

exports.apps = {
  assets: 'Assets',
  php: 'PHP',
  image: 'Image'
};

exports.database = {
  host: '10.249.196.130',
  port: '3306',
  database: 'rms',
  user: 'rms',
  password: 'rms'
};

// 文本类型的后缀
exports.txtExts = [
  'txt',
  'php', 'java', 'cs', 'py', 'rb', 'css', 'js', 'sh', 'bat',
  'xml', 'html', 'properties', 'md', 'markdown'
];

exports.imgExts = [
  'jpg', 'jpeg', 'png', 'gif', 'bmp'
];

exports.actions = {
  show: true,
  raw: true
};
