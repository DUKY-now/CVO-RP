const API = "https://cvo-trames-api.dukynow.workers.dev/api/trames";

// =========================
// ACTIVE TRAME
// =========================
function getActiveTrame() {
    return localStorage.getItem("active_trame") || "trame1";
}

// =========================
// FETCH DATA
// =========================
async function fetchTrames() {
    try {
        const res = await fetch(API);
        return await res.json();
    } catch (e) {
        console.error("API ERROR", e);
        return {};
    }
}

// =========================
// INIT DROPDOWN
// =========================
async function initTrameSelector(data) {
    const selector = document.getElementById("trameSelect");
    if (!selector) return;

    selector.innerHTML = "";

    Object.keys(data || {}).forEach(key => {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = key;
        selector.appendChild(opt);
    });

    const active = getActiveTrame();
    selector.value = active;

    selector.onchange = (e) => {
        localStorage.setItem("active_trame", e.target.value);
        render();
    };
}

// =========================
// RENDER PAGE
// =========================
async function render() {
    const all = await fetchTrames();
    const active = getActiveTrame();

    const state = all[active];

    const container = document.getElementById("trame-container");
    if (!container) return;

    if (!state) {
        container.innerHTML = "<p>Aucune trame trouvée</p>";
        return;
    }

    let html = "";

    // GLOBAL
    html += `
        <section class="section">
            <h2>📊 Progression globale</h2>
            <div class="progress-bar">
                <div class="progress-fill" style="width:${state.progression}%"></div>
            </div>
            <p>${state.progression}%</p>
        </section>
    `;

    // PHASES
    for (let i = 1; i <= 5; i++) {

        if (!state.visiblePhases?.[i]) continue;

        const activePhase = state.phase === i;
        const progress = activePhase ? state.phaseProgress : 0;

        html += `
            <section class="section phase-block ${activePhase ? "active-phase" : ""}">
                <h2>Phase ${i}</h2>

                <div class="progress-bar">
                    <div class="progress-fill" style="width:${progress}%"></div>
                </div>

                <p>${progress}%</p>
            </section>
        `;
    }

    container.innerHTML = html;

    await initTrameSelector(all);
}

// =========================
// START
// =========================
document.addEventListener("DOMContentLoaded", render);

setInterval(render, 5000);