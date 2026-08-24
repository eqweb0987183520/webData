# 樂利國小 EQ 志工官方網站 - 核心架構與開發規範 (AGENTS.md)

本檔案為專案當前權威架構與開發規範，記錄所有核心決策、設計標準與部署流程。

---

## 📌 1. 專案基本資訊
- **專案名稱**：樂利國小 EQ 志工官方網站
- **官方網站網址**：https://eqweb0987183520.github.io/webData/
- **主要 GitHub 倉庫**：https://github.com/eqweb0987183520/webData.git
- **主要分支**：`main`（原始程式碼）、`gh-pages`（GitHub Pages 線上部署）
- **雙目錄同步規範**：專案根目錄與 `web/` 目錄必須 100% 同步。

---

## 🎨 2. UI / UX 設計與排版規範
1. **配色與視覺主題**：
   - 核心色調：高級黑金風（Midnight Slate + Amber Gold + Emerald Green）。
   - 全端強制固定為純黑金深色主題（`data-theme="dark"`），全平台（含 iOS/Safari/LINE）一致黑底，移除白底淺色模式。
   - 支援 `<meta name="color-scheme" content="dark">` 與 `<meta name="theme-color" content="#060b09">` 確保瀏覽器狀態列融合。
   - 卡片邊框一律使用高對比質感邊框（`1.5px solid rgba(251, 191, 36, 0.35)`），避免在未展開時看不清區塊邊界。
2. **參與方式雙軌架構**：
   - **方法一（輕度學習）**：🌱 擔任志工（需擔任 EQ 講師的助手 8 小時，每學期僅 4 次，下午 13:00~15:00）。
   - **方法二（認真學習）**：包含三大模組（💻 線上課程、👥 線上共學、🌱 擔任志工）。
   - 全面採用清晰雙行排版，主說明與括號詳細說明字級一致（`0.95rem`），結構整齊。
3. **右下角懸浮按鈕**：
   - 文案：「加 Line 私訊諮詢」。
   - X 座標透過 `right: max(1.5rem, calc((100vw - 1060px) / 2 + 1.5rem))` 精準垂直對齊右上角標頭「立即報名」按鈕。
   - 點擊一律複製純字串 `dorischi0401`。

---

## 📝 3. 原生表單與通知系統架構
1. **二選一互斥單選（Radio）**：
   - `方法一:輕度學習(擔任志工)`
   - `方法二:認真學習(擔任志工+線上學習)`
   - 僅在勾選方法二時，動態展開保證金卡片（`#online-course-guarantee-info`）。
2. **報名成功畫面**：
   - 自動隱藏頂部「線上立即報名」標題。
   - 呈現極簡成功卡片（「🎉 報名登記已成功送出！」「感謝您為孩子邁出關鍵的一步！<br>我們會盡快跟您聯繫。」）。
   - 移除所有多餘跳轉與重新填寫按鈕。
3. **即時 Email 通知機制**：
   - 郵件主旨：`【樂利 EQ 志工官網】新報名通知：[姓名]（[手機]）`。
   - 欄位對齊：`新夥伴姓名`、`新夥伴手機`、`新夥伴Line ID`、`新夥伴參與項目`、`新夥伴報名時間`。
   - 採用 Google Apps Script 官方專屬腳本（`google_apps_script_notification.js`），實現 0 廣告、480px 精緻小表格與 100% Gmail 官方直發。

---

## 🖼️ 4. 靜態資源效能與圖片最佳實踐
1. **圖片優化標準**：
   - 採用 `quality=85` + `progressive=True` + `optimize=True` 漸進式 JPEG 編碼。
   - 全站圖片體積縮減 65.2%（從 3.8MB 降至 1.32MB），同時維持 100% 原始解析度視覺無損。
2. **快取破除（Cache Busting）**：
   - CSS/JS 引入一律帶上最新版本參數（如 `css/style.css?v=2.00`）。
   - 關鍵首頁主圖帶上版本參數（如 `images/hero_eq_parent_child.jpg?v=1.26`），確保手機 LINE 內建瀏覽器即時更新。

---

## 🚀 5. 版本管理與 Checkpoint 流程
- **小版增量**：`v1.01`, `v1.02` ... `v1.29`
- **穩定大版**：`v2.00`（里程碑穩定版）
- **發布流程**：
  1. 檔案同步到 `web/` 目錄。
  2. 更新 `Checkpoints.md` 記錄。
  3. `git add .` ➔ `git commit -m "checkpoint: [vX.XX] - ..."` ➔ `git tag vX.XX`。
  4. `git push origin main --tags` ➔ `git push origin main:gh-pages -f`。
