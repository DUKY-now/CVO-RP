const API = "https://cvo-trames-api.dukynow.workers.dev/api/trames";

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

/* ================= FETCH ================= */
async function getAll() {
    try {
        const res = await fetch(API + "?t=" + Date.now());
        const data = await res.json();
        return data && typeof data === "object" ? data : {};
    } catch {
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

/* ================= ACTIVE ================= */
function getCurrent(all) {
    let current = localStorage.getItem("active_trame");

    if (!current || !all[current]) {
        const keys = Object.keys(all);
        current = keys[0] || null;
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
    const keys = Object.keys(all);

    if (!keys.length) return;

    const current = getCurrent(all);
    if (!current) return;

    initSelector(all, current);

    const state = all[current];
    if (!state) return;

    // PHASE SELECT
    const phaseSel = document.getElementById("phase");
    phaseSel.innerHTML = "";

    (state.phases || []).forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.nom || ("Phase " + p.id);
        phaseSel.appendChild(opt);
    });

    phaseSel.value = state.phase || 1;

    globalInput.value = state.progression || 0;
    globalRange.value = state.progression || 0;
    globalPreview.textContent = (state.progression || 0) + "%";

    const active = (state.phases || []).find(p => p.id == state.phase);

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
        phases: [{ id: 1, nom: "Phase 1", visible: true, progress: 0 }]
    };

    await saveAll(all);
    loadState();
}

/* ================= DELETE TRAME ================= */
async function deleteTrame() {

    const current = document.getElementById("trameSelect").value;
    const all = await getAll();

    if (!all[current]) return;

    if (!confirm("Supprimer cette trame ?")) return;

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

/* ================= PHASE LIST ================= */
function renderPhaseList(state) {

    const container = document.getElementById("phaseList");
    container.innerHTML = "";

    (state.phases || []).forEach(p => {

        const div = document.createElement("div");

        div.innerHTML = `
            <input value="${p.nom}"
                oninput="updatePhaseName(${p.id}, this.value)">

            <input type="checkbox"
                ${p.visible ? "checked" : ""}
                onchange="togglePhase(${p.id}, this.checked)">

            <button onclick="deletePhase(${p.id})">🗑</button>
        `;

        container.appendChild(div);
    });
}

/* ================= EDIT PHASE ================= */
async function updatePhaseName(id, value) {
    const all = await getAll();
    const current = document.getElementById("trameSelect").value;

    const state = all[current];
    const p = state?.phases?.find(x => x.id === id);

    if (p) p.nom = value;

    await saveAll(all);
}

async function togglePhase(id, val) {
    const all = await getAll();
    const current = document.getElementById("trameSelect").value;

    const state = all[current];
    const p = state?.phases?.find(x => x.id === id);

    if (p) p.visible = val;

    await saveAll(all);
}

async function deletePhase(id) {
    const all = await getAll();
    const current = document.getElementById("trameSelect").value;

    const state = all[current];
    if (!state) return;

    state.phases = state.phases.filter(p => p.id !== id);

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

    alert("Sauvegardé");
}

/* ================= SLIDERS ================= */
globalInput.oninput = e => {
    globalRange.value = e.target.value;
    globalPreview.textContent = e.target.value + "%";
};

globalRange.oninput = e => {
    globalInput.value = e.target.value;
    globalPreview.textContent = e.target.value + "%";
};

phaseInput.oninput = e => {
    phaseRange.value = e.target.value;
    phasePreview.textContent = e.target.value + "%";
};

phaseRange.oninput = e => {
    phaseInput.value = e.target.value;
    phasePreview.textContent = e.target.value + "%";
};

document.addEventListener("DOMContentLoaded", loadState);