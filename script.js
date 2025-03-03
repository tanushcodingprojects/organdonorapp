let map;
let organs = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.7749, lng: -122.4194 }, // Initial position
        zoom: 10
    });
}

function addOrgan() {
    const organInput = document.getElementById('organ').value;
    const locationInput = document.getElementById('location').value.split(',');

    const organ = {
        name: organInput,
        location: { lat: parseFloat(locationInput[0]), lng: parseFloat(locationInput[1]) }
    };

    organs.push(organ);
    addMarker(organ);
}

function addMarker(organ) {
    const marker = new google.maps.Marker({
        position: organ.location,
        map: map,
        title: organ.name
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `<h3>${organ.name}</h3><p>Location: ${organ.location.lat}, ${organ.location.lng}</p>`
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}

