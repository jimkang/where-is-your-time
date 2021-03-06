/* global gapi, window */

var calendarChoosingFlow = require('./flows/calendar-choosing-flow');
var eventsFlow = require('./flows/events-flow');
// var breakdownsFlow = require('./flows/breakdowns-flow');
var handleError = require('handle-error-web');
var Flowlocks = require('./flowlocks');
var callNextTick = require('call-next-tick');


var accessToken;
var idToken;

((function go() {
  window.onSignIn = onSignIn;
})());

function route() {
  // Always render breakdown.
  // Always allow calendar choosing
  // Allow event filtering after calendar choosing
  // Chain calendars, events => breakdown
  var state = {
    accessToken: accessToken,
    idToken: idToken,
    onSelectedCalendarsUpdate: onSelectedCalendarsUpdate,
    storage: window.localStorage
  };
  var flowlocks = Flowlocks(
    [calendarChoosingFlow, eventsFlow, breakdownsFlow],
    handleError
  );
  flowlocks.startFlows(state);

  function onSelectedCalendarsUpdate(updatedState) {
    console.log('Calendars updated. Cancelling and restarting flow.');
    flowlocks.cancel();
    callNextTick(flowlocks.startFlows, updatedState);
  }
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('Name: ' + profile.getName());
  // console.log('Image URL: ' + profile.getImageUrl());

  var options = new gapi.auth2.SigninOptionsBuilder({
    scope: 'https://www.googleapis.com/auth/calendar.readonly'
  });

  googleUser.grant(options).then(grantSucceeded, grantFailed);
}

function grantSucceeded(grantResult) {
  // console.log(grantResult);
  accessToken = grantResult.Zi.access_token;
  idToken = grantResult.Zi.id_token;
  // routeState.routeFromHash();
  route();
}

function grantFailed(fail) {
  handleError(new Error('Grant failed: ' + JSON.stringify(fail)));
}

function breakdownsFlow(cell, done) {
  console.log('breakdownsFlow started', cell);
  callNextTick(done, null, cell);
}
