const fs = require('fs');
const path = require('path');

// 1. UPDATE STYLE.CSS
let css = fs.readFileSync('public/style.css', 'utf8');

// Update Monospace font
css = css.replace(/'Courier New', monospace/g, "'JetBrains Mono', 'Fira Code', monospace");

// Update Scrollbar
css = css.replace(/::-webkit-scrollbar{.*?}/g, '::-webkit-scrollbar{width:8px;height:8px}');
css = css.replace(/::-webkit-scrollbar-track{.*?}/g, '::-webkit-scrollbar-track{background:rgba(255,255,255,0.1);border-radius:10px;margin: 8px}');
css = css.replace(/::-webkit-scrollbar-thumb{.*?}/g, '::-webkit-scrollbar-thumb{background:rgba(115,66,226,0.3);border-radius:10px;border: 2px solid transparent;background-clip: padding-box}');
css = css.replace(/::-webkit-scrollbar-thumb:hover{.*?}/g, '::-webkit-scrollbar-thumb:hover{background-color:rgba(115,66,226,0.6)}');

// Add micro-animations
if (!css.includes('modalSlideUp')) {
  css += `
@keyframes modalSlideUp {
  from { opacity: 0; transform: translateY(30px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.mo.open .md { animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
`;
}
fs.writeFileSync('public/style.css', css);

// 2. UPDATE APP.JS Empty State
let js = fs.readFileSync('public/app.js', 'utf8');
const oldEmptyState = `document.getElementById('vlist').innerHTML='<div class="vempty"><div class="bi">'+getIconHTML('key')+'</div><p>'+(entries.length===0?'Your vault is empty. Generate and save your first password!':'No results found.')+'</p></div>';`;

const newEmptyState = `document.getElementById('vlist').innerHTML='<div class="vempty" style="padding: 80px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; border: 1px solid rgba(255,255,255,0.4); box-shadow: inset 0 0 40px rgba(115,66,226,0.05);">' +
'<div class="bi" style="background: rgba(115,66,226,0.1); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 24px rgba(115,66,226,0.2); margin-bottom: 0; opacity: 1">' +
'<i data-lucide="' + (entries.length===0 ? 'sparkles' : 'search-x') + '" style="width: 40px; height: 40px; color: var(--accent);"></i></div>' +
'<h3 style="font-size: 20px; font-weight: 800; color: var(--text); margin-top: 8px;">' + (entries.length===0 ? 'Your Vault is Empty' : 'No Results Found') + '</h3>' +
'<p style="color: var(--muted2); font-size: 14px; max-width: 320px; text-align: center; line-height: 1.6;">' + (entries.length===0 ? 'Generate an ironclad password above, or securely import an existing vault to get started.' : 'Try adjusting your search or filters to find what you are looking for.') + '</p>' +
'</div>';`;

js = js.replace(oldEmptyState, newEmptyState);
fs.writeFileSync('public/app.js', js);

// 3. CREATE FAVICON.SVG
const faviconSvg = `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGradFav" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7342E2" />
      <stop offset="50%" stop-color="#A583ED" />
      <stop offset="100%" stop-color="#E9D5FF" />
    </linearGradient>
  </defs>
  <path d="M32 4 L56 12 V32 C56 46 32 60 32 60 C32 60 8 46 8 32 V12 L32 4 Z" stroke="url(#logoGradFav)" stroke-width="5" stroke-linejoin="round" />
  <circle cx="32" cy="26" r="10" stroke="url(#logoGradFav)" stroke-width="4" />
  <path d="M30 36 V53 H36 V49 H32 V45 H36 V41 H32 V36 Z" fill="url(#logoGradFav)" />
  <path d="M28 26 C28 24 30 22 32 22 C34 22 36 24 36 26" stroke="url(#logoGradFav)" stroke-width="1.5" stroke-linecap="round" />
  <path d="M26 26 C26 22.5 28.5 20 32 20 C35.5 20 38 22.5 38 26" stroke="url(#logoGradFav)" stroke-width="1.5" stroke-linecap="round" />
</svg>`;
fs.writeFileSync('public/favicon.svg', faviconSvg);

// 4. UPDATE HTML FILES (Fonts & Favicon)
function updateHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  if (!html.includes('JetBrains+Mono')) {
    html = html.replace('<head>', '<head>\\n<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet"/>');
  }
  if (!html.includes('favicon.svg')) {
    html = html.replace('<head>', '<head>\\n<link rel="icon" type="image/svg+xml" href="/favicon.svg"/>');
  }
  fs.writeFileSync(filePath, html);
}

updateHtml('public/app.html');
updateHtml('index.html');

console.log('Premium polish applied successfully!');
