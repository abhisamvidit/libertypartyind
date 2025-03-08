document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('joinForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const backButtons = document.querySelectorAll('.back-btn');
    const submitButton = document.querySelector('.submit-btn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const retryButton = document.querySelector('.retry-btn');
    const formSummary = document.getElementById('formSummary');
    
    // State
    let currentStep = 1;
    const stateDistricts = {
        'AN': ['Port Blair', 'South Andaman', 'North & Middle Andaman', 'Nicobar'],
        'AP': ['Visakhapatnam', 'Vijayawada', 'Tirupati', 'Guntur', 'Nellore'],
        'AR': ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'South Delhi', 'West Delhi'],
        'AS': ['Guwahati', 'Jorhat', 'Silchar', 'Dibrugarh', 'Nagaon'],
        'BR': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga'],
        'CH': ['Chandigarh'],
        'WB': ['Kolkata', 'Howrah', 'Asansol', 'Durgapur', 'Siliguri']
    };

    // Initialize
    initFormEvents();
    updateDistrictOptions();

    /**
     * Initialize form event listeners
     */
    function initFormEvents() {
        // State change to update districts dropdown
        document.getElementById('state').addEventListener('change', updateDistrictOptions);
        
        // Next button clicks
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                const nextStep = parseInt(button.getAttribute('data-next'));
                if (validateStep(currentStep)) {
                    goToStep(nextStep);
                }
            });
        });
        
        // Back button clicks
        backButtons.forEach(button => {
            button.addEventListener('click', () => {
                const prevStep = parseInt(button.getAttribute('data-back'));
                goToStep(prevStep);
            });
        });
        
        // Form submission
        form.addEventListener('submit', handleSubmit);
        
        // Retry button
        retryButton?.addEventListener('click', () => {
            errorMessage.classList.add('hidden');
            submitButton.disabled = false;
        });
        
        // Interest checkbox validation
        const interestCheckboxes = document.querySelectorAll('input[name="interests"]');
        interestCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                document.getElementById('interestsError').textContent = '';
            });
        });
        
        // Input validation on blur
        document.getElementById('fullName').addEventListener('blur', validateFullName);
        document.getElementById('email').addEventListener('blur', validateEmail);
        document.getElementById('phone').addEventListener('blur', validatePhone);
    }

    /**
     * Update district options based on selected state
     */
    function updateDistrictOptions() {
        const stateSelect = document.getElementById('state');
        const districtSelect = document.getElementById('district');
        
        // Clear existing options
        districtSelect.innerHTML = '<option value="">Select district</option>';
        
        const selectedState = stateSelect.value;
        if (selectedState && stateDistricts[selectedState]) {
            stateDistricts[selectedState].forEach(district => {
                const option = document.createElement('option');
                option.value = district.toLowerCase().replace(/\s+/g, '-');
                option.textContent = district;
                districtSelect.appendChild(option);
            });
            districtSelect.disabled = false;
        } else {
            districtSelect.disabled = true;
        }
    }

    /**
     * Navigate to a specific step
     * @param {number} step - The step number to navigate to
     */
    function goToStep(step) {
        // Hide all steps
        steps.forEach(stepElement => {
            stepElement.classList.add('hidden');
        });
        
        // Show the current step
        document.getElementById(`step${step}`).classList.remove('hidden');
        
        // Update progress bar
        progressSteps.forEach((progressStep, index) => {
            if (index + 1 <= step) {
                progressStep.classList.add('active');
            } else {
                progressStep.classList.remove('active');
            }
        });
        
        // Update current step
        currentStep = step;
        
        // If this is the confirmation step, generate summary
        if (step === 4) {
            generateSummary();
        }
        
        // Scroll to top of form
        window.scrollTo({
            top: document.querySelector('.form-container').offsetTop - 20,
            behavior: 'smooth'
        });
    }

    /**
     * Validate the current step before proceeding
     * @param {number} step - The current step number
     * @returns {boolean} - Whether the step is valid
     */
    function validateStep(step) {
        let isValid = true;
        
        switch(step) {
            case 1:
                if (!validateFullName()) {
                    isValid = false;
                }
                break;
                
            case 2:
                if (!validateEmail()) {
                    isValid = false;
                }
                
                if (!validatePhone()) {
                    isValid = false;
                }
                
                const stateSelect = document.getElementById('state');
                if (stateSelect.required && !stateSelect.value) {
                    isValid = false;
                    alert('Please select your state');
                }
                break;
                
            case 3:
                const interestCheckboxes = document.querySelectorAll('input[name="interests"]:checked');
                if (interestCheckboxes.length === 0) {
                    document.getElementById('interestsError').textContent = 'Please select at least one way to contribute';
                    isValid = false;
                }
                break;
        }
        
        return isValid;
    }

    /**
     * Validate full name input
     * @returns {boolean} - Whether the input is valid
     */
    function validateFullName() {
        const fullNameInput = document.getElementById('fullName');
        const errorElement = document.getElementById('fullNameError');
        
        if (!fullNameInput.value.trim()) {
            errorElement.textContent = 'Please enter your full name';
            return false;
        }
        
        if (fullNameInput.value.trim().length < 3) {
            errorElement.textContent = 'Name must be at least 3 characters long';
            return false;
        }
        
        errorElement.textContent = '';
        return true;
    }

    /**
     * Validate email input
     * @returns {boolean} - Whether the input is valid
     */
    function validateEmail() {
        const emailInput = document.getElementById('email');
        const errorElement = document.getElementById('emailError');
        
        if (!emailInput.value.trim()) {
            errorElement.textContent = 'Please enter your email address';
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            errorElement.textContent = 'Please enter a valid email address';
            return false;
        }
        
        errorElement.textContent = '';
        return true;
    }

    /**
     * Validate phone input
     * @returns {boolean} - Whether the input is valid
     */
    function validatePhone() {
        const phoneInput = document.getElementById('phone');
        const errorElement = document.getElementById('phoneError');
        
        // Phone is optional
        if (!phoneInput.value.trim()) {
            return true;
        }
        
        // Basic phone validation for India (+91 followed by 10 digits)
        const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
        if (!phoneRegex.test(phoneInput.value.trim().replace(/[\s-]/g, ''))) {
            errorElement.textContent = 'Please enter a valid Indian phone number';
            return false;
        }
        
        errorElement.textContent = '';
        return true;
    }

    /**
     * Generate summary for the confirmation step
     */
    function generateSummary() {
        const formData = new FormData(form);
        let summaryHTML = '';
        
        // Personal Info
        summaryHTML += `
            <div class="summary-section">
                <h4 class="summary-title">Personal Information</h4>
                <div class="summary-item">
                    <div class="summary-label">Full Name:</div>
                    <div class="summary-value">${formData.get('fullName') || 'Not provided'}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Gender:</div>
                    <div class="summary-value">${formData.get('gender') || 'Not provided'}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Age Group:</div>
                    <div class="summary-value">${formData.get('age') || 'Not provided'}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Occupation:</div>
                    <div class="summary-value">${formData.get('occupation') || 'Not provided'}</div>
                </div>
            </div>
        `;
        
        // Contact Info
        const state = document.getElementById('state');
        const stateText = state.options[state.selectedIndex]?.text || 'Not selected';
        
        const district = document.getElementById('district');
        const districtText = district.options[district.selectedIndex]?.text || 'Not selected';
        
        summaryHTML += `
            <div class="summary-section">
                <h4 class="summary-title">Contact Information</h4>
                <div class="summary-item">
                    <div class="summary-label">Email:</div>
                    <div class="summary-value">${formData.get('email') || 'Not provided'}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Phone:</div>
                    <div class="summary-value">${formData.get('phone') || 'Not provided'}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">State/UT:</div>
                    <div class="summary-value">${stateText}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">District:</div>
                    <div class="summary-value">${districtText}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Address:</div>
                    <div class="summary-value">${formData.get('address') || 'Not provided'}</div>
                </div>
            </div>
        `;
        
        // Interests and Issues
        const interests = formData.getAll('interests');
        const issues = formData.getAll('issues');
        
        const howHeardSelect = document.getElementById('howHeard');
        const howHeardText = howHeardSelect.options[howHeardSelect.selectedIndex]?.text || 'Not selected';
        
        summaryHTML += `
            <div class="summary-section">
                <h4 class="summary-title">Interests & Preferences</h4>
                <div class="summary-item">
                    <div class="summary-label">Contribution Areas:</div>
                    <div class="summary-value">${interests.length ? interests.join(', ') : 'None selected'}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Important Issues:</div>
                    <div class="summary-value">${issues.length ? issues.join(', ') : 'None selected'}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">How you heard about us:</div>
                    <div class="summary-value">${howHeardText}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">Newsletter subscription:</div>
                    <div class="summary-value">${formData.get('newsletter') ? 'Yes' : 'No'}</div>
                </div>
            </div>
        `;
        
        formSummary.innerHTML = summaryHTML;
    }

    /**
     * Handle form submission
     * @param {Event} e - The form submit event
     */
    async function handleSubmit(e) {
        e.preventDefault();
        
        // Final validation check
        if (!document.getElementById('consent').checked) {
            document.getElementById('consentError').textContent = 'You must agree to the terms and conditions';
            return;
        }
        
        // Disable submit button and show loading
        submitButton.disabled = true;
        loadingIndicator.classList.remove('hidden');
        
        try {
            // Simulate API call with a delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Randomly succeed or fail for demo purposes (90% success rate)
            const success = Math.random() < 0.9;
            
            if (success) {
                // Show success message
                loadingIndicator.classList.add('hidden');
                successMessage.classList.remove('hidden');
                
                // Hide the form steps
                steps.forEach(step => step.classList.add('hidden'));
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth' });
                
                // Configure social sharing links
                const shareMessage = 'I just joined the Liberation Party of India! Join the movement for a better India.';
                const shareLinks = document.querySelectorAll('.social-share a');
                
                shareLinks.forEach(link => {
                    if (link.classList.contains('facebook')) {
                        link.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareMessage)}`;
                    } else if (link.classList.contains('twitter')) {
                        link.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(window.location.href)}`;
                    } else if (link.classList.contains('whatsapp')) {
                        link.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage + ' ' + window.location.href)}`;
                    }
                    
                    link.target = '_blank';
                });
            } else {
                // Show error message
                loadingIndicator.classList.add('hidden');
                errorMessage.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            loadingIndicator.classList.add('hidden');
            errorMessage.classList.remove('hidden');
        }
    }

    // Add the new form submission event listener
    document.getElementById('joinForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = {
            fullName: document.getElementById('fullName').value,
            gender: document.getElementById('gender').value,
            age: document.getElementById('age').value,
            occupation: document.getElementById('occupation').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            state: document.getElementById('state').value,
            district: document.getElementById('district').value,
            address: document.getElementById('address').value,
            interests: [...document.querySelectorAll('input[name="interests"]:checked')].map(i => i.value),
            issues: [...document.querySelectorAll('input[name="issues"]:checked')].map(i => i.value),
            howHeard: document.getElementById('howHeard').value,
            comments: document.getElementById('comments').value,
            newsletter: document.getElementById('newsletter').checked
        };

        try {
            const response = await fetch('http://localhost:5000/submit-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            alert('Error submitting the form');
        }
    });
});