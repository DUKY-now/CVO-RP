let DATA = null;

async function init() {
    const response = await fetch("/data/trames.json");
    DATA = await response.json();
    loadTrames();
}

function loadTrames() {
    const selector = document.getElementById("trameSelector");

    selector.innerHTML = "";

    DATA.trames.forEach(trame => {
        selector.innerHTML += `
            <option value="${trame.id}">
                ${trame.nom}
            </option>
        `;
    });

    selector.addEventListener("change", updateSections);
    updateSections();
}

function updateSections() {
    const trameId = document.getElementById("trameSelector").value;

    const trame = DATA.trames.find(t => t.id === trameId);
    if (!trame) return;

    const sectionSelector = document.getElementById("sectionSelector");

    sectionSelector.innerHTML = `
        <option value="contexte">Contexte</option>
        <option value="infoRegion">Info région</option>
    `;

    trame.phases.forEach(phase => {
        sectionSelector.innerHTML += `
            <option value="phase-${phase.id}">
                Phase ${phase.id}
            </option>
        `;
    });

    sectionSelector.onchange = () => renderContent(trame);
    renderContent(trame);
}

function renderContent(trame) {
    const value = document.getElementById("sectionSelector").value;
    const content = document.getElementById("content");

    if (value === "contexte") {
        content.innerHTML = `
            <div class="section">
                <h2>Contexte</h2>
                <p>${trame.contexte}</p>
            </div>
        `;
        return;
    }

    if (value === "infoRegion") {
        content.innerHTML = `
            <div class="section">
                <h2>Info région</h2>
                <p>${trame.infoRegion}</p>
            </div>
        `;
        return;
    }

    const phaseId = Number(value.replace("phase-", ""));
    const phase = trame.phases.find(p => p.id === phaseId);

    if (!phase) return;

    content.innerHTML = `
        <div class="section">
            <h2>Phase ${phase.id} — ${phase.nom}</h2>
            <p>${phase.staffDesc}</p>

            <br>

            <p>Visibilité : ${phase.visible ? "Visible" : "Masquée"}</p>
            <p>Progression : ${phase.progression}%</p>
        </div>
    `;
}

init();