import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);
let currentUser = null;

// Main initialization function
function initializeSurvey() {
    console.log('Initializing survey...');
    const sections = document.querySelectorAll('.survey-section');
    const totalSections = sections.length - 1; // Exclude completion section
    const progressBar = document.getElementById('survey-progress');
    let currentSectionIndex = 0;

    // Initialize dynamic questions
    initDynamicQuestions();
    updateProgressBar();

    // Next button click handlers
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', function() {
            console.log('Next button clicked');
            const currentSection = this.closest('.survey-section');
            const nextSectionId = this.getAttribute('data-next');
            
            if (currentSection && nextSectionId) {
                console.log('Current section:', currentSection.id);
                console.log('Next section:', nextSectionId);
                
                // Hide current section
                currentSection.classList.add('hidden');
                
                // Show next section
                const nextSection = document.getElementById(`section-${nextSectionId}`);
                if (nextSection) {
                    nextSection.classList.remove('hidden');
                    // Update progress tracking
                    currentSectionIndex = Array.from(sections).findIndex(section => section.id === `section-${nextSectionId}`);
                    updateProgressBar();
                    window.scrollTo(0, 0);
                } else {
                    console.error('Next section not found:', nextSectionId);
                }
            }
        });
    });

    // Previous button click handlers
    document.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', function() {
            const currentSection = this.closest('.survey-section');
            const prevSectionId = this.getAttribute('data-prev');
            
            if (currentSection && prevSectionId) {
                // Hide current section
                currentSection.classList.add('hidden');
                
                // Show previous section
                const prevSection = document.getElementById(`section-${prevSectionId}`);
                if (prevSection) {
                    prevSection.classList.remove('hidden');
                    currentSectionIndex = Array.from(sections).findIndex(section => section.id === `section-${prevSectionId}`);
                    updateProgressBar();
                    window.scrollTo(0, 0);
                }
            }
        });
    });

    function updateProgressBar() {
        if (progressBar) {
            const progress = (currentSectionIndex / totalSections) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }
}

// Single DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    // Check authentication
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            currentUser = user;
            console.log("User is signed in:", user.email);
            // Initialize survey only after authentication
            initializeSurvey();
        } else {
            // User is signed out, redirect to login
            console.log("User is not signed in, redirecting to login");
            window.location.href = 'login.html';
        }
    });
});

// View Dashboard button
document.getElementById('view-dashboard').addEventListener('click', function() {
    alert('Redirecting to dashboard... This would take you to your personalized expense dashboard in a real application.');
});

// Dynamic conditional fields based on selections

// Other income source conditional display
document.querySelectorAll('input[name="other-income"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const otherIncomeSection = document.getElementById('other-income-source');
        if (this.value === 'yes') {
            otherIncomeSection.classList.remove('hidden');
        } else {
            otherIncomeSection.classList.add('hidden');
        }
    });
});

// Saving goal conditional display
document.querySelectorAll('input[name="saving-goal"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const savingAmountSection = document.getElementById('saving-amount');
        if (this.value === 'yes') {
            savingAmountSection.classList.remove('hidden');
        } else {
            savingAmountSection.classList.add('hidden');
        }
    });
});

// Living situation change handler to update dynamic questions
document.querySelectorAll('input[name="living-situation"]').forEach(radio => {
    radio.addEventListener('change', function() {
        updateAccommodationQuestions(this.value);
        updateFoodQuestions(this.value);
        updateTransportationQuestions(this.value);
    });
});

// Gender change handler to update personal care questions
document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener('change', function() {
        updatePersonalCareQuestions(this.value);
    });
});

// Helper Functions

// Initialize dynamic questions
function initDynamicQuestions() {
    // Set default questions for accommodation, food, transportation, and personal care
    updateAccommodationQuestions('home'); // Default to home
    updateFoodQuestions('home'); // Default to home
    updateTransportationQuestions('home'); // Default to home
    updatePersonalCareQuestions('prefer-not-to-say'); // Default to neutral
}

