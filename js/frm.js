function openurl() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.open('https://docs.google.com/forms/d/1DCprYB09NUQEJX3wpbJl4OBKRd4yqIr6xSiR82GNlyM/edit', "_self");
    } else {
        window.open('form.html', "_self");
    }
}