/* ============================================
   CONSULTATION PAGE SCRIPT
   Функционал модалки и мультиязычность
   ============================================ */

import CONFIG, { utils } from './config.js';
import i18n from './i18n.js';

/**
 * Класс для управления страницей консультаций
 */
class ConsultationPage {
    constructor() {
        this.modal = null;
        this.isInitialized = false;
    }
    
    /**
     * Инициализация
     */
    async init() {
        if (this.isInitialized) {
            utils.log('Consultation page уже инициализирован');
            return;
        }
        
        utils.log('Инициализация consultation page...');
        
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
            
            // Инициализируем модалку
            this.initModal();
            
            this.isInitialized = true;
            utils.log('Consultation page инициализирован');
            
        } catch (error) {
            utils.error('Ошибка при инициализации consultation page:', error);
        }
    }
    
    /**
     * Инициализация модального окна
     */
    initModal() {
        this.modal = document.getElementById('consultationModal');
        const openBtn = document.getElementById('consultationInfoBtn');
        const closeBtn = document.getElementById('modalClose');
        const overlay = this.modal?.querySelector('.modal-overlay');
        
        if (!this.modal || !openBtn) {
            utils.log('Modal элементы не найдены');
            return;
        }
        
        // Открытие модалки
        openBtn.addEventListener('click', () => this.openModal());
        
        // Закрытие модалки
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => this.closeModal());
        }
        
        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
        
        utils.log('Модалка инициализирована');
    }
    
    /**
     * Открыть модалку
     */
    openModal() {
        if (!this.modal) return;
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        utils.log('Модалка открыта');
    }
    
    /**
     * Закрыть модалку
     */
    closeModal() {
        if (!this.modal) return;
        
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        
        utils.log('Модалка закрыта');
    }
    
    /**
     * Обновить состояние кнопок языков
     */
    updateLanguageButtons() {
        const buttons = document.querySelectorAll('.lang-btn');
        const currentLang = i18n.getCurrentLanguage();
        
        buttons.forEach(button => {
            const lang = button.getAttribute('data-lang');
            
            if (lang === currentLang) {
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-pressed', 'false');
            }
        });
    }
}

// Создаем и запускаем
const consultationPage = new ConsultationPage();
consultationPage.init();

// Экспортируем для доступа из консоли
window.ConsultationPage = consultationPage;