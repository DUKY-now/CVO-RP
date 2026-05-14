const API = "https://cvo-trames-api.dukynow.workers.dev/api/trames";

function getActive() {
    return localStorage.getItem("active_trame") || "trame1";
}

async function fetchData() {
    try {
        const res = await fetch(API + "?t=" + Date.now());
        return await res.json();
    } catch (e) {
        console.error(e);
        return {};
    }
}

/* ================= SELECTOR ================= */

function initSelector(all) {
    const sel = document.getElementById("trameSelect");
    if (!sel) return;

    sel.innerHTML = "";

    Object.keys(all).forEach(key => {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = all[key].nom || key;
        sel.appendChild(opt);
    });

    const active = getActive();

    sel.value = all[active] ? active : Object.keys(all)[0];

    localStorage.setItem("active_trame", sel.value);

    sel.onchange = () => {
        localStorage.setItem("active_trame", sel.value);
        render();
    };
}

/* ================= RENDER ================= */

async function render() {

    const all = await fetchData();

    initSelector(all);

    const active = getActive();
    const trame = all[active];

    const container = document.getElementById("trame-container");
    if (!container) return;

    if (!trame) {
        container.innerHTML = "<p>Aucune trame trouvée</p>";
        return;
    }

    let html = "";

    // GLOBAL
    html += `
        <section class="global">
            <h2>${trame.nom || active}</h2>

            <div class="bar">
                <div style="width:${trame.progression || 0}%"></div>
            </div>

            <p>${trame.progression || 0}%</p>
        </section>
    `;

    // PHASES
    if (Array.isArray(trame.phases)) {

        trame.phases.forEach(p => {

            if (!p.visible) return;

            html += `
                <section class="phase">
                    <h3>${p.nom || ("Phase " + p.id)}</h3>

                    <div class="bar">
                        <div style="width:${p.progress || 0}%"></div>
                    </div>

                    <p>${p.progress || 0}%</p>
                </section>
            `;
        });
    }

    container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", render);
setInterval(render, 5000);