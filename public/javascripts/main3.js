console.log("main.js");

// var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
var icelandCenter = [64.9928797, -18.9224775];
var icelandWest = [-23.1455075, 64.6103345];
// Load map
mapboxgl.accessToken = 'pk.eyJ1IjoiYWduYXJkYXJyaSIsImEiOiJja2N3YXU4ZXowY2JwMnRxdTVxOTM0cndkIn0.F-R2ofLT1K26zs8vhV5PVg';

// <label for="streets-v11">streets</label>
// <input id="light-v10" type="radio" name="rtoggle" value="light" />
// <label for="light-v10">light</label>
// <input id="dark-v10" type="radio" name="rtoggle" value="dark" />
// <label for="dark-v10">dark</label>
// <input id="outdoors-v11" type="radio" name="rtoggle" value="outdoors" />
// <label for="outdoors-v11">outdoors</label>
// <input id="satellite-v9" type="radio" name="rtoggle" value="satellite" />
// <label for="satellite-v9">satellite</label>

var map = new mapboxgl.Map({
  container: "mapcontainer",
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: icelandCenter.reverse(),
  zoom: 6.1
});

var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
  offset: 0
});

const circle1 = '#a2e67d';
const circle2 = '#fff509';

// var layerList = document.getElementById('menu');
// var inputs = layerList.getElementsByTagName('input');
//
// function switchLayer(layer) {
//   var layerId = layer.target.id;
//   map.setStyle('mapbox://styles/mapbox/' + layerId);
// }
//
// for (var i = 0; i < inputs.length; i++) {
//   inputs[i].onclick = switchLayer;
// }

async function getMarkers() {
  try {
    var res = await fetch('/digs/all');
    var data = await res.json();
    return data;
  } catch (err) {
      console.log(err);
  }
}

map.on('load', () => {
  getMarkers()
  .then((results) => {
    // console.log(results);
    const digs_ = results.data.map(function(d) {
      return {
        'type': 'Feature',
        'properties': {
          'id': d._id,
          'title': d.title,
          'people': d.people.join(', '),
          'county': d.county,
          'year': d.year.join(', '),
          'category': d.category,
          'type': d.type,
          'finished': d.finished,
          'observable': d.observable,
          'tags': d.tags.join(', '),
          'tag_dyrabein': d.tags.includes('dýrabein'),
          'tag_gripir': d.tags.includes('gripir'),
          'tag_grafir': d.tags.includes('grafir'),
          'tag_mannabein': d.tags.includes('mannabein'),
          'tag_mannvirki': d.tags.includes('mannvirki'),
          'image_url': d.image_url,
          'summary': d.summary
        },
        'geometry': {
          'type': 'Point',
          'coordinates': d.gps.reverse()
        }
      }
    });

    const digs = {
        'type': 'FeatureCollection',
        'features': digs_
      };

    map.addSource('digs', {'type': 'geojson', 'data': digs});

    // digs.features.forEach(function(feature) {
    //   var symbol = feature.properties['icon'];
    //   var layerID = 'poi-' + symbol;
    //
    //   // Add a layer for this symbol type if it hasn't been added already.
    //   if (!map.getLayer(layerID)) {
    //     map.addLayer({
    //       'id': layerID,
    //       'type': 'symbol',
    //       'source': 'digs',
    //       'layout': {
    //         'icon-image': symbol + '-15',
    //         'icon-allow-overlap': true
    //       },
    //       'filter': ['==', 'icon', symbol]
    //     });
    //
    //     // Add checkbox and label elements for the layer.
    //     var input = document.createElement('input');
    //     input.type = 'checkbox';
    //     input.id = layerID;
    //     input.checked = true;
    //     filterGroup.appendChild(input);
    //
    //     var label = document.createElement('label');
    //     label.setAttribute('for', layerID);
    //     label.textContent = symbol;
    //     filterGroup.appendChild(label);
    //
    //     // When the checkbox changes, update the visibility of the layer.
    //     input.addEventListener('change', function(e) {
    //       map.setLayoutProperty(
    //       layerID,
    //       'visibility',
    //       e.target.checked ? 'visible' : 'none'
    //       );
    //       });
    //     }
    // });

  })
  // .then(map.loadImage(
  //   'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
  //   function(error, image) {
  //     if(error) throw error;
  //     map.addImage('custom-marker', image);
  //   }
  // ))
  .then(() => {
    map.addLayer({
      'id': 'digs',
      'type': 'circle',
      'source': 'digs',
      'paint': {

        // make circles larger as the user zooms from z12 to z22
        'circle-radius': {
          'base': 3,
          'stops': [
            [10, 13],
            [20, 450]
          ]
        },
        'circle-stroke-width': 1,
        'circle-opacity': 0.75,
        // color circles by ethnicity, using a match expression
        // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
        'circle-color': [
          'match',
          ['get', 'category'],
          1,
          circle1,
          2,
          circle2,
          /* other */ '#000000'
        ],
        'circle-stroke-color': [
          'match',
          ['get', 'category'],
          1,
          '#188500',
          2,
          '#ffc106',
          /* other */ '#000000'
        ]
      }
      // 'layout': {
      //   'icon-image': 'custom-marker',
      //   'icon-allow-overlap': true
      // }
    });

  map.on('mouseenter', 'digs', (e) => {
    map.getCanvas().style.cursor = 'pointer';

    var coordinates = e.features[0].geometry.coordinates.slice();
    var title = e.features[0].properties.title;
    var year = e.features[0].properties.year;
    var tags = e.features[0].properties.tags;
    // console.log("Tags be ", e.features[0].properties);
    var digType = e.features[0].properties.type;
    var image_url = e.features[0].properties.image_url;
    var finished = e.features[0].properties.finished == true ? 'Klárað' : 'Óklárað';

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    // based on the feature found.

    const capitalizeFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);

    var popupimg = "url('/images/digs/" + capitalizeFirstLetter(image_url) + "_1.jpg')";

    popup
    .setLngLat(coordinates)
    .setHTML(
      '<div class="popup-wrapper">' +
        // '<h3>' + title + '</h3><p>' + county + '</p>' +
        '<div class="popup-img-wrapper" style="background-image: ' + popupimg + ';">' +
          '<h4 style="color:white; font-weight: 700;">' + title + '</h4>' +
        '</div>' +
        '<div class="popup-desc-wrapper">' +
          '<div class="popup-attrs">' +
            '<dl>' +
              '<dt>Uppgraftarár</dt>' +
              '<dd>' + year + '</dd>' +
              '<dt>Tegund uppgraftar</dt>' +
              '<dd>' + digType + '</dd>' +
              '<dt>Tegund minja</dt>' +
              '<dd>' + tags + '</dd>' +
              '<dt>Staða uppgraftar</dt>' +
              '<dd>' + finished + '</dd>' +
            '</dl>' +
          '</dl>' +
          '</div>' +
          '<div class="poplink">' +
            '<div>Smelltu til að sjá meira</div>' +
          '</div>' +
        '</div>' +
      '</div>'
      )
      .addTo(map);
    })

    map.on('mouseleave', 'digs', function(e) {
      // console.log(e);
      map.getCanvas().style.cursor = '';
      popup.remove();
    });

    map.on('click', 'digs', (e) => {
      document.location.href = window.location.origin + '/digs/dig/' + e.features[0].properties.id;
    });
  })

});
