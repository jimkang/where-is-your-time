var test = require('tape');
var bucketEvents = require('../bucket-events');
var exampleEvents = require('./fixtures/example-events.json');
var exampleSlotBuckets = require('./fixtures/example-slot-buckets.json');

var testCases = [
  {
    events: exampleEvents,
    expected: exampleSlotBuckets
  }
];

testCases.forEach(runTest);

function runTest(testCase) {
  test('Put events into 15-minute buckets', testBucketing);

  function testBucketing(t) {
    var buckets = bucketEvents(testCase.events.summary, testCase.events.items, {});
    // console.log(JSON.stringify(buckets, null, 2));
    t.deepEqual(buckets, testCase.expected, 'Buckets are correct.');
    t.end();
  }
}
