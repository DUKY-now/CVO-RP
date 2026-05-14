const API = "https://cvo-trames-api.dukynow.workers.dev/api/missions";

async function getAll() {
    return await (await fetch(API)).json();
}

function getActive() {
    return localStorage.getItem("active_mission") || "mission1";
}

/* ================= INIT ================= */
async function load() {

    const all = await getAll();

    const sel = document.getElementById("missionSelect");
    sel.innerHTML = "";

    Object.keys(all).forEach(k => {
        const opt = document.createElement("option");
        opt.value = k;
        opt.textContent = all[k].nom;
        sel.appendChild(opt);
    });

    sel.value = getActive();

    sel.onchange = () => {
        localStorage.setItem("active_mission", sel.value);
        load();
    };

    renderNotes(all[sel.value]);
}

/* ================= CREATE MISSION ================= */
async function createMission() {

    const name = document.getElementById("missionName").value.trim();
    if (!name) return;

    const all = await getAll();
    const key = name.toLowerCase().replace(/\s+/g, "_");

    all[key] = {
        nom: name,
        classification: "CONFIDENTIEL",
        notes: []
    };

    await save(all);
    load();
}

/* ================= ADD NOTE ================= */
async function addNote() {

    const all = await getAll();
    const current = document.getElementById("missionSelect").value;

    all[current].notes.push({
        titre: document.getElementById("noteTitle").value,
        contenu: document.getElementById("noteContent").value,
        visible: false
    });

    await save(all);
    load();
}

/* ================= TOGGLE ================= */
async function toggle(missionKey, index) {

    const all = await getAll();

    all[missionKey].notes[index].visible =
        !all[missionKey].notes[index].visible;

    await save(all);
    load();
}

/* ================= RENDER ================= */
function renderNotes(mission) {

    const c = document.getElementById("notesList");
    const key = document.getElementById("missionSelect").value;

    c.innerHTML = "";

    mission.notes.forEach((n, i) => {

        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>${n.titre}</h3>
            <p>${n.contenu}</p>
            <button onclick="toggle('${key}', ${i})">
                ${n.visible ? "Masquer" : "Révéler"}
            </button>
        `;

        c.appendChild(div);
    });
}

/* ================= SAVE ================= */
async function save(all) {

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(all)
    });
}

/* ================= START ================= */
document.addEventListener("DOMContentLoaded", load);