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
    title: toString(lat) + ", " + toString(lon)
  });

  getLocation();
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

var x = document.getElementById("flights");
function getLocation() {
  document.getElementById("flights").innerHTML = "<h3>Loading...</h3>";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getAirport);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function getAirport(position) {
  const url = "https://test.api.amadeus.com/v1/security/oauth2/token";
  fetch(url, {
    method: 'POST',
    body : new URLSearchParams({
      'grant_type':'client_credentials',
      'client_id':'ZV89lJIPsyKxJdTd5hemEIKUECEd5Y4N',
      'client_secret':'o9A3Mw0onqWde4rI',
    }),
    headers: {
      "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8"
    }
  }).then(function(response) {
    return response.json();
  }).then(function(json) {

    const url2 = "https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=" + position.coords.latitude + "&longitude=" + position.coords.longitude;

    authKey = "Bearer " + json.access_token;
    fetch(url2, {
      headers: {
        'Authorization' : authKey
      }
    })
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      let airport = json.data[0].iataCode;
      getFlights(airport, authKey);
    });
  })
}

function getFlights(airport, authKey) {
  let country = document.getElementById('title').textContent;
  let airportDest = '';
  if (country == "China") {
    airportDest = 'PVG';
  } else if (country == 'Colombia') {
    airportDest = 'MDE';
  } else if (country == 'Peru') {
    airportDest = 'LIM';
  }

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;

  const url = 'https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=' + airport + '&destinationLocationCode=' + airportDest + '&departureDate=' + today + '&adults=1&nonStop=false&currencyCode=USD&max=5';

  fetch(url, {
    headers: {
      'Authorization' : authKey
    }
  })
  .then(function(response) {
    return response.json();
  }).then(function(json) {
    console.log(json.data[0].itineraries[0].segments);
    let flight = "";

    if (json.data.length == 0) {
      flight += "<div class='flight'>";
      flight += "<h3>No Flights Found to " + airportDest + " from " + airport + "</h3>";
      flight += "</div>";
    }
    for (let i=0; i < json.data.length; i++) {
      flight += "<div class='flight'>";
      for (let j=0; j < json.data[i].itineraries[0].segments.length; j++) {
        flight += "<h3>" + json.data[i].itineraries[0].segments[j].departure.iataCode + " -> " + json.data[i].itineraries[0].segments[j].arrival.iataCode + "</h3>";
        flight += "<p>" + moment(json.data[i].itineraries[0].segments[j].departure.at).format('M/D/YY HH:mm') + " -> " + moment(json.data[i].itineraries[0].segments[j].arrival.at).format('M/D/YY HH:mm');
      }
      flight += "<p class='price'>Price: $" + json.data[i].price.total + "</p>";
      flight += "</div>";
    }
    document.getElementById("flights").innerHTML = flight;

  });

}
