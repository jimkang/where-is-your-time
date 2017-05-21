var waterfall = require('async-waterfall');
var callNextTick = require('call-next-tick');

function Flowlocks(flows, flowsDone) {
  var cancelled = false;

  return {
    startFlow: startFlow,
    cancel: cancel
  };

  function startFlow(cell) {
    if (flows.length > 0) {
      waterfall([kickoff].concat(flows.slice(1).map(wrapFlow)), flowsDone);
    }
    else {
      callNextTick(flowsDone, new Error('No flows provided.'));
    }

    function kickoff(done) {
      wrapFlow(flows[0])(cell, done);
    }
  }

  function cancel() {
    cancelled = true;
  }

  function wrapFlow(flow) {
    return runFlow;

    function runFlow() {
      var flowArguments = Array.prototype.slice.call(arguments);

      if (cancelled) {
        flowsDone.apply(flowsDone, [null].concat(flowArguments.slice(0, -1)));
      }
      else {
        flow.apply(flow, flowArguments);
      }
    }
  }
}

module.exports = Flowlocks;
