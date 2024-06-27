let map;
let service;
let infowindow;

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                createMap(location);
            },
            () => {
                handleLocationError(true);
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false);
    }
}

function createMap(location) {
    map = new google.maps.Map(document.getElementById("map"), {
        center: location,
        zoom: 15,
    });

    infowindow = new google.maps.InfoWindow();
}

function handleLocationError(browserHasGeolocation) {
    const defaultLocation = { lat: 40.730610, lng: -73.935242 }; // New York City as default
    const errorMessage = browserHasGeolocation
        ? 'Error: The Geolocation service failed.'
        : 'Error: Your browser doesn\'t support geolocation.';
    
    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 15,
    });

    infowindow = new google.maps.InfoWindow({
        map: map,
        position: defaultLocation,
        content: errorMessage,
    });
}

function pickRandomRestaurant() {
    if (!map) {
        console.error("Map is not initialized.");
        return;
    }

    const request = {
        location: map.getCenter(),
        radius: '1500',
        type: ['restaurant']
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
            const randomIndex = Math.floor(Math.random() * results.length);
            const place = results[randomIndex];
            createMarker(place);
            infowindow.setContent(place.name);
            infowindow.open(map, marker);
        } else {
            console.error("No restaurants found or Places Service failed: ", status);
        }
    });
}

function createMarker(place) {
    if (!place.geometry || !place.geometry.location) {
        console.error("Place does not have geometry or location data.");
        return;
    }

    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', () => {
        infowindow.setContent(place.name);
        infowindow.open(map, marker);
    });
}

document.addEventListener("DOMContentLoaded", initMap);
