// CONFIGURACIÓN CONSTANTE
const TOTAL_LODGING_COST = 217.77;
const DEFAULT_RUNNERS = [
  "Cholo",
  "César",
  "Juan",
  "Juanjo",
  "Javi",
  "Carlos",
  "Ramón",
  "Piti",
  "Adrián",
  "Roberto",
  "Nica"
];

// STATE MANAGEMENT
let runnersState = [];
let lodgingState = [];

// 1. TABS (CAMBIAR PESTAÑAS CON ACCESIBILIDAD)
document.querySelectorAll('.tab-button').forEach(btn => {
  btn.addEventListener('click', () => {
    // Desactivar pestaña anterior
    const activeBtn = document.querySelector('.tab-button.active');
    if (activeBtn) {
      activeBtn.classList.remove('active');
      activeBtn.setAttribute('aria-selected', 'false');
    }
    
    // Activar pestaña actual
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    // Ocultar contenido anterior
    const activeContent = document.querySelector('.tab-content.active');
    if (activeContent) {
      activeContent.classList.remove('active');
    }
    
    // Mostrar contenido correspondiente
    const targetContent = document.querySelector(`.tab-content[data-tab="${btn.dataset.tab}"]`);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  });
});

// 2. CUENTA ATRÁS MEJORADA
function initCountdown() {
  const target = new Date("2026-10-03T10:00:00").getTime(); // 10:00 AM hora de salida

  const daysEl = document.getElementById("countdown-days");
  const hoursEl = document.getElementById("countdown-hours");
  const minutesEl = document.getElementById("countdown-minutes");
  const secondsEl = document.getElementById("countdown-seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function updateCountdown() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    daysEl.textContent = d.toString().padStart(2, '0');
    hoursEl.textContent = h.toString().padStart(2, '0');
    minutesEl.textContent = m.toString().padStart(2, '0');
    secondsEl.textContent = s.toString().padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();
}

// 3. CLIMA EN TIEMPO REAL CON DETALLES
const WEATHER_ICONS = {
  // Sol / Despejado
  clear: `<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  
  // Parcialmente Nublado
  partlyCloudy: `<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M17.66 17.66l1.41 1.41M2 12h2M6.34 17.66l-1.41 1.41" stroke="#f59e0b"></path><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="none" stroke="#9ca3af"></path></svg>`,
  
  // Nublado / Cubierto
  cloudy: `<svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
  
  // Lluvia
  rain: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#9ca3af"></path><line x1="12" y1="22" x2="12" y2="24" stroke="#3b82f6"></line><line x1="16" y1="22" x2="16" y2="24" stroke="#3b82f6"></line><line x1="8" y1="22" x2="8" y2="24" stroke="#3b82f6"></line></svg>`,
  
  // Tormenta
  storm: `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#9ca3af"></path><polyline points="13 18 9 22 12 22 10 26 15 20 12 20 13 18" stroke="#a855f7" fill="#a855f7"></polyline></svg>`,
  
  // Niebla
  fog: `<svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="9" x2="19" y2="9"></line><line x1="3" y1="13" x2="21" y2="13"></line><line x1="6" y1="17" x2="18" y2="17"></line></svg>`,
  
  // Nieve
  snow: `<svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#9ca3af"></path><line x1="12" y1="22" x2="12" y2="24"></line><line x1="8" y1="22" x2="10" y2="20"></line><line x1="16" y1="22" x2="14" y2="20"></line></svg>`
};

function translateWeatherCode(code) {
  // Traducir códigos meteorológicos WMO (World Meteorological Organization)
  if (code === 0) return { text: "Despejado", icon: WEATHER_ICONS.clear };
  if (code >= 1 && code <= 3) {
    if (code === 1) return { text: "Mayormente Despejado", icon: WEATHER_ICONS.partlyCloudy };
    if (code === 2) return { text: "Nubosidad Variable", icon: WEATHER_ICONS.partlyCloudy };
    return { text: "Nublado", icon: WEATHER_ICONS.cloudy };
  }
  if (code === 45 || code === 48) return { text: "Niebla", icon: WEATHER_ICONS.fog };
  if ((code >= 51 && code <= 55) || (code >= 80 && code <= 82)) return { text: "Llovizna/Chubascos", icon: WEATHER_ICONS.rain };
  if (code >= 61 && code <= 65) return { text: "Lluvia", icon: WEATHER_ICONS.rain };
  if ((code >= 71 && code <= 75) || code === 77 || (code >= 85 && code <= 86)) return { text: "Nieve", icon: WEATHER_ICONS.snow };
  if (code >= 95) return { text: "Tormenta Eléctrica", icon: WEATHER_ICONS.storm };
  
  return { text: "Despejado", icon: WEATHER_ICONS.clear }; // Default
}

async function fetchClima(lat, lon) {
  // Solicita la predicción actual incluyendo temperatura, velocidad de viento y humedad relativa
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
  const res = await fetch(url);
  const data = await res.json();
  
  // Procesamos la respuesta en el formato esperado, soportando fallbacks a endpoints clásicos
  if (data.current) {
    return {
      temp: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      wind: data.current.wind_speed_10m,
      code: data.current.weather_code
    };
  } else if (data.current_weather) {
    return {
      temp: data.current_weather.temperature,
      humidity: 50, // Fallback si no está disponible
      wind: data.current_weather.windspeed,
      code: data.current_weather.weathercode
    };
  }
  throw new Error("Formato de respuesta desconocido de Open-Meteo");
}

async function renderWeather() {
  const tempSalida = document.getElementById("temp-salida");
  const descSalida = document.getElementById("desc-salida");
  const windSalida = document.getElementById("wind-salida");
  const humiditySalida = document.getElementById("humidity-salida");
  const iconSalida = document.getElementById("weather-icon-salida");

  const tempMeta = document.getElementById("temp-meta");
  const descMeta = document.getElementById("desc-meta");
  const windMeta = document.getElementById("wind-meta");
  const humidityMeta = document.getElementById("humidity-meta");
  const iconMeta = document.getElementById("weather-icon-meta");

  if (!tempSalida || !tempMeta) return;

  try {
    // 1. Salida (Mula): Latitud: 38.040, Longitud: -1.490
    const climaSalida = await fetchClima(38.040, -1.490);
    const transSalida = translateWeatherCode(climaSalida.code);
    
    tempSalida.textContent = `${climaSalida.temp}°C`;
    descSalida.textContent = transSalida.text;
    windSalida.textContent = `${climaSalida.wind} km/h`;
    humiditySalida.textContent = `${climaSalida.humidity}%`;
    iconSalida.innerHTML = transSalida.icon;

    // 2. Meta (Caravaca): Latitud: 38.105, Longitud: -1.865
    const climaMeta = await fetchClima(38.105, -1.865);
    const transMeta = translateWeatherCode(climaMeta.code);

    tempMeta.textContent = `${climaMeta.temp}°C`;
    descMeta.textContent = transMeta.text;
    windMeta.textContent = `${climaMeta.wind} km/h`;
    humidityMeta.textContent = `${climaMeta.humidity}%`;
    iconMeta.innerHTML = transMeta.icon;

  } catch (error) {
    console.error("Error al cargar la información meteorológica:", error);
    [descSalida, descMeta].forEach(el => {
      if (el) el.textContent = "Error de conexión";
    });
  }
}

// 4. LÓGICA DE PARTICIPANTES & CÁLCULOS
function getInitials(name) {
  const words = name.trim().split(" ");
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function normalizeName(name) {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getAvatarFilename(name) {
  return normalizeName(name);
}

function handleAvatarError(img, filename) {
  if (!img.dataset.triedPng) {
    img.dataset.triedPng = "true";
    img.src = `images/${filename}.png`;
  } else {
    img.style.display = 'none';
    if (img.previousElementSibling) {
      img.previousElementSibling.style.display = 'flex';
    }
  }
}

function handleAvatarLoad(img) {
  img.style.display = 'block';
  if (img.previousElementSibling) {
    img.previousElementSibling.style.display = 'none';
  }
}

function initRunners() {
  const savedState = localStorage.getItem("runners_attendance");
  
  if (savedState) {
    try {
      runnersState = JSON.parse(savedState);
    } catch (e) {
      runnersState = [];
    }
  }

  // Si no hay datos previos, inicializar todos como confirmados (true)
  if (!runnersState || runnersState.length === 0) {
    runnersState = DEFAULT_RUNNERS.map(name => ({
      name,
      confirmed: true
    }));
    saveRunnersState();
  }
  
  // Sincronizar por si la lista predeterminada ha cambiado
  DEFAULT_RUNNERS.forEach(name => {
    const exists = runnersState.some(r => r.name === name);
    if (!exists) {
      runnersState.push({ name, confirmed: true });
    }
  });

  // Limpiar si hubiese nombres huérfanos que ya no están en DEFAULT_RUNNERS
  runnersState = runnersState.filter(r => DEFAULT_RUNNERS.includes(r.name));
  
  renderRunners();
  updateCalculations();
}

function saveRunnersState() {
  localStorage.setItem("runners_attendance", JSON.stringify(runnersState));
}

function renderRunners(filterQuery = "") {
  const container = document.getElementById("runners-container");
  if (!container) return;

  container.innerHTML = "";
  const query = filterQuery.toLowerCase().trim();

  runnersState.forEach((runner, index) => {
    if (query && !runner.name.toLowerCase().includes(query)) {
      return; // Filtrar por búsqueda
    }

    const row = document.createElement("div");
    row.className = `runner-row ${runner.confirmed ? 'confirmed' : ''}`;
    
    const initials = getInitials(runner.name);
    const filename = getAvatarFilename(runner.name);
    
    row.innerHTML = `
      <div class="runner-info-flex">
        <div class="runner-avatar-wrapper">
          <div class="runner-avatar-initials">${initials}</div>
          <img class="runner-avatar-img" src="images/${filename}.jpg" alt="${runner.name}" onload="handleAvatarLoad(this)" onerror="handleAvatarError(this, '${filename}')">
        </div>
        <span class="runner-name">${runner.name}</span>
      </div>
      <div class="switch-container">
        <span class="switch-label">${runner.confirmed ? 'Asiste' : 'No asiste'}</span>
        <label class="switch-row">
          <input type="checkbox" ${runner.confirmed ? 'checked' : ''} data-index="${index}">
          <div class="toggle-switch"></div>
        </label>
      </div>
    `;

    // Event listener para el switch
    const checkbox = row.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.index);
      runnersState[idx].confirmed = e.target.checked;
      
      // Guardar, refrescar fila y recalcular costes
      saveRunnersState();
      
      const label = row.querySelector('.switch-label');
      if (e.target.checked) {
        row.classList.add('confirmed');
        label.textContent = 'Asiste';
      } else {
        row.classList.remove('confirmed');
        label.textContent = 'No asiste';
      }
      
      updateCalculations();
    });

    container.appendChild(row);
  });
}

