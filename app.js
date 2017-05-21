/* global gapi, window */

var RouteState = require('route-state');
var calendarChoosingFlow = require('./flows/calendar-choosing-flow');
var handleError = require('handle-error-web');

var routeState = RouteState({
  followRoute: route,
  windowObject: window  
});

var accessToken;
var idToken;

((function go() {
  window.onSignIn = onSignIn;
})());

function route(routeDict) {
  // TODO: Routing logic
  calendarChoosingFlow({
    accessToken: accessToken,
    idToken: idToken,
    onSelectedCalendarsUpdate: onSelectedCalendarsUpdate,
    storage: window.localStorage
  });
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
  routeState.routeFromHash();
}

function grantFailed(fail) {
  handleError(new Error('Grant failed: ' + JSON.stringify(fail)));
}

function onSelectedCalendarsUpdate(selectedCalendars) {
  console.log('selectedCalendars:', selectedCalendars);
  // TODO: Update routes, then follow route to show breakdowns flow
}
