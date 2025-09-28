// other.js

document.addEventListener('DOMContentLoaded', () => {
    const otherContent = document.getElementById('other-content');
    otherContent.innerHTML = '<div class="loading-spinner"></div>';

    fetch('https://website.jshsh6.workers.dev/other')
        .then(response => response.json())
        .then(data => {
            if (otherContent) {
                otherContent.innerHTML = '';
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
                otherContent.appendChild(grid);
            }
        })
        .catch(error => console.error('Error fetching other:', error));
});