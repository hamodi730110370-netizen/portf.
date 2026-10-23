/**
 * Centralized Data Store for Ahmed Ali Zaid Portfolio & Control Panel
 * Provides single-source-of-truth, localStorage persistence, import/export, and default resets.
 */

const STORAGE_KEY = 'ahmed_ali_zaid_portfolio_data';
const PIN_KEY = 'ahmed_ali_zaid_admin_pin';
const SESSION_AUTH_KEY = 'ahmed_ali_zaid_admin_auth';

const DEFAULT_PORTFOLIO_DATA = {
    profile: {
        name_ar: "أحمد علي زيد",
        name_en: "Ahmed Ali Zaid",
        brand_sub_ar: "مدرب ذكاء اصطناعي ومدير متجر",
        brand_sub_en: "AI Trainer & Store Manager",
        badge_ar: "مرحباً بك في المنصة الشخصية",
        badge_en: "Welcome to my personal portfolio",
        greeting_ar: "أنا",
        greeting_en: "I am",
        hero_desc_ar: "أجمع بين شغف قيادة المتاجر الإلكترونية وتطويرها، ونقل أحدث مهارات وأدوات الذكاء الاصطناعي للمحترفين، إلى جانب الإشراف الأكاديمي والتقني كرئيس لقسم الحاسوب لصناعة أثر حقيقي ومستدام.",
        hero_desc_en: "Combining the passion of directing and scaling e-commerce brands, training future-ready professionals in Generative AI tools, and driving academic excellence as Head of Computer Science Department.",
        typewriter_ar: [
            "أحمد علي زيد",
            "مدرب ذكاء اصطناعي",
            "مدير متجر نون آرت",
            "رئيس قسم الحاسوب"
        ],
        typewriter_en: [
            "Ahmed Ali Zaid",
            "AI Trainer & Consultant",
            "Noun Art Store Manager",
            "Head of Computer Science Dept."
        ],
        hero_stats: [
            { id: "hs_1", icon: "fa-solid fa-brain", title_ar: "تمكين وتدريب", title_en: "AI Enablement", desc_ar: "أدوات الذكاء الاصطناعي", desc_en: "Training & Consulting" },
            { id: "hs_2", icon: "fa-solid fa-store", title_ar: "إدارة وتطوير", title_en: "Store Management", desc_ar: "متجر نون آرت", desc_en: "Noun Art Store" },
            { id: "hs_3", icon: "fa-solid fa-laptop-code", title_ar: "قيادة تقنية", title_en: "Tech Leadership", desc_ar: "رئاسة قسم الحاسوب", desc_en: "Head of CS Dept." }
        ]
    },
    about: {
        tag_ar: "تعرف علي",
        tag_en: "Discover My Journey",
        title_ar: "نبذة عني",
        title_en: "About Me",
        heading_ar: "الرؤية والخبرة",
        heading_en: "Vision & Leadership",
        p1_ar: "مرحباً بكم. أنا <strong>أحمد علي زيد</strong>، أعمل في تقاطع استراتيجي يجمع بين ريادة الأعمال الرقمية من خلال <strong>إدارة متجر نون آرت</strong>، والتعليم التكنولوجي المتقدم عبر <strong>رئاسة قسم الحاسوب</strong>، وتمكين الكفاءات كـ <strong>مدرب معتمد في الذكاء الاصطناعي</strong>.",
        p1_en: "Welcome! I am <strong>Ahmed Ali Zaid</strong>, operating at the vital intersection of digital commerce as <strong>Manager of Noun Art Store</strong>, modern tech education as <strong>Head of the Computer Science Department</strong>, and capacity building as a <strong>Certified AI Trainer & Consultant</strong>.",
        p2_ar: "أؤمن بأن دمج أدوات الذكاء الاصطناعي والحلول الرقمية مع الإدارة الاحترافية يخلق فرص نمو استثنائية للمشاريع والمؤسسات والطلاب على حدٍ سواء.",
        p2_en: "I believe that harnessing artificial intelligence tools and automated workflows creates exponential value for business ventures, academic institutions, and learners.",
        checklist: [
            { id: "ck_1", text_ar: "إدارة شاملة للمنتجات والمبيعات وتجربة عملاء متجر نون آرت", text_en: "End-to-end catalog, operations, and CX management for Noun Art Store" },
            { id: "ck_2", text_ar: "تصميم وتنفيذ حقائب تدريبية في تطبيقات وأدوات الـ AI الحديثة", text_en: "Designing cutting-edge training workshops on Generative AI & Automation" },
            { id: "ck_3", text_ar: "إشراف وتطوير المناهج والبرامج التقنية لرئاسة قسم الحاسوب", text_en: "Overseeing computer science curriculum and advanced tech lab initiatives" }
        ],
        counters: [
            { id: "cnt_1", number: 5, suffix: "+", label_ar: "سنوات من الخبرة العملية", label_en: "Years of Practical Experience" },
            { id: "cnt_2", number: 1500, suffix: "+", label_ar: "متدرب ومستفيد في الذكاء الاصطناعي", label_en: "Trained Students & Professionals in AI" },
            { id: "cnt_3", number: 100, suffix: "%", label_ar: "التزام بجودة الهوية والإنجاز", label_en: "Commitment to Brand Identity & Quality" },
            { id: "cnt_4", number: 30, suffix: "+", label_ar: "مشروع ومبادرة تقنية منجزة", label_en: "Delivered Tech Initiatives & Projects" }
        ]
    },
    services: [
        {
            id: "serv_1",
            icon: "fa-solid fa-robot",
            isFeatured: true,
            title_ar: "تدريب واستشارات الذكاء الاصطناعي",
            title_en: "AI Training & Consulting",
            desc_ar: "تقديم برامج تدريبية تخصصية وورش عمل عملية حول أدوات الذكاء الاصطناعي التوليدي، هندسة الأوامر (Prompt Engineering)، وأتمتة المهام اليومية.",
            desc_en: "Specialized, hands-on training programs in generative AI models, LLMs, prompt engineering, and automated business workflows.",
            points_ar: [
                "تدريب المؤسسات والأفراد على أدوات LLMs",
                "دمج الذكاء الاصطناعي لرفع الإنتاجية وصناعة المحتوى",
                "استشارات التحول نحو الحلول الذكية"
            ],
            points_en: [
                "Upskilling corporate teams & individuals in AI tools",
                "Integrating AI for content creation and operational efficiency",
                "Strategic roadmap for intelligent digital transformation"
            ]
        },
        {
            id: "serv_2",
            icon: "fa-solid fa-shop",
            isFeatured: false,
            title_ar: "إدارة متجر نون آرت",
            title_en: "Noun Art Store Management",
            desc_ar: "الإشراف الكامل على استراتيجيات المتجر، إدارة سلاسل الإمداد، تجربة المستخدم للعملاء، وتوسيع الحصة السوقية وفق أعلى المعايير.",
            desc_en: "Comprehensive oversight of digital retail strategies, catalog optimization, supply chain efficiency, and customer experience excellence.",
            points_ar: [
                "تحسين قمع المبيعات ومعدلات التحويل",
                "بناء هوية بصرية وتجربة تسوق متكاملة",
                "خدمة العملاء وبناء ولاء العلامة التجارية"
            ],
            points_en: [
                "Sales funnel optimization & conversion rate growth",
                "Distinctive brand identity & unified shopping experience",
                "Customer success & loyalty retention programs"
            ]
        },
        {
            id: "serv_3",
            icon: "fa-solid fa-network-wired",
            isFeatured: false,
            title_ar: "رئاسة قسم الحاسوب",
            title_en: "Head of Computer Science",
            desc_ar: "إدارة وتطوير البرامج والمختبرات التقنية، وتوجيه الكوادر الأكاديمية والطلاب لتبني أحدث تقنيات علوم الحاسب والبرمجيات.",
            desc_en: "Directing tech curriculums, modernizing lab infrastructures, and mentoring faculty and students in computer science fundamentals.",
            points_ar: [
                "تحديث المناهج ومواكبة متطلبات سوق العمل",
                "إدارة المشاريع والمختبرات التقنية",
                "تأهيل الكفاءات في الأمن السيبراني والبرمجة"
            ],
            points_en: [
                "Aligning computer science syllabus with market demands",
                "Managing software labs & technical innovation hubs",
                "Empowering talent in programming, cloud, and security"
            ]
        }
    ],
    skills_cloud: [
        "Generative AI",
        "Prompt Engineering",
        "Large Language Models",
        "AI Automation",
        "E-Commerce Management",
        "Computer Science Curriculum",
        "Team Leadership",
        "Digital Branding",
        "Automation Workflows",
        "Data Analytics",
        "Strategic Planning"
    ],
    categories: [
        { key: "all", label_ar: "الكل", label_en: "All" },
        { key: "ai", label_ar: "الذكاء الاصطناعي", label_en: "Artificial Intelligence" },
        { key: "ecommerce", label_ar: "متجر نون آرت", label_en: "Noun Art Store" },
        { key: "cs", label_ar: "قسم الحاسوب", label_en: "Computer Science" }
    ],
    portfolio: [
        {
            id: "proj_1",
            category: "ai",
            icon: "fa-solid fa-microchip",
            title_ar: "برنامج تدريب أدوات الذكاء الاصطناعي",
            title_en: "Applied AI Workforce Training Program",
            desc_ar: "سلسلة ورش عمل تفاعلية لتأهيل مئات المستفيدين على تطبيقات نماذج اللغات وتوليد الوسائط والأتمتة السريعة.",
            desc_en: "Interactive bootcamp curriculum training hundreds of professionals on generative text, vision models, and prompt workflows.",
            tags: ["Generative AI", "ورش عمل", "أتمتة الأعمال"],
            link: "#"
        },
        {
            id: "proj_2",
            category: "ecommerce",
            icon: "fa-solid fa-bag-shopping",
            title_ar: "إطلاق وتوسيع متجر نون آرت",
            title_en: "Launching & Scaling Noun Art Store",
            desc_ar: "بناء الهوية البصرية، هندسة تجربة المستخدم والكتالوج، وتطبيق استراتيجيات التسويق والأتمتة لرفع المبيعات.",
            desc_en: "Crafted brand identity, catalog user experience, and automated inventory systems that scaled regional retail sales.",
            tags: ["إدارة المتاجر", "تجربة العميل", "Branding"],
            link: "#"
        },
        {
            id: "proj_3",
            category: "cs",
            icon: "fa-solid fa-graduation-cap",
            title_ar: "تطوير المنظومة التعليمية والمعامل",
            title_en: "Modernizing Computer Science Labs",
            desc_ar: "إعادة هيكلة وتحديث معامل الحاسوب وربط الطلاب بالمعايير العالمية في الحوسبة السحابية وهندسة البرمجيات.",
            desc_en: "Restructuring institutional IT labs and guiding student projects aligned with cloud and software engineering standards.",
            tags: ["إدارة أكاديمية", "معامل برمجية", "مناهج حاسوب"],
            link: "#"
        },
        {
            id: "proj_4",
            category: "ai",
            icon: "fa-solid fa-bolt",
            title_ar: "حلول أتمتة المتاجر بالذكاء الاصطناعي",
            title_en: "Store Workflow Automation with AI",
            desc_ar: "دمج المساعدين الأذكياء لتوليد أوصاف المنتجات والرد الآلي على استفسارات العملاء في متجر نون آرت.",
            desc_en: "Deployed intelligent assistants for catalog copywriting and customer response automation for Noun Art Store.",
            tags: ["AI Integration", "Chatbots", "eCommerce AI"],
            link: "#"
        }
    ],
    contact: {
        email: "info@nounart.com",
        whatsapp: "+966500000000",
        whatsapp_display: "تواصل فوري ومباشر",
        location_ar: "متجر نون آرت - متاح للعمل والتدريب عن بعد وحضورياً",
        location_en: "Noun Art Store - Available for remote & on-site engagements",
        social: {
            linkedin: "https://linkedin.com",
            twitter: "https://x.com",
            github: "https://github.com",
            instagram: "https://instagram.com"
        }
    },
    messages: []
};

