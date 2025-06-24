/**
 * Argus Law Firm - Publication Page Script
 * PROFESSIONAL VERSION - NO PRELOADER, MATCHING NEW DESIGN
 */

// === GLOBAL STATE ===
let animationObserver = null;
let isPageVisible = true;

// === PAGE VISIBILITY HANDLING ===
document.addEventListener('visibilitychange', function() {
    isPageVisible = !document.hidden;
    
    if (isPageVisible && window.publicationPageInitialized) {
        // Refresh animations when page becomes visible
        setTimeout(() => {
            refreshAnimations();
        }, 100);
    }
});

// Initialize immediately when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializePublicationPage();
});

function initializePublicationPage() {
    if (window.publicationPageInitialized) return;
    window.publicationPageInitialized = true;

    console.log('📚 Publication page initialized with new design');

    try {
        // Initialize core functionality
        setupAnimationSystem();
        setupPublicationData();
        setupInteractiveElements();
        setupNavigationEnhancements();
        setupPerformanceOptimizations();
        setupAccessibilityFeatures();
        
        // Apply initial animations with delay
        setTimeout(() => {
            triggerInitialAnimations();
        }, 300);
        
        console.log('✅ Publication page fully initialized');
        
        // Add ready class to body
        document.body.classList.add('publication-ready');
        
    } catch (error) {
        console.error('❌ Error initializing publication page:', error);
    }
}

