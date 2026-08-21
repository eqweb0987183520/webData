/**
 * =========================================================================
 * 樂利國小 EQ 志工官網 - 官方專屬 Email 通知系統 (Google Apps Script)
 * =========================================================================
 * 特點：
 * 1. 0 廣告、0 雜訊（無任何第三方英文贊助與版權字樣）。
 * 2. 100% 繁體中文、客製化信件主旨與精緻 480px 小表格設計。
 * 3. 使用 Google 官方 Gmail 伺服器直接發信，穩定度 100%，不進垃圾信件匣。
 *
 * 【設定步驟（只需 1 分鐘）】：
 * 1. 開啟連結此報名表單的「Google 試算表」。
 * 2. 點擊頂部選單「擴充功能」->「Apps Script」。
 * 3. 將原本的內容全部清空，貼上下方全部程式碼。
 * 4. 點擊上方的「💾 儲存」圖示。
 * 5. 點擊左側「⏰ 觸發條件 (Triggers)」圖示 -> 點右下角「+ 新增觸發條件」：
 *    - 選擇要執行的功能：onFormSubmit
 *    - 選取事件來源：來自試算表
 *    - 選取事件類型：提交表單時
 * 6. 點擊「儲存」並允許授權即可完成！
 */

function onFormSubmit(e) {
  // 收件人 Email
  var recipient = "b0987183520@gmail.com";
  
  // 取得最新一筆提交的資料
  var values = e ? e.values : [];
  var timestamp = values[0] || new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
  var name = values[1] || "未提供";
  var phone = values[2] || "未提供";
  var lineId = values[3] || "（未提供）";
  var plan = values[4] || "擔任志工";

  // 信件主旨（依您指定格式）
  var subject = "【樂利 EQ 志工官網】新報名通知：" + name + "（" + phone + "）";

  // 精緻小表格 HTML 郵件內容 (寬度 460px，無 Name/Value 冗餘表頭，排版清晰美觀)
  var htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
      <div style="text-align: center; padding-bottom: 16px; border-bottom: 2px solid #f59e0b;">
        <h2 style="margin: 0; font-size: 20px; color: #d97706;">🌟 樂利 EQ 志工組 - 新夥伴報名通知</h2>
      </div>
      
      <div style="margin-top: 18px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 8px; font-weight: bold; color: #64748b; width: 130px;">新夥伴姓名</td>
            <td style="padding: 12px 8px; color: #0f172a; font-weight: 600;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 8px; font-weight: bold; color: #64748b;">新夥伴手機</td>
            <td style="padding: 12px 8px; color: #0f172a; font-weight: 600;"><a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 8px; font-weight: bold; color: #64748b;">新夥伴 Line ID</td>
            <td style="padding: 12px 8px; color: #0f172a; font-weight: 600;">${lineId}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 8px; font-weight: bold; color: #64748b;">新夥伴參與項目</td>
            <td style="padding: 12px 8px; color: #059669; font-weight: 600;">${plan}</td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; font-weight: bold; color: #64748b;">新夥伴報名時間</td>
            <td style="padding: 12px 8px; color: #475569;">${timestamp}</td>
          </tr>
        </table>
      </div>

      <div style="margin-top: 20px; padding-top: 14px; border-top: 1px dashed #cbd5e1; font-size: 13px; color: #94a3b8; text-align: center;">
        此信件由 樂利國小 EQ 志工官方網站 自動發送
      </div>
    </div>
  `;

  // 直接使用 Gmail 官方服務寄出
  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    htmlBody: htmlBody
  });
}
