document.addEventListener('DOMContentLoaded', () => {

  // ===============================
  // ELEMENTOS DEL DOM
  //===============================
  const btnBack = document.getElementById('btnBack');
  const categoryButtons = document.querySelectorAll('.category-btn');
  const resultsContainer = document.getElementById('resultsContainer');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const footballTemplate = document.getElementById("footballTemplate");

  // Datos estáticos (solo para categorías que NO son fútbol)
  const resultados = {
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


  // =====================================================
  // FUNCIÓN: MOSTRAR RESULTADOS PARA CATEGORÍAS ESTÁTICAS
  // (NO se usa para fútbol)
  // =====================================================
  function mostrarResultados(categoria) {

    // Si es FUTBOL → ignorar
    if (categoria === "futbol") return;

    const data = resultados[categoria];

    resultsContainer.innerHTML = "";

    if (!data) {
      resultsContainer.innerHTML = `
        <p class="text-secondary">No hay resultados disponibles.</p>`;
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


  // ==============================================
  // FUNCIÓN: MOSTRAR RESULTADOS DINÁMICOS DE FÚTBOL
  // (Contenido EJS generado con los datos de la API)
  // ==============================================

  function mostrarResultadosFutbol() {
    resultsContainer.innerHTML = footballTemplate.innerHTML;
  }


  // ===========================================
  // FUNCIÓN DE BÚSQUEDA COMPLETA
  // (EstáTICO + DINÁMICO de fútbol)
  // ===========================================
  function buscar() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    resultsContainer.innerHTML = "";

    let coincidencias = [];

    // 1️⃣ Buscar en categorías estáticas
    Object.values(resultados).forEach(categoria => {
      categoria.forEach(item => {
        if (item.titulo.toLowerCase().includes(query)) {
          coincidencias.push({
            tipo: "estatico",
            titulo: item.titulo,
            detalle: item.detalle
          });
        }
      });
    });

    // 2️ Buscar en resultados dinámicos de fútbol (EJS)
    const footballHTML = document.createElement("div");
    footballHTML.innerHTML = footballTemplate.innerHTML;

    const filas = footballHTML.querySelectorAll("tbody tr");

    filas.forEach(row => {
      const local = row.children[0].innerText.toLowerCase();
      const marcador = row.children[1].innerText.toLowerCase();
      const visitante = row.children[2].innerText.toLowerCase();

      if (
        local.includes(query) ||
        visitante.includes(query) ||
        marcador.includes(query)
      ) {
        coincidencias.push({
          tipo: "futbol",
          html: row.outerHTML
        });
      }
    });

    // 3️⃣ Mostrar resultados
    if (coincidencias.length === 0) {
      resultsContainer.innerHTML = `
        <p class="text-secondary">No se encontraron resultados para "${query}".</p>`;
      return;
    }

    coincidencias.forEach(item => {

      // Resultados estáticos
      if (item.tipo === "estatico") {
        const card = document.createElement("div");
        card.className = "result-card";
        card.innerHTML = `
          <div class="result-title">${item.titulo}</div>
          <p class="text-secondary mb-0">${item.detalle}</p>
        `;
        resultsContainer.appendChild(card);
      }

      // Resultados dinámicos de fútbol
      if (item.tipo === "futbol") {
        const table = document.createElement("table");
        table.className = "modern-table";
        table.innerHTML = `
          <thead>
            <tr>
              <th>Local</th>
              <th>Resultado</th>
              <th>Visitante</th>
            </tr>
          </thead>
          <tbody>
            ${item.html}
          </tbody>
        `;
        resultsContainer.appendChild(table);
      }

    });
  }


  // ======================================
  // EVENTOS DE BOTONES DE CATEGORÍA
  // ======================================
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const categoria = btn.dataset.category;

      if (categoria === "futbol") {
        mostrarResultadosFutbol();
      } else {
        mostrarResultados(categoria);
      }
    });
  });


  // =====================
  // EVENTOS DE BÚSQUEDA
  // =====================
  searchBtn.addEventListener("click", buscar);

  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") buscar();
  });


  // ======================
  // BOTÓN VOLVER A INICIO
  // ======================
  btnBack.addEventListener('click', () => {
    window.location.href = "/";
  });

});
