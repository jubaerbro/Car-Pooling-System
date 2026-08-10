/* =========================================
   SHARE RIDE - PROTOTYPE 1
   ========================================= */


/* ================= PAGE NAVIGATION ================= */

function showPage(pageId) {

    /*
        Hide all pages
    */

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {

        page.classList.remove("active");

    });


    /*
        Show selected page
    */

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {

        selectedPage.classList.add("active");

    }


    /*
        Scroll to top
    */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}



/* ================= TOAST MESSAGE ================= */

function showToast(message) {

    const toast = document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    toastMessage.textContent = message;

    toast.classList.add("show");


    setTimeout(function() {

        toast.classList.remove("show");

    }, 3000);
}



/* ================= REGISTER ================= */

function register(event) {

    event.preventDefault();


    const name =
        document.getElementById("registerName").value;

    const email =
        document.getElementById("registerEmail").value;


    /*
        Prototype behavior:
        We are not storing data in a database yet.
    */

    showToast(
        "Account created successfully!"
    );


    document.getElementById("welcomeUser")
        .textContent = "Welcome, " + name + "!";


    setTimeout(function() {

        showPage("dashboard");

    }, 700);
}



/* ================= LOGIN ================= */

function login(event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail").value;


    /*
        Prototype authentication.
        No real backend yet.
    */

    const username =
        email.split("@")[0];


    document.getElementById("welcomeUser")
        .textContent =
        "Welcome, " + username + "!";


    showToast("Login successful!");


    setTimeout(function() {

        showPage("dashboard");

    }, 700);
}



/* ================= LOGOUT ================= */

function logout() {

    showToast("Logged out successfully.");

    setTimeout(function() {

        showPage("home");

    }, 700);
}



/* ================= OFFER RIDE ================= */

function offerRide(event) {

    event.preventDefault();


    const source =
        document.getElementById("rideSource").value;

    const destination =
        document.getElementById("rideDestination").value;


    const seats =
        document.getElementById("rideSeats").value;


    /*
        Prototype behavior.
        In later versions this will be saved
        in the database.
    */

    showToast(
        "Ride from " +
        source +
        " to " +
        destination +
        " published successfully!"
    );


    /*
        Clear form
    */

    document.getElementById("rideSource").value = "";

    document.getElementById("rideDestination").value = "";

    document.getElementById("rideDate").value = "";

    document.getElementById("rideTime").value = "";

    document.getElementById("rideSeats").value = "";

    document.getElementById("rideFare").value = "";


    setTimeout(function() {

        showPage("dashboard");

    }, 1000);
}



/* ================= SEARCH RIDES ================= */

function searchRides() {

    const source =
        document.getElementById("searchSource").value;

    const destination =
        document.getElementById("searchDestination").value;


    if (
        source === "" &&
        destination === ""
    ) {

        showToast(
            "Please enter a source or destination."
        );

        return;
    }


    showToast(
        "Searching available rides..."
    );


    /*
        Prototype only:
        Existing sample rides remain visible.
    */
}



/* ================= VIEW RIDE ================= */

function viewRide() {

    showPage("rideDetails");

}



/* ================= BOOK RIDE ================= */

function bookRide() {

    showToast(
        "Seat booking request submitted!"
    );


    setTimeout(function() {

        showPage("bookings");

    }, 1000);
}



/* ================= INITIALIZATION ================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        showPage("home");

    }
);