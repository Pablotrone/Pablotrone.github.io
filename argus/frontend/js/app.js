// ===============================================
// АРГУС ЛОУ - УЛУЧШЕННАЯ ВЕРСИЯ С ИСПРАВЛЕНИЕМ SWIPER
// ПОЛНАЯ ВЕРСИЯ - ИСПРАВЛЕНО: Управление горизонтальным свайпером
// ===============================================

'use strict';

// === КОНФИГУРАЦИЯ ФИЧЕЙ ===
const FEATURES = {
    authentication: false,
    imageOptimization: false
};

// === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===
let verticalSwiper = null;
let horizontalSwiper = null;
let isMouseOverHorizontal = false;
let horizontalScrollLock = false;
let keyboardLock = false;
let swiperInitAttempts = 0;
let maxSwiperInitAttempts = 5;

// === СОСТОЯНИЕ ПРИЛОЖЕНИЯ ===
const AppState = {
    initialized: false,
    initializationAttempts: 0,
    maxInitAttempts: 5,
    swiperReady: false
};

// === ОСНОВНЫЕ ФУНКЦИИ ПРИЛОЖЕНИЯ ===
const ArgusApp = {
    // Инициализация приложения
    async init() {
        if (AppState.initialized) {
            console.log('🔄 Приложение уже инициализировано');
            return;
        }

        AppState.initializationAttempts++;
        console.log(`🚀 Инициализация Argus Law (попытка ${AppState.initializationAttempts})...`);

        try {
            // Ждем загрузки Swiper
            await this.waitForSwiper();
            
            this.initializeComponents();
            AppState.initialized = true;
            console.log('✅ Argus Law успешно инициализировано');
        } catch (error) {
            console.error('❌ Ошибка инициализации:', error);
            if (AppState.initializationAttempts < AppState.maxInitAttempts) {
                setTimeout(() => this.init(), 1000);
            }
        }
    },

    // Ожидание загрузки Swiper
    async waitForSwiper() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 секунд
            
            const checkSwiper = () => {
                attempts++;
                
                if (typeof Swiper !== 'undefined') {
                    console.log('✅ Swiper готов к использованию');
                    AppState.swiperReady = true;
                    resolve();
                } else if (window.swiperReady) {
                    console.log('✅ Swiper загружен через fallback');
                    AppState.swiperReady = true;
                    resolve();
                } else if (attempts >= maxAttempts) {
                    console.error('❌ Таймаут загрузки Swiper');
                    reject(new Error('Swiper not loaded'));
                } else {
                    setTimeout(checkSwiper, 100);
                }
            };
            
            checkSwiper();
        });
    },

    // Инициализация всех компонентов
    initializeComponents() {
        console.log('🔧 Инициализация компонентов...');
        
        this.initializeSwiper();
        this.setupNavigation();
        this.setupKeyboardControls();
        this.setupFloatingHeader();
        this.initializeOptionalFeatures();
        
        // Обработка изначальной навигации
        setTimeout(() => {
            this.handleInitialNavigation();
        }, 800);

        console.log('✅ Все компоненты инициализированы');
    },

    // === УЛУЧШЕННАЯ SWIPER ИНИЦИАЛИЗАЦИЯ ===
    initializeSwiper() {
        console.log('📱 Инициализация Swiper...');
        
        const sliderElement = document.querySelector('.slider');
        if (!sliderElement) {
            throw new Error('Элемент .slider не найден');
        }

        // Проверка готовности Swiper
        if (!AppState.swiperReady) {
            console.warn('⚠️ Swiper еще не готов, повторная попытка...');
            setTimeout(() => this.initializeSwiper(), 500);
            return;
        }

        try {
            // Очистка предыдущего экземпляра
            this.destroyVerticalSwiper();

            // Создание нового экземпляра с улучшенной конфигурацией
            verticalSwiper = new Swiper('.slider', {
                direction: 'vertical',
                speed: 1700,
                parallax: true,
                resistanceRatio: 0.5,
                touchReleaseOnEdges: true,
                
                // ИСПРАВЛЕНО: Улучшенные настройки для стабильности
                watchSlidesProgress: true,
                watchSlidesVisibility: true,
                preventInteractionOnTransition: false,
                
                keyboard: {
                    enabled: false, // Используем свою систему
                },
                mousewheel: {
                    eventsTarget: '.slider',
                    releaseOnEdges: true,
                    thresholdDelta: 15,
                    thresholdTime: 300,
                    sensitivity: 1,
                    eventsTarget: '.slider'
                },
                noSwipingSelector: '.horizontal-swiper, .slide-content, .swiper-pagination, .swiper-button-next, .swiper-button-prev',
                
                // ИСПРАВЛЕНО: Улучшенные события
                on: {
                    init: () => {
                        console.log('✅ Vertical swiper инициализирован');
                        this.handleSlideChange(0);
                        this.triggerSectionAnimations(0);
                        
                        // Исправляем проблему с изображениями
                        this.fixImageScaling();
                    },
                    slideChange: () => {
                        const activeIndex = verticalSwiper.activeIndex;
                        console.log('📱 Переход на слайд:', activeIndex);
                        
                        this.handleSlideChange(activeIndex);
                        this.triggerSectionAnimations(activeIndex);
                        this.updateURLHash(activeIndex);
                        
                        // Исправляем масштабирование после каждого перехода
                        this.fixImageScaling();
                    },
                    resize: () => {
                        // Исправляем при изменении размера
                        this.fixImageScaling();
                    }
                }
            });

            console.log('✅ Swiper инициализирован успешно');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации Swiper:', error);
            swiperInitAttempts++;
            
            if (swiperInitAttempts < maxSwiperInitAttempts) {
                console.log(`🔄 Повторная попытка инициализации Swiper (${swiperInitAttempts}/${maxSwiperInitAttempts})`);
                setTimeout(() => this.initializeSwiper(), 1000);
            }
        }
    },

    // НОВЫЙ МЕТОД: Исправление масштабирования изображений
    fixImageScaling() {
        try {
            const slides = document.querySelectorAll('.slider__item');
            const layers = document.querySelectorAll('.slider__layer');
            
            slides.forEach((slide, index) => {
                const layer = slide.querySelector('.slider__layer');
                if (layer) {
                    // Сброс трансформации
                    layer.style.transform = '';
                    layer.style.scale = '';
                    
                    // Применяем правильные стили
                    if (slide.classList.contains('swiper-slide-active')) {
                        layer.style.transform = 'scale(1.1)';
                    } else {
                        layer.style.transform = 'scale(1)';
                    }
                }
            });
            
            // Принудительный reflow
            document.body.offsetHeight;
            
        } catch (error) {
            console.warn('⚠️ Ошибка исправления масштабирования:', error);
        }
    },

    // Улучшенное уничтожение свайпера
    destroyVerticalSwiper() {
        if (verticalSwiper) {
            try {
                verticalSwiper.destroy(true, true);
                console.log('🗑️ Предыдущий swiper уничтожен');
            } catch (error) {
                console.warn('⚠️ Ошибка при уничтожении swiper:', error);
            }
            verticalSwiper = null;
        }
    },

    triggerSectionAnimations(sectionIndex) {
        const sections = [
            '.header-content',
            '.about-section',
            '.horizontal-swiper-container',
            '.contacts-section'
        ];

        const currentSection = document.querySelector(sections[sectionIndex]);
        if (!currentSection) {
            console.warn('⚠️ Секция не найдена для индекса:', sectionIndex);
            return;
        }

        // Сброс всех анимаций
        const allAnimatedElements = document.querySelectorAll('.animate-fade-up, .animate-slide-left, .animate-scale-up, .animate-contact');
        allAnimatedElements.forEach(el => el.classList.remove('animate'));

        // Запуск анимаций для текущей секции
        const animatedElements = currentSection.querySelectorAll('.animate-fade-up, .animate-slide-left, .animate-scale-up, .animate-contact');

        animatedElements.forEach((el, index) => {
            const delay = parseInt(el.dataset.delay) || (index * 100);
            setTimeout(() => {
                el.classList.add('animate');
            }, delay);
        });

        console.log('✨ Анимации запущены для секции:', sections[sectionIndex]);
    },

    handleSlideChange(activeIndex) {
        console.log('🔄 Обработка смены слайда:', activeIndex);
        
        try {
            this.updateUIForSection(activeIndex);

            // Обработка слайдов контента заголовка
            document.querySelectorAll('.header-content__slide').forEach((slide, index) => {
                slide.classList.toggle('active', activeIndex === index);
            });

            // Управление горизонтальным свайпером
            if (horizontalSwiper) {
                horizontalSwiper.destroy(true, true);
                horizontalSwiper = null;
                isMouseOverHorizontal = false;
                if (verticalSwiper) verticalSwiper.mousewheel.enable();
            }

            if (activeIndex === 2) {
                setTimeout(() => this.initHorizontalSwiper(), 200);
            }

            // Специальная обработка контактов
            if (activeIndex === 3) {
                setTimeout(() => {
                    this.ensureContactsState();
                }, 100);
            }

        } catch (error) {
            console.error('❌ Ошибка в обработке смены слайда:', error);
        }
    },

    updateUIForSection(activeIndex) {
        console.log('🎨 Обновление UI для секции:', activeIndex);
        
        const headerUI = document.querySelector('.slider-ui.home-only');
        const floatingHeader = document.getElementById('floatingHeader');
        
        if (headerUI && floatingHeader) {
            if (activeIndex === 0) {
                headerUI.classList.remove('hidden');
                headerUI.style.opacity = '1';
                headerUI.style.visibility = 'visible';
                
                if (window.innerWidth <= 968) {
                    floatingHeader.classList.add('visible');
                    floatingHeader.style.opacity = '1';
                    floatingHeader.style.visibility = 'visible';
                } else {
                    floatingHeader.classList.remove('visible');
                    floatingHeader.style.opacity = '0';
                    floatingHeader.style.visibility = 'hidden';
                }
            } else {
                headerUI.classList.add('hidden');
                headerUI.style.opacity = '0';
                headerUI.style.visibility = 'hidden';
                
                floatingHeader.classList.add('visible');
                floatingHeader.style.opacity = '1';
                floatingHeader.style.visibility = 'visible';
            }
        }
        
        // Обновление меню
        const menuItems = document.querySelectorAll('.main-menu li');
        menuItems.forEach((item, index) => {
            let isActive = false;
            switch (index) {
                case 0: isActive = (activeIndex === 1); break;
                case 1: isActive = (activeIndex === 2); break;
                case 2: isActive = false; break;
                case 3: isActive = false; break;
                case 4: isActive = (activeIndex === 3); break;
            }
            item.classList.toggle('active', isActive);
        });

        const mobileMenuItems = document.querySelectorAll('.floating-menu li');
        mobileMenuItems.forEach((item, index) => {
            let isActive = false;
            switch (index) {
                case 0: isActive = (activeIndex === 0); break;
                case 1: isActive = (activeIndex === 1); break;
                case 2: isActive = (activeIndex === 2); break;
                case 3: isActive = false; break;
                case 4: isActive = false; break;
                case 5: isActive = (activeIndex === 3); break;
            }
            item.classList.toggle('active', isActive);
        });

        console.log('✅ UI обновлен для секции', activeIndex);
    },

    setupNavigation() {
        console.log('🧭 Настройка навигации...');
        
        const logos = document.querySelectorAll('.logo, .floating-logo');
        logos.forEach(logo => {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection('#home');
            });
        });

        const internalLinks = document.querySelectorAll('a[href^="#"]:not(.external-link)');
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('href');
                this.navigateToSection(targetSection);
                this.closeMobileMenu();
            });
        });

        console.log('✅ Навигация настроена');
    },

    closeMobileMenu() {
        const floatingBurger = document.querySelector('.floating-burger');
        const floatingMenu = document.querySelector('.floating-menu');
        
        if (floatingBurger && floatingMenu) {
            floatingBurger.classList.remove('active');
            floatingMenu.classList.remove('show');
        }
    },

    navigateToSection(targetHash) {
        console.log('🎯 Навигация к секции:', targetHash);
        
        const sectionMap = {
            '#home': 0,
            '#about': 1,
            '#practices': 2,
            '#contacts': 3
        };

        const slideIndex = sectionMap[targetHash];
        if (slideIndex !== undefined && verticalSwiper) {
            verticalSwiper.slideTo(slideIndex);

            if (window.location.hash !== targetHash) {
                window.history.replaceState(null, null, targetHash);
            }
        }
    },

    // === ИСПРАВЛЕННОЕ КЛАВИАТУРНОЕ УПРАВЛЕНИЕ ===
    setupKeyboardControls() {
        console.log('⌨️ Настройка клавиатурного управления...');
        
        document.addEventListener('keydown', (e) => {
            if (keyboardLock) return;

            let handled = false;

            // ИСПРАВЛЕНО: Управление горизонтальным свайпером
            if (isMouseOverHorizontal && horizontalSwiper) {
                switch (e.key) {
                    case 'ArrowLeft':
                        keyboardLock = true;
                        horizontalSwiper.slidePrev();
                        handled = true;
                        break;
                    case 'ArrowRight':
                        keyboardLock = true;
                        horizontalSwiper.slideNext();
                        handled = true;
                        break;
                    case 'Home':
                        keyboardLock = true;
                        horizontalSwiper.slideTo(0);
                        handled = true;
                        break;
                    case 'End':
                        keyboardLock = true;
                        horizontalSwiper.slideTo(horizontalSwiper.slides.length - 1);
                        handled = true;
                        break;
                }
            }
            // Управление вертикальным свайпером
            else if (!isMouseOverHorizontal && verticalSwiper) {
                switch (e.key) {
                    case 'ArrowUp':
                    case 'PageUp':
                        keyboardLock = true;
                        verticalSwiper.slidePrev();
                        handled = true;
                        break;
                    case 'ArrowDown':
                    case 'PageDown':
                        keyboardLock = true;
                        verticalSwiper.slideNext();
                        handled = true;
                        break;
                    case 'Home':
                        keyboardLock = true;
                        verticalSwiper.slideTo(0);
                        handled = true;
                        break;
                    case 'End':
                        keyboardLock = true;
                        verticalSwiper.slideTo(3);
                        handled = true;
                        break;
                }
            }

            if (handled) {
                e.preventDefault();
                e.stopPropagation();
                
                setTimeout(() => {
                    keyboardLock = false;
                }, 600);
            }
        });
        
        console.log('✅ Клавиатурное управление настроено');
    },

    setupFloatingHeader() {
        console.log('📱 Настройка плавающего заголовка...');
        
        const floatingBurger = document.querySelector('.floating-burger');
        const floatingMenu = document.querySelector('.floating-menu');
        
        if (floatingBurger && floatingMenu) {
            floatingBurger.addEventListener('click', () => {
                floatingBurger.classList.toggle('active');
                floatingMenu.classList.toggle('show');
            });
            
            document.addEventListener('click', (e) => {
                if (!floatingBurger.contains(e.target) && !floatingMenu.contains(e.target)) {
                    floatingBurger.classList.remove('active');
                    floatingMenu.classList.remove('show');
                }
            });
        }
    },

    initializeOptionalFeatures() {
        if (FEATURES.authentication) {
            this.initializeAuthentication();
        }
        if (FEATURES.imageOptimization) {
            this.initializeImageOptimizer();
        }
    },

    initializeAuthentication() {
        console.log('🔐 Аутентификация готова к разработке');
    },

    initializeImageOptimizer() {
        console.log('🖼️ Оптимизатор изображений готов к разработке');
    },

    // === ИСПРАВЛЕННЫЙ ГОРИЗОНТАЛЬНЫЙ СВАЙПЕР ===
    initHorizontalSwiper() {
        console.log('🔄 Инициализация горизонтального свайпера...');
        
        const horizontalEl = document.querySelector('.horizontal-swiper');
        if (!horizontalEl) return;

        if (horizontalSwiper) {
            try {
                horizontalSwiper.destroy(true, true);
            } catch (error) {
                console.warn('Warning destroying horizontal swiper:', error);
            }
            horizontalSwiper = null;
        }

        try {
            // ИСПРАВЛЕНО: Добавлено mousewheel управление
            horizontalSwiper = new Swiper('.horizontal-swiper', {
                direction: 'horizontal',
                slidesPerView: 1,
                centeredSlides: true,
                spaceBetween: 30,
                grabCursor: true,
                slideToClickedSlide: true,
                preventInteractionOnTransition: true,
                loop: true,
                
                // ИСПРАВЛЕНО: Добавлено управление колесиком мыши
                mousewheel: {
                    enabled: false, // Включается только при наведении
                    releaseOnEdges: true,
                    sensitivity: 1,
                    thresholdDelta: 10,
                    thresholdTime: 300,
                },
                
                // ИСПРАВЛЕНО: Добавлено клавиатурное управление
                keyboard: {
                    enabled: false, // Включается только при наведении
                    onlyInViewport: true,
                },
                
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                pagination: {
                    el: '.horizontal-swiper .swiper-pagination',
                    clickable: true,
                    dynamicBullets: true,
                    dynamicMainBullets: 3,
                },
                navigation: {
                    nextEl: '.horizontal-swiper .swiper-button-next',
                    prevEl: '.horizontal-swiper .swiper-button-prev',
                }
            });

            this.setupHorizontalSwiperEvents(horizontalEl);
            console.log('✅ Горизонтальный свайпер настроен');
            
        } catch (error) {
            console.error('❌ Error initializing horizontal swiper:', error);
        }
    },

    // === ИСПРАВЛЕННЫЕ СОБЫТИЯ ГОРИЗОНТАЛЬНОГО СВАЙПЕРА ===
    setupHorizontalSwiperEvents(horizontalEl) {
        if (!horizontalEl || !verticalSwiper) return;

        // ИСПРАВЛЕНО: Полная настройка событий для горизонтального свайпера
        horizontalEl.addEventListener('mouseenter', () => {
            console.log('🖱️ Мышь над горизонтальным свайпером');
            isMouseOverHorizontal = true;
            
            // Отключаем вертикальный свайпер
            if (verticalSwiper) {
                verticalSwiper.mousewheel.disable();
            }
            
            // ИСПРАВЛЕНО: Включаем управление горизонтальным свайпером
            if (horizontalSwiper) {
                horizontalSwiper.mousewheel.enable();
                horizontalSwiper.keyboard.enable();
                
                if (horizontalSwiper.autoplay) {
                    horizontalSwiper.autoplay.stop();
                }
            }
        });

        horizontalEl.addEventListener('mouseleave', () => {
            console.log('🖱️ Мышь покинула горизонтальный свайпер');
            isMouseOverHorizontal = false;
            
            // Включаем вертикальный свайпер
            if (verticalSwiper) {
                verticalSwiper.mousewheel.enable();
            }
            
            // ИСПРАВЛЕНО: Отключаем управление горизонтальным свайпером
            if (horizontalSwiper) {
                horizontalSwiper.mousewheel.disable();
                horizontalSwiper.keyboard.disable();
                
                if (horizontalSwiper.autoplay) {
                    horizontalSwiper.autoplay.start();
                }
            }
        });

        // ИСПРАВЛЕНО: Дополнительные события для надежности
        horizontalEl.addEventListener('wheel', (e) => {
            if (isMouseOverHorizontal) {
                e.stopPropagation();
            }
        });

        horizontalEl.addEventListener('keydown', (e) => {
            if (isMouseOverHorizontal && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                e.stopPropagation();
            }
        });
    },

    updateURLHash(activeIndex) {
        const hashMap = {0: '#home', 1: '#about', 2: '#practices', 3: '#contacts'};
        const newHash = hashMap[activeIndex];
        if (newHash && window.location.hash !== newHash) {
            window.history.replaceState(null, null, newHash);
        }
    },

    handleInitialNavigation() {
        console.log('🧭 Обработка изначальной навигации...');
        
        const isExternalNavigation = sessionStorage.getItem('external_navigation') === 'true';
        const storedNavigateTarget = sessionStorage.getItem('navigate_to');
        const hash = window.location.hash;
        
        if (isExternalNavigation) {
            sessionStorage.removeItem('external_navigation');
        }
        
        if (storedNavigateTarget) {
            sessionStorage.removeItem('navigate_to');
            const targetHash = '#' + storedNavigateTarget;
            const delay = isExternalNavigation ? 2500 : 1500;
            
            setTimeout(() => {
                this.navigateToSection(targetHash);
            }, delay);
            return;
        }
        
        if (hash && hash !== '#home') {
            const delay = isExternalNavigation ? 2000 : 1000;
            setTimeout(() => {
                this.navigateToSection(hash);
            }, delay);
        }
    },

    ensureContactsState() {
        console.log('📞 Проверка состояния контактов...');
        
        const floatingHeader = document.getElementById('floatingHeader');
        if (floatingHeader) {
            floatingHeader.classList.add('visible');
            floatingHeader.style.opacity = '1';
            floatingHeader.style.visibility = 'visible';
        }

        const homeHeader = document.querySelector('.slider-ui.home-only');
        if (homeHeader) {
            homeHeader.classList.add('hidden');
        }

        if (verticalSwiper && verticalSwiper.activeIndex !== 3) {
            verticalSwiper.slideTo(3, 0);
        }

        setTimeout(() => {
            this.triggerSectionAnimations(3);
        }, 50);
    },

    // Перезапуск приложения
    restart() {
        console.log('🔄 Перезапуск приложения...');
        
        this.destroyVerticalSwiper();
        
        if (horizontalSwiper) {
            try {
                horizontalSwiper.destroy(true, true);
            } catch (error) {
                console.warn('Warning destroying horizontal swiper:', error);
            }
            horizontalSwiper = null;
        }
        
        AppState.initialized = false;
        AppState.initializationAttempts = 0;
        swiperInitAttempts = 0;
        keyboardLock = false;
        isMouseOverHorizontal = false;
        
        this.init();
    }
};

// === ГЛОБАЛЬНЫЕ ФУНКЦИИ ===
window.triggerSectionAnimations = (sectionIndex) => ArgusApp.triggerSectionAnimations(sectionIndex);
window.navigateToSection = (section) => ArgusApp.navigateToSection(section);
window.ensureContactsState = () => ArgusApp.ensureContactsState();
window.resetApp = () => ArgusApp.restart();
window.ArgusApp = ArgusApp;

// === ОБРАБОТЧИКИ СОБЫТИЙ ===
document.addEventListener('preloaderComplete', function() {
    console.log('🎬 Прелоадер завершен, инициализация главного приложения...');
    ArgusApp.init();
});

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (!AppState.initialized) {
            console.log('⚠️ Таймаут прелоадера, инициализация приложения напрямую...');
            ArgusApp.init();
        }
    }, 12000);
});

// Очистка при выгрузке страницы
window.addEventListener('beforeunload', () => {
    if (verticalSwiper) {
        verticalSwiper.destroy(true, true);
    }
    if (horizontalSwiper) {
        horizontalSwiper.destroy(true, true);
    }
});

console.log('✅ Улучшенная система навигации Argus Law загружена');