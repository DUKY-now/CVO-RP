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