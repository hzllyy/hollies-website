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
let popupCreated = false;

let blinkInterval = null;
let currentOutfit = 'default';

let aboutMeCreated = false;
let avatarWindowEl = null;
let summaryWindowEl = null;
let hobbiesWindowEl = null;

let summaryHobbiesHidden = false;

// start value for zoom check
let start = false;
let rectLeft = null;
let rectTop = null
let bagCreated = false;
let notebookCreated = false;

// check for project
let projectSelected = false;
const numPages = 3;
let coverPage = true;
let backCover = false;
let openBook = false;
let pageNum = 0;
let bookListenersSetup = false;

// contact card
let contactCreated = false;

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

// create window for about me
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

// helper function for removing about me windows
function removeAboutMeWindow(windowEl, callback) {
    if (!windowEl) return;

    windowEl.classList.add('zoom-out');
    windowEl.addEventListener('animationend', () => {
        windowEl.remove();
        if (callback) callback();
    }, { once: true });
}

// hide iama window
function hideWindowWithAnimation(windowEl) {
    if (!windowEl) return;
    
    windowEl.classList.add('zoom-out');
    windowEl.addEventListener('animationend', () => {
        windowEl.style.visibility = 'hidden';
        windowEl.style.pointerEvents = 'none';
    }, { once: true });
}

// helper to show iama window
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

