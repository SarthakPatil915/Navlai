// ==================== Dashboard JS ==================== //
// Note: Requires utils.js to be loaded first

// Legacy variables (kept for compatibility)
let map;
let markers = [];
let selectedEventLocation = null;

// Leaflet map variables
let nearbyEventsMap = null;
let eventMarkers = [];
let locationMap = null;
let locationMarker = null;

// DOM Elements
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const contentSections = document.querySelectorAll('.content-section');
const logoutBtn = document.getElementById('logout-btn');
const userName = document.getElementById('user-name');

// ==================== Event Listeners ==================== //

// Home Navigation - Redirect to home and scroll to top
const navbarHomeBtn = document.getElementById('navbar-home');
if (navbarHomeBtn) {
    navbarHomeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Redirect to home page with smooth scroll parameter
        window.location.href = 'index.html?scroll=top';
    });
}

// Events Navigation - Redirect to home and scroll
const navbarEventsBtn = document.getElementById('navbar-events');
if (navbarEventsBtn) {
    navbarEventsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Redirect to home page
        window.location.href = 'index.html?scroll=featured-events';
    });
}

// Sidebar Navigation
sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.dataset.section;
        showSection(sectionId);
    });
});

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
    });
}

// Apply Filters
document.getElementById('apply-filters')?.addEventListener('click', filterEvents);

// Filter dropdowns
const filterDistrictSelect = document.getElementById('filter-district');
const filterTalukaSelect = document.getElementById('filter-taluka');
const filterAreaInput = document.getElementById('filter-area');

if (filterDistrictSelect) {
    filterDistrictSelect.addEventListener('change', updateFilterTalukaDropdown);
}

if (filterTalukaSelect) {
    filterTalukaSelect.addEventListener('change', updateFilterAreaDropdown);
}

// Create Event Form
document.getElementById('create-event-form')?.addEventListener('submit', handleCreateEvent);

// Enrollment Form
document.getElementById('enrollment-form')?.addEventListener('submit', handleEnrollment);

// Modal Close Buttons
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.modal').classList.remove('show');
    });
});

// ==================== Functions ==================== //

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (userName) {
        userName.textContent = user.name || 'User';
    }
}

function showSection(sectionId) {
    // Hide all sections
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all links
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
    
    // Highlight active link
    document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');
    
    // Handle section-specific initialization
    if (sectionId === 'nearby-events') {
        initMap();
        loadNearbyEvents();
    } else if (sectionId === 'my-events') {
        loadMyEvents();
    } else if (sectionId === 'create-event') {
        initLocationMap();
    } else if (sectionId === 'my-enrollments') {
        loadMyEnrollments();
    } else if (sectionId === 'profile') {
        loadProfile();
    }
}

// Initialize Leaflet Map for nearby events
function initMap() {
    const mapContainer = document.getElementById('google-map');
    
    if (!mapContainer) return;
    
    // Set container height
    mapContainer.style.height = '500px';
    mapContainer.style.borderRadius = '12px';
    
    // Default location (Maharashtra)
    const defaultCenter = [19.8975, 75.3213];
    
    // Initialize map if not already done
    if (!nearbyEventsMap) {
        nearbyEventsMap = L.map('google-map').setView(defaultCenter, 8);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(nearbyEventsMap);
    }
    
    // Load events
    loadNearbyEvents();
}

// Initialize Leaflet Map for location selection
function initLocationMap() {
    const mapContainer = document.getElementById('location-map');
    if (!mapContainer) return;
    
    // Default center (Mumbai, India)
    const defaultCenter = [19.0760, 72.8777];
    
    // Initialize map if not already done
    if (!locationMap) {
        locationMap = L.map('location-map').setView(defaultCenter, 12);
        
        // Add OpenStreetMap tiles (free, no API key needed)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(locationMap);
        
        // Add initial marker
        locationMarker = L.marker(defaultCenter, { draggable: true }).addTo(locationMap);
        
        // Handle map click
        locationMap.on('click', (e) => {
            locationMarker.setLatLng(e.latlng);
            updateSelectedLocation(e.latlng);
        });
        
        // Handle marker drag
        locationMarker.on('dragend', () => {
            updateSelectedLocation(locationMarker.getLatLng());
        });
    } else {
        // Invalidate size when map container becomes visible
        setTimeout(() => {
            locationMap.invalidateSize();
        }, 100);
    }
}

