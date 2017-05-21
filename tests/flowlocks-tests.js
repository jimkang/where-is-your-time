var test = require('tape');
var Flowlocks = require('../flowlocks');
var callNextTick = require('call-next-tick');
var assertNoError = require('assert-no-error');

test('Normal flow chain test', normalFlowChainTest);
test('Flow chain cancellation test', cancellationTest);
test('Flow chain error test', errorTest);

function normalFlowChainTest(t) {
  var flowlocks = Flowlocks([flow1, flow2, flow3], checkFlowEnd);

  var simpleTestCell = {
    name: 'simple',
    value: 1
  };

  flowlocks.startFlows(simpleTestCell);

  function flow1(cell, done) {
    t.pass('flow1 was called.');
    cell.value += 1;
    callNextTick(done, null, cell);
  }

  function flow2(cell, done) {
    t.pass('flow2was called.');
    t.equal(cell.value, 2, 'Cell was updated by flow1');
    cell.value += 2;
    callNextTick(done, null, cell);
  }

  function flow3(cell, done) {
    t.pass('flow3 was called.');
    t.equal(cell.value, 4, 'Cell was updated by flow2');
    cell.value += cell.value;
    callNextTick(done, null, cell);
  }

  function checkFlowEnd(error, cell) {
    t.equal(cell.value, 8, 'Final cell value is correct.');
    assertNoError(t.ok, error, 'No error from flows.');
    t.end();
  }
}

function cancellationTest(t) {
  var flowlocks = Flowlocks([flow1, flow2, flow3], checkFlowEnd);

  var simpleTestCell = {
    name: 'simple',
    value: 1
  };

  flowlocks.startFlows(simpleTestCell);

  function flow1(cell, done) {
    t.pass('flow1 was called.');
    cell.value += 1;
    callNextTick(done, null, cell);
  }

  function flow2(cell, done) {
    t.pass('flow2was called.');
    t.equal(cell.value, 2, 'Cell was updated by flow1');
    flowlocks.cancel();
    callNextTick(done, null, cell);
  }

  function flow3(cell, done) {
    t.fail('flow3 was not called.');
    callNextTick(done, null, cell);
  }

  function checkFlowEnd(error, cell) {
    assertNoError(t.ok, error, 'No error from flows.');
    t.equal(cell.value, 2, 'Final cell value is correct.');
    t.end();
  }

}

function errorTest(t) {
  var flowlocks = Flowlocks([flow1, flow2, flow3], checkFlowEnd);

  var simpleTestCell = {
    name: 'simple',
    value: 1
  };

  flowlocks.startFlows(simpleTestCell);

  function flow1(cell, done) {
    t.pass('flow1 was called.');
    cell.value += 1;
    callNextTick(done, null, cell);
  }

  function flow2(cell, done) {
    t.pass('flow2was called.');
    t.equal(cell.value, 2, 'Cell was updated by flow1');
    callNextTick(done, new Error('Oh no'));
  }

  function flow3(cell, done) {
    t.fail('flow3 was not called.');
    callNextTick(done, null, cell);
  }

  function checkFlowEnd(error) {
    t.ok(error, 'An error was passed to the flow callback.');
    t.equal(error.message, 'Oh no', 'The error message is the one set by flow2.');
    t.end();
  }
}
