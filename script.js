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

let summaryHobbiesHidden = false;

let start = false;
let rectLeft = null;
let rectTop = null

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

function hideWindowWithAnimation(windowEl) {
    if (!windowEl) return;
    
    windowEl.classList.add('zoom-out');
    windowEl.addEventListener('animationend', () => {
        windowEl.style.visibility = 'hidden';
        windowEl.style.pointerEvents = 'none';
    }, { once: true });
}

// Helper function to show window with animation
function showWindowWithAnimation(windowEl) {
    if (!windowEl) return;
    
    windowEl.style.visibility = 'visible';
    windowEl.style.pointerEvents = 'auto';
    windowEl.classList.remove('zoom-out');
    
    windowEl.classList.add('zoom-in');
    windowEl.addEventListener('animationend', () => {
        windowEl.classList.remove('zoom-in');
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
            
            // Check which avatar is currently visible (original or clone)
            const isCloneVisible = scrollTop > 6000 && scrollTop <= 7000;
            
            if (isCloneVisible) {
                // Update clone only (since it's the one visible)
                const clone = document.getElementById('avatar-window-clone');
                if (clone) {
                    const clonedAvatar = clone.querySelector('.avatar');
                    if (clonedAvatar) {
                        clonedAvatar.src = `images/${outfit}-avatar-open.PNG`;
                        // Restart blinking with new outfit
                        startBlinking(clonedAvatar, outfit);
                    }
                }
                
                // Also update the original (hidden) to keep it in sync
                if (avatar) {
                    avatar.src = `images/${outfit}-avatar-open.PNG`;
                    // Don't start blinking on original - it's hidden
                }
            } else {
                // Update original only (clone doesn't exist)
                if (avatar) {
                    avatar.src = `images/${outfit}-avatar-open.PNG`;
                    startBlinking(avatar, outfit);
                }
            }
        });
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

        const element = avatarWindowEl;
        const rect = element.getBoundingClientRect();

        console.log({
            left: rect.left,        // Distance from left edge of viewport
            top: rect.top,          // Distance from top edge of viewport
        });
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

    if (scrollTop > 6000 && !summaryHobbiesHidden) {
        summaryHobbiesHidden = true;
        
        hideWindowWithAnimation(summaryWindowEl);
        hideWindowWithAnimation(hobbiesWindowEl);
    }

    if (scrollTop <= 6000 && summaryHobbiesHidden) {
        summaryHobbiesHidden = false;
        
        showWindowWithAnimation(summaryWindowEl);
        showWindowWithAnimation(hobbiesWindowEl);
    }

    if (scrollTop > 6000 && scrollTop <= 7000 && avatarWindowEl) {
        const progress = (scrollTop - 6000) / 1000;

        if (!start) {
            // Stop blinking on the original before hiding it
            const originalAvatarImg = avatarWindowEl.querySelector('.avatar');
            if (originalAvatarImg && originalAvatarImg.dataset.blinkIntervalId) {
                clearInterval(parseInt(originalAvatarImg.dataset.blinkIntervalId));
                delete originalAvatarImg.dataset.blinkIntervalId;
            }
            
            // Create a clone of the avatar window WITH the outfit switch buttons
            const clone = avatarWindowEl.cloneNode(true);
            clone.id = 'avatar-window-clone';
            
            // Get position of original
            const rect = avatarWindowEl.getBoundingClientRect();
            
            // Position clone exactly where original is
            clone.style.position = 'fixed';
            clone.style.left = `${rect.left}px`;
            clone.style.top = `${rect.top}px`;
            clone.style.width = `${avatarWindowEl.offsetWidth}px`;
            clone.style.zIndex = '1000';
            
            // Start blinking on the CLONE only
            const clonedAvatarImg = clone.querySelector('.avatar');
            if (clonedAvatarImg) {
                clonedAvatarImg.src = `images/${currentOutfit}-avatar-open.PNG`;
                startBlinking(clonedAvatarImg, currentOutfit);
            }
            
            // Hide original
            avatarWindowEl.style.visibility = 'hidden';
            
            // Store reference
            avatarWindowEl.dataset.clone = 'true';
            document.body.appendChild(clone);
            
            avatarWindowEl.dataset.originalWidth = avatarWindowEl.offsetWidth;

            const cloneOutfitSwitch = clone.querySelector('.outfit-switch');
            if (cloneOutfitSwitch) {
                cloneOutfitSwitch.classList.add('outfit-switch-off');
            }
            
            start = true;
        }

        const originalWidth = parseFloat(avatarWindowEl.dataset.originalWidth);
        const newWidth = originalWidth + (originalWidth * 1.65 * progress);
        
        // Update clone width
        const clone = document.getElementById('avatar-window-clone');
        if (clone) {
            clone.style.width = `${newWidth}px`;
            
            // Get all elements
            const innerWindow = clone.querySelector('.aboutme-inner-window');
            const avatarImg = clone.querySelector('.avatar');
            const outfitSwitch = clone.querySelector('.outfit-switch');
            const belowHeader = clone.querySelector('.belowHeader');
            
            if (innerWindow && avatarImg && outfitSwitch && belowHeader) {
                // Calculate stretch amount
                const stretchAmount = newWidth - originalWidth;
                
                // Keep the flex container layout (buttons on right side)
                belowHeader.style.display = 'flex';
                belowHeader.style.alignItems = 'stretch';
                
                // Inner window stretches to fill space
                innerWindow.style.flex = '1';
                innerWindow.style.minWidth = '0';
                innerWindow.style.display = 'flex';
                innerWindow.style.justifyContent = 'center';
                innerWindow.style.alignItems = 'center';
                innerWindow.style.overflow = 'hidden';
                
                // Avatar stays fixed size
                avatarImg.style.width = 'auto';
                avatarImg.style.maxWidth = '75vh';
                avatarImg.style.flexShrink = '0';
                
                // Outfit switch buttons stay on right, maintain size
                outfitSwitch.style.flexShrink = '0';
                outfitSwitch.style.width = 'auto';
                outfitSwitch.style.display = 'flex';
                outfitSwitch.style.flexDirection = 'column';
                outfitSwitch.style.justifyContent = 'start';
                outfitSwitch.style.padding = '0 2vh';
                
            }
        }
    }

    if (scrollTop > 7000 && avatarWindowEl) {
        const clone = document.getElementById('avatar-window-clone');
        if (clone) {
            if (!avatarWindowEl.dataset.originalWidth) {
                avatarWindowEl.dataset.originalWidth = avatarWindowEl.offsetWidth / 2.65;
            }
            
            const originalWidth = parseFloat(avatarWindowEl.dataset.originalWidth);
            const newWidth = originalWidth * 2.65;
            
            clone.style.width = `${newWidth}px`;
            
            // Ensure blinking
            const clonedAvatarImg = clone.querySelector('.avatar');
            if (clonedAvatarImg && !clonedAvatarImg.dataset.blinkingStarted) {
                startBlinking(clonedAvatarImg, currentOutfit);
            }

            const cloneOutfitSwitch = clone.querySelector('.outfit-switch');
            if (cloneOutfitSwitch && !cloneOutfitSwitch.classList.contains('outfit-switch-off')) {
                cloneOutfitSwitch.classList.add('outfit-switch-off');
            }
            
            // Maintain layout for full stretch
            const innerWindow = clone.querySelector('.aboutme-inner-window');
            const avatarImg = clone.querySelector('.avatar');
            const outfitSwitch = clone.querySelector('.outfit-switch');
            const belowHeader = clone.querySelector('.belowHeader');
            
            if (innerWindow && avatarImg && outfitSwitch && belowHeader) {
                belowHeader.style.display = 'flex';
                belowHeader.style.alignItems = 'stretch';
                
                innerWindow.style.flex = '1';
                innerWindow.style.minWidth = '0';
                innerWindow.style.display = 'flex';
                innerWindow.style.justifyContent = 'center';
                innerWindow.style.alignItems = 'center';
                innerWindow.style.overflow = 'hidden';
                
                avatarImg.style.width = 'auto';
                avatarImg.style.maxWidth = '75vh';
                avatarImg.style.flexShrink = '0';
                
                outfitSwitch.style.flexShrink = '0';
                outfitSwitch.style.width = 'auto';
            }
        }
    }

    if (scrollTop <= 6000 && avatarWindowEl) {
        // Remove clone
        const clone = document.getElementById('avatar-window-clone');
        if (clone) {
            // Stop blinking on the clone before removing
            const clonedAvatarImg = clone.querySelector('.avatar');
            if (clonedAvatarImg && clonedAvatarImg.dataset.blinkIntervalId) {
                clearInterval(parseInt(clonedAvatarImg.dataset.blinkIntervalId));
            }
            clone.remove();
        }
        
        // Show original
        avatarWindowEl.style.visibility = '';
        
        // Reset any flex styles on original
        const belowHeader = avatarWindowEl.querySelector('.belowHeader');
        const innerWindow = avatarWindowEl.querySelector('.aboutme-inner-window');
        const avatarImg = avatarWindowEl.querySelector('.avatar');
        const outfitSwitch = avatarWindowEl.querySelector('.outfit-switch');
        
        if (belowHeader) {
            belowHeader.style.display = '';
            belowHeader.style.alignItems = '';
        }
        
        if (innerWindow) {
            innerWindow.style.flex = '';
            innerWindow.style.minWidth = '';
            innerWindow.style.display = '';
            innerWindow.style.justifyContent = '';
            innerWindow.style.alignItems = '';
            innerWindow.style.overflow = '';
        }
        
        if (avatarImg) {
            avatarImg.style.width = '';
            avatarImg.style.maxWidth = '';
            avatarImg.style.flexShrink = '';
        }
        
        if (outfitSwitch) {
            outfitSwitch.style.flexShrink = '';
            outfitSwitch.style.width = '';
            outfitSwitch.style.display = '';
            outfitSwitch.style.flexDirection = '';
            outfitSwitch.style.justifyContent = '';
            outfitSwitch.style.padding = '';
        }
        
        // Restart blinking on ORIGINAL only
        const originalAvatarImg = avatarWindowEl.querySelector('.avatar');
        if (originalAvatarImg) {
            originalAvatarImg.src = `images/${currentOutfit}-avatar-open.PNG`;
            startBlinking(originalAvatarImg, currentOutfit);
        }
        
        delete avatarWindowEl.dataset.originalWidth;
        delete avatarWindowEl.dataset.clone;
        start = false;
    }

    }
);