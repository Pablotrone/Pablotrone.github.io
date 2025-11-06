/* ============================================
   PUBLICATION PAGE SCRIPT (MULTILANGUAGE)
   Функционал публикаций с полными переводами
   ============================================ */

import CONFIG, { utils } from './config.js';
import i18n from './i18n.js';

/**
 * Данные публикаций на разных языках
 */
const publicationsData = {
    ru: [
        {
            id: 1,
            title: "Адвокат АК «Аргус» Попович Алина Анатольевна награждена Почетным дипломом",
            date: "2025-06-11",
            category: "achievements",
            excerpt: "Адвокат АК «Аргус» Попович Алина Анатольевна в соответствии с решением Совета Адвокатской палаты Санкт-Петербурга награждена Почетным дипломом «За успехи, достигнутые адвокатом при осуществлении защиты по административным делам».",
            content: `<p>Адвокат АК «Аргус» Попович Алина Анатольевна в соответствии с решением Совета Адвокатской палаты Санкт-Петербурга (протокол № 11 от 27.05.2025г.) награждена Почетным дипломом Адвокатской Палаты Санкт-Петербурга «За успехи, достигнутые адвокатом при осуществлении защиты по административным делам».</p>
            
            <p>Торжественная церемония, приуроченная ко Дню российской адвокатуры, состоялась 11.06.2025г. в штаб-квартире Адвокатской палаты Санкт-Петербурга. Несколько десятков адвокатов, чьи кейсы оценила Комиссия по награждениям, были признаны лучшим из лучших в двенадцати номинациях.</p>
            
            <p>Награды победителям вручил президент АП СПб Тенишев Вячеслав Шамильевич.</p>`
        },
        {
            id: 2,
            title: "Адвокатам АК «Аргус» удалось отстоять административный иск к МИФНС по Санкт-Петербургу",
            date: "2024-10-10",
            category: "practice",
            excerpt: "Адвокатам АК «Аргус» удалось отстоять административный иск к МИФНС по Санкт-Петербургу о признании безнадежной к взысканию задолженности по НДФЛ за 2017 год...",
            content: `<p>Адвокатам АК «Аргус» удалось отстоять административный иск к МИФНС по Санкт-Петербургу о признании безнадежной к взысканию задолженности по НДФЛ за 2017 год, а также начисленных пеней, и, соответственно, признании незаконным и не подлежащим исполнению решение МИФНС о взыскании задолженности за счет денежных средств на счетах.</p>
            
            <p>Суд установил, что налоговый орган был не вправе включать задолженность налогоплательщика по уплате налога на доходы физических лиц за 2017 год в ЕНС (единый налоговый счет), а в дальнейшем, списывать произведенные налогоплательщиком оплаты и имеющиеся у него переплаты в счет погашения данной задолженности.</p>
            
            <p>Одновременно суд установил, что неверное определение налоговым органом сальдо ЕНС налогоплательщика повлекло принятие ошибочного решения МИФНС, последующие произведенные оплаты налогоплательщиком также повлекли за собой неверное распределение денежных средств, в то время как налогоплательщик своевременно и в полном объеме оплатил налоги за 2022 год и страховые взносы за 2023 год.</p>`
        },
        {
            id: 3,
            title: "Скрыть реального владельца акционерного общества все сложнее - суд субординировал требование аффилированного кредитора",
            date: "2023-09-24",
            category: "practice",
            excerpt: "Компания обратилась в Арбитражный суд с заявлением о признании общества банкротом. Апелляционный суд субординировал заявленное требование аффилированного кредитора...",
            content: `<p>Компания обратилась в Арбитражный суд с заявлением о признании общества банкротом. Решением суда первой инстанции в отношении должника была введена процедура наблюдения.</p>
            
            <p>Однако Апелляционный суд не согласился с выводами суда первой инстанции в части установления очередности удовлетворения требований кредитора и назначения кандидатуры временного управляющего.</p>
            
            <p>Установив действительную корпоративную структуру владения акциями должника, наличие между должником и кредитором признаков аффилированности, осуществление Компанией компенсационного финансирования деятельности должника, апелляционный суд субординировал заявленное требование.</p>`
        },
        {
            id: 4,
            title: "Адвокаты АК «Аргус» доказали необходимость применения тарифов «для населения»",
            date: "2023-04-21",
            category: "practice",
            excerpt: "При участии адвокатов АК АРГУС (pro bono) был выигран спор по применению тарифов для населения исходя из фактического назначения помещений...",
            content: `<p>При участии адвокатов АК АРГУС (pro bono) был выигран спор, связанный с разногласиями сторон по варианту тарифа, подлежащего применению при расчете стоимости тепловой энергии для здания с общежитием.</p>
            
            <p>Верховный Суд РФ неоднократно разъяснял, что если спорные помещения являются жилыми и поставляемые ресурсы используются исключительно на коммунально-бытовые нужды, то при расчете стоимости коммунальных услуг следует применять тариф, установленный для населения.</p>
            
            <p>Адвокатам удалось доказать необходимость применения тарифа с учетом фактического использования помещений для проживания граждан в общежитии, принадлежащих юридическому лицу.</p>`
        },
        {
            id: 5,
            title: "Адвокаты АК «Аргус» добились применения принципа Res Judicata арбитражным судом",
            date: "2019-04-12",
            category: "achievements",
            excerpt: "При участии адвокатов АК АРГУС было отменено решение третейского суда о взыскании долга в размере более 350 миллионов рублей...",
            content: `<p>При участии адвокатов АК АРГУС было отменено решение третейского суда (МКАС при ТПП РФ) о взыскании долга в размере более трехсот пятидесяти миллионов рублей. По результатам рассмотрения дела в Верховном Суде РФ аргументы наших адвокатов были признаны обоснованными, дело направлено на новое рассмотрение.</p>
            
            <p>Основанием для отмены судебных актов послужило то, что по рассмотренным судами спорным обстоятельствам уже было принято решение международного коммерческого арбитража. Адвокатам удалось доказать, что приведение в исполнение данного решения нарушило бы принцип законной силы судебного акта (res judicata).</p>
            
            <p>Адвокаты АК АРГУС за участие в данном деле были награждены Почетными дипломами Адвокатской Палаты Санкт-Петербурга.</p>`
        }
    ],
    en: [
        {
            id: 1,
            title: "Argus Law Firm Attorney Alina Popovich Awarded Honorary Diploma",
            date: "2025-06-11",
            category: "achievements",
            excerpt: "Attorney Alina Popovich of Argus Law Firm was awarded an Honorary Diploma by the St. Petersburg Bar Association for achievements in administrative case defense.",
            content: `<p>Attorney Alina Anatolyevna Popovich of Argus Law Firm, in accordance with the decision of the Council of the St. Petersburg Bar Association (Protocol No. 11 dated May 27, 2025), was awarded an Honorary Diploma "For achievements in administrative case defense."</p>
            
            <p>The ceremonial event, timed to coincide with Russian Attorney Day, took place on June 11, 2025 at the headquarters of the St. Petersburg Bar Association. Dozens of attorneys whose cases were evaluated by the Awards Commission were recognized as the best of the best in twelve nominations.</p>
            
            <p>Awards were presented to the winners by the President of the St. Petersburg Bar Association, Vyacheslav Tenishev.</p>`
        },
        {
            id: 2,
            title: "Argus Attorneys Successfully Defended Administrative Claim Against St. Petersburg Tax Authority",
            date: "2024-10-10",
            category: "practice",
            excerpt: "Argus attorneys successfully defended an administrative claim regarding the recognition of 2017 personal income tax debt as uncollectible...",
            content: `<p>Argus attorneys successfully defended an administrative claim against the St. Petersburg Tax Authority regarding the recognition of 2017 personal income tax debt and penalties as uncollectible, and the recognition of the tax authority's decision to collect the debt from bank accounts as unlawful.</p>
            
            <p>The court established that the tax authority was not entitled to include the taxpayer's 2017 personal income tax debt in the Unified Tax Account, and subsequently write off the taxpayer's payments and overpayments to cover this debt.</p>
            
            <p>The court also found that the tax authority's incorrect determination of the taxpayer's Unified Tax Account balance led to an erroneous decision, while the taxpayer had timely and fully paid 2022 taxes and 2023 insurance contributions.</p>`
        },
        {
            id: 3,
            title: "Concealing Real Owners Becomes Harder - Court Subordinates Affiliated Creditor's Claim",
            date: "2023-09-24",
            category: "practice",
            excerpt: "A company filed a bankruptcy petition with the Arbitration Court. The Court of Appeal subordinated the claim of a creditor affiliated with the debtor...",
            content: `<p>A company filed a bankruptcy petition with the Arbitration Court. The court of first instance initiated observation proceedings against the debtor.</p>
            
            <p>However, the Court of Appeal disagreed with the first instance court's conclusions regarding the priority of the creditor's claims and the appointment of the interim manager.</p>
            
            <p>Having established the actual corporate structure of share ownership, signs of affiliation between the debtor and creditor, and the Company's compensatory financing of the debtor's activities, the Court of Appeal subordinated the claim.</p>`
        },
        {
            id: 4,
            title: "Argus Attorneys Proved Necessity of Applying Residential Tariffs Based on Actual Use",
            date: "2023-04-21",
            category: "practice",
            excerpt: "With the participation of Argus attorneys (pro bono), a dispute was won regarding the application of residential tariffs based on actual premises usage...",
            content: `<p>With the participation of Argus attorneys (pro bono), a dispute was won regarding tariff application for calculating the cost of thermal energy for a building with dormitory facilities.</p>
            
            <p>The Supreme Court of the Russian Federation repeatedly clarified that if disputed premises are residential and supplied resources are used exclusively for communal and household needs, then residential tariffs should be applied.</p>
            
            <p>The attorneys successfully proved the necessity of applying tariffs based on the actual use of premises for citizens' residence in the dormitory owned by a legal entity.</p>`
        },
        {
            id: 5,
            title: "Argus Attorneys Achieved Application of Res Judicata Principle by Arbitration Court",
            date: "2019-04-12",
            category: "achievements",
            excerpt: "With the participation of Argus attorneys, an arbitral tribunal's decision to collect a debt exceeding 350 million rubles was overturned...",
            content: `<p>With the participation of Argus attorneys, an arbitral tribunal's (ICAC at the RF CCI) decision to collect a debt exceeding three hundred fifty million rubles was overturned. Following the Supreme Court's review, our attorneys' arguments were recognized as justified, and the case was sent for new consideration.</p>
            
            <p>The basis for overturning judicial acts was that the disputed circumstances had already been decided by international commercial arbitration. The attorneys proved that enforcement of this decision would violate the principle of legal force of judicial acts (res judicata).</p>
            
            <p>Argus attorneys were awarded Honorary Diplomas by the St. Petersburg Bar Association for their participation in this case.</p>`
        }
    ],
    fr: [
        {
            id: 1,
            title: "L'avocate Alina Popovich du Cabinet Argus reçoit un diplôme honorifique",
            date: "2025-06-11",
            category: "achievements",
            excerpt: "L'avocate Alina Popovich du Cabinet Argus a reçu un diplôme honorifique du Barreau de Saint-Pétersbourg pour ses réalisations dans la défense des affaires administratives.",
            content: `<p>L'avocate Alina Anatolyevna Popovich du Cabinet Argus, conformément à la décision du Conseil du Barreau de Saint-Pétersbourg (protocole n° 11 du 27.05.2025), a reçu un diplôme honorifique "Pour les réalisations dans la défense des affaires administratives".</p>
            
            <p>La cérémonie solennelle, organisée à l'occasion de la Journée des avocats russes, a eu lieu le 11.06.2025 au siège du Barreau de Saint-Pétersbourg. Des dizaines d'avocats dont les dossiers ont été évalués par la Commission des récompenses ont été reconnus comme les meilleurs parmi les meilleurs dans douze nominations.</p>
            
            <p>Les récompenses ont été remises aux gagnants par le président du Barreau de Saint-Pétersbourg, Viatcheslav Tenichev.</p>`
        },
        {
            id: 2,
            title: "Les avocats d'Argus ont défendu avec succès une action administrative contre l'administration fiscale",
            date: "2024-10-10",
            category: "practice",
            excerpt: "Les avocats d'Argus ont défendu avec succès une action administrative concernant la reconnaissance de la dette d'impôt sur le revenu de 2017 comme irrécouvrable...",
            content: `<p>Les avocats d'Argus ont défendu avec succès une action administrative contre l'administration fiscale de Saint-Pétersbourg concernant la reconnaissance de la dette d'impôt sur le revenu de 2017 et des pénalités comme irrécouvrables.</p>
            
            <p>Le tribunal a établi que l'administration fiscale n'était pas en droit d'inclure la dette d'impôt sur le revenu du contribuable de 2017 dans le Compte Fiscal Unifié, ni de radier les paiements effectués par le contribuable pour couvrir cette dette.</p>
            
            <p>Le tribunal a également constaté que la détermination incorrecte du solde du Compte Fiscal Unifié par l'administration fiscale a conduit à une décision erronée, alors que le contribuable avait payé en temps voulu et intégralement les impôts de 2022 et les cotisations d'assurance de 2023.</p>`
        },
        {
            id: 3,
            title: "Dissimuler les propriétaires réels devient plus difficile - le tribunal subordonne la créance du créancier affilié",
            date: "2023-09-24",
            category: "practice",
            excerpt: "Une société a déposé une demande de faillite auprès du tribunal d'arbitrage. La cour d'appel a subordonné la créance du créancier affilié au débiteur...",
            content: `<p>Une société a déposé une demande de faillite auprès du tribunal d'arbitrage. Le tribunal de première instance a ouvert une procédure d'observation à l'égard du débiteur.</p>
            
            <p>Cependant, la cour d'appel n'était pas d'accord avec les conclusions du tribunal de première instance concernant la priorité des créances et la nomination du gestionnaire provisoire.</p>
            
            <p>Ayant établi la structure réelle de détention des actions, les signes d'affiliation entre le débiteur et le créancier, et le financement compensatoire des activités du débiteur par la société, la cour d'appel a subordonné la créance.</p>`
        },
        {
            id: 4,
            title: "Les avocats d'Argus ont prouvé la nécessité d'appliquer les tarifs résidentiels",
            date: "2023-04-21",
            category: "practice",
            excerpt: "Avec la participation des avocats d'Argus (pro bono), un litige a été gagné concernant l'application des tarifs résidentiels basés sur l'utilisation réelle des locaux...",
            content: `<p>Avec la participation des avocats d'Argus (pro bono), un litige a été gagné concernant l'application des tarifs pour le calcul du coût de l'énergie thermique pour un bâtiment avec dortoir.</p>
            
            <p>La Cour suprême de la Fédération de Russie a précisé à plusieurs reprises que si les locaux litigieux sont résidentiels et que les ressources fournies sont utilisées exclusivement pour les besoins communaux et domestiques, les tarifs résidentiels doivent être appliqués.</p>
            
            <p>Les avocats ont réussi à prouver la nécessité d'appliquer les tarifs en fonction de l'utilisation réelle des locaux pour la résidence des citoyens dans le dortoir appartenant à une personne morale.</p>`
        },
        {
            id: 5,
            title: "Les avocats d'Argus ont obtenu l'application du principe Res Judicata par le tribunal d'arbitrage",
            date: "2019-04-12",
            category: "achievements",
            excerpt: "Avec la participation des avocats d'Argus, une décision du tribunal arbitral de recouvrer une dette dépassant 350 millions de roubles a été annulée...",
            content: `<p>Avec la participation des avocats d'Argus, une décision du tribunal arbitral (CACI à la CCI de RF) de recouvrer une dette dépassant trois cent cinquante millions de roubles a été annulée. Suite à l'examen par la Cour suprême, les arguments de nos avocats ont été reconnus comme justifiés.</p>
            
            <p>Le motif d'annulation des actes judiciaires était que les circonstances litigieuses avaient déjà fait l'objet d'une décision d'arbitrage commercial international. Les avocats ont prouvé que l'exécution de cette décision violerait le principe de force juridique des actes judiciaires (res judicata).</p>
            
            <p>Les avocats d'Argus ont reçu des diplômes honorifiques du Barreau de Saint-Pétersbourg pour leur participation à cette affaire.</p>`
        }
    ]
};

