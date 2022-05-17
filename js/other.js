$(document).ready(function() {

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.scroll(0, 800);
    } else {
        window.scroll(0, 1200);
    }
});