function getState() {
    return JSON.parse(localStorage.getItem("cvo_state")) || {
        phase: 1,
        progression: 0,
        phaseProgress: 0
    };
}

function applyState() {
    const state = getState();

    // GLOBAL
    const globalBar = document.getElementById("globalBar");
    const globalText = document.getElementById("globalPercent");

    if (globalBar) globalBar.style.width = state.progression + "%";
    if (globalText) globalText.textContent = state.progression + "%";

    // 🔥 PHASE VISUELLE (AU LIEU DE HIDE)
    document.querySelectorAll(".phase-block").forEach((el) => {

        el.classList.remove("active-phase");

        if (el.id === "phase" + state.phase) {
            el.classList.add("active-phase");
        }
    });

    // 🔥 BARRE PHASE ACTIVE
    const bar = document.getElementById(`phaseBar${state.phase}`);
    const text = document.getElementById(`phasePercent${state.phase}`);

    if (bar) bar.style.width = state.phaseProgress + "%";
    if (text) text.textContent = state.phaseProgress + "%";

    // 🌧️ EFFECT PHASE 4
    document.body.classList.toggle("phase-4", state.phase === 4);
}

applyState();
setInterval(applyState, 1000);