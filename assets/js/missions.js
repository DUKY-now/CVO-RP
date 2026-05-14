const API =
"https://cvo-trames-api.dukynow.workers.dev/api/missions";

/* ================= FETCH ================= */

async function fetchData() {

    try {

        const res = await fetch(API + "?t=" + Date.now());

        return await res.json() || {};

    } catch (e) {

        console.error("MISSION FETCH ERROR", e);

        return {};
    }
}

/* ================= UNLOCK ================= */

function unlockMission(id, code) {

    const input =
        document.getElementById("unlock-" + id);

    if (!input) return;

    if (input.value === code) {

        localStorage.setItem(
            "mission_unlock_" + id,
            "true"
        );

        render();

    } else {

        alert("Code incorrect");
    }
}

/* ================= RENDER ================= */

async function render() {

    const all = await fetchData();

    const container =
        document.getElementById("mission-container");

    if (!container) return;

    container.innerHTML = "";

    const missions = Object.values(all);

    if (missions.length === 0) {

        container.innerHTML = `
            <p class="empty">
                Aucune mission disponible
            </p>
        `;

        return;
    }

    let html = "";

    missions.forEach(mission => {

        // MISSION MASQUÉE ADMIN
        if (!mission.visible) return;

        let locked = false;

        /* ================= TIME LOCK ================= */

        if (mission.unlockAt) {

            const unlockDate =
                new Date(mission.unlockAt).getTime();

            if (Date.now() < unlockDate) {

                locked = true;
            }
        }

        /* ================= CODE LOCK ================= */

        if (mission.code) {

            const unlocked =
                localStorage.getItem(
                    "mission_unlock_" + mission.id
                );

            if (!unlocked) {

                locked = true;
            }
        }

        html += `
            <div class="mission-card ${locked ? "locked" : ""}">

                <h2>
                    ${mission.titre || "Mission"}
                </h2>

                <div class="meta">
                    📍 ${mission.trame || "Sans trame"}
                    ${
                        mission.phase
                        ? " / Phase " + mission.phase
                        : ""
                    }
                </div>
        `;

        /* ================= CODE INPUT ================= */

        if (mission.code) {

            const unlocked =
                localStorage.getItem(
                    "mission_unlock_" + mission.id
                );

            if (!unlocked) {

                html += `
                    <p>🔒 Code RP requis</p>

                    <input
                        id="unlock-${mission.id}"
                        placeholder="Entrer le code RP">

                    <button
                        onclick="unlockMission(
                            '${mission.id}',
                            '${mission.code}'
                        )">

                        Déverrouiller
                    </button>
                `;
            }
        }

        /* ================= TIME MESSAGE ================= */

        if (
            mission.unlockAt &&
            Date.now() <
            new Date(mission.unlockAt).getTime()
        ) {

            html += `
                <p>
                    ⏳ Disponible le :
                    <br>
                    ${new Date(
                        mission.unlockAt
                    ).toLocaleString()}
                </p>
            `;
        }

        /* ================= CONTENT ================= */

        if (!locked) {

            html += `
                <hr>

                <p>
                    ${mission.content || ""}
                </p>
            `;

            /* ================= IMAGE ================= */

            if (mission.image) {

                html += `
                    <img src="${mission.image}">
                `;
            }

            /* ================= MEDIA ================= */

            if (
                Array.isArray(mission.media)
            ) {

                mission.media.forEach(m => {

                    if (m.type === "image") {

                        html += `
                            <img src="${m.url}">
                        `;
                    }

                    if (m.type === "file") {

                        html += `
                            <p>
                                <a
                                    href="${m.url}"
                                    target="_blank">

                                    📎 Ouvrir fichier
                                </a>
                            </p>
                        `;
                    }
                });
            }

            /* ================= PREUVES ================= */

            if (
                Array.isArray(mission.preuves)
                &&
                mission.preuves.length > 0
            ) {

                html += `
                    <hr>
                    <h3>📂 Preuves</h3>
                `;

                mission.preuves.forEach(p => {

                    html += `
                        <div class="mission-card">

                            <h4>${p.titre}</h4>

                            <p>${p.description}</p>

                            ${
                                p.image
                                ? `<img src="${p.image}">`
                                : ""
                            }

                        </div>
                    `;
                });
            }
        }

        html += `</div>`;
    });

    container.innerHTML = html;
}

/* ================= AUTO REFRESH ================= */

document.addEventListener(
    "DOMContentLoaded",
    render
);

setInterval(render, 5000);