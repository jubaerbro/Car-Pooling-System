const USERS_KEY = "shareride_users";

const RIDES_KEY = "shareride_rides";

const BOOKINGS_KEY = "shareride_bookings";

const SESSION_KEY = "shareride_current_user";


/* =====================================================
   INITIAL DATA
===================================================== */

function initializeData() {

    if (!localStorage.getItem(USERS_KEY)) {

        const demoUsers = [

            {
                id: "user1",
                name: "Rahim Ahmed",
                email: "rahim@example.com",
                phone: "01700000000",
                password: "123456"
            },

            {
                id: "user2",
                name: "Karim Hasan",
                email: "karim@example.com",
                phone: "01800000000",
                password: "123456"
            }

        ];

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(demoUsers)
        );
    }


    if (!localStorage.getItem(RIDES_KEY)) {

        const demoRides = [

            {
                id: "ride1",

                driverId: "user1",

                driverName: "Rahim Ahmed",

                source: "Rajshahi",

                destination: "Dhaka",

                date: "2026-08-20",

                time: "08:00",

                totalSeats: 4,

                availableSeats: 3,

                fare: 500,

                status: "active"
            },


            {
                id: "ride2",

                driverId: "user2",

                driverName: "Karim Hasan",

                source: "Rajshahi",

                destination: "Dhaka",

                date: "2026-08-20",

                time: "09:30",

                totalSeats: 4,

                availableSeats: 2,

                fare: 450,

                status: "active"
            }

        ];

        localStorage.setItem(
            RIDES_KEY,
            JSON.stringify(demoRides)
        );
    }


    if (!localStorage.getItem(BOOKINGS_KEY)) {

        localStorage.setItem(
            BOOKINGS_KEY,
            JSON.stringify([])
        );
    }
}



/* =====================================================
   STORAGE HELPERS
===================================================== */

function getUsers() {

    return JSON.parse(
        localStorage.getItem(USERS_KEY)
    ) || [];

}


function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}


function getRides() {

    return JSON.parse(
        localStorage.getItem(RIDES_KEY)
    ) || [];

}


function saveRides(rides) {

    localStorage.setItem(
        RIDES_KEY,
        JSON.stringify(rides)
    );

}


function getBookings() {

    return JSON.parse(
        localStorage.getItem(BOOKINGS_KEY)
    ) || [];

}


function saveBookings(bookings) {

    localStorage.setItem(
        BOOKINGS_KEY,
        JSON.stringify(bookings)
    );

}



/* =====================================================
   CURRENT USER
===================================================== */

function getCurrentUser() {

    const userId =
        localStorage.getItem(SESSION_KEY);

    if (!userId) {

        return null;

    }

    const users = getUsers();

    return users.find(
        user => user.id === userId
    ) || null;
}


function setCurrentUser(userId) {

    localStorage.setItem(
        SESSION_KEY,
        userId
    );

}


function clearCurrentUser() {

    localStorage.removeItem(
        SESSION_KEY
    );

}



/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(pageId) {

    const protectedPages = [

        "dashboard",
        "offerRide",
        "myRides",
        "bookings"

    ];


    if (
        protectedPages.includes(pageId) &&
        !getCurrentUser()
    ) {

        showToast(
            "Please login first."
        );

        pageId = "login";
    }


    const pages =
        document.querySelectorAll(".page");


    pages.forEach(
        page => page.classList.remove("active")
    );


    const selectedPage =
        document.getElementById(pageId);


    if (selectedPage) {

        selectedPage.classList.add("active");

    }


    if (pageId === "dashboard") {

        updateDashboard();

    }


    if (pageId === "myRides") {

        renderMyRides();

    }


    if (pageId === "bookings") {

        renderBookings();

    }


    if (pageId === "findRide") {

        renderAllRides();

    }


    updateNavbar();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}



/* =====================================================
   NAVBAR
===================================================== */

