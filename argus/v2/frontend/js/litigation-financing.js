/**
 * Argus Law Firm - Litigation Financing Page Script (ПОЛНОСТЬЮ ИСПРАВЛЕННАЯ ВЕРСИЯ)
 * ИСПРАВЛЕНО: Навигация к контактам и все другие проблемы
 */

// === ПОЛНОСТЬЮ ИСПРАВЛЕННЫЕ НАВИГАЦИОННЫЕ ФУНКЦИИ ===
function navigateToContacts(event) {
    event.preventDefault();
    console.log('🧭 ИСПРАВЛЕНО: Навигация к контактам...');
    
    // КРИТИЧЕСКИ ВАЖНО: НЕ удаляем argus_visited для предотвращения перезапуска прелоадера
    // sessionStorage.removeItem('argus_visited'); // УБРАНО НАВСЕГДА!
    
    // Устанавливаем расширенные флаги навигации
    sessionStorage.setItem('navigate_to', 'contacts');
    sessionStorage.setItem('external_navigation', 'true');
    sessionStorage.setItem('navigation_source', 'litigation-financing');
    sessionStorage.setItem('navigation_timestamp', Date.now().toString());
    sessionStorage.setItem('target_ready_check', 'true'); // Дополнительный флаг
    
    console.log('📋 ИСПРАВЛЕНО: Расширенные флаги навигации установлены:', {
        navigate_to: sessionStorage.getItem('navigate_to'),
        external_navigation: sessionStorage.getItem('external_navigation'),
        source: sessionStorage.getItem('navigation_source'),
        timestamp: sessionStorage.getItem('navigation_timestamp'),
        target_ready_check: sessionStorage.getItem('target_ready_check')
    });
    
    // Добавляем визуальную обратную связь
    const button = event.target.closest('.cta-button');
    if (button) {
        button.style.transform = 'scale(0.95)';
        button.style.opacity = '0.8';
        button.textContent = 'Переходим...';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.style.opacity = '1';
        }, 200);
    }
    
    // Используем более надежный метод навигации с задержкой
    setTimeout(() => {
        try {
            // Метод 1: Современный Navigation API (если поддерживается)
            if ('navigation' in window && window.navigation.navigate) {
                console.log('🔧 Используем Navigation API');
                window.navigation.navigate('index.html#contacts');
            } else {
                // Метод 2: Стандартный location.href
                console.log('🔧 Используем location.href');
                window.location.href = 'index.html#contacts';
            }
        } catch (error) {
            // Метод 3: Fallback через replace
            console.warn('ИСПРАВЛЕНО: Основные методы не сработали, используем replace:', error);
            try {
                window.location.replace('index.html#contacts');
            } catch (replaceError) {
                // Метод 4: Последний fallback через assign
                console.error('ИСПРАВЛЕНО: Replace не сработал, используем assign:', replaceError);
                window.location.assign('index.html#contacts');
            }
        }
    }, 100); // Небольшая задержка для надежности
}

// Улучшенная альтернативная функция навигации
function navigateToContactsAlternative(event) {
    event.preventDefault();
    console.log('🧭 ИСПРАВЛЕНО АЛЬТЕРНАТИВНО: Навигация к контактам...');
    
    // Те же улучшенные флаги
    sessionStorage.setItem('navigate_to', 'contacts');
    sessionStorage.setItem('external_navigation', 'true');
    sessionStorage.setItem('navigation_source', 'litigation-financing-alt');
    sessionStorage.setItem('navigation_timestamp', Date.now().toString());
    sessionStorage.setItem('target_ready_check', 'true');
    sessionStorage.setItem('force_init', 'true'); // Дополнительный флаг для принудительной инициализации
    
    // Более продвинутая обработка с retry логикой
    let attempts = 0;
    const maxAttempts = 3;
    
    function attemptNavigation() {
        attempts++;
        console.log(`🔄 Попытка навигации ${attempts}/${maxAttempts}`);
        
        try {
            // Пробуем разные методы последовательно
            if (attempts === 1) {
                window.location.href = 'index.html#contacts';
            } else if (attempts === 2) {
                window.location.replace('index.html#contacts');
            } else {
                window.location.assign('index.html#contacts');
            }
        } catch (error) {
            console.error(`ИСПРАВЛЕНО: Попытка ${attempts} не удалась:`, error);
            
            if (attempts < maxAttempts) {
                setTimeout(() => {
                    attemptNavigation();
                }, 200);
            } else {
                console.error('ИСПРАВЛЕНО: Все попытки навигации не удались');
                // Показываем пользователю сообщение об ошибке
                alert('Не удалось перейти к контактам. Пожалуйста, используйте меню навигации.');
            }
        }
    }
    
    setTimeout(() => {
        attemptNavigation();
    }, 50);
}

