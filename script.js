let map;
let service;
let infowindow;

function initMap() {
    const location = { lat: 40.730610, lng: -73.935242 }; // Example: New York City
    map = new google.maps.Map(document.getElementById("map"), {
        center: location,
        zoom: 15,
    });

    infowindow = new google.maps.InfoWindow();
}

function pickRandomRestaurant() {
    const request = {
        location: map.getCenter(),
        radius: '1500',
        type: ['restaurant']
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            const randomIndex = Math.floor(Math.random() * results.length);
            const place = results[randomIndex];
            createMarker(place);
            infowindow.setContent(place.name);
            infowindow.open(map);
        }
    });
}

function createMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
}

document.addEventListener("DOMContentLoaded", initMap);
