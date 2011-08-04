// vim: set sw=2 ts=2:

var aw = require('../../lib/asyncWorkflow');

var wf = new aw('中文', {
    type: 'string',
    steps: [
        ['nativeascii', {}],
        ['syntaxChecker', {}]
    ]
});

wf.start();
