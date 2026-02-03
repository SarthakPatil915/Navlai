// ==================== Admin JS ==================== //
// Note: Requires utils.js to be loaded first

// DOM Elements will be initialized on DOMContentLoaded
let adminSections;
let adminSidebarLinks;
let adminLogoutBtn;
let adminName;

// ==================== Functions ==================== //

// ==================== Functions ==================== //

function checkAdminAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    console.log('=== checkAdminAuth ===');
    console.log('Token:', token ? 'EXISTS' : 'MISSING');
    console.log('User:', user);
    console.log('User Role:', user?.role);
    
    if (!token || !user || user.role !== 'admin') {
        console.error('Auth failed - redirecting to home');
        window.location.href = 'index.html';
        return;
    }
    
    if (adminName) {
        adminName.textContent = user.name || 'Admin';
    }
}

function showAdminSection(sectionId) {
    console.log('showAdminSection called with:', sectionId);
    
    // Hide all sections
    adminSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all links
    adminSidebarLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        console.log('Setting section active:', sectionId);
        section.classList.add('active');
        
        // Check computed styles
        const computedStyle = window.getComputedStyle(section);
        console.log('Section display:', computedStyle.display);
        console.log('Section opacity:', computedStyle.opacity);
        console.log('Section visibility:', computedStyle.visibility);
        console.log('Section has active class:', section.classList.contains('active'));
        
        const isVisible = section.offsetHeight > 0;
        console.log('Section visibility after setting active:', isVisible);
    } else {
        console.log('Section not found:', sectionId);
    }
    
    // Highlight active link
    document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');
    
    // Load section-specific data
    console.log('Loading data for section:', sectionId);
    if (sectionId === 'dashboard') {
        console.log('Loading dashboard stats');
        loadDashboardStats();
    } else if (sectionId === 'pending-events') {
        console.log('Loading pending events');
        loadPendingEvents();
    } else if (sectionId === 'approved-events') {
        console.log('Loading approved events');
        loadApprovedEvents();
    } else if (sectionId === 'all-events') {
        console.log('Loading all events');
        loadAllEvents();
    } else if (sectionId === 'users') {
        console.log('Loading users');
        loadUsers();
    } else if (sectionId === 'enrollments') {
        console.log('Loading enrollments');
        loadEnrollments();
    } else if (sectionId === 'reports') {
        console.log('Loading reports');
        loadReports();
    } else if (sectionId === 'feedback') {
        console.log('Loading feedback');
        loadFeedback();
    }
}

async function loadDashboardStats() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/dashboard-stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            document.getElementById('total-events').textContent = data.totalEvents;
            document.getElementById('pending-events-count').textContent = data.pendingEvents;
            document.getElementById('total-users-count').textContent = data.totalUsers;
            document.getElementById('total-enrollments-count').textContent = data.totalEnrollments;
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

