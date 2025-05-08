// Firebase modular imports (v9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
console.log("create-account.js loaded!");
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
    
    // Add these lines
    provider.addScope('profile');
    provider.addScope('email');

    // Expose Firebase Auth functions and objects to the window for debugging
    window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
    window.getAuth = getAuth;
    window.auth = auth;

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
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            console.log('Form submitted');
            const fullname = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            console.log('Email:', email);
            console.log('Password:', password);
            
            // Simple form validation
            if (!fullname || !email || !password || !confirmPassword) {
                showAlert('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            // Password validation
            if (password.length < 6) {
                showAlert('Password must be at least 6 characters', 'error');
                return;
            }
            
            // Password confirmation
            if (password !== confirmPassword) {
                showAlert('Passwords do not match', 'error');
                return;
            }
            
            // Create user with Firebase
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    console.log('User created successfully:', userCredential.user);
                    // Signed in 
                    const user = userCredential.user;
                    
                    // Save user data to localStorage for demo purposes
                    // In a real app, you would use Firebase Database or Firestore
                    localStorage.setItem('gfin_user', JSON.stringify({
                        fullname,
                        email,
                        uid: user.uid
                    }));
                    
                    // Add email to the saved emails list
                    saveEmailToList(email);
                    
                    showAlert('Account created successfully!', 'success');
                    
                    // Redirect to survey page after a short delay
                    setTimeout(() => {
                        window.location.href = "survey.html";
                    }, 1500);
                })
                .catch((error) => {
                    console.log('Error creating user:', error);
                    const errorCode = error.code;
                    let errorMessage = error.message;
                    
                    // Provide more user-friendly error messages
                    if (errorCode === 'auth/email-already-in-use') {
                        errorMessage = 'This email is already registered. Please try logging in.';
                    }
                    
                    showAlert(errorMessage, 'error');
                });
        });
    }
    
    // Add Google Sign-in button functionality
    const btnCreate = document.querySelector('.btn-create');
    if (btnCreate) {
        // Add Google Sign-in button after the Create Account button
        const googleSignIn = document.createElement('button');
        googleSignIn.type = 'button';
        googleSignIn.id = 'google-signin-btn';
        googleSignIn.className = 'btn-google';
        googleSignIn.innerHTML = '<i class="fab fa-google"></i> Sign up with Google';
        googleSignIn.style.marginTop = '10px';
        googleSignIn.style.backgroundColor = '#fff';
        googleSignIn.style.color = '#333';
        googleSignIn.style.border = '1px solid #ddd';
        googleSignIn.style.padding = '10px';
        googleSignIn.style.borderRadius = '8px';
        googleSignIn.style.display = 'flex';
        googleSignIn.style.alignItems = 'center';
        googleSignIn.style.justifyContent = 'center';
        googleSignIn.style.gap = '10px';
        googleSignIn.style.cursor = 'pointer';
        googleSignIn.style.width = '100%';
        
        btnCreate.parentNode.insertBefore(googleSignIn, btnCreate.nextSibling);
        
        googleSignIn.addEventListener('click', () => {
            console.log('Google Sign-In button clicked');
            console.log('Current domain:', window.location.hostname);
            console.log('Current URL:', window.location.href);
            
            // Configure Google Sign-In
            provider.setCustomParameters({
                prompt: 'select_account',
                auth_type: 'reauthenticate'
            });
            
            signInWithPopup(auth, provider)
                .then((result) => {
                    console.log('Google sign-up successful:', result.user);
                    const user = result.user;
                    
                    // Save user data to localStorage
                    localStorage.setItem('gfin_user', JSON.stringify({
                        fullname: user.displayName || 'Google User',
                        email: user.email,
                        uid: user.uid
                    }));
                    
                    // Add email to the saved emails list
                    saveEmailToList(user.email);
                    
                    showAlert('Account created successfully with Google!', 'success');
                    
                    // Redirect to survey page after a short delay
                    setTimeout(() => {
                        window.location.href = "survey.html";
                    }, 1500);
                })
                .catch((error) => {
                    console.error('Google sign-up failed. Error code:', error.code);
                    console.error('Error details:', error);
                    let errorMessage = 'Google sign-up failed.';
                    
                    // Provide more specific error messages
                    switch (error.code) {
                        case 'auth/popup-blocked':
                            errorMessage = 'Please enable popups for this website to use Google Sign-In.';
                            break;
                        case 'auth/popup-closed-by-user':
                            errorMessage = 'Google Sign-In was cancelled. Please try again.';
                            break;
                        case 'auth/unauthorized-domain':
                            errorMessage = 'This domain is not authorized for Google Sign-In. Please make sure you are using localhost.';
                            break;
                        case 'auth/operation-not-allowed':
                            errorMessage = 'Google Sign-In is not enabled. Please contact support.';
                            break;
                        default:
                            errorMessage = error.message;
                    }
                    
                    showAlert(errorMessage, 'error');
                });
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
});
