//Очищаем блок от значений
function resetInputsInBlock(blockId) {
    // Находим блок по ID
    const block = document.getElementById(blockId);
    if (!block) {
        console.warn(`Элемент с id "${blockId}" не найден`);
        return;
    }

    // Все input внутри блока
    const inputs = block.querySelectorAll('input');

    inputs.forEach(input => {
        const type = input.type;

        // Обработка чекбоксов и радио
        if (type === 'checkbox' || type === 'radio') {
        // Если элемент был отмечен, снимаем отметку и генерируем событие change
        if (input.checked) {
            input.checked = false;
            // Создаём и диспатчим событие change, чтобы сработали обработчики
            const changeEvent = new Event('change', { bubbles: true });
            input.dispatchEvent(changeEvent);
        }
        } 
        // Для всех остальных типов (текстовые поля, number, email и т.д.) очищаем значение
        else {
        // Исключаем типы, у которых нет осмысленного "значения" или их не нужно трогать
        const noResetTypes = ['button', 'submit', 'reset', 'image', 'file', 'hidden'];
        if (!noResetTypes.includes(type)) {
            input.value = 0;
        }
        }
    });

    recount();
}

//Меняем местами блоки
function swapElements(el1, el2) {
    // Создаём временный узел, например, комментарий
    const temp = document.createComment('temp');

    // Шаг 1: заменяем el1 на временный узел
    el1.parentNode.replaceChild(temp, el1);

    // Шаг 2: заменяем el2 на el1
    el2.parentNode.replaceChild(el1, el2);

    // Шаг 3: заменяем временный узел на el2
    temp.parentNode.replaceChild(el2, temp);
}

//Проверка, что элемент стоит раньше второго
function isFirstBeforeSecond(el1, el2) {
    // Проверяем, что el1 и el2 — не один и тот же элемент
    if (el1 === el2) return false;

    const position = el1.compareDocumentPosition(el2);
    
    // Если el1 предшествует el2, возвращаем true
    return (position & Node.DOCUMENT_POSITION_PRECEDING) !== 0;
}

function formatWithSpaces(number) {
    // Округляем до нужного количества знаков, если необходимо
    return number.toLocaleString('ru-RU');  // для 1200000.55 → "1 200 000,55"
}

function parseInputToNumber(inputString) {
    // Удаляем все пробелы и любые нецифровые символы, кроме точки (или запятой)
    let cleaned = inputString.replace(/\s/g, '') // убираем пробелы
                            .replace(',', '.'); // если используется запятая как разделитель
    return parseFloat(cleaned);
}

function roundTwo(number) {
    // Округляем до нужного количества знаков, если необходимо
    return +number.toFixed(2);  // для 1200000.55 → "1 200 000,55"
}

function check_for_unknown_count_product (product_type, product_name) {
    let unknown_consumption = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="purchase"][data-name-indicator="unknown_consumption"]');

    let count_manipulation = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="count_manipulation"]');

    let count_product_one_manipulation = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="count_product_one_manipulation"]');

    let disinfection_unknown_count_product_block = document.querySelector('#' + product_type + '_' + product_name + '_disinfection_unknown_count_product_block');
    let washing_unknown_count_product_block = document.querySelector('#' + product_type + '_' + product_name + '_washing_unknown_count_product_block');

    let disinfection_unknown_count_product = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="unknown_count_product"]');

    let washing_unknown_count_product = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="unknown_count_product"]');

    if (unknown_consumption.checked && parseInputToNumber(count_manipulation.value) != 0 && parseInputToNumber(count_product_one_manipulation.value) != 0) {
        disinfection_unknown_count_product_block.classList.remove('hidden');
        disinfection_unknown_count_product_block.classList.add('active');
        washing_unknown_count_product_block.classList.remove('hidden');
        washing_unknown_count_product_block.classList.add('active');
    } else {
        disinfection_unknown_count_product_block.classList.remove('active');
        disinfection_unknown_count_product_block.classList.add('hidden');
        washing_unknown_count_product_block.classList.remove('active');
        washing_unknown_count_product_block.classList.add('hidden');

        disinfection_unknown_count_product.checked = false;
        washing_unknown_count_product.checked = false;
    }
}

//Стоимость часа работы 
const cost_hour_work_process = {
    'transportation': 651.25,
    'disinfection': 544.68,
    'waste_disinfection': 795.82,
    'washing': 544.68,
    'sterilization': 544.68,
    'repair': 544.68,
};

//Объем многоразового изделия
const volume_reusable_products = {
    'diapers': 2,
    'absorbent_diapers': 0.67,
    'pads': 0.7,
    'surgical_suits': 2.7,
    'patient_clothing': 2.6,
    'socks': 0.22,
    'underwear': 0.27,
    'cover_medical_equipment': 1,
    'apron': 0.8,
    'reusable_woven_shoe': 0.21,
    'robes': 2.4,
    'hats': 0.08,
    'masks': 0.5,
    'bed_sheets': 6.8,
    'mattress_covers': 8,
    'cleaning_wipes': 0.03,
};

//Объем пакетов
const volume_packets_process = {
    'transportation': 18
};

const cost_purchase_products = {
    "disposable" : {
        "non_sterialize" : {
            'diapers': 36.54,
            'absorbent_diapers': 33,
            'pads': 24.6,
            'surgical_suits': 286.07,
            'patient_clothing': 32,
            'socks': 3.04,
            'underwear': 48.6,
            'cover_medical_equipment': 71.01,
            'apron': 27.03,
            'non_woven_shoe': 7.55,
            'robes': 51.5,
            'hats': 3.38,
            'masks': 2.49,
            'bed_sheets': 202.46,
            'mattress_covers': 129.08,
            'cleaning_wipes': 3.42,
        },
        "sterialize" : {
            'diapers': 68.64,
            'absorbent_diapers': 46.06,
            'pads': 25.8,
            'surgical_suits': 402.97,
            'patient_clothing': 50.6,
            'socks': 67.13,
            'underwear': 72.4,
            'cover_medical_equipment': 259.88,
            'apron': 46.77,
            'non_woven_shoe': 27.72,
            'robes': 79.4,
            'hats': 15.2,
            'masks': 12.91,
            'bed_sheets': 466,
            'mattress_covers': 153,
            'cleaning_wipes': 17,
        }
    },
    "reusable" : {
        'diapers': 92,
        'absorbent_diapers': 1300,
        'pads': 76.12,
        'surgical_suits': 1383.33,
        'patient_clothing': 651.67,
        'socks': 57.33,
        'underwear': 456.6,
        'cover_medical_equipment': 3900,
        'apron': 880,
        'reusable_woven_shoe': 170,
        'robes': 2150,
        'hats': 215,
        'masks': 44.8,
        'bed_sheets': 1406.33,
        'mattress_covers': 2000,
        'cleaning_wipes': 16.03,
    },
}

const weight_purchase_products = {
    "disposable" : {
        "non_sterialize" : {
            'diapers': 0.056,
            'absorbent_diapers': 0.05,
            'pads': 0.023,
            'surgical_suits': 0.105,
            'patient_clothing': 0.11,
            'socks': 0.0036,
            'underwear': 0.02,
            'cover_medical_equipment': 0,
            'apron': 0.042,
            'non_woven_shoe': 0.004,
            'robes': 0.04,
            'hats': 0.004,
            'masks': 0.0025,
            'bed_sheets': 0.249,
            'mattress_covers': 0.079,
            'cleaning_wipes': 0.0042,
        },
        "sterialize" : {
            'diapers': 0.15,
            'absorbent_diapers': 0.04,
            'pads': 0.02,
            'surgical_suits': 0.105,
            'patient_clothing': 0.11,
            'socks': 0.016,
            'underwear': 0.016,
            'cover_medical_equipment': 0.090,
            'apron': 0.045,
            'non_woven_shoe': 0.004,
            'robes': 0.095,
            'hats': 0.01,
            'masks': 0.0035,
            'bed_sheets': 0.235,
            'mattress_covers': 0.085,
            'cleaning_wipes': 0.0048,
        }
    },
    "reusable" : {
        'diapers': 0.3,
        'absorbent_diapers': 0.37,
        'pads': 0.22,
        'surgical_suits': 0.4,
        'patient_clothing': 0.33,
        'socks': 0.04,
        'underwear': 0.12,
        'cover_medical_equipment': 0.45,
        'apron': 0.2,
        'non_woven_shoe': 0.06,
        'robes': 0.36,
        'hats': 0.05,
        'masks': 0.003,
        'bed_sheets': 0.95,
        'mattress_covers': 0.74,
        'cleaning_wipes': 0.0024,
    },
}

let dropdown__groups = document.querySelectorAll('.dropdown__group');

//Взаимодействие с выбором типа расчета
const calc_types = document.querySelectorAll('input[name="type_calculation"]');
const calc_type_sections = document.querySelectorAll('.type_calculation_form');

calc_types.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.checked) {
            const selectedValue = this.value;       // Полный текст
            const selectedKey = this.dataset.nameTypeCalculation; // Короткий ключ (actual_cost, switching_cost, manipulations_cost)
            let selected_calc_section;

            calc_type_sections.forEach(section => {
                resetInputsInBlock(section.id);
                section.classList.remove('type_calculation_form_active');
                section.classList.add('type_calculation_form_hidden');
            });

            let dg = document.querySelector('#disposable_group');
            let rg = document.querySelector('#reusable_group');
            if (selectedKey == "switching_cost") {
                selected_calc_section = document.querySelector('#switching_cost_form');

                if (!isFirstBeforeSecond(dg, rg)) {
                    swapElements(dg, rg);
                }
            } else {
                selected_calc_section = document.querySelector('#actual_manipulation_cost_form');

                if (!isFirstBeforeSecond(rg, dg)) {
                    swapElements(rg, dg);
                }
            }

            selected_calc_section.classList.remove('type_calculation_form_hidden');
            selected_calc_section.classList.add('type_calculation_form_active');
        }
    });
});

//
document.addEventListener('click', function(e) {
    // Находим элемент заголовка, по которому кликнули (или внутри которого кликнули)
    const header = e.target.closest('.dropdown__group__item');
    if (!header) return; // если клик не по заголовку или его дочерним элементам, ничего не делаем

    // Находим родительскую группу (весь блок)
    const group = header.closest('.dropdown__group');
    if (!group) return;

    // Ищем блок с контентом и иконку внутри этой группы
    const content = group.querySelector('.dropdown__content');
    const icon = group.querySelector('.drop_img_group');

    if (content && icon) {
        // Переключаем классы и меняем иконку
        if (content.classList.contains('dropdown__content_active')) {
            header.classList.remove('dropdown__group__item_active');
            content.classList.remove('dropdown__content_active');
            icon.src = 'img/plus.svg';
        } else {
            header.classList.add('dropdown__group__item_active');
            content.classList.add('dropdown__content_active');
            icon.src = 'img/minus.svg';
        }
    }

    //Взаимодействие с инпутами
    const form_inputs = group.querySelectorAll('.form__input');
    form_inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (this.value === '0') {
                this.value = '';
            }
        });

        input.addEventListener('blur', function() {
            if (this.value.trim() === '') this.value = '0';
        });

    });

    // Проверяем, что клик был по чекбоксу внутри нужного контейнера
    const processCheckbox = e.target.closest('.dropdown__group__product .process__name');
    if (!processCheckbox || processCheckbox.type !== 'checkbox') return;

    // Находим родительский элемент .process и слайдер внутри него
    const processDiv = processCheckbox.closest('.process');
    if (!processDiv) return;
    const slider = processDiv.querySelector('.slider');
    if (!slider) return;

    // Получаем данные из атрибутов
    const type_name = processCheckbox.dataset.nameType;
    const product_name = processCheckbox.dataset.nameProduct;
    const process_name = processCheckbox.dataset.nameProcess;

    // Ищем соответствующий блок контента по id (сформированному из атрибутов)
    const processForm = document.getElementById(`${type_name}_${product_name}_${process_name}`);
    if (!processForm) return;

    if (processCheckbox.checked) {
        slider.classList.remove('disabled__slider');
        processForm.classList.remove('form__block_hidden');
        processForm.classList.add('form__block_active');
    } else {
        slider.classList.add('disabled__slider');
        processForm.classList.remove('form__block_active');
        processForm.classList.add('form__block_hidden');
    }


});

//Открытие списка изделий
let type_products = document.querySelectorAll('input[name="type_product"]');

type_products.forEach(type_product => {
    type_product.addEventListener('change', function(event) {
        let type = type_product.getAttribute("data-name-type");
        let type_form = document.querySelector("#" + type + "_form");
        let type_group = document.querySelector("#" + type + "_group");
        if (event.target.checked) {
            type_form.classList.remove('form__item_hidden');
            type_form.classList.add('form__item_active');

            type_group.classList.remove('dropdown__group_hidden');
            type_group.classList.add('dropdown__group_active');
        } else {
            type_form.classList.remove('form__item_active');
            type_form.classList.add('form__item_hidden');

            resetInputsInBlock(type + "_group");

            type_group.classList.remove('dropdown__group_active');
            type_group.classList.add('dropdown__group_hidden');
        }
    });
});

//Константы
const price_medosmotr = 2000; //Средняя стоимость периодического медосмотра, руб
const one_load_obezzaraz = 4; //Одна загрузка обеззараживания многоразовых изделий, кг
const time_on_load_and_unload_obezzaraz = 0.5; //Время, затрачиваемое на загрузку и выгрузку многоразовых изделий на 1 цикл обеззараживания, ч
const time_on_load_and_unload_clean = 0.5; //Время, затрачиваемое на загрузку и выгрузку многоразовых изделий на 1 цикл стирки, ч
const time_on_load_and_unload_waste = 1; //Время, затрачиваемое на загрузку, выгрузку отходов в 1 цикл обеззараживания, ч
const time_on_load_and_unload_sterilize = 0.5; //Время, затрачиваемое на загрузку, выгрузку изделий на 1 цикл стерилизации, ч


