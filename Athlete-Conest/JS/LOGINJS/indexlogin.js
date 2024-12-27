document.addEventListener('DOMContentLoaded', function() {
    const userLoginButton = document.querySelector('.login-card a[href="../HTML/LOGINHTML/user-login.html"]');
    const orgLoginButton = document.querySelector('.login-card a[href="../HTML/LOGINHTML/organization-login.html"]');

    if (userLoginButton) {
        userLoginButton.addEventListener('click', function(event) {
            event.preventDefault();
            // Redirect to user login page
            window.location.href = "../HTML/LOGINHTML/user-login.html";
        });
    }

    if (orgLoginButton) {
        orgLoginButton.addEventListener('click', function(event) {
            event.preventDefault();
            // Redirect to organization login page
            window.location.href = "../HTML/LOGINHTML/organization-login.html";
        });
    }
});
