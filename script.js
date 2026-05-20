// Cambiar pestañas
document.querySelectorAll('.tab-button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.tab-button.active').classList.remove('active');
    btn.classList.add('active');

    document.querySelector('.tab-content.active').classList.remove('active');
    document.querySelector(`.tab-content[data-tab="${btn.dataset.tab}"]`).classList.add('active');
  });
});

// Cuenta regresiva
function countdown() {
  const target = new Date("2026-10-03T09:10:00").getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    document.getElementById("countdown").textContent = "¡Es hoy!";
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  document.getElementById("countdown").textContent =
    `${d}d ${h}h ${m}m ${s}s`;
}

setInterval(countdown, 1000);
countdown();
// --- CLIMA REAL CON OPEN-METEO ---

async function obtenerClima(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  const res = await fetch(url);
  const data = await res.json();
  return data.current_weather; // temperatura, viento, etc.
}

async function actualizarClimaReal() {
  const salidaEl = document.getElementById("clima-salida");
  const metaEl = document.getElementById("clima-meta");

  if (!salidaEl || !metaEl) return;

  try {
    // Clima en salida (Mula)
    const climaSalida = await obtenerClima(38.040, -1.490);

    // Clima en meta (Caravaca)
    const climaMeta = await obtenerClima(38.105, -1.865);

    salidaEl.textContent = `${climaSalida.temperature}ºC, viento ${climaSalida.windspeed} km/h`;
    metaEl.textContent = `${climaMeta.temperature}ºC, viento ${climaMeta.windspeed} km/h`;

  } catch (error) {
    salidaEl.textContent = "Error";
    metaEl.textContent = "Error";
    console.error("Error obteniendo clima:", error);
  }
}

actualizarClimaReal();