// Функция для проверки готовности целевой страницы (расширенная версия)
function checkTargetPageReady() {
    return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 100; // 10 секунд
        
        const checkInterval = setInterval(() => {
            attempts++;
            
            // Проверяем множественные критерии готовности
            const criteriaChecks = {
                argusApp: window.ArgusApp && window.ArgusApp.verticalSwiper,
                swiperNotDestroyed: window.ArgusApp && !window.ArgusApp.verticalSwiper.destroyed,
                floatingHeader: document.getElementById('floatingHeader'),
                swiperWrapper: document.querySelector('.swiper-wrapper'),
                contactsSection: document.querySelector('#contacts')
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
            
            // Логируем прогресс каждые 20 попыток
            if (attempts % 20 === 0) {
                console.log(`🔄 ИСПРАВЛЕНО: Ожидание готовности страницы (попытка ${attempts}/${maxAttempts})`);
                console.log('Текущий статус:', criteriaChecks);
            }
        }, 100);
    });
}

// Функция для принудительной инициализации целевой страницы
function forceTargetPageInitialization() {
    console.log('🔧 ИСПРАВЛЕНО: Принудительная инициализация целевой страницы...');
    
    // Пытаемся вызвать функции инициализации если они доступны
    if (window.resetApp && typeof window.resetApp === 'function') {
        console.log('🔄 Вызываем resetApp()');
        window.resetApp();
    }
    
    if (window.forceReinitializeApp && typeof window.forceReinitializeApp === 'function') {
        console.log('🔄 Вызываем forceReinitializeApp()');
        window.forceReinitializeApp();
    }
    
    // Если основные функции недоступны, пытаемся перезагрузить страницу
    setTimeout(() => {
        if (!window.ArgusApp || !window.ArgusApp.verticalSwiper) {
            console.warn('⚠️ ИСПРАВЛЕНО: Основное приложение не инициализировано, перезагружаем...');
            window.location.reload();
        }
    }, 3000);
}

// Делаем функции глобально доступными
window.navigateToContacts = navigateToContacts;
window.navigateToContactsAlternative = navigateToContactsAlternative;
window.checkTargetPageReady = checkTargetPageReady;
window.forceTargetPageInitialization = forceTargetPageInitialization;

// === ГЛОБАЛЬНОЕ СОСТОЯНИЕ ===
let animationObserver = null;
let isPageVisible = true;

// === ОБРАБОТКА ВИДИМОСТИ СТРАНИЦЫ ===
document.addEventListener('visibilitychange', function() {
    isPageVisible = !document.hidden;
    
    if (isPageVisible && window.litigationPageInitialized) {
        setTimeout(() => {
            refreshAnimations();
        }, 100);
    }
});

// Инициализация сразу при готовности DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeLitigationPage();
});

function initializeLitigationPage() {
    if (window.litigationPageInitialized) return;
    window.litigationPageInitialized = true;

    console.log('⚖️ ИСПРАВЛЕНО: Страница судебного финансирования инициализирована');

    try {
        setupAnimationSystem();
        setupInteractiveElements();
        setupNavigationEnhancements();
        setupPerformanceOptimizations();
        setupAccessibilityFeatures();
        
        setTimeout(() => {
            triggerInitialAnimations();
        }, 300);
        
        console.log('✅ ИСПРАВЛЕНО: Страница судебного финансирования полностью инициализирована');
        
        document.body.classList.add('litigation-ready');
        
    } catch (error) {
        console.error('❌ ИСПРАВЛЕНО: Ошибка инициализации страницы:', error);
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
                    
                    if (element.classList.contains('timeline-item')) {
                        addTimelineRipple(element);
                    }
                    
                    if (element.classList.contains('benefit-item')) {
                        createBenefitParticles(element);
                    }
                    
                }, delay);
                
                if (!element.classList.contains('repeat-animation')) {
                    animationObserver.unobserve(element);
                }
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
    
    console.log(`📊 ИСПРАВЛЕНО: Наблюдение за ${animatedElements.length} анимированными элементами`);
}

// === ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ ===
function setupInteractiveElements() {
    console.log('🎯 ИСПРАВЛЕНО: Настройка интерактивных элементов...');
    
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.classList.add('section-hover');
            createSectionRipple(this);
        });
        
        section.addEventListener('mouseleave', function() {
            this.classList.remove('section-hover');
        });
    });
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('timeline-hover');
            highlightTimelinePath(index);
        });
        
        item.addEventListener('mouseleave', function() {
            this.classList.remove('timeline-hover');
            resetTimelinePath();
        });
    });
    
    // ИСПРАВЛЕНО: Улучшенная обработка кнопок CTA
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            createButtonRipple(this);
        });
        
        button.addEventListener('click', function(e) {
            createClickEffect(this, e);
            
            // ИСПРАВЛЕНО: Более надежная обработка кнопки "Связаться с нами"
            const buttonText = this.textContent.trim();
            if (buttonText.includes('Связаться с нами') || this.href && this.href.includes('#contacts')) {
                console.log('🎯 ИСПРАВЛЕНО: Кнопка контактов нажата, обеспечиваем правильную навигацию...');
                
                // Предотвращаем стандартное поведение ссылки
                e.preventDefault();
                e.stopPropagation();
                
                // Добавляем визуальную обратную связь
                this.style.transform = 'scale(0.95)';
                this.style.opacity = '0.8';
                
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                    this.style.opacity = '1';
                }, 200);
                
                // Вызываем улучшенную навигацию
                navigateToContacts(e);
            }
        });
    });
    
    const sectionIcons = document.querySelectorAll('.section-icon');
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
    
    // ИСПРАВЛЕНО: Более надежная обработка кнопок контактов
    const contactButtons = document.querySelectorAll('a[href*="#contacts"], a[href*="index.html#contacts"], .cta-button--secondary');
    contactButtons.forEach((button, index) => {
        console.log(`🔗 ИСПРАВЛЕНО: Найдена кнопка контактов ${index + 1}:`, button.textContent.trim());
        
        // Удаляем все существующие обработчики
        button.removeAttribute('onclick');
        
        // Клонируем элемент для удаления всех обработчиков событий
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Добавляем новый улучшенный обработчик
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🎯 ИСПРАВЛЕНО: Кнопка контактов нажата через улучшенный обработчик');
            console.log('Текст кнопки:', this.textContent.trim());
            console.log('Href кнопки:', this.href || 'не установлен');
            
            // Визуальная обратная связь
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Используем улучшенную навигацию
            navigateToContacts(e);
        });
        
        console.log(`✅ ИСПРАВЛЕНО: Улучшенная кнопка контактов ${index + 1} инициализирована`);
    });
    
    // Плавная прокрутка для внутренних ссылок
    const internalLinks = document.querySelectorAll('a[href^="#"]:not([href*="contacts"])');
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
    
    console.log('✅ ИСПРАВЛЕНО: Улучшения навигации завершены');
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
            case 'Escape':
                document.querySelectorAll('.section-hover, .timeline-hover')
                    .forEach(el => el.classList.remove('section-hover', 'timeline-hover'));
                break;
                
            case 'Tab':
                document.body.classList.add('keyboard-navigation');
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
function addTimelineRipple(timelineItem) {
    const ripple = document.createElement('div');
    ripple.className = 'timeline-ripple';
    ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 30px;
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: timelineRipple 1s ease-out forwards;
        pointer-events: none;
        z-index: 1;
    `;
    
    if (!document.querySelector('#timelineRippleStyles')) {
        const style = document.createElement('style');
        style.id = 'timelineRippleStyles';
        style.textContent = `
            @keyframes timelineRipple {
                to {
                    width: 200px;
                    height: 200px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    timelineItem.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple && ripple.parentNode) {
            ripple.remove();
        }
    }, 1000);
}

