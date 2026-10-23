/**
 * Ahmed Ali Zaid - Admin Dashboard Logic
 * Full CRUD for all sections, live persistence, modals, and backups.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Current Active Tab
    let activeTabId = 'overview';
    let currentData = SiteStore.getData();

    // DOM Elements
    const body = document.body;
    const themeToggleBtn = document.getElementById('admThemeToggle');
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const sidebar = document.getElementById('adminSidebar');
    const menuLinks = document.querySelectorAll('.menu-item-link');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const pageTitle = document.getElementById('admPageTitle');
    const pageSubtitle = document.getElementById('admPageSubtitle');
    const toastContainer = document.getElementById('toastContainer');
    
    // Modals
    const pinModal = document.getElementById('pinModal');
    const pinInput = document.getElementById('adminPinInput');
    const pinSubmitBtn = document.getElementById('pinSubmitBtn');
    const pinError = document.getElementById('pinError');
    const logoutBtn = document.getElementById('logoutBtn');

    const serviceModal = document.getElementById('serviceModal');
    const serviceForm = document.getElementById('serviceForm');
    const projectModal = document.getElementById('projectModal');
    const projectForm = document.getElementById('projectForm');
    const viewMessageModal = document.getElementById('viewMessageModal');

    // --- 1. Authentication Check ---
    function checkAuth() {
        if (!SiteStore.isAuthenticated()) {
            if (pinModal) {
                pinModal.classList.add('open');
                if (pinInput) {
                    pinInput.value = '';
                    setTimeout(() => pinInput.focus(), 150);
                }
            }
        } else {
            if (pinModal) pinModal.classList.remove('open');
            refreshAllViews();
        }
    }

    if (pinSubmitBtn && pinInput) {
        const handlePinLogin = () => {
            const entered = pinInput.value.trim();
            if (SiteStore.verifyPin(entered)) {
                pinModal.classList.remove('open');
                pinError.textContent = '';
                showToast("تم تسجيل الدخول بنجاح! أهلاً بك في لوحة التحكم.", "success");
                refreshAllViews();
            } else {
                pinError.textContent = "رمز الدخول غير صحيح! الرمز الافتراضي هو: admin123";
                pinInput.focus();
            }
        };

        pinSubmitBtn.addEventListener('click', handlePinLogin);
        pinInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handlePinLogin();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            SiteStore.logout();
            showToast("تم تسجيل الخروج.", "info");
            checkAuth();
        });
    }

    // --- 2. Theme Toggle ---
    const savedTheme = localStorage.getItem('nounart_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const cur = document.documentElement.getAttribute('data-theme') || 'light';
            const next = cur === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('nounart_theme', next);
            updateThemeIcon(next);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fa-solid fa-sun';
            } else {
                icon.className = 'fa-solid fa-moon';
            }
        }
    }

    // --- 3. Mobile Sidebar Toggle ---
    if (mobileMenuTrigger && sidebar) {
        mobileMenuTrigger.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Close sidebar on click outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 992 && sidebar.classList.contains('open')) {
                if (!sidebar.contains(e.target) && !mobileMenuTrigger.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }

    // --- 4. Navigation Tab Switching ---
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = link.getAttribute('data-tab');
            if (!targetTab) return;

            menuLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `tab-${targetTab}`) {
                    pane.classList.add('active');
                }
            });

            activeTabId = targetTab;
            updateTopBarTitle(targetTab);

            if (window.innerWidth <= 992 && sidebar) {
                sidebar.classList.remove('open');
            }
        });
    });

    const tabTitles = {
        overview: { title: "نظرة عامة", sub: "إحصائيات سريعة وملخص محتويات الموقع" },
        profile: { title: "البيانات الشخصية والواجهة", sub: "تعديل اسم المدرب أحمد علي زيد، النبذة، والمسميات الوظيفية" },
        about: { title: "نبذة عني والإحصائيات", sub: "تعديل محتوى قسم النبذة، نقاط التميز، وعدادات الإنجاز" },
        services: { title: "المهارات والخدمات", sub: "إضافة وتعديل وحذف الخدمات التدريبية وسحابة المهارات" },
        portfolio: { title: "معرض الأعمال والمشاريع", sub: "إدارة مشاريع الإنجازات والتدريب وأتمتة المتاجر" },
        contact: { title: "معلومات التواصل والروابط", sub: "تعديل البريد، الواتساب، المقر، وروابط منصات التواصل" },
        messages: { title: "صندوق الرسائل الواردة", sub: "عرض وإدارة الرسائل المستلمة عبر نموذج تواصل بنا" },
        settings: { title: "النسخ الاحتياطي والأمان", sub: "تغيير رمز المرور، تصدير واستيراد البيانات، واستعادة الافتراضي" }
    };

    function updateTopBarTitle(tab) {
        if (tabTitles[tab]) {
            if (pageTitle) pageTitle.textContent = tabTitles[tab].title;
            if (pageSubtitle) pageSubtitle.textContent = tabTitles[tab].sub;
        }
    }

    // --- 5. Toast Notification System ---
    function showToast(message, type = "success") {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `adm-toast ${type}`;
        
        let iconHtml = '<i class="fa-solid fa-circle-check"></i>';
        if (type === 'danger') iconHtml = '<i class="fa-solid fa-triangle-exclamation"></i>';
        if (type === 'info') iconHtml = '<i class="fa-solid fa-circle-info"></i>';

        toast.innerHTML = `${iconHtml} <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // --- 6. Data Refreshing & View Rendering ---
    function refreshAllViews() {
        currentData = SiteStore.getData();
        renderOverview();
        renderProfileForm();
        renderAboutForm();
        renderServicesList();
        renderSkillsCloud();
        renderProjectsList();
        renderContactForm();
        renderMessagesTable();
        updateUnreadBadges();
    }

    function updateUnreadBadges() {
        const msgs = currentData.messages || [];
        const unread = msgs.filter(m => !m.isRead).length;
        const badgeEl = document.getElementById('unreadMessagesBadge');
        if (badgeEl) {
            badgeEl.textContent = unread;
            badgeEl.style.display = unread > 0 ? 'inline-block' : 'none';
        }
    }

    // -------------------------------------------------------------
    // TAB 1: OVERVIEW
    // -------------------------------------------------------------
    function renderOverview() {
        const servCount = (currentData.services || []).length;
        const projCount = (currentData.portfolio || []).length;
        const skillsCount = (currentData.skills_cloud || []).length;
        const msgsCount = (currentData.messages || []).length;
        const unreadCount = (currentData.messages || []).filter(m => !m.isRead).length;

        const countServEl = document.getElementById('statCountServices');
        const countProjEl = document.getElementById('statCountProjects');
        const countSkillsEl = document.getElementById('statCountSkills');
        const countMsgsEl = document.getElementById('statCountMessages');

        if (countServEl) countServEl.textContent = servCount;
        if (countProjEl) countProjEl.textContent = projCount;
        if (countSkillsEl) countSkillsEl.textContent = skillsCount;
        if (countMsgsEl) countMsgsEl.textContent = `${msgsCount} (${unreadCount} غير مقروء)`;

        const recentMsgsContainer = document.getElementById('overviewRecentMessages');
        if (recentMsgsContainer) {
            const recent = (currentData.messages || []).slice(0, 3);
            if (recent.length === 0) {
                recentMsgsContainer.innerHTML = '<p class="text-muted" style="color: var(--adm-text-muted); font-size: 0.9rem;">لا توجد رسائل واردة حالياً.</p>';
            } else {
                recentMsgsContainer.innerHTML = recent.map(m => `
                    <div class="interactive-item-row">
                        <div class="item-content-preview">
                            <strong>${m.name} - <span style="font-size:0.8rem; font-weight:normal;">${m.subject}</span></strong>
                            <span>${m.message.slice(0, 70)}... (${m.date})</span>
                        </div>
                        <span class="badge-lang" style="${m.isRead ? '' : 'background:var(--adm-accent);color:#fff;'}">${m.isRead ? 'مقروءة' : 'جديدة'}</span>
                    </div>
                `).join('');
            }
        }
    }

    // -------------------------------------------------------------
    // TAB 2: PROFILE & HERO SECTION
    // -------------------------------------------------------------
    function renderProfileForm() {
        const p = currentData.profile || {};
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val || '';
        };

        setVal('profNameAr', p.name_ar);
        setVal('profNameEn', p.name_en);
        setVal('profBrandSubAr', p.brand_sub_ar);
        setVal('profBrandSubEn', p.brand_sub_en);
        setVal('profBadgeAr', p.badge_ar);
        setVal('profBadgeEn', p.badge_en);
        setVal('profHeroDescAr', p.hero_desc_ar);
        setVal('profHeroDescEn', p.hero_desc_en);

        renderTypewriterList();
    }

    function renderTypewriterList() {
        const p = currentData.profile || {};
        const rolesAr = p.typewriter_ar || [];
        const rolesEn = p.typewriter_en || [];
        const container = document.getElementById('typewriterRolesList');
        if (!container) return;

        container.innerHTML = '';
        const maxLen = Math.max(rolesAr.length, rolesEn.length);

        for (let i = 0; i < maxLen; i++) {
            const arText = rolesAr[i] || '';
            const enText = rolesEn[i] || '';
            const row = document.createElement('div');
            row.className = 'interactive-item-row';
            row.innerHTML = `
                <div class="item-content-preview">
                    <strong><i class="fa-solid fa-keyboard" style="color:var(--adm-accent); margin-left:6px;"></i> ${arText}</strong>
                    <span>${enText}</span>
                </div>
                <div class="item-actions-btns">
                    <button type="button" class="btn-icon-adm delete" title="حذف المسمى" onclick="deleteTypewriterRole(${i})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(row);
        }
    }

    window.deleteTypewriterRole = function (idx) {
        if (!currentData.profile.typewriter_ar) currentData.profile.typewriter_ar = [];
        if (!currentData.profile.typewriter_en) currentData.profile.typewriter_en = [];

        currentData.profile.typewriter_ar.splice(idx, 1);
        currentData.profile.typewriter_en.splice(idx, 1);
        SiteStore.saveData(currentData);
        renderTypewriterList();
        showToast("تم حذف المسمى الوظيفي بنجاح.", "info");
    };

    const addRoleBtn = document.getElementById('addRoleBtn');
    if (addRoleBtn) {
        addRoleBtn.addEventListener('click', () => {
            const arInput = document.getElementById('newRoleAr');
            const enInput = document.getElementById('newRoleEn');
            const arVal = arInput.value.trim();
            const enVal = enInput.value.trim();

            if (!arVal || !enVal) {
                showToast("يرجى إدخال المسمى بالعربية والإنجليزية معاً.", "danger");
                return;
            }

            if (!currentData.profile.typewriter_ar) currentData.profile.typewriter_ar = [];
            if (!currentData.profile.typewriter_en) currentData.profile.typewriter_en = [];

            currentData.profile.typewriter_ar.push(arVal);
            currentData.profile.typewriter_en.push(enVal);
            SiteStore.saveData(currentData);

            arInput.value = '';
            enInput.value = '';
            renderTypewriterList();
            showToast("تمت إضافة المسمى الوظيفي بنجاح.", "success");
        });
    }

    const saveProfileForm = document.getElementById('saveProfileForm');
    if (saveProfileForm) {
        saveProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const p = currentData.profile || {};
            p.name_ar = document.getElementById('profNameAr').value.trim() || "أحمد علي زيد";
            p.name_en = document.getElementById('profNameEn').value.trim() || "Ahmed Ali Zaid";
            p.brand_sub_ar = document.getElementById('profBrandSubAr').value.trim();
            p.brand_sub_en = document.getElementById('profBrandSubEn').value.trim();
            p.badge_ar = document.getElementById('profBadgeAr').value.trim();
            p.badge_en = document.getElementById('profBadgeEn').value.trim();
            p.hero_desc_ar = document.getElementById('profHeroDescAr').value.trim();
            p.hero_desc_en = document.getElementById('profHeroDescEn').value.trim();

            currentData.profile = p;
            SiteStore.saveData(currentData);
            showToast("تم حفظ بيانات المدرب والواجهة بنجاح ✨", "success");
        });
    }

    // -------------------------------------------------------------
    // TAB 3: ABOUT & STATS SECTION
    // -------------------------------------------------------------
    function renderAboutForm() {
        const ab = currentData.about || {};
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val || '';
        };

        setVal('aboutTagAr', ab.tag_ar);
        setVal('aboutTagEn', ab.tag_en);
        setVal('aboutTitleAr', ab.title_ar);
        setVal('aboutTitleEn', ab.title_en);
        setVal('aboutHeadingAr', ab.heading_ar);
        setVal('aboutHeadingEn', ab.heading_en);
        setVal('aboutP1Ar', ab.p1_ar);
        setVal('aboutP1En', ab.p1_en);
        setVal('aboutP2Ar', ab.p2_ar);
        setVal('aboutP2En', ab.p2_en);

        renderChecklist();
        renderCountersList();
    }

    function renderChecklist() {
        const list = (currentData.about && currentData.about.checklist) || [];
        const container = document.getElementById('checklistItemsList');
        if (!container) return;

        container.innerHTML = '';
        list.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'interactive-item-row';
            row.innerHTML = `
                <div class="item-content-preview">
                    <strong><i class="fa-solid fa-circle-check" style="color:var(--adm-success); margin-left:6px;"></i> ${item.text_ar}</strong>
                    <span>${item.text_en}</span>
                </div>
                <div class="item-actions-btns">
                    <button type="button" class="btn-icon-adm delete" title="حذف" onclick="deleteChecklistItem(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(row);
        });
    }

    window.deleteChecklistItem = function (idx) {
        currentData.about.checklist.splice(idx, 1);
        SiteStore.saveData(currentData);
        renderChecklist();
        showToast("تم حذف النقطة بنجاح.", "info");
    };

    const addChecklistBtn = document.getElementById('addChecklistBtn');
    if (addChecklistBtn) {
        addChecklistBtn.addEventListener('click', () => {
            const arIn = document.getElementById('newChecklistAr');
            const enIn = document.getElementById('newChecklistEn');
            const arVal = arIn.value.trim();
            const enVal = enIn.value.trim();

            if (!arVal) {
                showToast("يرجى إدخال نص النقطة بالعربية على الأقل.", "danger");
                return;
            }

            if (!currentData.about.checklist) currentData.about.checklist = [];
            currentData.about.checklist.push({
                id: 'ck_' + Date.now(),
                text_ar: arVal,
                text_en: enVal || arVal
            });

            SiteStore.saveData(currentData);
            arIn.value = '';
            enIn.value = '';
            renderChecklist();
            showToast("تمت إضافة نقطة التميز بنجاح.", "success");
        });
    }

    function renderCountersList() {
        const list = (currentData.about && currentData.about.counters) || [];
        const container = document.getElementById('countersItemsList');
        if (!container) return;

        container.innerHTML = '';
        list.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'interactive-item-row';
            row.innerHTML = `
                <div class="item-content-preview">
                    <strong><span style="font-size:1.1rem; color:var(--adm-accent); font-weight:800;">${item.number}${item.suffix || ''}</span> - ${item.label_ar}</strong>
                    <span>${item.label_en || ''}</span>
                </div>
                <div class="item-actions-btns">
                    <button type="button" class="btn-icon-adm delete" title="حذف العداد" onclick="deleteCounterItem(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(row);
        });
    }

    window.deleteCounterItem = function (idx) {
        currentData.about.counters.splice(idx, 1);
        SiteStore.saveData(currentData);
        renderCountersList();
        showToast("تم حذف العداد بنجاح.", "info");
    };

    const addCounterBtn = document.getElementById('addCounterBtn');
    if (addCounterBtn) {
        addCounterBtn.addEventListener('click', () => {
            const numIn = document.getElementById('newCounterNumber');
            const sufIn = document.getElementById('newCounterSuffix');
            const arIn = document.getElementById('newCounterLabelAr');
            const enIn = document.getElementById('newCounterLabelEn');

            const numVal = parseInt(numIn.value) || 0;
            const sufVal = sufIn.value.trim();
            const arVal = arIn.value.trim();
            const enVal = enIn.value.trim();

            if (!arVal) {
                showToast("يرجى كتابة عنوان العداد بالعربية.", "danger");
                return;
            }

            if (!currentData.about.counters) currentData.about.counters = [];
            currentData.about.counters.push({
                id: 'cnt_' + Date.now(),
                number: numVal,
                suffix: sufVal,
                label_ar: arVal,
                label_en: enVal
            });

            SiteStore.saveData(currentData);
            numIn.value = '';
            sufIn.value = '+';
            arIn.value = '';
            enIn.value = '';
            renderCountersList();
            showToast("تمت إضافة العداد بنجاح.", "success");
        });
    }

    const saveAboutForm = document.getElementById('saveAboutForm');
    if (saveAboutForm) {
        saveAboutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const ab = currentData.about || {};
            ab.tag_ar = document.getElementById('aboutTagAr').value.trim();
            ab.tag_en = document.getElementById('aboutTagEn').value.trim();
            ab.title_ar = document.getElementById('aboutTitleAr').value.trim();
            ab.title_en = document.getElementById('aboutTitleEn').value.trim();
            ab.heading_ar = document.getElementById('aboutHeadingAr').value.trim();
            ab.heading_en = document.getElementById('aboutHeadingEn').value.trim();
            ab.p1_ar = document.getElementById('aboutP1Ar').value.trim();
            ab.p1_en = document.getElementById('aboutP1En').value.trim();
            ab.p2_ar = document.getElementById('aboutP2Ar').value.trim();
            ab.p2_en = document.getElementById('aboutP2En').value.trim();

            currentData.about = ab;
            SiteStore.saveData(currentData);
            showToast("تم حفظ تعديلات قسم نبذة عني بنجاح ✨", "success");
        });
    }

    // -------------------------------------------------------------
    // TAB 4: SERVICES & SKILLS SECTION
    // -------------------------------------------------------------
    function renderServicesList() {
        const services = currentData.services || [];
        const container = document.getElementById('servicesCardsGrid');
        if (!container) return;

        container.innerHTML = '';
        services.forEach(serv => {
            const card = document.createElement('div');
            card.className = 'dynamic-item-card';
            
            const pointsList = (serv.points_ar || []).map(p => `<li>${p}</li>`).join('');

            card.innerHTML = `
                ${serv.isFeatured ? '<span class="card-top-badge featured"><i class="fa-solid fa-star"></i> الأكثر طلباً</span>' : ''}
                <div class="item-card-icon">
                    <i class="${serv.icon || 'fa-solid fa-briefcase'}"></i>
                </div>
                <h4 class="item-card-title">${serv.title_ar}</h4>
                <div class="item-card-subtitle">${serv.title_en || ''}</div>
                <p class="item-card-desc">${serv.desc_ar}</p>
                <ul style="font-size: 0.8rem; color: var(--adm-text-muted); margin-bottom: 1rem; padding-right: 1.2rem;">
                    ${pointsList}
                </ul>
                <div class="item-card-footer">
                    <button type="button" class="btn-adm btn-adm-secondary btn-adm-sm" onclick="openEditServiceModal('${serv.id}')">
                        <i class="fa-solid fa-pen-to-square"></i> تعديل
                    </button>
                    <button type="button" class="btn-adm btn-adm-danger btn-adm-sm" onclick="deleteService('${serv.id}')">
                        <i class="fa-solid fa-trash"></i> حذف
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    let editingServiceId = null;

    window.openAddServiceModal = function () {
        editingServiceId = null;
        document.getElementById('serviceModalTitle').textContent = "إضافة خدمة جديدة";
        serviceForm.reset();
        document.getElementById('servIcon').value = "fa-solid fa-robot";
        updateIconPreview('servIcon', 'servIconPreview');
        serviceModal.classList.add('open');
    };

    window.openEditServiceModal = function (servId) {
        editingServiceId = servId;
        const serv = (currentData.services || []).find(s => s.id === servId);
        if (!serv) return;

        document.getElementById('serviceModalTitle').textContent = "تعديل الخدمة";
        document.getElementById('servTitleAr').value = serv.title_ar || '';
        document.getElementById('servTitleEn').value = serv.title_en || '';
        document.getElementById('servDescAr').value = serv.desc_ar || '';
        document.getElementById('servDescEn').value = serv.desc_en || '';
        document.getElementById('servIcon').value = serv.icon || 'fa-solid fa-robot';
        document.getElementById('servFeatured').checked = !!serv.isFeatured;
        document.getElementById('servPointsAr').value = (serv.points_ar || []).join('\n');
        document.getElementById('servPointsEn').value = (serv.points_en || []).join('\n');

        updateIconPreview('servIcon', 'servIconPreview');
        serviceModal.classList.add('open');
    };

    window.closeServiceModal = function () {
        serviceModal.classList.remove('open');
        serviceForm.reset();
        editingServiceId = null;
    };

    window.deleteService = function (servId) {
        if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;
        currentData.services = (currentData.services || []).filter(s => s.id !== servId);
        SiteStore.saveData(currentData);
        renderServicesList();
        renderOverview();
        showToast("تم حذف الخدمة بنجاح.", "info");
    };

    if (serviceForm) {
        serviceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const titleAr = document.getElementById('servTitleAr').value.trim();
            const titleEn = document.getElementById('servTitleEn').value.trim();
            const descAr = document.getElementById('servDescAr').value.trim();
            const descEn = document.getElementById('servDescEn').value.trim();
            const icon = document.getElementById('servIcon').value.trim() || 'fa-solid fa-briefcase';
            const isFeatured = document.getElementById('servFeatured').checked;
            const pointsAr = document.getElementById('servPointsAr').value.split('\n').map(s => s.trim()).filter(Boolean);
            const pointsEn = document.getElementById('servPointsEn').value.split('\n').map(s => s.trim()).filter(Boolean);

            if (!titleAr) {
                showToast("يرجى إدخال عنوان الخدمة بالعربية.", "danger");
                return;
            }

            if (!currentData.services) currentData.services = [];

            if (editingServiceId) {
                // Update
                const idx = currentData.services.findIndex(s => s.id === editingServiceId);
                if (idx !== -1) {
                    currentData.services[idx] = {
                        ...currentData.services[idx],
                        title_ar: titleAr,
                        title_en: titleEn,
                        desc_ar: descAr,
                        desc_en: descEn,
                        icon,
                        isFeatured,
                        points_ar: pointsAr,
                        points_en: pointsEn
                    };
                    showToast("تم تحديث بيانات الخدمة بنجاح ✨", "success");
                }
            } else {
                // Add new
                const newServ = {
                    id: 'serv_' + Date.now(),
                    title_ar: titleAr,
                    title_en: titleEn,
                    desc_ar: descAr,
                    desc_en: descEn,
                    icon,
                    isFeatured,
                    points_ar: pointsAr,
                    points_en: pointsEn
                };
                currentData.services.push(newServ);
                showToast("تمت إضافة الخدمة الجديدة بنجاح ✨", "success");
            }

            SiteStore.saveData(currentData);
            closeServiceModal();
            renderServicesList();
            renderOverview();
        });
    }

    // Skills Cloud Tags
    function renderSkillsCloud() {
        const skills = currentData.skills_cloud || [];
        const container = document.getElementById('skillsCloudBadges');
        if (!container) return;

        container.innerHTML = '';
        skills.forEach((skill, index) => {
            const badge = document.createElement('span');
            badge.className = 'skill-removable-badge';
            badge.innerHTML = `
                <span>${skill}</span>
                <i class="fa-solid fa-xmark remove-tag-btn" onclick="removeSkillTag(${index})" title="حذف المهارة"></i>
            `;
            container.appendChild(badge);
        });
    }

    window.removeSkillTag = function (idx) {
        currentData.skills_cloud.splice(idx, 1);
        SiteStore.saveData(currentData);
        renderSkillsCloud();
        renderOverview();
        showToast("تمت إزالة المهارة من السحابة.", "info");
    };

    const addSkillBtn = document.getElementById('addSkillBtn');
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', () => {
            const input = document.getElementById('newSkillInput');
            const val = input.value.trim();
            if (!val) return;

            if (!currentData.skills_cloud) currentData.skills_cloud = [];
            currentData.skills_cloud.push(val);
            SiteStore.saveData(currentData);

            input.value = '';
            renderSkillsCloud();
            renderOverview();
            showToast("تمت إضافة المهارة بنجاح.", "success");
        });
    }

    // -------------------------------------------------------------
    // TAB 5: PORTFOLIO PROJECTS SECTION
    // -------------------------------------------------------------
    function renderProjectsList() {
        const projects = currentData.portfolio || [];
        const container = document.getElementById('projectsCardsGrid');
        if (!container) return;

        container.innerHTML = '';
        projects.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'dynamic-item-card';

            const tagsHtml = (proj.tags || []).map(t => `<span class="mini-tag">${t}</span>`).join('');
            const catLabel = getCategoryLabel(proj.category);

            card.innerHTML = `
                <span class="card-top-badge">${catLabel}</span>
                <div class="item-card-icon">
                    <i class="${proj.icon || 'fa-solid fa-briefcase'}"></i>
                </div>
                <h4 class="item-card-title">${proj.title_ar}</h4>
                <div class="item-card-subtitle">${proj.title_en || ''}</div>
                <p class="item-card-desc">${proj.desc_ar}</p>
                <div class="item-card-tags">
                    ${tagsHtml}
                </div>
                <div class="item-card-footer">
                    <button type="button" class="btn-adm btn-adm-secondary btn-adm-sm" onclick="openEditProjectModal('${proj.id}')">
                        <i class="fa-solid fa-pen-to-square"></i> تعديل
                    </button>
                    <button type="button" class="btn-adm btn-adm-danger btn-adm-sm" onclick="deleteProject('${proj.id}')">
                        <i class="fa-solid fa-trash"></i> حذف
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    function getCategoryLabel(catKey) {
        const cats = currentData.categories || [];
        const found = cats.find(c => c.key === catKey);
        if (found) return found.label_ar;
        if (catKey === 'ai') return 'الذكاء الاصطناعي';
        if (catKey === 'ecommerce') return 'متجر نون آرت';
        if (catKey === 'cs') return 'قسم الحاسوب';
        return catKey;
    }

    let editingProjectId = null;

    window.openAddProjectModal = function () {
        editingProjectId = null;
        document.getElementById('projectModalTitle').textContent = "إضافة مشروع جديد";
        projectForm.reset();
        document.getElementById('projIcon').value = "fa-solid fa-microchip";
        updateIconPreview('projIcon', 'projIconPreview');
        projectModal.classList.add('open');
    };

    window.openEditProjectModal = function (projId) {
        editingProjectId = projId;
        const proj = (currentData.portfolio || []).find(p => p.id === projId);
        if (!proj) return;

        document.getElementById('projectModalTitle').textContent = "تعديل المشروع";
        document.getElementById('projTitleAr').value = proj.title_ar || '';
        document.getElementById('projTitleEn').value = proj.title_en || '';
        document.getElementById('projDescAr').value = proj.desc_ar || '';
        document.getElementById('projDescEn').value = proj.desc_en || '';
        document.getElementById('projCategory').value = proj.category || 'ai';
        document.getElementById('projIcon').value = proj.icon || 'fa-solid fa-microchip';
        document.getElementById('projTags').value = (proj.tags || []).join('، ');
        document.getElementById('projLink').value = proj.link || '';

        updateIconPreview('projIcon', 'projIconPreview');
        projectModal.classList.add('open');
    };

    window.closeProjectModal = function () {
        projectModal.classList.remove('open');
        projectForm.reset();
        editingProjectId = null;
    };

    window.deleteProject = function (projId) {
        if (!confirm("هل أنت متأكد من حذف هذا المشروع من معرض الأعمال؟")) return;
        currentData.portfolio = (currentData.portfolio || []).filter(p => p.id !== projId);
        SiteStore.saveData(currentData);
        renderProjectsList();
        renderOverview();
        showToast("تم حذف المشروع بنجاح.", "info");
    };

    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const titleAr = document.getElementById('projTitleAr').value.trim();
            const titleEn = document.getElementById('projTitleEn').value.trim();
            const descAr = document.getElementById('projDescAr').value.trim();
            const descEn = document.getElementById('projDescEn').value.trim();
            const category = document.getElementById('projCategory').value;
            const icon = document.getElementById('projIcon').value.trim() || 'fa-solid fa-briefcase';
            const tags = document.getElementById('projTags').value.split(/[,،]/).map(t => t.trim()).filter(Boolean);
            const link = document.getElementById('projLink').value.trim() || '#';

            if (!titleAr) {
                showToast("يرجى إدخال عنوان المشروع بالعربية.", "danger");
                return;
            }

            if (!currentData.portfolio) currentData.portfolio = [];

            if (editingProjectId) {
                // Update
                const idx = currentData.portfolio.findIndex(p => p.id === editingProjectId);
                if (idx !== -1) {
                    currentData.portfolio[idx] = {
                        ...currentData.portfolio[idx],
                        title_ar: titleAr,
                        title_en: titleEn,
                        desc_ar: descAr,
                        desc_en: descEn,
                        category,
                        icon,
                        tags,
                        link
                    };
                    showToast("تم تحديث بيانات المشروع بنجاح ✨", "success");
                }
            } else {
                // Add new
                const newProj = {
                    id: 'proj_' + Date.now(),
                    title_ar: titleAr,
                    title_en: titleEn,
                    desc_ar: descAr,
                    desc_en: descEn,
                    category,
                    icon,
                    tags,
                    link
                };
                currentData.portfolio.push(newProj);
                showToast("تمت إضافة المشروع الجديد بنجاح ✨", "success");
            }

            SiteStore.saveData(currentData);
            closeProjectModal();
            renderProjectsList();
            renderOverview();
        });
    }

    // -------------------------------------------------------------
    // TAB 6: CONTACT & SOCIAL LINKS
    // -------------------------------------------------------------
    function renderContactForm() {
        const c = currentData.contact || {};
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val || '';
        };

        setVal('contactEmail', c.email);
        setVal('contactWhatsApp', c.whatsapp);
        setVal('contactWaDisplay', c.whatsapp_display);
        setVal('contactLocationAr', c.location_ar);
        setVal('contactLocationEn', c.location_en);

        const s = c.social || {};
        setVal('socialLinkedin', s.linkedin);
        setVal('socialTwitter', s.twitter);
        setVal('socialGithub', s.github);
        setVal('socialInstagram', s.instagram);
    }

    const saveContactForm = document.getElementById('saveContactForm');
    if (saveContactForm) {
        saveContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const c = currentData.contact || {};
            c.email = document.getElementById('contactEmail').value.trim();
            c.whatsapp = document.getElementById('contactWhatsApp').value.trim();
            c.whatsapp_display = document.getElementById('contactWaDisplay').value.trim();
            c.location_ar = document.getElementById('contactLocationAr').value.trim();
            c.location_en = document.getElementById('contactLocationEn').value.trim();

            c.social = {
                linkedin: document.getElementById('socialLinkedin').value.trim(),
                twitter: document.getElementById('socialTwitter').value.trim(),
                github: document.getElementById('socialGithub').value.trim(),
                instagram: document.getElementById('socialInstagram').value.trim()
            };

            currentData.contact = c;
            SiteStore.saveData(currentData);
            showToast("تم حفظ معلومات التواصل والشبكات بنجاح ✨", "success");
        });
    }

    // -------------------------------------------------------------
    // TAB 7: MESSAGES INBOX
    // -------------------------------------------------------------
    function renderMessagesTable() {
        const msgs = currentData.messages || [];
        const tbody = document.getElementById('messagesTableBody');
        if (!tbody) return;

        if (msgs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--adm-text-muted);">
                        <i class="fa-regular fa-envelope-open" style="font-size: 2.5rem; margin-bottom: 0.8rem; display: block; opacity: 0.5;"></i>
                        لا توجد رسائل واردة حتى الآن.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = msgs.map(m => `
            <tr class="${m.isRead ? '' : 'unread'}">
                <td>${m.isRead ? '<i class="fa-solid fa-envelope-open" style="color:var(--adm-text-light);"></i>' : '<span class="badge-unread">جديدة</span>'}</td>
                <td><strong>${m.name}</strong></td>
                <td><a href="mailto:${m.email}" style="color:var(--adm-accent);">${m.email}</a></td>
                <td>${m.subject}</td>
                <td><small style="color:var(--adm-text-muted);">${m.date}</small></td>
                <td>
                    <div style="display:flex; gap:0.4rem;">
                        <button type="button" class="btn-icon-adm" title="عرض الرسالة كاملة" onclick="openMessageDetail('${m.id}')">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button type="button" class="btn-icon-adm delete" title="حذف الرسالة" onclick="deleteMessageRow('${m.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    window.openMessageDetail = function (msgId) {
        const msg = (currentData.messages || []).find(m => m.id === msgId);
        if (!msg) return;

        // Mark as read
        SiteStore.markMessageRead(msgId);
        refreshAllViews();

        document.getElementById('msgDetailSender').textContent = `${msg.name} (${msg.email})`;
        document.getElementById('msgDetailSubject').textContent = msg.subject;
        document.getElementById('msgDetailDate').textContent = msg.date;
        document.getElementById('msgDetailBody').textContent = msg.message;
        
        const replyMail = document.getElementById('msgReplyMailBtn');
        if (replyMail) {
            replyMail.href = `mailto:${msg.email}?subject=رد على: ${encodeURIComponent(msg.subject)}`;
        }

        viewMessageModal.classList.add('open');
    };

    window.closeMessageModal = function () {
        viewMessageModal.classList.remove('open');
    };

    window.deleteMessageRow = function (msgId) {
        if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
        SiteStore.deleteMessage(msgId);
        refreshAllViews();
        showToast("تم حذف الرسالة بنجاح.", "info");
    };

    // -------------------------------------------------------------
    // TAB 8: SETTINGS & BACKUP
    // -------------------------------------------------------------
    const updatePinForm = document.getElementById('updatePinForm');
    if (updatePinForm) {
        updatePinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const curPin = document.getElementById('curPin').value.trim();
            const newPin = document.getElementById('newPin').value.trim();
            const confirmPin = document.getElementById('confirmPin').value.trim();

            if (curPin !== SiteStore.getPin()) {
                showToast("رمز المرور الحالي غير صحيح!", "danger");
                return;
            }

            if (newPin.length < 4) {
                showToast("رمز المرور الجديد يجب ألا يقل عن 4 أحرف/أرقام.", "danger");
                return;
            }

            if (newPin !== confirmPin) {
                showToast("رمز المرور الجديد وتأكيده غير متطابقين!", "danger");
                return;
            }

            SiteStore.updatePin(newPin);
            updatePinForm.reset();
            showToast("تم تحديث رمز المرور بنجاح! احتفظ به جيداً.", "success");
        });
    }

    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            SiteStore.exportJSON();
            showToast("تم تصدير ملف النسخة الاحتياطية بنجاح 💾", "success");
        });
    }

    const importFileInput = document.getElementById('importFileInput');
    if (importFileInput) {
        importFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (evt) {
                const res = SiteStore.importJSON(evt.target.result);
                if (res.success) {
                    refreshAllViews();
                    showToast("تم استيراد البيانات وتحديث الموقع بنجاح ✨", "success");
                } else {
                    showToast("فشل استيراد الملف: الملف لا يحتوي على بنية بيانات صحيحة.", "danger");
                }
            };
            reader.readAsText(file);
            e.target.value = '';
        });
    }

    const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');
    if (resetDefaultsBtn) {
        resetDefaultsBtn.addEventListener('click', () => {
            if (confirm("تحذير: هل أنت متأكد من استعادة البيانات الافتراضية الأولية؟ سيتم مسح التعديلات غير المصدرة.")) {
                SiteStore.resetData();
                refreshAllViews();
                showToast("تمت استعادة البيانات الافتراضية بنجاح.", "info");
            }
        });
    }

    // Helper: FontAwesome icon preview in modals
    function updateIconPreview(inputId, previewId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        if (input && preview) {
            preview.className = input.value.trim() || 'fa-solid fa-briefcase';
        }
    }

    ['servIcon', 'projIcon'].forEach(id => {
        const inp = document.getElementById(id);
        if (inp) {
            inp.addEventListener('input', () => {
                updateIconPreview(id, id + 'Preview');
            });
        }
    });

    // Run auth check on initialization
    checkAuth();
});
