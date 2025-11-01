/* ============================================
   PROJECT CONFIGURATION
   Все константы и настройки проекта
   ============================================ */

export const CONFIG = {
    // Язык по умолчанию
    defaultLanguage: 'ru',
    
    // Доступные языки
    availableLanguages: ['ru', 'en', 'fr'],
    
    // Ключ для localStorage
    storageKeys: {
        language: 'argus_language',
    },
    
    // Брейкпоинты
    breakpoints: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536,
    },
    
    // Настройки Swiper
    swiper: {
        vertical: {
            speed: 1000,              // Скорость перехода (ms)
            spaceBetween: 0,          // Расстояние между слайдами
            mousewheel: {
                sensitivity: 1,       // Чувствительность колеса мыши
                releaseOnEdges: true,
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            touchRatio: 1,            // Чувствительность свайпа
            touchAngle: 45,           // Угол для распознавания свайпа
        },
        
        horizontal: {
            speed: 600,
            spaceBetween: 30,
            slidesPerView: 1,
            breakpoints: {
                640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
            },
        },
    },
    
    // Названия слайдов для pagination
    slideNames: ['Home', 'About', 'Practices', 'Contacts'],
    
    // Дебаг режим
    debug: true, // Включает console.log
};

// Вспомогательные функции
export const utils = {
    // Проверка мобильного устройства
    isMobile() {
        return window.innerWidth < CONFIG.breakpoints.md;
    },
    
    // Проверка планшета
    isTablet() {
        return window.innerWidth >= CONFIG.breakpoints.md && 
               window.innerWidth < CONFIG.breakpoints.lg;
    },
    
    // Проверка десктопа
    isDesktop() {
        return window.innerWidth >= CONFIG.breakpoints.lg;
    },
    
    // Логирование (только если debug включен)
    log(...args) {
        if (CONFIG.debug) {
            console.log('[Argus]', ...args);
        }
    },
    
    // Ошибки (всегда показываем)
    error(...args) {
        console.error('[Argus Error]', ...args);
    },
    
    // Получить текущий брейкпоинт
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width < CONFIG.breakpoints.sm) return 'xs';
        if (width < CONFIG.breakpoints.md) return 'sm';
        if (width < CONFIG.breakpoints.lg) return 'md';
        if (width < CONFIG.breakpoints.xl) return 'lg';
        if (width < CONFIG.breakpoints['2xl']) return 'xl';
        return '2xl';
    },
};

// Экспортируем для использования в других модулях
export default CONFIG;