function updateNavbar() {

    const user =
        getCurrentUser();


    const loginNav =
        document.getElementById("loginNav");


    const registerNav =
        document.getElementById("registerNav");


    const dashboardNav =
        document.getElementById("dashboardNav");


    const logoutNav =
        document.getElementById("logoutNav");


    if (user) {

        loginNav.classList.add("hidden");

        registerNav.classList.add("hidden");

        dashboardNav.classList.remove("hidden");

        logoutNav.classList.remove("hidden");

    }

    else {

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


    const name =
        document.getElementById(
            "registerName"
        ).value.trim();


    const email =
        document.getElementById(
            "registerEmail"
        ).value.trim().toLowerCase();


    const phone =
        document.getElementById(
            "registerPhone"
        ).value.trim();


    const password =
        document.getElementById(
            "registerPassword"
        ).value;


    const users = getUsers();


    const existingUser =
        users.find(
            user => user.email === email
        );


    if (existingUser) {

        showToast(
            "An account with this email already exists."
        );

        return;
    }


    const newUser = {

        id:
            "user_" +
            Date.now(),

        name,

        email,

        phone,

        password

    };


    users.push(newUser);

    saveUsers(users);

    setCurrentUser(newUser.id);


    showToast(
        "Account created successfully!"
    );


    event.target.reset();


    setTimeout(
        () => showPage("dashboard"),
        700
    );

}



/* =====================================================
   LOGIN
===================================================== */

function login(event) {

    event.preventDefault();


    const email =
        document.getElementById(
            "loginEmail"
        ).value.trim().toLowerCase();


    const password =
        document.getElementById(
            "loginPassword"
        ).value;


    const users = getUsers();


    const user =
        users.find(
            u =>
                u.email === email &&
                u.password === password
        );


    if (!user) {

        showToast(
            "Invalid email or password."
        );

        return;
    }


    setCurrentUser(user.id);


    showToast(
        "Login successful!"
    );


    event.target.reset();


    setTimeout(
        () => showPage("dashboard"),
        700
    );

}



/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    clearCurrentUser();

    updateNavbar();

    showToast(
        "Logged out successfully."
    );


    setTimeout(
        () => showPage("home"),
        600
    );

}



/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    const user =
        getCurrentUser();


    if (!user) {

        return;

    }


    document.getElementById(
        "welcomeUser"
    ).textContent =
        `Welcome, ${user.name}!`;


    const rides =
        getRides();


    const bookings =
        getBookings();


    const myRides =
        rides.filter(
            ride =>
                ride.driverId === user.id
        );


    const myBookings =
        bookings.filter(
            booking =>
                booking.passengerId === user.id &&
                booking.status === "confirmed"
        );


    const activeRides =
        myRides.filter(
            ride =>
                ride.status === "active"
        );


    document.getElementById(
        "rideCount"
    ).textContent =
        myRides.length;


    document.getElementById(
        "bookingCount"
    ).textContent =
        myBookings.length;


    document.getElementById(
        "activeRideCount"
    ).textContent =
        activeRides.length;

}



/* =====================================================
   CREATE RIDE
===================================================== */

function createRide(event) {

    event.preventDefault();


    const user =
        getCurrentUser();


    if (!user) {

        showToast(
            "Please login first."
        );

        showPage("login");

        return;

    }


    const source =
        document.getElementById(
            "rideSource"
        ).value.trim();


    const destination =
        document.getElementById(
            "rideDestination"
        ).value.trim();


    const date =
        document.getElementById(
            "rideDate"
        ).value;


    const time =
        document.getElementById(
            "rideTime"
        ).value;


    const seats =
        Number(
            document.getElementById(
                "rideSeats"
            ).value
        );


    const fare =
        Number(
            document.getElementById(
                "rideFare"
            ).value
        );


    if (source.toLowerCase() ===
        destination.toLowerCase()) {

        showToast(
            "Source and destination cannot be the same."
        );

        return;
    }


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    if (date < today) {

        showToast(
            "Ride date cannot be in the past."
        );

        return;
    }


    if (seats < 1 || seats > 8) {

        showToast(
            "Seats must be between 1 and 8."
        );

        return;
    }


    if (fare < 0) {

        showToast(
            "Fare cannot be negative."
        );

        return;
    }


    const rides =
        getRides();


    const newRide = {

        id:
            "ride_" +
            Date.now(),

        driverId:
            user.id,

        driverName:
            user.name,

        source,

        destination,

        date,

        time,

        totalSeats:
            seats,

        availableSeats:
            seats,

        fare,

        status:
            "active"

    };


    rides.push(newRide);

    saveRides(rides);


    event.target.reset();


    showToast(
        "Ride published successfully!"
    );


    setTimeout(
        () => showPage("myRides"),
        700
    );

}



