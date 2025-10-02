// footer.js

document.addEventListener('DOMContentLoaded', () => {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = `
            <div>
                <p>Карта сайта</p>
                <ul>
                    <li><a href="index">Главная</a></li>
                    <li><a href="about">Обо мне</a></li>
                    <li><a href="setup">Мой сетап</a></li>
                    <li><a href="contact">Связь со мной</a></li>
                    <li><a href="support">Поддержка</a></li>
                    <li><a href="other">Остальное</a></li>
                </ul>
                <p>&copy; 2025 www.phoenixgamer.org. Все права защищены.</p>
            </div>
        `;
    }
});