function updateCalculations() {
  const confirmedRunnersCount = runnersState.filter(r => r.confirmed).length;
  const totalRunnersCount = runnersState.length;
  const confirmedGuestsCount = lodgingState.filter(g => g.confirmed).length;

  // Actualizar badges e indicadores numéricos
  const countEl = document.getElementById("confirmed-count");
  const totalEl = document.getElementById("total-count");
  const calcCountEl = document.getElementById("calc-confirmed-count");
  const costPerPersonEl = document.getElementById("cost-per-person");

  if (countEl) countEl.textContent = confirmedRunnersCount;
  if (totalEl) totalEl.textContent = totalRunnersCount;
  if (calcCountEl) calcCountEl.textContent = confirmedGuestsCount;

  // Calcular precio dividido
  if (costPerPersonEl) {
    if (confirmedGuestsCount > 0) {
      const costPerPerson = TOTAL_LODGING_COST / confirmedGuestsCount;
      // Formatear a 2 decimales
      costPerPersonEl.textContent = `${costPerPerson.toFixed(2)} €`;
    } else {
      costPerPersonEl.textContent = "0.00 €";
    }
  }
}

// Búsqueda interactiva de participantes
const searchInput = document.getElementById("search-runner");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    renderRunners(e.target.value);
  });
}