// === PUBLICATION DATA ===
const publications = [
    {
        id: 1,
        title: "Адвокаты АК «АРГУС» добились применения принципа Res Judicata арбитражным судом",
        date: "2019-04-12",
        content: `<p>При участии адвокатов АК АРГУС было отменено решение третейского суда (МКАС при ТПП РФ) о взыскании долга в размере более трехсот пятидесяти миллионов рублей. По результатам рассмотрения дела в Верховном Суде РФ аргументы наших адвокатов были признаны обоснованными, дело направлено на новое рассмотрение.</p>
        
        <p>Основанием для отмены судебных актов послужило то, что по рассмотренным судами спорным обстоятельствам уже было принято решение международного коммерческого арбитража. Адвокатам удалось доказать, что приведение в исполнение данного решения нарушило бы такие принципы публичного порядка РФ, как принцип законной силы судебного акта, в части его окончательности и неопровержимости (res judicata), принцип правовой определенности.</p>
        
        <p>При новом рассмотрении дела решение МКАС было отменено как противоречащее публичному порядку РФ, в выдаче исполнительного листа было отказано.</p>
        
        <p>Рассмотрение дела по спору об отмене решения третейского суда (МКАС при ТПП РФ) вызвало значительный интерес и у юристов, и у правовых изданий. В частности, публикации о ходе рассмотрения данного дела, в том числе с неоднозначными комментариями, появились в следующих изданиях: Pravo.ru, Zakon.ru, Газета.ru, Practical Law Arbitration, Журнал Arbitration.ru.</p>
        
        <p>Адвокаты АК АРГУС Попович А.А. и Шомесов Д.В. за участие в данном деле были награждены Почетными дипломами Адвокатской Палаты Санкт-Петербурга.</p>`
    },
    {
        id: 2,
        title: "Адвокаты АК «АРГУС» доказали необходимость применения тарифов «для населения» исходя из назначения помещения в деле о взыскании с юридического лица платы за поставленные теплоресурсы",  
        date: "2023-04-21",
        content: `<p>При участии адвокатов АК АРГУС (pro bono) был выигран спор, связанный с разногласиями сторон (теплоснабжающая организация и юридическое лицо, владеющее административно-бытовым зданием с общежитием) по варианту тарифа, подлежащего применению при расчете стоимости тепловой энергии для здания, не переведенного в муниципальную собственность при приватизации в 1994г.</p>
        
        <p>Верховный Суд РФ неоднократно разъяснял, что если спорные помещения являются жилыми и поставляемые ресурсы используются исключительно на коммунально-бытовые нужды, то при расчете стоимости коммунальных услуг следует применять тариф, установленный для населения.</p>
        
        <p>По результатам рассмотрения дела в апелляционной инстанции арбитражного суда (поддержано кассационной инстанцией) было отменено решение суда первой инстанции и вынесено новое решение в пользу юридического лица (взыскана задолженность, рассчитанная по тарифам «для населения»).</p>
        
        <p>Основанием для отмены судебного акта первой инстанции послужило то, что адвокатам удалось доказать необходимость применения тарифа с учетом фактического использования помещений (для проживания граждан в общежитии), принадлежащих юридическому лицу. Представленные доказательства проживания физических лиц позволили подтвердить, что назначение жилого помещения не меняется в случае, если такое жилое помещение находится в собственности у юридического лица.</p>
        
        <p>Апелляционный суд, соглашаясь с позицией адвокатов, указал в судебном акте, что иной подход ставит проживающих в жилых помещениях, принадлежащих юридическому лицу граждан и использующих жилые помещения для проживания в целях удовлетворения личных бытовых нужд и реализации конституционного права на жилище, в дискриминационное положение в сравнении с гражданами, проживающими в собственных жилых помещениях или жилых помещениях, принадлежащих на праве собственности публичным образованиям. Установление различных тарифов для одной группы недопустимо в силу того, что это ставит потребителей коммунальной услуги в неравное положение применительно к исполнению обязанности по оплате ресурсов, что не согласуется с общеправовыми принципами равенства и справедливости. Критерием отнесения потребителя к категории 'население' является использование ресурса в жилом помещении на коммунально-бытовые нужды.</p>`
    },
    {
        id: 3,
        title: "Скрыть реального владельца акционерного общества все сложнее - при участии адвокатов АК «АРГУС» суд субординировал требование аффилированного с должником кредитора",
        date: "2023-09-24",
        content: `<p>Компания обратилась в Арбитражный суд с заявлением о признании общества банкротом. Решением суда первой инстанции в отношении должника была введена процедура наблюдения. Однако Апелляционный суд не согласился с выводами суда первой инстанции в части установления очередности удовлетворения требований кредитора и назначения кандидатуры временного управляющего.</p>
        
        <p>Установив действительную корпоративную структуру владения акциями должника, наличие между должником и кредитором признаков аффилированности, осуществление Компанией компенсационного финансирования деятельности должника, апелляционный суд субординировал заявленное требование. Также апелляционный суд пришел к выводу, что арбитражный управляющий, кандидатура которого была предложена кредитором-заявителем, не отвечает требованиям законодательства о банкротстве и применил метод случайной выборки для выбора новой кандидатуры временного управляющего должником.</p>`
    },
    {
        id: 4,
        title: "Адвокатам АК «АРГУС» удалось отстоять административный иск к МИФНС по Санкт-Петербургу о признании безнадежной к взысканию задолженности по НДФЛ за 2017 год",
        date: "2024-10-10",
        content: `<p>Суд установил, что налоговый орган был не вправе включать задолженность налогоплательщика по уплате налога на доходы физических лиц за 2017 год в ЕНС (единый налоговый счет), а в дальнейшем, списывать произведенные налогоплательщиком оплаты и имеющиеся у него переплаты в счет погашения данной задолженности.</p>
        
        <p>Одновременно суд установил, что неверное определение налоговым органом сальдо ЕНС налогоплательщика повлекло принятие ошибочного решения МИФНС, последующие произведенные оплаты налогоплательщиком также повлекли за собой неверное распределение денежных средств, в то время как налогоплательщик своевременно и в полном объеме оплатил налоги за 2022 год и страховые взносы за 2023 год.</p>
        
        <p>Доводы административного ответчика были опровергнуты административным истцом. Так, позиция налоговой инспекции о праве выставить налоговое требование по недоимкам, срок принудительного взыскания по которым истек на 01.01.2023г. была отклонена судом как основанные на неверном толковании норм материального права.</p>
        
        <p>Требование об уплате задолженности, направленное после 1 января 2023г. может быть выставлено налоговым органом только в отношении тех недоимок, по которым до 31 декабря 2022 года направлялись требования о взыскании и не были предприняты меры взыскания, срок взыскания по которым не истек (в соответствии с действовавшими положениями ст.48 Налогового кодекса РФ – 6 месяцев либо 3 года 6 месяцев с даты истечения срока исполнения требования в зависимости от размера недоимки).</p>
        
        <p>Кроме того, суд также отразил в решении – допущение налоговым органом того, что повторное требование может быть выставлено налогоплательщику в отношении задолженности за любой налоговый период бессрочно, тем самым аннулируя сроки, установленные для принудительного взыскания задолженности, и лишая возможности налогоплательщика заявить о безнадежности взыскания тех недоимок, по которым до 1 января 2023 года истек срок их взыскания, приводило бы к нарушению общих задач налогового законодательства, а также п.7 ст.3 Налогового кодекса РФ, согласно которому все неустранимые сомнения, противоречия и неясности актов законодательства о налогах и сборах толкуются в пользу налогоплательщика.</p>`
    },
    {
        id: 5,
        title: "Адвокат АК «АРГУС» Попович Алина Анатольевна в соответствии с решением Совета Адвокатской палаты Санкт-Петербурга (протокол № 11 от 27.05.2025г.) награждена Почетным дипломом Адвокатской Палаты Санкт-Петербурга «За успехи, достигнутые адвокатом при осуществлении защиты по административным делам.»",
        date: "2025-06-11",
        content: `<p>Торжественная церемония, приуроченная ко Дню российской адвокатуры, состоялась 11.06.2025г. в штаб-квартире Адвокатской палаты Санкт-Петербурга. Несколько десятков адвокатов, чьи кейсы оценила Комиссия по награждениям, были признаны лучшим из лучших в двенадцати номинациях.</p>

        <p>Награды победителям вручил президент АП СПб Тенишев Вячеслав Шамильевич.</p>`
    },
];

