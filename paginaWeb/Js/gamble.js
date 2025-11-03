// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Sidebar buttons and links
  const sidebarLoginBtn = document.querySelector("#sidebar .login-btn");
  const homeLink = document.querySelector('#sidebar .side-nav a[href="home.html"]');

  // Top-right buttons
  const topSignupBtn = document.querySelector(".account-actions .signup-btn");
  const topLoginBtn = document.querySelector(".account-actions .login-btn");

  // Define target routes
  const logMenuRoute = "logMenu.html";
  const homeRoute = "index.html";

  // Generic redirect function
  const goTo = (route) => (window.location.href = route);

  // Event listeners for login & signup
  if (sidebarLoginBtn) sidebarLoginBtn.addEventListener("click", () => goTo(logMenuRoute));
  if (topSignupBtn) topSignupBtn.addEventListener("click", () => goTo(logMenuRoute));
  if (topLoginBtn) topLoginBtn.addEventListener("click", () => goTo(logMenuRoute));

  // Event listener for "Home"
  if (homeLink) {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault(); // prevents loading home.html directly
      goTo(homeRoute);
    });
  }
});
