// main.js

document.addEventListener('DOMContentLoaded', () => {
    let videos = [];
    let currentIndex = 0;
    let slideDuration = 5000;
    let timer;
    let progressElement;
    let isPlaying = true;

    const carousel = document.getElementById('video-carousel');
    carousel.innerHTML = '<div class="loading-spinner"></div>';

    fetch('https://yt-last.jshsh6.workers.dev/')
        .then(response => response.json())
        .then(data => {
            videos = data;
            const dotsContainer = document.querySelector('.carousel-dots');
            if (carousel && dotsContainer) {
                carousel.innerHTML = '';
                videos.forEach((video, index) => {
                    const videoItem = document.createElement('div');
                    videoItem.classList.add('video-item');
                    videoItem.innerHTML = `
                        <img src="${video.thumbnail_url}" alt="${video.title}">
                        <div class="video-overlay-right">
                            <h3>${video.title}</h3>
                            <p>Дата: ${video.release_date}</p>
                            <p>Просмотры: ${video.views}</p>
                            <p>Длительность: ${video.duration}</p>
                        </div>
                    `;
                    videoItem.addEventListener('click', () => {
                        const modal = document.getElementById('video-modal');
                        const iframe = document.getElementById('video-iframe');
                        const videoId = video.link.split('v=')[1];
                        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                        modal.classList.add('active');
                        modal.style.display = 'flex';
                    });
                    carousel.appendChild(videoItem);

                    const dot = document.createElement('div');
                    dot.classList.add('dot');
                    dot.dataset.index = index;
                    dot.addEventListener('click', () => {
                        goToSlide(index);
                    });
                    dotsContainer.appendChild(dot);
                });

                goToSlide(0);
            }
        })
        .catch(error => console.error('Error fetching videos:', error));

    const newsContent = document.getElementById('news-content');
    newsContent.innerHTML = '<div class="loading-spinner"></div>';

    fetch('https://website.jshsh6.workers.dev/news')
        .then(response => response.json())
        .then(data => {
            if (newsContent) {
                newsContent.innerHTML = '';
                const grid = document.createElement('div');
                grid.classList.add('content-grid');
                data.forEach(item => {
                    const article = document.createElement('article');
                    article.classList.add('content-item');
                    article.innerHTML = `
                        <img src="${item.picture}" alt="${item.title}">
                        <h3>${item.title}</h3>
                        <p>${item.text}</p>
                        ${item.link && item.button ? `<a href="${item.link}" class="content-button">${item.button}</a>` : ''}
                    `;
                    grid.appendChild(article);
                });
                newsContent.appendChild(grid);
            }
        })
        .catch(error => console.error('Error fetching news:', error));

    const guidesContent = document.getElementById('guides-content');
    guidesContent.innerHTML = '<div class="loading-spinner"></div>';

    fetch('https://website.jshsh6.workers.dev/guides')
        .then(response => response.json())
        .then(data => {
            if (guidesContent) {
                guidesContent.innerHTML = '';
                const grid = document.createElement('div');
                grid.classList.add('content-grid');
                data.forEach(item => {
                    const article = document.createElement('article');
                    article.classList.add('content-item');
                    article.innerHTML = `
                        <img src="${item.picture}" alt="${item.title}">
                        <h3>${item.title}</h3>
                        <p>${item.text}</p>
                        ${item.link && item.button ? `<a href="${item.link}" class="content-button">${item.button}</a>` : ''}
                    `;
                    grid.appendChild(article);
                });
                guidesContent.appendChild(grid);
            }
        })
        .catch(error => console.error('Error fetching guides:', error));

    function goToSlide(index) {
        const carousel = document.getElementById('video-carousel');
        const dots = document.querySelectorAll('.dot');
        if (carousel && dots.length > 0) {
            currentIndex = index;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

            dots.forEach(dot => {
                dot.classList.remove('active');
                if (dot.querySelector('.progress')) {
                    dot.removeChild(dot.querySelector('.progress'));
                }
            });

            const activeDot = dots[currentIndex];
            activeDot.classList.add('active');
            progressElement = document.createElement('div');
            progressElement.classList.add('progress');
            activeDot.appendChild(progressElement);

            if (isPlaying) {
                startProgress();
            }
        }
    }

    function startProgress() {
        clearTimeout(timer);
        progressElement.style.width = '0%';
        progressElement.style.transition = `width ${slideDuration}ms linear`;
        requestAnimationFrame(() => {
            progressElement.style.width = '100%';
        });
        timer = setTimeout(nextSlide, slideDuration);
    }

    function nextSlide() {
        let nextIndex = (currentIndex + 1) % videos.length;
        goToSlide(nextIndex);
    }

    const playPauseButton = document.getElementById('carousel-play-pause');
    if (playPauseButton) {
        playPauseButton.addEventListener('click', () => {
            if (isPlaying) {
                pauseCarousel();
            } else {
                playCarousel();
            }
        });
    }

    function pauseCarousel() {
        isPlaying = false;
        clearTimeout(timer);
        const currentWidth = window.getComputedStyle(progressElement).width;
        progressElement.style.transition = 'none';
        progressElement.style.width = currentWidth;
        playPauseButton.textContent = '▷';
    }

    function playCarousel() {
        isPlaying = true;
        const currentWidth = parseFloat(window.getComputedStyle(progressElement).width);
        const remainingWidth = 100 - (currentWidth / progressElement.parentElement.clientWidth * 100);
        const remainingTime = (remainingWidth / 100) * slideDuration;
        progressElement.style.transition = `width ${remainingTime}ms linear`;
        progressElement.style.width = '100%';
        timer = setTimeout(nextSlide, remainingTime);
        playPauseButton.textContent = '❚❚';
    }

    const modal = document.getElementById('video-modal');
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            modal.style.display = 'none';
            const iframe = document.getElementById('video-iframe');
            iframe.src = '';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
            const iframe = document.getElementById('video-iframe');
            iframe.src = '';
        }
    });

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));

        button.classList.add('active');

        tabContents.forEach(content => {
        if (content.classList.contains('active')) {
            content.style.opacity = '0';
            content.style.transform = 'translateX(100%)';

            content.addEventListener('transitionend', function handler(e) {
            if (e.propertyName === 'opacity') {
                content.style.display = 'none';
                content.classList.remove('active');
                content.removeEventListener('transitionend', handler);
            }
            });
        }
        });

        const targetContent = document.getElementById(`${button.dataset.tab}-content`);
        if (targetContent) {
        targetContent.style.display = 'block';
        requestAnimationFrame(() => {
            targetContent.classList.add('active');
            targetContent.style.opacity = '1';
            targetContent.style.transform = 'translateX(0)';
        });
        }
    });
    });
});