async function loadPendingEvents() {
    try {
        console.log("🔵 loadPendingEvents() called");
        const token = localStorage.getItem('token');
        console.log("Token found:", !!token);
        
        const response = await fetch(`${API_URL}/admin/events/pending`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log("API Response Status:", response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log("Received data:", data);
            console.log("Pending events received:", data.total);
            console.log("Events array:", data.events);
            
            const container = document.getElementById('pending-events-list');
            console.log("Container found:", !!container);
            
            if (!container) {
                console.error('Container not found! Looking for #pending-events-list');
                return;
            }
            
            // Check container computed styles
            const containerStyle = window.getComputedStyle(container);
            console.log('Container display:', containerStyle.display);
            console.log('Container visibility:', containerStyle.visibility);
            console.log('Container background:', containerStyle.backgroundColor);
            console.log('Container color:', containerStyle.color);
            
            if (data.events && data.events.length > 0) {
                console.log(`Rendering ${data.events.length} events`);
                const htmlContent = data.events.map((event, index) => {
                    console.log(`Creating card for event ${index + 1}:`, event.title);
                    return `
                        <div class="event-card-review" style="background: white; padding: 15px; margin-bottom: 10px; border: 1px solid #e0e0e0; border-radius: 8px;">
                            <div class="event-card-info">
                                <h3 style="margin: 0 0 10px 0; color: #333; font-size: 1.2rem;">${event.title}</h3>
                                <div class="event-card-meta" style="display: flex; gap: 15px; color: #666; font-size: 0.9rem;">
                                    <span>📍 ${event.area || 'N/A'}, ${event.district || 'N/A'}</span>
                                    <span>📅 ${event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</span>
                                    <span>👤 ${event.createdBy?.name || 'Unknown'}</span>
                                </div>
                            </div>
                            <div class="event-card-actions" style="display: flex; gap: 10px; margin-left: 20px; flex-shrink: 0;">
                                <button class="btn btn-primary" onclick="reviewEvent('${event._id}', 'approve')" style="padding: 8px 15px; font-size: 0.85rem; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Approve</button>
                                <button class="btn btn-danger" onclick="reviewEvent('${event._id}', 'reject')" style="padding: 8px 15px; font-size: 0.85rem; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Reject</button>
                            </div>
                        </div>
                    `;
                }).join('');
                
                container.innerHTML = htmlContent;
                console.log("✅ Events rendered successfully");
                console.log("Container HTML length:", container.innerHTML.length);
            } else {
                console.log("No events to display");
                container.innerHTML = '<p style="padding: 20px; color: #333; font-size: 1.1rem; background: white;">No pending events</p>';
            }
        } else {
            const error = await response.json();
            console.error('API Error:', error);
            const container = document.getElementById('pending-events-list');
            if (container) {
                container.innerHTML = '<p style="padding: 20px; color: red;">Error loading events. Please try again.</p>';
            }
        }
    } catch (error) {
        console.error('Error loading pending events:', error);
        const container = document.getElementById('pending-events-list');
        if (container) {
            container.innerHTML = '<p style="padding: 20px; color: red;">Error: ' + error.message + '</p>';
        }
    }
}

async function loadApprovedEvents() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/events/approved`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            const container = document.getElementById('approved-events-list');
            
            container.innerHTML = data.events.length > 0 ? data.events.map(event => `
                <div class="event-card-review">
                    <div class="event-card-info">
                        <h3>${event.title}</h3>
                        <div class="event-card-meta">
                            <span>📍 ${event.area}, ${event.district}</span>
                            <span>📅 ${new Date(event.date).toLocaleDateString()}</span>
                            <span>💺 ${(event.enrollments || []).length} / ${event.maxSeats} enrolled</span>
                        </div>
                    </div>
                    <div class="event-card-actions">
                        <button class="btn btn-secondary" onclick="closeEnrollment('${event._id}')">
                            ${event.enrollmentClosed ? 'Reopen' : 'Close'} Enrollment
                        </button>
                    </div>
                </div>
            `).join('') : '<p style="padding: 20px; color: var(--text-primary); font-size: 1.1rem;">No approved events</p>';
        } else {
            const error = await response.json();
            console.error('API Error:', error);
            document.getElementById('approved-events-list').innerHTML = '<p style="padding: 20px; color: red;">Error loading events. Please try again.</p>';
        }
    } catch (error) {
        console.error('Error loading approved events:', error);
        document.getElementById('approved-events-list').innerHTML = '<p style="padding: 20px; color: red;">Error: ' + error.message + '</p>';
    }
}

async function loadAllEvents() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/events`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            const tbody = document.getElementById('all-events-table');
            
            tbody.innerHTML = data.events.map(event => `
                <tr>
                    <td>${event.title}</td>
                    <td>${event.type}</td>
                    <td>${new Date(event.date).toLocaleDateString()}</td>
                    <td><span class="status-badge status-${event.status}">${event.status}</span></td>
                    <td>${(event.enrollments || []).length} / ${event.maxSeats}</td>
                    <td>
                        <button class="btn btn-small" onclick="deleteEvent('${event._id}')">Delete</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading all events:', error);
    }
}

async function loadUsers() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            const tbody = document.getElementById('users-table');
            
            tbody.innerHTML = data.users.map(user => `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.mobile}</td>
                    <td>${user.area}, ${user.district}</td>
                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-small" onclick="viewUserDetail('${user._id}')">View</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function loadEnrollments() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/enrollments`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            const tbody = document.getElementById('enrollments-table');
            
            tbody.innerHTML = data.enrollments.map(enrollment => `
                <tr>
                    <td>${enrollment.eventId?.title || 'Event'}</td>
                    <td>${enrollment.name}</td>
                    <td>${enrollment.age}</td>
                    <td>${enrollment.contact}</td>
                    <td>${new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
                    <td><span class="status-badge status-${enrollment.status}">${enrollment.status}</span></td>
                    <td>
                        <button class="btn btn-small" onclick="approveEnrollment('${enrollment._id}')">Approve</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading enrollments:', error);
    }
}

async function loadReports() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/reports`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Display events by type
            const eventsByTypeChart = document.getElementById('events-by-type-chart');
            eventsByTypeChart.innerHTML = `<div style="padding: 20px; text-align: center;">
                ${Object.entries(data.eventsByType).map(([type, count]) => 
                    `<div style="margin: 10px 0;"><strong>${type}:</strong> ${count} events</div>`
                ).join('')}
            </div>`;
            
            // Display top events
            const topEventsList = document.getElementById('top-events-list');
            topEventsList.innerHTML = data.topEvents.map(event => `
                <li class="top-event-item">
                    <span class="top-event-name">${event.title}</span>
                    <span class="top-event-count">${(event.enrollments || []).length} enrollments</span>
                </li>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

async function reviewEvent(eventId, action) {
    const token = localStorage.getItem('token');
    const comment = prompt('Add comment (optional):') || '';
    
    try {
        const response = await fetch(`${API_URL}/admin/events/${eventId}/${action}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comment })
        });
        
        if (response.ok) {
            showNotification(`Event ${action}ed successfully!`, 'success');
            // Reload both lists to reflect changes
            loadPendingEvents();
            loadApprovedEvents();
            loadDashboardStats();
        } else {
            showNotification('Failed to process event', 'error');
        }
    } catch (error) {
        console.error('Error reviewing event:', error);
        showNotification('Error processing event', 'error');
    }
}

