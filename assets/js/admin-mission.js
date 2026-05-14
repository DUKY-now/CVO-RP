const API_TRAMES = "https://cvo-trames-api.dukynow.workers.dev/api/trames";
const API_MISSIONS = "https://cvo-trames-api.dukynow.workers.dev/api/missions";

/* ================= UTIL ================= */

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

/* ================= ACTIVE CONTEXT ================= */

function getActiveTrame() {
    return localStorage.getItem("active_trame");
}

function getActivePhase() {
    return localStorage.getItem("active_phase") || "1";
}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", load);

async function load() {

    const trames = await getTrames();

    initTrameSelect(trames);

    const trameSel = document.getElementById("trameSelect");
    const phaseSel = document.getElementById("phaseSelect");

    trameSel.onchange = () => {
        localStorage.setItem("active_trame", trameSel.value);
        load();
    };

    phaseSel.onchange = () => {
        localStorage.setItem("active_phase", phaseSel.value);
        render();
    };

    initPhaseSelect(trames);

    render();
}

/* ================= TRAME SELECT ================= */

function initTrameSelect(trames) {

    const sel = document.getElementById("trameSelect");
    sel.innerHTML = "";

    Object.keys(trames).forEach(k => {
        const opt = document.createElement("option");
        opt.value = k;
        opt.textContent = trames[k].nom || k;
        sel.appendChild(opt);
    });

    const active = getActiveTrame() || Object.keys(trames)[0];

    sel.value = active;
    localStorage.setItem("active_trame", active);
}

/* ================= PHASE SELECT ================= */

function initPhaseSelect(trames) {

    const trame = trames[getActiveTrame()];
    const sel = document.getElementById("phaseSelect");

    sel.innerHTML = "";

    if (!trame?.phases) return;

    trame.phases.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.nom;
        sel.appendChild(opt);
    });

    const active = getActivePhase();
    sel.value = active;
}

/* ================= RENDER ================= */

async function render() {

    const trames = await getTrames();
    const missions = await getMissions();

    const trameKey = getActiveTrame();
    const phaseId = getActivePhase();

    const list = document.getElementById("notesList");
    list.innerHTML = "";

    if (!missions) return;

    Object.keys(missions).forEach(key => {

        const m = missions[key];

        // filtre par trame + phase
        if (m.trame !== trameKey) return;
        if (m.phase != phaseId) return;

        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>${m.titre}</h3>
            <p>${m.content}</p>

            ${m.code ? `<small>🔐 Code requis</small>` : ""}

            ${m.unlockAt ? `<small>⏰ ${m.unlockAt}</small>` : ""}
        `;

        list.appendChild(div);
    });
}

/* ================= CREATE MISSION ================= */

async function createMission() {

    const trame = getActiveTrame();
    const phase = getActivePhase();

    const missions = await getMissions();

    const id = "mission_" + Date.now();

    missions[id] = {
        id,
        trame,
        phase,
        titre: document.getElementById("missionName").value,
        content: "",
        code: "",
        unlockAt: null,
        media: [],
        proofs: []
    };

    await saveMissions(missions);
    render();
}

/* ================= ADD MEDIA ================= */

async function addMedia() {

    const missions = await getMissions();
    const id = document.getElementById("missionSelect").value;

    if (!missions[id]) return;

    missions[id].media.push({
        type: document.getElementById("mediaType").value,
        url: document.getElementById("mediaUrl").value
    });

    await saveMissions(missions);
    render();
}

/* ================= ADD PROOF ================= */

async function addProof() {

    const missions = await getMissions();
    const id = document.getElementById("missionSelect").value;

    if (!missions[id]) return;

    missions[id].proofs.push({
        title: document.getElementById("proofTitle").value,
        desc: document.getElementById("proofDesc").value,
        img: document.getElementById("proofImg").value
    });

    await saveMissions(missions);
    render();
}