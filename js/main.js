/**
 * Ahmed Ali Zaid (أحمد علي زيد) Portfolio - Main Interactive Logic
 * Features:
 * - Dynamic Data Synchronization with SiteStore (localStorage)
 * - Full Internationalization (AR / EN) with RTL/LTR handling
 * - Dark / Light Theme switching with local persistence
 * - Dynamic Typewriter effect for Job Titles & Name
 * - Dynamic Services & Skills Rendering
 * - Dynamic Portfolio Grid & Filtering
 * - Dynamic About Checklist & Counters
 * - Mobile Navigation Drawer
 * - Form Validation with Direct Persistence to Admin Inbox
 */

// --- 1. Global State ---
let currentLang = localStorage.getItem('nounart_lang') || 'ar';
let currentTheme = localStorage.getItem('nounart_theme') || 'light';
let siteData = SiteStore.getData();

// Typewriter state
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typewriterTimeout = null;

// --- 2. Build Translation Dictionary from Store Data ---
function getTranslations(data) {
    const prof = data.profile || {};
    const ab = data.about || {};
    const cont = data.contact || {};

    return {
        ar: {
            meta_title: `${prof.name_ar || 'أحمد علي زيد'} | مدرب ذكاء اصطناعي - مدير متجر - رئيس قسم الحاسوب`,
            brand_name: prof.name_ar || "أحمد علي زيد",
            brand_sub: prof.brand_sub_ar || "مدرب ذكاء اصطناعي ومدير متجر",
            nav_home: "الرئيسية",
            nav_about: "نبذة عني",
            nav_services: "المهارات والخدمات",
            nav_portfolio: "معرض أعمال",
            nav_contact: "تواصل بنا",
            nav_admin: "لوحة التحكم",
            floating_admin: "لوحة التحكم",
            hero_badge: prof.badge_ar || "مرحباً بك في المنصة الشخصية",
            hero_greeting: prof.greeting_ar || "أنا",
            hero_name: prof.name_ar || "أحمد علي زيد",
            hero_role_prefix: "بصفتي",
            hero_desc: prof.hero_desc_ar || "أجمع بين شغف قيادة المتاجر الإلكترونية وتطويرها، ونقل أحدث مهارات وأدوات الذكاء الاصطناعي للمحترفين، إلى جانب الإشراف الأكاديمي والتقني كرئيس لقسم الحاسوب لصناعة أثر حقيقي ومستدام.",
            btn_contact: "تواصل بنا",
            btn_work: "استكشف الأعمال",
            badge_ai: "ذكاء اصطناعي",
            badge_growth: "نمو متجر رقمي",
            tag_about: ab.tag_ar || "تعرف علي",
            title_about: ab.title_ar || "نبذة عني",
            about_heading: ab.heading_ar || "الرؤية والخبرة",
            about_p1: ab.p1_ar || `مرحباً بكم. أنا <strong>${prof.name_ar}</strong>، أعمل في تقاطع استراتيجي يجمع بين ريادة الأعمال الرقمية من خلال <strong>إدارة متجر نون آرت</strong>، والتعليم التكنولوجي المتقدم عبر <strong>رئاسة قسم الحاسوب</strong>، وتمكين الكفاءات كـ <strong>مدرب معتمد في الذكاء الاصطناعي</strong>.`,
            about_p2: ab.p2_ar || "أؤمن بأن دمج أدوات الذكاء الاصطناعي والحلول الرقمية مع الإدارة الاحترافية يخلق فرص نمو استثنائية للمشاريع والمؤسسات والطلاب على حدٍ سواء.",
            tag_services: "ماذا أقدم؟",
            title_services: "المهارات والخدمات",
            badge_popular: "الأكثر طلباً",
            skills_cloud_title: "أبرز مجالات الخبرة والأدوات",
            tag_portfolio: "نماذج وإنجازات",
            title_portfolio: "معرض الأعمال",
            filter_all: "الكل",
            tag_contact: "ابقَ على اتصال",
            title_contact: "تواصل بنا",
            contact_heading: "يسعدني دائماً تواصلكم",
            contact_p: "سواء كنت ترغب في استشارة حول إدارة وتطوير متجر، أو إقامة دورة تدريبية في أدوات الذكاء الاصطناعي، أو تعاون أكاديمي وتقني، أنا متاح للنقاش.",
            c_email_title: "البريد الإلكتروني",
            c_wa_title: "واتساب مباشر",
            c_wa_desc: cont.whatsapp_display || "تواصل فوري ومباشر",
            c_location_title: "المقر والنشاط",
            c_location_desc: cont.location_ar || "متجر نون آرت - متاح للعمل والتدريب عن بعد وحضورياً",
            social_follow: "تابعنا على المنصات:",
            form_name: "الاسم الكامل *",
            form_name_ph: "أدخل اسمك الكريم",
            form_email: "البريد الإلكتروني *",
            form_email_ph: "name@example.com",
            form_subject: "موضوع الرسالة *",
            form_subject_ph: "استشارة متجر / دورة ذكاء اصطناعي...",
            form_message: "نص الرسالة *",
            form_message_ph: "اكتب تفاصيل استفسارك أو طلبك هنا...",
            form_submit: "إرسال الرسالة",
            form_success: "شكراً لتواصلك! تم استلام رسالتك وحفظها بنجاح وسأرد عليك قريباً.",
            err_name: "يرجى إدخال اسمك الكريم.",
            err_email: "يرجى إدخال بريد إلكتروني صحيح.",
            err_subject: "يرجى كتابة موضوع الرسالة.",
            err_message: "يرجى كتابة نص الرسالة.",
            footer_bio: "إدارة التجارة الرقمية • تدريب وتمكين الذكاء الاصطناعي • قيادة التعليم التقني",
            footer_name: prof.name_ar || "أحمد علي زيد",
            rights_reserved: "جميع الحقوق محفوظة."
        },
        en: {
            meta_title: `${prof.name_en || 'Ahmed Ali Zaid'} | AI Trainer - Store Manager - Head of Computer Science`,
            brand_name: prof.name_en || "Ahmed Ali Zaid",
            brand_sub: prof.brand_sub_en || "AI Trainer & Store Manager",
            nav_home: "Home",
            nav_about: "About Me",
            nav_services: "Skills & Services",
            nav_portfolio: "Portfolio",
            nav_contact: "Contact Us",
            nav_admin: "Admin Panel",
            floating_admin: "Admin Panel",
            hero_badge: prof.badge_en || "Welcome to my personal portfolio",
            hero_greeting: prof.greeting_en || "I am",
            hero_name: prof.name_en || "Ahmed Ali Zaid",
            hero_role_prefix: "Serving as",
            hero_desc: prof.hero_desc_en || "Combining the passion of directing and scaling e-commerce brands, training future-ready professionals in Generative AI tools, and driving academic excellence as Head of Computer Science Department.",
            btn_contact: "Contact Us",
            btn_work: "Explore Portfolio",
            badge_ai: "Artificial Intelligence",
            badge_growth: "E-Commerce Growth",
            tag_about: ab.tag_en || "Discover My Journey",
            title_about: ab.title_en || "About Me",
            about_heading: ab.heading_en || "Vision & Leadership",
            about_p1: ab.p1_en || `Welcome! I am <strong>${prof.name_en}</strong>, operating at the vital intersection of digital commerce as <strong>Manager of Noun Art Store</strong>, modern tech education as <strong>Head of the Computer Science Department</strong>, and capacity building as a <strong>Certified AI Trainer & Consultant</strong>.`,
            about_p2: ab.p2_en || "I believe that harnessing artificial intelligence tools and automated workflows creates exponential value for business ventures, academic institutions, and learners.",
            tag_services: "What I Offer",
            title_services: "Skills & Services",
            badge_popular: "Most Popular",
            skills_cloud_title: "Core Expertise & Toolsets",
            tag_portfolio: "Showcase & Milestones",
            title_portfolio: "Portfolio & Projects",
            filter_all: "All",
            tag_contact: "Get in Touch",
            title_contact: "Contact Us",
            contact_heading: "Let's Connect & Collaborate",
            contact_p: "Whether you need consultation in e-commerce strategy, an intensive training course in AI tools, or tech leadership collaboration, I am glad to discuss.",
            c_email_title: "Email Address",
            c_wa_title: "Direct WhatsApp",
            c_wa_desc: "Instant message & response",
            c_location_title: "Base & Operations",
            c_location_desc: cont.location_en || "Noun Art Store - Available for remote & on-site engagements",
            social_follow: "Connect on Social Media:",
            form_name: "Full Name *",
            form_name_ph: "Enter your full name",
            form_email: "Email Address *",
            form_email_ph: "name@example.com",
            form_subject: "Subject *",
            form_subject_ph: "Store consultation / AI workshop inquiry...",
            form_message: "Your Message *",
            form_message_ph: "Please write your inquiry details here...",
            form_submit: "Send Message",
            form_success: "Thank you for reaching out! Your message was received successfully. I will get back to you shortly.",
            err_name: "Please enter your name.",
            err_email: "Please enter a valid email address.",
            err_subject: "Please provide a subject.",
            err_message: "Please write your message.",
            footer_bio: "Digital Retail Management • AI Enablement & Training • Computer Science Leadership",
            footer_name: prof.name_en || "Ahmed Ali Zaid",
            rights_reserved: "All rights reserved."
        }
    };
}