// === ANIMATION SYSTEM ===
function setupAnimationSystem() {
    console.log('✨ Setting up animation system...');
    
    // Create intersection observer for scroll animations
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
                    
                    // Add special effects for different elements
                    if (element.classList.contains('filter-section')) {
                        createFilterRipple(element);
                    }
                    
                    if (element.classList.contains('publications-section')) {
                        createSectionGlow(element);
                    }
                    
                }, delay);
                
                // Stop observing once animated
                animationObserver.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
    
    console.log(`📊 Observing ${animatedElements.length} animated elements`);
}

// === PUBLICATION DATA SETUP ===
function setupPublicationData() {
    console.log('📚 Setting up publication data...');
    
    const publicationList = document.getElementById('publicationList');
    const searchInput = document.getElementById('searchInput');
    const yearFilter = document.getElementById('yearFilter');
    const noResults = document.getElementById('noResults');

    if (!publicationList || !searchInput || !yearFilter) {
        console.warn('Publication elements not found');
        return;
    }

    // Populate year filter
    populateYearFilter();
    
    // Render initial publications
    renderPublications(publications);

    // Event listeners
    searchInput.addEventListener('input', debounce(filterPublications, 300));
    yearFilter.addEventListener('change', filterPublications);

    // === ИСПРАВЛЕННАЯ ФУНКЦИЯ ЗАПОЛНЕНИЯ ФИЛЬТРА ПО ГОДАМ ===
    function populateYearFilter() {
        // ✅ ИСПРАВЛЕНИЕ: Сортируем годы в убывающем порядке (новые сначала)
        const years = [...new Set(publications.map(pub => 
            new Date(pub.date).getFullYear().toString()
        ))].sort((a, b) => b - a); // Убывающий порядок: 2025, 2024, 2023, 2019
        
        yearFilter.innerHTML = '<option value="">За все время</option>';
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
        
        console.log('✅ Годы отсортированы:', years); // Для отладки
    }

    // === ИСПРАВЛЕННАЯ ФУНКЦИЯ РЕНДЕРИНГА ПУБЛИКАЦИЙ ===
    function renderPublications(filteredPublications = publications) {
        publicationList.innerHTML = '';

        if (filteredPublications.length === 0) {
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';

        // ✅ ИСПРАВЛЕНИЕ: Сортируем публикации по дате (новые сначала)
        const sortedPublications = [...filteredPublications].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA; // Убывающий порядок (новые сначала)
        });

        // Теперь рендерим отсортированные публикации
        sortedPublications.forEach((pub, index) => {
            const pubDate = new Date(pub.date);
            const formattedDate = pubDate.toLocaleDateString('ru-RU', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });

            const pubElement = document.createElement('div');
            pubElement.className = 'publication-item';
            pubElement.innerHTML = `
                <div class="publication-header-content">
                    <div class="publication-info">
                        <h3 class="publication-title">${pub.title}</h3>
                        <div class="publication-date">${formattedDate}</div>
                    </div>
                    <button class="toggle-btn" aria-label="Развернуть/свернуть содержание">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                <div class="publication-content">
                    ${pub.content}
                </div>
            `;

            publicationList.appendChild(pubElement);

            // Add staggered animation
            setTimeout(() => {
                pubElement.style.opacity = '1';
                pubElement.style.transform = 'translateY(0)';
            }, index * 100);

            // Add click event to toggle content
            const header = pubElement.querySelector('.publication-header-content');
            const content = pubElement.querySelector('.publication-content');
            const toggleBtn = pubElement.querySelector('.toggle-btn');

            header.addEventListener('click', () => {
                content.classList.toggle('expanded');
                toggleBtn.classList.toggle('expanded');

                // Close other expanded publications
                if (content.classList.contains('expanded')) {
                    document.querySelectorAll('.publication-content').forEach(item => {
                        if (item !== content && item.classList.contains('expanded')) {
                            item.classList.remove('expanded');
                            item.parentElement.querySelector('.toggle-btn').classList.remove('expanded');
                        }
                    });
                }

                // Create click effect
                createPublicationClickEffect(pubElement);
            });

            // Add hover effects
            pubElement.addEventListener('mouseenter', function() {
                createPublicationHoverEffect(this);
            });
        });

        // Set initial styles for animation
        publicationList.querySelectorAll('.publication-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s ease';
        });
    }

    // === ИСПРАВЛЕННАЯ ФУНКЦИЯ ФИЛЬТРАЦИИ ===
    function filterPublications() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedYear = yearFilter.value;

        const filtered = publications.filter(pub => {
            const matchesSearch = pub.title.toLowerCase().includes(searchTerm) || 
                                  pub.content.toLowerCase().includes(searchTerm);

            const pubYear = new Date(pub.date).getFullYear().toString();
            const matchesYear = selectedYear === '' || pubYear === selectedYear;

            return matchesSearch && matchesYear;
        });

        // ✅ Рендерим уже отфильтрованные публикации (сортировка внутри renderPublications)
        renderPublications(filtered);

        // Add filter effect
        const filterCard = document.querySelector('.filter-card');
        createFilterEffect(filterCard);
    }
}

