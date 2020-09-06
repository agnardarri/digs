// Load map
mapboxgl.accessToken = 'pk.eyJ1IjoiYWduYXJkYXJyaSIsImEiOiJja2N3YXU4ZXowY2JwMnRxdTVxOTM0cndkIn0.F-R2ofLT1K26zs8vhV5PVg';

var gps = document.getElementById("gpscontainer").children;

var map = new mapboxgl.Map({
  container: "mapcontainer",
  style: 'mapbox://styles/mapbox/satellite-v9',
  center: [gps[1].innerHTML, gps[0].innerHTML],
  zoom: 8,
  // interactive: false
});

var marker = new mapboxgl.Marker()
  .setLngLat([gps[1].innerHTML, gps[0].innerHTML])
  .addTo(map);
