document.addEventListener("DOMContentLoaded", () => {

    const faqItems = document.querySelectorAll(".faq__item");


    faqItems.forEach(item => {

        const button = item.querySelector(".faq__question");

        if (!button) {
            return;
        }


        button.addEventListener("click", () => {

            const isOpen =
                item.classList.contains("faq__item--open");


            // Cerramos todas
            faqItems.forEach(otherItem => {

                otherItem.classList.remove(
                    "faq__item--open"
                );


                const otherButton =
                    otherItem.querySelector(".faq__question");


                if (otherButton) {

                    otherButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            });


            // Si estaba cerrada, la abrimos
            if (!isOpen) {

                item.classList.add(
                    "faq__item--open"
                );


                button.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

        });

    });

});