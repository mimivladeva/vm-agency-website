
document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("navbar-container");

    if (!container) return;

    try {
        const response = await fetch("navbar.html");

        if (!response.ok) {
            throw new Error(`No se pudo cargar navbar.html: ${response.status}`);
        }

        container.innerHTML = await response.text();

        initializeNavbar(container);

        // Avisa a language.js de que el navbar ya existe.
        document.dispatchEvent(new Event("navbar:loaded"));

    } catch (error) {
        console.error("Error al cargar el navbar:", error);
    }
});

function initializeNavbar(container) {
    const toggle = container.querySelector("#menu-toggle");
    const nav = container.querySelector("#navbar");

    if (!toggle || !nav) return;

    function closeMenu() {
        nav.classList.remove("active");
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
    }

    toggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("active");

        toggle.classList.toggle("active", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute(
            "aria-label",
            isOpen ? "Cerrar menú" : "Abrir menú"
        );
    });

    // Cerrar el menú al seleccionar un enlace.
    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    // Cerrar con Escape.
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMenu();
    });

    // Si vuelve a escritorio, cerrar el menú móvil.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 992) closeMenu();
    });

    setActiveNavigation(container);
}

function setActiveNavigation(container) {
    const links = container.querySelectorAll(".header__link");
    const sections = document.querySelectorAll(
        "main section[id]"
    );

    const currentPath = window.location.pathname;
    const currentPage = currentPath.split("/").pop() || "index.html";

    function setActiveLink(target) {
        links.forEach(link => {
            link.classList.remove("active");
            link.removeAttribute("aria-current");

            const url = new URL(link.href, window.location.href);
            const linkPage = url.pathname.split("/").pop() || "index.html";

            // Páginas independientes: FAQ, servicios, etc.
            if (linkPage === currentPage && !url.hash) {
                if (target === "page") {
                    link.classList.add("active");
                    link.setAttribute("aria-current", "page");
                }
            }

            // Secciones de index.html
            if (
                target !== "page" &&
                linkPage === currentPage &&
                url.hash === `#${target}`
            ) {
                link.classList.add("active");
                link.setAttribute("aria-current", "location");
            }
        });
    }

    // En páginas diferentes de index.html, activar el enlace
    // correspondiente a la página actual.
    if (currentPage !== "index.html") {
        setActiveLink("page");
        return;
    }

    // Activar la sección correspondiente al scroll.
    function updateActiveSection() {
        const header = container.querySelector(".header");
        const headerHeight = header
            ? header.getBoundingClientRect().height
            : 0;

        const activationPoint = headerHeight + 100;
        let activeSection = sections[0]?.id;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();

            if (rect.top <= activationPoint) {
                activeSection = section.id;
            }
        });

        // Al llegar al final de la página, activar Contacto.
        if (
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 5
        ) {
            activeSection = sections[sections.length - 1]?.id;
        }

        if (activeSection) {
            setActiveLink(activeSection);
        }
    }

    // Actualizar al desplazarse.
    window.addEventListener("scroll", updateActiveSection, {
        passive: true
    });

    // Actualizar al navegar mediante enlaces con #.
    window.addEventListener("hashchange", updateActiveSection);

    // Estado inicial, también si se entra con una URL con hash.
    requestAnimationFrame(updateActiveSection);
}
