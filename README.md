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
```javascript
// Fulltext search doc:
// http://developer.factual.com/display/docs/Core+API+-+Search+Filters
factual.get('/t/places',{q:"starbucks", "include_count":"true"}, function (error, res) {
  console.log("show "+ res.included_rows +"/"+ res.total_row_count +" rows:", res.data);
});

// Row Filters doc:
// http://developer.factual.com/display/docs/Core+API+-+Row+Filters
factual.get('/t/places', {q:"starbucks", filters:{"region":"CA"}}, function (error, res) {
  console.log(res.data);
});

factual.get('/t/places', {q:"starbucks", filters:{"$or":[{"region":{"$eq":"CA"}},{"locality":"newyork"}]}}, function (error, res) {
  console.log(res.data);
});

// Geo filter doc:
// http://developer.factual.com/display/docs/Core+API+-+Geo+Filters
factual.get('/t/places', {q:"starbucks", geo:{"$circle":{"$center":[34.041195,-118.331518],"$meters":1000}}}', function (error, res) {
  console.log(res.data);
});
```

## Schema
For schema, you only need to specify the table:
```javascript
factual.get('/t/places/schema', function (error, res) {
  console.log(res.view);
});
```

## Facets
```javascript
// show top 5 cities that have more than 20 Starbucks in California
factual.get('/t/places/facets', {q:"starbucks", filters:{"region":"CA"}, select:"locality", "min_count":20, limit:5}, function (error, res) {
  console.log(res.data);
});
```

## Crosswalk
Query with factual id, and only show entites from Yelp and Foursquare:
```javascript
factual.get('/places/crosswalk', {"factual_id":"57ddbca5-a669-4fcf-968f-a1c8210a479a", only:"yelp,foursquare"}, function (error, res) {
  console.log(res.data);
});
```

Or query with an entity from Foursquare:
```javascript
factual.get('/places/crosswalk', {namespace:"foursquare", "namespace_id":"4ae4df6df964a520019f21e3"}, function (error, res) {
  console.log(res.data);
});
```

## Resolve
Resolve the entity from name and address:
```javascript
factual.get('/places/resolve', {values:{"name":"huckleberry","address":"1014 Wilshire Blvd"}}, function (error, res) {
  console.log(res.data);
});
```
Resolve from name and location
```javascript
factual.get('/places/resolve', {values:{"name":"huckleberry","latitude":34.023827,"longitude":-118.49251}}, function (error, res) {
  console.log(res.data);
});
```

## Multi
Query read and facets in one request:
```javascript
var readQuery = factual.requestUrl('/t/places', {q:"starbucks", geo:{"$circle":{"$center":[34.041195,-118.331518],"$meters":1000}}});
var facetsQuery = factual.requestUrl('/t/places/facets', {q:"starbucks", filters:{"region":"CA"}, select:"locality", "min_count":20, limit:5});
factual.get('/multi', {queries:{
  read: readQuery,
  facets: facetsQuery
}}, function (error, res) {
  console.log('read:', res.read.response);
  console.log('facets:', res.facets.response);
});
```
Note that sub-responses in multi's response object might be factual api's error responses.

## Monetize
Use fulltext search query to get deals about fried chicken in Los Angeles:
```javascript
factual.get('/places/monetize', {q:"Fried Chicken,Los Angeles"}, function (error, res) {
  console.log(res.data);
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
