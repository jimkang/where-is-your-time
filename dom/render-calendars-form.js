var d3 = require('d3-selection');
var accessor = require('accessor');
var callNextTick = require('call-next-tick');

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
  calendarItemsToUpdate.selectAll('input').attr('checked', syncCheckboxToSelectionState);

  callNextTick(done);

  function onCheckboxClick(calendar) {
    syncSelectionStateToCheckbox(calendar, this);
    updateSelectedCalendars();
  }

  function updateSelectedCalendars() {
    if (onSelectedCalendarsUpdate) {
      var calendars = form.selectAll('.calendar-option').data();
      onSelectedCalendarsUpdate(calendars.filter(isSelected));
    }
  }
}

function syncCheckboxToSelectionState(calendar) {
  var checkboxEl = this;
  checkboxEl.checked = calendar.selected;
}

function syncSelectionStateToCheckbox(calendar, checkboxEl) {
  calendar.selected = checkboxEl.checked;
}

module.exports = renderCalendarsForm;