// Update accommodation questions based on living situation
function updateAccommodationQuestions(livingSituation) {
    const container = document.getElementById('accommodation-questions');
    container.innerHTML = ''; // Clear existing questions
    
    // Common question for all
    const commonHtml = `
        <div class="form-group">
            <label for="accommodation-satisfaction">How satisfied are you with your current accommodation?</label>
            <select id="accommodation-satisfaction" name="accommodation-satisfaction">
                <option value="">Select an option</option>
                <option value="very-satisfied">Very satisfied</option>
                <option value="satisfied">Satisfied</option>
                <option value="neutral">Neutral</option>
                <option value="dissatisfied">Dissatisfied</option>
                <option value="very-dissatisfied">Very dissatisfied</option>
            </select>
        </div>
    `;
    
    // Specific questions based on living situation
    let specificHtml = '';
    
    switch(livingSituation) {
        case 'home':
            specificHtml = `
                <div class="form-group">
                    <label for="family-contribution">Do you contribute to household expenses?</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="family-contribution" value="yes">
                            <span>Yes</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="family-contribution" value="no">
                            <span>No</span>
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="home-expenses">If yes, how much do you contribute monthly? (₹)</label>
                    <input type="number" id="home-expenses" name="home-expenses" min="0">
                </div>
            `;
            break;
            
        case 'hostel':
            specificHtml = `
                <div class="form-group">
                    <label for="hostel-fee">Monthly hostel fee (₹)</label>
                    <input type="number" id="hostel-fee" name="hostel-fee" min="0" required>
                </div>
                <div class="form-group">
                    <label for="hostel-amenities">What amenities are included in your hostel fee? (Select all that apply)</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="hostel-amenities" value="food">
                            <span>Food/Mess</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="hostel-amenities" value="laundry">
                            <span>Laundry</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="hostel-amenities" value="wifi">
                            <span>Wi-Fi</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="hostel-amenities" value="cleaning">
                            <span>Room Cleaning</span>
                        </label>
                    </div>
                </div>
            `;
            break;
            
        case 'pg':
            specificHtml = `
                <div class="form-group">
                    <label for="pg-rent">Monthly PG rent (₹)</label>
                    <input type="number" id="pg-rent" name="pg-rent" min="0" required>
                </div>
                <div class="form-group">
                    <label for="pg-deposit">Did you pay a security deposit?</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="pg-deposit" value="yes">
                            <span>Yes</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="pg-deposit" value="no">
                            <span>No</span>
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="pg-amenities">What amenities are included in your PG rent? (Select all that apply)</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="pg-amenities" value="food">
                            <span>Food</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="pg-amenities" value="laundry">
                            <span>Laundry</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="pg-amenities" value="wifi">
                            <span>Wi-Fi</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="pg-amenities" value="cleaning">
                            <span>Room Cleaning</span>
                        </label>
                    </div>
                </div>
            `;
            break;
            
        case 'rented':
            specificHtml = `
                <div class="form-group">
                    <label for="rent-amount">Monthly rent (₹)</label>
                    <input type="number" id="rent-amount" name="rent-amount" min="0" required>
                </div>
                <div class="form-group">
                    <label for="roommates">How many roommates do you have?</label>
                    <input type="number" id="roommates" name="roommates" min="0">
                </div>
                <div class="form-group">
                    <label for="utility-expenses">Average monthly utility expenses (₹)</label>
                    <input type="number" id="utility-expenses" name="utility-expenses" min="0">
                </div>
                <div class="form-group">
                    <label for="rental-deposit">How much security deposit did you pay? (₹)</label>
                    <input type="number" id="rental-deposit" name="rental-deposit" min="0">
                </div>
            `;
            break;
    }
    
    // Add the HTML to the container
    container.innerHTML = commonHtml + specificHtml;
}

