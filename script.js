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

function blinkAvatar(img) {
  img.src = 'images/default-avatar-closed.PNG';

  setTimeout(() => {
    img.src = 'images/default-avatar-open.PNG';
  }, 120);
}

function startBlinking(img) {
  function blinkLoop() {
    blinkAvatar(img);

    const nextBlink = Math.random() * 4000 + 2000;

    setTimeout(blinkLoop, nextBlink);
  }

  blinkLoop();
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

    const aboutMe = document.createElement('div');
    document.body.appendChild(aboutMe);
    aboutMe.className = 'about-me';

    function createWindow(windowId, content, headerText, buttons) {
        const avatarWindow = document.createElement('div');
        avatarWindow.className = "aboutme-window";
        avatarWindow.id = windowId;

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
    }

    let aboutMeCreated = false;

    if (scrollTop > 5500 && !aboutMeCreated) {
        aboutMeCreated = true;

        const avatar = document.createElement('img');
        avatar.src = 'images/default-avatar-open.PNG';
        avatar.alt = 'avatar';
        avatar.className = 'avatar';

        const outfitSwitch = document.createElement('div');
        outfitSwitch.className = 'outfit-switch';

        const fits = [
            "fa-solid fa-child-dress",
            "fa-solid fa-star",
            "fa-solid fa-snowflake",
            "fa-solid fa-apple-whole"
        ]

        fits.forEach(iconClass => {
            const fitButton = document.createElement('button');
            fitButton.className = 'fit-btn';

            const icon = document.createElement('i');
            icon.className = iconClass;

            fitButton.appendChild(icon);
            outfitSwitch.appendChild(fitButton);
        })

        createWindow('avatar-window-id', avatar, 'avatar.jpg', outfitSwitch);

        const aboutMeContent = document.createElement('h1');
        aboutMeContent.textContent = 'About Me';

        createWindow('summary-window-id', aboutMeContent, 'aboutme.jpg', null);

        const hobbyArray = [
            'images/switch.PNG',
            'images/read.PNG',
            'images/draw.PNG',
            'images/baking.PNG',
            'images/dance.PNG'
        ]

        const hobbies = document.createElement('div');
        hobbies.className = 'hobbies-div';

        hobbyArray.forEach((hobby) => {
            const myHobby = document.createElement('img');
            myHobby.src = hobby;
            myHobby.alt = hobby;
            hobbies.append(myHobby);
        });

        createWindow('hobbies-window-id', hobbies, 'hobbies.jpg', null);
    }
}
);