document.addEventListener('change', function(e) {
    if (e.target.matches('.form__input')) {
        recount();
    }

    if (e.target.matches('input[data-name-type="reusable"][data-name-process="main"][data-name-indicator="count_manipulation"]')) {
        let inp = e.target.closest('input[data-name-type="reusable"][data-name-process="main"][data-name-indicator="count_manipulation"]');
        let product_type = inp.dataset.nameType;
        let product_name = inp.dataset.nameProduct;

        check_for_unknown_count_product(product_type, product_name);
    }

    if (e.target.matches('input[data-name-type="reusable"][data-name-process="main"][data-name-indicator="count_product_one_manipulation"]')) {
        let inp = e.target.closest('input[data-name-type="reusable"][data-name-process="main"][data-name-indicator="count_product_one_manipulation"]');
        let product_type = inp.dataset.nameType;
        let product_name = inp.dataset.nameProduct;

        check_for_unknown_count_product(product_type, product_name);
    }

    //Если вводим налог, то стоимость аренды недоступна и наоборот
    if (e.target.matches('input[data-name-process="storage"][data-name-indicator="rent"]')) {
        let inp_rent = e.target.closest('input[data-name-process="storage"][data-name-indicator="rent"]');
        let product_type = inp_rent.dataset.nameType;
        let product_name = inp_rent.dataset.nameProduct;

        let inp_tax = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="storage"][data-name-indicator="tax"]');
        
        if (inp_rent.value != 0 && inp_rent.value != '') {
            inp_tax.disabled = true;
            inp_tax.value = 0;
            inp_tax.placeholder = '';
            inp_tax.classList.add('form__input_formula');
        } else {
            inp_tax.disabled = false;
            inp_tax.value = 0;
            inp_tax.placeholder = 'Введите значение';
            inp_tax.classList.remove('form__input_formula');
        }
    }
    
    if (e.target.matches('input[data-name-process="storage"][data-name-indicator="tax"]')) {
        let inp_tax = e.target.closest('input[data-name-process="storage"][data-name-indicator="tax"]');
        let product_type = inp_tax.dataset.nameType;
        let product_name = inp_tax.dataset.nameProduct;

        let inp_rent = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="storage"][data-name-indicator="rent"]');
        
        if (inp_tax.value != 0 && inp_tax.value != '') {
            inp_rent.disabled = true;
            inp_rent.value = 0;
            inp_rent.placeholder = '';
            inp_rent.classList.add('form__input_formula');
        } else {
            inp_rent.disabled = false;
            inp_rent.value = 0;
            inp_rent.placeholder = 'Введите значение';
            inp_rent.classList.remove('form__input_formula');
        }
    }

    //Выбор класс отходов
    if (e.target.matches('input[data-name-process="waste_disinfection"][data-name-indicator="waste_class"]')) {
        let choose_waste_class = e.target.closest('input[data-name-process="waste_disinfection"][data-name-indicator="waste_class"]');

        let product_type = choose_waste_class.dataset.nameType;
        let product_name = choose_waste_class.dataset.nameProduct;
        let waste_class = choose_waste_class.value;
        
        let waste_class_group = document.querySelector('#' + product_type + '_' + product_name + '_waste_class_' + waste_class + '_group');

        if (choose_waste_class.checked) {
            waste_class_group.classList.remove('dropdown__group_hidden');
            waste_class_group.classList.add('dropdown__group_active');
            waste_class_group.querySelector('.dropdown__group__item').click();

        } else {
            resetInputsInBlock(product_type + '_' + product_name + '_waste_class_' + waste_class + '_group');
            waste_class_group.querySelector('.dropdown__group__item').click();
            waste_class_group.classList.remove('dropdown__group_active');
            waste_class_group.classList.add('dropdown__group_hidden');
        }

        let change_classes = [];
        let choose_waste_classes = document.querySelectorAll('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="waste_class"]:checked');
        choose_waste_classes.forEach(waste_class => {
            change_classes.push(waste_class.value);
        });

        if ((change_classes.includes('A') && !change_classes.includes('B') && !change_classes.includes('C')) || change_classes.length == 0) {
            document.querySelector('#' + product_type + '_' + product_name + '_form_for_classes_B_C').classList.remove('active');
        } else {
            document.querySelector('#' + product_type + '_' + product_name + '_form_for_classes_B_C').classList.add('active');
        }

        recount();
    }

    //Выбор метода обеззараживания
    if (e.target.matches('input[data-name-process="waste_disinfection"][data-name-indicator="disinfection_method"]')) {
        let choose_waste_method = e.target.closest('input[data-name-process="waste_disinfection"][data-name-indicator="disinfection_method"]');

        let product_type = choose_waste_method.dataset.nameType;
        let product_name = choose_waste_method.dataset.nameProduct;
        let method = choose_waste_method.value;
        
        let method_form_block_id = product_type + '_' + product_name + '_waste_disinfection_form_for_' + method + '_method';
        let method_form_block = document.querySelector('#' + method_form_block_id);

        if (choose_waste_method.checked) {
            method_form_block.classList.add('active');

        } else {
            resetInputsInBlock(method_form_block_id);
            method_form_block.classList.remove('active');
        }

        recount();
    }

    //Выбор Видоизменяете
    if (e.target.matches('input[data-name-process="waste_disinfection"][data-name-indicator="modify_waste"]')) {
        let modify_waste = e.target.closest('input[data-name-process="waste_disinfection"][data-name-indicator="modify_waste"]');

        let product_type = modify_waste.dataset.nameType;
        let product_name = modify_waste.dataset.nameProduct;
        let modify = modify_waste.value;

        let modify_waste_form_block_id = product_type + '_' + product_name + '_waste_disinfection_modify_waste';
        let modify_waste_form_block = document.querySelector('#' + modify_waste_form_block_id);

        let modify_waste_equipment_form_block_id = product_type + '_' + product_name + '_waste_disinfection_modify_waste_equipment';
        let modify_waste_equipment_form_block = document.querySelector('#' + modify_waste_equipment_form_block_id);

        if (modify == '1') {
            modify_waste_form_block.classList.add('active');
        } else {
            resetInputsInBlock(modify_waste_form_block_id);
            modify_waste_form_block.classList.remove('active');
            modify_waste_equipment_form_block.classList.remove('active');
        }

        recount();
    }

    //Выбор оборудования
    if (e.target.matches('input[data-name-process="waste_disinfection"][data-name-indicator="modify_waste_equipment"]')) {
        let modify_waste_equipment = e.target.closest('input[data-name-process="waste_disinfection"][data-name-indicator="modify_waste_equipment"]');

        let product_type = modify_waste_equipment.dataset.nameType;
        let product_name = modify_waste_equipment.dataset.nameProduct;
        let modify_equipment = modify_waste_equipment.value;

        let modify_waste_equipment_form_block_id = product_type + '_' + product_name + '_waste_disinfection_modify_waste_equipment';
        let modify_waste_equipment_form_block = document.querySelector('#' + modify_waste_equipment_form_block_id);

        if (modify_equipment == '1') {
            modify_waste_equipment_form_block.classList.add('active');
        } else {
            resetInputsInBlock(modify_waste_equipment_form_block_id);            
            modify_waste_equipment_form_block.classList.remove('active');
        }

        recount();
    }

    //Если вводим кол-во часов
    if (e.target.matches('input[data-name-process="waste_disinfection"][data-name-indicator="hours_known"]')) {
        let inp_hour_known = e.target.closest('input[data-name-process="waste_disinfection"][data-name-indicator="hours_known"]');
        let product_type = inp_hour_known.dataset.nameType;
        let product_name = inp_hour_known.dataset.nameProduct;
        let method = inp_hour_known.dataset.nameDisinfectionMethod;

        let inp_hours_approximate = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="hours_approximate"][data-name-disinfection-method="' + method + '"]');

        let inp_time_disinfection_one_load = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="time_disinfection_one_load"][data-name-disinfection-method="' + method + '"]');

        let inp_unknown_time_disinfection_one_load = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="unknown_time_disinfection_one_load"][data-name-disinfection-method="' + method + '"]');
        
        if (inp_hour_known.value != 0 && inp_hour_known.value != '') {
            inp_hours_approximate.disabled = true;
            inp_hours_approximate.value = '';
            inp_hours_approximate.placeholder = '';

            inp_time_disinfection_one_load.disabled = true;
            inp_time_disinfection_one_load.value = '';
            inp_time_disinfection_one_load.placeholder = '';
            inp_time_disinfection_one_load.classList.add('form__input_formula');

            if (inp_unknown_time_disinfection_one_load) {
                inp_unknown_time_disinfection_one_load.disabled = true;
                inp_unknown_time_disinfection_one_load.checked = false;
            }
        } else {
            inp_hours_approximate.value = 0;
            inp_hours_approximate.placeholder = 'Введите значение';

            inp_time_disinfection_one_load.disabled = false;
            inp_time_disinfection_one_load.value = 0;
            inp_time_disinfection_one_load.placeholder = 'Введите значение';
            inp_time_disinfection_one_load.classList.remove('form__input_formula');

            if (inp_unknown_time_disinfection_one_load) {
                inp_unknown_time_disinfection_one_load.disabled = false;
            }
        }
    }

    //Если вводим кол-во часов
    if (e.target.matches('input[data-name-indicator="count_hours"]')) {
        let inp_count_hours = e.target.closest('input[data-name-indicator="count_hours"]');
        let product_type = inp_count_hours.dataset.nameType;
        let product_name = inp_count_hours.dataset.nameProduct;
        let process_name = inp_count_hours.dataset.nameProcess;

        let approximate_count_hours = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="approximate_count_hours"]');

        let inp_var_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="var_cost"]');

        let inp_unknown_var_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="unknown_var_cost"]');
        
        if (inp_count_hours.value != 0 && inp_count_hours.value != '') {
            approximate_count_hours.disabled = true;
            approximate_count_hours.value = '';
            approximate_count_hours.placeholder = '';

            if (inp_var_cost) {
                inp_var_cost.disabled = true;
                inp_var_cost.value = '';
                inp_var_cost.placeholder = '';
                inp_var_cost.classList.add('form__input_formula');
            }

            if (inp_unknown_var_cost) {
                inp_unknown_var_cost.disabled = true;
                inp_unknown_var_cost.checked = false;
            }
        } else {
            approximate_count_hours.value = 0;
            approximate_count_hours.placeholder = 'Введите значение';

            if (inp_var_cost) {
                inp_var_cost.disabled = false;
                inp_var_cost.value = 0;
                inp_var_cost.placeholder = 'Введите значение';
                inp_var_cost.classList.remove('form__input_formula');
            }

            if (inp_unknown_var_cost) {
                inp_unknown_var_cost.disabled = false;
            }
        }
    }

    //Выбор вида оборота для многоразовых
    if (e.target.matches('input[data-name-process="main"][data-name-indicator="type_oborot"]')) {
        let type_oborot = e.target.closest('input[data-name-process="main"][data-name-indicator="type_oborot"]');

        let product_type = type_oborot.dataset.nameType;
        let product_name = type_oborot.dataset.nameProduct;
        let oborot = type_oborot.value;
        let oborot_close;

        if (oborot == 'rent') {
            oborot_close = 'purchase';
        } else {
            oborot_close = 'rent';
        }

        let oborot_form_block_id = product_type + '_' + product_name + '_' + oborot + '_form_block';
        let oborot_form_block = document.querySelector('#' + oborot_form_block_id);

        let oborot_close_form_block_id = product_type + '_' + product_name + '_' + oborot_close + '_form_block';
        let oborot_close_form_block = document.querySelector('#' + oborot_close_form_block_id);

        if (type_oborot.checked) {
            oborot_form_block.classList.remove('form__block_hidden');
            oborot_form_block.classList.add('form__block_active');

            resetInputsInBlock(oborot_close_form_block_id);            
            oborot_close_form_block.classList.remove('form__block_active');
            oborot_close_form_block.classList.add('form__block_hidden');
        } else {
            resetInputsInBlock(oborot_form_block_id);            
            oborot_form_block.classList.remove('form__block_active');
            oborot_form_block.classList.add('form__block_hidden');
        }
    }

    //Выбор использования изделий для транспортировки
    if (e.target.matches('input[data-name-process="transportation"][data-name-indicator="use_packet"]')) {
        let use_packet_input = e.target.closest('input[data-name-process="transportation"][data-name-indicator="use_packet"]');

        let product_type = use_packet_input.dataset.nameType;
        let product_name = use_packet_input.dataset.nameProduct;
        let use_packet = use_packet_input.value;

        let use_packet_form_block_id = product_type + '_' + product_name + '_transportation_use_packet_form_block';
        let use_packet_form_block = document.querySelector('#' + use_packet_form_block_id);

        if (use_packet == 'y') {
            use_packet_form_block.classList.add('active');
        } else {
            resetInputsInBlock(use_packet_form_block_id);            
            use_packet_form_block.classList.remove('active');
        }
    }

    //Отсутствует информация по кол-ву пакетов для транспортировки
    if (e.target.matches('input[data-name-process="transportation"][data-name-indicator="unknown_count_packet"]')) {
        let unknown_count_packet_input = e.target.closest('input[data-name-process="transportation"][data-name-indicator="unknown_count_packet"]');

        let product_type = unknown_count_packet_input.dataset.nameType;
        let product_name = unknown_count_packet_input.dataset.nameProduct;
        let unknown_count_packet = unknown_count_packet_input.value;

        let unknown_count_packet_form_block_id = product_type + '_' + product_name + '_transportation_unknown_count_packet_form_block';
        let unknown_count_packet_form_block = document.querySelector('#' + unknown_count_packet_form_block_id);

        if (unknown_count_packet_input.checked) {
            unknown_count_packet_form_block.classList.add('active');
        } else {
            resetInputsInBlock(unknown_count_packet_form_block_id);            
            unknown_count_packet_form_block.classList.remove('active');
        }
    }

    //Выбор Обеззараживание собственными силами
    if (e.target.matches('input[data-name-process="disinfection"][data-name-indicator="disinfection_self"]')) {
        let disinfection_self_input = e.target.closest('input[data-name-process="disinfection"][data-name-indicator="disinfection_self"]');

        let product_type = disinfection_self_input.dataset.nameType;
        let product_name = disinfection_self_input.dataset.nameProduct;
        let disinfection_self = disinfection_self_input.value;

        let disinfection_self_form_block_id = product_type + '_' + product_name + '_disinfection_disinfection_self_form_block';
        let disinfection_self_form_block = document.querySelector('#' + disinfection_self_form_block_id);

        if (disinfection_self == 'y') {
            disinfection_self_form_block.classList.add('active');
        } else {
            resetInputsInBlock(disinfection_self_form_block_id);            
            disinfection_self_form_block.classList.remove('active');
        }

        recount();
    }

    //Выбор Имеете ли Вы информацию об используемом дезсредстве
    if (e.target.matches('input[data-name-process="disinfection"][data-name-indicator="info_disinfectant"]')) {
        let info_disinfectant_input = e.target.closest('input[data-name-process="disinfection"][data-name-indicator="info_disinfectant"]');

        let product_type = info_disinfectant_input.dataset.nameType;
        let product_name = info_disinfectant_input.dataset.nameProduct;
        let info_disinfectant = info_disinfectant_input.value;

        let volume_disinfectant = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="volume_disinfectant"]');
        let cost_disinfectant = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="cost_disinfectant"]');
        let consumption_disinfectant = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="consumption_disinfectant"]');
        let count_product_one_load = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="count_product_one_load"]');

        if (info_disinfectant == 'y') {
            volume_disinfectant.value = 0;
            cost_disinfectant.value = 0;
            consumption_disinfectant.value = 0;
            count_product_one_load.value = 0;
        } else {
            volume_disinfectant.value = 1;
            cost_disinfectant.value = 468.75;
            consumption_disinfectant.value = 0.4;
            count_product_one_load.value = 4;
        }   

        recount();
    }

    //Выбор Имеете ли Вы информацию об используемом дезсредстве
    if (e.target.matches('input[data-name-process="waste_disinfection"][data-name-indicator="info_disinfectant"]')) {
        let info_disinfectant_input = e.target.closest('input[data-name-process="waste_disinfection"][data-name-indicator="info_disinfectant"]');

        let product_type = info_disinfectant_input.dataset.nameType;
        let product_name = info_disinfectant_input.dataset.nameProduct;
        let info_disinfectant = info_disinfectant_input.value;

        let volume_disinfectant = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="disinfectant_volume"]');
        let cost_disinfectant = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="disinfectant_cost_per_unit"]');
        let consumption_disinfectant = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="disinfectant_consumption_per_load"]');
        let count_product_one_load = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="items_per_load"]');

        if (info_disinfectant == 'y') {
            volume_disinfectant.value = 0;
            cost_disinfectant.value = 0;
            consumption_disinfectant.value = 0;
            count_product_one_load.value = 0;
        } else {
            volume_disinfectant.value = 1;
            cost_disinfectant.value = 468.75;
            consumption_disinfectant.value = 0.4;
            count_product_one_load.value = 4;
        }   

        recount();
    }

    //Выбор Обеззараживание в сторонней организации
    if (e.target.matches('input[data-name-process="disinfection"][data-name-indicator="disinfection_contract"]')) {
        let disinfection_contract_input = e.target.closest('input[data-name-process="disinfection"][data-name-indicator="disinfection_contract"]');

        let product_type = disinfection_contract_input.dataset.nameType;
        let product_name = disinfection_contract_input.dataset.nameProduct;
        let disinfection_contract = disinfection_contract_input.value;

        let disinfection_contract_form_block_id = product_type + '_' + product_name + '_disinfection_disinfection_contract_form_block';
        let disinfection_contract_form_block = document.querySelector('#' + disinfection_contract_form_block_id);

        if (disinfection_contract == 'y') {
            disinfection_contract_form_block.classList.add('active');
        } else {
            resetInputsInBlock(disinfection_contract_form_block_id);            
            disinfection_contract_form_block.classList.remove('active');
        }

        recount();
    }

    //Выбор Стирка собственными силами
    if (e.target.matches('input[data-name-process="washing"][data-name-indicator="washing_self"]')) {
        let washing_self_input = e.target.closest('input[data-name-process="washing"][data-name-indicator="washing_self"]');

        let product_type = washing_self_input.dataset.nameType;
        let product_name = washing_self_input.dataset.nameProduct;
        let washing_self = washing_self_input.value;

        let washing_self_form_block_id = product_type + '_' + product_name + '_washing_washing_self_form_block';
        let washing_self_form_block = document.querySelector('#' + washing_self_form_block_id);

        if (washing_self == 'y') {
            washing_self_form_block.classList.add('active');
        } else {
            resetInputsInBlock(washing_self_form_block_id);            
            washing_self_form_block.classList.remove('active');
        }

        recount();
    }

    //Выбор Имеете ли Вы информацию об используемом дезсредстве
    if (e.target.matches('input[data-name-process="washing"][data-name-indicator="info_washing"]')) {
        let info_washing_input = e.target.closest('input[data-name-process="washing"][data-name-indicator="info_washing"]');

        let product_type = info_washing_input.dataset.nameType;
        let product_name = info_washing_input.dataset.nameProduct;
        let info_washing = info_washing_input.value;

        let volume_detergent = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="volume_detergent"]');
        let cost_detergent = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="cost_detergent"]');
        let consumption_detergent_per_load = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="consumption_detergent_per_load"]');

        if (info_washing == 'y') {
            volume_detergent.value = 0;
            cost_detergent.value = 0;
            consumption_detergent_per_load.value = 0;
        } else {
            volume_detergent.value = 15;
            cost_detergent.value = 2193.21;
            consumption_detergent_per_load.value = 0.25;
        }   

        recount();
    }

    //Выбор Обеззараживание в сторонней организации
    if (e.target.matches('input[data-name-process="washing"][data-name-indicator="washing_contract"]')) {
        let washing_contract_input = e.target.closest('input[data-name-process="washing"][data-name-indicator="washing_contract"]');

        let product_type = washing_contract_input.dataset.nameType;
        let product_name = washing_contract_input.dataset.nameProduct;
        let washing_contract = washing_contract_input.value;

        let washing_contract_form_block_id = product_type + '_' + product_name + '_washing_washing_contract_form_block';
        let washing_contract_form_block = document.querySelector('#' + washing_contract_form_block_id);

        if (washing_contract == 'y') {
            washing_contract_form_block.classList.add('active');
        } else {
            resetInputsInBlock(washing_contract_form_block_id);            
            washing_contract_form_block.classList.remove('active');
        }

        recount();
    }
    
    //Отсутствие информации стоимости и веса
    if (e.target.matches('input[data-name-process="purchase"][data-name-indicator="unknown_cost_weight"]')) {
        let info_input = e.target.closest('input[data-name-process="purchase"][data-name-indicator="unknown_cost_weight"]');

        let product_type = info_input.dataset.nameType;
        let product_name = info_input.dataset.nameProduct;

        let info_form_block_id = product_type + '_' + product_name + '_purchase_unknown_cost_form_block';
        let info_form_block = document.querySelector('#' + info_form_block_id);

        let cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="purchase"][data-name-indicator="cost"]');
        let weight = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="purchase"][data-name-indicator="weight"]');

        if (info_input.checked) {
            info_form_block.classList.add('active');
            cost.disabled = true;
            cost.classList.add('form__input_formula');
            weight.disabled = true;
            weight.classList.add('form__input_formula');
        } else {
            resetInputsInBlock(info_form_block_id);            
            info_form_block.classList.remove('active');
            cost.disabled = false;
            cost.classList.remove('form__input_formula');
            weight.disabled = false;
            weight.classList.remove('form__input_formula');
            cost.value = 0;
            weight.value = 0;
        }  

        recount();
    }

    //Указали иформацию об оборудовании в другом изделии
    if (e.target.matches('input[data-name-indicator="indicated_equipment"]')) {
        let info_input = e.target.closest('input[data-name-indicator="indicated_equipment"]');

        let product_type = info_input.dataset.nameType;
        let process_name = info_input.dataset.nameProcess;
        let product_name = info_input.dataset.nameProduct;

        let modify = info_input.dataset.modifyEquipment;
        let modify_selector = '';

        if (modify == 'y') {
            modify_selector = 'modification_';
        }
        
        let info_form_block_id = product_type + '_' + product_name + '_' + process_name + '_indicated_' + modify_selector + 'equipment_form_block';
        let info_form_block = document.querySelector('#' + info_form_block_id);

        let equipment_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="' + modify_selector + 'equipment_cost"]');
        let equipment_lifetime = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="' + modify_selector + 'equipment_lifetime"]');

        if (info_input.checked) {
            info_form_block.classList.add('active');
            equipment_cost.disabled = true;
            equipment_cost.classList.add('form__input_formula');
            equipment_lifetime.disabled = true;
            equipment_lifetime.classList.add('form__input_formula');
        } else {
            resetInputsInBlock(info_form_block_id);            
            info_form_block.classList.remove('active');
            equipment_cost.disabled = false;
            equipment_cost.classList.remove('form__input_formula');
            equipment_lifetime.disabled = false;
            equipment_lifetime.classList.remove('form__input_formula');
            equipment_cost.value = 0;
            equipment_lifetime.value = 0;
        }  

        recount();
    }

    //Указали иформацию об оборудовании в другом изделии
    if (e.target.matches('select[data-name-indicator="equipment_product"]')) {
        let info_input = e.target.closest('select[data-name-indicator="equipment_product"]');

        let product_type = info_input.dataset.nameType;
        let process_name = info_input.dataset.nameProcess;
        let product_name = info_input.dataset.nameProduct;

        let modify = info_input.dataset.modifyEquipment;
        let modify_selector = '';

        if (modify == 'y') {
            modify_selector = 'modification_';
        }

        let equipment_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="' + modify_selector + 'equipment_cost"]');
        let equipment_lifetime = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="' + modify_selector + 'equipment_lifetime"]');

        let choose_product = info_input.value;

        choose_product = choose_product.replace('temp_product', 'diapers');

        let equipment_cost_choose_product = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + choose_product + '"][data-name-process="' + process_name + '"][data-name-indicator="' + modify_selector + 'equipment_cost"]');
        let equipment_lifetime_choose_product = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + choose_product + '"][data-name-process="' + process_name + '"][data-name-indicator="' + modify_selector + 'equipment_lifetime"]');

        if (equipment_cost_choose_product && equipment_lifetime_choose_product) {
            equipment_cost.value = equipment_cost_choose_product.value;
            equipment_lifetime.value = equipment_lifetime_choose_product.value;
        } else {
            equipment_cost.value = 0;
            equipment_lifetime.value = 0;
        }

        recount();
    }

    //Выбор стерильный или нет
    if (e.target.matches('input[data-name-process="purchase"][data-name-indicator="kind_product"]')) {
        let kind_product_input = e.target.closest('input[data-name-process="purchase"][data-name-indicator="kind_product"]');

        let product_type = kind_product_input.dataset.nameType;
        let product_name = kind_product_input.dataset.nameProduct;
        let kind_product = kind_product_input.value;

        let cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="purchase"][data-name-indicator="cost"]');
        let weight = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="purchase"][data-name-indicator="weight"]');

        cost.value = cost_purchase_products[product_type][kind_product][product_name];
        weight.value = weight_purchase_products[product_type][kind_product][product_name];

        recount();
    }

    //Отсутствие информации расхода
    if (e.target.matches('input[data-name-type="disposable"][data-name-process="purchase"][data-name-indicator="unknown_consumption"]')) {
        let info_input = e.target.closest('input[data-name-type="disposable"][data-name-process="purchase"][data-name-indicator="unknown_consumption"]');

        let product_type = info_input.dataset.nameType;
        let product_name = info_input.dataset.nameProduct;

        let consumption = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="purchase"][data-name-indicator="consumption"]');

        if (info_input.checked) {
            consumption.value = parseInputToNumber(document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="count_product"]').value);
            consumption.disabled = true;
            consumption.classList.add('form__input_formula');
        } else {
            consumption.value = 0;
            consumption.disabled = false;
            consumption.classList.remove('form__input_formula');
        }  

        check_for_unknown_count_product(product_type, product_name);

        recount();
    }

    //Отсутствие информации Время, затрачиваемое на проведение обеззараживания
    if (e.target.matches('input[data-name-type="disposable"][data-name-process="waste_disinfection"][data-name-indicator="unknown_time_disinfection_one_load"]')) {
        let info_input = e.target.closest('input[data-name-type="disposable"][data-name-process="waste_disinfection"][data-name-indicator="unknown_time_disinfection_one_load"]');

        let product_type = info_input.dataset.nameType;
        let product_name = info_input.dataset.nameProduct;

        let time_disinfection_one_load = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="time_disinfection_one_load"][data-name-disinfection-method="chemical"]');

        if (info_input.checked) {
            time_disinfection_one_load.value = 0.5;
            time_disinfection_one_load.disabled = true;
            time_disinfection_one_load.classList.add('form__input_formula');
        } else {
            time_disinfection_one_load.value = 0;
            time_disinfection_one_load.disabled = false;
            time_disinfection_one_load.classList.remove('form__input_formula');
        }  

        recount();
    }

    //Отсутствие информации стоимости часа сотрудника
    if (e.target.matches('input[data-name-indicator="unknown_cost_hour"]')) {
        let info_input = e.target.closest('input[data-name-indicator="unknown_cost_hour"]');

        let product_type = info_input.dataset.nameType;
        let product_name = info_input.dataset.nameProduct;
        let process_name = info_input.dataset.nameProcess;

        let cost_hour = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="cost_hour"]');

        if (info_input.checked) {
            cost_hour.value = cost_hour_work_process[process_name];
            cost_hour.disabled = true;
            cost_hour.classList.add('form__input_formula');
        } else {
            cost_hour.value = 0;
            cost_hour.disabled = false;
            cost_hour.classList.remove('form__input_formula');
        }  

        recount();
    }

    //Отсутствие информации Количество изделий в 1 загрузку (в кг или куб. м)
    if (e.target.matches('input[data-name-type="reusable"][data-name-process="disinfection"][data-name-indicator="unknown_count_product_one_load"]')) {
        let info_input = e.target.closest('input[data-name-type="reusable"][data-name-process="disinfection"][data-name-indicator="unknown_count_product_one_load"]');

        let product_type = info_input.dataset.nameType;
        let product_name = info_input.dataset.nameProduct;

        let count_product_one_load = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="count_product_one_load"]');

        if (info_input.checked) {
            count_product_one_load.value = 4;
            count_product_one_load.disabled = true;
            count_product_one_load.classList.add('form__input_formula');
        } else {
            count_product_one_load.value = 0;
            count_product_one_load.disabled = false;
            count_product_one_load.classList.remove('form__input_formula');
        }  

        recount();
    }

    //Отсутствие информации Количество часов
    if (e.target.matches('input[data-name-type="reusable"][data-name-process="disinfection"][data-name-indicator="unknown_count_hours"]')) {

        recount();
    }

    if (e.target.matches('input[data-name-indicator="unknown_volume_packet"]')) {
        let info_input = e.target.closest('input[data-name-indicator="unknown_volume_packet"]');

        let product_type = info_input.dataset.nameType;
        let product_name = info_input.dataset.nameProduct;
        let process_name = info_input.dataset.nameProcess;

        let volume_product = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="volume_product"]');

        if (info_input.checked) {
            volume_product.value = volume_packets_process[process_name];
            volume_product.disabled = true;
            volume_product.classList.add('form__input_formula');
        } else {
            volume_product.value = 0;
            volume_product.disabled = false;
            volume_product.classList.remove('form__input_formula');
        }  

        recount();
    }

    if (e.target.matches('input[data-name-indicator="unknown_volume_one_packet"]')) {
        let info_input = e.target.closest('input[data-name-indicator="unknown_volume_one_packet"]');

        let product_type = info_input.dataset.nameType;
        let product_name = info_input.dataset.nameProduct;
        let process_name = info_input.dataset.nameProcess;

        let volume_one_product = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="volume_one_product"]');

        if (info_input.checked) {
            volume_one_product.value = volume_reusable_products[product_name];
            volume_one_product.disabled = true;
            volume_one_product.classList.add('form__input_formula');
        } else {
            volume_one_product.value = 0;
            volume_one_product.disabled = false;
            volume_one_product.classList.remove('form__input_formula');
        }  

        recount();
    }

    //Отсутствие информации стоимости часа сотрудника
    if (e.target.matches('input[data-name-indicator="unknown_employee_hour_cost"]')) {
        let info_input = e.target.closest('input[data-name-indicator="unknown_employee_hour_cost"]');

        let product_type = info_input.dataset.nameType;
        let product_name = info_input.dataset.nameProduct;
        let process_name = info_input.dataset.nameProcess;

        let cost_hour = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="employee_hour_cost"]');

        if (info_input.checked) {
            cost_hour.value = cost_hour_work_process[process_name];
            cost_hour.disabled = true;
            cost_hour.classList.add('form__input_formula');
        } else {
            cost_hour.value = 0;
            cost_hour.disabled = false;
            cost_hour.classList.remove('form__input_formula');
        }  

        recount();
    }

    //Отсутствие информации кол-ва часов
    if (e.target.matches('input[data-name-type="disposable"][data-name-process="transportation"][data-name-indicator="unknown_employee_count"]')) {
        let info_input = e.target.closest('input[data-name-type="disposable"][data-name-process="transportation"][data-name-indicator="unknown_employee_count"]');

        let product_name = info_input.dataset.nameProduct;

        let employee_count = document.querySelector('input[data-name-type="disposable"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="employee_count"]');

        if (info_input.checked) {
            employee_count.value = 1;
            employee_count.disabled = true;
            employee_count.classList.add('form__input_formula');
        } else {
            employee_count.value = 0;
            employee_count.disabled = false;
            employee_count.classList.remove('form__input_formula');
        }  

        recount();
    }

    //Отсутствие информации кол-ва часов
    if (e.target.matches('input[data-name-type="disposable"][data-name-process="transportation"][data-name-indicator="unknown_hours_count"]')) {
        let info_input = e.target.closest('input[data-name-type="disposable"][data-name-process="transportation"][data-name-indicator="unknown_hours_count"]');

        let product_name = info_input.dataset.nameProduct;

        let hours_count = document.querySelector('input[data-name-type="disposable"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="hours_count"]');

        let reusable_hours_count = document.querySelector('input[data-name-type="reusable"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="hours_count"]');

        if (info_input.checked) {
            if (reusable_hours_count) {
                hours_count.value = parseInputToNumber(reusable_hours_count.value) / 3;
            } else {
                hours_count.value = 1;
            }
            hours_count.disabled = true;
            hours_count.classList.add('form__input_formula');
        } else {
            hours_count.value = 0;
            hours_count.disabled = false;
            hours_count.classList.remove('form__input_formula');
        }  

        recount();
    }

    //Отсутствие информации кол-ва сотрудников для многоразовых
    if (e.target.matches('input[data-name-type="reusable"][data-name-process="transportation"][data-name-indicator="unknown_employee_count"]')) {
        let info_input = e.target.closest('input[data-name-type="reusable"][data-name-process="transportation"][data-name-indicator="unknown_employee_count"]');

        let product_name = info_input.dataset.nameProduct;

        let employee_count = document.querySelector('input[data-name-type="reusable"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="employee_count"]');

        if (info_input.checked) {
            employee_count.value = 1;
            employee_count.disabled = true;
            employee_count.classList.add('form__input_formula');
        } else {
            employee_count.value = 0;
            employee_count.disabled = false;
            employee_count.classList.remove('form__input_formula');
        }  

        recount();
    }

    //Отсутствие информации кол-ва часов для многоразовых
    if (e.target.matches('input[data-name-type="reusable"][data-name-process="transportation"][data-name-indicator="unknown_hours_count"]')) {
        let info_input = e.target.closest('input[data-name-type="reusable"][data-name-process="transportation"][data-name-indicator="unknown_hours_count"]');

        let product_name = info_input.dataset.nameProduct;

        let hours_count = document.querySelector('input[data-name-type="reusable"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="hours_count"]');

        if (info_input.checked) {
            hours_count.value = 3;
            hours_count.disabled = true;
            hours_count.classList.add('form__input_formula');
        } else {
            hours_count.value = 0;
            hours_count.disabled = false;
            hours_count.classList.remove('form__input_formula');
        }  

        recount();
    }

    //Отсутствие информации стоимости в аренеде и закупке для многоразовых
    if (e.target.matches('input[data-name-type="reusable"][data-name-indicator="unknown_cost"]')) {
        let info_input = e.target.closest('input[data-name-type="reusable"][data-name-indicator="unknown_cost"]');

        let product_type = info_input.dataset.nameType;
        let product_name = info_input.dataset.nameProduct;
        let process_name = info_input.dataset.nameProcess;

        let cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="cost"]');

        if (info_input.checked) {
            cost.value = cost_purchase_products[product_type][product_name];
            cost.disabled = true;
            cost.classList.add('form__input_formula');
        } else {
            cost.value = 0;
            cost.disabled = false;
            cost.classList.remove('form__input_formula');
        }  

        recount();
    }

    //Отсутствие информации веса в аренеде и закупке для многоразовых
    if (e.target.matches('input[data-name-type="reusable"][data-name-indicator="unknown_weight"]')) {
        let info_input = e.target.closest('input[data-name-type="reusable"][data-name-indicator="unknown_weight"]');

        let product_type = info_input.dataset.nameType;
        let product_name = info_input.dataset.nameProduct;
        let process_name = info_input.dataset.nameProcess;

        let weight = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="weight"]');

        if (info_input.checked) {
            weight.value = weight_purchase_products[product_type][product_name];
            weight.disabled = true;
            weight.classList.add('form__input_formula');
        } else {
            weight.value = 0;
            weight.disabled = false;
            weight.classList.remove('form__input_formula');
        }  

        recount();
    }

    //Отсутствие информации расхода для многоразовых
    if (e.target.matches('input[data-name-type="reusable"][data-name-indicator="unknown_consumption"]')) {
        let info_input = e.target.closest('input[data-name-type="reusable"][data-name-indicator="unknown_consumption"]');

        let product_type = info_input.dataset.nameType;
        let product_name = info_input.dataset.nameProduct;
        let process_name = info_input.dataset.nameProcess;

        let consumption = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="consumption"]');

        let count_manipulation = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="count_manipulation"]');

        let count_product_one_manipulation = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="count_product_one_manipulation"]');

        let even_cleaner = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="even_cleaner"]');

        let k_for_formula = {
            1: 7,
            2: 3.5,
            3: 2.3,
            4: 1.75,
            5: 1.4,
            6: 1.17,
            7: 1
        };

        if (info_input.checked) {
            if (product_type == 'robes' || product_type == 'surgical_suits' || product_type == 'hats') {
                consumption.value = Math.ceil(3 * (((parseInputToNumber(count_manipulation.value) * parseInputToNumber(count_product_one_manipulation.value))/365) * k_for_formula[even_cleaner.value]));
            } else {
                let part = 2 * (((parseInputToNumber(count_manipulation.value) * parseInputToNumber(count_product_one_manipulation.value))/365) * k_for_formula[even_cleaner.value]);
                consumption.value = Math.ceil(part + part/10);
            }
            consumption.disabled = true;
            consumption.classList.add('form__input_formula');
        } else {
            consumption.value = 0;
            consumption.disabled = false;
            consumption.classList.remove('form__input_formula');
        }  

        recount();
    }

    //Отсутствие информации сколько изделия для многоразовых (обеззараживание и стирка)
    if (e.target.matches('input[data-name-indicator="unknown_count_product"]')) {
        let info_input = e.target.closest('input[data-name-indicator="unknown_count_product"]');

        let product_type = info_input.dataset.nameType;
        let product_name = info_input.dataset.nameProduct;
        let process_name = info_input.dataset.nameProcess;

        let k_for_formula = {
            1: 7,
            2: 3.5,
            3: 2.3,
            4: 1.75,
            5: 1.4,
            6: 1.17,
            7: 1
        };

        let count_product = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="count_product"]');

        let how_often = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="how_often"]');

        let count_manipulation = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="count_manipulation"]');

        let count_product_one_manipulation = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="count_product_one_manipulation"]');

        if (info_input.checked) {
            let result = Math.ceil(((parseInputToNumber(count_manipulation.value) * parseInputToNumber(count_product_one_manipulation.value)) / 365) * k_for_formula[how_often.value]);
            count_product.value = result * parseInputToNumber(how_often.value) * 52;
            count_product.disabled = true;
            count_product.classList.add('form__input_formula');
        } else {
            count_product.value = 0;
            count_product.disabled = false;
            count_product.classList.remove('form__input_formula');
        }  

        recount();
    }

    //Отсутствие информации var_cost для многоразовых
    if (e.target.matches('input[data-name-type="reusable"][data-name-indicator="unknown_var_cost"]')) {
        let info_input = e.target.closest('input[data-name-type="reusable"][data-name-indicator="unknown_var_cost"]');

        let product_type = info_input.dataset.nameType;
        let product_name = info_input.dataset.nameProduct;
        let process_name = info_input.dataset.nameProcess;

        let var_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="var_cost"]');

        if (info_input.checked) {
            if (process_name == 'washing') {
                var_cost.value = 1;
            } else {
                var_cost.value = 0.3;
            }
            var_cost.disabled = true;
            var_cost.classList.add('form__input_formula');
        } else {
            var_cost.value = 0;
            var_cost.disabled = false;
            var_cost.classList.remove('form__input_formula');
        }  

        recount();
    }

    //Перерасчет при выборе типа закупки или аренды
    if (e.target.matches('input[data-name-process="rent"][data-name-indicator="type_cost"]')) {
        let info_input = e.target.closest('input[data-name-process="rent"][data-name-indicator="type_cost"]'); 

        recount();
    }

});