// Update food questions based on living situation
function updateFoodQuestions(livingSituation) {
    const container = document.getElementById('food-questions');
    container.innerHTML = ''; // Clear existing questions
    
    // Common questions for all
    const commonHtml = `
        <div class="form-group">
            <label for="eating-out-frequency">How often do you eat out or order food?</label>
            <select id="eating-out-frequency" name="eating-out-frequency">
                <option value="">Select frequency</option>
                <option value="daily">Daily</option>
                <option value="few-times-week">Few times a week</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="rarely">Rarely</option>
            </select>
        </div>
        <div class="form-group">
            <label for="food-delivery-apps">Do you use food delivery apps?</label>
            <div class="radio-group">
                <label class="radio-label">
                    <input type="radio" name="food-delivery-apps" value="yes">
                    <span>Yes</span>
                </label>
                <label class="radio-label">
                    <input type="radio" name="food-delivery-apps" value="no">
                    <span>No</span>
                </label>
            </div>
        </div>
    `;
    
    // Specific questions based on living situation
    let specificHtml = '';
    
    switch(livingSituation) {
        case 'home':
            specificHtml = `
                <div class="form-group">
                    <label for="home-food-expense">How much do you spend on eating out monthly? (₹)</label>
                    <input type="number" id="home-food-expense" name="home-food-expense" min="0">
                </div>
                <div class="form-group">
                    <label for="home-food-contribution">Do you contribute to grocery shopping?</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="home-food-contribution" value="yes">
                            <span>Yes</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="home-food-contribution" value="no">
                            <span>No</span>
                        </label>
                    </div>
                </div>
            `;
            break;
            
        case 'hostel':
            specificHtml = `
                <div class="form-group">
                    <label for="hostel-food-quality">How would you rate the quality of hostel food?</label>
                    <select id="hostel-food-quality" name="hostel-food-quality">
                        <option value="">Select rating</option>
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="average">Average</option>
                        <option value="poor">Poor</option>
                        <option value="very-poor">Very Poor</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="hostel-food-expense">How much do you spend on outside food monthly? (₹)</label>
                    <input type="number" id="hostel-food-expense" name="hostel-food-expense" min="0">
                </div>
            `;
            break;
            
        case 'pg':
            specificHtml = `
                <div class="form-group">
                    <label for="pg-food-included">Is food included in your PG rent?</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="pg-food-included" value="yes">
                            <span>Yes</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="pg-food-included" value="no">
                            <span>No</span>
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="pg-food-quality">If yes, how would you rate the quality of PG food?</label>
                    <select id="pg-food-quality" name="pg-food-quality">
                        <option value="">Select rating</option>
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="average">Average</option>
                        <option value="poor">Poor</option>
                        <option value="very-poor">Very Poor</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="pg-food-expense">Total monthly food expenses (₹)</label>
                    <input type="number" id="pg-food-expense" name="pg-food-expense" min="0">
                </div>
            `;
            break;
            
        case 'rented':
            specificHtml = `
                <div class="form-group">
                    <label for="grocery-expenses">Monthly grocery expenses (₹)</label>
                    <input type="number" id="grocery-expenses" name="grocery-expenses" min="0">
                </div>
                <div class="form-group">
                    <label for="eating-out-expenses">Monthly eating out expenses (₹)</label>
                    <input type="number" id="eating-out-expenses" name="eating-out-expenses" min="0">
                </div>
                <div class="form-group">
                    <label for="cooking-frequency">How often do you cook at home?</label>
                    <select id="cooking-frequency" name="cooking-frequency">
                        <option value="">Select frequency</option>
                        <option value="daily">Daily</option>
                        <option value="few-times-week">Few times a week</option>
                        <option value="weekly">Weekly</option>
                        <option value="rarely">Rarely</option>
                        <option value="never">Never</option>
                    </select>
                </div>
            `;
            break;
    }
    
    // Add the HTML to the container
    container.innerHTML = commonHtml + specificHtml;
}

// Update transportation questions based on living situation
function updateTransportationQuestions(livingSituation) {
    const container = document.getElementById('transportation-questions');
    container.innerHTML = ''; // Clear existing questions
    
    // Common questions for all
    const commonHtml = `
        <div class="form-group">
            <label for="commute-mode">Primary mode of transportation to college/university</label>
            <select id="commute-mode" name="commute-mode">
                <option value="">Select mode</option>
                <option value="walk">Walking</option>
                <option value="bicycle">Bicycle</option>
                <option value="public-transport">Public Transport</option>
                <option value="cab">Cab/Taxi/Ride-sharing</option>
                <option value="two-wheeler">Two-wheeler</option>
                <option value="car">Car</option>
            </select>
        </div>
    `;
    
    // Specific questions based on living situation
    let specificHtml = '';
    
    switch(livingSituation) {
        case 'home':
            specificHtml = `
                <div class="form-group">
                    <label for="home-distance">Distance from home to college (km)</label>
                    <input type="number" id="home-distance" name="home-distance" min="0" step="0.1">
                </div>
                <div class="form-group">
                    <label for="home-transport-expense">Monthly transportation expenses (₹)</label>
                    <input type="number" id="home-transport-expense" name="home-transport-expense" min="0">
                </div>
            `;
            break;
            
        case 'hostel':
            specificHtml = `
                <div class="form-group">
                    <label for="hostel-distance">Distance from hostel to college (km)</label>
                    <input type="number" id="hostel-distance" name="hostel-distance" min="0" step="0.1">
                </div>
                <div class="form-group">
                    <label for="weekend-travel">Do you travel home on weekends?</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="weekend-travel" value="yes">
                            <span>Yes</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="weekend-travel" value="no">
                            <span>No</span>
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="hostel-transport-expense">Monthly transportation expenses (₹)</label>
                    <input type="number" id="hostel-transport-expense" name="hostel-transport-expense" min="0">
                </div>
            `;
            break;
            
        case 'pg':
            specificHtml = `
                <div class="form-group">
                    <label for="pg-distance">Distance from PG to college (km)</label>
                    <input type="number" id="pg-distance" name="pg-distance" min="0" step="0.1">
                </div>
                <div class="form-group">
                    <label for="pg-transport-expense">Monthly transportation expenses (₹)</label>
                    <input type="number" id="pg-transport-expense" name="pg-transport-expense" min="0">
                </div>
                <div class="form-group">
                    <label for="hometown-visits">How often do you visit your hometown?</label>
                    <select id="hometown-visits" name="hometown-visits">
                        <option value="">Select frequency</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Every few months</option>
                        <option value="yearly">Yearly</option>
                        <option value="rarely">Rarely</option>
                    </select>
                </div>
            `;
            break;
            
        case 'rented':
            specificHtml = `
                <div class="form-group">
                    <label for="rent-distance">Distance from apartment to college (km)</label>
                    <input type="number" id="rent-distance" name="rent-distance" min="0" step="0.1">
                </div>
                <div class="form-group">
                    <label for="rent-transport-expense">Monthly transportation expenses (₹)</label>
                    <input type="number" id="rent-transport-expense" name="rent-transport-expense" min="0">
                </div>
                <div class="form-group">
                    <label for="vehicle-ownership">Do you own a vehicle?</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="vehicle-ownership" value="yes">
                            <span>Yes</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="vehicle-ownership" value="no">
                            <span>No</span>
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="fuel-expense">If yes, monthly fuel expenses (₹)</label>
                    <input type="number" id="fuel-expense" name="fuel-expense" min="0">
                </div>
            `;
            break;
    }
    
    // Add the HTML to the container
    container.innerHTML = commonHtml + specificHtml;
}

