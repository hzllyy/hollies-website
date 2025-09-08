document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById('logo');

    const images = [
        'images/logo-left.PNG',
        'images/logo-left.PNG',
        'images/logo-closed.PNG',
        'images/logo-right.PNG',
        'images/logo-right.PNG',
        'images/logo-closed.PNG',
    ];

    let index = 0;

    setInterval(() => {
        index = (index + 1) % images.length;
        logo.src = images[index];
    }, 700);

});

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const computer = document.getElementById("bg");
    const header = document.getElementById('hi');
    const nwindow = document.getElementById('window');
    const extender = document.getElementById('extend');
    const logo = document.getElementById('logo')

    const scale = 1 + scrollTop / 900;
    const scale2 = 1 + scrollTop / 5000;
    computer.style.transform = `scale(${scale})`;
    header.style.transform = `translateY(${-(scale2 - 1) * 110}%) scale(${scale2})`;
    nwindow.style.transform = `translateY(${-(scale2 - 1) * 30}%) scale(${scale2})`;
    extender.style.transform = `translateY(${-(scale2 - 1) * -2}%) scale(${scale2})`;
    logo.style.transform = `translateY(${-(scale2 - 1) * 20}%) scale(${scale2})`;
});