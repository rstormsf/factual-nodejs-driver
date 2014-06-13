// Clear api doc:
// http://developer.factual.com/api-docs/#Clear

var auth = require('./auth');
var Factual = require('factual-api');
var factual = new Factual(auth.key, auth.secret);
factual.startDebug();

factual.post('/t/us-sandbox/4e4a14fe-988c-4f03-a8e7-0efc806d0a7f/clear', {
  fields: "address_extended,latitude,longitude",
  user: "a_user_id"
}, function (error, res) {
  if (!error) console.log("success");
});
