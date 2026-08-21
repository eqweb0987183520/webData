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

    // 7. 原生深色報名表單非同步提交 (Google Form Seamless Submit)
    const registrationForm = document.getElementById('eq-registration-form');
    const submitBtn = document.getElementById('submit-btn');
    const formSuccess = document.getElementById('form-success');
    const btnResetForm = document.getElementById('btn-reset-form');

    if (registrationForm) {
        const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfSos9SzhP0PsOiHEQKmRzOjoO_N6sKKj7iIXrstmwETB-b7A/formResponse';
        const NOTIFY_EMAIL = 'b0987183520@gmail.com';

        // 非同步寄送通知 Email 至指定信箱
        async function sendEmailNotification(data) {
            try {
                const emailPayload = {
                    _subject: `【樂利 EQ 志工官網】新報名通知：${data.name}（${data.phone}）`,
                    '報名家長姓名': data.name,
                    '聯絡手機': data.phone,
                    'LINE ID': data.line || '（未提供）',
                    '參與項目': data.options.join('、'),
                    '登記時間': new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
                    _template: 'table',
                    _captcha: 'false'
                };

                await fetch(`https://formsubmit.co/ajax/${NOTIFY_EMAIL}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(emailPayload)
                });
            } catch (err) {
                console.warn('Email notification fetch warning (silent):', err);
            }
        }
        
        const nameInput = document.getElementById('form-name');
        const phoneInput = document.getElementById('form-phone');
        const lineInput = document.getElementById('form-line');
        const errorName = document.getElementById('error-name');
        const errorPhone = document.getElementById('error-phone');

        // 即時移除錯誤提示
        nameInput?.addEventListener('input', () => {
            nameInput.classList.remove('is-invalid');
            errorName?.classList.remove('show');
        });

        phoneInput?.addEventListener('input', () => {
            phoneInput.classList.remove('is-invalid');
            errorPhone?.classList.remove('show');
        });

        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            let isValid = true;
            const nameVal = nameInput?.value.trim();
            const phoneVal = phoneInput?.value.trim();
            const lineVal = lineInput?.value.trim() || '';

            if (!nameVal) {
                nameInput?.classList.add('is-invalid');
                errorName?.classList.add('show');
                isValid = false;
            }

            // 簡易台灣電話/手機驗證（至少 8 碼數字）
            const cleanPhone = phoneVal.replace(/[^0-9]/g, '');
            if (!phoneVal || cleanPhone.length < 8) {
                phoneInput?.classList.add('is-invalid');
                errorPhone?.classList.add('show');
                isValid = false;
            }

            if (!isValid) {
                const firstInvalid = registrationForm.querySelector('.is-invalid');
                firstInvalid?.focus();
                return;
            }

            // 收集選取的二選一方案
            const selectedPlan = registrationForm.querySelector('input[name="participation_plan"]:checked')?.value || 'volunteer_only';
            const formOptionsToSubmit = [];

            if (selectedPlan === 'course_and_volunteer') {
                // 方法二：包含擔任志工與EQ線上課程
                formOptionsToSubmit.push('擔任志工', 'EQ線上課程');
            } else {
                // 方法一：單純擔任志工
                formOptionsToSubmit.push('擔任志工');
            }

            // 建立要送往 Google 表單的 FormData / URLSearchParams
            const formData = new URLSearchParams();
            formData.append('entry.602205738', nameVal);     // 姓名
            formData.append('entry.1903577013', phoneVal);   // 手機號碼
            if (lineVal) {
                formData.append('entry.1179144741', lineVal); // LINE ID
            }
            
            // 勾選項目依序傳送
            formOptionsToSubmit.forEach(opt => {
                formData.append('entry.1902119823', opt);
            });

            // 切換按鈕為載入狀態
            if (submitBtn) {
                submitBtn.disabled = true;
                const btnText = submitBtn.querySelector('.btn-text');
                const btnLoading = submitBtn.querySelector('.btn-loading');
                if (btnText && btnLoading) {
                    btnText.style.display = 'none';
                    btnLoading.style.display = 'inline-flex';
                }
            }

            // 非同步寄送 Email 通知至 b0987183520@gmail.com (背景執行不阻礙流程)
            sendEmailNotification({
                name: nameVal,
                phone: phoneVal,
                line: lineVal,
                options: formOptionsToSubmit
            });

            try {
                // 使用 fetch no-cors 模式直接背景寫入 Google Form
                await fetch(GOOGLE_FORM_ACTION_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData.toString()
                });

                // 稍微延遲 500ms 營造舒適流暢感
                await new Promise(r => setTimeout(r, 500));

                // 隱藏報名大標題與表單，顯示極簡成功畫面
                const signupHeader = document.getElementById('signup-header');
                if (signupHeader) {
                    signupHeader.style.display = 'none';
                }
                registrationForm.style.display = 'none';
                if (formSuccess) {
                    formSuccess.style.display = 'block';
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                showToast('🎉 報名資料已成功送出！');
            } catch (err) {
                console.error('表單發送時發生異常:', err);
                
                // Fallback: 建立隱藏 iframe 送出以確保入庫
                submitViaHiddenIframe(GOOGLE_FORM_ACTION_URL, {
                    'entry.602205738': nameVal,
                    'entry.1903577013': phoneVal,
                    'entry.1179144741': lineVal,
                    'entry.1902119823': formOptionsToSubmit
                });

                const signupHeader = document.getElementById('signup-header');
                if (signupHeader) {
                    signupHeader.style.display = 'none';
                }
                registrationForm.style.display = 'none';
                if (formSuccess) {
                    formSuccess.style.display = 'block';
                }
                showToast('🎉 報名登記已完成！');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    const btnText = submitBtn.querySelector('.btn-text');
                    const btnLoading = submitBtn.querySelector('.btn-loading');
                    if (btnText && btnLoading) {
                        btnText.style.display = 'inline-flex';
                        btnLoading.style.display = 'none';
                    }
                }
            }
        });

        const planRadios = registrationForm.querySelectorAll('input[name="participation_plan"]');
        const guaranteeInfo = document.getElementById('online-course-guarantee-info');
        const courseRadio = document.getElementById('plan-course-volunteer');
        const volunteerRadio = document.getElementById('plan-volunteer-only');

        // 監聽參與方案二選一 Radio 切換狀態，動態展示/隱藏保證金激勵機制
        planRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (courseRadio && courseRadio.checked && guaranteeInfo) {
                    guaranteeInfo.style.display = 'block';
                    guaranteeInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else if (guaranteeInfo) {
                    guaranteeInfo.style.display = 'none';
                }
            });
        });

        // 全局函式：外部點擊「保證金退還機制」時自動定位並展開
        window.showGuaranteeInfo = function() {
            const signupSection = document.getElementById('signup');
            if (signupSection) {
                signupSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            if (courseRadio && guaranteeInfo) {
                courseRadio.checked = true;
                guaranteeInfo.style.display = 'block';
                guaranteeInfo.style.boxShadow = '0 0 30px rgba(251, 191, 36, 0.4)';
                setTimeout(() => {
                    guaranteeInfo.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5), 0 0 20px rgba(251, 191, 36, 0.08)';
                }, 2000);
            }
        };

        // 重新填寫按鈕
        btnResetForm?.addEventListener('click', () => {
            registrationForm.reset();
            registrationForm.style.display = 'flex';
            if (volunteerRadio) {
                volunteerRadio.checked = true;
            }
            if (formSuccess) {
                formSuccess.style.display = 'none';
            }
            if (guaranteeInfo) {
                guaranteeInfo.style.display = 'none';
            }
            registrationForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // 輔助函式：透過 Hidden iframe 備援送出
    function submitViaHiddenIframe(actionUrl, data) {
        let iframe = document.getElementById('hidden_iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = 'hidden_iframe';
            iframe.name = 'hidden_iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }

        const hiddenForm = document.createElement('form');
        hiddenForm.action = actionUrl;
        hiddenForm.method = 'POST';
        hiddenForm.target = 'hidden_iframe';
        hiddenForm.style.display = 'none';

        for (const [key, val] of Object.entries(data)) {
            if (Array.isArray(val)) {
                val.forEach(v => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = v;
                    hiddenForm.appendChild(input);
                });
            } else if (val) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = val;
                hiddenForm.appendChild(input);
            }
        }

        document.body.appendChild(hiddenForm);
        hiddenForm.submit();
        setTimeout(() => hiddenForm.remove(), 2000);
    }

    // 8. 複製與互動 Toast 通知
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
        const lineId = 'dorischi0401';
        navigator.clipboard.writeText(lineId).then(() => {
            showToast(`✅ 已複製 LINE ID：${lineId}，請至 LINE 搜尋好友！`);
        }).catch(() => {
            showToast(`LINE ID：${lineId}`);
        });
    };

    window.copyLineId = function(id = 'dorischi0401') {
        navigator.clipboard.writeText(id).then(() => {
            showToast(`✅ 已複製 LINE ID：${id}，請至 LINE 搜尋好友！`);
        }).catch(() => {
            showToast(`LINE ID：${id}`);
        });
    };
});

