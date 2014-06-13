// boost api doc:
// http://developer.factual.com/api-docs/#Boost 

var auth = require('./auth');
var Factual = require('factual-api');
var factual = new Factual(auth.key, auth.secret);
factual.startDebug();

factual.post('/t/us-sandbox/boost', {
  factual_id: '4e4a14fe-988c-4f03-a8e7-0efc806d0a7f',
  q: "local business data",
  user: "a_user_id"
}, function (error, res) {
  if (!error) console.log("success");
});

