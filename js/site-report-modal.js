/**
 * =========================================================================
 * 網站問題回報彈窗元件 (Site Issue Report Modal)
 * =========================================================================
 * 特點：
 * 1. 徹底取代 mailto: 模式，絕不開啟 Outlook 或任何第三方郵件軟體。
 * 2. 獨立注入毛玻璃 (Glassmorphism) 彈窗與專屬樣式，防衝突相容全站。
 * 3. 採用非同步 AJAX 直接傳送至 a0987183520@gmail.com。
 * 4. 欄位優化：問題描述設為【必填】，姓名、電話、LINE ID 設為【選填】。
 * 5. 支援 Esc 鍵、點擊背景遮罩、✕ 按鈕平滑關閉。
 */

(function () {
    // 1. 注入專屬獨立 CSS 樣式
    const style = document.createElement('style');
    style.id = 'site-report-modal-style';
    style.textContent = `
        .site-report-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(8, 12, 16, 0.78);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            box-sizing: border-box;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.25s ease, visibility 0.25s ease;
        }

        .site-report-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .site-report-card {
            background: #111827;
            border: 1px solid rgba(251, 191, 36, 0.35);
            border-radius: 20px;
            width: 100%;
            max-width: 480px;
            max-height: 92vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 35px rgba(251, 191, 36, 0.15);
            color: #f3f4f6;
            transform: scale(0.92) translateY(16px);
            transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
            padding: 1.6rem 1.8rem;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans TC", sans-serif;
            position: relative;
        }

        .site-report-overlay.active .site-report-card {
            transform: scale(1) translateY(0);
        }

        .site-report-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 1rem;
            margin-bottom: 1.2rem;
        }

        .site-report-header-left {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .site-report-icon-box {
            font-size: 1.8rem;
            line-height: 1;
        }

        .site-report-title {
            font-size: 1.25rem;
            font-weight: 800;
            color: #fbbf24;
            margin: 0;
            line-height: 1.3;
        }

        .site-report-sub {
            font-size: 0.82rem;
            color: #94a3b8;
            margin: 0.25rem 0 0 0;
            line-height: 1.4;
        }

        .site-report-close-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: #94a3b8;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            flex-shrink: 0;
            padding: 0;
            line-height: 1;
        }

        .site-report-close-btn:hover {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
            border-color: rgba(239, 68, 68, 0.4);
            transform: rotate(90deg);
        }

        .site-report-form-group {
            margin-bottom: 1rem;
            text-align: left;
        }

        .site-report-label {
            display: block;
            font-size: 0.88rem;
            font-weight: 600;
            color: #e2e8f0;
            margin-bottom: 0.35rem;
        }

        .site-report-required {
            color: #f87171;
            margin-left: 0.2rem;
        }

        .site-report-badge-source {
            display: inline-block;
            background: rgba(251, 191, 36, 0.12);
            border: 1px solid rgba(251, 191, 36, 0.35);
            color: #fbbf24;
            font-size: 0.82rem;
            font-weight: 700;
            padding: 0.35rem 0.75rem;
            border-radius: 8px;
            width: 100%;
            box-sizing: border-box;
        }

        .site-report-input, .site-report-textarea {
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 10px;
            padding: 0.65rem 0.85rem;
            color: #f8fafc;
            font-size: 0.92rem;
            box-sizing: border-box;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
            font-family: inherit;
        }

        .site-report-input:focus, .site-report-textarea:focus {
            outline: none;
            border-color: #fbbf24;
            box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.18);
            background: rgba(255, 255, 255, 0.08);
        }

        .site-report-input::placeholder, .site-report-textarea::placeholder {
            color: #64748b;
            font-size: 0.85rem;
        }

        .site-report-actions {
            margin-top: 1.4rem;
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
        }

        .site-report-submit-btn {
            width: 100%;
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            color: #0f172a;
            border: none;
            border-radius: 12px;
            padding: 0.8rem;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);
        }

        .site-report-submit-btn:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(245, 158, 11, 0.45);
        }

        .site-report-submit-btn:disabled {
            opacity: 0.65;
            cursor: not-allowed;
            transform: none;
        }

        .site-report-status-box {
            display: none;
            padding: 0.75rem 0.9rem;
            border-radius: 10px;
            font-size: 0.88rem;
            margin-bottom: 1rem;
            line-height: 1.5;
            text-align: center;
        }

        .site-report-status-box.success {
            display: block;
            background: rgba(34, 197, 94, 0.12);
            border: 1px solid rgba(34, 197, 94, 0.35);
            color: #4ade80;
        }

        .site-report-status-box.error {
            display: block;
            background: rgba(239, 68, 68, 0.12);
            border: 1px solid rgba(239, 68, 68, 0.35);
            color: #f87171;
        }

        .site-report-tip {
            font-size: 0.78rem;
            color: #64748b;
            text-align: center;
            margin-top: 0.3rem;
        }

        @keyframes siteReportSpin {
            to { transform: rotate(360deg); }
        }
        .site-report-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(15, 23, 42, 0.25);
            border-top-color: #0f172a;
            border-radius: 50%;
            animation: siteReportSpin 0.75s linear infinite;
        }
    `;
    document.head.appendChild(style);

    // 2. 注入 Modal HTML
    function createModalHTML() {
        if (document.getElementById('siteReportModal')) return;

        const overlay = document.createElement('div');
        overlay.id = 'siteReportModal';
        overlay.className = 'site-report-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'siteReportModalTitle');

        overlay.innerHTML = `
            <div class="site-report-card" onclick="event.stopPropagation()">
                <div class="site-report-header">
                    <div class="site-report-header-left">
                        <div class="site-report-icon-box">🛠️</div>
                        <div>
                            <h3 class="site-report-title" id="siteReportModalTitle">網站問題與建議回報</h3>
                            <p class="site-report-sub">感謝您的協助！我們將直接收到您的建議並盡速處理</p>
                        </div>
                    </div>
                    <button type="button" class="site-report-close-btn" onclick="closeSiteReportModal()" aria-label="關閉視窗">✕</button>
                </div>

                <div id="siteReportStatus" class="site-report-status-box"></div>

                <form id="siteReportForm" onsubmit="handleSiteReportSubmit(event)">
                    <div class="site-report-form-group">
                        <label class="site-report-label">回報來源網頁</label>
                        <div id="siteReportSourceDisplay" class="site-report-badge-source">【當前頁面】</div>
                        <input type="hidden" id="siteReportSource" name="回報來源網頁" value="">
                    </div>

                    <div class="site-report-form-group">
                        <label class="site-report-label" for="siteReportMessage">
                            問題描述或建議事項 <span class="site-report-required">*（必填）</span>
                        </label>
                        <textarea id="siteReportMessage" class="site-report-textarea" name="問題描述" rows="4" placeholder="請簡述您發現的問題、排版異常、文字勘誤或改進建議..." required></textarea>
                    </div>

                    <div class="site-report-form-group">
                        <label class="site-report-label" for="siteReportName">您的稱謂 / 姓名（選填）</label>
                        <input type="text" id="siteReportName" class="site-report-input" name="稱謂或姓名" placeholder="例：陳先生 / 林媽媽 / 志工夥伴">
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.75rem;">
                        <div class="site-report-form-group">
                            <label class="site-report-label" for="siteReportPhone">聯絡手機 / 電話（選填）</label>
                            <input type="tel" id="siteReportPhone" class="site-report-input" name="聯絡電話" placeholder="例：0912-345-678">
                        </div>
                        <div class="site-report-form-group">
                            <label class="site-report-label" for="siteReportLine">LINE ID（選填）</label>
                            <input type="text" id="siteReportLine" class="site-report-input" name="LINE_ID" placeholder="方便截圖線上說明">
                        </div>
                    </div>

                    <div class="site-report-actions">
                        <button type="submit" id="siteReportSubmitBtn" class="site-report-submit-btn">
                            <span>🚀 送出回報資料</span>
                        </button>
                        <div class="site-report-tip">
                            ※ 回報內容將自動安全發送至開發者信箱 a0987183520@gmail.com
                        </div>
                    </div>
                </form>
            </div>
        `;

        // 點擊半透明背景關閉
        overlay.addEventListener('click', function () {
            closeSiteReportModal();
        });

        document.body.appendChild(overlay);
    }

    // 3. 開啟彈窗
    window.openSiteReportModal = function (sourceName) {
        createModalHTML();
        const overlay = document.getElementById('siteReportModal');
        const sourceDisplay = document.getElementById('siteReportSourceDisplay');
        const sourceInput = document.getElementById('siteReportSource');
        const statusBox = document.getElementById('siteReportStatus');
        const form = document.getElementById('siteReportForm');
        const submitBtn = document.getElementById('siteReportSubmitBtn');

        const title = sourceName || document.title.split('｜')[0].split('‧')[0].trim() || '本站';
        if (sourceDisplay) sourceDisplay.textContent = title;
        if (sourceInput) sourceInput.value = title;

        if (statusBox) {
            statusBox.className = 'site-report-status-box';
            statusBox.textContent = '';
            statusBox.style.display = 'none';
        }
        if (form) {
            form.style.display = 'block';
            form.reset();
        }
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>🚀 送出回報資料</span>';
        }

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            const textarea = document.getElementById('siteReportMessage');
            if (textarea) textarea.focus();
        }, 150);
    };

    // 4. 關閉彈窗
    window.closeSiteReportModal = function () {
        const overlay = document.getElementById('siteReportModal');
        if (overlay) {
            overlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    };

    // 5. 處理表單非同步 AJAX 送件
    window.handleSiteReportSubmit = async function (event) {
        event.preventDefault();
        const submitBtn = document.getElementById('siteReportSubmitBtn');
        const statusBox = document.getElementById('siteReportStatus');
        const form = document.getElementById('siteReportForm');

        const source = document.getElementById('siteReportSource').value || document.title;
        const message = document.getElementById('siteReportMessage').value.trim();
        const name = document.getElementById('siteReportName').value.trim() || '熱心訪客（未具名）';
        const phone = document.getElementById('siteReportPhone').value.trim() || '未提供';
        const line = document.getElementById('siteReportLine').value.trim() || '未提供';

        if (!message) {
            statusBox.className = 'site-report-status-box error';
            statusBox.textContent = '⚠️ 請填寫問題描述或建議內容！';
            statusBox.style.display = 'block';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="site-report-spinner"></span><span>正在傳送回報...</span>';

        const now = new Date();
        const timeString = now.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

        const payload = {
            _subject: `【網站問題回報】來自 ${source} 的建議反饋`,
            '回報來源': source,
            '問題描述': message,
            '稱謂/姓名': name,
            '聯絡電話': phone,
            'LINE ID': line,
            '回報時間': timeString,
            '網頁網址': window.location.href,
            _template: 'box',
            _captcha: 'false'
        };

        try {
            // 發送至 a0987183520@gmail.com
            await fetch('https://formsubmit.co/ajax/a0987183520@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            // 雙保險備援
            fetch('https://formsubmit.co/ajax/b39dab05cb18b87c6643ff6e3833cf4c', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(() => {});

            statusBox.className = 'site-report-status-box success';
            statusBox.innerHTML = '🎉 <strong>感謝您的寶貴回報！</strong><br>資料已成功送達陳新昱信箱 (a0987183520@gmail.com)，我們將盡快查閱並改善！';
            statusBox.style.display = 'block';
            form.style.display = 'none';

            setTimeout(() => {
                closeSiteReportModal();
            }, 2500);

        } catch (err) {
            console.error('Report submission error:', err);
            statusBox.className = 'site-report-status-box error';
            statusBox.innerHTML = '⚠️ 網路連線繁忙，但您可直接加 LINE 或發信至 a0987183520@gmail.com 感謝您！';
            statusBox.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>重試送出</span>';
        }
    };

    // 6. 按 Esc 鍵關閉
    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            closeSiteReportModal();
        }
    });

    // 7. 自動綁定含有 data-site-report 或 .btn-site-report 之按鈕
    function bindReportButtons() {
        createModalHTML();
        document.body.addEventListener('click', function (e) {
            const target = e.target.closest('.btn-site-report, [data-site-report]');
            if (target) {
                e.preventDefault();
                const source = target.getAttribute('data-site-report') || target.getAttribute('data-source') || document.title;
                openSiteReportModal(source);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindReportButtons);
    } else {
        bindReportButtons();
    }
})();
