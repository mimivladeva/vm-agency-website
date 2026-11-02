
const languages = {
    es,
    en,
    bg
};

let currentLanguage = localStorage.getItem("vm-language") || "es";

function getValue(object, path) {
    return path.split(".").reduce((value, key) => {
        return value && value[key];
    }, object);
}

// ==========================================
// UPDATE LANGUAGE
// ==========================================

function updateLanguage(language) {

    if (!languages[language]) {
        language = "es";
    }

    currentLanguage = language;

    // Save selected language
    localStorage.setItem("vm-language", language);

    // Update document language only if it changed
    if (document.documentElement.lang !== language) {
        document.documentElement.lang = language;
    }

    // Translate text elements
    document.querySelectorAll("[data-lang]").forEach(element => {

        const key = element.dataset.lang;
        const value = getValue(languages[language], key);

        if (value !== undefined && value !== null) {
            element.textContent = value;
        }
    });

    // Translate input placeholders
    document.querySelectorAll("[data-placeholder]").forEach(element => {

        const key = element.dataset.placeholder;
        const value = getValue(languages[language], key);

        if (value !== undefined && value !== null) {
            element.placeholder = value;
        }
    });

    // Update active language button
    document.querySelectorAll(".language-selector__button").forEach(button => {

        const isActive = button.dataset.language === language;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

// ==========================================
// APPLY CURRENT LANGUAGE
// ==========================================

function applyLanguage() {
    updateLanguage(currentLanguage);
}

// ==========================================
// INITIALIZE LANGUAGE BUTTONS
// ==========================================

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

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeLanguageButtons();
    applyLanguage();

});

// Navbar is dynamically inserted
document.addEventListener("navbar:loaded", () => {

    initializeLanguageButtons();
    applyLanguage();

});

// ==========================================
// GLOBAL FUNCTIONS
// ==========================================

window.updateLanguage = updateLanguage;
window.applyLanguage = applyLanguage;
