const quarterHourInMilliseconds = 15 * 60 * 1000;

function bucketEvents(calendarName, events, buckets) {
  events.forEach(putEventIntoBuckets);
  return buckets;

  function putEventIntoBuckets(event) {
    if (!event.start || !event.end) {
      console.error(new Error('Event ' + event.summary + ' has no start or end date.'));
      return;
    }

    var startDate = new Date(event.start.dateTime);
    var endDate = new Date(event.end.dateTime);
        for (var time = startDate.getTime();
      time < endDate.getTime();
      time += quarterHourInMilliseconds) {

      let slotDate = new Date(time);
      let slotKey = slotDate.toISOString();

      if (buckets[slotKey]) {
        console.error(new Error(
          'Could not place event ' + event.summary +
          ' at ' + slotKey +
          ' - event ' + buckets[slotKey].event.summary + ' is already there.'
        ));
      }
      else {
        buckets[slotKey] = {
          calendar: calendarName,
          event: event
        };
      }
    }
    debugger;
  }
}

module.exports = bucketEvents;
