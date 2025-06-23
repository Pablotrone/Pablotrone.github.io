/**
 * Argus Law Firm - Consultation Page Script (ПОЛНОСТЬЮ ИСПРАВЛЕННАЯ ВЕРСИЯ)
 * ИСПРАВЛЕНО: Улучшенная навигация к контактам и стабильная работа
 */

// === ПОЛНОСТЬЮ ИСПРАВЛЕННЫЕ НАВИГАЦИОННЫЕ ФУНКЦИИ ===
function navigateToContacts(event) {
    event.preventDefault();
    console.log('🧭 ИСПРАВЛЕНО: Навигация к контактам с консультационной страницы...');
    
    // КРИТИЧЕСКИ ВАЖНО: НЕ удаляем argus_visited!
    // sessionStorage.removeItem('argus_visited'); // НАВСЕГДА УБРАНО!
    
    // Устанавливаем расширенные флаги навигации
    sessionStorage.setItem('navigate_to', 'contacts');
    sessionStorage.setItem('external_navigation', 'true');
    sessionStorage.setItem('navigation_source', 'consultation');
    sessionStorage.setItem('navigation_timestamp', Date.now().toString());
    sessionStorage.setItem('target_ready_check', 'true');
    
    console.log('📋 ИСПРАВЛЕНО: Расширенные флаги навигации установлены:', {
        navigate_to: sessionStorage.getItem('navigate_to'),
        external_navigation: sessionStorage.getItem('external_navigation'),
        source: sessionStorage.getItem('navigation_source'),
        timestamp: sessionStorage.getItem('navigation_timestamp')
    });
    
    // Добавляем визуальную обратную связь
    const button = event.target.closest('.contact-button');
    if (button) {
        button.style.transform = 'scale(0.95)';
        button.style.opacity = '0.8';
        
        // Если это кнопка "Наш офис", меняем текст
        if (button.textContent.includes('Наш офис')) {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Переходим...';
            
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 1000);
        }
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.style.opacity = '1';
        }, 200);
    }
    
    // Используем улучшенный метод навигации с множественными fallback-ами
    setTimeout(() => {
        executeNavigationWithRetry();
    }, 100);
}

// Функция выполнения навигации с повторными попытками
function executeNavigationWithRetry() {
    let attempts = 0;
    const maxAttempts = 3;
    const methods = [
        () => {
            console.log('🔧 ИСПРАВЛЕНО: Попытка через Navigation API');
            if ('navigation' in window && window.navigation.navigate) {
                window.navigation.navigate('index.html#contacts');
                return true;
            }
            return false;
        },
        () => {
            console.log('🔧 ИСПРАВЛЕНО: Попытка через location.href');
            window.location.href = 'index.html#contacts';
            return true;
        },
        () => {
            console.log('🔧 ИСПРАВЛЕНО: Попытка через location.replace');
            window.location.replace('index.html#contacts');
            return true;
        }
    ];
    
    function attemptNavigation() {
        if (attempts >= maxAttempts) {
            console.error('ИСПРАВЛЕНО: Все попытки навигации не удались');
            showNavigationError();
            return;
        }
        
        try {
            const method = methods[attempts];
            const success = method();
            
            if (!success && attempts < maxAttempts - 1) {
                attempts++;
                setTimeout(attemptNavigation, 200);
            }
        } catch (error) {
            console.error(`ИСПРАВЛЕНО: Попытка ${attempts + 1} не удалась:`, error);
            attempts++;
            
            if (attempts < maxAttempts) {
                setTimeout(attemptNavigation, 200);
            } else {
                showNavigationError();
            }
        }
    }
    
    attemptNavigation();
}

