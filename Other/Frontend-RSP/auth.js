async function handleLogin(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the username and password from the form
    const username = document.getElementById('login').value;
    const password = document.getElementById('psw').value;

    // Prepare the payload to send in the POST request
    const payload = {
        login: username,
        password: password
    };

    // Call the /authenticate endpoint
    try {
        const response = await fetch('../Backend-RSP/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Ensure the body is in JSON format
            },
            body: JSON.stringify(payload) // Send the username and password as JSON
        });

        // Check if the response status is OK (200)
        if (response.ok) {
            // Parse the JSON response
            const data = await response.json();

            // Get the JWT from the response (it should be in the "jwt" key)
            const token = data.jwt;

            // Store the token in localStorage (or sessionStorage)
            localStorage.setItem('jwt', token);

            // Optionally, you can also store the expiration time if you need it
            localStorage.setItem('expireAt', data.expireAt);

             const decodedToken = decodeJWT(token);

            // Redirect based on the role in the decoded token
            redirectBasedOnRole(decodedToken);
        } else {
            // Handle error: login failed
            const errorData = await response.json();
            alert('Login failed: ' + errorData.message);
        }
    } catch (error) {
        // Handle network or other errors
        console.error('Error during login:', error);
        alert('An error occurred while trying to log in. Please try again.');
    }
}

function decodeJWT(token) {
    const payload = token.split('.')[1];  // Get the payload from the token
    const decoded = atob(payload); // Decode base64
    return JSON.parse(decoded); // Return the JSON object containing user data
}

// Function to redirect based on the user's role
function redirectBasedOnRole(decodedToken) {
    const userRole = decodedToken.data.role; // Extract the role from the token

    // Redirect user based on their role
    switch (userRole) {
        case 4:
            // Redirect to the admin page
            window.location.href = 'admin-main.html';
            break;
        case 2:
            // Redirect to the editor page
            window.location.href = 'editor-main.html';
            break;
        case 3:
            // Redirect to the reviewer page
            window.location.href = 'reviewer-main.html';
            break;
        case 1:
            // Redirect to the writer page
            window.location.href = 'writer-main.html';
            break;
        default:
            // Redirect to an error page or a default page if the role is unknown
            window.location.href = 'error.html';
            break;
    }
}


// Function to check if the JWT token is valid and not expired
function checkTokenValidity() {
    const token = localStorage.getItem('jwt'); // Retrieve the token from localStorage
    const expireAt = localStorage.getItem('expireAt'); // Retrieve the expiration time from localStorage

    if (!token || !expireAt) {
         if (!window.location.href.includes("index.html")) {
            window.location.href = 'index.html'; // Redirect to login if the user is not on the login page
        }
        return;
    }

    // Check if the token has expired
    const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds (epoch format)
    if (currentTime >= expireAt) {
        // If the token is expired, clear the localStorage and redirect to login page
        localStorage.removeItem('jwt');
        localStorage.removeItem('expireAt');
        window.location.href = 'index.html'; // Redirect to the login page
        return;
    }

    // Token is valid, decode it to get the user's role
    const decodedToken = decodeJWT(token);

    // Redirect user based on the role
    redirectBasedOnRole(decodedToken);
}

// Function to decode the JWT token
function decodeJWT(token) {
    const payload = token.split('.')[1];  // Get the payload from the token
    const decoded = atob(payload); // Decode base64
    return JSON.parse(decoded); // Return the JSON object containing user data
}

// Function to redirect based on the user's role
function redirectBasedOnRole(decodedToken) {
    const userRole = decodedToken.data.role; // Extract the role from the token

    // Redirect user based on their role
    switch (userRole) {
        case 4:
	     if (!window.location.href.includes("admin-main.html")) {

            window.location.href = 'admin-main.html';
}
            break;
        case 2:
 if (!window.location.href.includes("editor-main.html")) {

            window.location.href = 'editor-main.html';
}
            break;
        case 3:
 if (!window.location.href.includes("reviewer-main.html")) {

            window.location.href = 'reviewer-main.html';
}
            break;
        case 1:
 if (!window.location.href.includes("writer-main.html")) {

            window.location.href = 'writer-main.html';
}
            break;
        default:
            window.location.href = 'index.html'; // Default redirect in case of an unknown role
            break;
    }
}







// Attach the function to the form's submit event
document.getElementById('loginForm').addEventListener('submit', handleLogin);