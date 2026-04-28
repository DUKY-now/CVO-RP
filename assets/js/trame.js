function loadState() {
    return JSON.parse(localStorage.getItem("cvo_state")) || {
        phase: 1,
        progression: 0
    };
}

function applyState() {
    const state = loadState();

    // 🔥 BARRE
    const bar = document.querySelector(".progress-fill");
    if (bar) {
        bar.style.width = state.progression + "%";
    }

    // 🔥 TEXTE POURCENTAGE (TON BUG)
    const text = document.getElementById("progress-text");
    if (text) {
        text.innerText = state.progression + "%";
    }

    // 🔥 PHASES LOCKED
    document.querySelectorAll(".locked").forEach((el, index) => {
        if (state.phase > index + 1) {
            el.classList.remove("locked");
        }
    });

    // 🔥 UI PHASE 4
    if (state.phase == 4) {
        document.body.classList.add("phase-4");
    } else {
        document.body.classList.remove("phase-4");
    }
}

// init
applyState();

// live sync
setInterval(applyState, 1000);
