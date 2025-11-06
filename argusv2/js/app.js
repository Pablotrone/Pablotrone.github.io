/* ============================================
   APP - MAIN ENTRY POINT
   Главный файл приложения
   ============================================ */

import CONFIG, { utils } from './config.js';
import viewportFix from './viewport-fix.js';
import swiperManager from './swiper-manager.js';
import i18n from './i18n.js';

/**
 * Главный класс приложения
 */
class App {
    constructor() {
        this.isInitialized = false;
        this.mobileMenuOpen = false;
    }
    
    /**
     * Инициализация приложения
     */
    async init() {
        if (this.isInitialized) {
            utils.log('App уже инициализирован');
            return;
        }
        
        utils.log('🚀 Запуск приложения Argus Law...');
        
        // Ждем полной загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }
    
    /**
     * Запуск всех систем
     */
    async start() {
        utils.log('Инициализация модулей...');
        
        try {
            // 1. Viewport Fix (первым, т.к. влияет на размеры)
            viewportFix.init();
            
            // 2. i18n (вторым, чтобы тексты загрузились до показа)
            await i18n.init();
            
            // 3. Swiper (после того как тексты загружены)
            swiperManager.init();
            
            // 4. Навигация и UI
            this.initNavigation();
            this.initMobileMenu();
            
            // 5. Обработчики событий
            this.attachEventListeners();
            
            this.isInitialized = true;
            utils.log('✅ Приложение успешно запущено!');
            
        } catch (error) {
            utils.error('Ошибка при запуске приложения:', error);
        }
    }
    
    /**
     * Инициализация навигации
     */
    initNavigation() {
        // Обработка кликов по якорным ссылкам
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const hash = link.getAttribute('href').substring(1); // Убираем #
                this.navigateToSlide(hash);
                
                // Закрываем мобильное меню если открыто
                if (this.mobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        });

        // Выпадающее меню (десктоп)
        const dropdownToggle = document.querySelector('.dropdown-toggle');
        const dropdownMenu = document.querySelector('.dropdown-menu');
        
        if (dropdownToggle && dropdownMenu) {
            // Клик по кнопке
            dropdownToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
                dropdownToggle.setAttribute('aria-expanded', !isExpanded);
            });
            
            // Закрытие при клике вне меню
            document.addEventListener('click', (e) => {
                if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownToggle.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Закрытие при клике на ссылку
            const dropdownLinks = dropdownMenu.querySelectorAll('.dropdown-link');
            dropdownLinks.forEach(link => {
                link.addEventListener('click', () => {
                    dropdownToggle.setAttribute('aria-expanded', 'false');
                });
            });
        }
        
        utils.log('Навигация инициализирована');
    }
    
    /**
     * Переход к слайду по хешу
     */
    navigateToSlide(hash) {
        const slideMap = {
            'home': 0,
            'about': 1,
            'practices': 2,
            'contacts': 3,
        };
        
        const slideIndex = slideMap[hash];
        
        if (slideIndex !== undefined) {
            swiperManager.slideTo(slideIndex);
            utils.log(`Переход к слайду: ${hash} (${slideIndex})`);
        }
    }
    
    /**
     * Инициализация мобильного меню
     */
    initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (!menuToggle) {
            utils.log('Кнопка .menu-toggle не найдена');
            return;
        }
        
        menuToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        utils.log('Мобильное меню инициализировано');
    }
    
    /**
     * Открыть/закрыть мобильное меню
     */
    toggleMobileMenu() {
        if (this.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    /**
     * Открыть мобильное меню
     */
    openMobileMenu() {
        const menu = document.querySelector('.mobile-menu');
        const toggle = document.querySelector('.menu-toggle');
        
        if (menu) {
            menu.classList.add('active');
            this.mobileMenuOpen = true;
            
            // Обновляем aria-атрибут
            if (toggle) {
                toggle.classList.add('active');
                toggle.setAttribute('aria-expanded', 'true');
            }
            
            // Блокируем скролл body
            document.body.style.overflow = 'hidden';
            
            utils.log('Мобильное меню открыто');
        }
    }
    
    /**
     * Закрыть мобильное меню
     */
    closeMobileMenu() {
        const menu = document.querySelector('.mobile-menu');
        const toggle = document.querySelector('.menu-toggle');
        
        if (menu) {
            menu.classList.remove('active');
            this.mobileMenuOpen = false;
            
            // Обновляем aria-атрибут
            if (toggle) {
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
            
            // Разблокируем скролл body
            document.body.style.overflow = '';
            
            utils.log('Мобильное меню закрыто');
        }
    }
    
    /**
     * Глобальные обработчики событий
     */
    attachEventListeners() {
        // Закрытие мобильного меню по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Закрытие мобильного меню при клике вне его
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.addEventListener('click', (e) => {
                // Если кликнули на сам фон (не на контент)
                if (e.target === mobileMenu) {
                    this.closeMobileMenu();
                }
            });
        }
        
        utils.log('Глобальные обработчики событий установлены');
    }
}

// Создаем экземпляр приложения
const app = new App();

// Запускаем приложение
app.init();

// Экспортируем для доступа из консоли (для дебага)
window.ArgusApp = app;

utils.log('App.js загружен');