//!!!Функция для пересчета
function recount () {

    let total_purchase_disposable = 0;
    let total_purchase_reusable = 0;

    let total_storage_disposable = 0;
    let total_storage_reusable = 0;

    let total_transportation_disposable = 0;
    let total_transportation_reusable = 0;

    let total_waste_disinfection_disposable = 0;
    let total_disinfection_reusable = 0;

    let total_rent_reusable = 0;
    let total_washing_reusable = 0;
    let total_sterilization_reusable = 0;
    let total_repair_reusable = 0;

    let total_disposable = 0;
    let total_reusable = 0;

    let total_cost_employee_disposable = 0;
    let total_cost_employee_reusable = 0;

    let total_waste_disinfection_repeat_equipment = 0;
    let total_washing_repeat_equipment = 0;
    let total_sterilization_repeat_equipment = 0;

    let total_disposable_repeat_equipment = 0;
    let total_reusable_repeat_equipment = 0;

    let type_calculation_value = document.querySelector('input[name="type_calculation"]:checked').value;
    if (type_calculation_value != 'Оценка фактических затрат') {
        //Требуемое количество единиц изделия по манипуляциям
        let count_product_main_inputs = document.querySelectorAll('input[data-name-process="main"][data-name-indicator="count_product"]');
        count_product_main_inputs.forEach(input => {
            let product_type = input.dataset.nameType;
            let product_name = input.dataset.nameProduct;
            input.value = parseInputToNumber(document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="count_manipulation"]').value) * parseInputToNumber(document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="count_product_one_manipulation"]').value);

        });  
    }

    let unknown_consumption_inputs = document.querySelectorAll('input[data-name-type="reusable"][data-name-indicator="unknown_consumption"]');
    unknown_consumption_inputs.forEach(input => {
        let product_type = input.dataset.nameType;
        let product_name = input.dataset.nameProduct;
        let process_name = input.dataset.nameProcess;

        let consumption = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="consumption"]');

        let count_manipulation = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="count_manipulation"]');

        let count_product_one_manipulation = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="count_product_one_manipulation"]');

        let even_cleaner = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="even_cleaner"]');

        let k_for_formula = {
            1: 7,
            2: 3.5,
            3: 2.3,
            4: 1.75,
            5: 1.4,
            6: 1.17,
            7: 1
        };

        if (input.checked) {
            if (product_type == 'robes' || product_type == 'surgical_suits' || product_type == 'hats') {
                consumption.value = Math.ceil(3 * (((parseInputToNumber(count_manipulation.value) * parseInputToNumber(count_product_one_manipulation.value))/365) * k_for_formula[even_cleaner.value]));
            } else {
                let part = 2 * (((parseInputToNumber(count_manipulation.value) * parseInputToNumber(count_product_one_manipulation.value))/365) * k_for_formula[even_cleaner.value]);
                consumption.value = Math.ceil(part + part/10);
            }
        } else {
            // consumption.value = 0;
        }  
    });

    let unknown_count_product_inputs = document.querySelectorAll('input[data-name-indicator="unknown_count_product"]');
    unknown_count_product_inputs.forEach(input => {
        let product_type = input.dataset.nameType;
        let product_name = input.dataset.nameProduct;
        let process_name = input.dataset.nameProcess;

        let k_for_formula = {
            1: 7,
            2: 3.5,
            3: 2.3,
            4: 1.75,
            5: 1.4,
            6: 1.17,
            7: 1
        };

        let count_product = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="count_product"]');

        let how_often = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="' + process_name + '"][data-name-indicator="how_often"]');

        let count_manipulation = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="count_manipulation"]');

        let count_product_one_manipulation = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="count_product_one_manipulation"]');

        if (input.checked) {
            let result = Math.ceil(((parseInputToNumber(count_manipulation.value) * parseInputToNumber(count_product_one_manipulation.value)) / 365) * k_for_formula[how_often.value]);
            count_product.value = result * parseInputToNumber(how_often.value) * 52;
        } else {
            // count_product.value = 0;
        }  
    });

    let unknown_hours_count_inputs = document.querySelectorAll('input[data-name-type="disposable"][data-name-process="transportation"][data-name-indicator="unknown_hours_count"]');
    unknown_hours_count_inputs.forEach(input => {
        let product_name = input.dataset.nameProduct;

        let hours_count = document.querySelector('input[data-name-type="disposable"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="hours_count"]');

        let reusable_hours_count = document.querySelector('input[data-name-type="reusable"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="hours_count"]');

        if (input.checked) {
            if (reusable_hours_count) {
                hours_count.value = parseInputToNumber(reusable_hours_count.value) / 3;
            } else {
                hours_count.value = 1;
            }
        } else {
            // hours_count.value = 0;
        }  
    });

    let purchase_unknown_consumption_inputs = document.querySelectorAll('input[data-name-type="disposable"][data-name-process="purchase"][data-name-indicator="unknown_consumption"]');
    purchase_unknown_consumption_inputs.forEach(input => {
        let product_type = input.dataset.nameType;
        let product_name = input.dataset.nameProduct;

        let consumption = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="purchase"][data-name-indicator="consumption"]');

        if (input.checked) {
            consumption.value = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="count_product"]').value;
        } else {
            // consumption.value = 0;
        }  
    });

    //Закупка
    let sum_year_purchase_inputs = document.querySelectorAll('input[data-name-process="purchase"][data-name-indicator="sum_year"]');
    sum_year_purchase_inputs.forEach(input => {
        let product_type = input.dataset.nameType;
        let product_name = input.dataset.nameProduct;

        let cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="purchase"][data-name-indicator="cost"]');
        let consumption = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="purchase"][data-name-indicator="consumption"]');

        let res = parseInputToNumber(cost.value) * parseInputToNumber(consumption.value);
        input.value = formatWithSpaces(res);

        if (product_type == 'disposable') {
            total_purchase_disposable = total_purchase_disposable + parseInputToNumber(input.value);
        } else {
            total_purchase_reusable = total_purchase_reusable + parseInputToNumber(input.value);
        }
    });    

    //Аренда
    let sum_year_rent_inputs = document.querySelectorAll('input[data-name-process="rent"][data-name-indicator="sum_year"]');
    sum_year_rent_inputs.forEach(input => {
        let product_type = input.dataset.nameType;
        let product_name = input.dataset.nameProduct;
        let type_cost_checked = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="rent"][data-name-indicator="type_cost"]:checked');
        if (type_cost_checked) {
            let type_cost = type_cost_checked.value;
            let sum_year;

            let cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="rent"][data-name-indicator="cost"]');
            if (type_cost == 'count') {
                let consumption = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="rent"][data-name-indicator="consumption"]');
                sum_year = parseInputToNumber(cost.value) * parseInputToNumber(consumption.value);
            } else {
                let weight = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="rent"][data-name-indicator="weight"]');
                sum_year = parseInputToNumber(cost.value) * parseInputToNumber(weight.value);
            }

            input.value = formatWithSpaces(sum_year);
        }

        total_rent_reusable = total_rent_reusable + parseInt(input.value);
    });

    //Хранение
    let sum_year_storage_inputs = document.querySelectorAll('input[data-name-process="storage"][data-name-indicator="sum_year"]');
    sum_year_storage_inputs.forEach(input => {
        let product_type = input.dataset.nameType;
        let product_name = input.dataset.nameProduct;
        let storage_space = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="storage"][data-name-indicator="space"]');
        let storage_rent = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="storage"][data-name-indicator="rent"]');
        let storage_utilities = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="storage"][data-name-indicator="utilities"]');
        let storage_tax = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="storage"][data-name-indicator="tax"]');
        input.value = formatWithSpaces((parseInputToNumber(storage_space.value) * parseInputToNumber(storage_rent.value)) + (parseInputToNumber(storage_space.value) * parseInputToNumber(storage_utilities.value)) + parseInputToNumber(storage_tax.value));

        if (product_type == 'disposable') {
            total_storage_disposable = total_storage_disposable + parseInputToNumber(input.value);
        } else {
            total_storage_reusable = total_storage_reusable + parseInputToNumber(input.value);
        }
    });

    //Транспортировка
    let sum_year_transportation_inputs = document.querySelectorAll('input[data-name-process="transportation"][data-name-indicator="sum_year"]');
    sum_year_transportation_inputs.forEach(input => {
        let product_type = input.dataset.nameType;
        let product_name = input.dataset.nameProduct;
        let transportation_employee_count = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="employee_count"]');
        let transportation_hours_count = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="hours_count"]');
        let transportation_cost_hour = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="cost_hour"]');

        let sum_cost_employee = (parseInputToNumber(transportation_employee_count.value) * parseInputToNumber(transportation_hours_count.value) * parseInputToNumber(transportation_cost_hour.value)) + (parseInputToNumber(transportation_employee_count.value) * price_medosmotr);

        document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="sum_cost_employee"]').value = formatWithSpaces(sum_cost_employee);

        if (product_type == 'disposable') {
            input.value = formatWithSpaces(sum_cost_employee);
            total_transportation_disposable = total_transportation_disposable + parseInputToNumber(input.value);
            total_cost_employee_disposable = total_cost_employee_disposable + sum_cost_employee;
        } else {
            let use_packet = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="use_packet"]:checked');

            let cost_product = parseInputToNumber(document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="cost_product"]').value);
            let transportation_cost_packages;
            //Если используются доп пакеты
            if (use_packet && use_packet.value == 'y') {
                let cost_packages = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="cost_packages"]');

                //если неизвестно кол-во пакетов
                if (document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="unknown_count_packet"]').checked) {
                    let approximate_count_product_input = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="approximate_count_product"]');
                    let volume_product, volume_one_product, approximate_count_product;

                    //Если неизвестен объем присваиваем другое значение
                    if (document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="unknown_volume_packet"]').checked) {
                        volume_product = volume_packets_process["transportation"]; //!!!Должно быть значение
                    } else {
                        volume_product = parseInputToNumber(document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="volume_product"]').value);
                    }

                    //Если неизвестен объем одного присваиваем другое значение
                    if (document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="unknown_volume_one_packet"]').checked) {
                        volume_one_product = volume_reusable_products[product_name]; //!!!Должно быть значение
                    } else {
                        volume_one_product = parseInputToNumber(document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="volume_one_product"]').value);
                    }

                    let clean_count_product = parseInputToNumber(document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="count_product"]').value);

                    //Считаем примерное кол-во
                    approximate_count_product = Math.ceil((volume_one_product * clean_count_product)/volume_product);
                    approximate_count_product_input.value = approximate_count_product;
                    
                    //Считаем заьраты на пакеты
                    transportation_cost_packages = approximate_count_product * cost_product;
                    cost_packages.value = formatWithSpaces(transportation_cost_packages);

                } else {
                    let count_product = parseInputToNumber(document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="count_product"]').value);
                    
                    transportation_cost_packages = count_product * cost_product;
                    cost_packages.value = formatWithSpaces(transportation_cost_packages);
                }
            } else {
                transportation_cost_packages = 0;
            }

            input.value = formatWithSpaces(sum_cost_employee + transportation_cost_packages);

            total_cost_employee_reusable = total_cost_employee_reusable + sum_cost_employee;

            total_transportation_reusable = total_transportation_reusable + parseInputToNumber(input.value);
        }

    });

    //Обеззараживание (Одноразовые)
    let total_cost_disinfection_sum_inputs = document.querySelectorAll('input[data-name-process="waste_disinfection"][data-name-indicator="total_cost"]');

    total_cost_disinfection_sum_inputs.forEach(input => {
        let product_type = input.dataset.nameType;
        let product_name = input.dataset.nameProduct;

        let sum = 0;

        let sum_without_equipment = 0; //!!!Объявляем глобально sum_equipment и считаем сумму тех затрат на оборудование, которое не будет идти потом в расчет и вычтем ее в конце


        //Обеззараживание (отходы)
        let waste_disinfection_waste_class_inputs = document.querySelectorAll('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="waste_class"]');

        waste_disinfection_waste_class_inputs.forEach(input => {
            if (input.checked) {
                let waste_class = input.value;
                
                let sum_weight_waste = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="sum_weight_waste"][data-name-waste-class="' + waste_class + '"]');
                let count_product_waste_class = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="count_product_waste_class"][data-name-waste-class="' + waste_class + '"]');
                let weight = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="purchase"][data-name-indicator="weight"]');

                //Общий вес отходов, кг
                sum_weight_waste.value = parseInputToNumber(count_product_waste_class.value) * parseInputToNumber(weight.value);

                let volume_waste_kubm = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="volume_waste_kubm"][data-name-waste-class="' + waste_class + '"]');
                let waste_density = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="waste_density"][data-name-waste-class="' + waste_class + '"]');

                let volume_kubm = 0;

                //Объем отходов, куб. м
                if (waste_density.value != 0) {
                    volume_kubm = parseInputToNumber(sum_weight_waste.value) / parseInputToNumber(waste_density.value);
                }

                let cost_transport_waste_class = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="cost_transport_waste_class"][data-name-waste-class="' + waste_class + '"]');
                let cost_one = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="cost_one"][data-name-waste-class="' + waste_class + '"]');

                //Затраты на вывоз отходов класса
                cost_transport_waste_class.value = volume_kubm * parseInputToNumber(cost_one.value);

                let volume_waste_l = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="volume_waste_l"][data-name-waste-class="' + waste_class + '"]');

                //Объем отходов, л
                volume_waste_l.value = volume_kubm * 1000;

                let count_packet = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="count_packet"][data-name-waste-class="' + waste_class + '"]');
                let packet_volume = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="packet_volume"][data-name-waste-class="' + waste_class + '"]');

                //Количество пакетов для сбора отходов
                if (packet_volume.value != 0) {
                    count_packet.value = parseInputToNumber(volume_waste_l.value) / parseInputToNumber(packet_volume.value);
                }

                let sum_cost_on_packet = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="sum_cost_on_packet"][data-name-waste-class="' + waste_class + '"]');
                let cost_one_packet = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="cost_one_packet"][data-name-waste-class="' + waste_class + '"]');

                //Затраты на пакеты, руб
                sum_cost_on_packet.value = parseInputToNumber(count_packet.value) * parseInputToNumber(cost_one_packet.value);

                if (waste_class == "B" || waste_class == "C") {

                    let autoclaving_count_packet = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="autoclaving_count_packet"][data-name-waste-class="' + waste_class + '"]');
                    let autoclaving_volume_packet = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="autoclaving_volume_packet"][data-name-waste-class="' + waste_class + '"]');

                    //Количество пакетов для автоклавирования, шт.
                    if (autoclaving_volume_packet.value != 0) {
                        autoclaving_count_packet.value = Math.ceil(parseInputToNumber(volume_waste_l.value) / ((parseInputToNumber(autoclaving_volume_packet.value)/4) * 3));
                    }

                    let autoclaving_sum_cost_packet = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="autoclaving_sum_cost_packet"][data-name-waste-class="' + waste_class + '"]');
                    let autoclaving_cost_packet = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="autoclaving_cost_packet"][data-name-waste-class="' + waste_class + '"]');

                    //Затраты на пакеты для автоклавирования, руб.
                    autoclaving_sum_cost_packet.value = parseInputToNumber(autoclaving_count_packet.value) * parseInputToNumber(autoclaving_cost_packet.value);

                    sum = sum + parseInputToNumber(autoclaving_sum_cost_packet.value);
                
                    autoclaving_count_packet.value = formatWithSpaces(roundTwo(parseInputToNumber(autoclaving_count_packet.value)));
                    autoclaving_sum_cost_packet.value = formatWithSpaces(roundTwo(parseInputToNumber(autoclaving_sum_cost_packet.value)));
                }

                sum = sum + parseInputToNumber(cost_transport_waste_class.value) + parseInputToNumber(sum_cost_on_packet.value);

                //!! после расмчета округляем значение
                sum_weight_waste.value = formatWithSpaces(roundTwo(parseInputToNumber(sum_weight_waste.value)));
                volume_waste_kubm.value =  formatWithSpaces(roundTwo(volume_kubm));
                cost_transport_waste_class.value = formatWithSpaces(roundTwo(parseInputToNumber(cost_transport_waste_class.value)));
                volume_waste_l.value = formatWithSpaces(roundTwo(parseInputToNumber(volume_waste_l.value)));
                count_packet.value = formatWithSpaces(roundTwo(parseInputToNumber(count_packet.value)));
                sum_cost_on_packet.value = formatWithSpaces(roundTwo(parseInputToNumber(sum_cost_on_packet.value)));
            }

        });

        //Обеззараживание (метод обеззараживания)
        let waste_disinfection_method_inputs = document.querySelectorAll('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="disinfection_method"]');

        waste_disinfection_method_inputs.forEach(input => {

            if (input.checked) {
                let method = input.value;

                //Для Физического
                if (method == 'physic') {

                    let equipment_annual_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="equipment_annual_cost"][data-name-disinfection-method="physic"]');
                    let equipment_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="equipment_cost"][data-name-disinfection-method="physic"]');
                    let equipment_lifetime = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="equipment_lifetime"][data-name-disinfection-method="physic"]');

                    //Ежегодные затраты на оборудование, руб
                    //!!!Если у нас выбрано, что оборудование указали в другом продукте, то увеличиваем sum_equipment
                    if (equipment_lifetime.value != 0) {
                        equipment_annual_cost.value = parseInputToNumber(equipment_cost.value) / parseInputToNumber(equipment_lifetime.value);
                    } else {
                        equipment_annual_cost.value = 0;
                    }

                    let indicated_equipment = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="indicated_equipment"][data-modify-equipment="n"]');

                    if (indicated_equipment && indicated_equipment.checked) {
                        total_waste_disinfection_repeat_equipment = total_waste_disinfection_repeat_equipment + parseInputToNumber(equipment_annual_cost.value);
                        total_disposable_repeat_equipment = total_disposable_repeat_equipment + parseInputToNumber(equipment_annual_cost.value);
                    }
                    
                    let cycles_per_year = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="cycles_per_year"][data-name-disinfection-method="physic"]');

                    let sum_weight_waste_B = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="sum_weight_waste"][data-name-waste-class="B"]');
                    let sum_weight_waste_C = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="sum_weight_waste"][data-name-waste-class="C"]');
                    let equipment_items_per_load = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="equipment_items_per_load"][data-name-disinfection-method="physic"]');


                    //Число запусков оборудования (циклов обеззараживания) в год
                    if (equipment_items_per_load.value != 0) {
                        cycles_per_year.value = Math.ceil((parseInputToNumber(sum_weight_waste_B.value) + parseInputToNumber(sum_weight_waste_C.value)) / parseInputToNumber(equipment_items_per_load.value));
                    } else {
                        cycles_per_year.value = 0;
                    }

                    let modify_waste_equipment = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="modify_waste_equipment"][data-name-disinfection-method="physic"]:checked');

                    let modification_equipment_annual_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="modification_equipment_annual_cost"][data-name-disinfection-method="physic"]');
                    let modification_equipment_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="modification_equipment_cost"][data-name-disinfection-method="physic"]');
                    let modification_equipment_lifetime = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="modification_equipment_lifetime"][data-name-disinfection-method="physic"]');

                    //Ежегодные затраты на доп оборудование, руб
                    if (modify_waste_equipment && modify_waste_equipment.value == '1') {
                        if (modification_equipment_lifetime.value != 0) {
                            modification_equipment_annual_cost.value = parseInputToNumber(modification_equipment_cost.value) / parseInputToNumber(modification_equipment_lifetime.value);
                        } else {
                            modification_equipment_annual_cost.value = 0;
                        }

                        let indicated_equipment = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="indicated_equipment"][data-modify-equipment="y"]');

                        if (indicated_equipment && indicated_equipment.checked) {
                            total_waste_disinfection_repeat_equipment = total_waste_disinfection_repeat_equipment + parseInputToNumber(modification_equipment_annual_cost.value);
                            total_disposable_repeat_equipment = total_disposable_repeat_equipment + parseInputToNumber(modification_equipment_annual_cost.value);
                        }

                        sum = sum + parseInputToNumber(modification_equipment_annual_cost.value);
                    }

                    let hours_approximate = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="hours_approximate"][data-name-disinfection-method="physic"]');
                    let time_disinfection_one_load = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="time_disinfection_one_load"][data-name-disinfection-method="physic"]');
                    let employee_count = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="employee_count"][data-name-disinfection-method="physic"]');

                    let hours_known = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="hours_known"][data-name-disinfection-method="physic"]');

                    //Примерное количество часов в год, затрачиваемых на обеззараживание одним сотрудником (если неизвестно точное количество)
                    if (hours_known.value == 0 && employee_count.value != 0) {
                        hours_approximate.value = ((parseInputToNumber(cycles_per_year.value) * parseInputToNumber(time_disinfection_one_load.value)) + (parseInputToNumber(cycles_per_year.value) * time_on_load_and_unload_waste)) / parseInputToNumber(employee_count.value);
                    } else {
                        hours_approximate.value = 0;
                    }

                    let count_hours_physic_method = 0; 

                    if (hours_known.value == 0) {
                        count_hours_physic_method = parseInputToNumber(hours_approximate.value);
                    } else {
                        count_hours_physic_method = parseInputToNumber(hours_known.value);
                    }

                    let sum_cost_waste_disinfection_employee = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="sum_cost_waste_disinfection_employee"][data-name-disinfection-method="physic"]');
                    let cost_waste_disinfection_hour_employee = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="cost_waste_disinfection_hour_employee"][data-name-disinfection-method="physic"]');

                    //Затраты на персонал
                    sum_cost_waste_disinfection_employee.value = (parseInputToNumber(employee_count.value) * count_hours_physic_method * parseInputToNumber(cost_waste_disinfection_hour_employee.value)) + (parseInputToNumber(employee_count.value) * price_medosmotr);

                    sum = sum + parseInputToNumber(equipment_annual_cost.value) + parseInputToNumber(sum_cost_waste_disinfection_employee.value);

                    sum_without_equipment = sum_without_equipment + (sum - parseInputToNumber(equipment_annual_cost.value));

                    total_cost_employee_disposable = total_cost_employee_disposable + parseInputToNumber(sum_cost_waste_disinfection_employee.value);

                    equipment_annual_cost.value = formatWithSpaces(roundTwo(parseInputToNumber(equipment_annual_cost.value)));
                    cycles_per_year.value = formatWithSpaces(roundTwo(parseInputToNumber(cycles_per_year.value)));
                    modification_equipment_annual_cost.value = formatWithSpaces(roundTwo(parseInputToNumber(modification_equipment_annual_cost.value)));
                    hours_approximate.value = formatWithSpaces(roundTwo(parseInputToNumber(hours_approximate.value)));
                    sum_cost_waste_disinfection_employee.value = formatWithSpaces(roundTwo(parseInputToNumber(sum_cost_waste_disinfection_employee.value)));

                    //!!Можно посчитать затраты на персонал по каждому процессу отдельно
                }

                if (method == 'chemical') {

                    let disinfectant_consumption_year = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="disinfectant_consumption_year"][data-name-disinfection-method="chemical"]');
                    let chemical_weight = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="chemical_weight"][data-name-disinfection-method="chemical"]');
                    let items_per_load = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="items_per_load"][data-name-disinfection-method="chemical"]');
                    let disinfectant_consumption_per_load = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="disinfectant_consumption_per_load"][data-name-disinfection-method="chemical"]');

                    //Расход дезсредства на обеззараживание в год, (кг, л, таб.)
                    if (items_per_load.value != 0) {
                        disinfectant_consumption_year.value = (parseInputToNumber(chemical_weight.value) / parseInputToNumber(items_per_load.value)) * parseInputToNumber(disinfectant_consumption_per_load.value);
                    } else {
                        disinfectant_consumption_year.value = 0;
                    }

                    let disinfectant_cost_year = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="disinfectant_cost_year"][data-name-disinfection-method="chemical"]');
                    let disinfectant_volume = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="disinfectant_volume"][data-name-disinfection-method="chemical"]');
                    let disinfectant_cost_per_unit = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="disinfectant_cost_per_unit"][data-name-disinfection-method="chemical"]');
                    
                    //Затраты на дезсредства в год, руб
                    if (disinfectant_volume.value != 0) {
                        disinfectant_cost_year.value = Math.ceil((parseInputToNumber(disinfectant_consumption_year.value) / parseInputToNumber(disinfectant_volume.value))) * parseInputToNumber(disinfectant_cost_per_unit.value);
                    } else {
                        disinfectant_cost_year.value = 0;
                    }

                    let hours_approximate = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="hours_approximate"][data-name-disinfection-method="chemical"]');
                    let time_disinfection_one_load = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="time_disinfection_one_load"][data-name-disinfection-method="chemical"]');
                    let employee_count = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="employee_count"][data-name-disinfection-method="chemical"]');

                    let hours_known = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="hours_known"][data-name-disinfection-method="chemical"]');

                    //Примерное количество часов в год, затрачиваемых на обеззараживание одним сотрудником (если неизвестно точное количество)
                    if (hours_known.value == 0 && employee_count.value != 0) {
                        hours_approximate.value = ((parseInputToNumber(chemical_weight.value) / parseInputToNumber(items_per_load.value)) * parseInputToNumber(time_disinfection_one_load.value)) / parseInputToNumber(employee_count.value);
                    } else {
                        hours_approximate.value = 0;
                    }

                    let count_hours_chemical_method = 0; 
                    if (hours_known.value == 0) {
                        count_hours_chemical_method = parseInputToNumber(hours_approximate.value);
                    } else {
                        count_hours_chemical_method = parseInputToNumber(hours_known.value);
                    }

                    let sum_cost_waste_disinfection_employee = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="sum_cost_waste_disinfection_employee"][data-name-disinfection-method="chemical"]');
                    let cost_waste_disinfection_hour_employee = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="cost_waste_disinfection_hour_employee"][data-name-disinfection-method="chemical"]');

                    //Затраты на персонал
                    sum_cost_waste_disinfection_employee.value = (parseInputToNumber(employee_count.value) * count_hours_chemical_method * parseInputToNumber(cost_waste_disinfection_hour_employee.value)) + (parseInputToNumber(employee_count.value) * price_medosmotr);

                    sum = sum + parseInputToNumber(disinfectant_cost_year.value) + parseInputToNumber(sum_cost_waste_disinfection_employee.value);

                    sum_without_equipment = sum_without_equipment + sum;

                    total_cost_employee_disposable = total_cost_employee_disposable + parseInputToNumber(sum_cost_waste_disinfection_employee.value);

                    disinfectant_consumption_year.value = formatWithSpaces(roundTwo(parseInputToNumber(disinfectant_consumption_year.value)));
                    disinfectant_cost_year.value = formatWithSpaces(roundTwo(parseInputToNumber(disinfectant_cost_year.value)));
                    hours_approximate.value = formatWithSpaces(roundTwo(parseInputToNumber(hours_approximate.value)));
                    sum_cost_waste_disinfection_employee.value = formatWithSpaces(roundTwo(parseInputToNumber(sum_cost_waste_disinfection_employee.value)));
                }
            }
        });

        input.value = sum;

        //!!!Если у нас выбрак укащали для другого продукта, то в общую сумму добавляем sum_without_equipment (вряд ли уже понадобится)

        total_waste_disinfection_disposable = total_waste_disinfection_disposable + parseInputToNumber(input.value);

        input.value = formatWithSpaces(roundTwo(parseInputToNumber(input.value)));

    });

    //Обеззараживание (для многоразовых)
    let cost_disinfection_sum_inputs = document.querySelectorAll('input[data-name-process="disinfection"][data-name-indicator="cost_disinfection_sum"]');

    cost_disinfection_sum_inputs.forEach(input => {
        let product_type = input.dataset.nameType;
        let product_name = input.dataset.nameProduct;

        let sum = 0;

        let disinfection_self = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="disinfection_self"]:checked');

        if (disinfection_self) {
            let self = disinfection_self.value;

            //Для формы Обеззараживание собственными силами
            if (self == 'y') {
                let type_oborot_check = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="type_oborot"]:checked');
                let type_oborot = 'purchase';

                if (type_oborot_check) {
                    type_oborot = type_oborot_check.value;
                }

                let weight_product = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="weight_product"]');
                let count_product = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="count_product"]');
                let weight = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="'+ type_oborot +'"][data-name-indicator="weight"]');

                let count_hours = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="count_hours"]');
                let unknown_count_hours = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="unknown_count_hours"]')
                // let var_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="var_cost"]');

                let approximate_count_hours = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="approximate_count_hours"]');
                let employee_count = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="employee_count"]');
                let employee_hour_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="employee_hour_cost"]');
                let sum_cost_employee = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="sum_cost_employee"]');

                let volume_disinfectant = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="volume_disinfectant"]');
                let cost_disinfectant = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="cost_disinfectant"]');
                let consumption_disinfectant = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="consumption_disinfectant"]');
                let count_product_one_load = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="count_product_one_load"]');

                let consumption_disinfectant_year = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="consumption_disinfectant_year"]');
                let cost_disinfectant_year = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="cost_disinfectant_year"]');

                //Вес обеззараживаемых изделий в год
                weight_product.value = parseInputToNumber(weight.value) * parseInputToNumber(count_product.value);


                //Примерное количество часов в год, затрачиваемых на обеззараживание одним сотрудником (если неизвестно точное количество)
                if (count_hours.value == 0 && unknown_count_hours.checked && employee_count.value != 0) {
                    approximate_count_hours.value = ((parseInputToNumber(weight_product.value) / one_load_obezzaraz) * time_on_load_and_unload_obezzaraz) / parseInputToNumber(employee_count.value);
                } else {
                    approximate_count_hours.value = 0;
                }

                let count_hours_for_formula = 0; 
                if (count_hours.value == 0) {
                    count_hours_for_formula = parseInputToNumber(approximate_count_hours.value);
                } else {
                    count_hours_for_formula = parseInputToNumber(count_hours.value);
                }

                //Затраты на персонал
                sum_cost_employee.value = (parseInputToNumber(employee_count.value) * count_hours_for_formula * parseInputToNumber(employee_hour_cost.value)) + (parseInputToNumber(employee_count.value) * price_medosmotr);

                total_cost_employee_reusable = total_cost_employee_reusable + parseInputToNumber(sum_cost_employee.value);

                //Расход средства в год
                if (count_product_one_load.value != 0) {
                    consumption_disinfectant_year.value = (parseInputToNumber(weight_product.value) / parseInputToNumber(count_product_one_load.value)) * parseInputToNumber(consumption_disinfectant.value);
                } else {
                    consumption_disinfectant_year.value = 0;
                }

                //Затраты на дезсредства
                if (volume_disinfectant.value != 0) {
                    cost_disinfectant_year.value = Math.ceil(parseInputToNumber(consumption_disinfectant_year.value) / parseInputToNumber(volume_disinfectant.value)) * parseInputToNumber(cost_disinfectant.value);
                } else {
                    cost_disinfectant_year.value = 0;
                }

                sum = sum + parseInputToNumber(cost_disinfectant_year.value) + parseInputToNumber(sum_cost_employee.value);

                approximate_count_hours.value = formatWithSpaces(roundTwo(parseInputToNumber(approximate_count_hours.value)));
                sum_cost_employee.value = formatWithSpaces(roundTwo(parseInputToNumber(sum_cost_employee.value)));
                consumption_disinfectant_year.value = formatWithSpaces(roundTwo(parseInputToNumber(consumption_disinfectant_year.value)));
                cost_disinfectant_year.value = formatWithSpaces(roundTwo(parseInputToNumber(cost_disinfectant_year.value)));
            }
        }

        let disinfection_contract = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="disinfection_contract"]:checked');

        if (disinfection_contract) { 
            let contract = disinfection_contract.value;

            if (contract == 'y') {
                let consumption_disinfectant_contract = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="consumption_disinfectant_contract"]');
                let cost_disinfection_contract = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="cost_disinfection_contract"]');
                let count_product_disinfection_contract = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="count_product_disinfection_contract"]');

                consumption_disinfectant_contract.value = parseInputToNumber(cost_disinfection_contract.value) * parseInputToNumber(count_product_disinfection_contract.value);

                sum = sum + parseInputToNumber(consumption_disinfectant_contract.value);

                consumption_disinfectant_contract.value = formatWithSpaces(roundTwo(parseInputToNumber(consumption_disinfectant_contract.value)));
            }
        }
        
        input.value = sum;

        total_disinfection_reusable = total_disinfection_reusable + parseInputToNumber(input.value);

        input.value = formatWithSpaces(roundTwo(parseInputToNumber(input.value)));
    });

    //Стирка (для многоразовых)
    let cost_washing_sum_inputs = document.querySelectorAll('input[data-name-process="washing"][data-name-indicator="cost_washing_ironing_sum"]');

    cost_washing_sum_inputs.forEach(input => {
        let product_type = input.dataset.nameType;
        let product_name = input.dataset.nameProduct;

        let sum = 0;

        let washing_self = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="washing_self"]:checked');

        if (washing_self) {
            let self = washing_self.value;

            //Для формы Стирка собственными силами
            if (self == 'y') {
                let type_oborot_check = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="type_oborot"]:checked');
                let type_oborot = 'purchase';

                if (type_oborot_check) {
                    type_oborot = type_oborot_check.value;
                }

                let weight_product = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="weight_product"]');
                let count_product = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="count_product"]');
                let weight = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="'+ type_oborot +'"][data-name-indicator="weight"]');

                let count_hours = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="count_hours"]');
                let var_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="var_cost"]');

                let ironing_hours_per_year = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="ironing_hours_per_year"]');

                let approximate_count_hours = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="approximate_count_hours"]');
                let employee_count = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="employee_count"]');
                let employee_hour_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="employee_hour_cost"]');
                let sum_cost_employee = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="sum_cost_employee"]');

                let volume_detergent = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="volume_detergent"]');
                let cost_detergent = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="cost_detergent"]');
                let consumption_detergent_per_load = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="consumption_detergent_per_load"]');
                let count_product_one_load = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="count_product_one_load"]');

                let consumption_detergent_year = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="consumption_detergent_year"]');
                let cost_detergent_year = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="cost_detergent_year"]');

                let equipment_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="equipment_cost"]');
                let equipment_lifetime = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="equipment_lifetime"]');
                let equipment_annual_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="equipment_annual_cost"]');

                //Вес стираемых изделий в год
                weight_product.value = parseInputToNumber(weight.value) * parseInputToNumber(count_product.value);

                //Примерное количество часов в год, затрачиваемых на обеззараживание одним сотрудником (если неизвестно точное количество)
                if (count_hours.value == 0 && var_cost.value != 0 && employee_count.value != 0 && count_product_one_load.value != 0) {
                    approximate_count_hours.value = (((parseInputToNumber(weight_product.value) / parseInputToNumber(count_product_one_load.value)) * parseInputToNumber(var_cost.value)) + (time_on_load_and_unload_clean * (parseInputToNumber(weight_product.value) / parseInputToNumber(count_product_one_load.value)))) / parseInputToNumber(employee_count.value);
                } else {
                    approximate_count_hours.value = 0;
                }

                let count_hours_for_formula = 0; 
                if (count_hours.value == 0) {
                    count_hours_for_formula = parseInputToNumber(approximate_count_hours.value);
                } else {
                    count_hours_for_formula = parseInputToNumber(count_hours.value);
                }

                //Затраты на персонал
                sum_cost_employee.value = (parseInputToNumber(employee_count.value) * count_hours_for_formula * parseInputToNumber(employee_hour_cost.value)) + (parseInputToNumber(employee_count.value) * parseInputToNumber(ironing_hours_per_year.value) * parseInputToNumber(employee_hour_cost.value)) + (parseInputToNumber(employee_count.value) * price_medosmotr);

                total_cost_employee_reusable = total_cost_employee_reusable + parseInputToNumber(sum_cost_employee.value);

                //Расход средства в год
                if (count_product_one_load.value != 0) {
                    consumption_detergent_year.value = (parseInputToNumber(weight_product.value) / parseInputToNumber(count_product_one_load.value)) * parseInputToNumber(consumption_detergent_per_load.value);
                } else {
                    consumption_detergent_year.value = 0;
                }

                //Затраты на дезсредства
                if (volume_detergent.value != 0) {
                    cost_detergent_year.value = Math.ceil(parseInputToNumber(consumption_detergent_year.value) / parseInputToNumber(volume_detergent.value)) * parseInputToNumber(cost_detergent.value);
                } else {
                    cost_detergent_year.value = 0;
                }

                //Затраты на оборудование
                if (equipment_lifetime.value != 0) {
                    equipment_annual_cost.value = parseInputToNumber(equipment_cost.value) / parseInputToNumber(equipment_lifetime.value);
                } else {
                    equipment_annual_cost.value = 0;
                }

                let indicated_equipment = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="indicated_equipment"][data-modify-equipment="n"]');

                if (indicated_equipment && indicated_equipment.checked) {
                    total_washing_repeat_equipment = total_washing_repeat_equipment + parseInputToNumber(equipment_annual_cost.value);
                    total_reusable_repeat_equipment = total_reusable_repeat_equipment + parseInputToNumber(equipment_annual_cost.value);
                }

                sum = sum + parseInputToNumber(cost_detergent_year.value) + parseInputToNumber(sum_cost_employee.value) + parseInputToNumber(equipment_annual_cost.value);

                approximate_count_hours.value = formatWithSpaces(roundTwo(parseInputToNumber(approximate_count_hours.value)));
                sum_cost_employee.value = formatWithSpaces(roundTwo(parseInputToNumber(sum_cost_employee.value)));
                consumption_detergent_year.value = formatWithSpaces(roundTwo(parseInputToNumber(consumption_detergent_year.value)));
                cost_detergent_year.value = formatWithSpaces(roundTwo(parseInputToNumber(cost_detergent_year.value)));
                equipment_annual_cost.value = formatWithSpaces(roundTwo(parseInputToNumber(equipment_annual_cost.value)));
            }
        }

        let washing_contract = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="washing_contract"]:checked');

        if (washing_contract) { 
            let contract = washing_contract.value;

            if (contract == 'y') {
                let expenses_washing_contract = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="expenses_washing_contract"]');
                let cost_washing_contract = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="cost_washing_contract"]');
                let count_product_washing_contract = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="count_product_washing_contract"]');

                expenses_washing_contract.value = parseInputToNumber(cost_washing_contract.value) * parseInputToNumber(count_product_washing_contract.value);

                sum = sum + parseInputToNumber(expenses_washing_contract.value);

                expenses_washing_contract.value = formatWithSpaces(roundTwo(parseInputToNumber(expenses_washing_contract.value)));
            }
        }
        
        input.value = sum;

        total_washing_reusable = total_washing_reusable + parseInputToNumber(input.value);

        input.value = formatWithSpaces(roundTwo(parseInputToNumber(input.value)));
    });

    //Стерилизация (для многоразовых)
    let cost_sterilization_sum_inputs = document.querySelectorAll('input[data-name-process="sterilization"][data-name-indicator="sterilization_cost_sum"]');

    cost_sterilization_sum_inputs.forEach(input => {
        let product_type = input.dataset.nameType;
        let product_name = input.dataset.nameProduct;

        let sum = 0;
        
        let type_oborot_check = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="main"][data-name-indicator="type_oborot"]:checked');
        let type_oborot = 'purchase';

        if (type_oborot_check) {
            type_oborot = type_oborot_check.value;
        }

        let weight_product = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="sterilization"][data-name-indicator="weight_product"]');
        let count_product = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="sterilization"][data-name-indicator="count_product"]');
        let weight = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="'+ type_oborot +'"][data-name-indicator="weight"]');

        let count_hours = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="sterilization"][data-name-indicator="count_hours"]');
        let var_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="sterilization"][data-name-indicator="var_cost"]');

        let approximate_count_hours = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="sterilization"][data-name-indicator="approximate_count_hours"]');
        let employee_count = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="sterilization"][data-name-indicator="employee_count"]');
        let employee_hour_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="sterilization"][data-name-indicator="employee_hour_cost"]');
        let sum_cost_employee = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="sterilization"][data-name-indicator="sum_cost_employee"]');

        let count_product_one_load = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="sterilization"][data-name-indicator="count_product_one_load"]');
        
        let equipment_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="sterilization"][data-name-indicator="equipment_cost"]');
        let equipment_lifetime = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="sterilization"][data-name-indicator="equipment_lifetime"]');
        let equipment_annual_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="sterilization"][data-name-indicator="equipment_annual_cost"]');

        let packaging_cost_per_unit = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="sterilization"][data-name-indicator="packaging_cost_per_unit"]');
        let packaging_consumption_year = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="sterilization"][data-name-indicator="packaging_consumption_year"]');
        let packaging_cost_year = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="sterilization"][data-name-indicator="packaging_cost_year"]');

        //Вес стираемых изделий в год
        weight_product.value = parseInputToNumber(weight.value) * parseInputToNumber(count_product.value);

        //Примерное количество часов в год, затрачиваемых на обеззараживание одним сотрудником (если неизвестно точное количество)
        if (count_hours.value == 0 && var_cost.value != 0 && employee_count.value != 0) {
            approximate_count_hours.value = ((parseInputToNumber(weight_product.value) / parseInputToNumber(count_product_one_load.value) * parseInputToNumber(var_cost.value)) + (time_on_load_and_unload_sterilize * (parseInputToNumber(weight_product.value) / parseInputToNumber(count_product_one_load.value)))) / parseInputToNumber(employee_count.value);
        } else {
            approximate_count_hours.value = 0;
        }

        let count_hours_for_formula = 0; 
        if (count_hours.value == 0) {
            count_hours_for_formula = parseInputToNumber(approximate_count_hours.value);
        } else {
            count_hours_for_formula = parseInputToNumber(count_hours.value);
        }

        //Затраты на персонал
        sum_cost_employee.value = (parseInputToNumber(employee_count.value) * count_hours_for_formula * parseInputToNumber(employee_hour_cost.value)) + (parseInputToNumber(employee_count.value) * price_medosmotr);

        total_cost_employee_reusable = total_cost_employee_reusable + parseInputToNumber(sum_cost_employee.value);

        //Затраты на оборудование
        if (equipment_lifetime.value != 0) {
            equipment_annual_cost.value = parseInputToNumber(equipment_cost.value) / parseInputToNumber(equipment_lifetime.value);
        } else {
            equipment_annual_cost.value = 0;
        }

        let indicated_equipment = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="sterilization"][data-name-indicator="indicated_equipment"][data-modify-equipment="n"]');

        if (indicated_equipment && indicated_equipment.checked) {
            total_sterilization_repeat_equipment = total_sterilization_repeat_equipment + parseInputToNumber(equipment_annual_cost.value);
            total_reusable_repeat_equipment = total_reusable_repeat_equipment + parseInputToNumber(equipment_annual_cost.value);
        }

        //Затраты на пакеты
        packaging_cost_year.value = parseInputToNumber(packaging_cost_per_unit.value) * parseInputToNumber(packaging_consumption_year.value);

        sum = sum + parseInputToNumber(sum_cost_employee.value) + parseInputToNumber(equipment_annual_cost.value) + parseInputToNumber(packaging_cost_year.value);
        
        input.value = sum;

        total_sterilization_reusable = total_sterilization_reusable + parseInputToNumber(input.value);

        approximate_count_hours.value = formatWithSpaces(roundTwo(parseInputToNumber(approximate_count_hours.value)));
        weight_product.value = formatWithSpaces(roundTwo(parseInputToNumber(weight_product.value)));
        sum_cost_employee.value = formatWithSpaces(roundTwo(parseInputToNumber(sum_cost_employee.value)));
        equipment_annual_cost.value = formatWithSpaces(roundTwo(parseInputToNumber(equipment_annual_cost.value)));
        packaging_cost_year.value = formatWithSpaces(roundTwo(parseInputToNumber(packaging_cost_year.value)));

        input.value = formatWithSpaces(roundTwo(parseInputToNumber(input.value)));
    });

    //Ремонт (для многоразовых)
    let cost_repair_sum_inputs = document.querySelectorAll('input[data-name-process="repair"][data-name-indicator="repair_cost_sum"]');

    cost_repair_sum_inputs.forEach(input => {
        let product_type = input.dataset.nameType;
        let product_name = input.dataset.nameProduct;

        let sum = 0;

        let hours_per_year = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="repair"][data-name-indicator="hours_per_year"]');
        let employee_count = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="repair"][data-name-indicator="employee_count"]');
        let employee_hour_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="repair"][data-name-indicator="employee_hour_cost"]');
        let sum_cost_employee = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="repair"][data-name-indicator="sum_cost_employee"]');

        let materials_cost = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="repair"][data-name-indicator="materials_cost"]');

        //Затраты на персонал
        sum_cost_employee.value = (parseInputToNumber(employee_count.value) * parseInputToNumber(hours_per_year.value) * parseInputToNumber(employee_hour_cost.value)) + (parseInputToNumber(employee_count.value) * price_medosmotr);

        total_cost_employee_reusable = total_cost_employee_reusable + parseInputToNumber(sum_cost_employee.value);

        sum = sum + parseInputToNumber(sum_cost_employee.value) + parseInputToNumber(materials_cost.value);
        
        input.value = sum;

        total_repair_reusable = total_repair_reusable + parseInputToNumber(input.value);

        sum_cost_employee.value = formatWithSpaces(roundTwo(parseInputToNumber(sum_cost_employee.value)));

        input.value = formatWithSpaces(roundTwo(parseInputToNumber(input.value)));
    });

    //Итого
    let total_all_process_inputs = document.querySelectorAll('input[data-name-process="total"][data-name-indicator="all_process"]');

    total_all_process_inputs.forEach(input => {
        let product_type = input.dataset.nameType;
        let product_name = input.dataset.nameProduct;

        if (product_type == 'disposable') {
            let sum_year_purchase = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="purchase"][data-name-indicator="sum_year"]');
            let sum_year_storage = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="storage"][data-name-indicator="sum_year"]');
            let sum_year_transportation = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="sum_year"]');
            let total_cost_waste_disinfection = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="waste_disinfection"][data-name-indicator="total_cost"]');

            input.value = formatWithSpaces(parseInputToNumber(sum_year_purchase.value) + parseInputToNumber(sum_year_storage.value) + parseInputToNumber(sum_year_transportation.value) + parseInputToNumber(total_cost_waste_disinfection.value));

            total_disposable = total_disposable + parseInputToNumber(input.value);

        } else {
            let sum_year_purchase = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="purchase"][data-name-indicator="sum_year"]');
            let sum_year_rent = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="rent"][data-name-indicator="sum_year"]');
            let sum_year_storage = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="storage"][data-name-indicator="sum_year"]');
            let sum_year_transportation = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="transportation"][data-name-indicator="sum_year"]');
            let total_cost_disinfection = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="disinfection"][data-name-indicator="cost_disinfection_sum"]');
            let total_cost_washing = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="washing"][data-name-indicator="cost_washing_ironing_sum"]');
            let total_cost_sterilization = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="sterilization"][data-name-indicator="sterilization_cost_sum"]');
            let total_cost_repair = document.querySelector('input[data-name-type="' + product_type + '"][data-name-product="' + product_name + '"][data-name-process="repair"][data-name-indicator="repair_cost_sum"]');

            input.value = formatWithSpaces (parseInputToNumber(sum_year_purchase.value) + parseInputToNumber(sum_year_rent.value) + parseInputToNumber(sum_year_storage.value) + parseInputToNumber(sum_year_transportation.value) + parseInputToNumber(total_cost_disinfection.value) + parseInputToNumber(total_cost_washing.value) + parseInputToNumber(total_cost_sterilization.value) + parseInputToNumber(total_cost_repair.value));

            total_reusable = total_reusable + parseInputToNumber(input.value);
        }

    });

    //!! Здесь для каждого тотала вычтем sum_equipment

    let total_purchase = total_purchase_disposable + total_purchase_reusable;
    document.querySelector('#total_purchase').textContent = formatWithSpaces(total_purchase);
    document.querySelector('#total_purchase_disposable').textContent = formatWithSpaces(total_purchase_disposable);
    document.querySelector('#total_purchase_reusable').textContent = formatWithSpaces(total_purchase_reusable);

    let total_rent = total_rent_reusable;
    document.querySelector('#total_rent_reusable').textContent = formatWithSpaces(total_rent_reusable);

    let total_storage = total_storage_disposable + total_storage_reusable;
    document.querySelector('#total_storage').textContent = formatWithSpaces(total_storage);
    document.querySelector('#total_storage_disposable').textContent = formatWithSpaces(total_storage_disposable);
    document.querySelector('#total_storage_reusable').textContent = formatWithSpaces(total_storage_reusable);

    let total_transportation = total_transportation_disposable + total_transportation_reusable;
    document.querySelector('#total_transportation').textContent = formatWithSpaces(total_transportation);
    document.querySelector('#total_transportation_disposable').textContent = formatWithSpaces(total_transportation_disposable);
    document.querySelector('#total_transportation_reusable').textContent = formatWithSpaces(total_transportation_reusable);

    let total_waste_disinfection = total_waste_disinfection_disposable - total_waste_disinfection_repeat_equipment;
    document.querySelector('#total_waste_disinfection').textContent = formatWithSpaces(total_waste_disinfection);

    let total_disinfection = total_disinfection_reusable;
    document.querySelector('#total_disinfection').textContent = formatWithSpaces(total_disinfection);
    
    let total_washing = total_washing_reusable - total_washing_repeat_equipment;
    document.querySelector('#total_washing').textContent = formatWithSpaces(total_washing);

    let total_sterilization = total_sterilization_reusable - total_sterilization_repeat_equipment;
    document.querySelector('#total_sterilization').textContent = formatWithSpaces(total_sterilization);

    let total_repair = total_repair_reusable;
    document.querySelector('#total_repair').textContent = formatWithSpaces(total_repair);

    let total = total_disposable + total_reusable - (total_disposable_repeat_equipment + total_reusable_repeat_equipment);
    total_disposable = total_disposable - total_disposable_repeat_equipment;
    total_reusable = total_reusable - total_reusable_repeat_equipment;

    document.querySelector('#total').textContent = formatWithSpaces(total);
    document.querySelector('#total_table').textContent = formatWithSpaces(total);
    document.querySelector('#total_disposable').textContent = formatWithSpaces(total_disposable);
    document.querySelector('#total_reusable').textContent = formatWithSpaces(total_reusable);

    document.querySelector('#total_disposable_cost_employee').textContent = formatWithSpaces(total_cost_employee_disposable);
    document.querySelector('#total_reusable_cost_employee').textContent = formatWithSpaces(total_cost_employee_reusable);

    rebuildTable();
}

