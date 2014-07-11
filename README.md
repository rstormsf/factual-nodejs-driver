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

## Schema
Use the schema API call to determine what fields are available, and what operations (sorting, searching, writing) can be performed on each field.

Full documentation: http://developer.factual.com/api-docs/#Schema
```javascript
factual.get('/t/places-us/schema', function (error, res) {
  console.log(res.view);
});
```

## Read
Use the read API call to query data in Factual tables with any combination of full-text search, parametric filtering, and geo-location filtering.

Full documentation: http://developer.factual.com/api-docs/#Read
```javascript
// Full-text search:
factual.get('/t/places-us',{q:"century city mall", "include_count":"true"}, function (error, res) {
  console.log("show "+ res.included_rows +"/"+ res.total_row_count +" rows:", res.data);
});

// Row filters:
//  search restaurants (http://developer.factual.com/working-with-categories/)
//  note that this will return all sub-categories of 347 as well.
factual.get('/t/places-us', {filters:{category_ids:{"$includes":347}}}, function (error, res) {
  console.log(res.data);
});

//  search restaurants or bars
factual.get('/t/places-us', {filters:{category_ids:{"$includes_any":[312,347]}}}, function (error, res) {
  console.log(res.data);
});

//  search entertainment venues but NOT adult entertainment
factual.get('/t/places-us', {filters:{"$and":[{category_ids:{"$includes":317}},{category_ids:{"excludes":318}}], function (error, res) {
  console.log(res.data);
});

//  search for Starbucks in Los Angeles
factual.get('/t/places-us', {q:"starbucks", filters:{"locality":"los angeles"}}, function (error, res) {
  console.log(res.data);
});

//  search for starbucks in Los Angeles or Santa Monica 
factual.get('/t/places-us', {q:"starbucks", filters:{"$or":[{"locality":{"$eq":"los angeles"}},{"locality":{"$eq":"santa monica"}}]}}, function (error, res) {
  console.log(res.data);
});

// Paging:
//  search for starbucks in Los Angeles or Santa Monica (second page of results):
factual.get('/t/places-us', {q:"starbucks", filters:{"$or":[{"locality":{"$eq":"los angeles"}},{"locality":{"$eq":"santa monica"}}]}}, offset:20, limit:20, function (error, res) {
  console.log(res.data);
});

// Geo filter:
//  coffee near the Factual office
factual.get('/t/places-us', {q:"coffee", geo:{"$circle":{"$center":[34.058583, -118.416582],"$meters":1000}}}, function (error, res) {
  console.log(res.data);
});

// Existence threshold:
//  prefer precision over recall:
factual.get('/t/places-us', {threshold:"confident"}, function (error, res) {
  console.log(res.data);
});

// Get a row by factual id:
factual.get('/t/places-us/03c26917-5d66-4de9-96bc-b13066173c65', function (error, res) {
  console.log(res.data[0]);
});

```

## Facets
Use the facets call to get total counts, grouped by specified fields.

Full documentation: http://developer.factual.com/api-docs/#Facets
```javascript
// show top 5 cities that have more than 20 Starbucks in California
factual.get('/t/places-us/facets', {q:"starbucks", filters:{"region":"CA"}, select:"locality", "min_count":20, limit:5}, function (error, res) {
  console.log(res.data);
});
```

## Resolve
Use resolve to generate a confidence-based match to an existing set of place attributes.

Full documentation: http://developer.factual.com/api-docs/#Resolve
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
Match is similar to resolve, but returns only the Factual ID.

Full documentation: http://developer.factual.com/api-docs/#Match
```javascript
factual.get('/t/places-us/match?values={"name":"McDonalds","address":"10451 Santa Monica Blvd","region":"CA","postcode":"90025"}', function (error, res) {
  console.log(res.data);
});
```

## Crosswalk
Crosswalk contains third party mappings between entities.

Full documentation: http://developer.factual.com/places-crosswalk/

```javascript
// Query with factual id, and only show entites from Yelp:
factual.get('/t/crosswalk?filters={"factual_id":"3b9e2b46-4961-4a31-b90a-b5e0aed2a45e","namespace":"yelp"}', function (error, res) {
  console.log(res.data);
});
```

```javascript
// query with an entity from Foursquare:
factual.get('/t/crosswalk?filters={"namespace":"foursquare", "namespace_id":"4ae4df6df964a520019f21e3"}', function (error, res) {
  console.log(res.data);
});
```

## Multi
Make up to three simultaneous requests over a single HTTP connection. Note: while the requests are performed in parallel, the final response is not returned until all contained requests are complete. As such, you shouldn't use multi if you want non-blocking behavior. Also note that a contained response may include an API error message, if appropriate.

Full documentation: http://developer.factual.com/api-docs/#Multi

```javascript
// Query read and facets in one request:
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

## World Geographies
World Geographies contains administrative geographies (states, counties, countries), natural geographies (rivers, oceans, continents), and assorted geographic miscallaney.  This resource is intended to complement the Global Places and add utility to any geo-related content.

```javascript
factual.get('/t/world-geographies?select=neighbors&filters={"factual_id":{"$eq":"08ca0f62-8f76-11e1-848f-cfd5bf3ef515"}}', function (error, res) {
  console.log(res.data);
});
```

## Submit
Submit new data, or update existing data. Submit behaves as an "upsert", meaning that Factual will attempt to match the provided data against any existing places first. Note: you should ALWAYS store the commit ID returned from the response for any future support requests.

Full documentation: http://developer.factual.com/api-docs/#Submit

Place specific Write API examples: http://developer.factual.com/write-api/

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
Use the flag API to flag basic problems with existing data.

Full documentation: http://developer.factual.com/api-docs/#Flag

Flag a places as being a duplicate of another. The *preferred* entity that should persist is passed as a GET parameter.
```javascript
factual.post('/t/us-sandbox/4e4a14fe-988c-4f03-a8e7-0efc806d0a7f/flag', {
  problem: "duplicate",
  preferred: "9d676355-6c74-4cf6-8c4a-03fdaaa2d66a",
  user: "a_user_id"
}, function (error, res) {
  if (!error) console.log("success");
});
```

Flag a places as being closed.
```javascript
factual.post('/t/us-sandbox/4e4a14fe-988c-4f03-a8e7-0efc806d0a7f/flag', {
  problem: "closed",
  user: "a_user_id",
  comment: "was shut down when I went there yesterday."
}, function (error, res) {
  if (!error) console.log("success");
});
```

## Clear
The clear API is used to signal that an existing attribute should be reset.

Full documentation: http://developer.factual.com/api-docs/#Clear
```javascript
factual.post('/t/us-sandbox/4e4a14fe-988c-4f03-a8e7-0efc806d0a7f/clear', {
  fields: "latitude,longitude",
  user: "a_user_id"
}, function (error, res) {
  if (!error) console.log("success");
});
```

## Boost
The boost API is used to signal rows that should appear higher in search results.

Full documentation: http://developer.factual.com/api-docs/#Boost
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
