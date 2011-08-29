#!/bin/bash
#
# @file rms.sh
# @fileoverview: rms deploy script
# @author: 文河(wenhe@taobao.com)
# @usage: ./rms.sh 
# @version: 1.0
# @create: 2011年08月26日 16时13分27秒 CST

rm -rf /tmp/rms.*

logFile=/tmp/rms.log
errFile=/tmp/rms.err.log
main=index.js

case $1 in
    init)
        npm install nativeUtil v8-profiler
        ;;

    start)
        forever start $main #-l $logFile -e $errFile $main
        ;;

    stop)
        forever stop $main
        ;;

    status)
        forever list
        ;;

    restart)
        forever restart $main
        ;;

    *)
        echo "Usage: ./rms.sh (init|start|stop|status|restart)"
        ;;
esac