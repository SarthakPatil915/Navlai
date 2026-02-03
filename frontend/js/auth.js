// ==================== Authentication JS ==================== //
// Note: Requires utils.js to be loaded first

// Track current step
let currentStep = 1;

// Track email OTP verification status
let emailVerified = false;

// Initialize on document ready
document.addEventListener('DOMContentLoaded', () => {
    initializeFormHandlers();
    generateCaptcha();
});

// ==================== Form Initialization ==================== //

function initializeFormHandlers() {
    // Setup Step 1 buttons
    setupStep1Buttons();
    
    // Setup Step 2 buttons
    setupStep2Buttons();
    
    // Setup Step 3 buttons
    setupStep3Buttons();
    
    // Setup Step 4 buttons and form submit
    setupStep4Buttons();
}

// ==================== Step 1: Personal Information ==================== //

function setupStep1Buttons() {
    const nextBtn = document.getElementById('next-step-1');
    const cancelBtn = document.getElementById('cancel-step-1');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', handleStep1Next);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', handleStep1Cancel);
    }
}

function handleStep1Next(e) {
    e.preventDefault();
    console.log('Step 1 Next clicked');
    
    if (validateStep1()) {
        console.log('Step 1 validation passed');
        // Populate display fields for Step 2
        const email = document.getElementById('reg-email').value;
        document.getElementById('reg-email-display').value = email;
        
        // Reset email OTP input
        const emailOTPGroup = document.getElementById('email-otp-group');
        const emailOTPInput = document.getElementById('reg-email-otp');
        if (emailOTPGroup) emailOTPGroup.style.display = 'none';
        if (emailOTPInput) emailOTPInput.value = '';
        
        goToStep(2);
    } else {
        console.log('Step 1 validation failed');
    }
}

function handleStep1Cancel(e) {
    e.preventDefault();
    console.log('Step 1 Cancel clicked');
    resetForm();
    closeAuthModal();
}

// ==================== Step 2: Contact Verification ==================== //

function setupStep2Buttons() {
    const prevBtn = document.getElementById('prev-step-2');
    const nextBtn = document.getElementById('next-step-2');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', handleStep2Prev);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', handleStep2Next);
    }
}

function handleStep2Prev(e) {
    e.preventDefault();
    console.log('Step 2 Back clicked');
    goToStep(1);
}

async function handleStep2Next(e) {
    e.preventDefault();
    console.log('Step 2 Next clicked');
    
    // Email verification is required
    if (!emailVerified) {
        showNotification('Please verify your email address first', 'error');
        return;
    }
    
    // Mobile verification is optional - just proceed if email is verified
    console.log('Step 2 validation passed');
    goToStep(3);
}

// ==================== Step 3: Location Information ==================== //

function setupStep3Buttons() {
    const prevBtn = document.getElementById('prev-step-3');
    const nextBtn = document.getElementById('next-step-3');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', handleStep3Prev);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', handleStep3Next);
    }
}

function handleStep3Prev(e) {
    e.preventDefault();
    console.log('Step 3 Back clicked');
    goToStep(2);
}

function handleStep3Next(e) {
    e.preventDefault();
    console.log('Step 3 Next clicked');
    
    if (validateStep3()) {
        console.log('Step 3 validation passed');
        goToStep(4);
    } else {
        console.log('Step 3 validation failed');
    }
}

// ==================== Step 4: Security & Consent ==================== //

function setupStep4Buttons() {
    const prevBtn = document.getElementById('prev-step-4');
    const submitBtn = document.getElementById('submit-registration');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', handleStep4Prev);
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', handleSubmit);
    }
}

function handleStep4Prev(e) {
    e.preventDefault();
    console.log('Step 4 Back clicked');
    goToStep(3);
}

function handleSubmit(e) {
    e.preventDefault();
    console.log('Form submit clicked');
    
    if (validateStep4()) {
        console.log('Step 4 validation passed - submitting');
        submitRegistrationForm();
    } else {
        console.log('Step 4 validation failed');
    }
}

