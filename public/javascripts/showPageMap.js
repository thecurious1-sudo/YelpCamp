mapboxgl.accessToken = mapBoxToken;
const campgroundJson = JSON.parse(campground);
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/light-v10", // style URL
  center: campgroundJson.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
  projection: "globe", // display the map as a 3D globe
});
map.addControl(new mapboxgl.NavigationControl());
const popup = new mapboxgl.Popup({ offset: 25 , closeButton:false}).setHTML(`<h6>${campgroundJson.title}</h6><p>${campgroundJson.location}</p>`);
const marker1 = new mapboxgl.Marker()
    .setLngLat(campgroundJson.geometry.coordinates)
    .setPopup(popup)
  .addTo(map);

map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});
