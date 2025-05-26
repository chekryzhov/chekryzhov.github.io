const modal = document.querySelector('.modal_result');

const fadeIn = (el, timeout, display) => {
    el.style.opacity = 0;
    el.style.display = display || 'block';
    el.style.transition = `opacity ${timeout}ms`;
    setTimeout(() => {
        el.style.opacity = 1;
    }, 10);
};

const fadeOut = (el, timeout) => {
    el.style.opacity = 1;
    el.style.transition = `opacity ${timeout}ms`;
    el.style.opacity = 0;
    setTimeout(() => {
        el.style.display = 'none';
    }, timeout);
};

function questionnaireSubmit() {

    let P, z, age, x_16, x_33, x_58, x_66, x_sum_14, x_18, conclusion;

    age = document.querySelector('#age').value;
    x_16 = document.querySelector('#x_16').value.replace(',', ".");
    x_33 = document.querySelector('#x_33').value.replace(',', ".");
    x_58 = document.querySelector('#x_58').value.replace(',', ".");
    x_66 = document.querySelector('#x_66').value.replace(',', ".");
    x_sum_14 = document.querySelector('input[name="x_sum_14"]:checked').value;
    x_18 = document.querySelector('input[name="x_18"]:checked').value;

    z = -5.749 + 0.057 * age + 2.072 * x_sum_14 + 0.38 * x_16 + 0.243 * x_33 + 0.144 * x_58 - 0.4 * x_66;
    P = (1/(1 + Math.exp(-z))) * 100;
    
    if (x_18 == 1) {
        conclusion = "Требуется цитологическое исследование и кольпоскопия.";
    } else {
        if (P >= 12) {
            conclusion = "Требуется цитологическое исследование и кольпоскопия.";
        } else {
            conclusion = "Требуется повторное исследование через 12 месяцев.";
        }
    }

    let resultModal = document.querySelector(".recommendation__descr");
    resultModal.innerText = conclusion;

    document.querySelector(".result_pointer_wrap").style.left = P + '%';
    document.querySelector(".result_pointer_text").innerHTML = '<b>' + Math.round(P) + '%<b/>';

    let result_descr = document.querySelector(".result_descr");
    result_descr.innerHTML = 'Риск наличия HSIL <span class = "result__percent">' + Math.round(P) + '%</span>';
    if (x_18 == 1 && P < 12) {
        result_descr.innerHTML = 'Риск наличия HSIL <span class = "result__percent">' + Math.round(P) + '%</span>, особое условие – наличие ВПЧ 18 типа';
    }
    fadeIn(modal,500);
}

document
    .querySelector(".modal__btn-close")
    .addEventListener("click", () => fadeOut(modal,500));
document
    .querySelector(".close")
    .addEventListener("click", () => fadeOut(modal,500));

const modal_about = document.querySelector('.modal_about');
let about = document.querySelector("#about_project");

about.addEventListener("click", (e) => {
    e.preventDefault();
    fadeIn(modal_about, 500);
})

document
    .querySelector(".btn_close_about")
    .addEventListener("click", () => fadeOut(modal_about,500));
document
    .querySelector(".close_about")
    .addEventListener("click", () => fadeOut(modal_about,500));