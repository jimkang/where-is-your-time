var waterfall = require('async-waterfall');
var callNextTick = require('call-next-tick');
var handleError = require('handle-error-web');
var request = require('basic-browser-request');
var renderCalendarsForm = require('../dom/render-calendars-form');
var cloneDeep = require('lodash.clonedeep');
var findWhere = require('lodash.findwhere');

function calendarChoosingFlow({
    idToken, accessToken, onSelectedCalendarsUpdate, storage
  }) {
  var selectedCalendars = [];

  waterfall(
    [
      getStoredCalendarSelections,
      getCalendars,
      reconcileWithStoredCalendarSelections,
      provisionRenderCall
    ],
    handleError
  );

  function getStoredCalendarSelections(done) {
    var storedSelectedCalendars = storage.getItem('selectedCalendars');
    if (storedSelectedCalendars) {
      selectedCalendars = JSON.parse(storedSelectedCalendars);
    }
    callNextTick(done);
  }

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

  function reconcileWithStoredCalendarSelections(res, calendarsResponseBody, done) {
    callNextTick(
      done, null, calendarsResponseBody.items.map(updateCalendarWithStoredCalendar)
    );
  }

  function updateCalendarWithStoredCalendar(calendar) {
    var updatedCalendar = cloneDeep(calendar);
    if (findWhere(selectedCalendars, {id: calendar.id})) {
      updatedCalendar.selected = true;
    }
    return updatedCalendar;
  }

  function provisionRenderCall(calendars, done) {
    callNextTick(
      renderCalendarsForm,
      {
        calendars: calendars,
        onSelectedCalendarsUpdate: flowOnSelectedCalendarsUpdate
      },
      done
    );
  }

  function flowOnSelectedCalendarsUpdate(selectedCalendars) {
    storage.setItem('selectedCalendars', JSON.stringify(selectedCalendars));
    onSelectedCalendarsUpdate(selectedCalendars);
  }
}

module.exports = calendarChoosingFlow;
