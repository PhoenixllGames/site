// news.js

document.addEventListener('DOMContentLoaded', () => {
    const newsContent = document.getElementById('news-content');
    newsContent.innerHTML = '<div class="loading-spinner"></div>';

    const newsName = window.location.hash.substring(1);

    if (!newsName) {
        newsContent.innerHTML = '<p>Новость не найдена.</p>';
        return;
    }

    fetch(`https://website.jshsh6.workers.dev/${newsName}`)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length === 1 && Array.isArray(data[0])) {
                data = data[0];
            }
            newsContent.innerHTML = '';
            data.forEach(section => {
                const sectionDiv = document.createElement('div');
                sectionDiv.classList.add('news-section');

                const title = document.createElement('h2');
                title.textContent = section.title;
                sectionDiv.appendChild(title);

                const keys = Object.keys(section).filter(key => key !== 'title');

                keys.sort((a, b) => {
                    const typeA = a.match(/^[a-z]+/)[0];
                    const numA = parseInt(a.match(/\d+$/)[0] || 0);
                    const typeB = b.match(/^[a-z]+/)[0];
                    const numB = parseInt(b.match(/\d+$/)[0] || 0);
                    if (typeA === typeB) {
                        return numA - numB;
                    }
                    return typeA.localeCompare(typeB);
                });

                keys.forEach(key => {
                    const value = section[key].trim();
                    if (!value) return;

                    if (key.startsWith('picture')) {
                        const img = document.createElement('img');
                        img.src = value;
                        img.alt = 'Изображение';
                        img.classList.add('news-image');
                        sectionDiv.appendChild(img);
                    } else if (key.startsWith('text')) {
                        const p = document.createElement('p');
                        p.textContent = value;
                        p.classList.add('news-text');
                        sectionDiv.appendChild(p);
                    } else if (key.startsWith('video')) {
                        const wrapper = document.createElement('div');
                        wrapper.classList.add('news-video-wrapper');

                        const iframe = document.createElement('iframe');
                        const videoId = value.split('v=')[1] || value.split('/').pop();
                        iframe.src = `https://www.youtube.com/embed/${videoId}`;
                        iframe.classList.add('news-video');
                        iframe.allowFullscreen = true;

                        wrapper.appendChild(iframe);
                        sectionDiv.appendChild(wrapper);
                    }
                });

                newsContent.appendChild(sectionDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            newsContent.innerHTML = '<p>Ошибка загрузки новости.</p>';
        });
});