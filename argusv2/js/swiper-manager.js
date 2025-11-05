/* ============================================
   SWIPER MANAGER
   Управление всеми слайдерами на сайте
   ============================================ */

import CONFIG, { utils } from './config.js';

/**
 * Класс для управления Swiper слайдерами
 */
class SwiperManager {
    constructor() {
        this.verticalSwiper = null;
        this.horizontalSwiper = null;
        this.isInitialized = false;
    }
    
    /**
     * Инициализация всех слайдеров
     */
    init() {
        if (this.isInitialized) {
            utils.log('SwiperManager уже инициализирован');
            return;
        }
        
        // Проверяем что библиотека Swiper загружена
        if (typeof Swiper === 'undefined') {
            utils.error('Swiper библиотека не загружена!');
            return;
        }
        
        // Инициализируем слайдеры
        this.initVerticalSwiper();
        this.initPracticesSlider();
        
        this.isInitialized = true;
        utils.log('SwiperManager инициализирован');
    }
    
    /**
     * Инициализация вертикального слайдера (главный)
     */
    initVerticalSwiper() {
        const container = document.querySelector('.vertical-swiper');
        
        if (!container) {
            utils.error('Контейнер .vertical-swiper не найден');
            return;
        }
        
        // Настройки из config
        const config = CONFIG.swiper.vertical;
        
        this.verticalSwiper = new Swiper('.vertical-swiper', {
            // Направление
            direction: 'vertical',
            
            // Слайды
            slidesPerView: 1,
            spaceBetween: config.spaceBetween,
            
            // Скорость
            speed: config.speed,
            
            // Управление колесом мыши
            mousewheel: {
                enabled: true,
                sensitivity: config.mousewheel.sensitivity,
                releaseOnEdges: config.mousewheel.releaseOnEdges,
            },
            
            // Управление клавиатурой
            keyboard: {
                enabled: config.keyboard.enabled,
                onlyInViewport: config.keyboard.onlyInViewport,
            },
            
            // Тач-события
            touchRatio: config.touchRatio,
            touchAngle: config.touchAngle,
            
            // Эффект перехода
            effect: 'slide',
            
            // Pagination (точки навигации)
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                renderBullet: (index, className) => {
                    const slideName = CONFIG.slideNames[index] || `Slide ${index + 1}`;
                    return `<span class="${className}" aria-label="${slideName}"></span>`;
                },
            },
            
            // Хеш навигация (для якорных ссылок)
            hashNavigation: {
                watchState: true,
            },
            
            // События
            on: {
                init: () => {
                    utils.log('Вертикальный Swiper инициализирован');
                    this.onVerticalSlideChange();
                },
                
                slideChange: () => {
                    this.onVerticalSlideChange();
                },
                
                slideChangeTransitionStart: () => {
                    // Добавляем класс для анимаций
                    document.body.classList.add('sliding');
                },
                
                slideChangeTransitionEnd: () => {
                    // Убираем класс после завершения анимации
                    document.body.classList.remove('sliding');
                },
            },
        });
        
