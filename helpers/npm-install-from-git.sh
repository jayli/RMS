#!/bin/bash
#
# @file npm-install-from-git.sh
# @fileoverview: install package from a git path.
# @author: yyfrankyy<yyfrankyy@gmail.com>
# @usage: ./npm-install-from-git.sh 
# @version: 1.0
# @create: 08/16/2011 03:21:44 PM CST

cd /tmp
module=`echo $1 | sed -e "s/.*\/\([^\/]*\)\.git$/\1/"`
git clone $1
cd $module
git archive --format=tar --prefix=$module/ HEAD | gzip > /tmp/$module.tgz
#npm install /tmp/$module.tgz
#rm -rf /tmp/$module*
