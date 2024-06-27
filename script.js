let map;
let service;
let infowindow;

function initMap(apiKey) {
    const defaultLocation = { lat: 40.730610, lng: -73.935242 }; // New York City

    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 15,
    });

    infowindow = new google.maps.InfoWindow();

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
                handleLocationError(true, map.getCenter());
            }
        );
    } else {
        handleLocationError(false, map.getCenter());
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
}

document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/getApiKey')
        .then(response => response.text())
        .then(apiKey => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
            script.async = true;
            document.head.appendChild(script);
        })
        .catch(error => console.error('Error fetching API key:', error));
});
