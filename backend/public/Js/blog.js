document.addEventListener("DOMContentLoaded", () => {
  const logMenuRoute = "/logMenu";
  const goTo = (route) => (window.location.href = route);

  const signupBtn = document.querySelector('[data-action="signup"]');
  const loginBtn  = document.querySelector('[data-action="login"]');

  if (signupBtn) signupBtn.addEventListener("click", () => goTo(logMenuRoute));
  if (loginBtn)  loginBtn.addEventListener("click", () => goTo(logMenuRoute));

  document.querySelectorAll("[data-readmore]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Read More: coming soon.");
    });
  });
});
