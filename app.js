var qs = require('qs');
var handleError = require('handle-error-web');
var request = require('basic-browser-request');
var sb = require('standard-bail')();
var RouteState = require('route-state');

var routeState = RouteState({
  followRoute: route,
  windowObject: window  
});

var token;
var idToken;

((function go() {
})());

function route(routeDict) {
  // TODO: Routing logic
  getCalendars();
}

function getCalendars() {
  var reqOpts = {
    method: 'GET',
    url: 'https://content.googleapis.com/calendar/v3/users/me/calendarList?' +
      'key=' + idToken + '&' +
      'fields=items(id,summary)',
    headers: {
      authorization: 'Bearer ' + token
    }
  };
  request(reqOpts, sb(renderCalendars, handleError));
}

function renderCalendars(res, body) {
  console.log('calendars', body);
}

window.onSignIn = function onSignIn(googleUser) {
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
  token = grantResult.Zi.access_token;
  idToken = grantResult.Zi.id_token;
  routeState.routeFromHash();
}

function grantFailed(fail) {
  handleError(new Error('Grant failed: ' + JSON.stringify(fail)));
}