function updateSelectedLocation(latlng) {
    selectedEventLocation = {
        lat: latlng.lat,
        lng: latlng.lng
    };
    
    // Reverse geocode using Nominatim (free OpenStreetMap service)
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
        .then(response => response.json())
        .then(data => {
            if (data.display_name) {
                document.getElementById('event-location').value = data.display_name;
            }
        })
        .catch(error => {
            console.error('Geocoding error:', error);
            document.getElementById('event-location').value = `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`;
        });
}

async function loadNearbyEvents() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/events/nearby`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayNearbyEvents(data.events);
        }
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

// Populate filter dropdowns with location data
function populateFilterDistricts() {
    const filterDistrictSelect = document.getElementById('filter-district');
    if (!filterDistrictSelect) return;
    
    // First populate division tabs
    populateDivisionTabs();
}

function populateDivisionTabs() {
    const tabsContainer = document.getElementById('division-tabs-container');
    if (!tabsContainer) return;
    
    const maharashtra = locationData.india.states.maharashtra;
    if (!maharashtra.divisions) return;
    
    tabsContainer.innerHTML = '';
    
    Object.entries(maharashtra.divisions).forEach(([divisionKey, divisionData], index) => {
        const tab = document.createElement('button');
        tab.className = `division-tab ${index === 0 ? 'active' : ''}`;
        tab.textContent = divisionData.name;
        tab.dataset.division = divisionKey;
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            selectDivision(divisionKey);
        });
        tabsContainer.appendChild(tab);
    });
    
    // Select first division by default
    if (Object.keys(maharashtra.divisions).length > 0) {
        selectDivision(Object.keys(maharashtra.divisions)[0]);
    }
}

function selectDivision(divisionKey) {
    const maharashtra = locationData.india.states.maharashtra;
    const divisionData = maharashtra.divisions[divisionKey];
    
    // Update tab active state
    document.querySelectorAll('.division-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-division="${divisionKey}"]`)?.classList.add('active');
    
    // Populate district dropdown with districts from this division
    const filterDistrictSelect = document.getElementById('filter-district');
    filterDistrictSelect.innerHTML = '<option value="">All Districts</option>';
    
    Object.entries(divisionData.districts).forEach(([districtKey, districtData]) => {
        const option = document.createElement('option');
        option.value = districtKey;
        option.textContent = districtData.name;
        filterDistrictSelect.appendChild(option);
    });
    
    // Reset taluka and area
    document.getElementById('filter-taluka').innerHTML = '<option value="">All Talukas</option>';
    document.getElementById('filter-area').value = '';
}

function updateFilterTalukaDropdown() {
    const filterDistrictSelect = document.getElementById('filter-district');
    const filterTalukaSelect = document.getElementById('filter-taluka');
    const filterAreaInput = document.getElementById('filter-area');
    
    if (!filterDistrictSelect || !filterTalukaSelect) return;
    
    const selectedDistrict = filterDistrictSelect.value;
    
    // Reset taluka and area dropdowns
    filterTalukaSelect.innerHTML = '<option value="">All Talukas</option>';
    filterAreaInput.value = '';
    
    if (!selectedDistrict) return;
    
    // Find talukas for selected district from the current division
    const maharashtra = locationData.india.states.maharashtra;
    let talukas = [];
    
    // Find the district in any division
    Object.values(maharashtra.divisions).forEach(division => {
        Object.entries(division.districts).forEach(([districtKey, districtData]) => {
            if (districtKey === selectedDistrict) {
                talukas = districtData.talukas;
            }
        });
    });
    
    // Add talukas to dropdown
    talukas.forEach(taluka => {
        const option = document.createElement('option');
        option.value = taluka;
        option.textContent = taluka;
        filterTalukaSelect.appendChild(option);
    });
}

function updateFilterAreaDropdown() {
    const filterDistrictSelect = document.getElementById('filter-district');
    const filterAreaInput = document.getElementById('filter-area');
    
    if (!filterDistrictSelect) return;
    
    const selectedDistrict = filterDistrictSelect.value;
    
    // Clear previous datalist
    let datalist = document.getElementById('area-suggestions');
    if (datalist) datalist.remove();
    
    if (!selectedDistrict) return;
    
    // Find areas for selected district
    const maharashtra = locationData.india.states.maharashtra;
    let areas = [];
    
    Object.values(maharashtra.divisions).forEach(division => {
        Object.entries(division.districts).forEach(([districtKey, districtData]) => {
            if (districtKey === selectedDistrict) {
                areas = districtData.areas;
            }
        });
    });
    
    // Create and add datalist for area suggestions
    if (areas.length > 0) {
        const datalist = document.createElement('datalist');
        datalist.id = 'area-suggestions';
        areas.forEach(area => {
            const option = document.createElement('option');
            option.value = area;
            datalist.appendChild(option);
        });
        filterAreaInput.setAttribute('list', 'area-suggestions');
        document.body.appendChild(datalist);
    }
}

