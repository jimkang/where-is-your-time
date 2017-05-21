var d3 = require('d3-selection');
var accessor = require('accessor');
var callNextTick = require('call-next-tick');
var findWhere = require('lodash.findwhere');

var getId = accessor();
var getName = accessor('summary');
var isSelected = accessor('selected');

function renderCalendarsForm({calendars, onSelectedCalendarsUpdate}, done) {
  var form = d3.select('.calendars-list');
  var calendarItems = form
    .selectAll('.calendar-option')
    .data(calendars, getId);

  calendarItems.exit().remove();

  var newCalendarItems = calendarItems.enter().append('li')
    .classed('calendar-option', true);

  newCalendarItems.append('input')
    .attr('type', 'checkbox')
    .on('click', onCheckboxClick);
  
  newCalendarItems.append('span');

  var calendarItemsToUpdate = newCalendarItems.merge(calendarItems);
  calendarItemsToUpdate.selectAll('span').text(getName);
  calendarItemsToUpdate.selectAll('input').attr('checked', isSelected);

  callNextTick(done);

  function onCheckboxClick(selectedCalendar) {
    syncSelectionStateToCheckbox(selectedCalendar.id, this);
    updateSelectedCalendars();
  }

  function syncSelectionStateToCheckbox(selectedCalendar, checkboxEl) {
    var calendar = findWhere(calendars, {id: selectedCalendar});
    calendar.selected = checkboxEl.checked;
  }

  function updateSelectedCalendars() {
    if (onSelectedCalendarsUpdate) {
      onSelectedCalendarsUpdate(calendars.filter(isSelected));
    }
  }
}


module.exports = renderCalendarsForm;
