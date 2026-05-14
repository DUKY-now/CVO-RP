// =========================
// STORAGE
// =========================

async function getAllTrames() {
    try {
        const res = await fetch("https://cvo-trames-api.dukynow.workers.dev/api/trames");
        return await res.json();
    } catch {
        return {};
    }
}
// =========================
// STATE
// =========================

function getDefaultState() {
    return {
        phase: 1,
        progression: 0,
        phaseProgress: 0,
        visiblePhases: {
            1: true,
            2: true,
            3: true,
            4: true,
            5: true
        }
    };
}

function getState() {
    const all = getAllTrames();
    const active = getActiveTrame();

    const base = getDefaultState();
    const trame = all?.[active];

    if (!trame || typeof trame !== "object") return base;

    return {
        ...base,
        ...trame,
        visiblePhases: {
            ...base.visiblePhases,
            ...(trame.visiblePhases || {})
        }
    };
}

// =========================
// SELECTOR
// =========================

function initTrameSelector() {
    const selector = document.getElementById("trameSelect");
    if (!selector) return;

    const all = getAllTrames();
    const active = getActiveTrame();

    selector.innerHTML = Object.keys(all)
        .map(key => `<option value="${key}">${key}</option>`)
        .join("");

    selector.value = active;

    selector.onchange = (e) => {
        localStorage.setItem("active_trame", e.target.value);
        renderTrames();
    };
}

// =========================
// RENDER
// =========================

async function renderTrames() {
    const all = await getAllTrames();
    const active = getActiveTrame();

    const state = all[active] || {
        phase: 1,
        progression: 0,
        phaseProgress: 0,
        visiblePhases: { 1:true,2:true,3:true,4:true,5:true }
    };

    const container = document.getElementById("trame-container");
    if (!container) return;

    let html = "";

    html += `
        <section class="section">
            <h2>📊 Progression globale</h2>
            <div class="progress-bar">
                <div class="progress-fill" style="width:${state.progression}%"></div>
            </div>
            <p>${state.progression}%</p>
        </section>
    `;

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
}

// =========================
// INIT
// =========================

document.addEventListener("DOMContentLoaded", renderTrames);
setInterval(renderTrames, 5000);

// =========================
// LIVE SYNC (admin + multi-tab)
// =========================

window.addEventListener("storage", () => {
    renderTrames();
    initTrameSelector();
});