function displayNearbyEvents(events) {
    const container = document.getElementById('events-container');
    if (!container) return;
    
    if (!events || events.length === 0) {
        container.innerHTML = '<div style="padding: 40px; text-align: center; color: #666; background: rgba(255, 255, 255, 0.7); border-radius: 12px; margin-top: 20px;"><p>📭 No events found in your area.</p><p style="font-size: 0.9rem; margin-top: 10px;">Try adjusting your filters or selecting a different location.</p></div>';
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="event-item" onclick="selectEvent('${event._id}')">
            <div class="event-item-header">
                <h3 class="event-item-title">${event.title}</h3>
                <span class="event-item-type">${event.type}</span>
            </div>
            <div class="event-item-details">
                <div class="event-item-detail">
                    <span>📍</span> ${event.area || 'N/A'}, ${event.district || 'N/A'}
                </div>
                <div class="event-item-detail">
                    <span>📅</span> ${new Date(event.date).toLocaleDateString()}
                </div>
                <div class="event-item-detail">
                    <span>⏰</span> ${event.time}
                </div>
                <div class="event-item-detail">
                    <span>💺</span> ${event.maxSeats - (event.enrollments || []).length} seats
                </div>
            </div>
        </div>
    `).join('');
}

function addEventMarkersToMap(events) {
    // Add event markers to the nearby events Leaflet map
    if (!nearbyEventsMap) {
        console.warn('Map not initialized yet');
        return;
    }
    
    // Clear existing event markers
    eventMarkers.forEach(marker => marker.remove());
    eventMarkers = [];
    
    events.forEach(event => {
        if (event.latitude && event.longitude) {
            const marker = L.marker([event.latitude, event.longitude])
                .addTo(nearbyEventsMap)
                .bindPopup(`
                    <div class="event-popup">
                        <h4>${event.title}</h4>
                        <p>${event.type}</p>
                        <p>${new Date(event.date).toLocaleDateString()}</p>
                        <button onclick="selectEvent('${event._id}')" class="popup-btn">View Details</button>
                    </div>
                `);
            eventMarkers.push(marker);
        }
    });
    
    // Fit map to show all markers if there are any
    if (eventMarkers.length > 0) {
        const group = L.featureGroup(eventMarkers);
        nearbyEventsMap.fitBounds(group.getBounds().pad(0.1));
    }
}

function selectEvent(eventId) {
    showEventModal(eventId);
}

async function showEventModal(eventId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/events/${eventId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            const event = data.event;
            
            const eventDetail = document.getElementById('event-detail');
            eventDetail.innerHTML = `
                <div class="event-detail-row">
                    <div class="event-detail-label">Title</div>
                    <div class="event-detail-value">${event.title}</div>
                </div>
                <div class="event-detail-row">
                    <div class="event-detail-label">Type</div>
                    <div class="event-detail-value">${event.type}</div>
                </div>
                <div class="event-detail-row">
                    <div class="event-detail-label">Description</div>
                    <div class="event-detail-value">${event.description}</div>
                </div>
                <div class="event-detail-row">
                    <div class="event-detail-label">Location</div>
                    <div class="event-detail-value">${event.area}, ${event.district}</div>
                </div>
                <div class="event-detail-row">
                    <div class="event-detail-label">Date & Time</div>
                    <div class="event-detail-value">${new Date(event.date).toLocaleDateString()} at ${event.time}</div>
                </div>
                <div class="event-detail-row">
                    <div class="event-detail-label">Seats Available</div>
                    <div class="event-detail-value">${event.maxSeats - (event.enrollments || []).length} / ${event.maxSeats}</div>
                </div>
                <div class="event-detail-row">
                    <div class="event-detail-label">Contact</div>
                    <div class="event-detail-value">${event.contact}</div>
                </div>
            `;
            
            const modal = document.getElementById('event-modal');
            modal.classList.add('show');
            
            document.getElementById('enroll-btn').onclick = () => {
                showEnrollmentModal(eventId);
            };
            
            document.getElementById('view-directions-btn').onclick = () => {
                openDirections(event.location);
            };
        }
    } catch (error) {
        console.error('Error loading event:', error);
    }
}

function showEnrollmentModal(eventId) {
    const modal = document.getElementById('enrollment-modal');
    modal.classList.add('show');
    modal.dataset.eventId = eventId;
    
    // Auto-fill user data
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('enroll-name').value = user.name || '';
    document.getElementById('enroll-location').value = `${user.area}, ${user.district}`;
    document.getElementById('enroll-contact').value = user.mobile || '';
}

async function handleEnrollment(e) {
    e.preventDefault();
    
    const modal = document.getElementById('enrollment-modal');
    const eventId = modal.dataset.eventId;
    const token = localStorage.getItem('token');
    
    if (!eventId) {
        showNotification('Event ID is missing. Please try again.', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('eventId', eventId);
    formData.append('name', document.getElementById('enroll-name').value);
    formData.append('age', document.getElementById('enroll-age').value);
    formData.append('location', document.getElementById('enroll-location').value);
    formData.append('contact', document.getElementById('enroll-contact').value);
    
    const idProofFile = document.getElementById('enroll-id-proof').files[0];
    if (!idProofFile) {
        showNotification('Please upload your ID proof', 'error');
        return;
    }
    formData.append('idProof', idProofFile);
    
    try {
        const response = await fetch(`${API_URL}/enrollments`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Enrolled successfully!', 'success');
            modal.classList.remove('show');
            document.getElementById('event-modal').classList.remove('show');
            document.getElementById('enrollment-form').reset();
            loadNearbyEvents();
        } else {
            showNotification(data.message || 'Enrollment failed', 'error');
        }
    } catch (error) {
        console.error('Enrollment error:', error);
        showNotification('Enrollment failed', 'error');
    }
}

async function loadMyEvents() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/events/my-events`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            const container = document.getElementById('my-events-container');
            
            container.innerHTML = data.events.length > 0 ? data.events.map(event => {
                const statusColor = event.status === 'approved' ? '#48bb78' : 
                                   event.status === 'rejected' ? '#f56565' : '#ecc94b';
                const statusLabel = event.status.charAt(0).toUpperCase() + event.status.slice(1);
                
                return `
                <div class="event-card">
                    <div class="event-card-header">
                        <span class="event-type">${event.type}</span>
                        <h3 class="event-title">${event.title}</h3>
                        <span class="status-badge" style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">${statusLabel}</span>
                    </div>
                    <div class="event-card-body">
                        <div class="event-info">
                            ${event.adminComment ? `<div class="event-info-item">
                                <span>📝</span> Admin Comment: <strong>${event.adminComment}</strong>
                            </div>` : ''}
                            <div class="event-info-item">
                                <span>📍</span> ${event.area}, ${event.district}
                            </div>
                            <div class="event-info-item">
                                <span>📅</span> ${new Date(event.date).toLocaleDateString()}
                            </div>
                        </div>
                        <div class="event-footer">
                            <span class="seats-available">${event.maxSeats - (event.enrollments || []).length} seats left</span>
                        </div>
                    </div>
                </div>
            `;
            }).join('') : '<p>No events created yet</p>';
        }
    } catch (error) {
        console.error('Error loading my events:', error);
    }
}