        utils.log('Вертикальный Swiper создан');
    }
    
    /**
     * Обработчик смены слайда (вертикальный)
     */
    onVerticalSlideChange() {
        if (!this.verticalSwiper) return;
        
        const activeIndex = this.verticalSwiper.activeIndex;
        const slideName = CONFIG.slideNames[activeIndex] || 'Unknown';
        
        utils.log(`Активный слайд: ${activeIndex} (${slideName})`);
        
        // Обновляем хеш в URL
        this.updateHash(activeIndex);
        
        // Обновляем активный пункт в мобильном меню
        this.updateMobileMenu(activeIndex);
    }
    
    /**
     * Обновление хеша в URL
     */
    updateHash(index) {
        const hashes = ['home', 'about', 'practices', 'contacts'];
        const hash = hashes[index] || 'home';
        
        // Обновляем без перезагрузки страницы
        if (window.location.hash !== `#${hash}`) {
            history.replaceState(null, null, `#${hash}`);
        }
    }
    
    /**
     * Обновление активного пункта в мобильном меню
     */
    updateMobileMenu(index) {
        const menuLinks = document.querySelectorAll('.mobile-menu-link');
        
        menuLinks.forEach((link, i) => {
            if (i === index) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    /**
     * Переход к конкретному слайду
     */
    slideTo(index, speed = CONFIG.swiper.vertical.speed) {
        if (!this.verticalSwiper) {
            utils.error('Вертикальный Swiper не инициализирован');
            return;
        }
        
        this.verticalSwiper.slideTo(index, speed);
        utils.log(`Переход к слайду ${index}`);
    }
    
    /**
     * Следующий слайд
     */
    slideNext() {
        if (this.verticalSwiper) {
            this.verticalSwiper.slideNext();
        }
    }
    
    /**
     * Предыдущий слайд
     */
    slidePrev() {
        if (this.verticalSwiper) {
            this.verticalSwiper.slidePrev();
        }
    }
    
    /**
     * Получить текущий индекс слайда
     */
    getActiveIndex() {
        return this.verticalSwiper ? this.verticalSwiper.activeIndex : 0;
    }
    
    /**
     * Уничтожение слайдеров (для очистки памяти)
     */
    destroy() {
        if (this.verticalSwiper) {
            this.verticalSwiper.destroy(true, true);
            this.verticalSwiper = null;
            utils.log('Вертикальный Swiper уничтожен');
        }
        
        if (this.horizontalSwiper) {
            this.horizontalSwiper.destroy(true, true);
            this.horizontalSwiper = null;
            utils.log('Горизонтальный Swiper уничтожен');
        }
        
        this.isInitialized = false;
    }
    /**
     * Инициализация слайдера практик (БЕЗ Swiper, свой код)
     */
    initPracticesSlider() {
        const card = document.querySelector('.practice-single-card');
        if (!card) {
            utils.log('practice-single-card не найден');
            return;
        }
        
        this.currentPracticeIndex = 0;
        this.autoplayInterval = null;
        
        // Данные практик
        this.practices = [
            { icon: 'logo', titleKey: 'practices.card_1_title', textKey: 'practices.card_1_text' },
            { icon: 'logo', titleKey: 'practices.card_2_title', textKey: 'practices.card_2_text' },
            { icon: 'logo', titleKey: 'practices.card_3_title', textKey: 'practices.card_3_text' },
            { icon: 'logo', titleKey: 'practices.card_4_title', textKey: 'practices.card_4_text' },
            { icon: 'logo', titleKey: 'practices.card_5_title', textKey: 'practices.card_5_text' },
            { icon: 'logo', titleKey: 'practices.card_6_title', textKey: 'practices.card_6_text' },
            { icon: 'logo', titleKey: 'practices.card_7_title', textKey: 'practices.card_7_text' },
        ];
        
        // Создаем пагинацию
        this.createPracticePagination();
        
        // Показываем первый слайд
        this.showPracticeSlide(0);
        
        // Обработчики кнопок
        const prevBtn = document.querySelector('.practice-prev');
        const nextBtn = document.querySelector('.practice-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevPractice();
                this.resetPracticeAutoplay();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextPractice();
                this.resetPracticeAutoplay();
            });
        }
        
        // Touch события для свайпа на мобилке
        this.initPracticeSwipe(card);
        
        // Пауза при hover
        card.addEventListener('mouseenter', () => this.stopPracticeAutoplay());
        card.addEventListener('mouseleave', () => this.startPracticeAutoplay());
        
        // Запускаем autoplay
        this.startPracticeAutoplay();
        
        utils.log('Practices slider инициализирован');
    }
    
    createPracticePagination() {
        const container = document.querySelector('.practice-pagination');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.practices.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'practice-pagination-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                this.showPracticeSlide(index);
                this.resetPracticeAutoplay();
            });
            container.appendChild(dot);
        });
    }
    
    showPracticeSlide(index) {
        const practice = this.practices[index];
        const content = document.querySelector('.practice-card-content');
        
        if (!content) return;
        
        // Анимация выхода
        content.classList.add('slide-out');
        
        // Через 400ms меняем контент и показываем
        setTimeout(() => {
            // Получаем i18n
            const i18n = window.i18nInstance;
            if (!i18n) return;
            
            // Обновляем контент
            const icon = document.querySelector('.practice-icon');
            const title = document.querySelector('.practice-title');
            const desc = document.querySelector('.practice-description');
            
            if (icon) {
                icon.innerHTML = '<img src="assets/images/logo.svg" alt="Argus Logo">';
            }
            if (title) {
                title.setAttribute('data-i18n', practice.titleKey);
                title.textContent = i18n.getTranslation(practice.titleKey);
            }
            if (desc) {
                desc.setAttribute('data-i18n', practice.textKey);
                desc.textContent = i18n.getTranslation(practice.textKey);
                desc.scrollTop = 0; // Скроллим вверх
            }
            
            // Обновляем пагинацию
            document.querySelectorAll('.practice-pagination-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            this.currentPracticeIndex = index;
            
            // Убираем slide-out, добавляем slide-in
            content.classList.remove('slide-out');
            content.classList.add('slide-in');
            
            // Убираем slide-in через 10ms для запуска анимации
            setTimeout(() => {
                content.classList.remove('slide-in');
            }, 10);
            
        }, 400);
    }
    
    nextPractice() {
        const nextIndex = (this.currentPracticeIndex + 1) % this.practices.length;
        this.showPracticeSlide(nextIndex);
    }
    
    prevPractice() {
        const prevIndex = (this.currentPracticeIndex - 1 + this.practices.length) % this.practices.length;
        this.showPracticeSlide(prevIndex);
    }
    
    startPracticeAutoplay() {
        this.stopPracticeAutoplay();
        this.autoplayInterval = setInterval(() => this.nextPractice(), 15000);
    }
    
    stopPracticeAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    resetPracticeAutoplay() {
        this.stopPracticeAutoplay();
        this.startPracticeAutoplay();
    }
    
    /**
     * Инициализация свайпа для карточек практик
     */
    initPracticeSwipe(element) {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        
        // Минимальная дистанция для срабатывания свайпа (в пикселях)
        const minSwipeDistance = 50;
        
        element.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        element.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            // Определяем направление свайпа
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            // Проверяем что это горизонтальный свайп (а не вертикальный скролл)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
                if (diffX > 0) {
                    // Свайп влево - следующий слайд
                    this.nextPractice();
                    this.resetPracticeAutoplay();
                    utils.log('Swipe left - next slide');
                } else {
                    // Свайп вправо - предыдущий слайд
                    this.prevPractice();
                    this.resetPracticeAutoplay();
                    utils.log('Swipe right - prev slide');
                }
            }
        }, { passive: true });
    }
}

// Создаем единственный экземпляр
const swiperManager = new SwiperManager();

// Экспортируем
export default swiperManager;