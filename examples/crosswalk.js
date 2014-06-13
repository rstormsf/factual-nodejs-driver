// crosswalk api doc:
// http://developer.factual.com/display/docs/Places+API+-+Crosswalk

var auth = require('./auth');
var Factual = require('factual-api');
var factual = new Factual(auth.key, auth.secret);
factual.startDebug();

factual.get('/t/crosswalk?filters={"factual_id":"3b9e2b46-4961-4a31-b90a-b5e0aed2a45e","namespace":"yelp"}', function (error, res) {
  console.log(res.data);
});

factual.get('/t/crosswalk?filters={"namespace":"foursquare", "namespace_id":"4ae4df6df964a520019f21e3"}', function (error, res) {
  console.log(res.data);
});

