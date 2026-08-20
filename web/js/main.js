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
        if (window.scrollY > 40) {
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
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
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

    // 5. 真實教養情境互動切換 (Interactive Scenario Switcher)
    const scenarioData = {
        rebel: {
            tag: '日常困擾 #1',
            title: '【唱反調的孩子】你叫他往東，他偏偏往西？',
            context: '當孩子因為誤解而被責備時，第一反應常是頂嘴、摔門或怒罵。很多家長會誤以為孩子在挑釁。',
            solutionTitle: 'EQ 實戰引導心法：',
            solutions: [
                '不站在孩子對立面：先放下指責，給予情緒冷靜空間。',
                '幽默點出答案：用溫和語氣「我看你其實知道標準答案喔～」。',
                '認同孩子的思考難度：「能講出反向答案代表你腦筋動得很快！」。',
                '看懂底層情緒：孩子表面是生氣，底層其實是「委屈」，引導他把委屈說出口。'
            ]
        },
        focus: {
            tag: '日常困擾 #2',
            title: '【專注力不夠的孩子】上課容易分心、坐不住？',
            context: '低年級孩子大腦發育仍在進行中，傳統的「單向說教」很容易讓孩子失去耐心與注意力。',
            solutionTitle: 'EQ 實戰引導心法：',
            solutions: [
                '調整心態：他不是不認真，而是「需要更有趣的互動刺激」。',
                '動態式互動教學：改為快問快答、角色扮演、尋寶任務。',
                '微小成就激勵：設立「看誰能撐到最後」趣味競賽，參與感瞬間飆升。',
                '分段專注練習：從 10 分鐘小目標開始，逐步建立學習耐力。'
            ]
        },
        bullying: {
            tag: '人際困擾 #3',
            title: '【開玩笑？惡作劇？還是校園霸凌？】',
            context: '如果過度防衛把所有碰撞都當霸凌，會失去朋友；但若一味忍讓逃避，孩子容易身陷險境。',
            solutionTitle: 'EQ 實戰引導心法：',
            solutions: [
                '掌握霸凌 3 大要件：1. 長期且持續、2. 故意且惡意、3. 造成身心傷害。',
                '透析 5 大校園角色：加害者、受害者、起鬨者、旁觀者、逃避者。',
                '情境演練學會說「不」：透過戲劇活動練習堅定表達界線。',
                '親師生共同掌握常識：唯有擁有共同語言，才能真正將霸凌杜絕於校園外！'
            ]
        },
        tech: {
            tag: '現代挑戰 #4',
            title: '【手機 3C 沉迷與拖拖拉拉】叫不動怎麼辦？',
            context: '現代孩子面對高刺激數位科技，常因時間感模糊與自制力未成熟而引發家庭風暴。',
            solutionTitle: 'EQ 實戰引導心法：',
            solutions: [
                '無痛約定法：不突襲沒收，提前 5 分鐘、1 分鐘給予緩衝倒數。',
                '情緒共感取代怒吼：理解放下手機時的失落感（「我知道遊戲很好玩，結束很可惜」）。',
                '實體替代方案：用桌遊、戶外運動或親子共讀 EQ 故事書轉移注意力。',
                '父母以身作則：全家設立「無 3C 親子晚餐時光」，營造良好家庭氣氛。'
            ]
        }
    };

    const scenarioButtons = document.querySelectorAll('.scenario-btn');
    const displayTag = document.getElementById('sc-display-tag');
    const displayTitle = document.getElementById('sc-display-title');
    const displayContext = document.getElementById('sc-display-context');
    const displaySolTitle = document.getElementById('sc-display-sol-title');
    const displaySolList = document.getElementById('sc-display-sol-list');

    scenarioButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            scenarioButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const key = btn.getAttribute('data-scenario');
            const data = scenarioData[key];
            if (data && displayTag && displayTitle && displayContext && displaySolList) {
                displayTag.textContent = data.tag;
                displayTitle.textContent = data.title;
                displayContext.textContent = data.context;
                displaySolTitle.textContent = data.solutionTitle;
                displaySolList.innerHTML = data.solutions.map(s => `<li>${s}</li>`).join('');
            }
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

    // 7. FAQ 手風琴 (Accordion)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question?.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            faqItems.forEach(f => f.classList.remove('open'));
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    // 8. 報名與諮詢彈窗 (Modal Logic)
    const modalOverlay = document.getElementById('signup-modal');
    const openModalBtns = document.querySelectorAll('.open-signup-modal');
    const closeModalBtn = document.getElementById('modal-close-btn');
    const signupForm = document.getElementById('signup-form');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modalOverlay?.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    closeModalBtn?.addEventListener('click', () => {
        modalOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    });

    modalOverlay?.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    signupForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('form-name')?.value;
        const phone = document.getElementById('form-phone')?.value;
        const childClass = document.getElementById('form-child-class')?.value;

        showToast(`🎉 感謝 ${name} 家長的熱情報名！我們將盡速與您聯繫，邀請您加入樂利 EQ 志工大家庭！`);
        modalOverlay?.classList.remove('active');
        document.body.style.overflow = '';
        signupForm.reset();
    });

    // 9. 複製與互動 Toast 通知
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
            showToast('📋 已複製 LINE 群組邀請連結！歡迎在手機或 LINE 中開啟加入！');
        }).catch(() => {
            showToast('已為您開啟加入 LINE 群組！');
        });
    };
});
