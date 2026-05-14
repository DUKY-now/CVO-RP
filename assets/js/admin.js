const API = "https://cvo-trames-api.dukynow.workers.dev/api/trames";

/* ================= FETCH ================= */
async function getAll() {
    try {
        const res = await fetch(API + "?t=" + Date.now());
        const data = await res.json();
        return data && typeof data === "object" ? data : {};
    } catch (e) {
        console.error(e);
        return {};
    }
}

/* ================= SAVE ================= */
async function saveAll(data) {
    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

/* ================= LOGIN ================= */
function login() {
    const input = document.getElementById("pwd").value;

    if (input !== "admin") {
        document.getElementById("error").innerText = "Accès refusé";
        return;
    }

    document.getElementById("login-box").style.display = "none";
    document.getElementById("panel").style.display = "block";

    loadState();
}

/* ================= CURRENT TRAME ================= */
function getCurrent(all) {
    let current = localStorage.getItem("active_trame");

    if (!current || !all[current]) {
        const keys = Object.keys(all);
        current = keys[0];
        if (current) localStorage.setItem("active_trame", current);
    }

    return current;
}

/* ================= SELECTOR ================= */
function initSelector(all, current) {
    const sel = document.getElementById("trameSelect");
    sel.innerHTML = "";

    Object.keys(all).forEach(k => {
        const opt = document.createElement("option");
        opt.value = k;
        opt.textContent = all[k].nom || k;
        sel.appendChild(opt);
    });

    sel.value = current;

    sel.onchange = () => {
        localStorage.setItem("active_trame", sel.value);
        loadState();
    };
}

/* ================= LOAD ================= */
async function loadState() {

    const all = await getAll();
    const current = getCurrent(all);
    const state = all[current];

    if (!state) return;

    initSelector(all, current);

    /* PHASE SELECT */
    const phaseSel = document.getElementById("phase");
    phaseSel.innerHTML = "";

    state.phases = state.phases || [];

    state.phases.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.nom;
        phaseSel.appendChild(opt);
    });

    phaseSel.value = state.phase || 1;

    /* GLOBAL */
    globalInput.value = state.progression || 0;
    globalRange.value = state.progression || 0;
    globalPreview.textContent = (state.progression || 0) + "%";

    /* PHASE */
    const active = state.phases.find(p => p.id == state.phase);

    phaseInput.value = active?.progress || 0;
    phaseRange.value = active?.progress || 0;
    phasePreview.textContent = (active?.progress || 0) + "%";

    renderPhaseList(state);
}

/* ================= CREATE TRAME ================= */
async function createTrame() {

    const name = document.getElementById("newTrameName").value.trim();
    if (!name) return;

    const all = await getAll();
    const key = name.toLowerCase().replace(/\s+/g, "_");

    if (all[key]) return alert("Existe déjà");

    all[key] = {
        nom: name,
        progression: 0,
        phase: 1,
        phases: [
            { id: 1, nom: "Phase 1", visible: true, progress: 0 }
        ],
        missions: []
    };

    await saveAll(all);
    loadState();
}

/* ================= DELETE TRAME ================= */
async function deleteTrame() {

    const all = await getAll();
    const current = document.getElementById("trameSelect").value;

    if (!all[current]) return;

    if (!confirm("Supprimer " + current + " ?")) return;

    delete all[current];

    await saveAll(all);

    const keys = Object.keys(all);
    if (keys.length) {
        localStorage.setItem("active_trame", keys[0]);
    }

    loadState();
}

/* ================= ADD PHASE ================= */
async function addPhase() {

    const all = await getAll();
    const current = document.getElementById("trameSelect").value;

    const state = all[current];
    if (!state) return;

    const id = (state.phases?.length || 0) + 1;

    state.phases.push({
        id,
        nom: "Phase " + id,
        visible: true,
        progress: 0
    });

    await saveAll(all);
    loadState();
}

/* ================= SAVE ================= */
async function save() {

    const all = await getAll();
    const current = document.getElementById("trameSelect").value;

    const state = all[current];
    if (!state) return;

    state.progression = Number(globalInput.value);
    state.phase = Number(document.getElementById("phase").value);

    const active = state.phases.find(p => p.id == state.phase);
    if (active) active.progress = Number(phaseInput.value);

    await saveAll(all);

    alert("Sauvegardé ✔");
}

/* ================= PHASE LIST ================= */
function renderPhaseList(state) {

    const c = document.getElementById("phaseList");
    c.innerHTML = "";

    state.phases.forEach(p => {

        const div = document.createElement("div");

        div.innerHTML = `
            <input value="${p.nom}"
                oninput="updatePhaseName(${p.id}, this.value)">

            <input type="checkbox"
                ${p.visible ? "checked" : ""}
                onchange="togglePhase(${p.id}, this.checked)">

            <button onclick="deletePhase(${p.id})">🗑</button>
        `;

        c.appendChild(div);
    });
}

/* ================= PHASE EDIT ================= */
async function updatePhaseName(id, value) {
    const all = await getAll();
    const current = trameSelect.value;
    const state = all[current];

    const p = state.phases.find(x => x.id === id);
    if (p) p.nom = value;

    await saveAll(all);
}

async function togglePhase(id, val) {
    const all = await getAll();
    const current = trameSelect.value;
    const state = all[current];

    const p = state.phases.find(x => x.id === id);
    if (p) p.visible = val;

    await saveAll(all);
}

async function deletePhase(id) {
    const all = await getAll();
    const current = trameSelect.value;
    const state = all[current];

    state.phases = state.phases.filter(p => p.id !== id);

    await saveAll(all);
    loadState();
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", loadState);