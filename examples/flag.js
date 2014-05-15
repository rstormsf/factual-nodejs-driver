// flag api doc:
// http://developer.factual.com/display/docs/Core+API+-+Flag

var auth = require('./auth');
var Factual = require('../factual-api');
var factual = new Factual(auth.key, auth.secret);
factual.startDebug();

// flag duplicate
factual.post('/t/us-sandbox/4e4a14fe-988c-4f03-a8e7-0efc806d0a7f/flag', {
  problem: "duplicate",
  user: "a_user_id",
  data: {"factual_ids":["85c89c4c-aa00-4bdb-baf1-a343e13b3cf5"]}
}, function (error, res) {
  if (!error) console.log("success");
});
