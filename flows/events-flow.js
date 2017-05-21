var waterfall = require('async-waterfall');
var callNextTick = require('call-next-tick');
var request = require('basic-browser-request');
// var cloneDeep = require('lodash.clonedeep');
// var findWhere = require('lodash.findwhere');

function eventsFlow(cell, flowDone) {
  waterfall(
    [
      // getStoredEventsToFilterOut, // TODO
      getEvents,
      // reconcileWithStoredCalendarSelections,
      updateCell,
      // provisionRenderCall, // TODO
      passCell
    ],
    flowDone
  );

  function getEvents(done) {
    // TODO: queue up requests for events for all calendars.
    var reqOpts = {
      method: 'GET',
      url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events?' +
        // TODO: Use real start and end dates.
        'timeMin=' + '2017-05-17T00%3A00%3A00Z' + '&' +
        'singleEvents=true' + '&' +
        'key=' + cell.idToken + '&' +
        'fields=description%2Citems(description%2Cend%2FdateTime%2CendTimeUnspecified%2ChtmlLink%2Cid%2Corganizer%2Cstart%2FdateTime%2Csummary)%2Csummary',
      headers: {
        authorization: 'Bearer ' + cell.accessToken
      },
      json: true
    };
    request(reqOpts, done);
  }

  function updateCell(res, events, done) {
    cell.events = events;
    callNextTick(done);
  }

  function passCell(done) {
    callNextTick(done, null, cell);
  }
}

module.exports = eventsFlow;
