document.addEventListener('DOMContentLoaded', function() {
    const forgotForm = document.getElementById('forgotForm');
    const emailInput = document.getElementById('email');

    forgotForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevents the default form submission

        const email = emailInput.value.trim();

        // Validate email format
        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        try {
            // Send email to backend API
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            // Handle response from backend
            if (response.ok) {
                const data = await response.json();
                alert(data.message || "A password reset link has been sent to your email.");
            } else {
                const errorData = await response.json();
                alert(errorData.error || "An error occurred. Please try again later.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Unable to connect to the server. Please try again later.");
        }
    });

    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailPattern.test(email);
    }
});
