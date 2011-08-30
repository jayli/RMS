#!/usr/bin/make -f

WAF = node-waf configure; node-waf clean; node-waf build
COMPILE = cd node_modules/$1/; $(WAF)
INDEX = lib/rms.js
TAG = `cat package.json | grep version | sed -e 's/  "version": "\([^"]*\)",/\1/'`

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
	forever start ${INDEX}
stop:
	forever stop ${INDEX}
restart:
	forever restart ${INDEX}
status:
	forever list ${INDEX}
# }}}
# shortcut for git tag {{{
tag:
	git tag ${TAG}
# }}}
# deploy commmand {{{
deploy:
	# not impl yet
# }}}
