// games.js
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('games-boxes');
    const searchInput = document.getElementById('game-search');
    container.innerHTML = '<div class="loading-spinner"></div>';

    fetch('https://web-games.jshsh6.workers.dev/')
        .then(response => response.json())
        .then(data => {
            const games = [];
            for (const [slug, arr] of Object.entries(data)) {
                const game = arr[0];
                game.slug = slug;
                games.push(game);
            }
            if (container) {
                container.innerHTML = '';
                games.forEach((game, index) => {
                    const div = document.createElement('div');
                    div.classList.add('game-box');
                    div.style.setProperty('--order', index);
                    div.innerHTML = `
                        <h2>${game.title}</h2>
                        <img src="${game.picture}" alt="${game.title}" class="game-photo">
                        <div class="game-rating">${generateStars(game.stars)}</div>
                        <button class="read-button" data-index="${index}">Читать</button>
                    `;
                    if (game.title.toLowerCase() === 'а чо я тут забыл?') {
                        div.style.display = 'none';
                    }
                    container.appendChild(div);
                });

                const readButtons = container.querySelectorAll('.read-button');
                readButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const index = button.dataset.index;
                        const game = games[index];
                        showModal(game);
                    });
                });

                const hash = window.location.hash.substring(1);
                if (hash) {
                    const game = games.find(g => g.slug === hash);
                    if (game) {
                        showModal(game);
                    }
                }
            }

            searchInput.addEventListener('input', (e) => {
                let query = e.target.value.trim().toLowerCase();
                const boxes = container.querySelectorAll('.game-box');
                if (query === 'my energy is monster') {
                    boxes.forEach(box => {
                        const title = box.querySelector('h2').textContent.toLowerCase();
                        box.style.display = (title === 'а чо я тут забыл?') ? 'block' : 'none';
                    });
                } else {
                    boxes.forEach(box => {
                        const title = box.querySelector('h2').textContent.toLowerCase();
                        if (title === 'а чо я тут забыл?') {
                            box.style.display = 'none';
                        } else {
                            box.style.display = title.includes(query) ? 'block' : 'none';
                        }
                    });
                }
            });
        })
        .catch(error => console.error('Error fetching games:', error));

    function generateStars(stars) {
        stars = parseFloat(stars);
        const full = Math.floor(stars);
        const half = stars % 1 >= 0.5 ? 1 : 0;
        const empty = 5 - full - half;
        let html = '';
        for (let i = 0; i < full; i++) html += '<img src="img/games/rait/1.png" alt="full star" class="star-icon">';
        if (half) html += '<img src="img/games/rait/0.5.png" alt="half star" class="star-icon">';
        for (let i = 0; i < empty; i++) html += '<img src="img/games/rait/0.png" alt="empty star" class="star-icon">';
        return html;
    }

    function processList(text) {
        return text.split(' -').filter(part => part.trim() !== '').map(part => part.trim()).join('<br>');
    }

    function showModal(game) {
        const modal = document.getElementById('details-modal');
        const title = document.getElementById('modal-title');
        const content = document.getElementById('modal-content');
        title.textContent = game.title;
        content.innerHTML = `
            <img src="${game.picture}" alt="${game.title}" class="game-photo">
            <div class="game-rating">${generateStars(game.stars)}</div>
            <p class="game-text">${game.text}</p>
            <p class="game-pos">${processList(game['text-pos'])}</p>
            <p class="game-neg">${processList(game['text-neg'])}</p>
            <div class="buttons">
                <a href="${game['link-store']}" target="_blank" class="store-button">${game.button}</a>
                <button class="share-button">Поделиться</button>
            </div>
        `;
        const shareButton = content.querySelector('.share-button');
        shareButton.addEventListener('click', () => {
            const shareUrl = `${window.location.origin}/games#${game.slug}`;
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert('Ссылка скопирована!');
            }).catch(err => {
                console.error('Error copying:', err);
            });
        });
        modal.classList.add('active');
        modal.style.display = 'flex';
    }

    const modal = document.getElementById('details-modal');
    const closeModal = modal.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            modal.style.display = 'none';
            document.getElementById('modal-content').innerHTML = '';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
            document.getElementById('modal-content').innerHTML = '';
        }
    });
});