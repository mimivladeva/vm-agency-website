document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.getElementById("menu-toggle");
    const navbar = document.getElementById("navbar");
    const navLinks = document.querySelectorAll(".header__link");

    // Abrir / cerrar menú

    menuToggle.addEventListener("click", () => {

        navbar.classList.toggle("active");
        menuToggle.classList.toggle("active");

    });

    // Cerrar al pulsar un enlace

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navbar.classList.remove("active");
            menuToggle.classList.remove("active");

        });

    });

    // Cerrar al redimensionar

    window.addEventListener("resize", () => {

        if(window.innerWidth > 991){

            navbar.classList.remove("active");
            menuToggle.classList.remove("active");

        }

    });

});