// --- 3. DOM Elements Cache ---
const htmlEl = document.documentElement;
const langToggleBtn = document.getElementById('langToggle');
const langText = document.getElementById('langText');
const themeToggleBtn = document.getElementById('themeToggle');
const typewriterEl = document.getElementById('typewriter');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');
const header = document.getElementById('header');
const backToTopBtn = document.getElementById('backToTop');
const currentYearSpan = document.getElementById('currentYear');
const contactForm = document.getElementById('contactForm');
const formAlert = document.getElementById('formAlert');

// Containers for dynamic rendering
const heroHighlightsContainer = document.getElementById('heroHighlights');
const aboutChecklistContainer = document.getElementById('aboutChecklist');
const statsColumnContainer = document.getElementById('statsColumn');
const servicesGridContainer = document.getElementById('servicesGrid');
const skillsTagsContainer = document.getElementById('skillsTagsContainer');
const portfolioFiltersContainer = document.getElementById('portfolioFilters');
const portfolioGridContainer = document.getElementById('portfolioGrid');
const contactEmailLink = document.getElementById('contactEmailLink');
const contactEmailText = document.getElementById('contactEmailText');
const contactWaLink = document.getElementById('contactWaLink');
const contactWaText = document.getElementById('contactWaText');
const contactLocationText = document.getElementById('contactLocationText');
const socialIconsContainer = document.getElementById('socialIcons');

