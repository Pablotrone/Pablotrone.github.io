/* ============================================
   VIEWPORT HEIGHT FIX
   Исправление высоты viewport для iOS Safari
   ============================================ */

import { utils } from './config.js';

/**
 * Класс для управления реальной высотой viewport
 * Решает проблему с адресной строкой Safari на iPhone
 */
class ViewportFix {
    constructor() {
        this.isInitialized = false;
        this.resizeTimer = null;
        this.lastHeight = 0;
    }
    
    /**
     * Инициализация фикса
     */
    init() {
        if (this.isInitialized) {
            utils.log('ViewportFix уже инициализирован');
            return;
        }
        
        // Устанавливаем высоту при загрузке
        this.setViewportHeight();
        
        // Обновляем при изменении размера окна (с debounce)
        window.addEventListener('resize', () => this.handleResize(), { passive: true });
        
        // Обновляем при изменении ориентации
        window.addEventListener('orientationchange', () => this.handleOrientationChange(), { passive: true });
        
        // Для iOS Safari: слушаем visualViewport API (более точный)
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => this.handleVisualViewportResize(), { passive: true });
            window.visualViewport.addEventListener('scroll', () => this.handleVisualViewportResize(), { passive: true });
        }
        
        // Для iOS: обновляем при скролле (адресная строка появляется/исчезает)
        document.addEventListener('touchmove', () => this.handleTouchMove(), { passive: true });
        document.addEventListener('touchend', () => this.handleTouchEnd(), { passive: true });
        
        // Обновляем после полной загрузки страницы
        window.addEventListener('load', () => {
            setTimeout(() => this.setViewportHeight(), 100);
        });
        
        this.isInitialized = true;
        utils.log('ViewportFix инициализирован');
    }
    
    /**
     * Вычисляем и устанавливаем реальную высоту viewport
     */
    setViewportHeight() {
        // Используем visualViewport API если доступен (более точный для iOS)
        let height;
        
        if (window.visualViewport) {
            height = window.visualViewport.height;
        } else {
            height = window.innerHeight;
        }
        
        // Избегаем ненужных обновлений
        if (Math.abs(height - this.lastHeight) < 1) {
            return;
        }
        
        this.lastHeight = height;
        
        // Вычисляем 1vh
        const vh = height * 0.01;
        
        // Устанавливаем CSS переменную --vh
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        utils.log(`Viewport height: ${height}px, --vh: ${vh}px`);
    }
    
    /**
     * Обработчик изменения размера окна
     */
    handleResize() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            this.setViewportHeight();
        }, 100);
    }
    
    /**
     * Обработчик изменения ориентации
     */
    handleOrientationChange() {
        // Небольшая задержка для корректного получения размеров
        setTimeout(() => {
            this.setViewportHeight();
        }, 200);
        
        // Дополнительное обновление через 500ms (для медленных устройств)
        setTimeout(() => {
            this.setViewportHeight();
        }, 500);
    }
    
    /**
     * Обработчик visualViewport resize (для iOS Safari)
     */
    handleVisualViewportResize() {
        // Используем requestAnimationFrame для плавности
        requestAnimationFrame(() => {
            this.setViewportHeight();
        });
    }
    
    /**
     * Обработчик touchmove (для iOS Safari адресной строки)
     */
    handleTouchMove() {
        // Не обновляем во время активного скролла для производительности
    }
    
    /**
     * Обработчик touchend (для iOS Safari адресной строки)
     */
    handleTouchEnd() {
        // Обновляем после завершения касания
        setTimeout(() => {
            this.setViewportHeight();
        }, 300);
    }
    
    /**
     * Уничтожение (для очистки памяти)
     */
    destroy() {
        window.removeEventListener('resize', () => this.handleResize());
        window.removeEventListener('orientationchange', () => this.handleOrientationChange());
        
        if (window.visualViewport) {
            window.visualViewport.removeEventListener('resize', () => this.handleVisualViewportResize());
            window.visualViewport.removeEventListener('scroll', () => this.handleVisualViewportResize());
        }
        
        this.isInitialized = false;
        utils.log('ViewportFix уничтожен');
    }
}

// Создаем единственный экземпляр (Singleton)
const viewportFix = new ViewportFix();

// Экспортируем
export default viewportFix;