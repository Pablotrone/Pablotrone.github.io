// === PROPERLY FIXED APP.JS - DESKTOP ANIMATIONS WORKING ===

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Argus Law application...');

    // === GLOBAL VARIABLES ===
    let verticalSwiper = null;
    let horizontalSwiper = null;
    let isMouseOverHorizontal = false;
    let horizontalScrollLock = false;

    // API Configuration
    const API_BASE_URL = 'http://127.0.0.1:8000/api';
    const API_ENDPOINTS = {
        login: `${API_BASE_URL}/auth/token/login/`,
        register: `${API_BASE_URL}/auth/users/`,
        userProfile: `${API_BASE_URL}/auth/users/me/`,
        logout: `${API_BASE_URL}/auth/token/logout/`
    };

    // === UTILITY FUNCTIONS ===
    function isMobileDevice() {
        return window.innerWidth <= 968;
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // === MOBILE-ONLY FIXES (DON'T AFFECT DESKTOP) ===
    function createMobileConsultationButton() {
        if (!isMobileDevice()) return;
        
        const headerSlide = document.querySelector('.header-content__slide.active');
        if (headerSlide && !headerSlide.querySelector('.mobile-consultation-btn')) {
            const consultBtn = document.createElement('a');
            consultBtn.href = 'consultation.html';
            consultBtn.className = 'mobile-consultation-btn';
            consultBtn.textContent = 'ЗАПИСЬ НА КОНСУЛЬТАЦИЮ';
            consultBtn.setAttribute('aria-label', 'Записаться на консультацию');
            
            // Touch events for mobile only
            consultBtn.addEventListener('touchstart', function(e) {
                this.style.transform = 'scale(0.95)';
            });
            
            consultBtn.addEventListener('touchend', function(e) {
                this.style.transform = 'scale(1)';
            });
            
            headerSlide.appendChild(consultBtn);
        }
    }

    function fixFloatingHeaderMobile() {
        if (!isMobileDevice()) return;
        
        const floatingHeader = document.getElementById('floatingHeader');
        if (floatingHeader) {
            floatingHeader.style.opacity = '1';
            floatingHeader.style.visibility = 'visible';
            floatingHeader.style.pointerEvents = 'auto';
            floatingHeader.classList.add('visible');
        }
    }

    function separateCopyrightYear() {
        if (!isMobileDevice()) return;
        
        const yearSpan = document.querySelector('.copyright .year');
        if (yearSpan) {
            yearSpan.style.display = 'block';
            yearSpan.style.marginTop = '10px';
            yearSpan.style.paddingTop = '10px';
            yearSpan.style.borderTop = '1px solid rgba(212, 175, 55, 0.2)';
        }
    }

    // === LETTER ANIMATION (WORKS ON BOTH DESKTOP AND MOBILE) ===
    function initHeaderAnimation() {
        try {
            const headerElements = document.querySelectorAll('.header-content h1');
            if (headerElements.length === 0) {
                console.warn('No header elements found for animation');
                return;
            }
            
            headerElements.forEach(element => {
                if (!element || !element.textContent) return;
                
                element.innerHTML = element.textContent.replace(/(\S*)/g, match => {
                    return match.replace(/\S/g, '<span class="letter">$&</span>');
                });
                
                const letters = element.querySelectorAll('.letter');
                letters.forEach((letter, index) => {
                    if (letter) {
                        // Desktop animation (original working animation)
                        letter.style.cssText = `
                            z-index: -${index}; 
                            transition-duration: ${index / 4.4 + 1}s;
                            display: inline-block;
                        `;
                    }
                });
            });
        } catch (error) {
            console.error('Error in header animation:', error);
        }
    }

    // === SWIPER INITIALIZATION (UNCHANGED - WORKING) ===
    function initializeSwiper() {
        if (typeof Swiper === 'undefined') {
            console.error('Swiper library is not loaded. Please include Swiper.js');
            return false;
        }

        const sliderElement = document.querySelector('.slider');
        if (!sliderElement) {
            console.error('Slider element not found. Please check your HTML structure');
            return false;
        }

        try {
            verticalSwiper = new Swiper('.slider', {
                direction: 'vertical',
                speed: 1700,
                parallax: true,
                resistanceRatio: 0.5,
                touchReleaseOnEdges: true,
                keyboard: {
                    enabled: true,
                    onlyInViewport: false,
                },
                mousewheel: {
                    eventsTarget: '.slider',
                    releaseOnEdges: true,
                    thresholdDelta: 15,
                    thresholdTime: 300,
                },
                noSwipingSelector: '.horizontal-swiper, .slide-content, .swiper-pagination, .swiper-button-next, .swiper-button-prev',
                on: {
                    init: function() {
                        console.log('Vertical swiper initialized successfully');
                        triggerSectionAnimations(0);
                        
                        // Only apply mobile fixes on mobile
                        if (isMobileDevice()) {
                            setTimeout(() => {
                                fixFloatingHeaderMobile();
                                createMobileConsultationButton();
                            }, 100);
                        }
                    },
                    slideChange: function() {
                        handleSlideChange(this.activeIndex);
                        triggerSectionAnimations(this.activeIndex);
                    }
                }
            });
            return true;
        } catch (error) {
            console.error('Error initializing vertical swiper:', error);
            return false;
        }
    }

    // === AUTHENTICATION SYSTEM (UNCHANGED - WORKING) ===
    const authElements = {
        modal: document.getElementById('authModal'),
        loginBtn: document.getElementById('loginBtn'),
        registerBtn: document.getElementById('registerBtn'),
        logoutBtn: document.getElementById('logoutBtn'),
        closeModal: document.querySelector('.close-modal'),
        loginForm: document.getElementById('loginForm'),
        registerForm: document.getElementById('registerForm'),
        userProfile: document.getElementById('userProfile'),
        userName: document.getElementById('userName')
    };

    function initializeAuthentication() {
        const missingElements = Object.entries(authElements).filter(([key, el]) => !el);
        if (missingElements.length > 0) {
            console.warn('Missing authentication elements:', missingElements.map(([key]) => key));
            return false;
        }

        try {
            checkAuthStatus();
            setupAuthEventListeners();
            setupFormEnhancements();
            return true;
        } catch (error) {
            console.error('Error initializing authentication:', error);
            return false;
        }
    }

    function setupAuthEventListeners() {
        const { modal, loginBtn, registerBtn, logoutBtn, closeModal, loginForm, registerForm } = authElements;

        const safeAddEventListener = (element, event, handler) => {
            if (element) {
                element.addEventListener(event, handler);
            }
        };

        safeAddEventListener(loginBtn, 'click', () => openAuthModal('login'));
        safeAddEventListener(registerBtn, 'click', () => openAuthModal('register'));
        safeAddEventListener(closeModal, 'click', closeAuthModal);
        safeAddEventListener(logoutBtn, 'click', handleLogout);

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeAuthModal();
            });
        }

        const authTabs = document.querySelectorAll('.auth-tab');
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                if (tabName) switchTab(tabName);
            });
        });

        safeAddEventListener(loginForm, 'submit', handleLogin);
        safeAddEventListener(registerForm, 'submit', handleRegister);
    }

    function setupFormEnhancements() {
        const inputs = document.querySelectorAll('.form-group input');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });

            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });

        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required]');
            
            inputs.forEach(input => {
                input.addEventListener('invalid', function(e) {
                    e.preventDefault();
                    this.classList.add('error');
                    
                    this.addEventListener('input', function() {
                        this.classList.remove('error');
                    }, { once: true });
                });

                input.addEventListener('blur', function() {
                    if (this.hasAttribute('required') && !this.value.trim()) {
                        this.classList.add('error');
                    } else {
                        this.classList.remove('error');
                    }
                });
            });
        });
    }

    // === AUTH MODAL FUNCTIONS (UNCHANGED) ===
    function openAuthModal(activeTab = 'login') {
        const { modal } = authElements;
        if (!modal) return;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        switchTab(activeTab);

        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
    }

    function closeAuthModal() {
        const { modal } = authElements;
        if (!modal) return;

        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
        clearFormMessages();
    }

    function switchTab(tabName) {
        const authTabs = document.querySelectorAll('.auth-tab');
        const authForms = document.querySelectorAll('.auth-form');
        
        authTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        authForms.forEach(form => {
            form.classList.toggle('active', form.id === `${tabName}Form`);
        });
    }

    function clearFormMessages() {
        document.querySelectorAll('.auth-message').forEach(msg => {
            if (msg) {
                msg.style.display = 'none';
                msg.textContent = '';
            }
        });
    }

    // === AUTH API FUNCTIONS (UNCHANGED) ===
    async function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;
        const messageEl = document.getElementById('loginMessage');

        if (!email || !password) {
            showMessage(messageEl, 'Пожалуйста, заполните все поля', 'error');
            return;
        }

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Вход...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(API_ENDPOINTS.login, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.auth_token) {
                localStorage.setItem('authToken', data.auth_token);
                
                const userResponse = await fetch(API_ENDPOINTS.userProfile, {
                    headers: { 'Authorization': `Token ${data.auth_token}` }
                });
                
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    updateUIAfterAuth(userData);
                    closeAuthModal();
                    showMessage(messageEl, 'Успешный вход!', 'success');
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } else {
                const errorMsg = data.non_field_errors?.[0] || 'Неверный email или пароль';
                showMessage(messageEl, errorMsg, 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage(messageEl, 'Ошибка соединения с сервером', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        
        const formData = {
            email: document.getElementById('registerEmail')?.value,
            first_name: document.getElementById('firstName')?.value,
            last_name: document.getElementById('lastName')?.value,
            username: document.getElementById('username')?.value,
            password: document.getElementById('registerPassword')?.value
        };
        
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        const messageEl = document.getElementById('registerMessage');

        if (!Object.values(formData).every(val => val && val.trim())) {
            showMessage(messageEl, 'Все поля обязательны для заполнения', 'error');
            return;
        }

        if (formData.password !== confirmPassword) {
            showMessage(messageEl, 'Пароли не совпадают', 'error');
            return;
        }

        if (formData.password.length < 8) {
            showMessage(messageEl, 'Пароль должен содержать минимум 8 символов', 'error');
            return;
        }

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Регистрация...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(API_ENDPOINTS.register, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(messageEl, 'Регистрация успешна! Теперь войдите.', 'success');
                switchTab('login');
                
                const loginEmailEl = document.getElementById('loginEmail');
                if (loginEmailEl) loginEmailEl.value = formData.email;
            } else {
                const errorFields = Object.keys(data);
                const errorMsg = errorFields.length > 0 
                    ? `${errorFields[0]}: ${data[errorFields[0]][0]}`
                    : 'Ошибка регистрации';
                showMessage(messageEl, errorMsg, 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showMessage(messageEl, 'Ошибка соединения с сервером', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async function handleLogout() {
        const token = localStorage.getItem('authToken');
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            const originalText = logoutBtn.textContent;
            logoutBtn.textContent = 'Выход...';
            logoutBtn.disabled = true;
        }

        try {
            if (token) {
                await fetch(API_ENDPOINTS.logout, {
                    method: 'POST',
                    headers: { 'Authorization': `Token ${token}` }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            updateUIAfterLogout();
            
            if (logoutBtn) {
                setTimeout(() => {
                    logoutBtn.textContent = 'Выйти';
                    logoutBtn.disabled = false;
                }, 1000);
            }
        }
    }

    // === UI UPDATE FUNCTIONS (UNCHANGED) ===
    function updateUIAfterAuth(userData) {
        const { loginBtn, registerBtn, userProfile, userName } = authElements;
        
        if (loginBtn) {
            loginBtn.style.display = 'none';
            loginBtn.style.opacity = '0';
        }
        if (registerBtn) {
            registerBtn.style.display = 'none';
            registerBtn.style.opacity = '0';
        }
        if (userProfile) {
            userProfile.style.display = 'flex';
            setTimeout(() => {
                userProfile.style.opacity = '1';
            }, 100);
        }
        
        const displayName = userData.username || 
                          `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 
                          userData.email?.split('@')[0] || 'Пользователь';
        
        if (userName) userName.textContent = displayName;
        
        localStorage.setItem('userData', JSON.stringify(userData));
    }

    function updateUIAfterLogout() {
        const { loginBtn, registerBtn, userProfile } = authElements;
        
        if (userProfile) {
            userProfile.style.opacity = '0';
            setTimeout(() => {
                userProfile.style.display = 'none';
            }, 300);
        }
        
        setTimeout(() => {
            if (loginBtn) {
                loginBtn.style.display = 'block';
                loginBtn.style.opacity = '1';
            }
            if (registerBtn) {
                registerBtn.style.display = 'block';
                registerBtn.style.opacity = '1';
            }
        }, 300);
    }

    async function checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            updateUIAfterLogout();
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.userProfile, {
                headers: { 'Authorization': `Token ${token}` }
            });

            if (response.ok) {
                const userData = await response.json();
                updateUIAfterAuth(userData);
            } else {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                updateUIAfterLogout();
            }
        } catch (error) {
            console.error('Auth check error:', error);
            updateUIAfterLogout();
        }
    }

    function showMessage(element, text, type) {
        if (!element) {
            console.error('Message element not found');
            return;
        }
        
        element.textContent = text;
        element.className = `auth-message ${type}`;
        element.style.display = 'block';

        if (type === 'success') {
            setTimeout(() => {
                if (element) {
                    element.style.opacity = '0';
                    setTimeout(() => {
                        element.style.display = 'none';
                        element.style.opacity = '1';
                    }, 300);
                }
            }, 3000);
        }
    }

    // === HORIZONTAL SWIPER (UNCHANGED - WORKING) ===
    function initHorizontalSwiper() {
        const horizontalEl = document.querySelector('.horizontal-swiper');
        if (!horizontalEl) {
            console.warn('Horizontal swiper element not found');
            return;
        }

        try {
            horizontalSwiper = new Swiper('.horizontal-swiper', {
                direction: 'horizontal',
                slidesPerView: 1,
                centeredSlides: true,
                spaceBetween: 30,
                grabCursor: true,
                slideToClickedSlide: true,
                preventInteractionOnTransition: true,
                loop: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                keyboard: {
                    enabled: true,
                    onlyInViewport: true,
                },
                mousewheel: {
                    forceToAxis: true,
                    invert: false,
                    eventsTarget: '.horizontal-swiper',
                    thresholdDelta: 5,
                    thresholdTime: 100,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true,
                    dynamicMainBullets: 3,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                on: {
                    init: function() {
                        console.log('Horizontal swiper initialized with enhanced effects');
                    },
                    slideChange: function() {
                        const activeSlide = this.slides[this.activeIndex];
                        if (activeSlide) {
                            createSlideRipple(activeSlide);
                        }
                    }
                }
            });

            setupHorizontalSwiperEvents(horizontalEl);
        } catch (error) {
            console.error('Error initializing horizontal swiper:', error);
        }
    }

    function createSlideRipple(slide) {
        const ripple = document.createElement('div');
        ripple.className = 'slide-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: slideRipple 1s ease-out forwards;
            pointer-events: none;
            z-index: 1;
        `;

        if (!document.querySelector('#slideRippleStyles')) {
            const style = document.createElement('style');
            style.id = 'slideRippleStyles';
            style.textContent = `
                @keyframes slideRipple {
                    to {
                        width: 200px;
                        height: 200px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        slide.appendChild(ripple);

        setTimeout(() => {
            if (ripple && ripple.parentNode) {
                ripple.remove();
            }
        }, 1000);
    }

    function setupHorizontalSwiperEvents(horizontalEl) {
        if (!horizontalEl || !verticalSwiper) return;

        horizontalEl.addEventListener('mouseenter', () => {
            isMouseOverHorizontal = true;
            verticalSwiper.mousewheel.disable();
            if (horizontalSwiper && horizontalSwiper.autoplay) {
                horizontalSwiper.autoplay.stop();
            }
        });

        horizontalEl.addEventListener('mouseleave', () => {
            isMouseOverHorizontal = false;
            verticalSwiper.mousewheel.enable();
            if (horizontalSwiper && horizontalSwiper.autoplay) {
                horizontalSwiper.autoplay.start();
            }
        });

        horizontalEl.addEventListener('wheel', function(e) {
            if (!horizontalSwiper) return;

            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
                e.deltaX > 0 ? horizontalSwiper.slideNext() : horizontalSwiper.slidePrev();
            } else if (isMouseOverHorizontal) {
                e.preventDefault();

                if (horizontalScrollLock) return;
                horizontalScrollLock = true;

                setTimeout(() => {
                    horizontalScrollLock = false;
                }, 300);

                e.deltaY > 0 ? horizontalSwiper.slideNext() : horizontalSwiper.slidePrev();
            }
        }, { passive: false });
    }

    // === NAVIGATION (UNCHANGED - WORKING) ===
    function setupNavigation() {
        const logo = document.querySelector('.logo');
        if (logo && verticalSwiper) {
            logo.addEventListener('click', function(e) {
                e.preventDefault();
                verticalSwiper.slideTo(0);
                addNavigationFeedback(this);
            });
        }

        const menuLinks = document.querySelectorAll('.main-menu a:not(.external-link)');
        const menuItems = document.querySelectorAll('.main-menu li');

        menuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                menuItems.forEach(item => item.classList.remove('active'));
                this.parentElement.classList.add('active');

                const linkText = this.textContent.trim();
                let slideIndex = 0;

                switch (linkText) {
                    case 'О нас': slideIndex = 1; break;
                    case 'Практики': slideIndex = 2; break;
                    case 'Контакты': slideIndex = 3; break;
                    default: slideIndex = 0;
                }

                if (verticalSwiper) {
                    verticalSwiper.slideTo(slideIndex);
                }

                addNavigationFeedback(this);
            });

            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });

            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    function addNavigationFeedback(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }

    // === SLIDE CHANGE HANDLER (FIXED FOR DESKTOP ANIMATIONS) ===
    function handleSlideChange(activeIndex) {
        try {
            // Update header slides
            document.querySelectorAll('.header-content__slide').forEach((e, i) => {
                e.classList.toggle('active', activeIndex === i);
            });

            // Header visibility control - DESKTOP BEHAVIOR PRESERVED
            const headerUI = document.querySelector('.slider-ui.home-only');
            const floatingHeader = document.getElementById('floatingHeader');
            
            if (headerUI && floatingHeader) {
                if (isMobileDevice()) {
                    // Mobile: always show floating header
                    headerUI.classList.add('hidden');
                    floatingHeader.classList.add('visible');
                    fixFloatingHeaderMobile();
                } else {
                    // Desktop: original behavior - WORKING
                    if (activeIndex === 0) {
                        headerUI.classList.remove('hidden');
                        floatingHeader.classList.remove('visible');
                    } else {
                        headerUI.classList.add('hidden');
                        floatingHeader.classList.add('visible');
                    }
                }
            }

            // Update menu items
            const menuItems = document.querySelectorAll('.main-menu li');
            menuItems.forEach((item, index) => {
                item.classList.remove('active');
                if (activeIndex >= 1 && activeIndex <= 3 && index === activeIndex - 1) {
                    setTimeout(() => {
                        item.classList.add('active');
                    }, 200);
                }
            });

            // Destroy previous horizontal swiper
            if (horizontalSwiper) {
                horizontalSwiper.destroy(true, true);
                horizontalSwiper = null;
                isMouseOverHorizontal = false;
                if (verticalSwiper) verticalSwiper.mousewheel.enable();
            }

            // Initialize horizontal swiper for practices section
            if (activeIndex === 2) {
                setTimeout(() => initHorizontalSwiper(), 200);
            }

            // Apply mobile-specific fixes ONLY on mobile
            if (isMobileDevice()) {
                if (activeIndex === 0) {
                    setTimeout(() => {
                        createMobileConsultationButton();
                    }, 100);
                }
                
                if (activeIndex === 3) {
                    setTimeout(() => {
                        separateCopyrightYear();
                    }, 100);
                }
            }

            // Add section-specific effects - DESKTOP ANIMATIONS WORKING
            applySlideEffects(activeIndex);

        } catch (error) {
            console.error('Error in slide change handler:', error);
        }
    }

    function applySlideEffects(activeIndex) {
        const slides = document.querySelectorAll('.slider__item');
        slides.forEach((slide, index) => {
            if (index === activeIndex) {
                slide.classList.add('slide-active');
                // Desktop parallax effect - WORKING
                if (!isMobileDevice()) {
                    const layer = slide.querySelector('.slider__layer');
                    if (layer) {
                        layer.style.transform = 'scale(1.1)';
                    }
                }
            } else {
                slide.classList.remove('slide-active');
                // Desktop parallax effect - WORKING
                if (!isMobileDevice()) {
                    const layer = slide.querySelector('.slider__layer');
                    if (layer) {
                        layer.style.transform = 'scale(1)';
                    }
                }
            }
        });
    }

    // === FLOATING HEADER (WORKING) ===
    function setupFloatingHeader() {
        const floatingLogoLink = document.getElementById('floatingLogoLink');
        const floatingBurger = document.getElementById('floatingBurger');
        const floatingMenu = document.getElementById('floatingMenu');

        if (floatingLogoLink && verticalSwiper) {
            floatingLogoLink.addEventListener('click', function(e) {
                e.preventDefault();
                verticalSwiper.slideTo(0);
                addNavigationFeedback(this);
            });
        }

        if (floatingBurger && floatingMenu) {
            floatingBurger.addEventListener('click', function() {
                this.classList.toggle('active');
                floatingMenu.classList.toggle('show');
            });

            // Mobile touch support
            if ('ontouchstart' in window && isMobileDevice()) {
                floatingBurger.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    this.classList.toggle('active');
                    floatingMenu.classList.toggle('show');
                });
            }

            const floatingMenuLinks = document.querySelectorAll('.floating-menu a');
            floatingMenuLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    floatingBurger.classList.remove('active');
                    floatingMenu.classList.remove('show');

                    const href = this.getAttribute('href').substring(1);
                    const slideMap = {
                        'home': 0,
                        'about': 1,
                        'practices': 2,
                        'contacts': 3
                    };
                    
                    if (slideMap.hasOwnProperty(href) && verticalSwiper) {
                        verticalSwiper.slideTo(slideMap[href]);
                    }
                });
            });

            document.addEventListener('click', function(e) {
                if (!floatingBurger.contains(e.target) && !floatingMenu.contains(e.target)) {
                    floatingBurger.classList.remove('active');
                    floatingMenu.classList.remove('show');
                }
            });
        }
    }

    // === SECTION ANIMATIONS (WORKING) ===
    function triggerSectionAnimations(sectionIndex) {
        const sections = [
            '.header-content',
            '.about-section',
            '.practices-section', 
            '.contacts-section'
        ];

        const currentSection = document.querySelector(sections[sectionIndex]);
        if (!currentSection) return;

        // Reset all animations
        const allAnimatedElements = document.querySelectorAll('.animate-fade-up, .animate-slide-left, .animate-scale-up, .animate-contact');
        allAnimatedElements.forEach(el => el.classList.remove('animate'));

        // Trigger animations for current section
        const animatedElements = currentSection.querySelectorAll('.animate-fade-up, .animate-slide-left, .animate-scale-up, .animate-contact');
        
        animatedElements.forEach((el, index) => {
            const delay = parseInt(el.dataset.delay) || (index * 100);
            setTimeout(() => {
                el.classList.add('animate');
            }, delay);
        });
    }

    // === MOBILE MENU (WORKING) ===
    function setupMobileMenu() {
        const submenuBtn = document.querySelector('.submenu');
        const mainMenu = document.querySelector('.main-menu');
        
        if (submenuBtn && mainMenu) {
            submenuBtn.addEventListener('click', function() {
                this.classList.toggle('active');
                mainMenu.classList.toggle('show');
            });

            const menuLinks = document.querySelectorAll('.main-menu a');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    submenuBtn.classList.remove('active');
                    mainMenu.classList.remove('show');
                });
            });

            document.addEventListener('click', function(e) {
                if (!submenuBtn.contains(e.target) && !mainMenu.contains(e.target)) {
                    submenuBtn.classList.remove('active');
                    mainMenu.classList.remove('show');
                }
            });
        }
    }

    // === KEYBOARD NAVIGATION (WORKING) ===
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            let handled = false;

            if (!isMouseOverHorizontal) {
                switch (e.key) {
                    case 'ArrowUp':
                    case 'PageUp':
                        verticalSwiper?.slidePrev();
                        handled = true;
                        break;
                    case 'ArrowDown':
                    case 'PageDown':
                        verticalSwiper?.slideNext();
                        handled = true;
                        break;
                    case 'Home':
                        verticalSwiper?.slideTo(0);
                        handled = true;
                        break;
                    case 'End':
                        verticalSwiper?.slideTo(3);
                        handled = true;
                        break;
                }
            }

            if (isMouseOverHorizontal && horizontalSwiper) {
                switch (e.key) {
                    case 'ArrowLeft':
                        horizontalSwiper.slidePrev();
                        handled = true;
                        break;
                    case 'ArrowRight':
                        horizontalSwiper.slideNext();
                        handled = true;
                        break;
                }
            }

            if (e.key === 'Escape') {
                closeAuthModal();
                handled = true;
            }

            if (handled) {
                e.preventDefault();
            }
        });
    }

    // === ADVANCED INTERACTIONS (DESKTOP HOVER EFFECTS WORKING) ===
    function setupAdvancedInteractions() {
        // Practice cards hover effects - DESKTOP ONLY
        const practiceCards = document.querySelectorAll('.practice-card');
        practiceCards.forEach(card => {
            if (!isMobileDevice()) {
                let isAnimating = false;

                card.addEventListener('mouseenter', function() {
                    if (isAnimating) return;
                    isAnimating = true;

                    this.style.transform = 'translateY(-10px) rotateX(5deg) rotateY(5deg) scale(1.02)';
                    createParticleEffect(this);

                    setTimeout(() => {
                        isAnimating = false;
                    }, 500);
                });

                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
                });

                card.addEventListener('click', function(e) {
                    createRippleEffect(e, this);
                });
            }
        });

        // Contact items hover effects - DESKTOP ONLY
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            if (!isMobileDevice()) {
                item.addEventListener('mouseenter', function() {
                    const ripple = this.querySelector('.icon-ripple');
                    if (ripple) {
                        ripple.style.width = '80px';
                        ripple.style.height = '80px';
                    }
                });

                item.addEventListener('mouseleave', function() {
                    const ripple = this.querySelector('.icon-ripple');
                    if (ripple) {
                        ripple.style.width = '0';
                        ripple.style.height = '0';
                    }
                });
            }
        });
    }

    function createParticleEffect(element) {
        if (isMobileDevice()) return; // Desktop only
        
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--green-color);
                border-radius: 50%;
                pointer-events: none;
                animation: particleFloat${i} 2s ease-out forwards;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1000;
            `;

            const style = document.createElement('style');
            style.textContent = `
                @keyframes particleFloat${i} {
                    to {
                        transform: translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);

            element.appendChild(particle);

            setTimeout(() => {
                if (particle && particle.parentNode) {
                    particle.remove();
                }
            }, 2000);
        }
    }

    function createRippleEffect(event, element) {
        if (isMobileDevice()) return; // Desktop only
        
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(212, 175, 55, 0.4);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            z-index: 1000;
        `;

        if (!document.querySelector('#rippleStyles')) {
            const style = document.createElement('style');
            style.id = 'rippleStyles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => {
            if (ripple && ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }

    // === PERFORMANCE OPTIMIZATIONS (WORKING) ===
    function setupPerformanceOptimizations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-fade-up, .animate-slide-left, .animate-scale-up, .animate-contact').forEach(el => {
            observer.observe(el);
        });

        // Preload images
        const preloadImages = () => {
            const imageUrls = [
                'img/bcg.png',
                'img/bcg2.png', 
                'img/bcg4.png',
                'img/logo.svg'
            ];

            imageUrls.forEach(url => {
                const img = new Image();
                img.src = url;
            });
        };

        setTimeout(preloadImages, 1000);
    }

    // === MOBILE TOUCH SUPPORT ===
    function addMobileTouchSupport() {
        if ('ontouchstart' in window && isMobileDevice()) {
            document.addEventListener('touchstart', function(e) {
                if (e.target.classList.contains('mobile-consultation-btn')) {
                    e.target.style.transform = 'scale(0.95)';
                }
            });
            
            document.addEventListener('touchend', function(e) {
                if (e.target.classList.contains('mobile-consultation-btn')) {
                    e.target.style.transform = 'scale(1)';
                }
            });
        }
    }

    // === RESIZE HANDLER ===
    function handleResize() {
        if (verticalSwiper) {
            verticalSwiper.update();
        }
        if (horizontalSwiper) {
            horizontalSwiper.update();
        }

        // Reapply mobile fixes if switching to mobile
        if (isMobileDevice()) {
            fixFloatingHeaderMobile();
            createMobileConsultationButton();
            separateCopyrightYear();
        }
    }

    const handleResizeDebounced = debounce(handleResize, 250);

    // === ERROR HANDLING ===
    window.addEventListener('error', function(e) {
        console.error('Global error caught:', e.error);
    });

    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
    });

    // === INITIALIZATION ===
    function initializeApplication() {
        try {
            // Initialize core components
            initHeaderAnimation();
            
            // Initialize Swiper first - WORKING
            if (!initializeSwiper()) {
                console.error('Failed to initialize Swiper - stopping initialization');
                return;
            }

            // Initialize authentication system
            initializeAuthentication();

            // Setup all other components
            setupNavigation();
            setupKeyboardNavigation();
            setupAdvancedInteractions(); // Desktop hover effects working
            setupPerformanceOptimizations();
            setupMobileMenu();
            setupFloatingHeader();

            // Mobile touch support
            addMobileTouchSupport();

            // Setup event listeners
            window.addEventListener('resize', handleResizeDebounced);

            // Initialize horizontal swiper if on practices section
            if (verticalSwiper && verticalSwiper.activeIndex === 2) {
                setTimeout(() => initHorizontalSwiper(), 100);
            }

            console.log('Argus Law application initialized successfully');
        } catch (error) {
            console.error('Error during application initialization:', error);
        }
    }

    // === CLEANUP ===
    window.addEventListener('beforeunload', () => {
        if (verticalSwiper) {
            verticalSwiper.destroy(true, true);
        }
        if (horizontalSwiper) {
            horizontalSwiper.destroy(true, true);
        }
    });

    // === LOADING STATE MANAGEMENT ===
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        triggerSectionAnimations(0);
        
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease-in';
            document.body.style.opacity = '1';
        }, 100);

        // Apply mobile fixes only on mobile after load
        if (isMobileDevice()) {
            setTimeout(() => {
                fixFloatingHeaderMobile();
                createMobileConsultationButton();
                separateCopyrightYear();
            }, 200);
        }
    });

    // === FINAL INITIALIZATION ===
    initializeApplication();
});