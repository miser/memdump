'use strict';

const MemDump = require('../lib');

let leakObject = null;
let count = 0;

setInterval(function testMemoryLeak() {
  const originLeakObject = leakObject;
  const unused = function() {
    if (originLeakObject) {
      console.log('originLeakObject');
    }
  };
  leakObject = {
    count: String(count++),
    leakStr: new Array(1e7).join('*'),
    leakMethod: function() {
      console.log('leakMessage');
    }
  };
  // originLeakObject = null
}, 1000);

const memDump = new MemDump({ type: 'test', maxSize: 3 });
memDump.start();