// Global SiteStore Manager
const SiteStore = {
    /**
     * Retrieve current portfolio data (with automatic fallback to defaults)
     */
    getData: function () {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                this.saveData(DEFAULT_PORTFOLIO_DATA);
                return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
            }
            const parsed = JSON.parse(raw);
            // Ensure schema integrity by merging any missing keys
            return Object.assign({}, DEFAULT_PORTFOLIO_DATA, parsed);
        } catch (e) {
            console.error("Failed to load store data:", e);
            return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
        }
    },

    /**
     * Persist portfolio data to localStorage
     */
    saveData: function (data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            // Dispatch a custom storage event so other open pages update instantly
            window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: data }));
            return true;
        } catch (e) {
            console.error("Failed to save store data:", e);
            return false;
        }
    },

    /**
     * Reset all data back to factory defaults
     */
    resetData: function () {
        this.saveData(DEFAULT_PORTFOLIO_DATA);
        return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
    },

    /**
     * Messages Inbox Management
     */
    getMessages: function () {
        const data = this.getData();
        return data.messages || [];
    },

    addMessage: function (msg) {
        const data = this.getData();
        if (!data.messages) data.messages = [];
        const newMsg = {
            id: 'msg_' + Date.now(),
            name: msg.name || '',
            email: msg.email || '',
            subject: msg.subject || '',
            message: msg.message || '',
            date: new Date().toLocaleString('ar-SA', { dateStyle: 'medium', timeStyle: 'short' }),
            isoDate: new Date().toISOString(),
            isRead: false
        };
        data.messages.unshift(newMsg);
        this.saveData(data);
        return newMsg;
    },

    markMessageRead: function (msgId) {
        const data = this.getData();
        const msg = (data.messages || []).find(m => m.id === msgId);
        if (msg) {
            msg.isRead = true;
            this.saveData(data);
        }
    },

    deleteMessage: function (msgId) {
        const data = this.getData();
        data.messages = (data.messages || []).filter(m => m.id !== msgId);
        this.saveData(data);
    },

    /**
     * Backup and Restore
     */
    exportJSON: function () {
        const data = this.getData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ahmed_ali_zaid_backup_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    importJSON: function (jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (!parsed.profile || !parsed.services || !parsed.portfolio) {
                throw new Error("Invalid structure");
            }
            this.saveData(parsed);
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    /**
     * Authentication PIN Management
     */
    getPin: function () {
        return localStorage.getItem(PIN_KEY) || 'admin123';
    },

    verifyPin: function (inputPin) {
        const currentPin = this.getPin();
        const isValid = (inputPin === currentPin);
        if (isValid) {
            sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
        }
        return isValid;
    },

    isAuthenticated: function () {
        return sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
    },

    logout: function () {
        sessionStorage.removeItem(SESSION_AUTH_KEY);
    },

    updatePin: function (newPin) {
        if (!newPin || newPin.length < 4) return false;
        localStorage.setItem(PIN_KEY, newPin);
        return true;
    }
};

// Make accessible in both window and module environments
if (typeof window !== 'undefined') {
    window.SiteStore = SiteStore;
}