// Функция показа ошибки навигации
function showNavigationError() {
    console.error('ИСПРАВЛЕНО: Критическая ошибка навигации');
    
    // Создаем пользовательское уведомление
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(212, 175, 55, 0.95);
        color: #1a1109;
        padding: 20px 30px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    `;
    notification.textContent = 'Не удалось перейти к контактам. Пожалуйста, используйте главное меню.';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Альтернативная функция навигации
function navigateToContactsAlternative(event) {
    event.preventDefault();
    console.log('🧭 ИСПРАВЛЕНО АЛЬТЕРНАТИВНО: Навигация к контактам...');
    
    // Те же улучшенные флаги
    sessionStorage.setItem('navigate_to', 'contacts');
    sessionStorage.setItem('external_navigation', 'true');
    sessionStorage.setItem('navigation_source', 'consultation-alt');
    sessionStorage.setItem('navigation_timestamp', Date.now().toString());
    sessionStorage.setItem('target_ready_check', 'true');
    sessionStorage.setItem('force_init', 'true');
    
    // Прямой переход с fallback
    try {
        window.location.assign('index.html#contacts');
    } catch (error) {
        console.error('ИСПРАВЛЕНО: Assign не удался, пробуем replace:', error);
        try {
            window.location.replace('index.html#contacts');
        } catch (replaceError) {
            console.error('ИСПРАВЛЕНО: Replace не удался, используем href:', replaceError);
            window.location.href = 'index.html#contacts';
        }
    }
}

// Функция для проверки готовности целевой страницы
function checkTargetPageReady() {
    return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 100;
        
        const checkInterval = setInterval(() => {
            attempts++;
            
            const criteriaChecks = {
                argusApp: window.ArgusApp && window.ArgusApp.verticalSwiper,
                swiperNotDestroyed: window.ArgusApp && !window.ArgusApp.verticalSwiper.destroyed,
                floatingHeader: document.getElementById('floatingHeader'),
                swiperWrapper: document.querySelector('.swiper-wrapper'),
                contactsSection: document.querySelector('#contacts'),
                mainAppInitialized: window.mainAppInitialized
            };
            
            const allReady = Object.values(criteriaChecks).every(check => !!check);
            
            if (allReady) {
                console.log(`✅ ИСПРАВЛЕНО: Целевая страница готова (попытка ${attempts})`);
                clearInterval(checkInterval);
                resolve(true);
            } else if (attempts >= maxAttempts) {
                console.warn(`⚠️ ИСПРАВЛЕНО: Таймаут готовности страницы (попытка ${attempts})`);
                console.log('Статус проверок готовности:', criteriaChecks);
                clearInterval(checkInterval);
                resolve(false);
            }
            
            if (attempts % 25 === 0) {
                console.log(`🔄 ИСПРАВЛЕНО: Ожидание готовности (попытка ${attempts}/${maxAttempts})`);
            }
        }, 100);
    });
}

// Делаем функции глобально доступными
window.navigateToContacts = navigateToContacts;
window.navigateToContactsAlternative = navigateToContactsAlternative;
window.checkTargetPageReady = checkTargetPageReady;

// === ГЛОБАЛЬНОЕ СОСТОЯНИЕ ===
let animationObserver = null;
let isPageVisible = true;
let modalOpen = false;

// === ОБРАБОТКА ВИДИМОСТИ СТРАНИЦЫ ===
document.addEventListener('visibilitychange', function() {
    isPageVisible = !document.hidden;
    
    if (isPageVisible && window.consultationPageInitialized) {
        setTimeout(() => {
            refreshAnimations();
        }, 100);
    }
});

// Инициализация сразу при готовности DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 ИСПРАВЛЕНО: DOM загружен, инициализация консультационной страницы...');
    initializeConsultationPage();
});

function initializeConsultationPage() {
    if (window.consultationPageInitialized) return;
    window.consultationPageInitialized = true;

    console.log('📋 ИСПРАВЛЕНО: Консультационная страница инициализирована');

    try {
        setupAnimationSystem();
        setupModalSystem();
        setupInteractiveElements();
        setupNavigationEnhancements();
        setupPerformanceOptimizations();
        setupAccessibilityFeatures();
        
        setTimeout(() => {
            triggerInitialAnimations();
        }, 300);
        
        console.log('✅ ИСПРАВЛЕНО: Консультационная страница полностью инициализирована');
        
        document.body.classList.add('consultation-ready');
        
    } catch (error) {
        console.error('❌ ИСПРАВЛЕНО: Ошибка инициализации консультационной страницы:', error);
    }
}

// === СИСТЕМА АНИМАЦИИ ===
function setupAnimationSystem() {
    console.log('✨ ИСПРАВЛЕНО: Настройка системы анимации...');
    
    const observerOptions = {
        root: null,
        rootMargin: '50px 0px -50px 0px',
        threshold: [0.1, 0.3, 0.5]
    };

    animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = parseInt(element.dataset.delay) || 0;
                
                setTimeout(() => {
                    element.classList.add('animate');
                    
                    if (element.classList.contains('main-cta-section')) {
                        createCtaRipple(element);
                    }
                    
                    if (element.classList.contains('feature-item')) {
                        createFeatureParticles(element);
                    }
                    
                }, delay);
                
                animationObserver.unobserve(element);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
    
    console.log(`📊 ИСПРАВЛЕНО: Наблюдение за ${animatedElements.length} анимированными элементами`);
}

// === СИСТЕМА МОДАЛЬНЫХ ОКОН ===
function setupModalSystem() {
    console.log('🎯 ИСПРАВЛЕНО: Настройка системы модальных окон...');
    
    setTimeout(() => {
        const modal = document.getElementById('consultationModal');
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');
        const consultationInfoBtn = document.getElementById('consultationInfoBtn');
        
        console.log('🔍 ИСПРАВЛЕНО: Поиск элементов модального окна:', {
            modal: !!modal,
            consultationInfoBtn: !!consultationInfoBtn,
            modalOverlay: !!modalOverlay,
            modalClose: !!modalClose
        });
        
        if (!modal) {
            console.error('❌ ИСПРАВЛЕНО: Элемент модального окна #consultationModal не найден');
            return;
        }
        
        if (!consultationInfoBtn) {
            console.error('❌ ИСПРАВЛЕНО: Кнопка #consultationInfoBtn не найдена');
            return;
        }
        
        console.log('✅ ИСПРАВЛЕНО: Элементы модального окна найдены, настройка обработчиков...');
        
        // Функция открытия модального окна
        function openModal() {
            if (modalOpen) return;
            
            console.log('🎯 ИСПРАВЛЕНО: Открытие модального окна...');
            modalOpen = true;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            requestAnimationFrame(() => {
                modal.style.opacity = '1';
                modal.classList.add('show');
            });
            
            const firstFocusable = modal.querySelector('button, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                setTimeout(() => firstFocusable.focus(), 100);
            }
            
            console.log('✅ ИСПРАВЛЕНО: Модальное окно успешно открыто');
        }
        
        // Функция закрытия модального окна
        function closeModal() {
            if (!modalOpen) return;
            
            console.log('📋 ИСПРАВЛЕНО: Закрытие модального окна...');
            modalOpen = false;
            modal.style.opacity = '0';
            modal.classList.remove('show');
            
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
            
            if (consultationInfoBtn) {
                consultationInfoBtn.focus();
            }
            
            console.log('✅ ИСПРАВЛЕНО: Модальное окно успешно закрыто');
        }
        
        // Добавляем обработчик события с правильной обработкой ошибок
        consultationInfoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('📋 ИСПРАВЛЕНО: Кнопка нажата - открытие модального окна...');
            openModal();
        });
        
        console.log('✅ ИСПРАВЛЕНО: Обработчик события добавлен к кнопке консультации');
        
        // Обработчики закрытия модального окна
        if (modalClose) {
            modalClose.addEventListener('click', function(e) {
                e.preventDefault();
                closeModal();
            });
            console.log('✅ ИСПРАВЛЕНО: Обработчик кнопки закрытия добавлен');
        }
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', function(e) {
                if (e.target === modalOverlay) {
                    closeModal();
                }
            });
            console.log('✅ ИСПРАВЛЕНО: Обработчик клика по оверлею добавлен');
        }
        
        // Закрытие по клавише Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOpen) {
                closeModal();
            }
        });
        
        // Делаем функции глобально доступными для отладки
        window.openConsultationModal = openModal;
        window.closeConsultationModal = closeModal;
        
        // Тестирование настройки модального окна
        setTimeout(() => {
            console.log('🧪 ИСПРАВЛЕНО: Тестирование настройки модального окна...');
            if (consultationInfoBtn && typeof consultationInfoBtn.click === 'function') {
                console.log('✅ ИСПРАВЛЕНО: Кнопка консультации готова и кликабельна');
            } else {
                console.error('❌ ИСПРАВЛЕНО: Настройка кнопки консультации не удалась!');
            }
        }, 500);
        
    }, 100);
}

// === ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ ===
function setupInteractiveElements() {
    console.log('🎯 ИСПРАВЛЕНО: Настройка интерактивных элементов...');
    
    // Улучшенные эффекты наведения для карточек
    const cards = document.querySelectorAll('.cta-card, .features-section, .contact-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('card-hover');
            createCardRipple(this);
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('card-hover');
        });
    });
    
    // Интерактивные элементы функций
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('feature-hover');
            createFeatureGlow(this);
        });
        
        item.addEventListener('mouseleave', function() {
            this.classList.remove('feature-hover');
        });
    });
    
    // Улучшенные взаимодействия с кнопками
    const buttons = document.querySelectorAll('.consultation-info-btn, .contact-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            createButtonRipple(this);
        });
        
        button.addEventListener('click', function(e) {
            if (!this.href) {
                createClickEffect(this, e);
            }
        });
    });
    
    // Анимации иконок секций
    const sectionIcons = document.querySelectorAll('.section-icon, .cta-icon');
    sectionIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(360deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// === УЛУЧШЕНИЯ НАВИГАЦИИ ===
function setupNavigationEnhancements() {
    console.log('🧭 ИСПРАВЛЕНО: Настройка улучшений навигации...');
    
    const navButton = document.querySelector('.nav-button');
    if (navButton) {
        navButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        navButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        navButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            this.style.transform = 'translateY(-3px) scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = 'translateY(-3px) scale(1.05)';
                
                setTimeout(() => {
                    window.location.href = this.href;
                }, 150);
            }, 100);
        });
    }
    
    // Плавная прокрутка для внутренних ссылок
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// === ОПТИМИЗАЦИИ ПРОИЗВОДИТЕЛЬНОСТИ ===
function setupPerformanceOptimizations() {
    console.log('⚡ Настройка оптимизаций производительности...');
    
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            handleScroll();
        }, 16);
    });
    
    let resizeTimeout;
    window.addEventListener('resize', function() {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        
        resizeTimeout = setTimeout(() => {
            handleResize();
        }, 250);
    });
    
    preloadCriticalAssets();
}

// === ВОЗМОЖНОСТИ ДОСТУПНОСТИ ===
function setupAccessibilityFeatures() {
    console.log('♿ Настройка возможностей доступности...');
    
    const focusableElements = document.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('focused');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('focused');
        });
    });
    
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'Tab':
                document.body.classList.add('keyboard-navigation');
                break;
                
            case 'Enter':
            case ' ':
                if (e.target.classList.contains('consultation-info-btn')) {
                    e.preventDefault();
                    e.target.click();
                }
                break;
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
        console.log('🔇 Режим сниженного движения включен');
    }
}

// === ЭФФЕКТЫ АНИМАЦИИ ===
function createCtaRipple(ctaSection) {
    const ripple = document.createElement('div');
    ripple.className = 'cta-ripple';
    ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: ctaRipple 1.5s ease-out forwards;
        pointer-events: none;
        z-index: 1;
    `;
    
    if (!document.querySelector('#ctaRippleStyles')) {
        const style = document.createElement('style');
        style.id = 'ctaRippleStyles';
        style.textContent = `
            @keyframes ctaRipple {
                to {
                    width: 300px;
                    height: 300px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    ctaSection.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple && ripple.parentNode) {
            ripple.remove();
        }
    }, 1500);
}

function createFeatureParticles(featureItem) {
    const particles = 2;
    for (let i = 0; i < particles; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'feature-particle';
            particle.style.cssText = `
                position: absolute;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                width: 3px;
                height: 3px;
                background: #d4af37;
                border-radius: 50%;
                animation: particleFloat 2s ease-out forwards;
                pointer-events: none;
                z-index: 1;
            `;
            
            if (!document.querySelector('#particleStyles')) {
                const style = document.createElement('style');
                style.id = 'particleStyles';
                style.textContent = `
                    @keyframes particleFloat {
                        to {
                            transform: translateY(-40px);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            featureItem.appendChild(particle);
            
            setTimeout(() => {
                if (particle && particle.parentNode) {
                    particle.remove();
                }
            }, 2000);
        }, i * 300);
    }
}