/**
 * Класс для управления страницей публикаций
 */
class PublicationPage {
    constructor() {
        this.publicationsData = publicationsData;
        this.publications = [];
        this.filteredPublications = [];
        this.isInitialized = false;
        this.modal = null;
        this.currentLang = 'ru';
    }
    
    /**
     * Инициализация
     */
    async init() {
        if (this.isInitialized) {
            utils.log('Publication page уже инициализирован');
            return;
        }
        
        utils.log('Инициализация publication page...');
        
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
            
            // Получаем текущий язык
            this.currentLang = i18n.getCurrentLanguage();
            
            // Загружаем публикации на текущем языке
            this.loadPublications();
            
            // Инициализируем компоненты
            this.initModal();
            this.initFilters();
            this.populateYearFilter();
            this.renderPublications();
            
            // Слушаем смену языка
            this.listenLanguageChange();
            
            this.isInitialized = true;
            utils.log('Publication page инициализирован');
            
        } catch (error) {
            utils.error('Ошибка при инициализации publication page:', error);
        }
    }
    
    /**
     * Загрузить публикации на текущем языке
     */
    loadPublications() {
        this.publications = this.publicationsData[this.currentLang] || this.publicationsData.ru;
        this.filteredPublications = this.publications;
        utils.log(`Загружены публикации на языке: ${this.currentLang}`);
    }
    
    /**
     * Слушать смену языка
     */
    listenLanguageChange() {
        // Проверяем изменение языка каждую секунду
        setInterval(() => {
            const newLang = i18n.getCurrentLanguage();
            if (newLang !== this.currentLang) {
                this.currentLang = newLang;
                this.loadPublications();
                this.populateYearFilter();
                this.filterPublications();
                utils.log(`Язык изменен на: ${this.currentLang}`);
            }
        }, 1000);
    }
    
    /**
     * Инициализация модального окна
     */
    initModal() {
        this.modal = document.getElementById('publicationModal');
        const closeBtn = document.getElementById('modalClose');
        const overlay = this.modal?.querySelector('.modal-overlay');
        
        if (!this.modal) return;
        
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
     * Инициализация фильтров
     */
    initFilters() {
        const searchInput = document.getElementById('searchInput');
        const yearFilter = document.getElementById('yearFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterPublications());
        }
        
        if (yearFilter) {
            yearFilter.addEventListener('change', () => this.filterPublications());
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterPublications());
        }
        
        utils.log('Фильтры инициализированы');
    }
    
    /**
     * Заполнить фильтр по годам
     */
    populateYearFilter() {
        const yearFilter = document.getElementById('yearFilter');
        if (!yearFilter) return;
        
        // Сохраняем текущее значение
        const currentValue = yearFilter.value;
        
        // Очищаем все опции кроме первой
        while (yearFilter.options.length > 1) {
            yearFilter.remove(1);
        }
        
        // Получаем уникальные годы из публикаций
        const years = [...new Set(this.publications.map(p => {
            return new Date(p.date).getFullYear();
        }))].sort((a, b) => b - a);
        
        // Добавляем опции
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
        
        // Восстанавливаем значение
        yearFilter.value = currentValue;
    }
    
    /**
     * Фильтрация публикаций
     */
    filterPublications() {
        const searchInput = document.getElementById('searchInput');
        const yearFilter = document.getElementById('yearFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const selectedYear = yearFilter?.value || '';
        const selectedCategory = categoryFilter?.value || '';
        
        this.filteredPublications = this.publications.filter(pub => {
            const matchesSearch = !searchTerm || 
                pub.title.toLowerCase().includes(searchTerm) ||
                pub.excerpt.toLowerCase().includes(searchTerm) ||
                pub.content.toLowerCase().includes(searchTerm);
            
            const matchesYear = !selectedYear || 
                new Date(pub.date).getFullYear().toString() === selectedYear;
            
            const matchesCategory = !selectedCategory || 
                pub.category === selectedCategory;
            
            return matchesSearch && matchesYear && matchesCategory;
        });
        
        this.renderPublications();
    }
    
    /**
     * Рендер публикаций
     */
    renderPublications() {
        const container = document.getElementById('publicationList');
        const noResults = document.getElementById('noResults');
        
        if (!container || !noResults) return;
        
        // Очищаем контейнер
        container.innerHTML = '';
        
        // Если нет результатов
        if (this.filteredPublications.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        
        // Сортируем по дате (от новых к старым)
        const sorted = [...this.filteredPublications].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        // Рендерим карточки
        sorted.forEach(pub => {
            const card = this.createPublicationCard(pub);
            container.appendChild(card);
        });
    }
    
    /**
     * Создать карточку публикации
     */
    createPublicationCard(pub) {
        const card = document.createElement('div');
        card.className = 'publication-card';
        card.addEventListener('click', () => this.openModal(pub));
        
        const date = new Date(pub.date).toLocaleDateString(this.currentLang === 'ru' ? 'ru-RU' : this.currentLang === 'fr' ? 'fr-FR' : 'en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        // Категория на разных языках
        const categoryNames = {
            ru: {
                'achievements': 'Достижения',
                'reviews': 'Обзоры',
                'practice': 'Практика'
            },
            en: {
                'achievements': 'Achievements',
                'reviews': 'Reviews',
                'practice': 'Practice'
            },
            fr: {
                'achievements': 'Réalisations',
                'reviews': 'Revues',
                'practice': 'Pratique'
            }
        };
        
        const categoryName = categoryNames[this.currentLang][pub.category] || pub.category;
        
        // Текст "Читать далее" на разных языках
        const readMoreText = {
            ru: 'Читать далее',
            en: 'Read more',
            fr: 'Lire la suite'
        };
        
        card.innerHTML = `
            <div class="publication-meta">
                <span class="publication-date">${date}</span>
                <span class="publication-category">${categoryName}</span>
            </div>
            <h3 class="publication-title">${pub.title}</h3>
            <p class="publication-excerpt">${pub.excerpt}</p>
            <div class="publication-read-more">
                ${readMoreText[this.currentLang]}
                <i class="fas fa-arrow-right"></i>
            </div>
        `;
        
        return card;
    }
    
    /**
     * Открыть модалку
     */
    openModal(pub) {
        if (!this.modal) return;
        
        const modalTitle = document.getElementById('modalTitle');
        const modalDate = document.getElementById('modalDate');
        const modalContent = document.getElementById('modalContent');
        
        if (modalTitle) modalTitle.textContent = pub.title;
        
        if (modalDate) {
            const date = new Date(pub.date).toLocaleDateString(this.currentLang === 'ru' ? 'ru-RU' : this.currentLang === 'fr' ? 'fr-FR' : 'en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            modalDate.textContent = date;
        }
        
        if (modalContent) modalContent.innerHTML = pub.content;
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        utils.log('Модалка открыта:', pub.title);
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
}

// Создаем и запускаем
const publicationPage = new PublicationPage();
publicationPage.init();

// Экспортируем для доступа из консоли
window.PublicationPage = publicationPage;