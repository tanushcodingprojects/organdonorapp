let map;
let organs = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 10
    });
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const storedPassword = localStorage.getItem(email);

    if (storedPassword && storedPassword === password) {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('appPage').style.display = 'block';
    } else {
        alert('Invalid login credentials');
    }
}

function signUp() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    if (validateEmail(email) && password) {
        localStorage.setItem(email, password);
        alert('Account created successfully');
        window.location.href = 'index.html';
    } else {
        alert('Please enter a valid email and password');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function logout() {
    document.getElementById('appPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
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
