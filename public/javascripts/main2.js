console.log("main.js");

// var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
var icelandCenter = [64.9928797, -18.9224775];
var icelandWest = [-23.1455075, 64.6103345];
// Load map
mapboxgl.accessToken = 'pk.eyJ1IjoiYWduYXJkYXJyaSIsImEiOiJja2N3YXU4ZXowY2JwMnRxdTVxOTM0cndkIn0.F-R2ofLT1K26zs8vhV5PVg';
var map = new mapboxgl.Map({
  container: "mapcontainer",
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: icelandCenter.reverse(),
  zoom: 5.35
});

async function getMarkers() {
    var res = await fetch('/digs/all');
    var data = await res.json();

    // console.log("Data is ", data.data);
    return data

}

const addMarkers = (results, image) => {
  var geodata = {
    'type': 'FeatureCollection',
    'features': results.data.map(function(d) {
      return {
        'type': 'Feature',
        'properties': {
          'id': d.id,
          'title': d.title,
          'people': d.people,
          'county': d.county,
          'year': d.year,
          'category': d.category,
          'type': d.type,
          'finished': d.finished,
          'observable': d.observable,
          'citations': d.citations,
          'summary': d.summary
        },
        'geometry': {
          'type': 'Point',
          'coordinates': d.gps.reverse()
        }
      }
    })
  };

  map.addSource('digs', {'type': 'geojson', 'data': geodata});
  map.addLayer({
    'id': 'digs',
    'type': 'symbol',
    'source': 'digs',
    'layout': {
      // 'icon-image': 'custom-marker',
      'icon-allow-overlap': true
    }
  });

}

map.on('load', () => {
  map.loadImage(
    'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
    // '../images/dig_bones_icon.png',
    function(error, image) {
      if(error) throw error;
      map.addImage('custom', image);
      getMarkers().then(addMarkers)
  })
});



// map.on('click', function(e) {
//   console.log("Clicky", e.target);
// });

// map.on('mouseenter', function(e) {
//
// });

// Markers and popups
// const makePopup = (d) => {
//   var poppy = new mapboxgl.Popup({offset: 25, className: 'popup'});
//   return poppy.setHTML('<h3>' + d.title + '</h3><p>' + d.county + '</p>')
// };
//
// async function getMarkers() {
//     var res = await fetch('/digs/all');
//     var data = await res.json();
//
//     console.log("Data is ", data.data);
//     data.data.map((d) => {
//
//       var el = document.createElement('div');
//       el.className = d.category == 1 ? 'marker marker_type1' : 'marker marker_type2';
//
//       var marker = new mapboxgl.Marker(el)
//             .setLngLat(d.gps.reverse())
//             .setPopup(makePopup(d))
//             // .setPopup(poppy.setHTML(d.title))
//             .addTo(map);
//     })
//
// }
//
// getMarkers();
