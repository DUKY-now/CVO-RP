
function getState() {
    return JSON.parse(localStorage.getItem("cvo_state")) || {
        phase: 1,
        progression: 0,
        phaseProgress: 0
    };
}

function applyState() {
    const state = getState();

    // 🔥 GLOBAL
    const globalBar = document.getElementById("globalBar");
    const globalText = document.getElementById("globalPercent");

    if (globalBar) {
        globalBar.style.width = state.progression + "%";
    }
    if (globalText) {
        globalText.textContent = state.progression + "%";
    }

    // 🔥 PHASE
    const phaseBar = document.getElementById("phaseBar");
    const phaseText = document.getElementById("phasePercent");

    if (phaseBar) {
        phaseBar.style.width = state.phaseProgress + "%";
    }
    if (phaseText) {
        phaseText.textContent = state.phaseProgress + "%";
    }

    // 🔓 LOCK SYSTEM
    document.querySelectorAll(".locked").forEach((el, index) => {
        if (state.phase > index + 1) {
            el.classList.remove("locked");
        }
    });

    // 🌧️ PHASE 4 EFFECT
    document.body.classList.toggle("phase-4", state.phase === 4);
}

// init
applyState();

// live sync
setInterval(applyState, 500);