// === INTERACTIVE ELEMENTS ===
function setupInteractiveElements() {
    console.log('🎯 Setting up interactive elements...');
    
    // Enhanced hover effects for sections
    const sections = document.querySelectorAll('.filter-card, .publications-section');
    sections.forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.classList.add('section-hover');
            createSectionRipple(this);
        });
        
        section.addEventListener('mouseleave', function() {
            this.classList.remove('section-hover');
        });
    });
    
    // Enhanced input interactions
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            createInputFocusEffect(this);
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Section icon animations
    const sectionIcons = document.querySelectorAll('.filter-icon, .section-icon');
    sectionIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(360deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// === NAVIGATION ENHANCEMENTS ===
function setupNavigationEnhancements() {
    console.log('🧭 Setting up navigation enhancements...');
    
    const navButton = document.querySelector('.nav-button');
    if (navButton) {
        // Enhanced hover effect
        navButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        navButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Click effect
        navButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'translateY(-3px) scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = 'translateY(-3px) scale(1.05)';
                
                // Navigate after animation
                setTimeout(() => {
                    window.location.href = this.href;
                }, 150);
            }, 100);
        });
    }
}

// === PERFORMANCE OPTIMIZATIONS ===
function setupPerformanceOptimizations() {
    console.log('⚡ Setting up performance optimizations...');
    
    // Debounced scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            handleScroll();
        }, 16); // ~60fps
    });
    
    // Optimized resize handler
    let resizeTimeout;
    window.addEventListener('resize', function() {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        
        resizeTimeout = setTimeout(() => {
            handleResize();
        }, 250);
    });
    
    // Preload critical assets
    preloadCriticalAssets();
}

