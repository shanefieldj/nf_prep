async function fetchRestaurants() {
    try {
        const response = await fetch('https://kfunc-25.azurewebsites.net/api/HttpTrigger1?code=M0HWXiLP0Hl5fj8eUqvAFxph6Lx4dG3K2mBa9G4JGnpuAzFu6LG6ng%3D%3D'); // Replace with your actual function URL
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function pickRandomRestaurant() {
    const restaurants = await fetchRestaurants();
    if (restaurants && restaurants.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * restaurants.results.length);
        const restaurant = restaurants.results[randomIndex];
        alert(`Random Restaurant: ${restaurant.name}`);
    } else {
        alert('No restaurants found.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // You can add any initialization code here if needed
});
