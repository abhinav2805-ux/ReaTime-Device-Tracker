const socket = io();

// Watch the user's location and send updates to the server
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('send-location', { latitude, longitude });
    }, (error) => {
        console.log('Unable to fetch location', error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
}

// Initialize the map centered at [0,0] with a zoom level of 10
const map = L.map("map").setView([0, 0], 10);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "abhinav world"
}).addTo(map);

// Object to store markers for each user
const markers = {};

// Handle location updates received from the server
socket.on("received-location", (data) => {
    const { id, latitude, longitude } = data;
    
    // If the marker for this user already exists, update its position
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // Otherwise, create a new marker for this user
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

// Handle user disconnections
socket.on("user-disconnected", (id) => {
    // If the marker for the disconnected user exists, remove it from the map
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
