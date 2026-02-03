// ==================== Main JS - Home Page ==================== //
// Note: Requires utils.js to be loaded first

// DOM Elements - initialized on DOMContentLoaded
let authModal, loginCard, registerCard, closeModal, loginForm, registerForm;
let switchToRegister, switchToLogin, hamburger, navMenu;
let navHome, navEvents, navLogin, navRegister;
let exploreBtn, createEventBtn;

// ==================== Initialize on DOM Ready ==================== //
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM Elements
    authModal = document.getElementById('auth-modal');
    loginCard = document.getElementById('login-card');
    registerCard = document.getElementById('register-card');
    closeModal = document.getElementById('close-modal');
    loginForm = document.getElementById('login-form');
    registerForm = document.getElementById('register-form');
    switchToRegister = document.getElementById('switch-to-register');
    switchToLogin = document.getElementById('switch-to-login');
    hamburger = document.querySelector('.hamburger');
    navMenu = document.querySelector('.nav-menu');

    // Navigation Links
    navHome = document.getElementById('nav-home');
    navEvents = document.getElementById('nav-events');
    navLogin = document.getElementById('nav-login');
    navRegister = document.getElementById('nav-register');

    // Buttons
    exploreBtn = document.getElementById('explore-btn');
    createEventBtn = document.getElementById('create-event-btn');

    // Setup all event listeners
    setupEventListeners();
    
    // Load featured events
    loadFeaturedEvents();
    
    // Handle URL parameters
    handleURLParams();
    
    // Update navbar if logged in
    updateNavbarForAuth();
});

function setupEventListeners() {
    // Home Navigation
    if (navHome) navHome.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Events Navigation
    if (navEvents) navEvents.addEventListener('click', (e) => {
        e.preventDefault();
        const featuredSection = document.querySelector('.featured-events');
        if (featuredSection) {
            featuredSection.classList.add('highlight-animation');
            window.scrollTo({
                top: featuredSection.offsetTop - 70,
                behavior: 'smooth'
            });
            setTimeout(() => {
                featuredSection.classList.remove('highlight-animation');
            }, 2000);
        }
    });

    // Auth Modal Controls
    if (navLogin) navLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthModal('login');
    });

    if (navRegister) navRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthModal('register');
    });

    if (closeModal) closeModal.addEventListener('click', closeAuthModal);

    if (switchToRegister) switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        switchToRegisterCard();
    });

    if (switchToLogin) switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchToLoginCard();
    });

    // Forms - Login form submit handler
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form handler attached');
    }

    // Hamburger Menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when clicking on nav links
    if (navMenu) {
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Explore Events Button
    if (exploreBtn) exploreBtn.addEventListener('click', () => {
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = 'dashboard.html';
        } else {
            showAuthModal('login');
        }
    });

    // Create Event Button
    if (createEventBtn) createEventBtn.addEventListener('click', () => {
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = 'dashboard.html';
        } else {
            showAuthModal('login');
        }
    });

    // Close modal when clicking outside
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                closeAuthModal();
            }
        });
    }
}

// ==================== Functions ==================== //

function showAuthModal(type) {
    authModal.classList.add('show');
    if (type === 'login') {
        switchToLoginCard();
    } else {
        switchToRegisterCard();
    }
}

function closeAuthModal() {
    authModal.classList.remove('show');
}

function switchToLoginCard() {
    loginCard.classList.remove('hidden');
    registerCard.classList.add('hidden');
}

function switchToRegisterCard() {
    loginCard.classList.add('hidden');
    registerCard.classList.remove('hidden');
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showNotification('Login successful!', 'success');
            setTimeout(() => {
                if (data.user.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            }, 1000);
        } else {
            showNotification(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const mobile = document.getElementById('reg-mobile').value;
    const country = document.getElementById('reg-country').value;
    const state = document.getElementById('reg-state').value;
    const district = document.getElementById('reg-district').value;
    const taluka = document.getElementById('reg-taluka').value;
    const area = document.getElementById('reg-area').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const termsCheckbox = document.getElementById('terms-checkbox').checked;
    
    // Validation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (!termsCheckbox) {
        showNotification('Please accept Terms & Conditions', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                mobile,
                country,
                state,
                district,
                taluka,
                area,
                password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Registration successful! Please login.', 'success');
            setTimeout(() => {
                registerForm.reset();
                switchToLoginCard();
            }, 1500);
        } else {
            showNotification(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Registration failed. Please try again.', 'error');
    }
}

// ==================== Featured Events Loading ==================== //

async function loadFeaturedEvents() {
    try {
        const response = await fetch(`${API_URL}/events/featured`);
        const data = await response.json();
        
        if (response.ok && data.events) {
            const container = document.getElementById('featured-events-container');
            if (container) {
                container.innerHTML = data.events.map(event => `
                    <div class="event-card" onclick="viewEventDetail('${event._id}')">
                        <div class="event-card-header">
                            <span class="event-type">${event.type}</span>
                            <h3 class="event-title">${event.title}</h3>
                        </div>
                        <div class="event-card-body">
                            <div class="event-info">
                                <div class="event-info-item">
                                    <span>📍</span> ${event.area}, ${event.district}
                                </div>
                                <div class="event-info-item">
                                    <span>📅</span> ${new Date(event.date).toLocaleDateString()}
                                </div>
                                <div class="event-info-item">
                                    <span>⏰</span> ${event.time}
                                </div>
                            </div>
                            <p class="event-description">${event.description}</p>
                            <div class="event-footer">
                                <span class="seats-available">${event.maxSeats - (event.enrollments || []).length} seats left</span>
                                <button class="btn btn-primary" style="margin: 0;">View Details</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading featured events:', error);
    }
}

function viewEventDetail(eventId) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // User not logged in - Show login modal with animation
        showNotification('Please login to view event details', 'info');
        setTimeout(() => {
            showAuthModal('login');
        }, 500);
    } else {
        // User is logged in - Navigate to dashboard
        window.location.href = `dashboard.html?event=${eventId}`;
    }
}

// ==================== Helper Functions ==================== //

function updateNavbarForAuth() {
    const token = localStorage.getItem('token');
    
    if (token) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (navLogin && navRegister) {
            navLogin.style.display = 'none';
            navRegister.style.display = 'none';
        }
    }
}

function handleURLParams() {
    const params = new URLSearchParams(window.location.search);
    
    // Handle modal opening
    if (params.get('modal') === 'login') {
        setTimeout(() => {
            showAuthModal('login');
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 300);
    } else if (params.get('modal') === 'register') {
        setTimeout(() => {
            showAuthModal('register');
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 300);
    }
    
    // Handle scroll to top
    if (params.get('scroll') === 'top') {
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
    }
    
    // Check if we need to scroll to featured events
    if (params.get('scroll') === 'featured-events') {
        setTimeout(() => {
            const featuredSection = document.querySelector('.featured-events');
            if (featuredSection) {
                featuredSection.classList.add('highlight-animation');
                window.scrollTo({
                    top: featuredSection.offsetTop - 70,
                    behavior: 'smooth'
                });
                setTimeout(() => {
                    featuredSection.classList.remove('highlight-animation');
                }, 2000);
            }
        }, 500);
    }
}