// Замена токенов в атрибутах и тексте (disposable → type, diapers → product, "Пеленки/простыни" → productName)
// --- Функция замены токенов (без изменений) ---
function replaceTokens(node, type, product, productName) {
    const replaceInString = (str) => {
        if (!str) return str;
        return str
            .replace(/disposable/g, type)
            .replace(/diapers/g, product)
            .replace(/Пеленки\/простыни/g, productName);
    };
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
        const currentNode = walker.currentNode;
        if (currentNode.nodeType === Node.ELEMENT_NODE) {
            Array.from(currentNode.attributes).forEach(attr => {
                attr.value = replaceInString(attr.value);
            });
        } else if (currentNode.nodeType === Node.TEXT_NODE) {
            currentNode.textContent = replaceInString(currentNode.textContent);
        }
    }
}

// --- Создание блока из шаблона по типу ---
function createProductBlock(type, product, productName) {
    const templateId = `product-group-template-${type}`;
    const template = document.getElementById(templateId);
    if (!template) {
        console.error(`Шаблон с id "${templateId}" не найден`);
        return null;
    }
    const clone = template.content.cloneNode(true);
    const block = clone.firstElementChild;
    replaceTokens(block, type, product, productName);
    block.id = `${type}_${product}_group`;
    block.classList.remove('dropdown__group_hidden');
    let type_calculation_value = document.querySelector('input[name="type_calculation"]:checked').value;
    if (type_calculation_value != 'Оценка фактических затрат') {
        if (type == 'disposable') {
            let disposable_dop_forms = block.querySelectorAll(".disposable_dop_form");
            disposable_dop_forms.forEach(form => {
                form.classList.remove('dop_form_hidden');
            });
            
        }
        if (type == 'reusable') {
            let reusable_dop_forms = block.querySelectorAll(".reusable_dop_form");
            reusable_dop_forms.forEach(form => {
                form.classList.remove('dop_form_hidden');
            });
        }
    }
    if (product == 'other') {
        let other_blocks = block.querySelectorAll(".other");
        other_blocks.forEach(other_block => {
            other_block.classList.add('other_hidden');
        });
    }

    let choose_products;

    if (type_calculation_value != 'Оценка затрат на переход с многоразовых на одноразовые изделия') {
        choose_products = document.querySelectorAll('input[name="' + type + '_product"]:checked');
    } else {
        choose_products = document.querySelectorAll('input[name="switching_cost_product"]:checked');
    }

    if (choose_products.length > 1) {
        let indicated_equipment_blocks = block.querySelectorAll('.indicated_equipment_block');
        indicated_equipment_blocks.forEach(indicated_equipment_block => {
            indicated_equipment_block.classList.add('active');
        });
    }

    return block;
}

