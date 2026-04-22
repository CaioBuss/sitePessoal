function toggleDarkMode() {
    document.body.classList.toggle("light");
    if (document.body.classList.contains("light")) {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }
}
window.onload =() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light");
    }

    revealOnScroll();
}
function revealOnScroll() {
    const elements = document.querySelectorAll(".fade-in");
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (CustomElementRegistry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    });

    elements.forEach(e1 => observer.observe(el));
}