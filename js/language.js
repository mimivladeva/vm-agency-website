
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
    if (!languages[language]) {
        language = "es";
    }

    currentLanguage = language;

    // Guardar idioma seleccionado.
    localStorage.setItem("vm-language", language);

    // Actualizar idioma del documento.
    document.documentElement.lang = language;

    // Traducir todos los elementos disponibles.
    document.querySelectorAll("[data-lang]").forEach(element => {
        const key = element.dataset.lang;
        const value = getValue(languages[language], key);

        if (value !== undefined && value !== null) {
            element.textContent = value;
        }
    });

    // Actualizar botón de idioma activo.
    document.querySelectorAll(".language-selector__button").forEach(button => {
        const isActive = button.dataset.language === language;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

// Volver a aplicar el idioma guardado a los elementos existentes.
function applyLanguage() {
    updateLanguage(currentLanguage);
}

// Registrar los eventos de los botones de idioma.
// Se puede ejecutar varias veces sin duplicar los eventos.
function initializeLanguageButtons() {
    document.querySelectorAll(".language-selector__button").forEach(button => {
        if (button.dataset.languageInitialized === "true") {
            return;
        }

        button.dataset.languageInitialized = "true";

        button.addEventListener("click", () => {
            updateLanguage(button.dataset.language);
        });
    });
}

// Inicialización general.
document.addEventListener("DOMContentLoaded", () => {
    initializeLanguageButtons();
    applyLanguage();
});

// El navbar dinámico ya se ha insertado.
document.addEventListener("navbar:loaded", () => {
    initializeLanguageButtons();
    applyLanguage();
});

// Permite reutilizar estas funciones desde otros scripts.
window.updateLanguage = updateLanguage;
window.applyLanguage = applyLanguage;
