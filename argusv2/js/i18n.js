/* ============================================
   i18n (INTERNATIONALIZATION)
   Система мультиязычности
   ============================================ */

import CONFIG, { utils } from './config.js';

/**
 * Класс для управления переводами
 */
class I18n {
    constructor() {
        this.currentLanguage = CONFIG.defaultLanguage;
        this.translations = {};
        this.isInitialized = false;
    }
    
    /**
     * Инициализация системы переводов
     */
    async init() {
        if (this.isInitialized) {
            utils.log('i18n уже инициализирован');
            return;
        }
        
        // Получаем сохраненный язык или определяем автоматически
        this.currentLanguage = this.getSavedLanguage();
        
        utils.log(`Инициализация i18n с языком: ${this.currentLanguage}`);
        
        // Загружаем переводы
        await this.loadTranslations(this.currentLanguage);
        
        // Применяем переводы
        this.applyTranslations();
        
        // Обновляем кнопки языков
        this.updateLanguageButtons();
        
        // Навешиваем обработчики на кнопки
        this.attachEventListeners();
        
        this.isInitialized = true;
        utils.log('i18n инициализирован');
    }
    
    /**
     * Получить сохраненный язык из localStorage или определить автоматически
     */
    getSavedLanguage() {
        // Проверяем localStorage
        const savedLang = localStorage.getItem(CONFIG.storageKeys.language);
        
        if (savedLang && CONFIG.availableLanguages.includes(savedLang)) {
            utils.log(`Язык из localStorage: ${savedLang}`);
            return savedLang;
        }
        
        // Определяем язык браузера
        const browserLang = navigator.language.split('-')[0]; // 'ru-RU' → 'ru'
        
        if (CONFIG.availableLanguages.includes(browserLang)) {
            utils.log(`Язык браузера: ${browserLang}`);
            return browserLang;
        }
        
        // По умолчанию
        utils.log(`Язык по умолчанию: ${CONFIG.defaultLanguage}`);
        return CONFIG.defaultLanguage;
    }
    
    /**
     * Загрузка переводов из JSON файла
     */
    async loadTranslations(lang) {
        const path = `locales/${lang}.json`;
        
        utils.log(`Загрузка переводов: ${path}`);
        
        try {
            const response = await fetch(path);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.translations = await response.json();
            utils.log(`Переводы загружены для языка: ${lang}`);
            
        } catch (error) {
            utils.error(`Ошибка загрузки переводов для ${lang}:`, error);
            
            // Если не удалось загрузить, пробуем загрузить дефолтный язык
            if (lang !== CONFIG.defaultLanguage) {
                utils.log(`Попытка загрузить дефолтный язык: ${CONFIG.defaultLanguage}`);
                await this.loadTranslations(CONFIG.defaultLanguage);
            }
        }
    }
    
    /**
     * Применить переводы ко всем элементам с data-i18n
     */
    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        
        utils.log(`Применение переводов к ${elements.length} элементам`);
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
                
            if (translation) {
                // если это input, textarea или что-то с placeholder — ставим перевод туда
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.setAttribute('placeholder', translation);
                } 
                // если это title или alt (например у картинок)
                else if (element.hasAttribute('title')) {
                    element.setAttribute('title', translation);
                } 
                // иначе просто вставляем текст
                else {
                    element.textContent = translation;
                }
            } else {
                utils.error(`Перевод не найден для ключа: ${key}`);
            }
        });
        
        // Обновляем атрибут lang в HTML
        document.documentElement.setAttribute('lang', this.currentLanguage);
        
        // Обновляем мета-теги
        this.updateMetaTags();
    }
    
    /**
     * Получить перевод по ключу (например: "home.title")
     */
    getTranslation(key) {
        const keys = key.split('.');
        let translation = this.translations;
        
        // Идем по вложенному объекту
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                return null;
            }
        }
        
        return translation;
    }
    
    /**
     * Обновить мета-теги
     */
    updateMetaTags() {
        // Обновляем title
        const title = this.getTranslation('meta.title');
        if (title) {
            document.title = title;
        }
        
        // Обновляем description
        const description = this.getTranslation('meta.description');
        if (description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', description);
            }
        }
        
        // Обновляем Open Graph теги
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && title) {
            ogTitle.setAttribute('content', title);
        }
        
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc && description) {
            ogDesc.setAttribute('content', description);
        }
    }
    
    /**
     * Обновить состояние кнопок языков
     */
    updateLanguageButtons() {
        const buttons = document.querySelectorAll('.lang-btn');
        
        buttons.forEach(button => {
            const lang = button.getAttribute('data-lang');
            
            if (lang === this.currentLanguage) {
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-pressed', 'false');
            }
        });
    }
    
    /**
     * Навесить обработчики на кнопки языков
     */
    attachEventListeners() {
        const buttons = document.querySelectorAll('.lang-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                
                if (lang && lang !== this.currentLanguage) {
                    this.changeLanguage(lang);
                }
            });
        });
        
        utils.log('Обработчики событий для кнопок языков установлены');
    }
    
    /**
     * Сменить язык
     */
    async changeLanguage(lang) {
        if (!CONFIG.availableLanguages.includes(lang)) {
            utils.error(`Язык ${lang} не поддерживается`);
            return;
        }
        
        if (lang === this.currentLanguage) {
            utils.log(`Язык ${lang} уже активен`);
            return;
        }
        
        utils.log(`Смена языка: ${this.currentLanguage} → ${lang}`);
        
        // Сохраняем в localStorage
        localStorage.setItem(CONFIG.storageKeys.language, lang);
        
        // Обновляем текущий язык
        this.currentLanguage = lang;
        
        // Загружаем новые переводы
        await this.loadTranslations(lang);
        
        // Применяем переводы
        this.applyTranslations();
        
        // Обновляем кнопки
        this.updateLanguageButtons();
        
        utils.log(`Язык изменен на: ${lang}`);
    }
    
    /**
     * Получить текущий язык
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Создаем единственный экземпляр
const i18n = new I18n();

// Экспортируем
export default i18n;

// Глобально для доступа из swiper-manager
window.i18nInstance = i18n;