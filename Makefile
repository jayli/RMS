#!/usr/bin/make -f
# basic params {{{
# build an node native extension
WAF = node-waf configure && node-waf clean && node-waf build
# cd and compile from native dir.
COMPILE = $(silent $(shell cd node_modules/$1/ && $(WAF)))
# get value from package.json by giving key
PACKAGE = $(shell cat package.json | grep $1 | sed -e 's/  "$1": "\([^"]*\)",/\1/')
# get version and main file path
VERSION = $(call PACKAGE,version)
MAIN = $(call PACKAGE,main)
LOG = $(shell make status | grep data | sed -e "1 d" | awk '{print $$8}' | cut -c "6-34")
# }}}
# commands {{{
# default command, clean, and compile all
all: clean compile-all
# clean up all build dirs {{{
clean:
	rm -rf node_modules/{nativeUtil,v8-profiler,iconv}/build/
# }}}
# compilers for native extensions {{{
compile-all: nativeUtil v8-profiler iconv
nativeUtil:
	$(call COMPILE,nativeUtil)
v8-profiler:
	$(call COMPILE,v8-profiler)
iconv:
	$(call COMPILE,iconv)
# }}}
# controller for application {{{
start:
	forever start ${MAIN}
stop:
	forever stop ${MAIN}
restart:
	forever restart ${MAIN}
status:
	forever list ${MAIN}
viewlog:
	tail -f ${LOG}
# }}}
# shortcut for git tag {{{
tag:
	git tag ${VERSION}
# }}}
# deploy commmand {{{
deploy:
	# not impl yet
# }}}
# }}}
