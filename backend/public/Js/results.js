document.addEventListener('DOMContentLoaded', () => {
  const btnBack = document.getElementById('btnBack');
  const categoryButtons = document.querySelectorAll('.category-btn');
  const resultsContainer = document.getElementById('resultsContainer');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  const resultados = {
    futbol: [
      { titulo: "Real Madrid 3 - 1 Barcelona", detalle: "Liga Española - 2025" },
      { titulo: "PSG 2 - 2 Bayern", detalle: "Champions League - 2025" }
    ],
    boxeo: [
      { titulo: "Canelo vs Golovkin", detalle: "Victoria por KO Técnico" },
      { titulo: "Tyson Fury venció a Usyk", detalle: "Decisión unánime" }
    ],
    baloncesto: [
      { titulo: "Lakers 112 - 104 Warriors", detalle: "NBA Conference Final" },
      { titulo: "Bulls 98 - 100 Celtics", detalle: "Partido cerrado en la prórroga" }
    ],
    tenis: [
      { titulo: "Nadal 2 - 1 Djokovic", detalle: "Roland Garros - Semifinal" },
      { titulo: "Alcaraz ganó a Medvedev", detalle: "US Open - Final" }
    ],
    esports: [
      { titulo: "Team Liquid 2 - 0 Fnatic", detalle: "Valorant Masters" },
      { titulo: "G2 Esports ganó a Cloud9", detalle: "LoL Worlds 2025" }
    ]
  };

  // Mostrar resultados según categoría
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category;
      mostrarResultados(cat);
    });
  });

  function mostrarResultados(categoria) {
    const data = resultados[categoria];
    resultsContainer.innerHTML = "";
    if (!data) {
      resultsContainer.innerHTML = `<p class="text-secondary">No hay resultados disponibles.</p>`;
      return;
    }

    data.forEach(r => {
      const card = document.createElement('div');
      card.className = 'result-card';
      card.innerHTML = `
        <div class="result-title">${r.titulo}</div>
        <p class="text-secondary mb-0">${r.detalle}</p>
      `;
      resultsContainer.appendChild(card);
    });
  }

  // Búsqueda
  function buscar() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    const coincidencias = [];
    Object.values(resultados).forEach(categoria => {
      categoria.forEach(item => {
        if (item.titulo.toLowerCase().includes(query)) coincidencias.push(item);
      });
    });

    resultsContainer.innerHTML = "";
    if (coincidencias.length === 0) {
      resultsContainer.innerHTML = `<p class="text-secondary">No se encontraron resultados para "${query}".</p>`;
    } else {
      coincidencias.forEach(r => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
          <div class="result-title">${r.titulo}</div>
          <p class="text-secondary mb-0">${r.detalle}</p>
        `;
        resultsContainer.appendChild(card);
      });
    }
  }

  searchBtn.addEventListener('click', buscar);
  searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') buscar(); });

  // Botón volver
  btnBack.addEventListener('click', () => {
    window.location.href = "/";
  });
});
