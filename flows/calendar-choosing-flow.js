var waterfall = require('async-waterfall');
var callNextTick = require('call-next-tick');
var request = require('basic-browser-request');
var renderCalendarsForm = require('../dom/render-calendars-form');
var cloneDeep = require('lodash.clonedeep');
var findWhere = require('lodash.findwhere');

function calendarChoosingFlow(cell, flowDone) {
  var selectedCalendars = [];

  waterfall(
    [
      getStoredCalendarSelections,
      getCalendars,
      reconcileWithStoredCalendarSelections,
      updateCell,
      provisionRenderCall,
      passCell
    ],
    flowDone
  );

  function getStoredCalendarSelections(done) {
    var storedSelectedCalendars = cell.storage.getItem('selectedCalendars');
    if (storedSelectedCalendars) {
      selectedCalendars = JSON.parse(storedSelectedCalendars);
    }
    callNextTick(done);
  }

  function getCalendars(done) {
    var reqOpts = {
      method: 'GET',
      url: 'https://content.googleapis.com/calendar/v3/users/me/calendarList?' +
        'key=' + cell.idToken + '&' +
        'fields=items(id,summary)',
      headers: {
        authorization: 'Bearer ' + cell.accessToken
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

  function updateCell(calendars, done) {
    cell.calendars = calendars;
    callNextTick(done);
  }

  function provisionRenderCall(done) {
    callNextTick(
      renderCalendarsForm,
      {
        calendars: cell.calendars,
        onSelectedCalendarsUpdate: flowOnSelectedCalendarsUpdate
      },
      done
    );
  }

  function passCell(done) {
    callNextTick(done, null, cell);
  }

  function flowOnSelectedCalendarsUpdate(selectedCalendars) {
    cell.storage.setItem('selectedCalendars', JSON.stringify(selectedCalendars));
    cell.onSelectedCalendarsUpdate(selectedCalendars);
  }
}

module.exports = calendarChoosingFlow;
