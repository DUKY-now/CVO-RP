const API = "https://cvo-trames-api.dukynow.workers.dev/api/trames";

function getActive() {
    return localStorage.getItem("active_trame") || "trame1";
}

async function fetchData() {
    return await (await fetch(API)).json();
}

async function render() {

    const all = await fetchData();
    const trame = all[getActive()];

    const container = document.getElementById("trame-container");
    if (!trame) {
        container.innerHTML = "<p>Aucune trame</p>";
        return;
    }

    let html = "";

    // GLOBAL
    html += `
        <h2>${trame.nom}</h2>

        <div class="bar">
            <div style="width:${trame.progression}%"></div>
        </div>
        <p>${trame.progression}%</p>
    `;

    // PHASES DYNAMIQUES
    trame.phases.forEach(p => {

        if (!p.visible) return;

        html += `
            <div class="phase">
                <h3>${p.nom}</h3>

                <div class="bar">
                    <div style="width:${p.progress}%"></div>
                </div>

                <p>${p.progress}%</p>
            </div>
        `;
    });

    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", render);
setInterval(render, 5000);