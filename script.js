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
let finalized = false;

let blinkInterval = null;
let currentOutfit = 'default';

let aboutMeCreated = false;
let avatarWindowEl = null;
let summaryWindowEl = null;
let hobbiesWindowEl = null;

// function to handle blinking
function startBlinking(avatarElement, outfit = 'default') {
    if (blinkInterval) {
        clearInterval(blinkInterval);
    }

    blinkInterval = setInterval(() => {
        avatarElement.src = `images/${outfit}-avatar-closed.PNG`;

        setTimeout(() => {
            avatarElement.src = `images/${outfit}-avatar-open.PNG`;
        }, 150);
    }, 2000);
}

const aboutMe = document.createElement('div');
document.body.appendChild(aboutMe);
aboutMe.className = 'about-me';

function createWindow(windowId, content, headerText, buttons) {
    const avatarWindow = document.createElement('div');
    avatarWindow.className = "aboutme-window";
    avatarWindow.id = windowId;

    avatarWindow.setAttribute('data-aos', 'zoom-in');
    avatarWindow.setAttribute('data-aos-duration', '300'); 
    avatarWindow.setAttribute('data-aos-once', 'true');

    // window header
    const avatarHeader = document.createElement('div');
    avatarHeader.className = 'aboutme-header'
    const headerDesc = document.createElement('p')
    headerDesc.textContent = headerText;

    const navBtns = document.createElement('div');
    navBtns.className = 'nav-btns';
    
    const x = document.createElement('p');
    x.textContent = 'x';
    const minus = document.createElement('p');
    minus.textContent = '-';
    const o = document.createElement('p');
    o.textContent = 'o';

    const navButtons = [x, minus, o];
    navButtons.forEach((button) => {
        navBtns.appendChild(button);
    })

    avatarHeader.appendChild(headerDesc);
    avatarHeader.appendChild(navBtns);

    avatarWindow.appendChild(avatarHeader);
    aboutMe.appendChild(avatarWindow);

    // inner window
    const innerWindow = document.createElement('div');
    innerWindow.className = 'aboutme-inner-window';

    const belowHeader = document.createElement('div');
    belowHeader.className = 'belowHeader';

    belowHeader.appendChild(innerWindow);
    if (buttons instanceof Node) {
        belowHeader.appendChild(buttons);
    }
    avatarWindow.appendChild(belowHeader);
    innerWindow.appendChild(content);

    return avatarWindow
}

