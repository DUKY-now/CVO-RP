const API_TRAMES = "https://cvo-trames-api.dukynow.workers.dev/api/trames";
const API_MISSIONS = "https://cvo-trames-api.dukynow.workers.dev/api/missions";

/* ================= FETCH ================= */

async function getTrames() {
    return await (await fetch(API_TRAMES + "?t=" + Date.now())).json();
}

async function getMissions() {
    return await (await fetch(API_MISSIONS + "?t=" + Date.now())).json();
}

async function saveMissions(data) {
    await fetch(API_MISSIONS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", load);

async function load() {

    const trames = await getTrames();

    initTrames(trames);
    initPhases(trames);

    document.getElementById("trameSelect").onchange = () => load();
    document.getElementById("phaseSelect").onchange = () => renderMissions();

    await renderMissions();
}

/* ================= TRAMES ================= */

function initTrames(trames) {

    const sel = document.getElementById("trameSelect");
    sel.innerHTML = "";

    Object.keys(trames).forEach(k => {
        const opt = document.createElement("option");
        opt.value = k;
        opt.textContent = trames[k].nom || k;
        sel.appendChild(opt);
    });

    const active = localStorage.getItem("active_trame") || Object.keys(trames)[0];

    sel.value = active;
    localStorage.setItem("active_trame", active);
}

/* ================= PHASES ================= */

function initPhases(trames) {

    const trameKey = localStorage.getItem("active_trame");
    const trame = trames[trameKey];

    const sel = document.getElementById("phaseSelect");
    sel.innerHTML = "";

    if (!trame?.phases) return;

    trame.phases.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.nom;
        sel.appendChild(opt);
    });

    const active = localStorage.getItem("active_phase") || "1";

    sel.value = active;
    localStorage.setItem("active_phase", active);
}

/* ================= CREATE ================= */

async function createMission() {

    const missions = await getMissions();

    const id = "mission_" + Date.now();

    const trame = document.getElementById("trameSelect").value;
    const phase = document.getElementById("phaseSelect").value;

    missions[id] = {
        id,
        trame,
        phase,
        titre: document.getElementById("missionName").value,
        visible: false,

        notes: [],
        preuves: []
    };

    await saveMissions(missions);
    await renderMissions();
}

/* ================== add note ========================*/ 

async function addNote() {

    const missions = await getMissions();
    const current = document.getElementById("notesList").dataset.mission;

    if (!missions[current]) return;

    missions[current].notes.push({
        titre: document.getElementById("title").value,
        contenu: document.getElementById("content").value,
        visible: false,
        unlock: {
            type: document.getElementById("codeUnlock").value ? "code" : null,
            value: document.getElementById("codeUnlock").value || null,
            time: document.getElementById("unlockTime").value || null
        },
        media: []
    });

    await saveMissions(missions);
    await renderMissions();
}

/* ================= RENDER MISSIONS ================= */

async function renderMissions() {

    const missions = await getMissions();

    const trame = document.getElementById("trameSelect").value;
    const phase = document.getElementById("phaseSelect").value;

    const container = document.getElementById("notesList");
    container.innerHTML = "";

    Object.values(missions).forEach(m => {

        if (m.trame !== trame) return;
        if (m.phase != phase) return;

        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>${m.titre}</h3>

            <button onclick="selectMission('${m.id}')">📌 Éditer cette mission</button>
        `;

        container.appendChild(div);
    });
}

function selectMission(id) {
    document.getElementById("notesList").dataset.mission = id;
}
/* ================= SAVE MISSION ================= */

async function saveMission(id) {

    const missions = await getMissions();

    const content = document.getElementById("content-" + id).value;

    if (missions[id]) {
        missions[id].content = content;
    }

    await saveMissions(missions);

    alert("Mission sauvegardée");
}

/* ================= TOGGLE VISIBILITY ================= */

async function toggleMission(id) {

    const missions = await getMissions();

    if (missions[id]) {
        missions[id].visible = !missions[id].visible;
    }

    await saveMissions(missions);

    await renderMissions();
}