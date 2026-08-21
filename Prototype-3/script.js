const USERS_KEY = "shareride_p3_users";
const RIDES_KEY = "shareride_p3_rides";
const BOOKINGS_KEY = "shareride_p3_bookings";
const SESSION_KEY = "shareride_p3_current_user";

/* =====================================================
   INITIAL DATA (PROTOTYPE 3)
===================================================== */
function initializeData() {
    if (!localStorage.getItem(USERS_KEY)) {
        const demoUsers = [
            {
                id: "user1",
                name: "Rahim Ahmed",
                email: "rahim@example.com",
                phone: "01711223344",
                password: "123456"
            },
            {
                id: "user2",
                name: "Karim Hasan",
                email: "karim@example.com",
                phone: "01811223344",
                password: "123456"
            },
            {
                id: "user3",
                name: "Nusrat Jahan",
                email: "nusrat@example.com",
                phone: "01911223344",
                password: "123456"
            }
        ];
        localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
    }

    if (!localStorage.getItem(RIDES_KEY)) {
        const demoRides = [
            {
                id: "ride_101",
                driverId: "user1",
                driverName: "Rahim Ahmed",
                driverPhone: "01711223344",
                vehicle: "Toyota Corolla (Sedan)",
                source: "Rajshahi",
                destination: "Dhaka",
                date: "2026-08-25",
                time: "07:30",
                totalSeats: 4,
                availableSeats: 3,
                fare: 550,
                status: "active"
            },
            {
                id: "ride_102",
                driverId: "user2",
                driverName: "Karim Hasan",
                driverPhone: "01811223344",
                vehicle: "Honda Grace Hybrid",
                source: "Rajshahi",
                destination: "Dhaka",
                date: "2026-08-25",
                time: "09:00",
                totalSeats: 4,
                availableSeats: 2,
                fare: 500,
                status: "active"
            },
            {
                id: "ride_103",
                driverId: "user3",
                driverName: "Nusrat Jahan",
                driverPhone: "01911223344",
                vehicle: "Noah Microbus",
                source: "Dhaka",
                destination: "Chittagong",
                date: "2026-08-26",
                time: "06:30",
                totalSeats: 7,
                availableSeats: 5,
                fare: 650,
                status: "active"
            }
        ];
        localStorage.setItem(RIDES_KEY, JSON.stringify(demoRides));
    }

    if (!localStorage.getItem(BOOKINGS_KEY)) {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify([]));
    }
}

/* =====================================================
   STORAGE HELPERS
===================================================== */
function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getRides() {
    return JSON.parse(localStorage.getItem(RIDES_KEY)) || [];
}

function saveRides(rides) {
    localStorage.setItem(RIDES_KEY, JSON.stringify(rides));
}

function getBookings() {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || [];
}

function saveBookings(bookings) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

/* =====================================================
   CURRENT USER & AUTH
===================================================== */
function getCurrentUser() {
    const userId = localStorage.getItem(SESSION_KEY);
    if (!userId) return null;
    const users = getUsers();
    return users.find(user => user.id === userId) || null;
}

function setCurrentUser(userId) {
    localStorage.setItem(SESSION_KEY, userId);
}

function clearCurrentUser() {
    localStorage.removeItem(SESSION_KEY);
}

