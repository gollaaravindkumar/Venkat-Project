let projects = [
    {
        id: 1,
        title: "Auto Irrigation System",
        description: "An automated irrigation system that uses soil moisture sensors to water plants only when necessary, saving water and improving plant health.",
        components: ["Arduino Uno", "Soil Moisture Sensor", "Relay Module", "Submersible Water Pump", "Jumper Wires"],
        image: "./images/auto_irrigation.jpg"
    },
    {
        id: 2,
        title: "Air Quality Monitoring System",
        description: "A system that measures air quality by detecting levels of harmful gases like CO2 and displays the data on an LCD screen.",
        components: ["Arduino Uno", "MQ-135 Gas Sensor", "16x2 LCD Display", "Potentiometer", "Jumper Wires"],
        image: "./images/air_quality.jpg"
    },
    {
        id: 3,
        title: "Line Following Robot",
        description: "A robot that follows a black line on a white surface using sensors and a motor driver.",
        components: ["Arduino Uno", "L298N Motor Driver", "IR Sensors", "DC Motors", "Wheels"],
        image: "./images/line_following.jpg"
    },
    {
        id: 4,
        title: "Obstacle Avoidance Voice Control Robot",
        description: "A robot that avoids obstacles and can be controlled using voice commands through Bluetooth.",
        components: ["Arduino Uno", "HC-SR04 Ultrasonic Sensor", "HC-05 Bluetooth Module", "L298N Motor Driver", "DC Motors"],
        image: "./images/obstacle_robot.jpg"
    },
    {
        id: 5,
        title: "Sign Language Conversion",
        description: "A glove-based system that translates sign language gestures into text or speech, enhancing communication for the hearing impaired.",
        components: ["Arduino Uno", "Flex Sensors", "Bluetooth Module", "Glove", "OLED Display"],
        image: "./images/sign_language.jpg"
    },
    {
        id: 6,
        title: "Smart Door Bell",
        description: "A smart doorbell system that uses a PIR sensor to detect motion, an IR sensor to detect proximity, and a buzzer for notifications. It provides security and alerts you when someone is at the door.",
        components: ["Arduino Uno", "PIR Motion Sensor", "IR Proximity Sensor", "Buzzer", "Push Button", "LEDs", "Resistors"],
        image: "./images/image.jpg"
    },
    {
        id: 7,
        title: "Weather Monitoring System",
        description: "A device that monitors and records environmental parameters like temperature, humidity, and pressure.",
        components: ["Arduino Uno", "DHT11 Sensor", "BMP180 Sensor", "SD Card Module", "LCD Display"],
        image: "./images/image.jpg"
    },
    {
        id: 8,
        title: "River and Drain Cleaning Robot",
        description: "A robot designed to clean rivers and drains by collecting floating waste materials.",
        components: ["Arduino Uno", "DC Motors", "Motor Driver", "Floating Frame", "Waste Collector Basket"],
        image: "./images/image.jpg"
    },
    {
        id: 9,
        title: "Waste Segregation System",
        description: "A system that separates waste into biodegradable and non-biodegradable categories using sensors.",
        components: ["Arduino Uno", "IR Sensor", "Servo Motor", "Metal Sensor", "Waste Bins"],
        image: "./images/image.jpg"
    },
    {
        id: 10,
        title: "Fire Fighting Robot",
        description: "A robot capable of detecting and extinguishing fires using a flame sensor and a water pump.",
        components: ["Arduino Uno", "Flame Sensor", "DC Motors", "Relay Module", "Water Pump"],
        image: "./images/image.jpg"
    },
    {
        id: 11,
        title: "Footstep Energy Generator",
        description: "A sustainable energy solution that generates electricity from footsteps using piezoelectric sensors.",
        components: ["Piezoelectric Sensors", "Arduino Uno", "Rectifier Circuit", "Battery", "LED Display"],
        image: "./images/footstepenergygenerator.jpg"
    },
    {
        id: 12,
        title: "Customized Wind Turbine",
        description: "A compact and efficient wind turbine designed to capture wind energy and convert it into electricity. This turbine can be easily deployed in public spaces to harness renewable energy, providing sustainable power for small devices and contributing to green energy solutions in urban areas.",
        components: ["Wind Turbine Blades", "Arduino Uno", "DC Motor", "Rectifier Circuit", "Battery", "LED Display"],
        image: "./images/image.jpg"
    }
    
];

let currentProject = null;

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Simple validation
    if (username === "admin" && password === "1234") {
        // Hide the current authentication section
        document.getElementById('auth').style.display = 'none';

        // Show splash animation before redirection
        const splashScreen = document.createElement('div');
        splashScreen.classList.add('splash-screen');
        splashScreen.innerHTML = `
            <img src="./images/logo.jpg" alt="Logo" class="logo">
            <p>Redirecting to Home...</p>
        `;
        document.body.appendChild(splashScreen);

        // Delay for the splash animation before redirecting
        setTimeout(() => {
            window.location.href = "home.html";
        }, 2000); // 2-second delay
    } else {
        alert("Invalid username or password.");
    }
}

