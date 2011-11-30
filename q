[1mdiff --git a/lib/service/index.js b/lib/service/index.js[m
[1mindex 0505e3f..f37425b 100644[m
[1m--- a/lib/service/index.js[m
[1m+++ b/lib/service/index.js[m
[36m@@ -13,6 +13,7 @@[m [mvar workerDispatcher = require('./workerDispatcher');[m
 var rmsConfig = require('../rmsConfig');[m
 var rmsUtil = require('../rmsUtil');[m
 var logger = require('./logger');[m
[32m+[m[32mvar store = require('./store');[m
 [m
 require('../monitor/rmsMonitor').start(rmsConfig.monitor);[m
 [m
[36m@@ -68,44 +69,54 @@[m [mfunction startService() {[m
     if (!config.filelist)[m
       config.filelist = [{id: config.id, path: config.path}];[m
 [m
[31m-    try {[m
[32m+[m[32m      var functions = [];[m
[32m+[m
       _(config.filelist).each(function(file) {[m
[31m-        var cfg = _(config).extend(file);[m
[31m-        console.log(cfg);[m
[31m-        var wd = new workerDispatcher(params.content, cfg);[m
[31m-        var log = new logger(wd.id);[m
[31m-        log.set({[m
[31m-          id: wd.id,[m
[31m-          start: new Date,[m
[31m-          appname: wd.config.appname,[m
[31m-          code: 0[m
[32m+[m[32m        functions.push(function(callback) {[m
[32m+[m[32m          var cfg = _(config).extend(file);[m
[32m+[m[32m          delete cfg.filelist;[m
[32m+[m
[32m+[m[32m          var wd = new workerDispatcher(params.content, cfg);[m
[32m+[m
[32m+[m[32m          var log = new logger(wd.id);[m
[32m+[m[32m          log.set({[m
[32m+[m[32m            id: wd.id,[m
[32m+[m[32m            start: new Date,[m
[32m+[m[32m            appname: wd.config.appname,[m
[32m+[m[32m            code: 0[m
[32m+[m[32m          });[m
[32m+[m
[32m+[m[32m          wd.on('message', function(data) {[m
[32m+[m[32m            data.result = native2ascii(data.result);[m
[32m+[m[32m            log.set('code', 1);[m
[32m+[m[32m            callback(null, data)[m
[32m+[m[32m            return send(res, data);[m
[32m+[m[32m          });[m
[32m+[m
[32m+[m[32m          wd.dispatch();[m
         });[m
[31m-        wd.on('message', function(data) {[m
[31m-          data.result = native2ascii(data.result);[m
[31m-          log.set('code', 1);[m
[32m+[m[32m      });[m
[32m+[m
[32m+[m[32m      require('async').parallel(functions, function(err, data) {[m
[32m+[m[32m        if (err) {[m
[32m+[m[32m          if (!rmsConfig.producing) throw ex;[m
[32m+[m[32m          data.message = ex.message;[m
           return send(res, data);[m
[31m-        })[m
[31m-        wd.dispatch();[m
[32m+[m[32m        }[m
[32m+[m[32m        //console.log(data);[m
       });[m
[31m-    } catch (ex) {[m
[31m-      if (!rmsConfig.producing) throw ex;[m
[31m-      data.message = ex.message;[m
[31m-      return send(res, data);[m
[31m-    }[m
   });[m
 [m
   app.get('/status/:ids', function(req, res) {[m
     var ids = req.params.ids;[m
     if (!ids) return send(res, {});[m
[31m-    var obj = {}, len = 0;[m
[32m+[m[32m    var obj = {};[m
     ids = ids.split('|')[m
     ids.forEach(function(id) {[m
       if (id) {[m
         obj[id] = logger.get(id);[m
[31m-        len++;[m
       }[m
     });[m
[31m-    obj.length = len;[m
     return send(res, obj);[m
   });[m
 [m
