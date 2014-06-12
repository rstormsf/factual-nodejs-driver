# About

This is the Factual-supported Node.js driver for [Factual's public API](http://developer.factual.com).

# Install

```bash
$ npm install factual-api
```

# Get Started

Include this driver in your projects:
```javascript
var Factual = require('factual-api');
var factual = new Factual('YOUR_KEY', 'YOUR_SECRET');
```

If you don't have a Factual API account yet, [it's free and easy to get one](https://www.factual.com/api-keys/request).

## Read
Doc: http://developer.factual.com/api-docs/#Read
```javascript
// Full-text search:
factual.get('/t/places-us',{q:"starbucks", "include_count":"true"}, function (error, res) {
  console.log("show "+ res.included_rows +"/"+ res.total_row_count +" rows:", res.data);
});

// Row filters:
factual.get('/t/places-us', {filters:{category_ids:{"$includes":10}}}, function (error, res) {
  console.log(res.data);
});

factual.get('/t/places-us', {q:"starbucks", filters:{"region":"CA"}}, function (error, res) {
  console.log(res.data);
});

factual.get('/t/places-us', {q:"starbucks", filters:{"$or":[{"region":{"$eq":"CA"}},{"locality":"newyork"}]}}, function (error, res) {
  console.log(res.data);
});

// Geo filter:
factual.get('/t/places-us', {q:"starbucks", geo:{"$circle":{"$center":[34.041195,-118.331518],"$meters":1000}}}, function (error, res) {
  console.log(res.data);
});

// Existence threshold:
factual.get('/t/places-us', {threshold:"confident"}, function (error, res) {
  console.log(res.data);
});

// Get a row by factual id:
factual.get('/t/places-us/03c26917-5d66-4de9-96bc-b13066173c65', function (error, res) {
  console.log(res.data[0]);
});

```

## Schema
Doc: http://developer.factual.com/api-docs/#Schema
```javascript
factual.get('/t/places-us/schema', function (error, res) {
  console.log(res.view);
});
```

## Facets
Doc: http://developer.factual.com/api-docs/#Facets
```javascript
// show top 5 cities that have more than 20 Starbucks in California
factual.get('/t/places-us/facets', {q:"starbucks", filters:{"region":"CA"}, select:"locality", "min_count":20, limit:5}, function (error, res) {
  console.log(res.data);
});
```

## Resolve
Doc: http://developer.factual.com/api-docs/#Resolve
```javascript
// resovle from name and address info
factual.get('/t/places-us/resolve?values={"name":"McDonalds","address":"10451 Santa Monica Blvd","region":"CA","postcode":"90025"}', function (error, res) {
  console.log(res.data);
});

// resolve from name and geo location
factual.get('/t/places-us/resolve?values={"name":"McDonalds","latitude":34.05671,"longitude":-118.42586}', function (error, res) {
  console.log(res.data);
});
```

## Match
Doc: http://developer.factual.com/api-docs/#Match
Match the data with Factual's, but only return the matched Factual ID:
```javascript
factual.get('/t/places-us/match?values={"name":"McDonalds","address":"10451 Santa Monica Blvd","region":"CA","postcode":"90025"}', function (error, res) {
  console.log(res.data);
});
```

## Crosswalk
Doc: http://developer.factual.com/places-crosswalk/
Query with factual id, and only show entites from Yelp:
```javascript
factual.get('/t/crosswalk?filters={"factual_id":"3b9e2b46-4961-4a31-b90a-b5e0aed2a45e","namespace":"yelp"}', function (error, res) {
  console.log(res.data);
});
```

Or query with an entity from Foursquare:
```javascript
factual.get('/t/crosswalk?filters={"namespace":"foursquare", "namespace_id":"4ae4df6df964a520019f21e3"}', function (error, res) {
  console.log(res.data);
});
```

## Multi
Doc: http://developer.factual.com/api-docs/#Multi
Query read and facets in one request:
```javascript
var readQuery = factual.requestUrl('/t/places-us', {q:"starbucks", geo:{"$circle":{"$center":[34.041195,-118.331518],"$meters":1000}}});
var facetsQuery = factual.requestUrl('/t/places-us/facets', {q:"starbucks", filters:{"region":"CA"}, select:"locality", "min_count":20, limit:5});
factual.get('/multi', {queries:{
  read: readQuery,
  facets: facetsQuery
}}, function (error, res) {
  console.log('read:', res.read.response);
  console.log('facets:', res.facets.response);
});
```
Note that sub-responses in multi's response object might be factual api's error responses.


## World Geographies
World Geographies contains administrative geographies (states, counties, countries), natural geographies (rivers, oceans, continents), and assorted geographic miscallaney.  This resource is intended to complement the Global Places and add utility to any geo-related content.
```javascript
factual.get('/t/world-geographies?select=neighbors&filters={"factual_id":{"$eq":"08ca0f62-8f76-11e1-848f-cfd5bf3ef515"}}', function (error, res) {
  console.log(res.data);
});
```

## Submit
Doc: http://developer.factual.com/api-docs/#Submit

```javascript
factual.post('/t/us-sandbox/submit', {
  values: JSON.stringify({
    name: "Factual",
    address: "1999 Avenue of the Stars",
    address_extended: "34th floor",
    locality: "Los Angeles",
    region: "CA",
    postcode: "90067"
    country: "us"
    latitude: 34.058743,
    longitude: -118.41694
    category_ids: "209"
  }),
  user: "a_user_id"
}, function (error, res) {
  console.log(res);
});
```

Edit an existing row:
```javascript
factual.post('/t/us-sandbox/4e4a14fe-988c-4f03-a8e7-0efc806d0a7fsubmit', {
  values: JSON.stringify({
    address_extended: "35th floor"
  }),
  user: "a_user_id"
}, function (error, res) {
  console.log(res);
});
```


## Flag
Doc: http://developer.factual.com/api-docs/#Flag

Flag a row as being a duplicate of another. The *preferred* entity that should persist is passed as a GET parameter.
```javascript
factual.post('/t/us-sandbox/4e4a14fe-988c-4f03-a8e7-0efc806d0a7f/flag', {
  problem: "duplicate",
  preferred: "9d676355-6c74-4cf6-8c4a-03fdaaa2d66a",
  user: "a_user_id"
}, function (error, res) {
  if (!error) console.log("success");
});
```

Flag a row as being spam.
```javascript
factual.post('/t/us-sandbox/4e4a14fe-988c-4f03-a8e7-0efc806d0a7f/flag', {
  problem: "spam",
  user: "a_user_id",
  comment: "Known spammer."
}, function (error, res) {
  if (!error) console.log("success");
});
```

Flag a row as having inaccurate data. This presumes you don't know the more accurate data. If you do, the preferred option is to use the *submit* API call to submit the updated data.
```javascript
factual.post('/t/us-sandbox/4e4a14fe-988c-4f03-a8e7-0efc806d0a7f/flag', {
  problem: "inaccurate",
  fields: JSON.stringify(["latitude","longitude"]),
  user: "a_user_id"
}, function (error, res) {
  if (!error) console.log("success");
});
```

## Clear
Doc: http://developer.factual.com/api-docs/#Clear
Clear existing attributes in an entity
```javascript
factual.post('/t/us-sandbox/4e4a14fe-988c-4f03-a8e7-0efc806d0a7f/clear', {
  fields: "address_extended,latitude,longitude",
  user: "a_user_id"
}, function (error, res) {
  if (!error) console.log("success");
});
```

## Boost
Doc: http://developer.factual.com/api-docs/#Boost
```javascript
factual.post('/t/us-sandbox/boost', {
  factual_id: '4e4a14fe-988c-4f03-a8e7-0efc806d0a7f',
  q: "local business data",
  user: "a_user_id"
}, function (error, res) {
  if (!error) console.log("success");
});
```



## Error Handling
The error object is the first argument of the callback functions, it will be null if no errors.

## Debug Mode
To see detailed debug information at runtime, you can turn on Debug Mode:
```javascript
// start debug mode
factual.startDebug();

// run your querie(s)

// stop debug mode
factual.stopDebug();
```
Debug Mode will output useful information about what's going on, including  the request sent to Factual and the response from Factual, outputting to stdout and stderr.


## Use custom timeout
You can set the request timeout(in milliseconds) now:
```javascript
// set the timeout as 1 second
factual.setRequestTimeout(1000);
// clear the custom timeout setting
factual.setRequestTimeout();
```
You will get [Error: socket hang up] for custom timeout errors.


# Where to Get Help

If you think you've identified a specific bug in this driver, please file an issue in the github repo. Please be as specific as you can, including:

  * What you did to surface the bug
  * What you expected to happen
  * What actually happened
  * Detailed stack trace and/or line numbers

If you are having any other kind of issue, such as unexpected data or strange behaviour from Factual's API (or you're just not sure WHAT'S going on), please contact us through [GetSatisfaction](http://support.factual.com/factual).
