var waterfall = require('async-waterfall');
var callNextTick = require('call-next-tick');
var handleError = require('handle-error-web');
var request = require('basic-browser-request');
var renderCalendarsForm = require('../dom/render-calendars-form');

function showCalendarsFlow({idToken, accessToken, onSelectedCalendarsUpdate}) {
  waterfall(
    [
      getCalendars,
      provisionRenderCall
    ],
    handleError
  );

  function getCalendars(done) {
    var reqOpts = {
      method: 'GET',
      url: 'https://content.googleapis.com/calendar/v3/users/me/calendarList?' +
        'key=' + idToken + '&' +
        'fields=items(id,summary)',
      headers: {
        authorization: 'Bearer ' + accessToken
      },
      json: true
    };
    request(reqOpts, done);
  }

  function provisionRenderCall(res, calendarsResponseBody, done) {
    callNextTick(
      renderCalendarsForm,
      {
        calendars: calendarsResponseBody.items,
        onSelectedCalendarsUpdate: onSelectedCalendarsUpdate
      },
      done
    );
  }
}

module.exports = showCalendarsFlow;
