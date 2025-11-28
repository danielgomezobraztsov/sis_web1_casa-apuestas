// script.js (guárdalo en ./js/script.js)
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('resultsSidebar');
  const toggleButton = document.getElementById('toggleResults');
  const toggleIcon = document.getElementById('toggleIcon');
  const mainContent = document.getElementById('mainContent');

  const btnResults = document.getElementById('btnResults');
  const btnGamble = document.getElementById('btnGamble');
  const btnExplore = document.getElementById('btnExplore');
  const btnOffers = document.getElementById('btnOffers');
  const btnEvents = document.getElementById('btnEvents');

  const topSearchInput = document.getElementById('topSearchInput');
  const topSearchBtn = document.getElementById('topSearchBtn');

  // Sidebar toggle
  let isCollapsed = false;
  toggleButton.addEventListener('click', function() {
    isCollapsed = !isCollapsed;
    if (isCollapsed) {
      sidebar.classList.add('collapsed');
      toggleButton.classList.add('collapsed');
      mainContent.classList.add('collapsed');
      toggleIcon.textContent = '›';
    } else {
      sidebar.classList.remove('collapsed');
      toggleButton.classList.remove('collapsed');
      mainContent.classList.remove('collapsed');
      toggleIcon.textContent = '‹';
    }
  });

  // Header buttons redirections
  if (btnResults) btnResults.addEventListener('click', () => { window.location.href = '/results'; });
  if (btnGamble) btnGamble.addEventListener('click', () => { window.location.href = '/gamble'; });

  // Ad buttons
  if (btnExplore) btnExplore.addEventListener('click', () => { window.location.href = '/gamble'; });
  if (btnOffers) btnOffers.addEventListener('click', () => { window.location.href = '/subscription'; });
  if (btnEvents) btnEvents.addEventListener('click', () => { window.location.href = '/results'; });

  // Search action - redirect to results.html with query param
  function doSearch() {
    const q = topSearchInput.value.trim();
    const target = '/results' + (q ? ('?q=' + encodeURIComponent(q)) : '');
    window.location.href = target;
  }

  if (topSearchBtn) topSearchBtn.addEventListener('click', doSearch);
  if (topSearchInput) {
    topSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doSearch();
    });
  }
});