function register() {
    alert("Registration successful! Please log in.");
    showLogin();
}

function showLogin() {
    document.getElementById('login').style.display = 'block';
    document.getElementById('register').style.display = 'none';
}

function showRegister() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('register').style.display = 'block';
}


function loadProjects() {
    let projectList = document.getElementById('projectList');
    projectList.innerHTML = '';
    projects.sort((a, b) => a.title.localeCompare(b.title)).forEach(project => {
        let card = document.createElement('div');
        card.className = 'projectCard';
        card.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <h3>${project.title}</h3>
            <button onclick="viewDetails(${project.id})">View Details</button>
        `;
        projectList.appendChild(card);
    });
}
// Function for dynamic search to filter projects
function dynamicSearch() {
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();
    const projectList = document.getElementById('projectList').children;
    
    for (let i = 0; i < projectList.length; i++) {
        let projectTitle = projectList[i].querySelector('h3').textContent.toLowerCase();
        if (projectTitle.includes(searchQuery)) {
            projectList[i].style.display = '';
        } else {
            projectList[i].style.display = 'none';
        }
    }
}


function viewDetails(id) {
    currentProject = projects.find(p => p.id === id);
    document.getElementById('home').style.display = 'none';
    document.getElementById('projectDetails').style.display = 'block';
    document.getElementById('projectTitle').innerText = currentProject.title;
    document.getElementById('projectImage').src = currentProject.image;
    document.getElementById('projectDescription').innerText = currentProject.description;
    document.getElementById('componentsUsed').innerHTML = currentProject.components.map(c => `<li>${c}</li>`).join('');
}

function fetchProjectDetails() {
    const selectedProjectId = document.getElementById('projectSelect').value;
    currentProject = projects.find(p => p.id === parseInt(selectedProjectId));
    document.getElementById('projectDetails').classList.remove('hidden');
    document.getElementById('projectTitle').innerText = currentProject.title;
    document.getElementById('projectImage').src = currentProject.image;
    document.getElementById('projectDescription').innerText = currentProject.description;
    document.getElementById('componentsUsed').innerHTML = currentProject.components.map(c => `<li>${c}</li>`).join('');
}






















  


function buyNow() {
    let name = document.getElementById('name').value;
    let phoneNumber = document.getElementById('phoneNumber').value;
    let email = document.getElementById('email').value;
    let address = document.getElementById('address').value;

    if (!currentProject) {
        alert('Please select a project before proceeding.');
        return;
    }

    // Show processing message overlay
    document.getElementById('processingMessage').classList.remove('hidden');
    document.getElementById('successMessage').classList.add('hidden');

    // Simulate order processing
    setTimeout(() => {
        fetch('http://localhost:3003/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                phoneNumber,
                address,
                email,
                project: {
                    title: currentProject.title
                }
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            if (data.success) {
                // Hide processing message and show success message
                document.getElementById('processingMessage').classList.add('hidden');
                document.getElementById('successMessage').classList.remove('hidden');
                
                // Show centered "Order Booked" message
                document.getElementById('orderBookedModal').classList.remove('hidden');
                
                // Hide after 3 seconds and redirect
                setTimeout(() => {
                    document.getElementById('orderBookedModal').classList.add('hidden');
                    backToHome(); // Ensure redirect happens after modal hides
                }, 3000); // Hide modal and redirect after 3 seconds
            } else {
                throw new Error(data.message || 'Error placing order');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('processingMessage').classList.add('hidden');
            document.getElementById('orderBookedModal').classList.remove('hidden');
            
            // Hide modal and redirect after 3 seconds (if there's an error)
            setTimeout(() => {
                document.getElementById('orderBookedModal').classList.add('hidden');
                backToHome(); // Ensure redirect happens after modal hides
            }, 3000); // Hide modal and redirect after 3 seconds
        });
    }, 1000);
}

function backToHome() {
    window.location.href = 'home.html';  // Redirect to home page
}


















document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('splashScreen').style.display = 'none';
        document.getElementById('auth').style.display = 'flex';
    }, 3000);
});

function dynamicSearch() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(query));
    const projectList = document.getElementById('projectList');
    projectList.innerHTML = '';

    filteredProjects.forEach(project => {
        let card = document.createElement('div');
        card.className = 'projectCard';
        card.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <h3>${project.title}</h3>
            <button onclick="viewDetails(${project.id})">View Details</button>
        `;
        projectList.appendChild(card);
    });
}

function checkout() {
    alert("Redirecting to payment gateway...");
}
