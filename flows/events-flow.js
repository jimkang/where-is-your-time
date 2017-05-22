var waterfall = require('async-waterfall');
var callNextTick = require('call-next-tick');
var request = require('basic-browser-request');
// var cloneDeep = require('lodash.clonedeep');
// var findWhere = require('lodash.findwhere');

const aWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;

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
    // TODO: Use user-selected start and end dates or ranges.
    var startDate = new Date();
    var endDate = new Date(startDate.getTime() + aWeekInMilliseconds);

    var reqOpts = {
      method: 'GET',
      url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events?' +
        'timeMin=' + encodeURIComponent(startDate.toISOString()) + '&' +
        'timeMax=' + encodeURIComponent(endDate.toISOString()) + '&' +
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
