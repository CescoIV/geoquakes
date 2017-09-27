// define globals
var weekly_quakes_endpoint = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
var days = 0;
$(document).ready(function() {
  $('.weekly').on('click', function() {
    days = 7;
    console.log('Weekly here')
    search();
  });
  $('.monthly').on('click', function() {
    days = 30;
    console.log('Monthly worked')
    search();
  });
  console.log("Let's get coding!");
});

function search(){
  $.ajax({
    method: 'GET',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson',
    dataType: 'json',
    success: onSuccess,
    error: onError
  })
}

function onSuccess(data){
  console.log(data);
  console.log('Success ', data.features[0].properties.title);
  console.log('Features ', data.features[0].geometry.coordinates[0]);
  console.log('Time ', Math.floor(Math.abs((data.features[0].properties.time - Date.now()) / 1000 / 60 / 60)));
  appendTitle(data);
  initializeMap(data);
}

function onError(){
  console.log('Failed');
}
//ayylmao
function appendTitle(data){
  data.features.forEach((item) => {
    var day = Math.floor(Math.abs(item.properties.time - Date.now())/ 1000 / 60 / 60 / 24);
     console.log(day, ' day');
    if(day < days){
      var title = item.properties.place.split('of');
      var loc = title[title.length-1];
      // console.log(title);
      var time = Math.floor(Math.abs(item.properties.time-Date.now())/1000/60/60) + " Hours Ago.";
      // console.log(time);
      $('#info').append(`<p>Location:${loc} Time:${time}</p>`);
    }
  })

}
function initializeMap(data){
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 30.2682, lng: -97.74295},
    zoom: 8
  });
  setCoordinates(data, map);
}
function setCoordinates(data, map){
  data.features.forEach((el) => {
    var longitude = el.geometry.coordinates[0];
    var latitude = el.geometry.coordinates[1];
    // console.log('lat ', latitude);
    // console.log('lng ', longitude);

    setMarker(latitude, longitude, map);
  })
}
function setMarker(latitude, longitude, map){
  var iconBase = {
    url:'/Users/nat/Desktop/wdi/class/w03/d03/geoquakes/images/earthquake.png',
    scaledSize: new google.maps.Size(10, 10)
  };
  var marker = new google.maps.Marker({
    position: {lat: latitude, lng: longitude},
    map: map,
    icon: iconBase
  })
}

// function changeMagColor(data){
//   data.features.forEach((el) => {
//     var mag = el.properties.mag;
//     if(mag > 4.0 && mag < 5.0) {
//     }
//   })
// }