// --- Определение контейнера для блока по типу ---
function getContainerByType(type) {
    let selector;
    if (type === 'disposable') {
        selector = '#disposable_group .dropdown__content';
    } else if (type === 'reusable') {
        selector = '#reusable_group .dropdown__content';
    } else {
        console.error(`Неизвестный тип: ${type}`);
        return null;
    }
    return document.querySelector(selector);
}

// Хранилище активных продуктов: { "тип_продукт": { type, product, productName } }
let activeProducts = {};

function rebuildTable() {

    let chkbox_value = {
            'y': 'Да',
            'n': 'Нет',
        };

    const table = document.getElementById('result_table');
    if (!table) return;

    const thead = table.querySelector('thead');
    const firstRow = thead.querySelector('tr:first-child');
    let secondRow = thead.querySelector('tr:nth-child(2)');

    // Удаляем старую вторую строку, если есть
    if (secondRow) {
        secondRow.remove();
    }

    // Создаём новую вторую строку
    secondRow = document.createElement('tr');
    secondRow.id = 'product-header-row';

    // Получаем отсортированный список продуктов: сначала disposable, потом reusable
    const products = Object.values(activeProducts).sort((a, b) => {
        if (a.type === b.type) return 0;
        return a.type === 'disposable' ? -1 : 1;
    });

    // Добавляем заголовки во вторую строку
    products.forEach(p => {
        const th = document.createElement('th');
        th.setAttribute('data-product-id', `${p.type}_${p.product}`);
        th.textContent = p.productName;
        secondRow.appendChild(th);
    });

    thead.appendChild(secondRow);

    // Обновляем colspan групп в первой строке
    const disposableCount = products.filter(p => p.type === 'disposable').length;
    const reusableCount = products.filter(p => p.type === 'reusable').length;

    const disposableGroup = firstRow.querySelector('th[data-group="disposable"]');
    const reusableGroup = firstRow.querySelector('th[data-group="reusable"]');

    if (disposableGroup) {
        disposableGroup.setAttribute('colspan', disposableCount || 1); // если 0, можно скрыть, но для минимальной ширины оставим 1
        if (disposableCount === 0) disposableGroup.style.display = 'none'; else disposableGroup.style.display = '';
    }
    if (reusableGroup) {
        reusableGroup.setAttribute('colspan', reusableCount || 1);
        if (reusableCount === 0) reusableGroup.style.display = 'none'; else reusableGroup.style.display = '';
    }

    // Перестраиваем тело таблицы
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');

    // Для каждой строки (кроме строки с rowspan) удаляем старые ячейки данных и добавляем новые
    rows.forEach(row => {
        if (row.querySelector('td[rowspan]')) return; // пропускаем строку с rowspan

        // Удаляем все ячейки, которые были добавлены ранее (кроме первых двух: показатель и итого)
        while (row.children.length > 2) {
            row.removeChild(row.lastChild);
        }

        // Добавляем новые ячейки в правильном порядке
        products.forEach(p => {
            const td = document.createElement('td');
            td.setAttribute('data-product-id', `${p.type}_${p.product}`);

            const process = row.dataset.process;
            const indicator = row.dataset.indicator;
            let value = '-';
            if (process && indicator) {
                const inputId = `${p.type}_${p.product}_${process}_${indicator}`;
                const input = document.getElementById(inputId);
                if (input) {
                    value = input.value;
                } else {
                    const chkbox = document.querySelector('input[data-name-type="' + p.type + '"][data-name-product="' + p.product + '"][data-name-process="' + process + '"][data-name-indicator="' + indicator + '"]:checked');
                    if (chkbox) {
                        value = chkbox_value[chkbox.value];
                    }
                }
            }
            td.textContent = value;
            row.appendChild(td);
        });
    });
}