async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_URL}/admin/events/${eventId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            showNotification('Event deleted successfully!', 'success');
            loadAllEvents();
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        showNotification('Error deleting event', 'error');
    }
}

async function closeEnrollment(eventId) {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_URL}/admin/events/${eventId}/toggle-enrollment`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            showNotification('Enrollment status updated!', 'success');
            loadApprovedEvents();
        }
    } catch (error) {
        console.error('Error updating enrollment:', error);
    }
}

async function approveEnrollment(enrollmentId) {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_URL}/admin/enrollments/${enrollmentId}/approve`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            showNotification('Enrollment approved!', 'success');
            loadEnrollments();
        }
    } catch (error) {
        console.error('Error approving enrollment:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing Admin Dashboard');
    
    // Initialize DOM elements
    adminSections = document.querySelectorAll('.admin-section');
    adminSidebarLinks = document.querySelectorAll('.sidebar-link');
    adminLogoutBtn = document.getElementById('logout-btn');
    adminName = document.getElementById('admin-name');
    
    console.log('Found sidebar links:', adminSidebarLinks.length);
    
    // Attach event listeners
    adminSidebarLinks.forEach((link, index) => {
        console.log(`Attaching click listener to sidebar link ${index}:`, link.dataset.section);
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            console.log('Sidebar link clicked - Section:', sectionId);
            showAdminSection(sectionId);
        });
    });
    
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }
    
    // Check authentication and load dashboard
    checkAdminAuth();
    showAdminSection('dashboard');
});

// ==================== Feedback Functions ==================== //

let currentFeedbackId = null;

async function loadFeedback() {
    const token = localStorage.getItem('token');
    const feedbackTable = document.getElementById('feedback-table');
    
    console.log('=== loadFeedback called ===');
    console.log('Token from localStorage:', token ? 'EXISTS' : 'MISSING');
    
    try {
        const response = await fetch(`${API_URL}/feedback`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('API Response Status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error('Failed to load feedback');
        }
        
        const data = await response.json();
        const feedbackList = data.feedback || [];
        
        console.log('Feedback fetched:', feedbackList.length, 'messages');
        
        if (feedbackList.length === 0) {
            feedbackTable.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No feedback messages yet.</td></tr>';
            return;
        }
        
        feedbackTable.innerHTML = feedbackList.map(feedback => `
            <tr>
                <td>${escapeHtml(feedback.name)}</td>
                <td>${escapeHtml(feedback.email)}</td>
                <td>${escapeHtml(feedback.subject)}</td>
                <td class="message-cell">${escapeHtml(feedback.message.substring(0, 50))}...</td>
                <td>
                    <span class="status-badge status-${feedback.status}">
                        ${feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                    </span>
                </td>
                <td>${new Date(feedback.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewFeedback('${feedback._id}')">View</button>
                </td>
            </tr>
        `).join('');
        
        // Setup filter buttons
        setupFeedbackFilters(feedbackList);
    } catch (error) {
        console.error('Error loading feedback:', error);
        feedbackTable.innerHTML = '<tr><td colspan="7" style="color: red; text-align: center;">Error loading feedback</td></tr>';
    }
}

function setupFeedbackFilters(feedbackList) {
    const filterBtns = document.querySelectorAll('.feedback-filters .filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked button
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            filterFeedback(filter, feedbackList);
        });
    });
}