// Update personal care questions based on gender
function updatePersonalCareQuestions(gender) {
    const container = document.getElementById('personal-care-questions');
    container.innerHTML = ''; // Clear existing questions
    
    // Common questions for all genders
    const commonHtml = `
        <div class="form-group">
            <label for="personal-care-budget">Monthly personal care budget (₹)</label>
            <input type="number" id="personal-care-budget" name="personal-care-budget" min="0">
        </div>
        <div class="form-group">
            <label for="grooming-frequency">How often do you visit salons/barber shops?</label>
            <select id="grooming-frequency" name="grooming-frequency">
                <option value="">Select frequency</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Every few months</option>
                <option value="yearly">Yearly</option>
                <option value="rarely">Rarely</option>
            </select>
        </div>
    `;
    
    // Gender-specific questions
    let specificHtml = '';
    
    switch(gender) {
        case 'male':
            specificHtml = `
                <div class="form-group">
                    <label>Which personal care products do you regularly spend on? (Select all that apply)</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="male-personal-care" value="haircare">
                            <span>Hair products</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="male-personal-care" value="skincare">
                            <span>Skincare</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="male-personal-care" value="shaving">
                            <span>Shaving products</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="male-personal-care" value="gym">
                            <span>Gym/Fitness supplements</span>
                        </label>
                    </div>
                </div>
            `;
            break;
            
        case 'female':
            specificHtml = `
                <div class="form-group">
                    <label>Which personal care products do you regularly spend on? (Select all that apply)</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="female-personal-care" value="haircare">
                            <span>Hair products</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="female-personal-care" value="skincare">
                            <span>Skincare</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="female-personal-care" value="makeup">
                            <span>Makeup</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="female-personal-care" value="feminine-hygiene">
                            <span>Feminine hygiene products</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="female-personal-care" value="salon">
                            <span>Salon treatments</span>
                        </label>
                    </div>
                </div>
            `;
            break;
            
        case 'other':
            specificHtml = `
                <div class="form-group">
                    <label>Which personal care products do you regularly spend on? (Select all that apply)</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="other-personal-care" value="haircare">
                            <span>Hair products</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="other-personal-care" value="skincare">
                            <span>Skincare</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="other-personal-care" value="makeup">
                            <span>Makeup</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="other-personal-care" value="salon">
                            <span>Salon treatments</span>
                        </label>
                    </div>
                </div>
            `;
            break;
            
        default: // prefer-not-to-say or any other value
            specificHtml = `
                <div class="form-group">
                    <label>Which personal care products do you regularly spend on? (Select all that apply)</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="general-personal-care" value="haircare">
                            <span>Hair products</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="general-personal-care" value="skincare">
                            <span>Skincare</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="general-personal-care" value="toiletries">
                            <span>Toiletries</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="general-personal-care" value="salon">
                            <span>Salon services</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="general-personal-care" value="other">
                            <span>Other</span>
                        </label>
                    </div>
                </div>
            `;
            break;
    }
    
    // Add the HTML to the container
    container.innerHTML = commonHtml + specificHtml;
}