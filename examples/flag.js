// flag api doc:
// http://developer.factual.com/display/docs/Core+API+-+Flag

var auth = require('./auth');
var Factual = require('factual-api');
var factual = new Factual(auth.key, auth.secret);
factual.startDebug();

// flag duplicate
factual.post('/t/us-sandbox/4e4a14fe-988c-4f03-a8e7-0efc806d0a7f/flag', {
  problem: "duplicate",
  preferred: "9d676355-6c74-4cf6-8c4a-03fdaaa2d66a",
  user: "a_user_id"
}, function (error, res) {
  if (!error) console.log("success");
});

factual.post('/t/us-sandbox/4e4a14fe-988c-4f03-a8e7-0efc806d0a7f/flag', {
  problem: "spam",
  user: "a_user_id",
  comment: "Known spammer."
}, function (error, res) {
  if (!error) console.log("success");
});

factual.post('/t/us-sandbox/4e4a14fe-988c-4f03-a8e7-0efc806d0a7f/flag', {
  problem: "inaccurate",
  fields: JSON.stringify(["latitude","longitude"]),
  user: "a_user_id"
}, function (error, res) {
  if (!error) console.log("success");
});
