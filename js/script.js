let dropdown__groups = document.querySelectorAll('.dropdown__group');

//Открываем список подгрупп
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

            type_group.classList.remove('dropdown__group_active');
            type_group.classList.add('dropdown__group_hidden');
        }
    });
});


const inputs = document.querySelectorAll('.form__input');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        if (this.value === '0') {
            this.value = '';
        }
    });

    input.addEventListener('blur', function() {
        if (this.value.trim() === '') this.value = '0';
    });
});

const price_medosmotr = 2000; //Средняя стоимость периодического медосмотра, руб
const one_load_obezzaraz = 4; //Одна загрузка обеззараживания многоразовых изделий, кг
const time_on_load_and_unload_obezzaraz = 0.5; //Время, затрачиваемое на загрузку и выгрузку многоразовых изделий на 1 цикл обеззараживания, ч
const time_on_load_and_unload_clean = 0.5; //Время, затрачиваемое на загрузку и выгрузку многоразовых изделий на 1 цикл стирки, ч
const time_on_load_and_unload_waste = 1; //Время, затрачиваемое на загрузку, выгрузку отходов в 1 цикл обеззараживания, ч
const time_on_load_and_unload_sterilize = 0.5; //Время, затрачиваемое на загрузку, выгрузку изделий на 1 цикл стерилизации, ч

function recount () {

}

function ResultSubmit () {
    console.log(document.querySelector("#reusable_absorbent_diapers_repair_frequency").value);
    
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
                let value = '0';
                if (process && indicator) {
                    const inputId = `${p.type}_${p.product}_${process}_${indicator}`;
                    const input = document.getElementById(inputId);
                    if (input) {
                        value = input.value;
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
    function handleCheckboxChange(checkbox) {
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
                block.classList.add('dropdown__group_hidden');
            }
            hideColumn(type, product);
        }
    }

    // --- Инициализация для уже отмеченных чекбоксов ---
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-name-type][data-name-product]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => handleCheckboxChange(checkbox));
        if (checkbox.checked) {
            handleCheckboxChange(checkbox);
        }
    });