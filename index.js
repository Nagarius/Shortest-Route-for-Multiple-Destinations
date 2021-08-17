const {Client} = require("@googlemaps/google-maps-services-js");
const { PlacesNearbyRanking } = require('@googlemaps/google-maps-services-js/dist/places/placesnearby');
const geod = require('./geometric');
const importKey = require('./config').key;

const apiKey = importKey.googleMaps;
const axios = require('axios');
const { google } = require("googleapis");

const client = new Client({});

console.log("Passed1");
async function searchPlacesNearby(key, startCood, query){
  const params = {
    keyword: key, 
    location: startCood, 
    opennow: true,
    rankby: PlacesNearbyRanking.distance,
    key: apiKey,
  };
  
  var results;
  await client.placesNearby({ params: params }).then(r => results = r.data.results).catch(e => console.log(e.response.data.error_message));
  
  try{
    if (typeof results !== 'undefined' && results.length > 0) {
      // the array is defined and has at least one element
    
        //var query = geod.objDestination(from, to);
        console.log( "N search = " + results.length);
        console.log(results);
        console.log(results[0].geometry.location);
        console.log(query.xDistance([results[0].geometry.location.lat, results[0].geometry.location.lng]));

        var nearbyResults = [];
        for(let i = 0; i < results.length; i++){
          //var latLong = [results[i].geometry.location.lat, results[i].geometry.location.lng];
          const locationObj = {
            name : results[i].name,
            location : [results[i].geometry.location.lat, results[i].geometry.location.lng],
            disToLine : query.xDistance([results[i].geometry.location.lng, results[i].geometry.location.lat]),// cood flipped for geoformat
            open_now : results[i].opening_hours.open_now,
            address : results[i].vicinity
          };
          nearbyResults.push(locationObj)
        }
        //console.info(arrayResults);
        //filterLineResults(query, arrayResults);
        return nearbyResults;
      }else{
        throw ("placesNearby had null results");
      }
    }catch(e){
      console.log(e);
    }
}

function filterLineResults(objQuery, arrayResults){
  sectionedResults = [];
  for(const val of arrayResults){
    console.log(objQuery.compassface());
    switch(objQuery.compassface()){
      case geod.Compass.NORTH:
        // x -> y < y point
        if(objQuery.reciInterceptY(val.location[1]) < val.location[0]){
          sectionedResults.push(val);
        }
        break;
      case geod.Compass.SOUTH:
        // x -> y > y point
        if(objQuery.reciInterceptY(val.location[1]) > val.location[0]){
          sectionedResults.push(val);
        }
        break;
      case geod.Compass.EAST:
        // y -> x < x point
        if(objQuery.reciInterceptX(val.location[0]) < val.location [1]){
          sectionedResults.push(val);
        }
        break;
      case geod.Compass.WEST:
        // y -> x > x point
        if(objQuery.reciInterceptX(val.location[0]) > val.location [1]){
          sectionedResults.push(val);
        }
    }
  }
  console.info(sectionedResults);
}

async function test(){
  var keyword = "fuel";
  var startCood = [-27.9867822,153.3669783];
  var destination = [-27.9663925,153.4105253];
  var querySearch = geod.objDestination(startCood, destination);
  var nearbyResults = await searchPlacesNearby(keyword, startCood, querySearch);
  console.info(nearbyResults);
  var filteredResults = filterLineResults(querySearch, nearbyResults)
}

test();
console.log("Passed2");


