let map;
let organs = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 10
    });
}

function showSignUp() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('signupPage').style.display = 'block';
}

function showLogin() {
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('signupPage').style.display = 'none';
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

    if (email && password) {
        localStorage.setItem(email, password);
        alert('Account created successfully');
        showLogin();
    } else {
        alert('Please enter both email and password');
    }
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
