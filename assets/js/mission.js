const API = "https://cvo-trames-api.dukynow.workers.dev/api/missions";

async function fetchData() {
    return await (await fetch(API)).json();
}

function getActive() {
    return localStorage.getItem("active_mission") || "mission1";
}

/* ================= UNLOCK CHECK ================= */

function canUnlock(note) {

    if (note.visible) return true;

    // 🔐 CODE
    if (note.unlock?.type === "code") {
        const input = prompt("Code requis pour débloquer :");
        if (input === note.unlock.value) {
            note.visible = true;
            return true;
        }
    }

    return false;
}

/* ================= TIME UNLOCK ================= */

function checkTime(note) {

    if (!note.unlockAt) return;

    const now = Date.now();
    const unlockTime = new Date(note.unlockAt).getTime();

    if (now >= unlockTime) {
        note.visible = true;
    }
}

/* ================= RENDER ================= */

async function render() {

    const all = await fetchData();
    const mission = all[getActive()];

    const container = document.getElementById("mission-container");

    if (!mission) {
        container.innerHTML = "<p>Aucune mission</p>";
        return;
    }

    let html = `<h2>${mission.nom}</h2>`;

    mission.notes.forEach(note => {

        checkTime(note);

        const unlocked = canUnlock(note);

        html += `
            <div class="card ${note.visible ? "" : "locked"}">

                <h3>${note.titre}</h3>

                <p>${note.visible ? note.contenu : "🔒 Contenu verrouillé"}</p>

                ${renderMedia(note)}

            </div>
        `;
    });

    html += `<hr><h3>📁 Preuves</h3>`;

    mission.preuves?.forEach(p => {
        html += `
            <div class="card">
                <h4>${p.titre}</h4>
                <p>${p.description}</p>
                ${p.image ? `<img src="${p.image}" style="max-width:200px;">` : ""}
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderMedia(note) {

    if (!note.media) return "";

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

document.addEventListener("DOMContentLoaded", render);
setInterval(render, 5000);