function addColumnToTable(type, product, productName) {
    const key = `${type}_${product}`;
    if (!activeProducts[key]) {
        activeProducts[key] = { type, product, productName };
        rebuildTable();
    }
}

function hideColumn(type, product) {
    const key = `${type}_${product}`;
    if (activeProducts[key]) {
        delete activeProducts[key];
        rebuildTable();
    }
}

function showColumn(type, product) {
    const productId = `${type}_${product}`;
    const table = document.getElementById('result_table');
    if (!table) return;

    const header = table.querySelector(`#product-header-row th[data-product-id="${productId}"]`);
    if (header) header.classList.remove('hidden');

    const cells = table.querySelectorAll(`tbody td[data-product-id="${productId}"]`);
    cells.forEach(cell => cell.classList.remove('hidden'));
}

// --- Обработка изменения чекбокса ---
function handleCheckboxChange(checkbox, type_calc) {
    if (type_calc == 'switching_calc') {
        const product = checkbox.dataset.nameProduct;
        const productName = checkbox.value;
        const disposable_blockId = `disposable_${product}_group`;
        let reusable_blockId ;

        if (product == 'non_woven_shoe') {
            reusable_blockId = `reusable_reusable_woven_shoe_group`;
        } else {
            reusable_blockId = `reusable_${product}_group`;
        }

        const disposable_container = getContainerByType('disposable');
        if (!disposable_container) {
            console.error(`Контейнер для типа 'disposable' не найден`);
            return;
        }

        const reusable_container = getContainerByType('reusable');
        if (!reusable_container) {
            console.error(`Контейнер для типа 'reusable' не найден`);
            return;
        }

        let disposable_block = document.getElementById(disposable_blockId);
        let reusable_block = document.getElementById(reusable_blockId);

        let disposable_type_group = document.querySelector("#disposable_group");
        let reusable_type_group = document.querySelector("#reusable_group");

        disposable_type_group.classList.remove('dropdown__group_hidden');
        disposable_type_group.classList.add('dropdown__group_active');

        reusable_type_group.classList.remove('dropdown__group_hidden');
        reusable_type_group.classList.add('dropdown__group_active');


        if (checkbox.checked) {
            // Если блок ещё не создан, создаём
            if (!disposable_block) {
                disposable_block = createProductBlock('disposable', product, productName);
                if (disposable_block) {
                    disposable_container.appendChild(disposable_block);
                }
            } else {
                // Если блок уже есть, показываем его
                disposable_block.classList.remove('dropdown__group_hidden');
            }
            // Добавляем/показываем столбец в таблице
            addColumnToTable('disposable', product, productName);

            if (!reusable_block) {
                if (product == 'non_woven_shoe') {
                    reusable_block = createProductBlock('reusable', 'reusable_woven_shoe', 'Тканевые бахилы');
                } else {
                    reusable_block = createProductBlock('reusable', product, productName);
                }
                if (reusable_block) {
                    reusable_container.appendChild(reusable_block);
                }
            } else {
                // Если блок уже есть, показываем его
                reusable_block.classList.remove('dropdown__group_hidden');
            }
            // Добавляем/показываем столбец в таблице
            if (product == 'non_woven_shoe') {
                addColumnToTable('reusable', 'reusable_woven_shoe', 'Тканевые бахилы');
            } else {
                addColumnToTable('reusable', product, productName);
            }
        } else {
            // Скрываем блок и столбец
            if (disposable_block) {
                // disposable_block.classList.add('dropdown__group_hidden');
                resetInputsInBlock(disposable_blockId);
                disposable_block.remove();
            }
            hideColumn('disposable', product);

            if (reusable_block) {
                // reusable_block.classList.add('dropdown__group_hidden');
                resetInputsInBlock(reusable_blockId);
                reusable_block.remove();
            }
            if (product == 'non_woven_shoe') {
                hideColumn('reusable', 'reusable_woven_shoe');
            } else {
                hideColumn('reusable', product);
            }
        }

    } else {
        const type = checkbox.dataset.nameType;
        const product = checkbox.dataset.nameProduct;
        const productName = checkbox.value;
        const blockId = `${type}_${product}_group`;

        const container = getContainerByType(type);
        if (!container) {
            console.error(`Контейнер для типа "${type}" не найден`);
            return;
        }

        let block = document.getElementById(blockId);

        if (checkbox.checked) {
            // Если блок ещё не создан, создаём
            if (!block) {
                block = createProductBlock(type, product, productName);
                if (block) {
                    container.appendChild(block);
                }
            } else {
                // Если блок уже есть, показываем его
                block.classList.remove('dropdown__group_hidden');
            }
            // Добавляем/показываем столбец в таблице
            addColumnToTable(type, product, productName);
        } else {
            // Скрываем блок и столбец
            if (block) {
                // block.classList.add('dropdown__group_hidden');
                resetInputsInBlock(blockId);
                block.remove();
            }
            hideColumn(type, product);
        }
    }

    //!!!Создать и вызвать функцию, которая проверяет сколько выбрано продуктов в группе и открывает нужный блок
}