function goToStep(step) {
    console.log(`Navigating to step ${step}`);
    
    // Hide all form steps
    const allSteps = document.querySelectorAll('.form-step');
    allSteps.forEach(el => {
        el.classList.remove('active');
        el.classList.add('hidden');
    });

    // Show current step
    const formStep = document.getElementById(`form-step-${step}`);
    if (formStep) {
        formStep.classList.remove('hidden');
        formStep.classList.add('active');
        console.log(`Displayed form-step-${step}`);
    } else {
        console.error(`Form step ${step} not found`);
    }

    // Update step indicators
    const indicators = document.querySelectorAll('.step');
    indicators.forEach((el, index) => {
        const stepNum = index + 1;
        el.classList.remove('active', 'completed');
        
        if (stepNum < step) {
            el.classList.add('completed');
        } else if (stepNum === step) {
            el.classList.add('active');
        }
    });

    // Update progress bar
    const progressPercentage = (step / 4) * 100;
    const stepIndicator = document.querySelector('.step-indicator');
    if (stepIndicator) {
        stepIndicator.style.setProperty('--progress-width', `${progressPercentage}%`);
        // Update the ::after pseudo-element width
        const style = document.createElement('style');
        style.innerHTML = `.step-indicator::after { width: ${progressPercentage}% !important; }`;
        // Remove old style if exists
        const oldStyle = document.querySelector('style[data-progress="true"]');
        if (oldStyle) oldStyle.remove();
        style.setAttribute('data-progress', 'true');
        document.head.appendChild(style);
    }

    // Update display fields for step 2
    if (step === 2) {
        const emailDisplay = document.getElementById('reg-email-display');
        if (emailDisplay) emailDisplay.value = document.getElementById('reg-email').value;
    }

    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== Form Validation ==================== //

function validateStep1() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const mobile = document.getElementById('reg-mobile').value.trim();

    if (!name) {
        showNotification('Please enter your full name', 'error');
        return false;
    }

    if (!email) {
        showNotification('Please enter your email', 'error');
        return false;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showNotification('Please enter a valid email', 'error');
        return false;
    }

    // Mobile is optional but validate format if provided
    if (mobile && (mobile.length !== 10 || isNaN(mobile))) {
        showNotification('Mobile number must be 10 digits', 'error');
        return false;
    }

    return true;
}

function validateStep2() {
    // Email must be verified before proceeding
    if (!emailVerified) {
        showNotification('Please verify your email address first', 'error');
        return false;
    }
    return true;
}

function validateStep3() {
    const country = document.getElementById('reg-country').value;
    const state = document.getElementById('reg-state').value;
    const district = document.getElementById('reg-district').value;
    const taluka = document.getElementById('reg-taluka').value;
    const area = document.getElementById('reg-area').value.trim();

    if (!country) {
        showNotification('Please select a country', 'error');
        return false;
    }

    if (!state) {
        showNotification('Please select a state', 'error');
        return false;
    }

    if (!district) {
        showNotification('Please select a district', 'error');
        return false;
    }

    if (!taluka) {
        showNotification('Please select a taluka', 'error');
        return false;
    }

    if (!area) {
        showNotification('Please enter your area', 'error');
        return false;
    }

    return true;
}

function validateStep4() {
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const captchaText = document.getElementById('captcha-text');
    const captchaInput = document.getElementById('captcha-input');
    const termsCheckbox = document.getElementById('terms-checkbox');

    // Validate password length
    if (!password || password.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return false;
    }

    // Check for password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);

    if (!hasUpperCase) {
        showNotification('Password must contain at least one uppercase letter (A-Z)', 'error');
        return false;
    }

    if (!hasLowerCase) {
        showNotification('Password must contain at least one lowercase letter (a-z)', 'error');
        return false;
    }

    if (!hasNumbers) {
        showNotification('Password must contain at least one number (0-9)', 'error');
        return false;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return false;
    }

    const correctAnswer = parseInt(captchaText.dataset.answer);
    const userAnswer = parseInt(captchaInput.value);

    if (userAnswer !== correctAnswer) {
        showNotification('CAPTCHA is incorrect', 'error');
        generateCaptcha();
        return false;
    }

    if (!termsCheckbox.checked) {
        showNotification('Please accept Terms & Conditions', 'error');
        return false;
    }

    return true;
}

// ==================== OTP Handlers ==================== //

// Send Email OTP button click
document.addEventListener('click', (e) => {
    if (e.target.id === 'verify-email-btn') {
        e.preventDefault();
        const email = document.getElementById('reg-email').value;
        
        if (!email) {
            showNotification('Please go back and enter email', 'error');
            return;
        }
        
        sendEmailOTP(email);
    }
});

// Verify Email OTP button click
document.addEventListener('click', (e) => {
    if (e.target.id === 'verify-email-otp-btn') {
        e.preventDefault();
        const email = document.getElementById('reg-email').value;
        const otp = document.getElementById('reg-email-otp').value.trim();
        
        if (!otp || otp.length !== 6) {
            showNotification('Please enter a valid 6-digit OTP', 'error');
            return;
        }
        
        verifyEmailOTP(email, otp);
    }
});

