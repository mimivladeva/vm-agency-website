const languages = {
    es,
    en,
    bg
};

let currentLanguage = "es";

function getValue(object, path){

    return path.split(".").reduce((o,p)=>o && o[p], object);

}

function updateLanguage(language){

    currentLanguage = language;

    document.documentElement.lang = language;

    document.querySelectorAll("[data-lang]").forEach(element=>{

        const key = element.dataset.lang;

        const value = getValue(languages[language], key);

        if(value){

            element.textContent = value;

        }

    });

    document.querySelectorAll(".language-selector__button").forEach(button=>{

        button.classList.remove("active");

    });

    document
        .querySelector(`[data-language="${language}"]`)
        .classList.add("active");

}

document.addEventListener("DOMContentLoaded",()=>{

    updateLanguage("es");

    document.querySelectorAll(".language-selector__button").forEach(button=>{

        button.addEventListener("click",()=>{

            updateLanguage(button.dataset.language);

        });

    });

});