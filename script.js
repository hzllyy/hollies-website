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

// function to detect if device is mobile
function isMobile() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const screenRatio = window.screen.width / window.screen.height;

    const mobileRatio = { min: 0.40, max: 0.545};

    if (aspectRatio >= mobileRatio.min && aspectRatio <= mobileRatio.max ||
        screenRatio >= mobileRatio.min && screenRatio <= mobileRatio.max
    ) {
        return true;
    }

    return false;
}

let currentMode = isMobile() ? 'mobile' : 'desktop';

// initialize values
let scaledWindow = 1 + Math.min(window.scrollY, 2500) / 5000;
let scaledHi = 0;
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
let aboutMeSummaryCreated = false;
let aboutMeExpCreated = false;
let aboutMeAvatarCreated = false;
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
const numPages = 4;
let coverPage = true;
let backCover = false;
let openBook = false;
let pageNum = 0;
let bookListenersSetup = false;

// contact card
let contactCreated = false;
let cloneWindowHidden = false;
let cloneShouldExist = false;
let cloneVisibleRange = { start: 3600, end: 4600 };
let notificationCreated = false;

let scrolledPast = false;

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

// create notification
function createNotification() {
    const projectNotification = document.createElement('img');
    projectNotification.src = 'images/project_notification.png';
    projectNotification.alt = 'notification';
    projectNotification.className = 'notification';

    const clone = document.getElementById('avatar-window-clone');
    if (clone) {
        clone.appendChild(projectNotification);
    }
}

// helper function for project book logic
function setupProjectBook() {
    if (projectSelected && !bookListenersSetup) {
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
                projectBookImg.src = 'images/page1.png';
                coverPage = false;
                openBook = true;
                freshLeftBtn.classList.remove('disabled');
                console.log('Book opened, page', pageNum)
            } else if (openBook && pageNum < numPages) {
                pageNum++;
                projectBookImg.src = `images/page${pageNum + 1}.png`
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
        });

        freshLeftBtn.addEventListener('click', () => {
            if (backCover) {
                projectBookImg.src = 'images/page4.png';
                backCover = false;
                openBook = true;
                freshRightBtn.classList.remove('disabled');
                console.log('Book opened, page', pageNum)
            } else if (openBook && pageNum > 0) {
                pageNum--;
                projectBookImg.src = `images/page${pageNum}.png`
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
        });
        // page flip effect
        // freshRightBtn.addEventListener('mouseover', () => {
        //     if (openBook) {
        //         projectBookImg.src = 'images/right_turn.PNG';
        //     }
        // });

        // freshRightBtn.addEventListener('mouseout', () => {
        //     if (openBook) {
        //         projectBookImg.src = 'images/open_book.PNG';
        //     }
        // });

        // freshLeftBtn.addEventListener('mouseover', () => {
        //     if (openBook) {
        //         projectBookImg.src = 'images/left_turn.PNG';
        //     }
        // });

        // freshLeftBtn.addEventListener('mouseout', () => {
        //     if (openBook) {
        //         projectBookImg.src = 'images/open_book.PNG';
        //     }
        // });

        exitBtn.addEventListener('click', () => {
            document.body.style.overflow = '';
            projectView.style.display = 'none';
            projectSelected = false;
            bookListenersSetup = false;
            pageNum = 0;
            projectBookImg.src = 'images/cover_page.PNG';
            coverPage = true;
            openBook = false;
            backCover = false;

            freshLeftBtn.classList.add('disabled');
            freshRightBtn.classList.remove('disabled');
        });

        bookListenersSetup = true;
    }
}

