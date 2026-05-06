async function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (!element) return;

    const response = await fetch(file);
    const data = await response.text();
    element.innerHTML = data;
}

// Components
loadComponent("navbar", "/components/navbar.html");
loadComponent("footer", "/components/footer.html");

// Active link
function setActiveLink() {
    const links = document.querySelectorAll("nav a");

    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });
}

setTimeout(setActiveLink, 100);

// STATE SAFE CHECK
if (typeof state !== "undefined") {

    if (state.phase === 4) {
        document.body.classList.add("phase-4");
    }

    if (state.progression > 60) {
        document.body.style.setProperty("--accent", "#8b0000");
    }

    if (state.progression > 80) {
        document.body.style.filter = "hue-rotate(20deg)";
    }
}

/* CLICK CARDS (OPTIONNEL SI TU UTILISES data-link) */
document.querySelectorAll('.clickable').forEach(card => {
    card.addEventListener('click', () => {
        window.location.href = card.dataset.link;
    });
});

/* TOGGLE (si utilisé ailleurs) */
function toggleCard(card) {
    card.classList.toggle("active");
}

/* =========================
   MODAL + SLIDER
========================= */

let images = [];
let current = 0;
let interval;

/* OPEN MODAL FROM DATA-* */
function openModalFromCard(el) {
    const data = {
        title: el.dataset.title,
        desc: el.dataset.desc,
        role: el.dataset.role,
        equip: el.dataset.equip,
        images: JSON.parse(el.dataset.images || "[]")
    };

    openModal(data);
}

/* OPEN MODAL CORE */
function openModal(data) {
    const modal = document.getElementById("modal");
    modal.style.display = "flex";

    document.getElementById("modal-title").textContent = data.title || "";
    document.getElementById("modal-desc").textContent = data.desc || "";
    document.getElementById("modal-role").textContent = data.role || "";
    document.getElementById("modal-equip").textContent = data.equip || "";

    images = Array.isArray(data.images) ? data.images : [];
    current = 0;

    startSlider();
}

/* CLOSE MODAL */
function closeModal() {
    document.getElementById("modal").style.display = "none";
    clearInterval(interval);
}

/* SHOW IMAGE */
function showSlide(index) {
    const img = document.getElementById("slider-image");
    const count = document.getElementById("slider-count");

    if (!images.length) {
        img.src = "";
        count.textContent = "0 / 0";
        return;
    }

    img.src = images[index];
    count.textContent = `${index + 1} / ${images.length}`;
}

/* NEXT */
function nextSlide() {
    if (!images.length) return;
    current = (current + 1) % images.length;
    showSlide(current);
}

/* PREV */
function prevSlide() {
    if (!images.length) return;
    current = (current - 1 + images.length) % images.length;
    showSlide(current);
}

/* AUTOPLAY */
function startSlider() {
    showSlide(current);

    clearInterval(interval);

    if (images.length <= 1) return;

    interval = setInterval(() => {
        nextSlide();
    }, 3000);
}

/* CLOSE ON OUTSIDE CLICK */
window.addEventListener("click", (e) => {
    const modal = document.getElementById("modal");
    if (e.target === modal) {
        closeModal();
    }
});