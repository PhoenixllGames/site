// support.js

document.addEventListener('DOMContentLoaded', () => {
    const supportContent = document.getElementById('support-content');
    supportContent.innerHTML = '<div class="loading-spinner"></div>';

    fetch('https://website.jshsh6.workers.dev/support')
        .then(response => response.json())
        .then(data => {
            if (supportContent) {
                supportContent.innerHTML = '';
                const grid = document.createElement('div');
                grid.classList.add('content-grid');
                data.forEach(item => {
                    const article = document.createElement('article');
                    article.classList.add('content-item');
                    article.innerHTML = `
                        <img src="${item.picture}" alt="${item.title}">
                        <h3>${item.title}</h3>
                        <p>${item.text}</p>
                        ${item.link && item.button ? `<a target="_blank" href="${item.link}" class="content-button">${item.button}</a>` : ''}
                    `;
                    grid.appendChild(article);
                });
                supportContent.appendChild(grid);
            }
        })
        .catch(error => console.error('Error fetching support:', error));
});