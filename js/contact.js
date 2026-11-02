document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // ==========================================
    // CONFIGURATION
    // ==========================================

    const API_URL = "http://localhost:8080/api";

    const form = document.getElementById("contact-form");
    const feedback = document.getElementById("contact-feedback");

    if (!form || !feedback) return;

    let requestId = null;
    let feedbackKey = null;
    let verificationModal = null;
    let modalTitle = null;
    let modalDescription = null;
    let codeInput = null;
    let verifyButton = null;
    let modalFeedback = null;

    // ==========================================
    // TRANSLATIONS
    // ==========================================

    function getFormTranslations() {
        const language =
            document.documentElement.lang ||
            localStorage.getItem("vm-language") ||
            "es";

        const dictionaries = { es, en, bg };

        return (
            dictionaries[language]?.contact?.form ||
            dictionaries.es.contact.form
        );
    }

    function translate(key) {
        const translations = getFormTranslations();
        return translations[key] || key;
    }

    // ==========================================
    // MAIN FORM FEEDBACK
    // ==========================================

    function showFormMessage(key, type = "info") {
        feedbackKey = key;

        feedback.textContent = translate(key);

        feedback.className =
            `contact__feedback contact__feedback--${type}`;
    }

    // ==========================================
    // MODAL FEEDBACK
    // ==========================================

    function showModalMessage(key, type = "info") {
        modalFeedback.textContent = translate(key);

        modalFeedback.className =
            `verification-modal__feedback verification-modal__feedback--${type}`;
    }

    // ==========================================
    // CREATE VERIFICATION MODAL
    // ==========================================

    function createVerificationModal() {
        if (verificationModal) return;

        verificationModal = document.createElement("div");

        verificationModal.className = "verification-modal";
        verificationModal.id = "verification-modal";

        verificationModal.setAttribute("role", "dialog");
        verificationModal.setAttribute("aria-modal", "true");
        verificationModal.setAttribute(
            "aria-labelledby",
            "verification-modal-title"
        );

        verificationModal.innerHTML = `
            <div class="verification-modal__card">

                <div class="verification-modal__icon"
                     aria-hidden="true">
                    <i class="icon-mail-check"></i>
                </div>

                <p class="verification-modal__eyebrow">
                    VM AGENCY · EMAIL VERIFICATION
                </p>

                <h2
                    class="verification-modal__title"
                    id="verification-modal-title">
                </h2>

                <p class="verification-modal__description"></p>

                <form class="verification-modal__form"
                      id="verification-modal-form">

                    <label
                        class="verification-modal__label"
                        for="verification-code">
                    </label>

                    <input
                        class="verification-modal__input"
                        type="text"
                        id="verification-code"
                        name="code"
                        maxlength="6"
                        inputmode="numeric"
                        autocomplete="one-time-code"
                        placeholder=""
                        required>

                    <button
                        type="submit"
                        class="verification-modal__button">
                    </button>

                    <p
                        class="verification-modal__feedback"
                        role="status"
                        aria-live="polite">
                    </p>

                </form>

            </div>
        `;

        document.body.appendChild(verificationModal);

        modalTitle = verificationModal.querySelector(
            ".verification-modal__title"
        );

        modalDescription = verificationModal.querySelector(
            ".verification-modal__description"
        );

        codeInput = verificationModal.querySelector(
            "#verification-code"
        );

        verifyButton = verificationModal.querySelector(
            ".verification-modal__button"
        );

        modalFeedback = verificationModal.querySelector(
            ".verification-modal__feedback"
        );

        verificationModal
            .querySelector("#verification-modal-form")
            .addEventListener("submit", (event) => {
                event.preventDefault();
                verifyEmail();
            });

        updateModalTranslations();
    }

    // ==========================================
    // UPDATE MODAL TRANSLATIONS
    // ==========================================

    function updateModalTranslations() {
        if (!verificationModal) return;

        modalTitle.textContent = translate("requestSent");

        modalDescription.textContent =
            translate("verificationDescription") !== "verificationDescription"
                ? translate("verificationDescription")
                : translate("requestSent");

        verificationModal.querySelector(
            ".verification-modal__label"
        ).textContent = translate("codeLabel");

        codeInput.placeholder = translate("codePlaceholder");

        verifyButton.textContent = translate("verifyButton");

        if (modalFeedback.dataset.translationKey) {
            modalFeedback.textContent = translate(
                modalFeedback.dataset.translationKey
            );
        }
    }

    // ==========================================
    // OPEN MODAL
    // ==========================================

    function openVerificationModal() {
        createVerificationModal();

        verificationModal.classList.add("is-visible");

        document.body.classList.add("verification-modal-open");

        codeInput.value = "";

        showModalMessage("requestSent", "info");

        window.setTimeout(() => {
            codeInput.focus();
        }, 300);
    }

    // ==========================================
    // CLOSE MODAL
    // ==========================================

    function closeVerificationModal() {
        if (!verificationModal) return;

        verificationModal.classList.remove("is-visible");

        document.body.classList.remove("verification-modal-open");
    }

    // ==========================================
    // RESPONSE HANDLING
    // ==========================================

    async function readResponse(response) {
        try {
            return await response.json();
        } catch {
            return {};
        }
    }

    // ==========================================
    // STEP 1: SUBMIT CONTACT FORM
    // ==========================================

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector(
            'button[type="submit"]'
        );

        const contactData = {
            name: form.elements.name.value.trim(),
            email: form.elements.email.value.trim(),
            company: form.elements.company.value.trim(),
            message: form.elements.message.value.trim()
        };

        submitButton.disabled = true;

        showFormMessage("sending", "info");

        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(contactData)
            });

            const data = await readResponse(response);

            if (!response.ok) {
                throw new Error("sendError");
            }

            requestId = data.id;

            if (!requestId) {
                throw new Error("sendError");
            }

            // The original contact form remains unchanged.
            feedback.textContent = "";
            feedback.className = "contact__feedback";

            // Open the verification modal.
            openVerificationModal();

        } catch (error) {
            const messageKey =
                error instanceof TypeError
                    ? "networkError"
                    : "sendError";

            showFormMessage(messageKey, "error");

            submitButton.disabled = false;
        }
    });

    // ==========================================
    // STEP 2: VERIFY EMAIL
    // ==========================================

    async function verifyEmail() {
        const code = codeInput.value.trim();

        if (!/^\d{6}$/.test(code)) {
            showModalMessage("invalidCode", "error");
            return;
        }

        verifyButton.disabled = true;

        showModalMessage("verifying", "info");

        try {
            const response = await fetch(
                `${API_URL}/contact/verification/confirm`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        requestId: requestId,
                        code: code
                    })
                }
            );

            const data = await readResponse(response);

            if (!response.ok || !data.verified) {
                throw new Error("verifyError");
            }

            // ==================================
            // SUCCESS
            // ==================================

            modalTitle.textContent = translate("verified");

            modalDescription.textContent = "";

            modalFeedback.textContent = translate("verified");

            modalFeedback.className =
                "verification-modal__feedback verification-modal__feedback--success";

            codeInput.hidden = true;

            verificationModal.querySelector(
                ".verification-modal__label"
            ).hidden = true;

            verifyButton.hidden = true;

            verificationModal.querySelector(
                ".verification-modal__icon"
            ).innerHTML = '<i class="icon-check-circle"></i>';

            // Reset form after successful verification.
            form.reset();

            const submitButton = form.querySelector(
                'button[type="submit"]'
            );

            submitButton.disabled = false;

            requestId = null;

            // Close modal after displaying success.
            window.setTimeout(() => {
                closeVerificationModal();

                window.setTimeout(() => {
                    verificationModal.remove();
                    verificationModal = null;
                    modalTitle = null;
                    modalDescription = null;
                    codeInput = null;
                    verifyButton = null;
                    modalFeedback = null;
                }, 350);
            }, 2200);

        } catch (error) {
            const messageKey =
                error instanceof TypeError
                    ? "networkError"
                    : "verifyError";

            showModalMessage(messageKey, "error");

            verifyButton.disabled = false;
        }
    }

    // ==========================================
    // UPDATE TRANSLATIONS WHEN LANGUAGE CHANGES
    // ==========================================

    const languageObserver = new MutationObserver(() => {
        if (feedbackKey) {
            showFormMessage(feedbackKey);
        }

        updateModalTranslations();
    });

    languageObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"]
    });

});