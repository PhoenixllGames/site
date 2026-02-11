// utils.js - Общие утилиты для всех страниц

// Безопасное экранирование HTML для предотвращения XSS
function escapeHtml(unsafe) {
    const div = document.createElement('div');
    div.textContent = unsafe;
    return div.innerHTML;
}

// Универсальная функция для fetch с обработкой ошибок
async function fetchContent(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching content:', error);
        throw error;
    }
}

// Показать индикатор загрузки
function showLoading(element) {
    if (element) {
        element.innerHTML = '<div class="loading-spinner"></div>';
    }
}

// Показать сообщение об ошибке
function showError(element, message = 'Не удалось загрузить данные. Попробуйте позже.') {
    if (element) {
        element.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #f44336;">
                <p style="font-size: 18px; margin-bottom: 16px;">⚠️ ${escapeHtml(message)}</p>
                <button onclick="location.reload()" style="padding: 10px 20px; background-color: #bb86fc; color: #121212; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">
                    Перезагрузить страницу
                </button>
            </div>
        `;
    }
}

// Класс для управления модальными окнами
class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        if (!this.modal) {
            console.error(`Modal with id "${modalId}" not found`);
            return;
        }

        this.closeButton = this.modal.querySelector('.close-modal');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Закрытие по клику на крестик
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.close());
        }

        // Закрытие по клику вне модального окна
        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.close();
            }
        });

        // Закрытие по ESC
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    open(content) {
        if (!this.modal) return;

        const modalContent = this.modal.querySelector('.modal-content');
        if (modalContent && content) {
            // Очищаем старый контент
            const existingContent = modalContent.querySelector('.modal-body');
            if (existingContent) {
                existingContent.remove();
            }

            // Добавляем новый контент
            const bodyDiv = document.createElement('div');
            bodyDiv.className = 'modal-body';
            bodyDiv.innerHTML = content;
            modalContent.appendChild(bodyDiv);
        }

        this.modal.style.display = 'flex';
        setTimeout(() => {
            this.modal.classList.add('active');
        }, 10);

        // Блокируем прокрутку body
        document.body.style.overflow = 'hidden';
    }

    close() {
        if (!this.modal) return;

        this.modal.classList.remove('active');
        setTimeout(() => {
            this.modal.style.display = 'none';
        }, 300);

        // Восстанавливаем прокрутку body
        document.body.style.overflow = '';
    }
}

// Функция для создания сетки контента (для about, contact, support, other)
function renderContentGrid(container, data) {
    if (!container) return;

    container.innerHTML = '';

    if (!data || data.length === 0) {
        showError(container, 'Нет данных для отображения');
        return;
    }

    const grid = document.createElement('div');
    grid.classList.add('content-grid');

    data.forEach(item => {
        const article = document.createElement('article');
        article.classList.add('content-item');

        const imgHtml = item.picture ?
            `<img src="${escapeHtml(item.picture)}" alt="${escapeHtml(item.title || 'Изображение')}" loading="lazy">` : '';

        const buttonHtml = item.link && item.button ?
            `<a target="_blank" rel="noopener noreferrer" href="${escapeHtml(item.link)}" class="content-button">${escapeHtml(item.button)}</a>` : '';

        article.innerHTML = `
            ${imgHtml}
            <h3>${escapeHtml(item.title || '')}</h3>
            <p>${escapeHtml(item.text || '')}</p>
            ${buttonHtml}
        `;

        grid.appendChild(article);
    });

    container.appendChild(grid);
}

// Функция для загрузки контента с обработкой ошибок
async function loadContent(elementId, endpoint, renderFunction) {
    const element = document.getElementById(elementId);

    if (!element) {
        console.error(`Element with id "${elementId}" not found`);
        return;
    }

    showLoading(element);

    try {
        const data = await fetchContent(endpoint);
        renderFunction(element, data);
    } catch (error) {
        showError(element);
    }
}
