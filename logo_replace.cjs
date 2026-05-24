const fs = require('fs');
let html = fs.readFileSync('public/app.html', 'utf8');

const svgCode = `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
  <defs>
    <linearGradient id="logoGrad3" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#7342E2" />
      <stop offset="50%" stop-color="#A583ED" />
      <stop offset="100%" stop-color="#E9D5FF" />
    </linearGradient>
  </defs>
  <path d="M32 4 L56 12 V32 C56 46 32 60 32 60 C32 60 8 46 8 32 V12 L32 4 Z" stroke="url(#logoGrad3)" stroke-width="5" stroke-linejoin="round" />
  <circle cx="32" cy="26" r="10" stroke="url(#logoGrad3)" stroke-width="4" />
  <path d="M30 36 V53 H36 V49 H32 V45 H36 V41 H32 V36 Z" fill="url(#logoGrad3)" />
  <path d="M28 26 C28 24 30 22 32 22 C34 22 36 24 36 26" stroke="url(#logoGrad3)" stroke-width="1.5" stroke-linecap="round" />
  <path d="M26 26 C26 22.5 28.5 20 32 20 C35.5 20 38 22.5 38 26" stroke="url(#logoGrad3)" stroke-width="1.5" stroke-linecap="round" />
</svg>`;

html = html.replace('<div class="l-logo"><i data-lucide="shield-check" style="width:48px;height:48px;color:var(--accent);stroke-width:2"></i></div>', `<div class="l-logo" style="width:52px;height:52px;margin:0 auto 15px;filter:drop-shadow(0 4px 12px rgba(115,66,226,0.3))">${svgCode}</div>`);

html = html.replace('<div class="h-icon"><i data-lucide="shield-check" style="width:24px;height:24px;color:var(--accent)"></i></div>', `<div class="h-icon" style="width:28px;height:28px;margin-right:12px;filter:drop-shadow(0 2px 8px rgba(115,66,226,0.3))">${svgCode}</div>`);

fs.writeFileSync('public/app.html', html);
console.log('App.html updated with custom SVG logo!');
