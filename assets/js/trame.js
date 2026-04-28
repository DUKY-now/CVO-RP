const state = JSON.parse(localStorage.getItem("cvo_state")) || {
    phase: 1,
    progression: 0
};

// progression globale
const progressBar = document.querySelector(".progress-fill");
if (progressBar) {
    progressBar.style.width = state.progression + "%";
}

// déverrouillage des phases
function updatePhases() {

    document.querySelectorAll(".locked").forEach((el, index) => {

        if (state.phase > index + 2) {
            el.classList.remove("locked");
        }

    });

}
updatePhases();

window.addEventListener("load", () => {
    updatePhases();
});