function removeAboutMeWindow(windowEl, callback) {
    if (!windowEl) return;

    windowEl.classList.add('zoom-out');
    windowEl.addEventListener('animationend', () => {
        windowEl.remove();
        if (callback) callback();
    }, { once: true });
}

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

    else if (scrollTop > 3500 && scrollTop < 5000 && !designer) {
        designer = document.createElement('img');
        designer.className = 'designer';
        designer.src = 'images/designer.png';

        designer.setAttribute('data-aos', 'zoom-in');
        designer.setAttribute('data-aos-duration', '300'); 
        designer.setAttribute('data-aos-once', 'true');

        document.body.appendChild(designer);
    } 

    if (scrollTop > 4000 && scrollTop < 5000 && !developer) {
        developer = document.createElement('img');
        developer.className = 'developer';
        developer.src = 'images/developer.png';

        developer.setAttribute('data-aos', 'zoom-in');
        developer.setAttribute('data-aos-duration', '300'); 
        developer.setAttribute('data-aos-once', 'true');

        document.body.appendChild(developer);
    }

    if (scrollTop > 4500 && scrollTop < 5000 && !creator) {
        creator = document.createElement('img');
        creator.className = 'creator';
        creator.src = 'images/creator.png';

        creator.setAttribute('data-aos', 'zoom-in');
        creator.setAttribute('data-aos-duration', '300'); 
        creator.setAttribute('data-aos-once', 'true');

        document.body.appendChild(creator);
    }

    // helper function to remove dynamic windows
    function removeWindow(el, clearRef) {
        el.classList.add('zoom-out');
        el.addEventListener('animationend', () => {
            el.remove();
            clearRef();
        }, { once: true });
    }

    function hideUIOpacity() {
        staticUI.forEach(el => {
            if (!el) return;
            el.style.transition = 'opacity 0.4s ease';
            el.style.opacity = '0';
        });
    }

    function showUIOpacity() {
        staticUI.forEach(el => {
            if (!el) return;
            el.style.transition = 'opacity 0.4s ease';
            el.style.opacity = '1';
        });
    }

    if (scrollTop <= 3500 && designer) {
        removeWindow(designer, () => designer = null);
    }

    if (scrollTop <= 4000 && developer) {
        removeWindow(developer, () => developer = null);
    }

    if (scrollTop <= 4500 && creator) {
        removeWindow(creator, () => creator = null);
    }

    const staticUI = [nwindow, extender, logo, iama];

    if (scrollTop > 5000 && !finalized) {
        finalized = true;

        removeWindow(designer, () => designer = null);
        removeWindow(developer, () => developer = null);
        removeWindow(creator, () => creator = null);

        hideUIOpacity();
    }

    if (scrollTop <= 5000) {
        finalized = false;
        showUIOpacity();
    }

    if (scrollTop > 5500 && !aboutMeCreated) {
        aboutMeCreated = true;

        const avatar = document.createElement('img');
        avatar.src = 'images/default-avatar-open.PNG';
        avatar.alt = 'avatar';
        avatar.className = 'avatar';

        const outfitSwitch = document.createElement('div');
        outfitSwitch.className = 'outfit-switch';

        const fits = [
            { icon: "fa-solid fa-child-dress", outfit: 'default'},
            { icon: "fa-solid fa-star", outfit: 'y2k'},
            { icon: "fa-solid fa-snowflake", outfit: 'winter'},
            { icon: "fa-solid fa-apple-whole", outfit: 'apple'}
        ]

        fits.forEach(({ icon, outfit }) => {
            const fitButton = document.createElement('button');
            fitButton.className = 'fit-btn';

            const iconElement = document.createElement('i');
            iconElement.className = icon;

            fitButton.appendChild(iconElement);

            fitButton.addEventListener('click', () => {
                currentOutfit = outfit;
                avatar.src = `images/${outfit}-avatar-open.PNG`;
                startBlinking(avatar, outfit);
            })

            outfitSwitch.appendChild(fitButton);
        })

        avatarWindowEl = createWindow('avatar-window-id', avatar, 'avatar.jpg', outfitSwitch);

        startBlinking(avatar, 'default');

        const aboutMeContent = document.createElement('h1');
        aboutMeContent.textContent = 'About Me';

        summaryWindowEl = createWindow('summary-window-id', aboutMeContent, 'aboutme.txt', null);

        const hobbyArray = [
            { src: 'images/switch.PNG', label: 'gaming'},
            { src: 'images/read.PNG', label: 'reading'},
            { src: 'images/draw.PNG', label: 'drawing'},
            { src: 'images/baking.PNG', label: 'baking'},
            { src: 'images/dance.PNG', label: 'dancing'}
        ]

        const hobbies = document.createElement('div');
        hobbies.className = 'hobbies-div';

        hobbyArray.forEach(({ src, label }) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'hobby';

            const img = document.createElement('img');
            img.src = src;
            img.alt = label;

            wrapper.dataset.label = label;
            wrapper.appendChild(img);
            hobbies.appendChild(wrapper);
        })

        hobbiesWindowEl = createWindow('hobbies-window-id', hobbies, 'hobbies.jpg', null);
    }

    if (scrollTop <= 5500 && aboutMeCreated) {
        aboutMeCreated = false;

        if (blinkInterval) {
            clearInterval(blinkInterval);
            blinkInterval = null;
        }

        removeAboutMeWindow(avatarWindowEl, () => avatarWindowEl = null);
        removeAboutMeWindow(summaryWindowEl, () => summaryWindowEl = null);
        removeAboutMeWindow(hobbiesWindowEl, () => hobbiesWindowEl = null);
    }
}
);