/* =====================================================
   PAGE NAVIGATION
===================================================== */
function showPage(pageId) {
    const protectedPages = ["dashboard", "offerRide", "myRides", "bookings"];

    if (protectedPages.includes(pageId) && !getCurrentUser()) {
        showToast("Please login first to access this page.", "⚠️");
        pageId = "login";
    }

    const pages = document.querySelectorAll(".page");
    pages.forEach(page => page.classList.remove("active"));

    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    if (pageId === "dashboard") updateDashboard();
    if (pageId === "myRides") renderMyRides();
    if (pageId === "bookings") renderBookings();
    if (pageId === "findRide") renderAllRides();

    updateNavbar();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =====================================================
   NAVBAR
===================================================== */
function updateNavbar() {
    const user = getCurrentUser();
    const loginNav = document.getElementById("loginNav");
    const registerNav = document.getElementById("registerNav");
    const dashboardNav = document.getElementById("dashboardNav");
    const logoutNav = document.getElementById("logoutNav");

    if (user) {
        loginNav.classList.add("hidden");
        registerNav.classList.add("hidden");
        dashboardNav.classList.remove("hidden");
        logoutNav.classList.remove("hidden");
    } else {
        loginNav.classList.remove("hidden");
        registerNav.classList.remove("hidden");
        dashboardNav.classList.add("hidden");
        logoutNav.classList.add("hidden");
    }
}

/* =====================================================
   REGISTER
===================================================== */
function register(event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const phone = document.getElementById("registerPhone").value.trim();
    const password = document.getElementById("registerPassword").value;

    const users = getUsers();
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        showToast("An account with this email already exists.", "⚠️");
        return;
    }

    const newUser = {
        id: "user_" + Date.now(),
        name,
        email,
        phone,
        password
    };

    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser.id);

    showToast("Registration successful! Welcome to ShareRide v3.", "🎉");
    event.target.reset();

    setTimeout(() => showPage("dashboard"), 700);
}

/* =====================================================
   LOGIN
===================================================== */
function login(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showToast("Invalid email or password.", "❌");
        return;
    }

    setCurrentUser(user.id);
    showToast("Welcome back, " + user.name + "!", "👋");
    event.target.reset();

    setTimeout(() => showPage("dashboard"), 600);
}

/* =====================================================
   LOGOUT
===================================================== */
function logout() {
    clearCurrentUser();
    updateNavbar();
    showToast("You have been logged out.", "ℹ️");
    setTimeout(() => showPage("home"), 500);
}

/* =====================================================
   DASHBOARD
===================================================== */
function updateDashboard() {
    const user = getCurrentUser();
    if (!user) return;

    document.getElementById("welcomeUser").textContent = `Welcome, ${user.name}!`;

    const rides = getRides();
    const bookings = getBookings();

    const myRides = rides.filter(ride => ride.driverId === user.id);
    const myBookings = bookings.filter(b => b.passengerId === user.id && b.status === "confirmed");
    const activeRides = myRides.filter(ride => ride.status === "active");

    const totalSpent = myBookings.reduce((sum, b) => sum + (Number(b.totalCost) || 0), 0);

    document.getElementById("rideCount").textContent = myRides.length;
    document.getElementById("bookingCount").textContent = myBookings.length;
    document.getElementById("activeRideCount").textContent = activeRides.length;
    document.getElementById("totalSpent").textContent = `৳${totalSpent}`;
}

/* =====================================================
   CREATE RIDE
===================================================== */
function createRide(event) {
    event.preventDefault();

    const user = getCurrentUser();
    if (!user) {
        showToast("Please login first.", "⚠️");
        showPage("login");
        return;
    }

    const source = document.getElementById("rideSource").value.trim();
    const destination = document.getElementById("rideDestination").value.trim();
    const date = document.getElementById("rideDate").value;
    const time = document.getElementById("rideTime").value;
    const vehicle = document.getElementById("rideVehicle").value.trim() || "Standard Vehicle";
    const seats = Number(document.getElementById("rideSeats").value);
    const fare = Number(document.getElementById("rideFare").value);

    if (source.toLowerCase() === destination.toLowerCase()) {
        showToast("Source and destination cannot be identical.", "⚠️");
        return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
        showToast("Travel date cannot be in the past.", "⚠️");
        return;
    }

    if (seats < 1 || seats > 8) {
        showToast("Seats must be between 1 and 8.", "⚠️");
        return;
    }

    if (fare < 0) {
        showToast("Fare cannot be negative.", "⚠️");
        return;
    }

    const rides = getRides();
    const newRide = {
        id: "ride_" + Date.now(),
        driverId: user.id,
        driverName: user.name,
        driverPhone: user.phone || "N/A",
        vehicle,
        source,
        destination,
        date,
        time,
        totalSeats: seats,
        availableSeats: seats,
        fare,
        status: "active"
    };

    rides.push(newRide);
    saveRides(rides);

    event.target.reset();
    showToast("Trip successfully published in Prototype 3!", "🚗");
    setTimeout(() => showPage("myRides"), 600);
}

