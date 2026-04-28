function getState() {
    return JSON.parse(localStorage.getItem("cvo_state")) || {
        phase: 1,
        progression: 0,
        phaseProgress: 0
    };
}

function applyState() {
    const state = getState();

    // 🔥 GLOBAL BAR
    const globalBar = document.getElementById("globalBar");
    const globalText = document.getElementById("globalPercent");

    if (globalBar) globalBar.style.width = state.progression + "%";
    if (globalText) globalText.textContent = state.progression + "%";

    // 🔥 PHASE SYSTEM (IMPORTANT)
    document.querySelectorAll("[data-phase]").forEach(section => {
        const phaseId = Number(section.dataset.phase);

        if (phaseId === state.phase) {
            section.style.display = "block";
        } else {
            section.style.display = "none";
        }
    });

    // 🔥 UPDATE BARRES PHASE INDIVIDUELLES
    const bar = document.getElementById(`phaseBar${state.phase}`);
    const text = document.getElementById(`phasePercent${state.phase}`);

    if (bar) bar.style.width = state.phaseProgress + "%";
    if (text) text.textContent = state.phaseProgress + "%";

    // 🌧️ EFFECT PHASE 4
    document.body.classList.toggle("phase-4", state.phase === 4);
}

// init
applyState();

// live sync
setInterval(applyState, 1000);