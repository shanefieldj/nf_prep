let map;
let infowindow;

function initMap() {
    const location = { lat: 40.730610, lng: -73.935242 }; // Example: New York City
    map = new google.maps.Map(document.getElementById("map"), {
        center: location,
        zoom: 15,
    });

    infowindow = new google.maps.InfoWindow();
}

async function fetchRestaurants() {
    try {
        const response = await fetch('https://kfunc-25.azurewebsites.net/api/HttpTrigger1?code=M0HWXiLP0Hl5fj8eUqvAFxph6Lx4dG3K2mBa9G4JGnpuAzFu6LG6ng%3D%3D'); // Replace with your actual function URL
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results; // Assuming your API returns a JSON object with a 'results' array
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function pickRandomRestaurant() {
    const restaurants = await fetchRestaurants();
    if (restaurants && restaurants.length > 0) {
        const randomIndex = Math.floor(Math.random() * restaurants.length);
        const place = restaurants[randomIndex];
        const location = new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng);
        
        createMarker(location, place.name);
        map.setCenter(location);
        infowindow.setContent(place.name);
        infowindow.open(map);
    } else {
        alert('No restaurants found.');
    }
}

function createMarker(location, name) {
    const marker = new google.maps.Marker({
        map: map,
        position: location
    });
    google.maps.event.addListener(marker, 'click', () => {
        infowindow.setContent(name);
        infowindow.open(map, marker);
    });
}

document.addEventListener("DOMContentLoaded", initMap);
