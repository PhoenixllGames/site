// header.js

document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = `
            <a href="index" class="logo">Phoenix</a>
            <nav>
                <ul>
                    <li><a href="about">Обо мне</a></li>
                    <li><a href="setup">Мой сетап</a></li>
                    <li><a href="contact">Связь со мной</a></li>
                    <li><a href="support">Поддержка</a></li>
                    <li><a href="other">Остальное</a></li>
                </ul>
            </nav>
            <button class="hamburger">&#9776;</button>
        `;
    }

    const hamburger = document.querySelector('.hamburger');
    const navUl = document.querySelector('nav ul');
    if (hamburger && navUl) {
        hamburger.addEventListener('click', () => {
            navUl.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    if (window.location.pathname.endsWith('.html')) {
        const newPath = window.location.pathname.replace(/\.html$/, '');
        history.replaceState(null, '', newPath);
    }
    // Normalize trailing '/index' to '/'
    if (/\/index$/.test(window.location.pathname)) {
        const newPath = window.location.pathname.replace(/\/index$/, '/');
        history.replaceState(null, '', newPath);
    }
});