async function handleCreateEvent(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    
    const eventData = {
        title: document.getElementById('event-title').value,
        type: document.getElementById('event-type').value,
        description: document.getElementById('event-description').value,
        location: selectedEventLocation || {},
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        contact: document.getElementById('event-contact').value,
        maxSeats: document.getElementById('event-seats').value
    };
    
    try {
        const response = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });
        
        if (response.ok) {
            showNotification('Event created successfully! Pending admin approval.', 'success');
            document.getElementById('create-event-form').reset();
            setTimeout(() => loadMyEvents(), 1000);
        } else {
            const data = await response.json();
            showNotification(data.message || 'Failed to create event', 'error');
        }
    } catch (error) {
        console.error('Error creating event:', error);
        showNotification('Error creating event', 'error');
    }
}

async function loadMyEnrollments() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/enrollments/my-enrollments`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            const container = document.getElementById('enrollments-container');
            
            container.innerHTML = data.enrollments.length > 0 ? data.enrollments.map(enrollment => `
                <div class="event-card">
                    <div class="event-card-header">
                        <h3 class="event-title">${enrollment.eventId?.title || 'Event'}</h3>
                    </div>
                    <div class="event-card-body">
                        <div class="event-info">
                            <div class="event-info-item">
                                <span>📅</span> ${new Date(enrollment.enrollmentDate).toLocaleDateString()}
                            </div>
                            <div class="event-info-item">
                                <span>✅</span> Status: ${enrollment.status}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('') : '<p>No enrollments yet</p>';
        }
    } catch (error) {
        console.error('Error loading enrollments:', error);
    }
}

