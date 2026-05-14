const API = "https://cvo-trames-api.dukynow.workers.dev/api/missions";

/* ================= FETCH ================= */

async function fetchData() {
    try {
        const res = await fetch(API + "?t=" + Date.now());
        const data = await res.json();
        return data || {};
    } catch (e) {
        console.error("FETCH ERROR", e);
        return {};
    }
}

/* ================= ACTIVE MISSION ================= */

function getActive() {
    return localStorage.getItem("active_mission") || null;
}

/* ================= SELECTOR ================= */

function initSelector(all) {

    const container = document.getElementById("mission-selector");
    if (!container) return;

    container.innerHTML = "";

    Object.keys(all).forEach(key => {

        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = all[key].titre || key;

        container.appendChild(opt);
    });

    let active = getActive();

    if (!active || !all[active]) {
        active = Object.keys(all)[0];
        localStorage.setItem("active_mission", active);
    }

    container.value = active;

    container.onchange = () => {
        localStorage.setItem("active_mission", container.value);
        render();
    };
}

/* ================= RENDER ================= */

async function render() {

    const all = await fetchData();

    initSelector(all);

    const active = getActive();
    const mission = all[active];

    const container = document.getElementById("mission-container");

    if (!container) return;

    if (!mission) {
        container.innerHTML = "<p>Aucune mission disponible</p>";
        return;
    }

    let html = "";

    /* ================= HEADER ================= */

    html += `
        <h2>${mission.titre}</h2>
        <p style="opacity:0.6;">${mission.trame || ""} / Phase ${mission.phase || ""}</p>
        <hr>
    `;

    /* ================= NOTES ================= */

    if (Array.isArray(mission.notes)) {

        mission.notes.forEach(note => {

            html += `
                <div class="card ${note.visible ? "" : "locked"}">

                    <h3>${note.titre}</h3>

                    <p>
                        ${note.visible ? note.contenu : "🔒 Contenu verrouillé"}
                    </p>

                    ${renderMedia(note)}

                </div>
            `;
        });
    }

    /* ================= PREUVES ================= */

    if (Array.isArray(mission.preuves) && mission.preuves.length > 0) {

        html += `<hr><h3>📁 Preuves</h3>`;

        mission.preuves.forEach(p => {

            html += `
                <div class="card">
                    <h4>${p.titre}</h4>
                    <p>${p.description}</p>
                    ${p.image ? `<img src="${p.image}" style="max-width:250px;">` : ""}
                </div>
            `;
        });
    }

    container.innerHTML = html;
}

/* ================= MEDIA ================= */

function renderMedia(note) {

    if (!Array.isArray(note.media)) return "";

    return note.media.map(m => {

        if (m.type === "image") {
            return `<img src="${m.url}" style="max-width:250px;">`;
        }

        if (m.type === "file") {
            return `<a href="${m.url}" target="_blank">📎 Fichier</a>`;
        }

        return "";

    }).join("");
}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", render);
setInterval(render, 5000);