// --- Инициализация для уже отмеченных чекбоксов ---
const checkboxes = document.querySelectorAll('input[type="checkbox"][data-name-type][data-name-product]');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => handleCheckboxChange(checkbox, 'actual_and_manipulation_calc'));
    if (checkbox.checked) {
        handleCheckboxChange(checkbox, 'actual_and_manipulation_calc');
    }
});

const switch_calc_checkboxes = document.querySelectorAll('input[type="checkbox"][data-name-type-calculating][data-name-product]');
switch_calc_checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => handleCheckboxChange(checkbox, 'switching_calc'));
    if (checkbox.checked) {
        handleCheckboxChange(checkbox, 'switching_calc');
    }
});

// Сворачивание строк таблицы
const resultTable = document.getElementById('result_table');
if (resultTable) {
    // Словарь для преобразования текста ячейки в data-process
    const groupMapping = {
        'Закупка': 'purchase',
        'Аренда': 'rent',
        // добавьте другие группы
    };

    resultTable.addEventListener('click', (e) => {
        const cell = e.target.closest('td[rowspan]');
        if (!cell) return;

        // Определяем ключ группы
        let groupKey = cell.getAttribute('data-group');
        if (!groupKey) {
            const groupName = cell.textContent.trim();
            groupKey = groupMapping[groupName] || groupName.toLowerCase().replace(/\s+/g, '_');
        }

        const tbody = cell.closest('tbody');
        const allRows = Array.from(tbody.children);
        const currentRow = cell.closest('tr');
        const currentIndex = allRows.indexOf(currentRow);

        // Находим все строки, относящиеся к этой группе (идут подряд начиная с currentRow)
        let groupRows = [];
        let index = currentIndex;
        while (index < allRows.length) {
            const row = allRows[index];
            // Если это строка с rowspan, но не текущая, значит началась новая группа
            if (row !== currentRow && row.querySelector('td[rowspan]')) break;
            // Если строка имеет data-process, равный groupKey, или если это самая первая строка, то включаем
            if (row === currentRow || row.dataset.process === groupKey) {
                groupRows.push(row);
            } else {
                // Если data-process другой, и это не текущая строка, то группа закончилась
                break;
            }
            index++;
        }

        if (groupRows.length <= 1) return; // нет строк кроме заголовка

        // Разделяем на детальные и итоговые (которые не скрываем)
        const detailRows = groupRows.filter(row => {
            if (row === currentRow) return false;
            const indicator = row.dataset.indicator;
            return indicator !== 'sum_year' && indicator !== 'sum_year_reusable' && indicator !== 'sum_year_disposable';
        });
        const summaryRows = groupRows.filter(row => {
            if (row === currentRow) return false;
            const indicator = row.dataset.indicator;
            return indicator === 'sum_year' || indicator === 'sum_year_reusable' || indicator === 'sum_year_disposable';
        });

        if (detailRows.length === 0) return;

        const isCollapsed = detailRows[0].classList.contains('collapsed');
        const originalRowspan = parseInt(cell.getAttribute('data-original-rowspan') || cell.getAttribute('rowspan'), 10);

        if (isCollapsed) {
            // Разворачиваем: восстанавливаем rowspan, показываем строки
            cell.setAttribute('rowspan', originalRowspan);
            cell.removeAttribute('data-original-rowspan');
            detailRows.forEach(r => r.classList.remove('collapsed'));
            cell.classList.remove('collapsed-header');
        } else {
            // Сворачиваем: уменьшаем rowspan на количество детальных строк
            const currentRowspan = parseInt(cell.getAttribute('rowspan'), 10);
            if (!cell.hasAttribute('data-original-rowspan')) {
                cell.setAttribute('data-original-rowspan', currentRowspan);
            }
            const newRowspan = currentRowspan - detailRows.length;
            cell.setAttribute('rowspan', newRowspan);
            detailRows.forEach(r => r.classList.add('collapsed'));
            cell.classList.add('collapsed-header');
        }
    });
}