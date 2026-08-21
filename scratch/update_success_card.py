import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 替換 form-success 內部結構
pattern = r'(<div id="form-success" class="form-success-card" style="display: none;">)(.*?)(</div>\s*</div>\s*</div>\s*</section>)'
replacement = r'''\1
                    <div class="success-icon-wrap">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                    <h3 class="success-title">🎉 報名登記已成功送出！</h3>
                    <p class="success-desc">
                        感謝您為孩子邁出關鍵的一步！<br>
                        我們會盡快跟您聯繫。
                    </p>
                </div>
            </div>
        </div>
    </section>'''

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("index.html updated successfully!")
