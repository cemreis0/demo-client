const BASE_URL = "http://localhost:8080/api/v0";

function redirectToHome() {
    console.log("Redirecting to home page...")
    window.location.href = "/";
}

function signup(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const signupData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(signupData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Signup failed');
        }
        return response.text();
    })
    .then(data => {
        displayMessage('Signup successful', 'success');
        console.log(data); // You can do further processing with the response data if needed
    })
    .catch(error => {
        displayMessage('Signup failed', 'error');
        console.error('Error:', error);
    });
}


function login(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const loginData = {
        username: formData.get('username'),
        password: formData.get('password')
    };
    
    fetch(`${BASE_URL}/auth/authenticate`, {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        const token = data.detail;
        localStorage.setItem('token', token); // Store token in localStorage
        displayMessage('Login successful', 'success');
        console.log('Login successful');
    })
    .catch(error => {
        displayMessage('Login failed', 'error');
        console.error('Error:', error);
    });
}


function getUserInfo() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token not found');
        return;
    }
    
    fetch(`${BASE_URL}/user/get`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }
        return response.json();
    })
    .then(data => {
        // Access user information from the 'detail' field
        let userDetail = data.detail;
        let username = userDetail.username || 'N/A';
        let firstName = userDetail.firstName || 'N/A';
        let lastName = userDetail.lastName || 'N/A';
        let email = userDetail.email || 'N/A';
        let about = userDetail.about ? userDetail.about : 'No information provided';
        let followersText = userDetail.followersList ? `Followers: ${userDetail.followersList.length}` : 'No followers';
        let followingText = userDetail.followingList ? `Following: ${userDetail.followingList.length}` : 'Not following anyone yet';
        let role = userDetail.role || 'N/A';
        let id = userDetail.id || 'N/A';
        
        // Display user information in HTML
        document.getElementById('userInfoData').innerHTML = `
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>First Name:</strong> ${firstName}</p>
            <p><strong>Last Name:</strong> ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Role:</strong> ${role}</p>
            <p><strong>ID:</strong> ${id}</p>
            <p><strong>About:</strong> ${about}</p>
            <p>${followersText}</p>
            <p>${followingText}</p>
        `;
    })
    .catch(error => console.error('Error:', error));
}

function displayMessage(message, messageType) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('message');

    if (messageType === 'error') {
        messageElement.classList.add('error');
    }

    document.body.appendChild(messageElement);

    // Trigger reflow to apply initial opacity settings
    messageElement.offsetHeight;

    // Make the message visible
    messageElement.classList.add('visible');

    // Clear the message after a certain duration
    setTimeout(() => {
        // Hide the message
        messageElement.classList.remove('visible');

        // Remove the message from the DOM after the transition ends
        messageElement.addEventListener('transitionend', () => {
            messageElement.remove();
        }, { once: true });
    }, 5000); // Clear message after 5 seconds (adjust as needed)
}