// === ACCESSIBILITY FEATURES ===
function setupAccessibilityFeatures() {
    console.log('♿ Setting up accessibility features...');
    
    // Enhanced focus management
    const focusableElements = document.querySelectorAll(
        'a, button, input, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('focused');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('focused');
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'Tab':
                // Ensure visible focus indicators
                document.body.classList.add('keyboard-navigation');
                break;
                
            case 'Enter':
            case ' ':
                // Handle toggle button activation
                if (e.target.classList.contains('toggle-btn')) {
                    e.preventDefault();
                    e.target.click();
                }
                break;
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Reduced motion support
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
        console.log('🔇 Reduced motion mode enabled');
    }
}

// === ANIMATION EFFECTS ===
function createFilterRipple(filterSection) {
    const ripple = document.createElement('div');
    ripple.className = 'filter-ripple';
    ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: filterRipple 1.5s ease-out forwards;
        pointer-events: none;
        z-index: 1;
    `;
    
    if (!document.querySelector('#filterRippleStyles')) {
        const style = document.createElement('style');
        style.id = 'filterRippleStyles';
        style.textContent = `
            @keyframes filterRipple {
                to {
                    width: 400px;
                    height: 400px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    filterSection.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple && ripple.parentNode) {
            ripple.remove();
        }
    }, 1500);
}

function createSectionGlow(section) {
    const glow = document.createElement('div');
    glow.className = 'section-glow';
    glow.style.cssText = `
        position: absolute;
        top: -5px;
        left: -5px;
        right: -5px;
        bottom: -5px;
        background: linear-gradient(45deg, rgba(212, 175, 55, 0.1), rgba(244, 208, 63, 0.1));
        border-radius: 20px;
        animation: sectionGlow 1s ease-out forwards;
        pointer-events: none;
        z-index: 0;
    `;
    
    if (!document.querySelector('#sectionGlowStyles')) {
        const style = document.createElement('style');
        style.id = 'sectionGlowStyles';
        style.textContent = `
            @keyframes sectionGlow {
                from {
                    opacity: 0;
                    transform: scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    section.appendChild(glow);
    
    setTimeout(() => {
        if (glow && glow.parentNode) {
            glow.remove();
        }
    }, 1000);
}

function createPublicationClickEffect(pubElement) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
        animation: clickEffect 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 1;
    `;
    
    if (!document.querySelector('#clickEffectStyles')) {
        const style = document.createElement('style');
        style.id = 'clickEffectStyles';
        style.textContent = `
            @keyframes clickEffect {
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
    
    pubElement.appendChild(effect);
    
    setTimeout(() => {
        if (effect && effect.parentNode) {
            effect.remove();
        }
    }, 600);
}

function createPublicationHoverEffect(pubElement) {
    const particles = 3;
    for (let i = 0; i < particles; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'hover-particle';
            particle.style.cssText = `
                position: absolute;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                width: 2px;
                height: 2px;
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
                            transform: translateY(-30px);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            pubElement.appendChild(particle);
            
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
        animation: sectionRipple 1.2s ease-out forwards;
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
    }, 1200);
}

