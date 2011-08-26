#!/bin/bash
#
# @file rms.sh
# @fileoverview: rms deploy script
# @author: 文河(wenhe@taobao.com)
# @usage: ./rms.sh 
# @version: 1.0
# @create: 2011年08月26日 16时13分27秒 CST

logFile=/tmp/rms.log
errFile=/tmp/rms.err.log
main=index.js

case $1 in

    start)
        forever start -l $logFile -e $errFile $main
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
        echo " Usage: (start|stop|status|restart)"
        ;;
esac
