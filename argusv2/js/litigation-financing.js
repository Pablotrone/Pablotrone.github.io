/* ============================================
   LITIGATION FINANCING PAGE SCRIPT
   Инициализация мультиязычности
   ============================================ */

import CONFIG, { utils } from './config.js';
import i18n from './i18n.js';

/**
 * Класс для управления страницей судебного финансирования
 */
class LitigationFinancingPage {
    constructor() {
        this.isInitialized = false;
    }
    
    /**
     * Инициализация
     */
    async init() {
        if (this.isInitialized) {
            utils.log('Litigation financing page уже инициализирован');
            return;
        }
        
        utils.log('Инициализация litigation financing page...');
        
        // Ждем загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }
    
    /**
     * Запуск
     */
    async start() {
        try {
            // Инициализируем i18n
            await i18n.init();
            
            this.isInitialized = true;
            utils.log('Litigation financing page инициализирован');
            
        } catch (error) {
            utils.error('Ошибка при инициализации litigation financing page:', error);
        }
    }
}

// Создаем и запускаем
const litigationPage = new LitigationFinancingPage();
litigationPage.init();

// Экспортируем для доступа из консоли
window.LitigationFinancingPage = litigationPage;