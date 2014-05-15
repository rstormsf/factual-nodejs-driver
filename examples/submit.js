// submit api doc:
// http://developer.factual.com/display/docs/Core+API+-+Submit

var auth = require('./auth');
var Factual = require('../factual-api');
var factual = new Factual(auth.key, auth.secret);
factual.startDebug();

factual.post('/t/us-sandbox/submit', {
  values: JSON.stringify({
    name: "Factual",
    address: "1999 Avenue of the Stars",
    address_extended: "35th floor",
    locality: "los angeles",
    region: "ca",
    postcode: "90067",
    country: "us",
    tel: "(310) 286-9400",
    website: "http://www.factual.com",
    latitude: 34.058743,
    longitude:-118.41694,
    category_ids: [209]
  }),
  user: "a_user_id",
  reference: "http://www.factual.com"
}, function (error, res) {
  console.log(res);
});