function createInputFocusEffect(input) {
    const effect = document.createElement('div');
    effect.className = 'input-focus-effect';
    effect.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 2px solid rgba(212, 175, 55, 0.5);
        border-radius: 50px;
        animation: inputFocus 0.4s ease-out forwards;
        pointer-events: none;
        z-index: 1;
    `;
    
    if (!document.querySelector('#inputFocusStyles')) {
        const style = document.createElement('style');
        style.id = 'inputFocusStyles';
        style.textContent = `
            @keyframes inputFocus {
                from {
                    transform: scale(1.1);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    input.parentElement.appendChild(effect);
    
    setTimeout(() => {
        if (effect && effect.parentNode) {
            effect.remove();
        }
    }, 400);
}

function createFilterEffect(filterCard) {
    filterCard.style.transform = 'scale(1.02)';
    setTimeout(() => {
        filterCard.style.transform = 'scale(1)';
    }, 200);
}

// === EVENT HANDLERS ===
function handleScroll() {
    const scrollY = window.scrollY;
    
    // Parallax effect for background decorations
    const decorations = document.querySelectorAll('.decoration-circle, .floating-shape');
    decorations.forEach((decoration, index) => {
        const speed = 0.1 + (index * 0.05);
        const yPos = -(scrollY * speed);
        decoration.style.transform = `translateY(${yPos}px)`;
    });
}

function handleResize() {
    // Refresh animation observer if needed
    if (animationObserver) {
        const animatedElements = document.querySelectorAll('[data-animate]:not(.animate)');
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    }
}

function triggerInitialAnimations() {
    // Animate header elements
    const headerElements = document.querySelectorAll('.publication-header *');
    headerElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.animation = 'fadeInUp 0.8s ease-out forwards';
        }, index * 100);
    });
}

function refreshAnimations() {
    // Re-trigger animations for elements that might have lost their state
    const animatedElements = document.querySelectorAll('[data-animate].animate');
    animatedElements.forEach(element => {
        element.classList.remove('animate');
        setTimeout(() => {
            element.classList.add('animate');
        }, 50);
    });
}

function preloadCriticalAssets() {
    // Preload any critical images or assets
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

// === UTILITY FUNCTIONS ===
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

// === ERROR HANDLING ===
window.addEventListener('error', function(e) {
    console.error('Publication page error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection on publication page:', e.reason);
});

// === CLEANUP ===
window.addEventListener('beforeunload', function() {
    if (animationObserver) {
        animationObserver.disconnect();
    }
});

// === DEVELOPMENT HELPERS ===
if (window.location.search.includes('debug=true')) {
    window.publicationDebug = {
        reinitialize: function() {
            window.publicationPageInitialized = false;
            initializePublicationPage();
        },
        triggerAnimations: triggerInitialAnimations,
        refreshAnimations: refreshAnimations,
        getStatus: function() {
            return {
                initialized: window.publicationPageInitialized,
                observerActive: !!animationObserver,
                animatedElements: document.querySelectorAll('[data-animate].animate').length,
                publicationCount: publications.length
            };
        }
    };
    
    console.log('🔧 Publication page debug mode enabled');
    console.log('Available commands: publicationDebug.reinitialize(), publicationDebug.getStatus()');
}

// === EXPORT FOR TESTING ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializePublicationPage,
        setupAnimationSystem,
        setupPublicationData,
        publications
    };
}