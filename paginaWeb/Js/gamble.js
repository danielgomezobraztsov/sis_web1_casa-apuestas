document.addEventListener("DOMContentLoaded", () => {
  const sidebarLoginBtn = document.querySelector("#sidebar .login-btn");
  const homeLink = document.querySelector('#sidebar .side-nav a[href="home.html"]');
  const subscriptionLink = document.querySelector('#sidebar .side-nav a[href="subscriptions.html"]');

  const topSignupBtn = document.querySelector(".account-actions .signup-btn");
  const topLoginBtn = document.querySelector(".account-actions .login-btn");

  const logMenuRoute = "logMenu.html";
  const homeRoute = "index.html";
  const subscriptionsRoute = "subscription.html";

  const goTo = (route) => (window.location.href = route);

  if (sidebarLoginBtn) sidebarLoginBtn.addEventListener("click", () => goTo(logMenuRoute));
  if (topSignupBtn) topSignupBtn.addEventListener("click", () => goTo(logMenuRoute));
  if (topLoginBtn) topLoginBtn.addEventListener("click", () => goTo(logMenuRoute));

  if (homeLink) {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(homeRoute);
    });
  }

  if (subscriptionLink) {
    subscriptionLink.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(subscriptionsRoute);
    });
  }
});
