const languages = {
    es,
    en,
    bg
};

let currentLanguage = localStorage.getItem("vm-language") || "es";


function getValue(object, path) {

    return path.split(".").reduce((o, p) => o && o[p], object);

}


function updateLanguage(language) {

    // Comprobar que el idioma existe
    if (!languages[language]) {
        language = "es";
    }

    currentLanguage = language;

    // Guardar idioma para las siguientes páginas
    localStorage.setItem("vm-language", language);

    // Actualizar atributo HTML
    document.documentElement.lang = language;


    // Actualizar todos los textos
    document.querySelectorAll("[data-lang]").forEach(element => {

        const key = element.dataset.lang;

        const value = getValue(languages[language], key);

        if (value !== undefined && value !== null) {
            element.textContent = value;
        }

    });


    // Actualizar botón activo
    document
        .querySelectorAll(".language-selector__button")
        .forEach(button => {

            button.classList.remove("active");

        });


    const activeButton = document.querySelector(
        `[data-language="${language}"]`
    );

    if (activeButton) {
        activeButton.classList.add("active");
    }

}


/*
==========================================================
FUNCIÓN PARA VOLVER A APLICAR EL IDIOMA
==========================================================

La utilizamos cuando cargamos elementos dinámicamente,
como el footer.html.
*/

function applyLanguage() {

    updateLanguage(currentLanguage);

}


/*
==========================================================
INICIALIZACIÓN
==========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    // Aplicar el último idioma utilizado
    updateLanguage(currentLanguage);


    // Botones de idioma
    document
        .querySelectorAll(".language-selector__button")
        .forEach(button => {

            button.addEventListener("click", () => {

                updateLanguage(button.dataset.language);

            });

        });

});