async function sendEmailOTP(email) {
    try {
        const btn = document.getElementById('verify-email-btn');
        btn.disabled = true;
        btn.textContent = 'Sending...';
        
        const response = await fetch(`${API_URL}/auth/send-email-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('OTP sent to your email. Please check your inbox.', 'success');
            // Show OTP input group
            document.getElementById('email-otp-group').style.display = 'flex';
            btn.textContent = 'Resend OTP';
            btn.disabled = false;
            // Reset verification status
            emailVerified = false;
            updateVerificationStatus('email', false);
        } else {
            showNotification(data.message || 'Failed to send OTP', 'error');
            btn.textContent = 'Send OTP';
            btn.disabled = false;
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error sending OTP. Please check your connection.', 'error');
        const btn = document.getElementById('verify-email-btn');
        btn.textContent = 'Send OTP';
        btn.disabled = false;
    }
}

async function verifyEmailOTP(email, otp) {
    try {
        const btn = document.getElementById('verify-email-otp-btn');
        btn.disabled = true;
        btn.textContent = 'Verifying...';
        
        const response = await fetch(`${API_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, type: 'email' })
        });
        
        const data = await response.json();
        
        if (response.ok && data.verified) {
            emailVerified = true;
            showNotification('Email verified successfully!', 'success');
            updateVerificationStatus('email', true);
            btn.textContent = '✓ Verified';
            btn.style.backgroundColor = '#48bb78';
        } else {
            showNotification(data.message || 'Invalid or expired OTP', 'error');
            btn.textContent = 'Verify';
            btn.disabled = false;
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error verifying OTP', 'error');
        const btn = document.getElementById('verify-email-otp-btn');
        btn.textContent = 'Verify';
        btn.disabled = false;
    }
}

// Update verification status display
function updateVerificationStatus(type, verified) {
    const statusEl = document.getElementById('email-verify-status');
    if (statusEl) {
        if (verified) {
            statusEl.textContent = '✓ Verified';
            statusEl.style.color = '#48bb78';
        } else {
            statusEl.textContent = '';
        }
    }
}

// ==================== CAPTCHA ==================== //

function generateCaptcha() {
    // Simple captcha with small numbers (1-20)
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const captchaText = document.getElementById('captcha-text');
    const captchaInput = document.getElementById('captcha-input');
    
    if (captchaText && captchaInput) {
        captchaText.textContent = `${num1} + ${num2}`;
        captchaText.dataset.answer = num1 + num2;
        captchaInput.value = '';
    }
}

document.addEventListener('click', (e) => {
    if (e.target.id === 'refresh-captcha') {
        e.preventDefault();
        generateCaptcha();
    }
});

// ==================== Form Submission ==================== //

async function submitRegistrationForm() {
    try {
        const formData = {
            name: document.getElementById('reg-name').value.trim(),
            email: document.getElementById('reg-email').value.trim(),
            mobile: document.getElementById('reg-mobile')?.value?.trim() || '',
            country: document.getElementById('reg-country').value,
            state: document.getElementById('reg-state').value,
            district: document.getElementById('reg-district').value,
            taluka: document.getElementById('reg-taluka').value,
            area: document.getElementById('reg-area').value.trim(),
            password: document.getElementById('reg-password').value
        };

        // Validate all required fields
        if (!formData.name || !formData.email || !formData.password) {
            showNotification('Please fill all required fields', 'error');
            return;
        }

        // Check email verification
        if (!emailVerified) {
            showNotification('Please verify your email address', 'error');
            return;
        }

        console.log('Submitting registration data');

        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Account created successfully! Please login.', 'success');
            resetForm();
            setTimeout(() => {
                showLoginCard();
            }, 2000);
        } else {
            showNotification(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Submission error:', error);
        showNotification('Registration error: ' + error.message, 'error');
    }
}

document.addEventListener('submit', async (e) => {
    if (e.target.id === 'register-form') {
        e.preventDefault();

        // Final validation
        if (!validateStep4()) {
            return;
        }

        submitRegistrationForm();
    }
});

// ==================== Utility Functions ==================== //

function resetForm() {
    const form = document.getElementById('register-form');
    if (form) {
        form.reset();
    }
    
    // Reset verification status
    emailVerified = false;
    updateVerificationStatus('email', false);
    
    // Hide OTP input group
    const emailOTPGroup = document.getElementById('email-otp-group');
    if (emailOTPGroup) emailOTPGroup.style.display = 'none';
    
    // Reset OTP buttons
    const emailBtn = document.getElementById('verify-email-btn');
    const emailVerifyBtn = document.getElementById('verify-email-otp-btn');
    
    if (emailBtn) {
        emailBtn.textContent = 'Send OTP';
        emailBtn.disabled = false;
        emailBtn.style.backgroundColor = '';
    }
    if (emailVerifyBtn) {
        emailVerifyBtn.textContent = 'Verify';
        emailVerifyBtn.disabled = false;
        emailVerifyBtn.style.backgroundColor = '';
    }
    
    currentStep = 1;
    goToStep(1);
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function showLoginCard() {
    const loginCard = document.getElementById('login-card');
    const registerCard = document.getElementById('register-card');
    if (loginCard && registerCard) {
        registerCard.classList.add('hidden');
        loginCard.classList.remove('hidden');
    }
}