function createBenefitParticles(benefitItem) {
    const particles = 3;
    for (let i = 0; i < particles; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'benefit-particle';
            particle.style.cssText = `
                position: absolute;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                width: 4px;
                height: 4px;
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
                            transform: translateY(-50px);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            benefitItem.appendChild(particle);
            
            setTimeout(() => {
                if (particle && particle.parentNode) {
                    particle.remove();
                }
            }, 2000);
        }, i * 200);
    }
}

function createSectionRipple(section) {
    const ripple = document.createElement('div');
    ripple.className = 'section-ripple';
    ripple.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
        animation: sectionRipple 1.5s ease-out forwards;
        pointer-events: none;
        z-index: 1;
    `;
    
    if (!document.querySelector('#sectionRippleStyles')) {
        const style = document.createElement('style');
        style.id = 'sectionRippleStyles';
        style.textContent = `
            @keyframes sectionRipple {
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
    
    section.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple && ripple.parentNode) {
            ripple.remove();
        }
    }, 1500);
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

function highlightTimelinePath(index) {
    const timeline = document.querySelector('.process-timeline');
    if (timeline) {
        timeline.style.setProperty('--highlight-progress', `${(index + 1) * 20}%`);
        timeline.classList.add('path-highlighted');
    }
}

function resetTimelinePath() {
    const timeline = document.querySelector('.process-timeline');
    if (timeline) {
        timeline.classList.remove('path-highlighted');
    }
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
    const headerElements = document.querySelectorAll('.litigation-header *');
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
    console.error('ИСПРАВЛЕНО: Ошибка на странице судебного финансирования:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('ИСПРАВЛЕНО: Необработанное отклонение промиса на странице судебного финансирования:', e.reason);
});

// === ОЧИСТКА ===
window.addEventListener('beforeunload', function() {
    if (animationObserver) {
        animationObserver.disconnect();
    }
});

// === ПОМОЩНИКИ ДЛЯ РАЗРАБОТКИ ===
if (window.location.search.includes('debug=true')) {
    window.litigationDebug = {
        reinitialize: function() {
            window.litigationPageInitialized = false;
            initializeLitigationPage();
        },
        triggerAnimations: triggerInitialAnimations,
        refreshAnimations: refreshAnimations,
        testNavigation: function() {
            console.log('🧪 ИСПРАВЛЕНО: Тестирование навигации к контактам...');
            navigateToContacts({preventDefault: () => {}});
        },
        testAlternativeNavigation: function() {
            console.log('🧪 ИСПРАВЛЕНО: Тестирование альтернативной навигации к контактам...');
            navigateToContactsAlternative({preventDefault: () => {}});
        },
        checkTargetReady: checkTargetPageReady,
        forceTargetInit: forceTargetPageInitialization,
        getStatus: function() {
            return {
                initialized: window.litigationPageInitialized,
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
    
    console.log('🔧 ИСПРАВЛЕНО: Режим отладки страницы судебного финансирования включен');
    console.log('Доступные команды: litigationDebug.testNavigation(), litigationDebug.getStatus()');
}

// === ФУНКЦИЯ ТЕСТИРОВАНИЯ ===
window.testContactsNavigation = function() {
    console.log('🧪 ИСПРАВЛЕНО: Тестирование навигации к контактам...');
    const testEvent = { preventDefault: () => {}, target: document.body };
    navigateToContacts(testEvent);
};

window.testAlternativeContactsNavigation = function() {
    console.log('🧪 ИСПРАВЛЕНО: Тестирование альтернативной навигации к контактам...');
    const testEvent = { preventDefault: () => {}, target: document.body };
    navigateToContactsAlternative(testEvent);
};

console.log('✅ ИСПРАВЛЕНО: Улучшенная система навигации судебного финансирования загружена');