async function loadProfile() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const profileInfo = document.getElementById('profile-info');
        
        profileInfo.innerHTML = `
            <div class="profile-info-item">
                <div class="profile-info-label">Name</div>
                <div class="profile-info-value">${user.name}</div>
            </div>
            <div class="profile-info-item">
                <div class="profile-info-label">Email</div>
                <div class="profile-info-value">${user.email}</div>
            </div>
            <div class="profile-info-item">
                <div class="profile-info-label">Mobile</div>
                <div class="profile-info-value">${user.mobile}</div>
            </div>
            <div class="profile-info-item">
                <div class="profile-info-label">Location</div>
                <div class="profile-info-value">${user.area}, ${user.district}, ${user.state}</div>
            </div>
            <div class="profile-info-item">
                <div class="profile-info-label">Joined Date</div>
                <div class="profile-info-value">${new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

function openDirections(location) {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.coordinates[1]},${location.coordinates[0]}`;
    window.open(googleMapsUrl, '_blank');
}

function filterEvents() {
    const district = document.getElementById('filter-district').value;
    const taluka = document.getElementById('filter-taluka').value;
    const area = document.getElementById('filter-area').value.toLowerCase();
    
    const token = localStorage.getItem('token');
    
    console.log('Filter Events - District:', district, 'Taluka:', taluka, 'Area:', area);
    
    // If no filters applied, load default Maharashtra events
    if (!district && !taluka && !area) {
        console.log('No filters - loading default');
        loadNearbyEvents();
        // Reset map to Maharashtra default
        updateMapDisplay({
            lat: 19.8975,
            lng: 75.3213,
            zoom: 8,
            name: "Maharashtra"
        });
        return;
    }
    
    // Build query parameters
    const params = new URLSearchParams();
    if (district) params.append('district', district);
    if (taluka) params.append('taluka', taluka);
    if (area) params.append('area', area);
    
    const queryString = params.toString();
    const url = `${API_URL}/events/nearby${queryString ? '?' + queryString : ''}`;
    
    console.log('Fetching events from:', url);
    
    fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
        console.log('Response status:', res.status);
        if (!res.ok) throw new Error('Failed to filter events');
        return res.json();
    })
    .then(data => {
        console.log('Received events:', data.events.length);
        
        if (data.events && data.events.length > 0) {
            displayNearbyEvents(data.events);
            
            // Center map on first event or district center
            const firstEvent = data.events[0];
            if (firstEvent && firstEvent.location) {
                console.log('Updating map to first event:', firstEvent.location);
                updateMapDisplay({
                    lat: firstEvent.location.coordinates[1],
                    lng: firstEvent.location.coordinates[0],
                    zoom: 12,
                    name: area || taluka || district || firstEvent.title
                });
            }
        } else {
            displayNearbyEvents([]);
            showNotification('No events found for selected filters', 'info');
            // Reset to Maharashtra view
            updateMapDisplay({
                lat: 19.8975,
                lng: 75.3213,
                zoom: 8,
                name: "Maharashtra"
            });
        }
    })
    .catch(error => {
        console.error('Error filtering events:', error);
        showNotification('Error filtering events: ' + error.message, 'error');
    });
}

// Function to update map with new location
function updateMapDisplay(location) {
    if (!nearbyEventsMap) return;
    
    const zoom = location.zoom || 12;
    const lat = location.lat;
    const lng = location.lng;
    const name = location.name || 'Location';
    
    console.log('Updating map display to:', { lat, lng, zoom, name });
    
    // Pan to new location
    nearbyEventsMap.setView([lat, lng], zoom);
    
    // Clear old markers
    eventMarkers.forEach(marker => marker.remove());
    eventMarkers = [];
    
    // Add marker for the location
    const marker = L.marker([lat, lng]).addTo(nearbyEventsMap);
    marker.bindPopup(`<strong>${name}</strong>`).openPopup();
    eventMarkers.push(marker);
}

function loadEventsForMap() {
    loadNearbyEvents();
}

// ==================== Initialize ==================== //

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    populateFilterDistricts();
    showSection('nearby-events');
});