function createCardRipple(card) {
    const ripple = document.createElement('div');
    ripple.className = 'card-ripple';
    ripple.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
        animation: cardRipple 1.2s ease-out forwards;
        pointer-events: none;
        z-index: 1;
    `;
    
    if (!document.querySelector('#cardRippleStyles')) {
        const style = document.createElement('style');
        style.id = 'cardRippleStyles';
        style.textContent = `
            @keyframes cardRipple {
                from {
                    transform: scale(0);
                    opacity: 1;
                }
                to {
                    transform: scale(1);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    card.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple && ripple.parentNode) {
            ripple.remove();
        }
    }, 1200);
}

function createFeatureGlow(feature) {
    const glow = document.createElement('div');
    glow.className = 'feature-glow';
    glow.style.cssText = `
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        background: linear-gradient(45deg, rgba(212, 175, 55, 0.1), rgba(244, 208, 63, 0.1));
        border-radius: 15px;
        animation: featureGlow 0.8s ease-out forwards;
        pointer-events: none;
        z-index: 0;
    `;
    
    if (!document.querySelector('#featureGlowStyles')) {
        const style = document.createElement('style');
        style.id = 'featureGlowStyles';
        style.textContent = `
            @keyframes featureGlow {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    feature.appendChild(glow);
    
    setTimeout(() => {
        if (glow && glow.parentNode) {
            glow.remove();
        }
    }, 800);
}

function createButtonRipple(button) {
    const ripple = document.createElement('div');
    ripple.className = 'button-ripple';
    ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: buttonRipple 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 1;
    `;
    
    if (!document.querySelector('#buttonRippleStyles')) {
        const style = document.createElement('style');
        style.id = 'buttonRippleStyles';
        style.textContent = `
            @keyframes buttonRipple {
                to {
                    width: 200px;
                    height: 200px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple && ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

function createClickEffect(button, event) {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const click = document.createElement('div');
    click.className = 'click-effect';
    click.style.cssText = `
        position: absolute;
        top: ${y}px;
        left: ${x}px;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: clickEffect 0.4s ease-out forwards;
        pointer-events: none;
        z-index: 2;
    `;
    
    if (!document.querySelector('#clickEffectStyles')) {
        const style = document.createElement('style');
        style.id = 'clickEffectStyles';
        style.textContent = `
            @keyframes clickEffect {
                to {
                    width: 100px;
                    height: 100px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    button.appendChild(click);
    
    setTimeout(() => {
        if (click && click.parentNode) {
            click.remove();
        }
    }, 400);
}

// === ОБРАБОТЧИКИ СОБЫТИЙ ===
function handleScroll() {
    const scrollY = window.scrollY;
    
    const decorations = document.querySelectorAll('.decoration-circle, .floating-shape');
    decorations.forEach((decoration, index) => {
        const speed = 0.1 + (index * 0.05);
        const yPos = -(scrollY * speed);
        decoration.style.transform = `translateY(${yPos}px)`;
    });
}

function handleResize() {
    if (animationObserver) {
        const animatedElements = document.querySelectorAll('[data-animate]:not(.animate)');
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    }
}

function triggerInitialAnimations() {
    const headerElements = document.querySelectorAll('.consultation-header *');
    headerElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.animation = 'fadeInUp 0.8s ease-out forwards';
        }, index * 100);
    });
}

function refreshAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate].animate');
    animatedElements.forEach(element => {
        element.classList.remove('animate');
        setTimeout(() => {
            element.classList.add('animate');
        }, 50);
    });
}

function preloadCriticalAssets() {
    const criticalAssets = [
        '../img/bcg4.png'
    ];
    
    criticalAssets.forEach(asset => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = asset;
        document.head.appendChild(link);
    });
}

// === СЛУЖЕБНЫЕ ФУНКЦИИ ===
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

// === ОБРАБОТКА ОШИБОК ===
window.addEventListener('error', function(e) {
    console.error('ИСПРАВЛЕНО: Ошибка на консультационной странице:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('ИСПРАВЛЕНО: Необработанное отклонение промиса на консультационной странице:', e.reason);
});

// === ОЧИСТКА ===
window.addEventListener('beforeunload', function() {
    if (animationObserver) {
        animationObserver.disconnect();
    }
});

// === ПОМОЩНИКИ ДЛЯ РАЗРАБОТКИ ===
if (window.location.search.includes('debug=true')) {
    window.consultationDebug = {
        reinitialize: function() {
            window.consultationPageInitialized = false;
            initializeConsultationPage();
        },
        openModal: () => window.openConsultationModal(),
        closeModal: () => window.closeConsultationModal(),
        triggerAnimations: triggerInitialAnimations,
        refreshAnimations: refreshAnimations,
        testNavigation: () => navigateToContacts({preventDefault: () => {}}),
        testAlternativeNavigation: () => navigateToContactsAlternative({preventDefault: () => {}}),
        getStatus: function() {
            return {
                initialized: window.consultationPageInitialized,
                modalOpen: modalOpen,
                observerActive: !!animationObserver,
                animatedElements: document.querySelectorAll('[data-animate].animate').length,
                navigationFlags: {
                    navigate_to: sessionStorage.getItem('navigate_to'),
                    external_navigation: sessionStorage.getItem('external_navigation'),
                    navigation_source: sessionStorage.getItem('navigation_source')
                }
            };
        }
    };
    
    console.log('🔧 ИСПРАВЛЕНО: Режим отладки консультационной страницы включен');
    console.log('Доступные команды: consultationDebug.openModal(), consultationDebug.testNavigation()');
}

// Дополнительная инициализация кнопки навигации к контактам
document.addEventListener('DOMContentLoaded', function() {
    const contactsBtn = document.getElementById('contactsNavigationBtn');
    
    if (contactsBtn) {
        console.log('✅ ИСПРАВЛЕНО: Найдена кнопка навигации к контактам');
        
        // Удаляем все существующие обработчики событий
        contactsBtn.removeAttribute('onclick');
        
        // Добавляем новый обработчик
        contactsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🎯 ИСПРАВЛЕНО: Кнопка контактов нажата - улучшенная навигация');
            
            // Вызываем улучшенную функцию навигации
            if (typeof navigateToContacts === 'function') {
                navigateToContacts(e);
            } else {
                console.warn('⚠️ ИСПРАВЛЕНО: функция navigateToContacts не найдена, используем fallback');
                
                sessionStorage.setItem('navigate_to', 'contacts');
                sessionStorage.setItem('external_navigation', 'true');
                window.location.href = 'index.html#contacts';
            }
        });
        
        // Добавляем визуальную обратную связь при клике
        contactsBtn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            this.style.transition = 'transform 0.1s ease';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
        
        console.log('✅ ИСПРАВЛЕНО: Улучшенная кнопка навигации к контактам инициализирована');
    } else {
        console.error('❌ ИСПРАВЛЕНО: Кнопка навигации к контактам не найдена');
    }
    
    // Дополнительная проверка через интервал
    setTimeout(() => {
        const btn = document.getElementById('contactsNavigationBtn');
        if (btn && !btn.hasAttribute('data-enhanced')) {
            btn.setAttribute('data-enhanced', 'true');
            console.log('🔧 ИСПРАВЛЕНО: Применен улучшенный атрибут к кнопке контактов');
        }
    }, 500);
});

// Функция для тестирования навигации (для отладки)
window.testContactsNavigation = function() {
    console.log('🧪 ИСПРАВЛЕНО: Тестирование навигации к контактам...');
    const btn = document.getElementById('contactsNavigationBtn');
    if (btn) {
        btn.click();
    } else {
        console.error('❌ ИСПРАВЛЕНО: Кнопка не найдена для тестирования');
    }
};

console.log('✅ ИСПРАВЛЕНО: Улучшенная система навигации консультационной страницы загружена');