function filterFeedback(filter, feedbackList) {
    const feedbackTable = document.getElementById('feedback-table');
    let filtered = feedbackList;
    
    if (filter !== 'all') {
        filtered = feedbackList.filter(f => f.status === filter);
    }
    
    if (filtered.length === 0) {
        feedbackTable.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No feedback with this status.</td></tr>';
        return;
    }
    
    feedbackTable.innerHTML = filtered.map(feedback => `
        <tr>
            <td>${escapeHtml(feedback.name)}</td>
            <td>${escapeHtml(feedback.email)}</td>
            <td>${escapeHtml(feedback.subject)}</td>
            <td class="message-cell">${escapeHtml(feedback.message.substring(0, 50))}...</td>
            <td>
                <span class="status-badge status-${feedback.status}">
                    ${feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                </span>
            </td>
            <td>${new Date(feedback.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewFeedback('${feedback._id}')">View</button>
            </td>
        </tr>
    `).join('');
}

async function viewFeedback(feedbackId) {
    const token = localStorage.getItem('token');
    currentFeedbackId = feedbackId;
    
    try {
        const response = await fetch(`${API_URL}/feedback/${feedbackId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load feedback details');
        }
        
        const data = await response.json();
        const feedback = data.feedback;
        
        // Display feedback details in modal
        const feedbackDetail = document.getElementById('feedback-detail');
        feedbackDetail.innerHTML = `
            <div class="feedback-details">
                <div class="detail-row">
                    <label>Name:</label>
                    <p>${escapeHtml(feedback.name)}</p>
                </div>
                <div class="detail-row">
                    <label>Email:</label>
                    <p>${escapeHtml(feedback.email)}</p>
                </div>
                <div class="detail-row">
                    <label>Phone:</label>
                    <p>${escapeHtml(feedback.phone || 'Not provided')}</p>
                </div>
                <div class="detail-row">
                    <label>Subject:</label>
                    <p>${escapeHtml(feedback.subject)}</p>
                </div>
                <div class="detail-row">
                    <label>Message:</label>
                    <p class="message-content">${escapeHtml(feedback.message)}</p>
                </div>
                <div class="detail-row">
                    <label>Received:</label>
                    <p>${new Date(feedback.createdAt).toLocaleString()}</p>
                </div>
            </div>
        `;
        
        // Set current status
        const statusSelect = document.getElementById('feedback-status-select');
        statusSelect.value = feedback.status;
        
        // Show modal
        document.getElementById('feedback-modal').style.display = 'flex';
    } catch (error) {
        console.error('Error loading feedback details:', error);
        showNotification('Error loading feedback details', 'error');
    }
}

async function updateFeedbackStatus() {
    const token = localStorage.getItem('token');
    const newStatus = document.getElementById('feedback-status-select').value;
    
    if (!newStatus) {
        showNotification('Please select a status', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/feedback/${currentFeedbackId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update status');
        }
        
        showNotification('Feedback status updated successfully!', 'success');
        closeFeedbackModal();
        loadFeedback();
    } catch (error) {
        console.error('Error updating feedback status:', error);
        showNotification('Error updating feedback status', 'error');
    }
}

async function deleteFeedback() {
    const token = localStorage.getItem('token');
    
    if (!confirm('Are you sure you want to delete this feedback?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/feedback/${currentFeedbackId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete feedback');
        }
        
        showNotification('Feedback deleted successfully!', 'success');
        closeFeedbackModal();
        loadFeedback();
    } catch (error) {
        console.error('Error deleting feedback:', error);
        showNotification('Error deleting feedback', 'error');
    }
}

function closeFeedbackModal() {
    document.getElementById('feedback-modal').style.display = 'none';
    currentFeedbackId = null;
}

// Setup feedback modal close buttons
document.addEventListener('DOMContentLoaded', () => {
    // Existing initialization code will run first
    
    // Feedback modal event listeners
    const feedbackModal = document.getElementById('feedback-modal');
    if (feedbackModal) {
        const closeBtn = feedbackModal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeFeedbackModal);
        }
        
        const updateStatusBtn = document.getElementById('update-feedback-status-btn');
        if (updateStatusBtn) {
            updateStatusBtn.addEventListener('click', updateFeedbackStatus);
        }
        
        const deleteBtn = document.getElementById('delete-feedback-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', deleteFeedback);
        }
        
        // Close modal when clicking outside
        feedbackModal.addEventListener('click', (e) => {
            if (e.target === feedbackModal) {
                closeFeedbackModal();
            }
        });
    }
});
