var rmsNativeUtil = require('RMSNativeUtil/default/rmsNativeUtil');
var t = +new Date;
rmsNativeUtil.forceGC();
console.log(+new Date - t);
