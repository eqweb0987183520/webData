/**
 * 樂利國小 EQ 志工組官方網站 - 核心互動邏輯
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 深淺色主題切換 (Dark / Light Theme Toggle)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // 讀取本機偏好或系統預設
    const savedTheme = localStorage.getItem('leli-eq-theme') || 
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    
    setTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('leli-eq-theme', theme);
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = theme === 'dark' 
                ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
                : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
            themeToggleBtn.setAttribute('title', theme === 'dark' ? '切換為淺色模式' : '切換為深色模式');
        }
    }

    // 2. 導覽列滾動陰影與毛玻璃效果
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });

    // 3. 滾動進場顯現動畫 (Scroll Reveal)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. 行動版選單切換 (Mobile Drawer)
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    
    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileDrawer.classList.toggle('open');
        });

        // 點擊選單項目自動關閉
        mobileDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('open');
            });
        });
    }

    // 5. 三大核心與四大教養情境卡片點擊展開/收合 (Collapsible Cards)
    const collapsibleCards = document.querySelectorAll('.pillar-card.collapsible, .scenario-card.collapsible');
    collapsibleCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('open');
        });
    });

    // 6. 新生家長入學焦慮小測驗 (Interactive Anxiety & EQ Quiz)
    const quizOptions = document.querySelectorAll('.quiz-option-btn');
    const quizResult = document.getElementById('quiz-result');
    const quizResultText = document.getElementById('quiz-result-text');

    quizOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const advice = btn.getAttribute('data-advice');
            if (quizResult && quizResultText && advice) {
                quizResultText.innerHTML = advice;
                quizResult.style.display = 'block';
                quizResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });

    // 7. 複製與互動 Toast 通知
    window.showToast = function(msg) {
        let toast = document.getElementById('global-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'global-toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    };

    window.copyLineInvite = function() {
        navigator.clipboard.writeText('https://line.me/ti/g2/leli_eq_volunteer').then(() => {
            showToast('📋 已複製 LINE 群組邀請連結 歡迎在手機或 LINE 中開啟加入！');
        }).catch(() => {
            showToast('已為您開啟加入 LINE 群組！');
        });
    };

    window.copyLineId = function(id = 'dorischi0401') {
        navigator.clipboard.writeText(id).then(() => {
            showToast(`📋 已複製 LINE ID: ${id} 歡迎在 LINE 搜尋好友諮詢！`);
        }).catch(() => {
            showToast(`LINE ID: ${id}`);
        });
    };
});
