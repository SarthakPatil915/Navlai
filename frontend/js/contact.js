// ==================== Contact Page JS ==================== //
// Note: Requires utils.js to be loaded first

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeContactMap();
    setupContactFormHandler();
});

// ==================== Map Initialization ==================== //

function initializeContactMap() {
    // Amrutvahini College of Engineering, Sangamner coordinates
    const sangamnerLocation = {
        lat: 19.2394,
        lng: 75.3519
    };

    const mapElement = document.getElementById('contact-map');
    
    if (!mapElement) {
        console.log('Map element not found');
        return;
    }

    // Map is now embedded as iframe in HTML
    // This function is kept for compatibility but actual map is loaded from iframe
    console.log('Contact map loaded with location:', sangamnerLocation);
}

// ==================== Contact Form Handler ==================== //

function setupContactFormHandler() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }

    async function handleContactFormSubmit(e) {
        e.preventDefault();

        // Get form data
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const phone = document.getElementById('contact-phone').value.trim();
        const subject = document.getElementById('contact-subject').value;
        const message = document.getElementById('contact-message').value.trim();

        // Validation
        if (!name || !email || !subject || !message) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Send feedback to backend API
            const response = await fetch(`${API_URL}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    subject,
                    message
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send feedback');
            }

            const data = await response.json();

            // Success
            showFormMessage('✅ Message sent successfully! We will get back to you soon.', 'success');
            contactForm.reset();
            
            // Reset button
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);

            // Clear message after 5 seconds
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000);

        } catch (error) {
            console.error('Error sending message:', error);
            showFormMessage('Failed to send message. Please try again.', 'error');
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.classList.remove('hidden');
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// ==================== Smooth Scroll for Navbar ==================== //

document.addEventListener('DOMContentLoaded', () => {
    const navHome = document.getElementById('nav-home');
    const navAbout = document.getElementById('nav-about');
    const navEvents = document.getElementById('nav-events');
    const navContact = document.getElementById('nav-contact');
    const navLogin = document.getElementById('nav-login');
    const navRegister = document.getElementById('nav-register');

    // Home navigation
    if (navHome) {
        navHome.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html?scroll=top';
        });
    }

    // About navigation
    if (navAbout) {
        navAbout.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'about.html';
        });
    }

    // Events navigation
    if (navEvents) {
        navEvents.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html?scroll=featured-events';
        });
    }

    // Contact navigation
    if (navContact) {
        navContact.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'contact.html';
        });
    }

    // Login navigation - redirect to home with login modal
    if (navLogin) {
        navLogin.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html?modal=login';
        });
    }

    // Register navigation - redirect to home with register modal
    if (navRegister) {
        navRegister.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html?modal=register';
        });
    }
});
