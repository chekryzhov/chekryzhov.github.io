const first_step = document.querySelector(".first__step"), 
    second_step = document.querySelector(".second__step"),
    pacient = document.querySelector("#pacient"),
    modal = document.querySelector('.modal');

const today = document.querySelector('#today');
let date = new Date();
let output = String(date.getDate()).padStart(2, '0') + '.' + String(date.getMonth() + 1).padStart(2, '0') + '.' + date.getFullYear();
today.textContent = output;

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

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let name_p = getRandomIntInclusive(100,300);
let lastname = getRandomIntInclusive(100,300);
pacient.textContent = name_p + "" + lastname;

let conclusion = '';
let resultModal = document.getElementById("modal__body");

const age_input = document.querySelector('input[id="age"]');
age_input.addEventListener('change', function () {
    if (this.value > 17 || this.value < 0) {
        this.value = '';
        this.parentNode.querySelector('.descr').classList.add('descr_active');
    } else {
        this.parentNode.querySelector('.descr').classList.remove('descr_active');
    }
});

function FirstStepSubmit() {

    let age, orz;

    age = document.querySelector('input[id="age"]').value;
    orz = document.querySelector('input[id="orz"]').value;

    if (age && orz) {



        frequently_ill = 0;

        if (age <= 1 && orz >= 4) {frequently_ill = 1;} 
        if (age > 1 && age <= 3 && orz >= 6) {frequently_ill = 1;} 
        if (age >= 4 && age <= 5 && orz >= 5) {frequently_ill = 1;} 
        if (age >= 6 && orz >= 4) {frequently_ill = 1;}
        
        if (frequently_ill) {
            fadeOut(first_step, 500);
            setTimeout(fadeIn, 600, second_step, 500);
        } else {
            conclusion = 'Ребенок не является частоболеющим';
            resultModal.innerText = conclusion;
            fadeIn(modal,500);
        }
    } else {
        conclusion = 'Заполните все поля!';
        resultModal.innerText = conclusion;
        fadeIn(modal,500);
    }
}

function SecondStepSubmit() {
    let sum_ip4 = 0;
    let sum_ip9 = 0;

    let faringit = document.querySelector('input[name="Фарингит"]:checked');
    let mindalin = document.querySelector('input[name="Миндалины"]:checked');
    let limf = document.querySelector('input[name="Лимфоузлы"]:checked');
    let pechen = document.querySelector('input[name="Печень"]:checked');
    let selez = document.querySelector('input[name="Селезенка"]:checked');
    let adenoid = document.querySelector('input[name="Аденоиды"]:checked');

    if (adenoid) {
        sum_ip9 = Number(faringit.value) + Number(mindalin.value) + Number(limf.value) + Number(pechen.value) + Number(selez.value) + Number(adenoid.value);
    } else {
        sum_ip4 = Number(faringit.value) + Number(mindalin.value) + Number(limf.value) + Number(pechen.value) + Number(selez.value);
    }

    if (sum_ip4 > 3 || sum_ip9 > 4) {
        conclusion = "Ребенок является частоболеющим. Риск наличия активной герпесвирусной инфекции высокий, необходимо обследование на герпесвирусные инфекции (определение ДНК вирусов EBV, CMV, HHV-6 в крови методом ПЦР).";
    } 
    else conclusion = "Ребенок является частоболеющим. Риск наличия активной герпесвирусной инфекции низкий, дополнительное обследование пациента не требуется.";

    resultModal.innerText = conclusion;
    fadeIn(modal,500);
}

document
    .querySelector(".modal__btn-close")
    .addEventListener("click", () => fadeOut(modal,500));
document
    .querySelector(".close")
    .addEventListener("click", () => fadeOut(modal,500));
