document.addEventListener("DOMContentLoaded", () => {

    const footerContainer = document.getElementById("footer-container");

    if (!footerContainer) {
        return;
    }

    fetch("footer.html")
        .then(response => {

            if (!response.ok) {
                throw new Error("No se pudo cargar footer.html");
            }

            return response.text();
        })
        .then(html => {

            // Insertamos el footer
            footerContainer.innerHTML = html;

            // IMPORTANTE:
            // Ahora que el footer existe en el DOM,
            // volvemos a aplicar el idioma seleccionado.
            if (typeof applyLanguage === "function") {
                applyLanguage();
            }

        })
        .catch(error => {
            console.error("Error cargando el footer:", error);
        });

});