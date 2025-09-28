// footer.js

document.addEventListener('DOMContentLoaded', () => {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = `
            <div>
                <p>Карта сайта</p>
                <ul>
                    <li><a href="index.html">Главная</a></li>
                    <li><a href="about.html">Обо мне</a></li>
                    <li><a href="setup.html">Мой сетап</a></li>
                    <li><a href="contact.html">Связь со мной</a></li>
                    <li><a href="support.html">Поддержка</a></li>
                    <li><a href="other.html">Остальное</a></li>
                </ul>
                <p>&copy; 2025 www.phoenixgamer.org. Все права защищены.</p>
            </div>
        `;
    }
});