// LÓGICA DE ALOJAMIENTO EXTRA
function initLodgingGuests() {
  const savedState = localStorage.getItem("lodging_attendance");
  
  if (savedState) {
    try {
      lodgingState = JSON.parse(savedState);
    } catch (e) {
      lodgingState = [];
    }
  }

  // Si no hay datos previos, inicializar todos como confirmados (true)
  if (!lodgingState || lodgingState.length === 0) {
    lodgingState = DEFAULT_RUNNERS.map(name => ({
      name,
      confirmed: true
    }));
    saveLodgingState();
  }
  
  // Sincronizar por si la lista predeterminada ha cambiado
  DEFAULT_RUNNERS.forEach(name => {
    const exists = lodgingState.some(r => r.name === name);
    if (!exists) {
      lodgingState.push({ name, confirmed: true });
    }
  });

  // Limpiar si hubiese nombres huérfanos que ya no están en DEFAULT_RUNNERS
  lodgingState = lodgingState.filter(r => DEFAULT_RUNNERS.includes(r.name));
  
  renderLodgingGuests();
  updateCalculations();
}

function saveLodgingState() {
  localStorage.setItem("lodging_attendance", JSON.stringify(lodgingState));
}

function renderLodgingGuests() {
  const container = document.getElementById("lodging-guests-container");
  if (!container) return;

  container.innerHTML = "";

  lodgingState.forEach((guest, index) => {
    const row = document.createElement("div");
    row.className = `runner-row ${guest.confirmed ? 'confirmed' : ''}`;
    
    const initials = getInitials(guest.name);
    const filename = getAvatarFilename(guest.name);
    
    row.innerHTML = `
      <div class="runner-info-flex">
        <div class="runner-avatar-wrapper">
          <div class="runner-avatar-initials" style="background: linear-gradient(135deg, var(--accent-cyan), var(--primary))">${initials}</div>
          <img class="runner-avatar-img" src="images/${filename}.jpg" alt="${guest.name}" onload="handleAvatarLoad(this)" onerror="handleAvatarError(this, '${filename}')">
        </div>
        <span class="runner-name">${guest.name}</span>
      </div>
      <div class="switch-container">
        <span class="switch-label">${guest.confirmed ? 'Se aloja' : 'No se aloja'}</span>
        <label class="switch-row">
          <input type="checkbox" ${guest.confirmed ? 'checked' : ''} data-index="${index}">
          <div class="toggle-switch"></div>
        </label>
      </div>
    `;

    // Event listener para el switch
    const checkbox = row.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.index);
      lodgingState[idx].confirmed = e.target.checked;
      
      // Guardar, refrescar fila y recalcular costes
      saveLodgingState();
      
      const label = row.querySelector('.switch-label');
      if (e.target.checked) {
        row.classList.add('confirmed');
        label.textContent = 'Se aloja';
      } else {
        row.classList.remove('confirmed');
        label.textContent = 'No se aloja';
      }
      
      updateCalculations();
    });

    container.appendChild(row);
  });
}

// 5. INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  renderWeather();
  initRunners();
  initLodgingGuests();
});
