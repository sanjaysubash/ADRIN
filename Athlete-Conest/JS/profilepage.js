// Function to load profile data
async function loadProfile() {
    try {
        // Make an API request to fetch user profile data
        const response = await fetch('/profile');  

        if (!response.ok) {
            throw new Error(`Failed to load user data: ${response.status} ${response.statusText}`);
        }

        const userData = await response.json();  // Parse the JSON response

        // Update the username and email fields with the fetched data
        document.getElementById('username').textContent = userData.username || 'Username not set';
        document.getElementById('email').textContent = userData.email ? `Email: ${userData.email}` : 'Email not set';

        // Update the profile picture if available
        const profilePictureElement = document.querySelector('.profile-picture');
        if (userData.profilePicture) {
            // If the user has uploaded a profile picture, display it
            profilePictureElement.src = userData.profilePicture;
            profilePictureElement.alt = `${userData.username}'s Profile Picture`;
        } else {
            // Fallback to a default profile picture if not available
            profilePictureElement.src = '/Athlete-Conest/ASSETS/default-profile.png';  // Default image
            profilePictureElement.alt = 'Default Profile Picture';
        }
    } catch (error) {
        // Handle any errors that occur during the fetch request
        console.error('Error fetching user data:', error);
        alert('An error occurred while loading your profile. Please try again later.');
    }
}

// Call the function to load user profile data when the page is loaded
loadProfile();

// Function to handle logout functionality
async function logout() {
    try {
        const response = await fetch('/logout', {
            method: 'POST',  // Send POST request to logout endpoint
            credentials: 'same-origin'  // Ensure that the session cookie is sent with the request
        });

        if (response.ok) {
            // Redirect to login page after successful logout
            window.location.href = '/Athlete-Conest/HTML/LOGINHTML/userlogin.html';  
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}
