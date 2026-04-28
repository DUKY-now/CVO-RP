
function loadState() {
    return JSON.parse(localStorage.getItem("cvo_state")) || {
        phase: 1,
        progression: 0,
        phaseProgress: 0
    };
}

function applyState() {
    const state = loadState();

    // 📊 BARRE GLOBALE
    const globalBar = document.querySelector(".progress-fill");
    const globalText = document.getElementById("progress-text");

    if (globalBar) {
        globalBar.style.width = state.progression + "%";
    }
    if (globalText) {
        globalText.innerText = state.progression + "%";
    }

    // 📈 BARRE PHASE (FIX IMPORTANT)
    const phaseBar = document.getElementById("phase-fill");
    const phaseText = document.getElementById("phase-text");

    if (phaseBar) {
        phaseBar.style.width = state.phaseProgress + "%";
    }

    if (phaseText) {
        phaseText.innerText = state.phaseProgress + "%";
    }

    // 🔓 PHASE UNLOCK
    document.querySelectorAll(".locked").forEach((el, index) => {
        if (state.phase > index + 1) {
            el.classList.remove("locked");
        }
    });

    // 🌧️ PHASE 4 EFFECT
    if (Number(state.phase) === 4) {
        document.body.classList.add("phase-4");
    } else {
        document.body.classList.remove("phase-4");
    }
}

// init
applyState();

// live sync
setInterval(applyState, 500);
