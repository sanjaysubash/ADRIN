// Fetch and load the current profile data
async function loadProfile() {
    try {
        const response = await fetch('/profile');  // Fetch user profile data from the backend

        if (!response.ok) {
            throw new Error(`Failed to load profile data: ${response.status} ${response.statusText}`);
        }

        const userData = await response.json();

        // Pre-fill the form with current user data
        document.getElementById('name').value = userData.username || '';
        document.getElementById('email').value = userData.email || '';
        
        // Optionally show the current profile picture (if available)
        const profilePicture = document.querySelector('#profile-picture');
        if (userData.profilePicture) {
            // If there's an existing profile picture, display it
            profilePicture.insertAdjacentHTML('beforebegin', `<img src="${userData.profilePicture}" alt="Current Profile Picture" id="current-profile-picture" style="max-width: 150px; margin-bottom: 10px;" />`);
        }

    } catch (error) {
        console.error('Error fetching profile data:', error);
        alert('An error occurred while loading your profile. Please try again later.');
    }
}

// Handle profile update form submission
async function handleProfileUpdate(event) {
    event.preventDefault();  // Prevent form from submitting normally

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const profilePicture = document.getElementById('profile-picture').files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (password) formData.append('password', password);  // Only include password if provided
    if (profilePicture) formData.append('profile-picture', profilePicture);

    try {
        const response = await fetch('/edit-profile', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',  // Include session cookie
        });

        if (response.ok) {
            const data = await response.json();
            alert('Profile updated successfully');
            window.location.href = '/Athlete-Conest/HTML/profilepage.html'; // Redirect to the profile page
        } else {
            console.error('Error updating profile:', response.statusText);
            alert('Failed to update profile. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while updating your profile. Please try again later.');
    }
}

// Call the loadProfile function when the page is loaded
loadProfile();

// Attach event listener to the form
const editProfileForm = document.getElementById('editProfileForm');
editProfileForm.addEventListener('submit', handleProfileUpdate);