/* =====================================================
   RENDER ALL RIDES
===================================================== */
function renderAllRides(rides = getRides()) {
    const container = document.getElementById("rideResults");
    const activeRides = rides.filter(ride => ride.status === "active" && ride.availableSeats > 0);

    if (activeRides.length === 0) {
        container.innerHTML = `
            <div class="empty-state full-grid">
                <span class="empty-icon">🔍</span>
                <h3>No Matching Rides Available</h3>
                <p>Try modifying your origin, destination, or date filters.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = activeRides.map(ride => createRideCard(ride)).join("");
}

/* =====================================================
   RIDE CARD UI
===================================================== */
function createRideCard(ride) {
    return `
        <div class="ride-card">
            <div class="ride-header-row">
                <div class="route-badge">
                    <span class="route-point">${escapeHTML(ride.source)}</span>
                    <span class="route-arrow">➔</span>
                    <span class="route-point">${escapeHTML(ride.destination)}</span>
                </div>
                <span class="fare-badge">৳${ride.fare} <small>/ seat</small></span>
            </div>

            <div class="ride-body">
                <div class="ride-detail-line">
                    <span class="detail-icon">👤</span>
                    <span><strong>Driver:</strong> ${escapeHTML(ride.driverName)}</span>
                </div>
                <div class="ride-detail-line">
                    <span class="detail-icon">🚗</span>
                    <span><strong>Vehicle:</strong> ${escapeHTML(ride.vehicle || "Standard")}</span>
                </div>
                <div class="ride-detail-line">
                    <span class="detail-icon">📅</span>
                    <span>${formatDate(ride.date)} at ${formatTime(ride.time)}</span>
                </div>
                <div class="ride-detail-line">
                    <span class="detail-icon">💺</span>
                    <span><strong>${ride.availableSeats}</strong> seat(s) left (of ${ride.totalSeats})</span>
                </div>
            </div>

            <div class="ride-footer">
                <button class="primary-btn small full-width" onclick="viewRide('${ride.id}')">
                    View Trip Details
                </button>
            </div>
        </div>
    `;
}

/* =====================================================
   SEARCH RIDES
===================================================== */
function searchRides() {
    const source = document.getElementById("searchSource").value.trim().toLowerCase();
    const destination = document.getElementById("searchDestination").value.trim().toLowerCase();
    const date = document.getElementById("searchDate").value;

    const rides = getRides();
    const filtered = rides.filter(ride => {
        const matchesSource = !source || ride.source.toLowerCase().includes(source);
        const matchesDestination = !destination || ride.destination.toLowerCase().includes(destination);
        const matchesDate = !date || ride.date === date;

        return matchesSource && matchesDestination && matchesDate && ride.status === "active" && ride.availableSeats > 0;
    });

    renderAllRides(filtered);
}

function resetSearch() {
    document.getElementById("searchSource").value = "";
    document.getElementById("searchDestination").value = "";
    document.getElementById("searchDate").value = "";
    renderAllRides();
}

/* =====================================================
   VIEW RIDE DETAILS
===================================================== */
function viewRide(rideId) {
    const rides = getRides();
    const ride = rides.find(r => r.id === rideId);

    if (!ride) {
        showToast("Ride details not found.", "❌");
        return;
    }

    const user = getCurrentUser();
    const isOwner = user && ride.driverId === user.id;
    const details = document.getElementById("rideDetailsContent");

    let actionButton = "";

    if (!user) {
        actionButton = `
            <div class="action-card-callout">
                <p>Log in to book seats for this itinerary.</p>
                <button class="primary-btn full-width" onclick="showPage('login')">Login to Book</button>
            </div>
        `;
    } else if (isOwner) {
        actionButton = `
            <div class="info-alert">
                <span>ℹ️</span>
                <p>You are the creator/driver of this ride.</p>
            </div>
        `;
    } else if (ride.availableSeats <= 0) {
        actionButton = `
            <div class="danger-alert">
                <span>🚫</span>
                <p>This trip is fully booked.</p>
            </div>
        `;
    } else {
        actionButton = `
            <div class="booking-box">
                <h4>Book Your Seats</h4>
                <div class="booking-calculator">
                    <div class="calc-row">
                        <label>Select Seats:</label>
                        <select id="bookingSeats" onchange="updateCalculatedFare(${ride.fare})">
                            ${Array.from({length: ride.availableSeats}, (_, i) => `<option value="${i+1}">${i+1} Seat(s)</option>`).join('')}
                        </select>
                    </div>
                    <div class="calc-total">
                        <span>Total Payable:</span>
                        <strong id="calcTotalDisplay">৳${ride.fare}</strong>
                    </div>
                </div>
                <button class="primary-btn full-width" onclick="bookRide('${ride.id}')">Confirm & Book Now</button>
            </div>
        `;
    }

    details.innerHTML = `
        <div class="details-top">
            <span class="badge">Trip Summary</span>
            <h2>${escapeHTML(ride.source)} ➔ ${escapeHTML(ride.destination)}</h2>
        </div>

        <div class="details-grid">
            <div class="detail-cell">
                <label>Driver Name</label>
                <strong>${escapeHTML(ride.driverName)}</strong>
            </div>
            <div class="detail-cell">
                <label>Driver Contact</label>
                <strong>${escapeHTML(ride.driverPhone || "Provided on booking")}</strong>
            </div>
            <div class="detail-cell">
                <label>Vehicle Type</label>
                <strong>${escapeHTML(ride.vehicle || "Sedan")}</strong>
            </div>
            <div class="detail-cell">
                <label>Journey Date</label>
                <strong>${formatDate(ride.date)}</strong>
            </div>
            <div class="detail-cell">
                <label>Departure Time</label>
                <strong>${formatTime(ride.time)}</strong>
            </div>
            <div class="detail-cell">
                <label>Available Capacity</label>
                <strong>${ride.availableSeats} of ${ride.totalSeats} seats</strong>
            </div>
            <div class="detail-cell">
                <label>Fare per Person</label>
                <strong class="fare-highlight">৳${ride.fare}</strong>
            </div>
            <div class="detail-cell">
                <label>Trip Status</label>
                <strong class="status-tag status-${ride.status}">${ride.status.toUpperCase()}</strong>
            </div>
        </div>

        ${actionButton}
    `;

    showPage("rideDetails");
}

function updateCalculatedFare(farePerSeat) {
    const seats = Number(document.getElementById("bookingSeats").value);
    const total = seats * farePerSeat;
    document.getElementById("calcTotalDisplay").textContent = `৳${total}`;
}

/* =====================================================
   BOOK RIDE
===================================================== */
function bookRide(rideId) {
    const user = getCurrentUser();
    if (!user) {
        showToast("Please login first.", "⚠️");
        showPage("login");
        return;
    }

    const rides = getRides();
    const ride = rides.find(r => r.id === rideId);

    if (!ride) {
        showToast("Ride not found.", "❌");
        return;
    }

    if (ride.driverId === user.id) {
        showToast("You cannot book your own ride.", "⚠️");
        return;
    }

    const seats = Number(document.getElementById("bookingSeats").value);

    if (!seats || seats < 1) {
        showToast("Please choose at least 1 seat.", "⚠️");
        return;
    }

    if (seats > ride.availableSeats) {
        showToast("Selected seats exceed availability.", "⚠️");
        return;
    }

    const bookings = getBookings();
    const existingBooking = bookings.find(
        b => b.rideId === rideId && b.passengerId === user.id && b.status === "confirmed"
    );

    if (existingBooking) {
        showToast("You already have an active booking for this ride.", "⚠️");
        return;
    }

    const booking = {
        id: "booking_" + Date.now(),
        rideId,
        passengerId: user.id,
        passengerName: user.name,
        passengerPhone: user.phone || "N/A",
        seats,
        fare: ride.fare,
        totalCost: seats * ride.fare,
        bookingDate: new Date().toISOString(),
        status: "confirmed"
    };

    bookings.push(booking);
    ride.availableSeats -= seats;

    saveBookings(bookings);
    saveRides(rides);

    showToast("Booking confirmed successfully!", "🎉");
    setTimeout(() => showPage("bookings"), 700);
}

/* =====================================================
   MY RIDES
===================================================== */
function renderMyRides() {
    const user = getCurrentUser();
    const container = document.getElementById("myRidesContainer");
    if (!user) { container.innerHTML = ""; return; }

    const rides = getRides();
    const myRides = rides.filter(ride => ride.driverId === user.id);

    if (myRides.length === 0) {
        container.innerHTML = `
            <div class="empty-state full-grid">
                <span class="empty-icon">🚗</span>
                <h3>You Haven't Offered Any Rides Yet</h3>
                <p>Share your next journey with other passengers.</p>
                <button class="primary-btn" onclick="showPage('offerRide')">Publish Your First Trip</button>
            </div>
        `;
        return;
    }

    container.innerHTML = myRides.map(ride => `
        <div class="ride-card">
            <div class="ride-header-row">
                <div class="route-badge">
                    <span class="route-point">${escapeHTML(ride.source)}</span>
                    <span class="route-arrow">➔</span>
                    <span class="route-point">${escapeHTML(ride.destination)}</span>
                </div>
                <span class="status-tag status-${ride.status}">${ride.status.toUpperCase()}</span>
            </div>

            <div class="ride-body">
                <div class="ride-detail-line">
                    <span class="detail-icon">🚗</span>
                    <span><strong>Vehicle:</strong> ${escapeHTML(ride.vehicle || "Sedan")}</span>
                </div>
                <div class="ride-detail-line">
                    <span class="detail-icon">📅</span>
                    <span>${formatDate(ride.date)} at ${formatTime(ride.time)}</span>
                </div>
                <div class="ride-detail-line">
                    <span class="detail-icon">💺</span>
                    <span>${ride.availableSeats} of ${ride.totalSeats} seats open</span>
                </div>
                <div class="ride-detail-line">
                    <span class="detail-icon">৳</span>
                    <span>Fare: <strong>৳${ride.fare}</strong> / seat</span>
                </div>
            </div>

            <div class="ride-footer">
                ${ride.status === "active" ? `
                    <button class="danger-btn full-width" onclick="deleteRide('${ride.id}')">Cancel Ride</button>
                ` : `
                    <button class="disabled-btn full-width" disabled>Trip Cancelled</button>
                `}
            </div>
        </div>
    `).join("");
}

/* =====================================================
   CANCEL RIDE
===================================================== */
function deleteRide(rideId) {
    const user = getCurrentUser();
    if (!user) return;

    const rides = getRides();
    const ride = rides.find(r => r.id === rideId);
    if (!ride || ride.driverId !== user.id) return;

    if (!confirm("Are you sure you want to cancel this entire ride? All passengers will be notified.")) {
        return;
    }

    ride.status = "cancelled";
    saveRides(rides);

    const bookings = getBookings();
    bookings.forEach(b => {
        if (b.rideId === rideId && b.status === "confirmed") {
            b.status = "cancelled_by_driver";
        }
    });
    saveBookings(bookings);

    showToast("Trip has been cancelled.", "ℹ️");
    renderMyRides();
    updateDashboard();
}

/* =====================================================
   BOOKINGS
===================================================== */
function renderBookings() {
    const user = getCurrentUser();
    const container = document.getElementById("bookingsContainer");
    if (!user) return;

    const bookings = getBookings();
    const rides = getRides();
    const myBookings = bookings.filter(b => b.passengerId === user.id);

    if (myBookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state full-grid">
                <span class="empty-icon">🎫</span>
                <h3>No Bookings Found</h3>
                <p>Find available rides heading towards your destination.</p>
                <button class="primary-btn" onclick="showPage('findRide')">Find a Ride</button>
            </div>
        `;
        return;
    }

    container.innerHTML = myBookings.map(booking => {
        const ride = rides.find(r => r.id === booking.rideId);
        if (!ride) return "";

        return `
            <div class="ride-card">
                <div class="ride-header-row">
                    <div class="route-badge">
                        <span class="route-point">${escapeHTML(ride.source)}</span>
                        <span class="route-arrow">➔</span>
                        <span class="route-point">${escapeHTML(ride.destination)}</span>
                    </div>
                    <span class="status-tag status-${booking.status}">${booking.status.toUpperCase()}</span>
                </div>

                <div class="ride-body">
                    <div class="ride-detail-line">
                        <span class="detail-icon">👤</span>
                        <span><strong>Driver:</strong> ${escapeHTML(ride.driverName)} (${escapeHTML(ride.driverPhone || 'N/A')})</span>
                    </div>
                    <div class="ride-detail-line">
                        <span class="detail-icon">📅</span>
                        <span>${formatDate(ride.date)} at ${formatTime(ride.time)}</span>
                    </div>
                    <div class="ride-detail-line">
                        <span class="detail-icon">💺</span>
                        <span>Reserved: <strong>${booking.seats} Seat(s)</strong></span>
                    </div>
                    <div class="ride-detail-line">
                        <span class="detail-icon">💳</span>
                        <span>Total Fare: <strong>৳${booking.totalCost}</strong></span>
                    </div>
                </div>

                <div class="ride-footer">
                    ${booking.status === "confirmed" ? `
                        <button class="danger-btn full-width" onclick="cancelBooking('${booking.id}')">Cancel Booking</button>
                    ` : `
                        <button class="disabled-btn full-width" disabled>${booking.status.replaceAll('_', ' ').toUpperCase()}</button>
                    `}
                </div>
            </div>
        `;
    }).join("");
}

/* =====================================================
   CANCEL BOOKING
===================================================== */
function cancelBooking(bookingId) {
    const bookings = getBookings();
    const rides = getRides();
    const booking = bookings.find(b => b.id === bookingId);

    if (!booking || booking.status !== "confirmed") return;

    if (!confirm("Are you sure you want to cancel your seat reservation?")) return;

    const ride = rides.find(r => r.id === booking.rideId);
    if (ride) {
        ride.availableSeats += booking.seats;
    }

    booking.status = "cancelled";
    saveBookings(bookings);
    saveRides(rides);

    showToast("Booking cancelled successfully.", "ℹ️");
    renderBookings();
    updateDashboard();
}

/* =====================================================
   HELPERS & FORMATTING
===================================================== */
function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function formatTime(timeString) {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });
}

function escapeHTML(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function showToast(message, icon = "ℹ️") {
    const toast = document.getElementById("toast");
    const toastIcon = document.getElementById("toastIcon");
    const toastMessage = document.getElementById("toastMessage");

    toastIcon.textContent = icon;
    toastMessage.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}

/* =====================================================
   INITIALIZATION
===================================================== */
document.addEventListener("DOMContentLoaded", function() {
    initializeData();
    updateNavbar();
    renderAllRides();
});