// Set dynamic year
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// --- 4. Dynamic Section Renderers ---

/**
 * Render Quick Highlights in Hero Section
 */
function renderHeroHighlights(data, lang) {
    if (!heroHighlightsContainer) return;
    const stats = (data.profile && data.profile.hero_stats) || [];
    
    heroHighlightsContainer.innerHTML = stats.map(st => {
        const title = lang === 'ar' ? st.title_ar : (st.title_en || st.title_ar);
        const desc = lang === 'ar' ? st.desc_ar : (st.desc_en || st.desc_ar);
        return `
            <div class="highlight-item">
                <i class="${st.icon || 'fa-solid fa-star'} highlight-icon"></i>
                <div>
                    <h4>${title}</h4>
                    <p>${desc}</p>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Render About Checklist
 */
function renderAboutChecklist(data, lang) {
    if (!aboutChecklistContainer) return;
    const list = (data.about && data.about.checklist) || [];

    aboutChecklistContainer.innerHTML = list.map(item => {
        const text = lang === 'ar' ? item.text_ar : (item.text_en || item.text_ar);
        return `
            <div class="check-item">
                <i class="fa-solid fa-circle-check"></i>
                <span>${text}</span>
            </div>
        `;
    }).join('');
}

/**
 * Render Impact Counters
 */
function renderCounters(data, lang) {
    if (!statsColumnContainer) return;
    const counters = (data.about && data.about.counters) || [];

    statsColumnContainer.innerHTML = counters.map(cnt => {
        const label = lang === 'ar' ? cnt.label_ar : (cnt.label_en || cnt.label_ar);
        return `
            <div class="stat-card">
                <div class="stat-number" data-target="${cnt.number}">${cnt.number}${cnt.suffix || '+'}</div>
                <div class="stat-label">${label}</div>
            </div>
        `;
    }).join('');
}

/**
 * Render Services Grid
 */
function renderServices(data, lang) {
    if (!servicesGridContainer) return;
    const services = data.services || [];
    const isAr = lang === 'ar';

    servicesGridContainer.innerHTML = services.map(srv => {
        const title = isAr ? srv.title_ar : (srv.title_en || srv.title_ar);
        const desc = isAr ? srv.desc_ar : (srv.desc_en || srv.desc_ar);
        const points = isAr ? (srv.points_ar || []) : (srv.points_en || srv.points_ar || []);
        const featuredBadge = srv.isFeatured 
            ? `<div class="featured-badge">${isAr ? 'الأكثر طلباً' : 'Most Popular'}</div>` 
            : '';

        const pointsHtml = points.map(pt => `<li>${pt}</li>`).join('');

        return `
            <div class="service-card ${srv.isFeatured ? 'featured' : ''}">
                ${featuredBadge}
                <div class="service-icon-wrapper">
                    <i class="${srv.icon || 'fa-solid fa-briefcase'}"></i>
                </div>
                <h3 class="service-title">${title}</h3>
                <p class="service-desc">${desc}</p>
                <ul class="service-points">
                    ${pointsHtml}
                </ul>
            </div>
        `;
    }).join('');
}

/**
 * Render Skills Cloud
 */
function renderSkillsCloud(data) {
    if (!skillsTagsContainer) return;
    const skills = data.skills_cloud || [];

    skillsTagsContainer.innerHTML = skills.map(skill => `
        <span class="skill-tag">${skill}</span>
    `).join('');
}

/**
 * Render Portfolio Filters & Projects
 */
function renderPortfolio(data, lang) {
    if (!portfolioFiltersContainer || !portfolioGridContainer) return;
    const isAr = lang === 'ar';
    const categories = data.categories || [
        { key: "all", label_ar: "الكل", label_en: "All" },
        { key: "ai", label_ar: "الذكاء الاصطناعي", label_en: "Artificial Intelligence" },
        { key: "ecommerce", label_ar: "متجر نون آرت", label_en: "Noun Art Store" },
        { key: "cs", label_ar: "قسم الحاسوب", label_en: "Computer Science" }
    ];

    // Render Filter Buttons
    portfolioFiltersContainer.innerHTML = categories.map((cat, idx) => {
        const label = isAr ? cat.label_ar : (cat.label_en || cat.label_ar);
        return `
            <button class="filter-btn ${idx === 0 ? 'active' : ''}" data-filter="${cat.key}">
                ${label}
            </button>
        `;
    }).join('');

    // Render Projects
    const projects = data.portfolio || [];
    portfolioGridContainer.innerHTML = projects.map(proj => {
        const title = isAr ? proj.title_ar : (proj.title_en || proj.title_ar);
        const desc = isAr ? proj.desc_ar : (proj.desc_en || proj.desc_ar);
        const catObj = categories.find(c => c.key === proj.category);
        const catLabel = catObj ? (isAr ? catObj.label_ar : catObj.label_en) : proj.category;
        
        let visualClass = "ecommerce-visual";
        if (proj.category === 'ai') visualClass = "ai-visual";
        else if (proj.category === 'cs') visualClass = "cs-visual";

        const tagsHtml = (proj.tags || []).map(t => `<span>${t}</span>`).join('');

        return `
            <div class="project-card" data-category="${proj.category}">
                <div class="project-header-visual ${visualClass}">
                    <i class="${proj.icon || 'fa-solid fa-briefcase'} visual-icon"></i>
                    <span class="project-category-tag">${catLabel}</span>
                </div>
                <div class="project-body">
                    <h3 class="project-title">${title}</h3>
                    <p class="project-desc">${desc}</p>
                    <div class="project-tags">
                        ${tagsHtml}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Reattach Filter Button Listeners
    setupPortfolioFilters();
}

function setupPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCat === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Render Contact Info & Social Media Links
 */
function renderContactDetails(data, lang) {
    const c = data.contact || {};
    const isAr = lang === 'ar';

    if (contactEmailLink) {
        contactEmailLink.href = `mailto:${c.email || 'info@nounart.com'}`;
    }
    if (contactEmailText) {
        contactEmailText.textContent = c.email || 'info@nounart.com';
    }

    if (contactWaLink) {
        const cleanNumber = (c.whatsapp || '').replace(/[^0-9]/g, '');
        contactWaLink.href = `https://wa.me/${cleanNumber}`;
    }
    if (contactWaText) {
        contactWaText.textContent = isAr ? (c.whatsapp_display || 'تواصل فوري ومباشر') : 'Instant message & response';
    }

    if (contactLocationText) {
        contactLocationText.textContent = isAr 
            ? (c.location_ar || 'متجر نون آرت - متاح للعمل والتدريب عن بعد وحضورياً') 
            : (c.location_en || 'Noun Art Store - Available for remote & on-site engagements');
    }

    if (socialIconsContainer) {
        const s = c.social || {};
        socialIconsContainer.innerHTML = `
            ${s.linkedin ? `<a href="${s.linkedin}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>` : ''}
            ${s.twitter ? `<a href="${s.twitter}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="X / Twitter"><i class="fa-brands fa-x-twitter"></i></a>` : ''}
            ${s.github ? `<a href="${s.github}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>` : ''}
            ${s.instagram ? `<a href="${s.instagram}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>` : ''}
        `;
    }
}

// --- 5. Internationalization (i18n) Handler ---
function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('nounart_lang', lang);

    htmlEl.setAttribute('lang', lang);
    htmlEl.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // Update toggle button text
    if (langText) {
        langText.textContent = lang === 'ar' ? 'EN' : 'عربي';
    }

    // Refresh store data
    siteData = SiteStore.getData();
    const t = getTranslations(siteData)[lang];

    // Update page title
    document.title = t.meta_title;

    // Update all i18n texts
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t && t[key]) {
            el.innerHTML = t[key];
        }
    });

    // Update placeholders
    const placeholders = document.querySelectorAll('[data-i18n-ph]');
    placeholders.forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (t && t[key]) {
            el.setAttribute('placeholder', t[key]);
        }
    });

    // Render all dynamic sections
    renderHeroHighlights(siteData, lang);
    renderAboutChecklist(siteData, lang);
    renderCounters(siteData, lang);
    renderServices(siteData, lang);
    renderSkillsCloud(siteData);
    renderPortfolio(siteData, lang);
    renderContactDetails(siteData, lang);

    // Reset and restart typewriter
    resetTypewriter();
}

// Language toggle event
if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        const newLang = currentLang === 'ar' ? 'en' : 'ar';
        applyLanguage(newLang);
    });
}

// --- 6. Theme Switcher (Dark / Light) ---
function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('nounart_theme', theme);
    htmlEl.setAttribute('data-theme', theme);

    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('.theme-icon');
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    }
}

// Theme toggle event
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    });
}

// --- 7. Dynamic Typewriter Effect ---
function typeEffect() {
    if (!typewriterEl) return;

    const prof = siteData.profile || {};
    const wordsAr = prof.typewriter_ar && prof.typewriter_ar.length > 0 
        ? prof.typewriter_ar 
        : ["أحمد علي زيد", "مدرب ذكاء اصطناعي", "مدير متجر نون آرت", "رئيس قسم الحاسوب"];
    const wordsEn = prof.typewriter_en && prof.typewriter_en.length > 0 
        ? prof.typewriter_en 
        : ["Ahmed Ali Zaid", "AI Trainer & Consultant", "Noun Art Store Manager", "Head of CS Dept."];

    const words = currentLang === 'ar' ? wordsAr : wordsEn;
    const currentWord = words[wordIndex % words.length];

    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    typewriterEl.textContent = currentWord.substring(0, charIndex);

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
        speed = 2200; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex++;
        speed = 400; // Pause before typing next word
    }

    typewriterTimeout = setTimeout(typeEffect, speed);
}

function resetTypewriter() {
    clearTimeout(typewriterTimeout);
    wordIndex = 0;
    charIndex = 0;
    isDeleting = false;
    typeEffect();
}

// --- 8. Mobile Navigation Toggle ---
if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mainNav.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mainNav.classList.remove('open');
        });
    });
}

// --- 9. Header Blur & Back to Top Button on Scroll ---
window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (header) {
        if (scrollPos > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    if (backToTopBtn) {
        if (scrollPos > 350) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    // Active Navigation Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const top = section.offsetTop - 120;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// --- 10. Contact Form UX Validation & Admin Inbox Submission ---
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear previous errors
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
        if (formAlert) {
            formAlert.className = 'form-alert';
            formAlert.textContent = '';
        }

        const nameInput = document.getElementById('senderName');
        const emailInput = document.getElementById('senderEmail');
        const subjectInput = document.getElementById('senderSubject');
        const messageInput = document.getElementById('senderMessage');

        let isValid = true;
        const t = getTranslations(siteData)[currentLang];

        if (!nameInput.value.trim()) {
            document.getElementById('nameError').textContent = t.err_name;
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            document.getElementById('emailError').textContent = t.err_email;
            isValid = false;
        }

        if (!subjectInput.value.trim()) {
            document.getElementById('subjectError').textContent = t.err_subject;
            isValid = false;
        }

        if (!messageInput.value.trim()) {
            document.getElementById('messageError').textContent = t.err_message;
            isValid = false;
        }

        if (isValid) {
            const submitBtn = document.getElementById('submitBtn');
            const originalBtnContent = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ...`;

            // Save message into SiteStore Admin Messages Inbox!
            SiteStore.addMessage({
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                subject: subjectInput.value.trim(),
                message: messageInput.value.trim()
            });

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;

                if (formAlert) {
                    formAlert.classList.add('success');
                    formAlert.textContent = t.form_success;
                }
                contactForm.reset();

                setTimeout(() => {
                    if (formAlert) {
                        formAlert.className = 'form-alert';
                        formAlert.textContent = '';
                    }
                }, 7000);
            }, 800);
        }
    });
}

// --- 11. Listen for Storage / Store Updates ---
window.addEventListener('portfolioDataUpdated', (e) => {
    siteData = e.detail || SiteStore.getData();
    applyLanguage(currentLang);
});

window.addEventListener('storage', (e) => {
    if (e.key === 'ahmed_ali_zaid_portfolio_data') {
        siteData = SiteStore.getData();
        applyLanguage(currentLang);
    }
});

// --- 12. Initialization on DOM Loaded ---
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(currentTheme);
    applyLanguage(currentLang);
});
