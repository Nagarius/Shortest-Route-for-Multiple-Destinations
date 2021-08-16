const {Client} = require("@googlemaps/google-maps-services-js");
const { PlacesNearbyRanking } = require('@googlemaps/google-maps-services-js/dist/places/placesnearby');
const geod = require('./geometric');
const importKey = require('./config').key;

const apiKey = importKey.googleMaps;
const axios = require('axios');
const { google } = require("googleapis");
const { booleanClockwise } = require("@turf/turf");
const { calendar } = require("googleapis/build/src/apis/calendar");

const client = new Client({});

function searchPlacesNearby(key, loc){
  const params = {
    keyword: key, 
    location: loc, 
    opennow: true,
    rankby: PlacesNearbyRanking.distance,
    key: apiKey,
  };
  return client.placesNearby({ params: params });
}
console.log("Passed1");

async function dothis(){
  var from = [-27.9867822,153.3669783];
  var to = [-27.9663925,153.4105253];
  var keyword = "bws";
  
  var results;
  await searchPlacesNearby(keyword, from).then(r => results = r.data.results);
  
  var query = geod.objDestination(from, to);
  console.log( "N search = " + results.length);
  console.log(results);
  console.log(results[0].geometry.location);
  console.log(query.xDistance([results[0].geometry.location.lat, results[0].geometry.location.lng]));


  var arrayResults = [];
  for(let i = 0; i < results.length; i++){
    //var latLong = [results[i].geometry.location.lat, results[i].geometry.location.lng];
    const locationObj = {
      name : results[i].name,
      location : [results[i].geometry.location.lat, results[i].geometry.location.lng],
      disToLine : query.xDistance([results[i].geometry.location.lng, results[i].geometry.location.lat]),// cood flipped for geoformat
      open_now : results[i].opening_hours.open_now,
      address : results[i].vicinity
    };
    arrayResults.push(locationObj)
  }
  console.info(arrayResults);
  filterLineResults(query, arrayResults);  
}

function filterLineResults(objQuery, arrayResults){
  sectionedResults = [];
  for(const val of arrayResults){
    console.log(objQuery.compassface());
    switch(objQuery.compassface()){
      case "NORTH":
        // x -> y < y point
        if(objQuery.reciInterceptY(val.location[1]) < val.location[0]){
          sectionedResults.push(val);
        }
        break;
      case "SOUTH":
        // x -> y > y point
        if(objQuery.reciInterceptY(val.location[1]) > val.location[0]){
          sectionedResults.push(val);
        }
        break;
      case "EAST":
        // y -> x < x point
        if(objQuery.reciInterceptX(val.location[0]) < val.location [1]){
          sectionedResults.push(val);
        }
        break;
      case "WEST":
        // y -> x > x point
        if(objQuery.reciInterceptX(val.location[0]) > val.location [1]){
          sectionedResults.push(val);
        }
    }
  }
  console.info(sectionedResults);
}

dothis();
console.log("Passed2");


