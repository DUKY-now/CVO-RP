const API =
    "https://cvo-trames-api.dukynow.workers.dev/api/trames";

// =========================
// ACTIVE TRAME
// =========================

function getActiveTrame() {

    return localStorage.getItem(
        "active_trame"
    ) || "trame1";
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

        console.error(
            "API ERROR",
            err
        );

        return {};
    }
}

// =========================
// INIT SELECTOR
// =========================

function initTrameSelector(data) {

    const selector =
        document.getElementById(
            "trameSelect"
        );

    if (!selector) return;

    const current =
        selector.value;

    selector.innerHTML = "";

    Object.keys(data).forEach(key => {

        const option =
            document.createElement(
                "option"
            );

        option.value = key;

        option.textContent =
            key.toUpperCase();

        selector.appendChild(option);
    });

    const active =
        getActiveTrame();

    selector.value =
        data[active]
            ? active
            : Object.keys(data)[0];

    selector.onchange = (e) => {

        localStorage.setItem(
            "active_trame",
            e.target.value
        );

        render();
    };
}

// =========================
// RENDER PAGE
// =========================

async function render() {

    const all =
        await fetchTrames();

    const active =
        getActiveTrame();

    const state =
        all?.[active];

    const container =
        document.getElementById(
            "trame-container"
        );

    if (!container) return;

    // =========================
    // EMPTY
    // =========================

    if (!state) {

        container.innerHTML = `
            <section class="empty-trame">
                <h2>
                    Aucune trame trouvée
                </h2>
            </section>
        `;

        initTrameSelector(all);

        return;
    }

    // =========================
    // HTML
    // =========================

    let html = "";

    // =========================
    // GLOBAL PROGRESSION
    // =========================

    html += `
        <section class="campaign-overview">

            <div class="campaign-header">

                <h2>
                    📡 État de la campagne
                </h2>

                <span class="campaign-percent">
                    ${state.progression}%
                </span>

            </div>

            <div class="campaign-bar">

                <div
                    class="campaign-fill"
                    style="
                        width:${state.progression}%
                    "
                ></div>

            </div>

        </section>
    `;

    // =========================
    // PHASES
    // =========================

    for (let i = 1; i <= 5; i++) {

        const visible =
            state.visiblePhases?.[i];

        if (!visible) continue;

        const activePhase =
            state.phase === i;

        const progress =
            activePhase
                ? state.phaseProgress
                : 0;

        html += `
            <section class="
                trame-phase
                ${activePhase
                    ? "active-phase"
                    : ""}
            ">

                <div class="phase-top">

                    <h2>
                        Phase ${i}
                    </h2>

                    <span class="
                        phase-status
                    ">
                        ${activePhase
                            ? "EN COURS"
                            : "EN ATTENTE"}
                    </span>

                </div>

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="
                            width:${progress}%
                        "
                    ></div>

                </div>

                <div class="phase-bottom">

                    <span>
                        Progression
                    </span>

                    <strong>
                        ${progress}%
                    </strong>

                </div>

            </section>
        `;
    }

    // =========================
    // APPLY HTML
    // =========================

    container.innerHTML =
        html;

    // =========================
    // REFRESH SELECTOR
    // =========================

    initTrameSelector(all);
}

// =========================
// START
// =========================

document.addEventListener(
    "DOMContentLoaded",
    render
);

// =========================
// AUTO REFRESH
// =========================

setInterval(
    render,
    5000
);