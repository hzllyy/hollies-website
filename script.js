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

// initialize values
let scaledWindow = 1 + Math.min(window.scrollY, 2500) / 5000;
let frozenWindow = 0;
let frozenExtend = 0;
let frozenLogo = 0;
let frozenTitle = 0;

let designer = null;
let developer = null;
let creator = null;

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const computer = document.getElementById("bg");
    const header = document.getElementById('hi');
    const nwindow = document.getElementById('window');
    const extender = document.getElementById('extend');
    const logo = document.getElementById('logo');
    const iama = document.getElementById('iama');

    const scale = 1 + scrollTop / 900;
    const scale2 = 1 + scrollTop / 5000;

    if (scrollTop <= 2500) {
        computer.style.transform = `scale(${scale})`;
        header.style.transform = `translateY(${-(scale2 - 1) * 110}%) scale(${scale2})`;
        nwindow.style.transform = `translateY(${-(scale2 - 1) * 30}%) scale(${scale2})`;
        extender.style.transform = `translateY(${-(scale2 - 1) * -2}%) scale(${scale2})`;
        logo.style.transform = `translateY(${-(scale2 - 1) * 20}%) scale(${scale2})`;

        // store final states
        scaledWindow = Math.min(scale2, 2);
        frozenWindow  = -(scale2 - 1) * 30; 
        frozenExtend =  -(scale2 - 1) * -2;
        frozenLogo = -(scale2 - 1) * 20;
        frozenTitle = -(scale2 - 1) * 110;
    }

    else if (scrollTop > 2500 && scrollTop <= 3500) {
        let extra = scrollTop - 2500;
        const scale3 = 1 + extra / 1000;
        nwindow.style.transform = `translateY(${frozenWindow - extra * 0.055}%) scale(${scaledWindow})`;
        extender.style.transform = `translateY(${frozenExtend - extra * 0.04}%) scale(${scaledWindow})`;
        logo.style.transform = `translateY(${frozenLogo - extra * 0.048}%) scale(${scaledWindow})`;
        header.style.transform = `translateY(${frozenTitle - extra * 0.03}%) scale(${scaledWindow})`;
        iama.style.transform = `translateY(${-((1 + extra / 5000) - 1) * 550}%) scale(${scale3})`;

        // fade the caption
        const fade = (scrollTop - 2500) / 1000;
        header.style.opacity = Math.max(1 - fade, 0);
        iama.style.opacity = Math.min(fade, 1);
    }

    else if (scrollTop > 3500 && !designer) {
        designer = document.createElement('img');
        designer.className = 'designer';
        designer.src = 'images/designer.png';

        designer.setAttribute('data-aos', 'zoom-in');
        designer.setAttribute('data-aos-duration', '300'); 
        designer.setAttribute('data-aos-once', 'true');

        document.body.appendChild(designer);
    } 

    if (scrollTop > 4000 && !developer) {
        developer = document.createElement('img');
        developer.className = 'developer';
        developer.src = 'images/developer.png';

        developer.setAttribute('data-aos', 'zoom-in');
        developer.setAttribute('data-aos-duration', '300'); 
        developer.setAttribute('data-aos-once', 'true');

        document.body.appendChild(developer);
    }

    if (scrollTop > 4500 && !creator) {
        creator = document.createElement('img');
        creator.className = 'creator';
        creator.src = 'images/creator.png';

        creator.setAttribute('data-aos', 'zoom-in');
        creator.setAttribute('data-aos-duration', '300'); 
        creator.setAttribute('data-aos-once', 'true');

        document.body.appendChild(creator);
    }

    if (scrollTop <= 3500 && designer) {
        designer.classList.add('zoom-out');
        designer.addEventListener('animationend', () => {
        if (designer) {
            designer.remove();
            designer = null;
            }
        }, { once: true });
    }

    if (scrollTop <= 4000 && developer) {
        developer.classList.add('zoom-out');
        developer.addEventListener('animationend', () => {
        if (developer) {
            developer.remove();
            developer = null;
            }
        }, { once: true });
    }

    if (scrollTop <= 4500 && creator) {
        creator.classList.add('zoom-out');
        creator.addEventListener('animationend', () => {
        if (creator) {
            creator.remove();
            creator = null;
            }
        }, { once: true });
    }


});