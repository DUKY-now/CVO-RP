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