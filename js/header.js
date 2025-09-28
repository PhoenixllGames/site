// header.js

document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = `
            <a href="index.html" class="logo">Phoenix</a>
            <nav>
                <ul>
                    <li><a href="about.html">Обо мне</a></li>
                    <li><a href="setup.html">Мой сетап</a></li>
                    <li><a href="contact.html">Связь со мной</a></li>
                    <li><a href="support.html">Поддержка</a></li>
                    <li><a href="other.html">Остальное</a></li>
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
});