// load mobile screen if mobile 
if (currentMode === 'mobile') {
    const computer = document.getElementById('bg');
    computer.src = 'images/phone.PNG';
    computer.style.width = '100vw';
    computer.style.height = 'auto';

    const hiWrapper = document.querySelector('.hi-wrapper');
    const hi = document.getElementById('hi');
    hi.src = 'images/mobile-hi.PNG';
    hi.style.height = '22vw';
    hiWrapper.style.zIndex = '9999';
    hiWrapper.style.top = '35%';
    hiWrapper.style.transform = 'translate(-50%, -50%)';

    const logo = document.getElementById('logo');
    const logoWrapper = document.querySelector('.logo-wrapper');
    const nwindow = document.getElementById('window');
    const nwindowWrapper = document.querySelector('.window-wrapper');
    const extender = document.getElementById('extend');
    const extenderWrapper= document.querySelector('.extender-wrapper');
    logo.style.opacity = '0';
    logo.style.visibility = 'hidden';
    nwindow.style.opacity = '0';
    nwindow.style.visibility = 'hidden';
    extender.style.opacity = '0';
    extender.style.visibility = 'hidden';

    let hasShownUI = false;

    // mobile scroll events
    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const computer = document.getElementById("bg");
        const iama = document.getElementById('iama');

        const scale = 1 + scrollTop / 250;
        const scale2 = 1 + scrollTop / 5000;
        const scalehi = 1 + scrollTop / 900;

        if (scrollTop <= 1500) {
            computer.style.transform = `scale(${scale}) translateY(-${scale2}%)`;
            hi.style.transform = `translateY(${-(scale2 - 1) * 300}%) scale(${scalehi})`;
            nwindow.style.height = '72vw';
            nwindowWrapper.style.top = '84vw';
            extender.style.height = '49vw';
            extenderWrapper.style.top = '110vw';
            logo.style.height = '45vw';
            logoWrapper.style.top = '96vw';
            iama.style.display = 'none';

            // store final states
            scaledHi = scalehi;
            frozenTitle = -(scale2 - 1) * 300;
        }

        const staticUI = [nwindow, extender, logo, iama];

        function hideUIOpacity() {
            staticUI.forEach(el => {
                if (!el) return;
                if (hasShownUI && !scrolledPast) {
                    el.classList.remove('zoom-in');
                    el.classList.add('zoom-out');
                }
                    el.style.transition = 'opacity 0.4s ease, visibility 0.4s ease';
                    el.style.opacity = '0';
                    el.style.visibility = 'hidden';
            });
        }

        function showUIOpacity() {
            staticUI.forEach(el => {
                if (!el) return;
                hasShownUI = true;
                if (!scrolledPast) {
                    el.classList.remove('zoom-out');
                    el.classList.add('zoom-in');
                }
                el.style.transition = 'opacity 0.4s ease';
                el.style.opacity = '1';
                el.style.visibility = 'visible';
            });
        }

        if (scrollTop >= 900) {
            showUIOpacity();
        }

        if (scrollTop < 900) {
            hideUIOpacity();
            scrolledPast = false;
        }

        if (scrollTop > 1500 && scrollTop <= 2100) {
            scrolledPast = true;
            let extra = scrollTop - 1500;
            let progress = (scrollTop - 1500) / 1000;
            const scale3 = 1 + extra / 1000;

            const iamaWrapper = document.querySelector('.iama-wrapper');

            nwindow.style.transition = 'none';
            extender.style.transition = 'none';
            logo.style.transition = 'none';
            iama.style.transition = 'none';

            nwindow.classList.remove('zoom-in', 'zoom-out');
            extender.classList.remove('zoom-in', 'zoom-out');
            logo.classList.remove('zoom-in', 'zoom-out');
            iama.classList.remove('zoom-in', 'zoom-out');

            nwindow.style.transform = `translateY(${-(1/120 + progress) * 120}%)`;
            extender.style.transform = `translateY(${-(1/120 + progress) * 120}%)`;
            logo.style.transform = `translateY(${-(1/130 + progress) * 130}%)`;
            hi.style.transform = `translateY(${frozenTitle - extra * 0.3}%) scale(${scaledHi - (0.875 * progress)})`;
            iama.style.display = 'block';
            iama.style.height = '30vw';
            iamaWrapper.style.top = '90vw';
            iama.style.transform = `translateY(${-((1 + extra / 5000) - 1) * 1200}%) scale(${scale3})`;

            // fade the caption
            const fade = (scrollTop - 1500) / 600;
            hi.style.opacity = Math.max(1 - fade, 0);
            iama.style.opacity = Math.min(fade, 1);

            // create popup div
            if (!popupCreated) {
                const popupDiv = document.createElement('div');
                popupDiv.className = 'popup-div-notif';

                document.body.appendChild(popupDiv);
                popupCreated = true;
            }
        }

        // pop up windows for iama!
        else if (scrollTop > 2100 && scrollTop < 3000 && !designer) {
            designer = document.createElement('img');
            designer.className = 'notif-designer';
            designer.src = 'images/notif-designer.png';

            designer.setAttribute('data-aos', 'zoom-in');
            designer.setAttribute('data-aos-duration', '300'); 
            designer.setAttribute('data-aos-once', 'true');

            const popupDiv = document.querySelector('.popup-div-notif');
            popupDiv.appendChild(designer);
        } 

        if (scrollTop > 2400 && scrollTop < 3000 && !developer) {
            developer = document.createElement('img');
            developer.className = 'notif-developer';
            developer.src = 'images/notif-developer.png';

            developer.setAttribute('data-aos', 'zoom-in');
            developer.setAttribute('data-aos-duration', '300'); 
            developer.setAttribute('data-aos-once', 'true');

            const popupDiv = document.querySelector('.popup-div-notif');
            popupDiv.appendChild(developer);
        }

        if (scrollTop > 2700 && scrollTop < 3000 && !creator) {
            creator = document.createElement('img');
            creator.className = 'notif-creator';
            creator.src = 'images/notif-creator.png';

            creator.setAttribute('data-aos', 'zoom-in');
            creator.setAttribute('data-aos-duration', '300'); 
            creator.setAttribute('data-aos-once', 'true');

            const popupDiv = document.querySelector('.popup-div-notif');
            popupDiv.appendChild(creator);
        }

        // helper function to remove dynamic windows
        function removeWindow(el, clearRef) {
            if (!el) return;

            el.classList.add('zoom-out');

            el.addEventListener('animationend', () => {
                el.remove();
                clearRef();
            }, { once: true });
        }

        if (scrollTop <= 2100 && designer) {
            removeWindow(designer, () => designer = null);
        }

        if (scrollTop <= 2400 && developer) {
            removeWindow(developer, () => developer = null);
        }

        if (scrollTop <= 2700 && creator) {
            removeWindow(creator, () => creator = null);
        }

        if (scrollTop > 3000) {
            finalized = true;

            hideUIOpacity();

            removeWindow(designer, () => designer = null);
            removeWindow(developer, () => developer = null);
            removeWindow(creator, () => creator = null);
            
            const popupDiv = document.querySelector('.popup-div-notif');
            popupDiv.style.zIndex = '-9999';
        }

        if (scrollTop <= 3000) {
            finalized = false;

            if (popupCreated) {
                const popupDiv = document.querySelector('.popup-div-notif');
                popupDiv.style.zIndex = '9999';
            }
        }

        if (scrollTop > 3200 && scrollTop <= 3500 && !aboutMeSummaryCreated) {
            aboutMeSummaryCreated = true;

            // experience!
            const aboutMeContent = document.createElement('div');
            const aboutMeHeader = document.createElement('h1');
            aboutMeHeader.textContent = 'Recent Technical Experience';
            aboutMeHeader.className = 'resume-h';
            aboutMeContent.appendChild(aboutMeHeader);

            const weeeDiv = document.createElement('div')
            weeeDiv.className = 'resume-div';
            const weeeHeader = document.createElement('h3');
            weeeHeader.className = 'resume-header';
            weeeHeader.textContent = 'Software Engineer @ Weee!'
            weeeDiv.appendChild(weeeHeader);
            const weeeFirstBullet = document.createElement('p');
            weeeFirstBullet.textContent = 'Designed and shipped a CMS-like seasonal campaign system powering dynamic React storefronts and homepage modules via backend APIs and feature-flagged rollouts, enabling non-engineering teams to launch and iterate on high-traffic holiday campaigns without code changes while preserving site reliability.';
            weeeHeader.appendChild(weeeFirstBullet);
            aboutMeContent.appendChild(weeeDiv);

            const FHDiv = document.createElement('div')
            FHDiv.className = 'resume-div';
            const FHHeader = document.createElement('h3');
            FHHeader.className = 'resume-header';
            FHHeader.textContent = 'Frontend Engineer @ Fourth & Hope'
            FHDiv.appendChild(FHHeader);
            const FHFirstBullet = document.createElement('p');
            FHFirstBullet.textContent = 'Modernized and optimized a React platform by refactoring legacy components, improving routing and performance, implementing WCAG-compliant accessibility fixes, enhancing SEO and responsiveness, and translating design mockups into reusable components.';
            FHHeader.appendChild(FHFirstBullet);
            aboutMeContent.appendChild(FHDiv);

            summaryWindowEl = createWindow('summary-window-id', aboutMeContent, 'experience.txt', null);

            const aboutMeWindow = document.querySelector('.about-me');
            aboutMeWindow.classList.add('about-me-mobile');

        }

        if (scrollTop <= 3200) {
            removeAboutMeWindow(summaryWindowEl, () => summaryWindowEl = null);
            aboutMeSummaryCreated = false;
        }

        if (scrollTop > 3500 && aboutMeSummaryCreated) {
            removeAboutMeWindow(summaryWindowEl, () => summaryWindowEl = null);
            aboutMeSummaryCreated = false;
        }

        if (scrollTop > 3600 && !aboutMeSummaryCreated && !aboutMeAvatarCreated && scrollTop <= 3900) {
            // avatar
            aboutMeAvatarCreated = true;
            const avatar = document.createElement('img');
            avatar.src = 'images/default-avatar-open.PNG';
            avatar.alt = 'avatar';
            avatar.className = 'avatar-mobile';

            const outfitSwitch = document.createElement('div');
            outfitSwitch.className = 'outfit-switch-mobile';

            hi.style.pointerEvents = 'none';

            const fits = [
                { icon: "fa-solid fa-child-dress", outfit: 'default'},
                { icon: "fa-solid fa-star", outfit: 'y2k'},
                { icon: "fa-solid fa-snowflake", outfit: 'winter'},
                { icon: "fa-solid fa-apple-whole", outfit: 'apple'}
            ]

            let currentSelectedButton = null;
            
            fits.forEach(({ icon, outfit }, index) => {
                const fitButton = document.createElement('button');
                fitButton.className = 'fit-btn';

                if (index === 0) {
                    fitButton.classList.add('fit-selected');
                    currentSelectedButton = fitButton;
                    currentOutfit = 'default';
                }

                const iconElement = document.createElement('i');
                iconElement.className = icon;

                fitButton.appendChild(iconElement);

                fitButton.addEventListener('click', () => {
                    if (currentSelectedButton) {
                        currentSelectedButton.classList.remove('fit-selected');
                    }

                    fitButton.classList.add('fit-selected');
                    currentSelectedButton = fitButton;
                    currentOutfit = outfit;
                    
                    const isCloneVisible = scrollTop > 3800 && scrollTop <= 4200;
                    
                    if (isCloneVisible) {
                        const clone = document.getElementById('avatar-window-clone');
                        if (clone) {
                            const clonedAvatar = clone.querySelector('.avatar-mobile');
                            if (clonedAvatar) {
                                clonedAvatar.src = `images/${outfit}-avatar-open.PNG`;
                                startBlinking(clonedAvatar, outfit);
                            }
                        }
                        
                        if (avatar) {
                            avatar.src = `images/${outfit}-avatar-open.PNG`;
                        }
                    } else {
                        if (avatar) {
                            avatar.src = `images/${outfit}-avatar-open.PNG`;
                            startBlinking(avatar, outfit);
                        }
                    }
                }
            );
                outfitSwitch.appendChild(fitButton);
            })

            if (!document.getElementById('avatar-window-id')) {
                aboutMeAvatarCreated = true;
                avatarWindowEl = createWindow('avatar-window-id', avatar, 'avatar.jpg', outfitSwitch);
            }

            // avatar animation
            startBlinking(avatar, 'default');

            const hobbyArray = [
                { src: 'images/html5.PNG', label: 'HTML5'},
                { src: 'images/css3.PNG', label: 'CSS3'},
                { src: 'images/js.PNG', label: 'JavaScript'},
                { src: 'images/react.PNG', label: 'React'},
                { src: 'images/nodejs.PNG', label: 'NodeJS'}
            ]

            const hobbies = document.createElement('div');
            hobbies.className = 'hobbies-div-mobile';

            let currentHobby = null;

            hobbyArray.forEach(({ src, label }) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'hobby-mobile';

                const img = document.createElement('img');
                img.src = src;
                img.alt = label;
                img.title = label;

                wrapper.dataset.label = label;
                wrapper.appendChild(img);
                hobbies.appendChild(wrapper);

                const tooltip = document.createElement('div');
                tooltip.className = 'mobile-tooltip';
                tooltip.textContent = label;
                tooltip.style.cssText = `
                    position: absolute;
                    top: -30px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 4vw !important;
                    font-family: 'Anonymous Pro' !important;
                    white-space: nowrap;
                    opacity: 0;
                    transition: opacity 0.2s;
                    pointer-events: none;
                    z-index: 100;
                `;
                
                wrapper.appendChild(tooltip);

                img.addEventListener('click', () => {
                    tooltip.style.opacity = '1';
                    
                    setTimeout(() => {
                        tooltip.style.opacity = '0';
                    }, 1000);
                });

                img.addEventListener('click', (e) => {
                    e.stopPropagation();
                    img.classList.toggle('tooltip-active');

                    document.querySelectorAll('.hobby-mobile img').forEach(otherImg => {
                        if (otherImg !== img) {
                            otherImg.classList.remove('tooltip-active');
                        }
                    })

                    if (currentHobby) {
                        currentHobby.classList.remove('hobby-selected');
                    }
                    
                    img.classList.add('hobby-selected');
                    currentHobby = img;
                })
                
            })

            if (!document.querySelector('#hobbies-window-id')) {
                hobbiesWindowEl = createWindow('hobbies-window-id', hobbies, 'skills.jpg', null);
            }
        }

        if (scrollTop <= 3600) {
            aboutMeAvatarCreated = false;

            if (blinkInterval) {
                clearInterval(blinkInterval);
                blinkInterval = null;
            }
            removeAboutMeWindow(hobbiesWindowEl, () => hobbiesWindowEl = null);
            removeAboutMeWindow(avatarWindowEl, () => avatarWindowEl = null);
        }

        if (scrollTop > 3900 && aboutMeAvatarCreated) {
            removeAboutMeWindow(hobbiesWindowEl, () => hobbiesWindowEl = null);
            summaryHobbiesHidden = true;
            aboutMeAvatarCreated = false;
        }

        // PAIN IN THE ASS avatar window zoom ;-;
        if (scrollTop > 3900 && scrollTop <= 4600 && avatarWindowEl) {
            const progress = (scrollTop - 3900) / 700;

            if (!start) {
                const originalAvatarImg = avatarWindowEl.querySelector('.avatar-mobile');
                if (originalAvatarImg && originalAvatarImg.dataset.blinkIntervalId) {
                    clearInterval(parseInt(originalAvatarImg.dataset.blinkIntervalId));
                    delete originalAvatarImg.dataset.blinkIntervalId;
                }

                const clone = avatarWindowEl.cloneNode(true);
                clone.id = 'avatar-window-clone';

                const rect = avatarWindowEl.getBoundingClientRect();

                clone.style.position = 'fixed';
                clone.style.left = `${rect.left}px`;
                clone.style.top = `${rect.top}px`;
                clone.style.height = `${avatarWindowEl.offsetHeight}px`;
                clone.style.zIndex = '10';
                clone.style.width = '85vw';
                clone.style.fontSize = '4vw';

                const clonedAvatarImg = clone.querySelector('.avatar-mobile');
                if (clonedAvatarImg) {
                    clonedAvatarImg.src = `images/${currentOutfit}-avatar-open.PNG`;
                    startBlinking(clonedAvatarImg, currentOutfit);
                }

                avatarWindowEl.style.visibility = 'hidden';

                avatarWindowEl.dataset.clone = 'true';
                document.body.appendChild(clone);
                
                avatarWindowEl.dataset.originalHeight = avatarWindowEl.offsetHeight;

                const cloneOutfitSwitch = clone.querySelector('.outfit-switch-mobile');
                if (cloneOutfitSwitch) {
                    cloneOutfitSwitch.classList.add('outfit-switch-off');
                }
                
                start = true;
            }

            const originalHeight = parseFloat(avatarWindowEl.dataset.originalHeight);
            const newHeight = originalHeight * (1 + (0.25 * progress));

            const clone = document.getElementById('avatar-window-clone');
            const innerWindow = clone?.querySelector('.aboutme-inner-window');

            if (clone) {
                clone.style.height = `${newHeight}px`;
                
                const avatarImg = clone.querySelector('.avatar-mobile');
                const outfitSwitch = clone.querySelector('.outfit-switch-mobile');
                const belowHeader = clone.querySelector('.belowHeader');

                const newInnerHeight = newHeight - 90;
                
                if (innerWindow && avatarImg && outfitSwitch && belowHeader) {
                    belowHeader.style.display = 'flex';
                    belowHeader.style.alignItems = 'stretch';

                    innerWindow.style.overflow = 'hidden';
                    innerWindow.style.height = `${newInnerHeight}px`;

                    const scale3 = ((1/1.4) + progress) * 1.4;
                    const scale4 = ((1/16) + progress) * 16;
                    const scale5 = ((1/22)+ progress) * 22;
                    const scale6 = ((1/5) + progress) * 5;

                    avatarImg.style.height = '120vw';
                    avatarImg.style.flexShrink = '0';
                    avatarImg.style.transform = `scale(${scale3}) translateX(-${scale4}%)`;
                    
                    outfitSwitch.style.flexShrink = '0';
                    outfitSwitch.style.height = 'auto';
                    outfitSwitch.style.display = 'flex';
                    outfitSwitch.style.flexDirection = 'column';
                    outfitSwitch.style.justifyContent = 'start';

                const notebook = innerWindow.querySelector('.notebook');
                if (notebook) {
                    notebook.style.transform = `scale(${scale3})`;
                    notebook.style.transformOrigin = 'center center';
                }

                if (!notebookCreated) {
                    const notebook = document.createElement('img');
                    notebook.src = '/images/project-notebook-selected.PNG';
                    notebook.alt = 'project-notebook';
                    notebook.className = 'notebook';
                    
                    innerWindow.appendChild(notebook);
                    
                    notebook.style.position = 'absolute';
                    notebook.style.height = '115vw';
                    
                    const notebookHoverArea = document.createElement('div');
                    notebookHoverArea.className = 'notebook-hover-area';
                    notebookHoverArea.style.position = 'absolute';
                    notebookHoverArea.style.width = '22%';
                    notebookHoverArea.style.height = '12%';
                    notebookHoverArea.style.left = '42%';
                    
                    innerWindow.appendChild(notebookHoverArea);
                    
                    notebookHoverArea.addEventListener('click', () => {
                        const viewProject = document.querySelector('.projects-view');
                        if (viewProject) {
                            viewProject.style.display = 'block';
                            document.body.style.overflow = 'hidden';
                            projectSelected = true;
                            coverPage = true;
                            backCover = false;
                            openBook = false;
                            bookListenersSetup = false; 
                            pageNum = 0;

                            setTimeout(() => {
                                setupProjectBook();
                            }, 10);
                        } else {
                            console.error('projects-view element not found!');
                        }
                    });
                    
                    notebookCreated = true;
                }

                const notebookHoverArea = innerWindow.querySelector('.notebook-hover-area');
                if (notebook && notebookHoverArea) {
                    notebook.style.padding = '0 3vw';
                    notebook.style.transform = `scale(${scale3}) translateX(-${scale5}%) translateY(-${scale6}%)`;
                    notebookHoverArea.style.transform = `scale(${scale3}) translateX(-${scale5}%) translateY(-${scale6}%)`;
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
                    
                    bagCreated = true;
                }

                const bag = innerWindow.querySelector('.bag');
                bag.style.height = '120vw';
                if (bag) {
                    bag.style.transform = `scale(${scale3}) translateX(-${scale4}%)`;
                    bag.style.transformOrigin = 'center center';
                    bag.style.padding = '0 3vw';
                }  
                }
            }
        }

        if (scrollTop >= 4400 && !notificationCreated) {
            createNotification();
            
            const notification = document.querySelector('.notification');
            showWindowWithAnimation(notification);
            notificationCreated = true;
        }

        if (scrollTop < 4400 && notificationCreated) {
            const notification = document.querySelector('.notification');
            hideWindowWithAnimation(notification);
            notificationCreated = false;
        }

        // scroll past avatar zoom 
        if (scrollTop > 4600 && scrollTop <= 4800) {
            const clone = document.getElementById('avatar-window-clone');
            cloneShouldExist = true;
            if (cloneWindowHidden) {
                showWindowWithAnimation(clone);
                cloneWindowHidden = false;
            }

            if (clone && avatarWindowEl) {
                if (!avatarWindowEl.dataset.originalHeight) {
                    avatarWindowEl.dataset.originalHeight = avatarWindowEl.offsetHeight / 1.25;
                }
                
                const originalHeight = parseFloat(avatarWindowEl.dataset.originalHeight);
                const newHeight = originalHeight * 1.25;
                
                clone.style.height = `${newHeight}px`;
                
                // Ensure blinking
                const clonedAvatarImg = clone.querySelector('.avatar-mobile');
                if (clonedAvatarImg && !clonedAvatarImg.dataset.blinkingStarted) {
                    startBlinking(clonedAvatarImg, currentOutfit);
                }

                const cloneOutfitSwitch = clone.querySelector('.outfit-switch-mobile');
                if (cloneOutfitSwitch && !cloneOutfitSwitch.classList.contains('outfit-switch-off')) {
                    cloneOutfitSwitch.classList.add('outfit-switch-off');
                }
                
                // maintain layout
                const innerWindow = clone.querySelector('.aboutme-inner-window-mobile');
                const avatarImg = clone.querySelector('.avatar-mobile');
                const outfitSwitch = clone.querySelector('.outfit-switch-mobile');
                const belowHeader = clone.querySelector('.belowHeader');
                
                if (innerWindow && avatarImg && outfitSwitch && belowHeader) {
                    belowHeader.style.display = 'flex';
                    belowHeader.style.alignItems = 'stretch';
                    
                    innerWindow.style.flex = '1';
                    innerWindow.style.minHeight = '0';
                    innerWindow.style.display = 'flex';
                    innerWindow.style.justifyContent = 'center';
                    innerWindow.style.alignItems = 'center';
                    innerWindow.style.overflow = 'hidden';
                    
                    avatarImg.style.height = 'auto';
                    avatarImg.style.maxHeight = '120vw';
                    avatarImg.style.flexShrink = '0';
                    
                    outfitSwitch.style.flexShrink = '0';
                    outfitSwitch.style.height = 'auto';
                }
            }
        }

        if (scrollTop <= 3900 && avatarWindowEl) {
            const clone = document.getElementById('avatar-window-clone');
            if (clone) {
                // stop blinking on the clone before removing
                const clonedAvatarImg = clone.querySelector('.avatar-mobile');
                if (clonedAvatarImg && clonedAvatarImg.dataset.blinkIntervalId) {
                    clearInterval(parseInt(clonedAvatarImg.dataset.blinkIntervalId));
                }
                clone.remove();
            }
            
            // show og avatarwindow
            avatarWindowEl.style.visibility = '';
            
            const belowHeader = avatarWindowEl.querySelector('.belowHeader');
            const innerWindow = avatarWindowEl.querySelector('.aboutme-inner-window-mobile');
            const avatarImg = avatarWindowEl.querySelector('.avatar-mobile');
            const outfitSwitch = avatarWindowEl.querySelector('.outfit-switch-mobile');
            
            if (belowHeader) {
                belowHeader.style.display = '';
                belowHeader.style.alignItems = '';
            }
            
            if (innerWindow) {
                innerWindow.style.flex = '';
                innerWindow.style.minHeight = '';
                innerWindow.style.display = '';
                innerWindow.style.justifyContent = '';
                innerWindow.style.alignItems = '';
                innerWindow.style.overflow = '';
            }
            
            if (avatarImg) {
                avatarImg.style.height = '';
                avatarImg.style.maxHeight = '';
                avatarImg.style.flexShrink = '';
            }
            
            if (outfitSwitch) {
                outfitSwitch.style.flexShrink = '';
                outfitSwitch.style.height = '';
                outfitSwitch.style.display = '';
                outfitSwitch.style.flexDirection = '';
                outfitSwitch.style.justifyContent = '';
                outfitSwitch.style.padding = '';
            }
            
            // restart og blinking
            const originalAvatarImg = avatarWindowEl.querySelector('.avatar-mobile');
            if (originalAvatarImg) {
                originalAvatarImg.src = `images/${currentOutfit}-avatar-open.PNG`;
                startBlinking(originalAvatarImg, currentOutfit);
            }
            
            delete avatarWindowEl.dataset.originalHeight;
            delete avatarWindowEl.dataset.clone;
            start = false;
            bagCreated = false;
            notebookCreated = false;
        }

        if (projectSelected && !bookListenersSetup) {
            setupProjectBook();
        }

        if (scrollTop > 4800 && cloneShouldExist) {
            const clone = document.getElementById('avatar-window-clone');
            if (clone && !cloneWindowHidden) {
                hideWindowWithAnimation(clone);
                cloneWindowHidden = true;
            }
        }     

    })

} else {
    // SCROLL EVENTS START HERE
    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const computer = document.getElementById("bg");
        const header = document.getElementById('hi');
        const nwindow = document.getElementById('window');
        const extender = document.getElementById('extend');
        const logo = document.getElementById('logo');
        const iama = document.getElementById('iama');

        const scale = 1 + scrollTop / 600;
        const scale2 = 1 + scrollTop / 5000;

        if (scrollTop <= 1500) {
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
        else if (scrollTop > 1500 && scrollTop <= 2100) {
            let extra = scrollTop - 1500;
            const scale3 = 1 + extra / 1000;
            nwindow.style.transform = `translateY(${frozenWindow - extra * 0.08}%) scale(${scaledWindow})`;
            extender.style.transform = `translateY(${frozenExtend - extra * 0.04}%) scale(${scaledWindow})`;
            logo.style.transform = `translateY(${frozenLogo - extra * 0.048}%) scale(${scaledWindow})`;
            header.style.transform = `translateY(${frozenTitle - extra * 0.03}%) scale(${scaledWindow})`;
            iama.style.display = 'block';
            iama.style.transform = `translateY(${-((1 + extra / 5000) - 1) * 700}%) scale(${scale3})`;

            // fade the caption
            const fade = (scrollTop - 1500) / 600;
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
        else if (scrollTop > 2100 && scrollTop < 3000 && !designer) {
            designer = document.createElement('img');
            designer.className = 'designer';
            designer.src = 'images/designer.png';

            designer.setAttribute('data-aos', 'zoom-in');
            designer.setAttribute('data-aos-duration', '300'); 
            designer.setAttribute('data-aos-once', 'true');

            const popupDiv = document.querySelector('.popup-div');
            popupDiv.appendChild(designer);
        } 

        if (scrollTop > 2400 && scrollTop < 3000 && !developer) {
            developer = document.createElement('img');
            developer.className = 'developer';
            developer.src = 'images/developer.png';

            developer.setAttribute('data-aos', 'zoom-in');
            developer.setAttribute('data-aos-duration', '300'); 
            developer.setAttribute('data-aos-once', 'true');

            const popupDiv = document.querySelector('.popup-div');
            popupDiv.appendChild(developer);
        }

        if (scrollTop > 2700 && scrollTop < 3000 && !creator) {
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
        if (scrollTop <= 2100 && designer) {
            removeWindow(designer, () => designer = null);
        }

        if (scrollTop <= 2400 && developer) {
            removeWindow(developer, () => developer = null);
        }

        if (scrollTop <= 2700 && creator) {
            removeWindow(creator, () => creator = null);
        }

        const staticUI = [nwindow, extender, logo, iama];

        if (scrollTop > 3000 && !finalized) {
            finalized = true;

            hideUIOpacity();

            removeWindow(designer, () => designer = null);
            removeWindow(developer, () => developer = null);
            removeWindow(creator, () => creator = null);
            
            const popupDiv = document.querySelector('.popup-div');
            popupDiv.style.zIndex = '-9999';
        }

        if (scrollTop <= 3000) {
            showUIOpacity();
            finalized = false;

            if (popupCreated) {
                const popupDiv = document.querySelector('.popup-div');
                popupDiv.style.zIndex = '9999';
            }
        }

        // create about me windows!
        if (scrollTop > 3300 && !aboutMeCreated) {
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
                    
                    const isCloneVisible = scrollTop > 3600 && scrollTop <= 4200;
                    
                    if (isCloneVisible) {
                        const clone = document.getElementById('avatar-window-clone');
                        if (clone) {
                            const clonedAvatar = clone.querySelector('.avatar');
                            if (clonedAvatar) {
                                clonedAvatar.src = `images/${outfit}-avatar-open.PNG`;
                                startBlinking(clonedAvatar, outfit);
                            }
                        }
                        
                        if (avatar) {
                            avatar.src = `images/${outfit}-avatar-open.PNG`;
                        }
                    } else {
                        if (avatar) {
                            avatar.src = `images/${outfit}-avatar-open.PNG`;
                            startBlinking(avatar, outfit);
                        }
                    }
                }
            );
                outfitSwitch.appendChild(fitButton);
            })

            avatarWindowEl = createWindow('avatar-window-id', avatar, 'avatar.jpg', outfitSwitch);

            // avatar animation
            startBlinking(avatar, 'default');

            const aboutMeContent = document.createElement('div');
            const aboutMeHeader = document.createElement('h1');
            aboutMeHeader.textContent = 'Recent Technical Experience';
            aboutMeContent.appendChild(aboutMeHeader);

            const weeeDiv = document.createElement('div')
            weeeDiv.className = 'resume-div';
            const weeeHeader = document.createElement('h3');
            weeeHeader.className = 'resume-header';
            weeeHeader.textContent = 'Software Engineer @ Weee!'
            weeeDiv.appendChild(weeeHeader);
            const weeeFirstBullet = document.createElement('p');
            weeeFirstBullet.textContent = 'Designed and shipped a CMS-like seasonal campaign system powering dynamic React storefronts and homepage modules via backend APIs and feature-flagged rollouts, enabling non-engineering teams to launch and iterate on high-traffic holiday campaigns without code changes while preserving site reliability.';
            weeeHeader.appendChild(weeeFirstBullet);
            aboutMeContent.appendChild(weeeDiv);

            const FHDiv = document.createElement('div')
            FHDiv.className = 'resume-div';
            const FHHeader = document.createElement('h3');
            FHHeader.className = 'resume-header';
            FHHeader.textContent = 'Frontend Engineer @ Fourth & Hope'
            FHDiv.appendChild(FHHeader);
            const FHFirstBullet = document.createElement('p');
            FHFirstBullet.textContent = 'Modernized and optimized a React platform by refactoring legacy components, improving routing and performance, implementing WCAG-compliant accessibility fixes, enhancing SEO and responsiveness, and translating design mockups into reusable components.';
            FHHeader.appendChild(FHFirstBullet);
            aboutMeContent.appendChild(FHDiv);

            summaryWindowEl = createWindow('summary-window-id', aboutMeContent, 'experience.txt', null);

            const hobbyArray = [
                { src: 'images/html5.PNG', label: 'HTML5'},
                { src: 'images/css3.PNG', label: 'CSS3'},
                { src: 'images/js.PNG', label: 'JavaScript'},
                { src: 'images/react.PNG', label: 'React'},
                { src: 'images/nodejs.PNG', label: 'NodeJS'}
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

            hobbiesWindowEl = createWindow('hobbies-window-id', hobbies, 'skills.jpg', null);

            const element = avatarWindowEl;
        }

        // remove about me if scrolled up
        if (scrollTop <= 3300 && aboutMeCreated) {
            aboutMeCreated = false;
            cloneShouldExist = false;

            if (blinkInterval) {
                clearInterval(blinkInterval);
                blinkInterval = null;
            }

            removeAboutMeWindow(avatarWindowEl, () => avatarWindowEl = null);
            removeAboutMeWindow(summaryWindowEl, () => summaryWindowEl = null);
            removeAboutMeWindow(hobbiesWindowEl, () => hobbiesWindowEl = null);
        }

        // hide windows when scrolling past aboutme
        if (scrollTop > 3600 && !summaryHobbiesHidden) {
            summaryHobbiesHidden = true;
            
            hideWindowWithAnimation(summaryWindowEl);
            hideWindowWithAnimation(hobbiesWindowEl);
        }

        if (scrollTop <= 3600 && summaryHobbiesHidden) {
            summaryHobbiesHidden = false;
            cloneShouldExist = false;
            
            showWindowWithAnimation(summaryWindowEl);
            showWindowWithAnimation(hobbiesWindowEl);
        }

        // PAIN IN THE ASS avatar window zoom ;-;
        if (scrollTop > 3600 && scrollTop <= 4600 && avatarWindowEl) {
            const progress = (scrollTop - 3600) / 1000;
            cloneShouldExist = true;

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
            const newWidth = originalWidth + (originalWidth * 1.75 * progress);

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
                        const viewProject = document.querySelector('.projects-view');
                        if (viewProject) {
                            viewProject.style.display = 'block';
                            document.body.style.overflow = 'hidden';
                            projectSelected = true;
                            coverPage = true;
                            backCover = false;
                            openBook = false;
                            bookListenersSetup = false; 
                            pageNum = 0;

                            setTimeout(() => {
                                setupProjectBook();
                            }, 10);
                        } else {
                            console.error('projects-view element not found!');
                        }
                    });
                    
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

        if (scrollTop >= 4400 && !notificationCreated) {
            createNotification();
            
            const notification = document.querySelector('.notification');
            showWindowWithAnimation(notification);
            notificationCreated = true;
        }

        if (scrollTop < 4400 && notificationCreated) {
            const notification = document.querySelector('.notification');
            hideWindowWithAnimation(notification);
            notificationCreated = false;
        }

        // scroll past avatar zoom 
        if (scrollTop > 4600 && scrollTop <= 4800) {
            const clone = document.getElementById('avatar-window-clone');
            if (cloneWindowHidden) {
                showWindowWithAnimation(clone);
                cloneShouldExist = true;
                cloneWindowHidden = false;
            }

            if (clone && avatarWindowEl) {
                if (!avatarWindowEl.dataset.originalWidth) {
                    avatarWindowEl.dataset.originalWidth = avatarWindowEl.offsetWidth / 2.75;
                }
                
                const originalWidth = parseFloat(avatarWindowEl.dataset.originalWidth);
                const newWidth = originalWidth * 2.75;
                
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

        if (scrollTop <= 3600 && avatarWindowEl) {
            // remove clone
            if (!cloneShouldExist) {
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
            setupProjectBook();
        }

        const contactForm = document.querySelector('#form');
        const contactCard = document.querySelector('.lets-connect-wrapper');

        contactForm.addEventListener('mouseenter', () => {
        contactCard.classList.add('float-up');
        });

        contactForm.addEventListener('mouseleave', () => {
        contactCard.classList.remove('float-up');
        });

        if (scrollTop > 4800 && cloneShouldExist) {
            const clone = document.getElementById('avatar-window-clone');
            if (clone && !cloneWindowHidden) {
                hideWindowWithAnimation(clone);
                cloneWindowHidden = true;
            }
        }      
    }
);
}

// handle switch between desktop and mobile
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const newMobile = isMobile();
        const newMode = newMobile ? 'mobile' : 'desktop';

        if (newMode !== currentMode) {
            window.scrollTo(0,0);

            setTimeout(() => {
                location.reload();
            }, 50);
        }
    }, 300);
})

// function to grab messages
document.getElementById('form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    
    try {
        const response = await fetch('https://formspree.io/f/xwvvndgq', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            document.querySelector('.sent-msg').style.display = 'block';
            const exitBtn = document.querySelector('.msg-exit-btn');
            exitBtn.addEventListener('click', () => {
                document.querySelector('.sent-msg').style.display = 'none';
            })
            document.getElementById('form').reset();
        } else {
            alert('Something went wrong. Please try again.');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
});
