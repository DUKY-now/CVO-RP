// =========================
// STORAGE
// =========================

function getAllTrames() {
    try {
        return JSON.parse(localStorage.getItem("cvo_trames")) || {};
    } catch {
        return {};
    }
}

function getActiveTrame() {
    return localStorage.getItem("active_trame") || "trame1";
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

function renderTrames() {
    const state = getState();
    const container = document.getElementById("trame-container");

    if (!container) return;

    // GLOBAL BAR
    const globalBar = document.getElementById("globalBar");
    const globalText = document.getElementById("globalPercent");

    if (globalBar) globalBar.style.width = state.progression + "%";
    if (globalText) globalText.textContent = state.progression + "%";

    // PHASES
    let html = "";

    for (let i = 1; i <= 5; i++) {

        const visible = state.visiblePhases?.[i] ?? true;
        if (!visible) continue;

        const active = state.phase === i;
        const progress = active ? state.phaseProgress : 0;

        html += `
        <div class="phase-card ${active ? "active" : ""}">
            
            <div class="phase-title">
                <h3>Phase ${i}</h3>
                <span>${progress}%</span>
            </div>

            <div class="progress-bar">
                <div class="progress-fill" style="width:${progress}%"></div>
            </div>

            <p>Contenu de la phase ${i}</p>
        </div>
        `;
    }

    container.innerHTML = html;
}

// =========================
// INIT
// =========================

document.addEventListener("DOMContentLoaded", () => {
    initTrameSelector();
    renderTrames();
});

// =========================
// LIVE SYNC (admin + multi-tab)
// =========================

window.addEventListener("storage", () => {
    renderTrames();
    initTrameSelector();
});