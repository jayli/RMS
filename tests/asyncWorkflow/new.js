// vim: set sw=2 ts=2:

var aw = require('../../lib/asyncWorkflow');

var wf = new aw('hello,world!', {
    type: 'string',
    steps: [
        ['nativeascii', {}],
        ['syntaxChecker', {}]
    ]
});

wf.start();

var wf2 = new aw('just test!', {
    type: 'string',
    steps: [
        ['syntaxChecker', {}]
    ]
});

wf2.start();
