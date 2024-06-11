let map;
let service;
let infowindow;

function initMap() {
    // Default location (if geolocation fails)
    const defaultLocation = { lat: 40.730610, lng: -73.935242 }; // New York City

    // Initialize the map with the default location
    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 15,
    });

    infowindow = new google.maps.InfoWindow();

    // Try to get the user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(userLocation);
                findRestaurants(userLocation);
            },
            () => {
                // Handle location error (use default location)
                handleLocationError(true, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, pos) {
    infowindow.setPosition(pos);
    infowindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infowindow.open(map);
}

function findRestaurants(location) {
    const request = {
        location: location,
        radius: '1500',
        type: ['restaurant']
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            pickRandomRestaurant(results);
        }
    });
}

function pickRandomRestaurant(results) {
    const randomIndex = Math.floor(Math.random() * results.length);
    const place = results[randomIndex];
    createMarker(place);
    infowindow.setContent(place.name);
    infowindow.open(map);
}

function createMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
}

document.addEventListener("DOMContentLoaded", initMap);
