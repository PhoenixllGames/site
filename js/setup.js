// setup.js

document.addEventListener('DOMContentLoaded', () => {
    const categories = ['setup', 'peripherals', 'audio']; 

    const container = document.getElementById('setup-boxes');
    container.innerHTML = '<div class="loading-spinner"></div>';

    fetch('https://website.jshsh6.workers.dev/setup-box')
        .then(response => response.json())
        .then(boxes => {
            if (container) {
                container.innerHTML = '';
                boxes.forEach((box, index) => {
                    const div = document.createElement('div');
                    div.classList.add('setup-box');
                    div.style.setProperty('--order', index);
                    div.innerHTML = `
                        <h2>${box.title}</h2>
                        <img src="${box.picture}" alt="${box.title}" class="setup-photo">
                        <p class="setup-text"></p>
                        <button class="details-button" data-category="${categories[index]}">Подробно</button>
                    `;
                    const text = div.querySelector('.setup-text');
                    text.innerHTML = box.text.replace(/,/g, '<br>'); 
                    container.appendChild(div);
                });

                const detailsButtons = container.querySelectorAll('.details-button');
                detailsButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const category = button.dataset.category;
                        const modal = document.getElementById('details-modal');
                        const title = document.getElementById('modal-title');
                        const list = modal.querySelector('.setup-list');
                        list.classList.remove('expanded');
                        list.classList.add('loading');
                        list.innerHTML = '<div class="loading-spinner"></div>';

                        title.textContent = button.parentElement.querySelector('h2').textContent;

                        fetch(`https://website.jshsh6.workers.dev/${category}`)
                            .then(response => response.json())
                            .then(data => {
                                list.innerHTML = '';
                                data.forEach(item => {
                                    const li = document.createElement('li');
                                    li.innerHTML = `<strong>${item.name}:</strong> ${item.value}`;
                                    list.appendChild(li);
                                });
                                list.classList.remove('loading');
                                list.classList.add('expanded');
                            })
                            .catch(error => console.error(`Error fetching ${category}:`, error));

                        modal.classList.add('active');
                        modal.style.display = 'flex';
                    });
                });
            }
        })
        .catch(error => console.error('Error fetching setup boxes:', error));

    const modal = document.getElementById('details-modal');
    const closeModal = modal.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            modal.style.display = 'none';
            const list = modal.querySelector('.setup-list');
            if (list) {
                list.classList.remove('loading', 'expanded');
                list.innerHTML = '';
            }
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
            const list = modal.querySelector('.setup-list');
            if (list) {
                list.classList.remove('loading', 'expanded');
                list.innerHTML = '';
            }
        }
    });
});