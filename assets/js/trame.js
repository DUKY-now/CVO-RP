function getState() {
    return JSON.parse(localStorage.getItem("cvo_state")) || {
        phase: 1,
        progression: 0,
        phaseProgress: 0
    };
}

function applyState() {
    const state = getState();

    // ================= GLOBAL =================
    const globalBar = document.getElementById("globalBar");
    const globalText = document.getElementById("globalPercent");

    if (globalBar) globalBar.style.width = state.progression + "%";
    if (globalText) globalText.textContent = state.progression + "%";

    // ================= PHASE HIGHLIGHT =================
    document.querySelectorAll(".phase-block").forEach(block => {
        const id = Number(block.id.replace("phase", ""));
        block.classList.toggle("active-phase", id === state.phase);
    });

    // ================= ACTIVE PHASE BAR =================
    const bar = document.getElementById(`phaseBar${state.phase}`);
    const text = document.getElementById(`phasePercent${state.phase}`);

    if (bar) bar.style.width = state.phaseProgress + "%";
    if (text) text.textContent = state.phaseProgress + "%";

    // ================= EFFECT PHASE 4 =================
    document.body.classList.toggle("phase-4", state.phase === 4);
}

// init
applyState();

// sync admin
window.addEventListener("storage", applyState);

// safety refresh
setInterval(applyState, 500);