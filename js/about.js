// about.js

document.addEventListener('DOMContentLoaded', () => {
    const aboutContent = document.getElementById('about-content');
    aboutContent.innerHTML = '<div class="loading-spinner"></div>';

    fetch('https://website.jshsh6.workers.dev/about')
        .then(response => response.json())
        .then(data => {
            if (aboutContent) {
                aboutContent.innerHTML = '';
                const grid = document.createElement('div');
                grid.classList.add('content-grid');
                data.forEach(item => {
                    const article = document.createElement('article');
                    article.classList.add('content-item');
                    article.innerHTML = `
                        <img src="${item.picture}" alt="${item.title}">
                        <h3>${item.title}</h3>
                        <p>${item.text}</p>
                    `;
                    grid.appendChild(article);
                });
                aboutContent.appendChild(grid);
            }
        })
        .catch(error => console.error('Error fetching about:', error));
});