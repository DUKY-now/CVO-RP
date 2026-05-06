async function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (!element) return;

    const response = await fetch(file);
    const data = await response.text();
    element.innerHTML = data;
}

// Charger les composants
loadComponent("navbar", "/components/navbar.html");
loadComponent("footer", "/components/footer.html");

function setActiveLink() {
    const links = document.querySelectorAll("nav a");
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });
}

setTimeout(setActiveLink, 100);
if (typeof state !== "undefined") {

    if (state.phase == 4) {
        document.body.classList.add("phase-4");
    }

    if (state.progression > 60) {
        document.body.style.setProperty("--accent", "#8b0000");
    }

    if (state.progression > 80) {
        document.body.style.filter = "hue-rotate(20deg)";
    }

}
document.querySelectorAll('.clickable').forEach(card => {
    card.addEventListener('click', () => {
        window.location.href = card.dataset.link;
    });
});

function toggleCard(card) {
    card.classList.toggle("active");
}

let images = [];
let current = 0;
let interval;

/* OPEN MODAL */
function openModal(data) {
    document.getElementById("modal").style.display = "flex";

    // Injecter texte
    document.getElementById("modal-title").textContent = data.title;
    document.getElementById("modal-desc").textContent = data.desc;
    document.getElementById("modal-role").textContent = data.role;
    document.getElementById("modal-equip").textContent = data.equip;

    // Images
    images = data.images;
    current = 0;

    startSlider();
}

/* CLOSE */
function closeModal() {
    document.getElementById("modal").style.display = "none";
    clearInterval(interval);
}

/* SHOW SLIDE */
function showSlide(index) {
    const img = document.getElementById("slider-image");
    const count = document.getElementById("slider-count");

    img.src = images[index];
    count.textContent = (index + 1) + " / " + images.length;
}

/* NEXT */
function nextSlide() {
    current = (current + 1) % images.length;
    showSlide(current);
}

/* PREV */
function prevSlide() {
    current = (current - 1 + images.length) % images.length;
    showSlide(current);
}

/* AUTOPLAY */
function startSlider() {
    showSlide(current);

    clearInterval(interval);
    interval = setInterval(() => {
        nextSlide();
    }, 3000);
}