/* =====================================================
   RENDER ALL RIDES
===================================================== */

function renderAllRides(
    rides = getRides()
) {

    const container =
        document.getElementById(
            "rideResults"
        );


    const activeRides =
        rides.filter(
            ride =>
                ride.status === "active" &&
                ride.availableSeats > 0
        );


    if (activeRides.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No rides found
                </h3>

                <p>
                    Try changing your search criteria.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        activeRides
            .map(
                ride => createRideCard(ride)
            )
            .join("");

}



/* =====================================================
   RIDE CARD
===================================================== */

function createRideCard(ride) {

    return `

        <div class="ride-card">

            <div class="ride-main">

                <h3>
                    ${escapeHTML(ride.source)}
                    →
                    ${escapeHTML(ride.destination)}
                </h3>

                <p>
                    👤 Driver:
                    ${escapeHTML(ride.driverName)}
                </p>

                <p>
                    📅
                    ${formatDate(ride.date)}
                </p>

                <p>
                    🕐
                    ${formatTime(ride.time)}
                </p>

            </div>


            <div class="ride-info">

                <strong>
                    ৳${ride.fare}
                </strong>

                <span>
                    ${ride.availableSeats}
                    seat(s) available
                </span>


                <button
                    class="small-btn"
                    onclick="viewRide('${ride.id}')">

                    View Details

                </button>

            </div>

        </div>

    `;

}



/* =====================================================
   SEARCH RIDES
===================================================== */

function searchRides() {

    const source =
        document.getElementById(
            "searchSource"
        ).value.trim().toLowerCase();


    const destination =
        document.getElementById(
            "searchDestination"
        ).value.trim().toLowerCase();


    const date =
        document.getElementById(
            "searchDate"
        ).value;


    const rides =
        getRides();


    const filtered =
        rides.filter(
            ride => {

                const matchesSource =
                    !source ||
                    ride.source
                        .toLowerCase()
                        .includes(source);


                const matchesDestination =
                    !destination ||
                    ride.destination
                        .toLowerCase()
                        .includes(destination);


                const matchesDate =
                    !date ||
                    ride.date === date;


                return (
                    matchesSource &&
                    matchesDestination &&
                    matchesDate &&
                    ride.status === "active" &&
                    ride.availableSeats > 0
                );

            }
        );


    renderAllRides(filtered);

}



/* =====================================================
   VIEW RIDE DETAILS
===================================================== */

function viewRide(rideId) {

    const rides =
        getRides();


    const ride =
        rides.find(
            r => r.id === rideId
        );


    if (!ride) {

        showToast(
            "Ride not found."
        );

        return;

    }


    const user =
        getCurrentUser();


    const isOwner =
        user &&
        ride.driverId === user.id;


    const details =
        document.getElementById(
            "rideDetailsContent"
        );


    let actionButton = "";


    if (!user) {

        actionButton = `

            <button
                class="primary-btn full-width"
                onclick="showPage('login')">

                Login to Book

            </button>

        `;

    }

    else if (isOwner) {

        actionButton = `

            <div class="empty-state">

                <p>
                    You are the driver of this ride.
                </p>

            </div>

        `;

    }

    else if (ride.availableSeats <= 0) {

        actionButton = `

            <div class="empty-state">

                <p>
                    This ride is fully booked.
                </p>

            </div>

        `;

    }

    else {

        actionButton = `

            <div class="booking-section">

                <label>
                    Number of Seats
                </label>

                <input
                    type="number"
                    id="bookingSeats"
                    min="1"
                    max="${ride.availableSeats}"
                    value="1">

                <br><br>

                <button
                    class="primary-btn full-width"
                    onclick="bookRide('${ride.id}')">

                    Book Seat(s)

                </button>

            </div>

        `;

    }


    details.innerHTML = `

        <h2>

            ${escapeHTML(ride.source)}
            →
            ${escapeHTML(ride.destination)}

        </h2>


        <div class="details-grid">

            <div>

                <span>
                    Driver
                </span>

                <strong>
                    ${escapeHTML(ride.driverName)}
                </strong>

            </div>


            <div>

                <span>
                    Date
                </span>

                <strong>
                    ${formatDate(ride.date)}
                </strong>

            </div>


            <div>

                <span>
                    Time
                </span>

                <strong>
                    ${formatTime(ride.time)}
                </strong>

            </div>


            <div>

                <span>
                    Available Seats
                </span>

                <strong>
                    ${ride.availableSeats}
                </strong>

            </div>


            <div>

                <span>
                    Fare
                </span>

                <strong>
                    ৳${ride.fare} / seat
                </strong>

            </div>


            <div>

                <span>
                    Status
                </span>

                <strong class="status">
                    ${ride.status}
                </strong>

            </div>

        </div>


        ${actionButton}

    `;


    showPage("rideDetails");

}



/* =====================================================
   BOOK RIDE
===================================================== */

function bookRide(rideId) {

    const user =
        getCurrentUser();


    if (!user) {

        showToast(
            "Please login first."
        );

        showPage("login");

        return;

    }


    const rides =
        getRides();


    const ride =
        rides.find(
            r => r.id === rideId
        );


    if (!ride) {

        showToast(
            "Ride not found."
        );

        return;

    }


    if (ride.driverId === user.id) {

        showToast(
            "You cannot book your own ride."
        );

        return;

    }


    const seats =
        Number(
            document.getElementById(
                "bookingSeats"
            ).value
        );


    if (
        !seats ||
        seats < 1
    ) {

        showToast(
            "Please select at least one seat."
        );

        return;

    }


    if (
        seats >
        ride.availableSeats
    ) {

        showToast(
            "Not enough seats available."
        );

        return;

    }


    const bookings =
        getBookings();


    /*
        Prevent duplicate booking
        for the same user and ride.
    */

    const existingBooking =
        bookings.find(
            booking =>
                booking.rideId === rideId &&
                booking.passengerId === user.id &&
                booking.status === "confirmed"
        );


    if (existingBooking) {

        showToast(
            "You have already booked this ride."
        );

        return;

    }


    const booking = {

        id:
            "booking_" +
            Date.now(),

        rideId,

        passengerId:
            user.id,

        passengerName:
            user.name,

        seats,

        fare:
            ride.fare,

        totalCost:
            seats * ride.fare,

        bookingDate:
            new Date().toISOString(),

        status:
            "confirmed"

    };


    bookings.push(booking);


    ride.availableSeats -= seats;


    saveBookings(bookings);

    saveRides(rides);


    showToast(
        "Ride booked successfully!"
    );


    setTimeout(
        () => showPage("bookings"),
        800
    );

}



/* =====================================================
   MY RIDES
===================================================== */

function renderMyRides() {

    const user =
        getCurrentUser();


    const container =
        document.getElementById(
            "myRidesContainer"
        );


    if (!user) {

        container.innerHTML = "";

        return;

    }


    const rides =
        getRides();


    const myRides =
        rides.filter(
            ride =>
                ride.driverId === user.id
        );


    if (myRides.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    You haven't offered any rides yet.
                </h3>

                <br>

                <button
                    class="primary-btn"
                    onclick="showPage('offerRide')">

                    Offer Your First Ride

                </button>

            </div>

        `;

        return;

    }


    container.innerHTML =
        myRides
            .map(
                ride => `

                <div class="ride-card">

                    <div class="ride-main">

                        <h3>

                            ${escapeHTML(ride.source)}
                            →
                            ${escapeHTML(ride.destination)}

                        </h3>

                        <p>
                            📅
                            ${formatDate(ride.date)}
                        </p>

                        <p>
                            🕐
                            ${formatTime(ride.time)}
                        </p>

                    </div>


                    <div class="ride-info">

                        <strong>
                            ৳${ride.fare}
                        </strong>

                        <span>
                            ${ride.availableSeats}
                            / ${ride.totalSeats}
                            seats available
                        </span>


                        <button
                            class="danger-btn"
                            onclick="deleteRide('${ride.id}')">

                            Cancel Ride

                        </button>

                    </div>

                </div>

            `
            )
            .join("");

}



/* =====================================================
   DELETE RIDE
===================================================== */

function deleteRide(rideId) {

    const user =
        getCurrentUser();


    if (!user) {

        return;

    }


    const rides =
        getRides();


    const ride =
        rides.find(
            r => r.id === rideId
        );


    if (!ride) {

        return;

    }


    if (
        ride.driverId !== user.id
    ) {

        showToast(
            "You cannot cancel this ride."
        );

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to cancel this ride?"
        );


    if (!confirmed) {

        return;

    }


    ride.status =
        "cancelled";


    saveRides(rides);


    /*
        Cancel related bookings
    */

    const bookings =
        getBookings();


    bookings.forEach(
        booking => {

            if (
                booking.rideId === rideId &&
                booking.status === "confirmed"
            ) {

                booking.status =
                    "cancelled";

            }

        }
    );


    saveBookings(bookings);


    showToast(
        "Ride cancelled."
    );


    renderMyRides();

    updateDashboard();

}



/* =====================================================
   BOOKINGS
===================================================== */

function renderBookings() {

    const user =
        getCurrentUser();


    const container =
        document.getElementById(
            "bookingsContainer"
        );


    if (!user) {

        return;

    }


    const bookings =
        getBookings();


    const rides =
        getRides();


    const myBookings =
        bookings.filter(
            booking =>
                booking.passengerId === user.id
        );


    if (myBookings.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No bookings yet.
                </h3>

                <br>

                <button
                    class="primary-btn"
                    onclick="showPage('findRide')">

                    Find a Ride

                </button>

            </div>

        `;

        return;

    }


    container.innerHTML =
        myBookings
            .map(
                booking => {

                    const ride =
                        rides.find(
                            r =>
                                r.id ===
                                booking.rideId
                        );


                    if (!ride) {

                        return "";

                    }


                    return `

                        <div class="ride-card">

                            <div class="ride-main">

                                <h3>

                                    ${escapeHTML(
                                        ride.source
                                    )}

                                    →

                                    ${escapeHTML(
                                        ride.destination
                                    )}

                                </h3>


                                <p>
                                    👤 Driver:
                                    ${escapeHTML(
                                        ride.driverName
                                    )}
                                </p>


                                <p>
                                    📅
                                    ${formatDate(
                                        ride.date
                                    )}
                                </p>


                                <p>
                                    🕐
                                    ${formatTime(
                                        ride.time
                                    )}
                                </p>

                            </div>


                            <div class="ride-info">

                                <strong>
                                    ${booking.seats}
                                    Seat(s)
                                </strong>


                                <span>
                                    Total:
                                    ৳${booking.totalCost}
                                </span>


                                <span
                                    class="${
                                        booking.status ===
                                        "confirmed"
                                            ? "status"
                                            : ""
                                    }">

                                    ${booking.status}

                                </span>


                                ${
                                    booking.status ===
                                    "confirmed"

                                    ?

                                    `

                                    <button
                                        class="danger-btn"
                                        onclick="cancelBooking(
                                            '${booking.id}'
                                        )">

                                        Cancel Booking

                                    </button>

                                    `

                                    :

                                    ""

                                }

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}



/* =====================================================
   CANCEL BOOKING
===================================================== */

function cancelBooking(bookingId) {

    const bookings =
        getBookings();


    const rides =
        getRides();


    const booking =
        bookings.find(
            b => b.id === bookingId
        );


    if (!booking) {

        return;

    }


    if (
        booking.status !==
        "confirmed"
    ) {

        return;

    }


    const confirmed =
        confirm(
            "Cancel this booking?"
        );


    if (!confirmed) {

        return;

    }


    const ride =
        rides.find(
            r =>
                r.id === booking.rideId
        );


    if (ride) {

        ride.availableSeats +=
            booking.seats;

    }


    booking.status =
        "cancelled";


    saveBookings(bookings);

    saveRides(rides);


    showToast(
        "Booking cancelled."
    );


    renderBookings();

}



/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}



/* =====================================================
   FORMAT TIME
===================================================== */

function formatTime(timeString) {

    const [
        hours,
        minutes
    ] =
        timeString
            .split(":")
            .map(Number);


    const date =
        new Date();


    date.setHours(
        hours,
        minutes
    );


    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}



/* =====================================================
   HTML SECURITY
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}



/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    toastMessage.textContent =
        message;


    toast.classList.add("show");


    setTimeout(
        () => {
            toast.classList.remove(
                "show"
            );
        },
        3000
    );

}



/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        initializeData();

        updateNavbar();

        renderAllRides();

    }
);
