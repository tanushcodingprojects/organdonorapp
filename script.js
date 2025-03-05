let map;
let markers = [];
let userLocation;
const locations = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 47.6101, lng: -122.2015 }, // Bothell, WA
        zoom: 10,
    });

    // Get user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            map.setCenter(userLocation);
            new google.maps.Marker({
                position: userLocation,
                map: map,
                title: "Your Location",
                icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            });
        });
    }
}

document.getElementById("location-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const locationName = document.getElementById("location-name").value;
    const locationAddress = document.getElementById("location-address").value;

    addLocation(locationName, locationAddress);
});

function addLocation(name, address) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, function(results, status) {
        if (status === 'OK') {
            const location = {
                name: name,
                address: address,
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng(),
            };
            locations.push(location);

            const marker = new google.maps.Marker({
                position: location,
                map: map,
                title: name,
            });
            markers.push(marker);

            const infoWindow = new google.maps.InfoWindow({
                content: `<h3>${name}</h3><p>${address}</p>`,
            });
            marker.addListener("click", function() {
                infoWindow.open(map, marker);
            });
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

document.getElementById("find-closest").addEventListener("click", function() {
    if (userLocation && locations.length > 0) {
        findClosestLocation();
    } else {
        alert("User location or locations not available.");
    }
});

function findClosestLocation() {
    let closestLocation = null;
    let closestDistance = Infinity;
    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
        {
            origins: [userLocation],
            destinations: locations.map(loc => ({ lat: loc.lat, lng: loc.lng })),
            travelMode: 'DRIVING',
        },
        function(response, status) {
            if (status === 'OK') {
                const results = response.rows[0].elements;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].distance.value < closestDistance) {
                        closestDistance = results[i].distance.value;
                        closestLocation = locations[i];
                    }
                }
                displayClosestLocation(closestLocation, closestDistance, results.find(result => result.distance.value === closestDistance).duration.text);
            } else {
                alert("Distance Matrix request was not successful for the following reason: " + status);
            }
        }
    );
}

function displayClosestLocation(location, distance, duration) {
    const trackingResult = document.getElementById('tracking-result');
    trackingResult.innerHTML = `
        <h3>Closest Location</h3>
        <p><strong>Name:</strong> ${location.name}</p>
        <p><strong>Address:</strong> ${location.address}</p>
        <p><strong>Distance:</strong> ${(distance / 1000).toFixed(2)} km</p>
        <p><strong>Estimated Time:</strong> ${duration}</p>
    `;
}