// SCROLL EVENTS START HERE

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
        iama.style.display = 'none';

        // store final states
        scaledWindow = Math.min(scale2, 2);
        frozenWindow  = -(scale2 - 1) * 30; 
        frozenExtend =  -(scale2 - 1) * -2;
        frozenLogo = -(scale2 - 1) * 20;
        frozenTitle = -(scale2 - 1) * 110;
    }

    // stretch out iama window
    else if (scrollTop > 2500 && scrollTop <= 3500) {
        let extra = scrollTop - 2500;
        const scale3 = 1 + extra / 1000;
        nwindow.style.transform = `translateY(${frozenWindow - extra * 0.055}%) scale(${scaledWindow})`;
        extender.style.transform = `translateY(${frozenExtend - extra * 0.04}%) scale(${scaledWindow})`;
        logo.style.transform = `translateY(${frozenLogo - extra * 0.048}%) scale(${scaledWindow})`;
        header.style.transform = `translateY(${frozenTitle - extra * 0.03}%) scale(${scaledWindow})`;
        iama.style.display = 'block';
        iama.style.transform = `translateY(${-((1 + extra / 5000) - 1) * 550}%) scale(${scale3})`;

        // fade the caption
        const fade = (scrollTop - 2500) / 1000;
        header.style.opacity = Math.max(1 - fade, 0);
        iama.style.opacity = Math.min(fade, 1);

        // create popup div
        if (!popupCreated) {
            const popupDiv = document.createElement('div');
            popupDiv.className = 'popup-div';

            document.body.appendChild(popupDiv);
            popupCreated = true;
        }
    }

    // pop up windows for iama!
    else if (scrollTop > 3500 && scrollTop < 5000 && !designer) {
        designer = document.createElement('img');
        designer.className = 'designer';
        designer.src = 'images/designer.png';

        designer.setAttribute('data-aos', 'zoom-in');
        designer.setAttribute('data-aos-duration', '300'); 
        designer.setAttribute('data-aos-once', 'true');

        const popupDiv = document.querySelector('.popup-div');
        popupDiv.appendChild(designer);
    } 

    if (scrollTop > 4000 && scrollTop < 5000 && !developer) {
        developer = document.createElement('img');
        developer.className = 'developer';
        developer.src = 'images/developer.png';

        developer.setAttribute('data-aos', 'zoom-in');
        developer.setAttribute('data-aos-duration', '300'); 
        developer.setAttribute('data-aos-once', 'true');

        const popupDiv = document.querySelector('.popup-div');
        popupDiv.appendChild(developer);
    }

    if (scrollTop > 4500 && scrollTop < 5000 && !creator) {
        creator = document.createElement('img');
        creator.className = 'creator';
        creator.src = 'images/creator.png';

        creator.setAttribute('data-aos', 'zoom-in');
        creator.setAttribute('data-aos-duration', '300'); 
        creator.setAttribute('data-aos-once', 'true');

        const popupDiv = document.querySelector('.popup-div');
        popupDiv.appendChild(creator);
    }

    // helper function to remove dynamic windows
    function removeWindow(el, clearRef) {
        el.classList.add('zoom-out');
        el.addEventListener('animationend', () => {
            el.remove();
            clearRef();
        }, { once: true });
    }

    // helper to show/hide using opacity instead of removing
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

    // remove all windows when scrolling to about me
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

        hideUIOpacity();

        removeWindow(designer, () => designer = null);
        removeWindow(developer, () => developer = null);
        removeWindow(creator, () => creator = null);
        
        const popupDiv = document.querySelector('.popup-div');
        popupDiv.style.zIndex = '-9999';
    }

    if (scrollTop <= 5000) {
        showUIOpacity();
        finalized = false;

        if (popupCreated) {
            const popupDiv = document.querySelector('.popup-div');
            popupDiv.style.zIndex = '9999';
        }

    }

    // create about me windows!
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

        // avatar animation
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

    // remove about me if scrolled up
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

    // hide windows when scrolling past aboutme
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

    // PAIN IN THE ASS avatar window zoom ;-;
    if (scrollTop > 6000 && scrollTop <= 7000 && avatarWindowEl) {
        const progress = (scrollTop - 6000) / 1000;

        if (!start) {
            // stop blinking
            const originalAvatarImg = avatarWindowEl.querySelector('.avatar');
            if (originalAvatarImg && originalAvatarImg.dataset.blinkIntervalId) {
                clearInterval(parseInt(originalAvatarImg.dataset.blinkIntervalId));
                delete originalAvatarImg.dataset.blinkIntervalId;
            }
            
            // create clone
            const clone = avatarWindowEl.cloneNode(true);
            clone.id = 'avatar-window-clone';
            
            // grab og position
            const rect = avatarWindowEl.getBoundingClientRect();
            
            // position correctly
            clone.style.position = 'fixed';
            clone.style.left = `${rect.left}px`;
            clone.style.top = `${rect.top}px`;
            clone.style.width = `${avatarWindowEl.offsetWidth}px`;
            clone.style.zIndex = '10';
            
            // start blinking on clone
            const clonedAvatarImg = clone.querySelector('.avatar');
            if (clonedAvatarImg) {
                clonedAvatarImg.src = `images/${currentOutfit}-avatar-open.PNG`;
                startBlinking(clonedAvatarImg, currentOutfit);
            }
            
            // hide original
            avatarWindowEl.style.visibility = 'hidden';
            
            // store ref
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
        const newWidth = originalWidth + (originalWidth * 1.55 * progress);

        const clone = document.getElementById('avatar-window-clone');
        if (clone) {
            clone.style.width = `${newWidth}px`;
            
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

                const scale3 = ((1/1.5) + progress) * 1.5;
                const scale4 = ((1/12)+ progress) * 12;
                const scale5 = ((1/0.06)+ progress) * 0.06;
                const scale6 = ((1/22) + progress) * (-22);
                 
                avatarImg.style.width = 'auto';
                avatarImg.style.flexShrink = '0';
                avatarImg.style.transform = `translateY(${scale4}%) scale(${scale3})`;
                
                outfitSwitch.style.flexShrink = '0';
                outfitSwitch.style.width = 'auto';
                outfitSwitch.style.display = 'flex';
                outfitSwitch.style.flexDirection = 'column';
                outfitSwitch.style.justifyContent = 'start';

            const notebook = innerWindow.querySelector('.notebook');
            if (notebook) {
                notebook.style.transform = `translateX(${scale6}%) translateY(${scale5}%) scale(${scale3})`;
                notebook.style.transformOrigin = 'center center';
            }

            if (!notebookCreated) {
                const notebook = document.createElement('img');
                notebook.src = '/images/project-notebook-unselected.PNG';
                notebook.alt = 'project-notebook';
                notebook.className = 'notebook';
                
                innerWindow.appendChild(notebook);
                
                notebook.style.position = 'absolute';
                notebook.style.height = '75vh';
                
                const notebookHoverArea = document.createElement('div');
                notebookHoverArea.className = 'notebook-hover-area';
                notebookHoverArea.style.position = 'absolute';
                notebookHoverArea.style.cursor = 'pointer';
                notebookHoverArea.style.width = '20%';
                notebookHoverArea.style.height = '19%';
                notebookHoverArea.style.left = '45%';
                
                innerWindow.appendChild(notebookHoverArea);
                
                notebookHoverArea.addEventListener('mouseover', () => {
                    notebook.src = '/images/project-notebook-selected.PNG';
                });
                
                notebookHoverArea.addEventListener('mouseout', () => {
                    notebook.src = '/images/project-notebook-unselected.PNG';
                });
                
                notebookHoverArea.addEventListener('click', () => {
                    console.log('Notebook clicked!');
                    const viewProject = document.querySelector('.projects-view');
                    if (viewProject) {
                        viewProject.style.display = 'block';
                        projectSelected = true;
                        coverPage = true;
                        backCover = false;
                        openBook = false;
                        pageNum = 0;
                        bookListenersSetup = false; 
                        
                        console.log('Project view shown, projectSelected:', projectSelected);
                    } else {
                        console.error('projects-view element not found!');
                    }
                });
                
                console.log('notebook and hover area created');
                notebookCreated = true;
            }

            const notebookHoverArea = innerWindow.querySelector('.notebook-hover-area');
            if (notebook && notebookHoverArea) {
                notebook.style.transform = `translateX(${scale6}%) translateY(${scale5}%) scale(${scale3})`;
                notebookHoverArea.style.transform = `translateX(${scale6}%) translateY(${scale5}%) scale(${scale3})`;
                notebookHoverArea.style.transformOrigin = 'center center';
            }


           if (!bagCreated) {
                const bag = document.createElement('img');
                bag.src = '/images/bag.PNG';
                bag.alt = 'bag';
                bag.className = 'bag';
                
                innerWindow.appendChild(bag);
                
                bag.style.position = 'absolute';
                bag.style.pointerEvents = 'none';
                bag.style.height = '75vh';
                
                console.log('bag created');
                bagCreated = true;
            }

            const bag = innerWindow.querySelector('.bag');
            if (bag) {
                bag.style.transform = `translateY(${scale4}%) scale(${scale3})`;
                bag.style.transformOrigin = 'center center';
            }
                
            }
        }
    }

    // scroll past avatar zoom 
    if (scrollTop > 7000 && scrollTop <= 7500 && avatarWindowEl) {
        const clone = document.getElementById('avatar-window-clone');
        if (clone) {
            if (!avatarWindowEl.dataset.originalWidth) {
                avatarWindowEl.dataset.originalWidth = avatarWindowEl.offsetWidth / 2.55;
            }
            
            const originalWidth = parseFloat(avatarWindowEl.dataset.originalWidth);
            const newWidth = originalWidth * 2.55;
            
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
            
            // maintain layout
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
        // remove clone
        const clone = document.getElementById('avatar-window-clone');
        if (clone) {
            // stop blinking on the clone before removing
            const clonedAvatarImg = clone.querySelector('.avatar');
            if (clonedAvatarImg && clonedAvatarImg.dataset.blinkIntervalId) {
                clearInterval(parseInt(clonedAvatarImg.dataset.blinkIntervalId));
            }
            clone.remove();
        }
        
        // show og avatarwindow
        avatarWindowEl.style.visibility = '';
        
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
        
        // restart og blinking
        const originalAvatarImg = avatarWindowEl.querySelector('.avatar');
        if (originalAvatarImg) {
            originalAvatarImg.src = `images/${currentOutfit}-avatar-open.PNG`;
            startBlinking(originalAvatarImg, currentOutfit);
        }
        
        delete avatarWindowEl.dataset.originalWidth;
        delete avatarWindowEl.dataset.clone;
        start = false;
        bagCreated = false;
        notebookCreated = false;
    }

    if (projectSelected && !bookListenersSetup) {
        console.log('project selected');
        const leftBtn = document.querySelector('.left-btn');
        const rightBtn = document.querySelector('.right-btn');
        const projectBookImg = document.querySelector('.book');
        const projectView = document.querySelector('.projects-view')
        const exitBtn = document.querySelector('.exit-btn')

        const newLeftBtn = leftBtn.cloneNode(true);
        const newRightBtn = rightBtn.cloneNode(true);
        leftBtn.parentNode.replaceChild(newLeftBtn, leftBtn);
        rightBtn.parentNode.replaceChild(newRightBtn, rightBtn);

        const freshLeftBtn = document.querySelector('.left-btn');
        const freshRightBtn = document.querySelector('.right-btn');

        freshRightBtn.addEventListener('click', () => {
            if (coverPage) {
                projectBookImg.src = 'images/open_book.PNG';
                coverPage = false;
                openBook = true;
                leftBtn.classList.remove('disabled');
                console.log('Book opened, page', pageNum)
            } else if (openBook && pageNum < numPages) {
                pageNum++;
                console.log('Turned to page:', pageNum)
            }

            if (pageNum === numPages) {
                projectBookImg.src = 'images/back_cover.PNG';
                openBook = false;
                backCover = true;
                console.log('Reached the end');
            }

            freshLeftBtn.classList.remove('disabled');
            if (pageNum === numPages) {
                freshRightBtn.classList.add('disabled');
            }
        })

        freshLeftBtn.addEventListener('click', () => {
            if (backCover) {
                projectBookImg.src = 'images/open_book.PNG';
                backCover = false;
                openBook = true;
                rightBtn.classList.remove('.disabled');
                console.log('Book opened, page', pageNum)
            } else if (openBook && pageNum > 0) {
                pageNum--;
                console.log('Turned to page:', pageNum)
            }

            if (pageNum === 0) {
                projectBookImg.src = 'images/cover_page.PNG';
                openBook = false;
                coverPage = true;
                console.log('Reached the beginning.');
            }

            freshRightBtn.classList.remove('disabled');
            if (pageNum === 0) {
                freshLeftBtn.classList.add('disabled');
            }
        })
        // page flip effect
        freshRightBtn.addEventListener('mouseover', () => {
            if (openBook) {
                projectBookImg.src = 'images/right_turn.PNG';
            }
        })

        freshRightBtn.addEventListener('mouseout', () => {
            if (openBook) {
                projectBookImg.src = 'images/open_book.PNG';
            }
        })

        freshLeftBtn.addEventListener('mouseover', () => {
            if (openBook) {
                projectBookImg.src = 'images/left_turn.PNG';
            }
        })

        freshLeftBtn.addEventListener('mouseout', () => {
            if (openBook) {
                projectBookImg.src = 'images/open_book.PNG';
            }
        })

        exitBtn.addEventListener('click', () => {
            projectView.style.display = 'none';
            projectSelected = false;
            bookListenersSetup = false;
        })
    }

    const contactForm = document.querySelector('#form');
    const contactCard = document.querySelector('.lets-connect-wrapper');

    contactForm.addEventListener('mouseenter', () => {
    contactCard.classList.add('float-up');
    });

    contactForm.addEventListener('mouseleave', () => {
    contactCard.classList.remove('float-up');
    });


    if (scrollTop > 7500) {
        const clone = document.getElementById('avatar-window-clone');
        if (clone) {
            // stop blinking on the clone before removing
            const clonedAvatarImg = clone.querySelector('.avatar');
            if (clonedAvatarImg && clonedAvatarImg.dataset.blinkIntervalId) {
                clearInterval(parseInt(clonedAvatarImg.dataset.blinkIntervalId));
            }
            clone.remove();
        }
        }
        
    }
    


);
