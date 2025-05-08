// Firebase modular imports (v9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function() {
    // Firebase configuration (replace with your Firebase config)
    const firebaseConfig = {
        apiKey: "AIzaSyDcPXZdJwAJ8knxV8b1GXOL9Ao2-zPjBRU",
        authDomain: "designthinking-673c8.firebaseapp.com",
        projectId: "designthinking-673c8",
        storageBucket: "designthinking-673c8.appspot.com",
        messagingSenderId: "999430596778",
        appId: "1:999430596778:web:66f3b0424e2ed4295008d3",
        measurementId: "G-B41S4RSEJ7"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    // Setup email dropdown for previously used emails
    setupEmailDropdown();

    // Toggle password visibility
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('#password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    // Form submission handling
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember').checked;
            
            // Simple form validation
            if (!email || !password) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            // Sign in with Firebase
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    
                    // Add email to saved emails list if not already there
                    saveEmailToList(email);
                    
                    showAlert('Login successful!', 'success');
                    
                    // Store login state if remember me is checked
                    if (rememberMe) {
                        localStorage.setItem('gfin_login_state', 'logged_in');
                    } else {
                        sessionStorage.setItem('gfin_login_state', 'logged_in');
                    }
                    
                    // Redirect to survey page after a short delay
                    setTimeout(() => {
                        window.location.href = "survey.html";
                    }, 1500);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    let errorMessage = "Login failed. Please check your email and password.";
                    
                    if (errorCode === 'auth/user-not-found') {
                        errorMessage = 'No account found with this email. Please create an account first.';
                    } else if (errorCode === 'auth/wrong-password') {
                        errorMessage = 'Incorrect password. Please try again.';
                    }
                    
                    showAlert(errorMessage, 'error');
                });
        });
    }
    
    // Google Sign-In Button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        // Update button styling
        loginBtn.innerHTML = '<i class="fab fa-google"></i> Continue with Google';
        loginBtn.className = 'btn-google';
        loginBtn.style.marginTop = '20px';
        loginBtn.style.backgroundColor = '#fff';
        loginBtn.style.color = '#333';
        loginBtn.style.border = '1px solid #ddd';
        loginBtn.style.padding = '10px';
        loginBtn.style.borderRadius = '8px';
        loginBtn.style.display = 'flex';
        loginBtn.style.alignItems = 'center';
        loginBtn.style.justifyContent = 'center';
        loginBtn.style.gap = '10px';
        loginBtn.style.cursor = 'pointer';
        loginBtn.style.width = '100%';
        
        loginBtn.addEventListener('click', () => {
            signInWithPopup(auth, provider)
                .then((result) => {
                    const user = result.user;
                    
                    // Add email to saved emails list
                    saveEmailToList(user.email);
                    
                    // Store user info and login state
                    localStorage.setItem('gfin_user', JSON.stringify({ 
                        email: user.email,
                        displayName: user.displayName,
                        uid: user.uid
                    }));
                    localStorage.setItem('gfin_login_state', 'logged_in');
                    
                    showAlert('Login successful with Google! Your user ID: ' + user.uid, 'success');
                    
                    setTimeout(() => {
                        window.location.href = "survey.html";
                    }, 1500);
                })
                .catch((error) => {
                    console.error(error);
                    showAlert('Google sign-in failed.', 'error');
                });
        });
    }
    
    // Function to set up the email dropdown for previously used emails
    function setupEmailDropdown() {
        const emailInput = document.getElementById('email');
        if (!emailInput) return;
        
        // Create a wrapper div for the input and dropdown
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'email-input-wrapper';
        inputWrapper.style.position = 'relative';
        inputWrapper.style.width = '100%';
        
        // Replace the input with the wrapper
        emailInput.parentNode.insertBefore(inputWrapper, emailInput);
        inputWrapper.appendChild(emailInput);
        
        // Create the dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'email-dropdown';
        dropdown.style.display = 'none';
        dropdown.style.position = 'absolute';
        dropdown.style.top = '100%';
        dropdown.style.left = '0';
        dropdown.style.width = '100%';
        dropdown.style.backgroundColor = '#fff';
        dropdown.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        dropdown.style.borderRadius = '8px';
        dropdown.style.marginTop = '5px';
        dropdown.style.zIndex = '100';
        dropdown.style.maxHeight = '200px';
        dropdown.style.overflowY = 'auto';
        inputWrapper.appendChild(dropdown);
        
        // Populate dropdown with saved emails
        const savedEmails = localStorage.getItem('gfin_saved_emails');
        if (savedEmails) {
            const emailsArray = JSON.parse(savedEmails);
            
            if (emailsArray.length > 0) {
                emailsArray.forEach(email => {
                    const emailItem = document.createElement('div');
                    emailItem.className = 'email-item';
                    emailItem.textContent = email;
                    emailItem.style.padding = '10px 15px';
                    emailItem.style.cursor = 'pointer';
                    emailItem.style.borderBottom = '1px solid #f0f0f0';
                    
                    emailItem.addEventListener('mouseover', () => {
                        emailItem.style.backgroundColor = '#f0f0f0';
                    });
                    
                    emailItem.addEventListener('mouseout', () => {
                        emailItem.style.backgroundColor = '#fff';
                    });
                    
                    emailItem.addEventListener('click', () => {
                        emailInput.value = email;
                        dropdown.style.display = 'none';
                    });
                    
                    dropdown.appendChild(emailItem);
                });
            }
        }
        
        // Show dropdown when clicking the input
        emailInput.addEventListener('click', () => {
            const savedEmails = localStorage.getItem('gfin_saved_emails');
            if (savedEmails && JSON.parse(savedEmails).length > 0) {
                dropdown.style.display = 'block';
            }
        });
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!inputWrapper.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
        
        // Filter dropdown based on input
        emailInput.addEventListener('input', () => {
            const savedEmails = localStorage.getItem('gfin_saved_emails');
            if (!savedEmails) return;
            
            const emailsArray = JSON.parse(savedEmails);
            const inputValue = emailInput.value.toLowerCase();
            
            // Clear existing items
            dropdown.innerHTML = '';
            
            // Filter and add matching emails
            const filteredEmails = emailsArray.filter(email => 
                email.toLowerCase().includes(inputValue)
            );
            
            if (filteredEmails.length > 0) {
                filteredEmails.forEach(email => {
                    const emailItem = document.createElement('div');
                    emailItem.className = 'email-item';
                    emailItem.textContent = email;
                    emailItem.style.padding = '10px 15px';
                    emailItem.style.cursor = 'pointer';
                    emailItem.style.borderBottom = '1px solid #f0f0f0';
                    
                    emailItem.addEventListener('mouseover', () => {
                        emailItem.style.backgroundColor = '#f0f0f0';
                    });
                    
                    emailItem.addEventListener('mouseout', () => {
                        emailItem.style.backgroundColor = '#fff';
                    });
                    
                    emailItem.addEventListener('click', () => {
                        emailInput.value = email;
                        dropdown.style.display = 'none';
                    });
                    
                    dropdown.appendChild(emailItem);
                });
                
                dropdown.style.display = 'block';
            } else {
                dropdown.style.display = 'none';
            }
        });
    }
    
    // Function to save email to the list of saved emails
    function saveEmailToList(email) {
        // Get existing saved emails
        let savedEmails = localStorage.getItem('gfin_saved_emails');
        let emailsArray = [];
        
        if (savedEmails) {
            emailsArray = JSON.parse(savedEmails);
            
            // Check if this email already exists
            if (!emailsArray.includes(email)) {
                emailsArray.push(email);
            }
        } else {
            emailsArray = [email];
        }
        
        // Save updated array back to localStorage
        localStorage.setItem('gfin_saved_emails', JSON.stringify(emailsArray));
    }
    
    // Check if user is already logged in
    function checkLoginState() {
        const persistentLogin = localStorage.getItem('gfin_login_state');
        const sessionLogin = sessionStorage.getItem('gfin_login_state');
        
        if (persistentLogin === 'logged_in' || sessionLogin === 'logged_in') {
            // For demo purposes, we'll keep them on the login page
            // but populate the email field
            const storedUser = localStorage.getItem('gfin_user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                const emailInput = document.getElementById('email');
                if (emailInput && user.email) {
                    emailInput.value = user.email;
                    
                    // If remember me was checked, check it again
                    if (persistentLogin === 'logged_in') {
                        const rememberCheckbox = document.getElementById('remember');
                        if (rememberCheckbox) {
                            rememberCheckbox.checked = true;
                        }
                    }
                }
            }
        }
    }
    
    // Alert function for success/error messages
    function showAlert(message, type) {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.textContent = message;
        
        // Add styles to the alert
        alert.style.position = 'fixed';
        alert.style.top = '20px';
        alert.style.left = '50%';
        alert.style.transform = 'translateX(-50%)';
        alert.style.padding = '15px 20px';
        alert.style.borderRadius = '8px';
        alert.style.zIndex = '1000';
        alert.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        alert.style.animation = 'fadeIn 0.3s';
        
        if (type === 'success') {
            alert.style.backgroundColor = '#10b981';
            alert.style.color = 'white';
        } else {
            alert.style.backgroundColor = '#ef4444';
            alert.style.color = 'white';
        }
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -20px); }
                to { opacity: 1; transform: translate(-50%, 0); }
            }
        `;
        document.head.appendChild(style);
        
        // Add alert to the DOM
        document.body.appendChild(alert);
        
        // Remove alert after 3 seconds
        setTimeout(() => {
            alert.style.animation = 'fadeOut 0.3s forwards';
            style.textContent += `
                @keyframes fadeOut {
                    from { opacity: 1; transform: translate(-50%, 0); }
                    to { opacity: 0; transform: translate(-50%, -20px); }
                }
            `;
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, 3000);
    }
    
    // Check login state on page load
    checkLoginState();
    
    // Handle the forgot password link
    const forgotPasswordLink = document.querySelector('.forgot');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the email from input
            const email = document.getElementById('email').value.trim();
            
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                // Would normally send password reset email via Firebase
                // For demo purposes, just show a notification
                showAlert('Password reset link sent to your email!', 'success');
            } else {
                showAlert('Please enter a valid email address first', 'error');
            }
        });
    }
});