let map;

function initMap(lat, lon) {
  if (!lat || !lon) {
    lat = 40.249232;
    lon = -111.649238;
  }
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: lat, lng: lon},
    zoom: 15,
    mapTypeId: 'satellite'
  });

  new google.maps.Marker({
    position: {lat: lat, lng: lon},
    map,
    label: toString(lat) + ", " + toString(lon)
  });
}

function createMap(element) {
  let loc = element.currentTarget.alt.split(' ');
  let lat = parseFloat(loc[0]);
  let lon = parseFloat(loc[1]);
  initMap(lat, lon);
}

document.getElementById('picture1').addEventListener('click', createMap);
document.getElementById('picture2').addEventListener('click', createMap);
document.getElementById('picture3').addEventListener('click', createMap);
document.getElementById('headPic').addEventListener('click', createMap);
