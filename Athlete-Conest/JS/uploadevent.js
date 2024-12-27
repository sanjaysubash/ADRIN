document.addEventListener('DOMContentLoaded', function () {
    const uploadEventForm = document.getElementById('uploadEventForm');

    // Event listener for form submission
    uploadEventForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Gather form data
        const formData = new FormData();
        formData.append('title', document.getElementById('eventTitle').value);
        formData.append('description', document.getElementById('eventDescription').value);
        formData.append('location', document.getElementById('eventLocation').value);
        formData.append('date', document.getElementById('eventDate').value);
        formData.append('contactDetails', document.getElementById('eventContactDetails').value);

        // Append photo files
        const photoFiles = document.getElementById('eventPhotos').files;
        for (let i = 0; i < photoFiles.length; i++) {
            formData.append('photos', photoFiles[i]);
        }

        // Append video files
        const videoFiles = document.getElementById('eventVideos').files;
        for (let i = 0; i < videoFiles.length; i++) {
            formData.append('videos', videoFiles[i]);
        }

        // Send form data to the server
        try {
            const response = await fetch('/uploadevent', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                alert('Event uploaded successfully!');
                uploadEventForm.reset(); // Reset form after successful submission
            } else {
                console.error('Failed to upload event:', result);
                alert(`Failed to upload event: ${result.message}`);
            }
        } catch (error) {
            console.error('Error uploading event:', error);
            alert('An error occurred while uploading the event.');
        }
    });
});
