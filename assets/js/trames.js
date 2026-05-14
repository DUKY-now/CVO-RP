const API =
    "https://cvo-trames-api.dukynow.workers.dev/api/trames";

// =========================
// ACTIVE TRAME
// =========================

function getActiveTrame() {
    return localStorage.getItem("active_trame") || "trame1";
}

// =========================
// FETCH CLOUD DATA
// =========================

async function fetchTrames() {

    try {

        const response = await fetch(
            API + "?t=" + Date.now()
        );

        return await response.json();

    } catch (err) {

        console.error("API ERROR", err);
        return {};
    }
}

// =========================
// SELECTOR
// =========================

function initTrameSelector(data) {

    const selector =
        document.getElementById("trameSelect");

    if (!selector) return;

    selector.innerHTML = "";

    Object.keys(data).forEach(key => {

        const option =
            document.createElement("option");

        option.value = key;

        option.textContent =
            data[key]?.nom || key;

        selector.appendChild(option);
    });

    const active = getActiveTrame();

    selector.value =
        data[active] ? active : Object.keys(data)[0];

    selector.onchange = (e) => {

        localStorage.setItem(
            "active_trame",
            e.target.value
        );

        render();
    };
}

// =========================
// RENDER
// =========================

async function render() {

    const all = await fetchTrames();

    const active = getActiveTrame();

    const state = all?.[active];

    const container =
        document.getElementById("trame-container");

    if (!container) return;

    if (!state) {

        container.innerHTML = `
            <section class="empty-trame">
                <h2>Aucune trame trouvée</h2>
            </section>
        `;

        initTrameSelector(all);

        return;
    }

    let html = "";

    // =========================
    // GLOBAL
    // =========================

    html += `
        <section class="campaign-overview">

            <div class="campaign-header">

                <h2>${state.nom || active}</h2>

                <span class="campaign-percent">
                    ${state.progression ?? 0}%
                </span>

            </div>

            <div class="campaign-bar">

                <div class="campaign-fill"
                    style="width:${state.progression ?? 0}%">
                </div>

            </div>

        </section>
    `;

    // =========================
    // PHASES DYNAMIQUES
    // =========================

    const phases = state.phases || [];

    phases.forEach((phase, index) => {

        if (phase.visible === false) return;

        const isActive =
            state.activePhase === phase.id;

        const progress =
            phase.progress ?? 0;

        const name =
            phase.nom?.trim()
                ? phase.nom
                : `Phase ${phase.id ?? index + 1}`;

        html += `
            <section class="trame-phase ${isActive ? "active-phase" : ""}">

                <div class="phase-top">

                    <h2>${name}</h2>

                    <span class="phase-status">
                        ${isActive ? "EN COURS" : "EN ATTENTE"}
                    </span>

                </div>

                <div class="progress-bar">

                    <div class="progress-fill"
                        style="width:${progress}%">
                    </div>

                </div>

                <div class="phase-bottom">

                    <span>Progression</span>

                    <strong>${progress}%</strong>

                </div>

            </section>
        `;
    });

    container.innerHTML = html;

    initTrameSelector(all);
}



// =========================
// START
// =========================

document.addEventListener("DOMContentLoaded", render);

// =========================
// AUTO REFRESH
// =========================

setInterval(render, 5000);