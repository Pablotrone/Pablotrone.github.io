/* ============================================
   VIEWPORT HEIGHT FIX
   ============================================ */

import { utils } from './config.js';

/**
 * Класс для управления реальной высотой viewport
 */
class ViewportFix {
    constructor() {
        this.isInitialized = false;
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
        
        // Обновляем при изменении размера окна
        window.addEventListener('resize', () => this.handleResize());
        
        // Обновляем при изменении ориентации
        window.addEventListener('orientationchange', () => this.handleOrientationChange());
        
        this.isInitialized = true;
        utils.log('ViewportFix инициализирован');
    }
    
    /**
     * Вычисляем и устанавливаем реальную высоту viewport
     */
    setViewportHeight() {
        // Получаем реальную высоту viewport (без адресной строки)
        const vh = window.innerHeight * 0.01;
        
        // Устанавливаем CSS переменную --vh
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        utils.log(`Viewport height установлен: ${vh}px (100vh = ${window.innerHeight}px)`);
    }
    
    /**
     * Обработчик изменения размера окна
     */
    handleResize() {
        // Используем debounce для оптимизации
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
    }
    
    /**
     * Уничтожение (для очистки памяти)
     */
    destroy() {
        window.removeEventListener('resize', () => this.handleResize());
        window.removeEventListener('orientationchange', () => this.handleOrientationChange());
        
        this.isInitialized = false;
        utils.log('ViewportFix уничтожен');
    }
}

// Создаем единственный экземпляр (Singleton)
const viewportFix = new ViewportFix();

// Экспортируем
export default viewportFix;