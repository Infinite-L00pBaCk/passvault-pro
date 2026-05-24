const fs = require('fs');
let html = fs.readFileSync('public/app.html', 'utf8');

// SVG Replacement Script
html = html.replace('</head>', '<script src="https://unpkg.com/lucide@latest"></script>\n</head>');
html = html.replace('<span class="l-logo">🔐</span>', '<div class="l-logo"><i data-lucide="shield-check" style="width:48px;height:48px;color:var(--accent);stroke-width:2"></i></div>');
html = html.replace('<div class="h-icon">🔐</div>', '<div class="h-icon"><i data-lucide="shield-check" style="width:24px;height:24px;color:var(--accent)"></i></div>');
html = html.replace('🔓 Sign In', '<i data-lucide="unlock" class="icon-sm" style="margin-right:6px"></i> Sign In');
html = html.replace('🚀 Create Account', '<i data-lucide="rocket" class="icon-sm" style="margin-right:6px"></i> Create Account');

html = html.replace('<div class="sc-icon">🗝️</div>', '<div class="sc-icon"><i data-lucide="key"></i></div>');
html = html.replace('<div class="sc-icon">💪</div>', '<div class="sc-icon"><i data-lucide="shield"></i></div>');
html = html.replace('<div class="sc-icon">⚠️</div>', '<div class="sc-icon"><i data-lucide="alert-triangle"></i></div>');
html = html.replace('<div class="sc-icon">♻️</div>', '<div class="sc-icon"><i data-lucide="refresh-cw"></i></div>');

html = html.replace('⚡ Password Generator', '<i data-lucide="zap" class="icon-sm" style="margin-right:8px;color:var(--accent)"></i> Password Generator');
html = html.replace('🎲 Random', '<i data-lucide="dices" class="icon-sm" style="margin-right:6px"></i> Random');
html = html.replace('💬 Passphrase', '<i data-lucide="message-square" class="icon-sm" style="margin-right:6px"></i> Passphrase');
html = html.replace('✏️ Manual', '<i data-lucide="pen-line" class="icon-sm" style="margin-right:6px"></i> Manual');
html = html.replace('>📋<', '><i data-lucide="copy" class="icon-sm"></i><');
html = html.replace('>🔄<', '><i data-lucide="refresh-cw" class="icon-sm"></i><');
html = html.replace('⚡ Generate', '<i data-lucide="zap" class="icon-sm" style="margin-right:6px"></i> Generate');
html = html.replace('📋 Use This Password', '<i data-lucide="clipboard-check" class="icon-sm" style="margin-right:6px"></i> Use This Password');
html = html.replace('💾 Save to Vault', '<i data-lucide="save" class="icon-sm" style="margin-right:6px"></i> Save to Vault');
html = html.replace('🛡 Health Audit', '<i data-lucide="shield-alert" class="icon-sm" style="margin-right:6px"></i> Health Audit');

html = html.replace('🗄️ My Vault', '<i data-lucide="archive" class="icon-md" style="margin-right:8px"></i> My Vault');
html = html.replace('<span class="si">🔍</span>', '<span class="si"><i data-lucide="search" class="icon-sm"></i></span>');

// Select options
html = html.replace(/value="🌐">🌐 Website/g, 'value="globe">Website');
html = html.replace(/value="📧">📧 Email/g, 'value="mail">Email');
html = html.replace(/value="💳">💳 Banking/g, 'value="credit-card">Banking');
html = html.replace(/value="🎮">🎮 Gaming/g, 'value="gamepad-2">Gaming');
html = html.replace(/value="📱">📱 Social/g, 'value="smartphone">Social');
html = html.replace(/value="🛒">🛒 Shopping/g, 'value="shopping-cart">Shopping');
html = html.replace(/value="💼">💼 Work/g, 'value="briefcase">Work');
html = html.replace(/value="☁️">☁️ Cloud/g, 'value="cloud">Cloud');
html = html.replace(/value="🔧">🔧 Dev/g, 'value="wrench">Dev');
html = html.replace(/value="🎵">🎵 Music/g, 'value="music">Music');
html = html.replace(/value="🏥">🏥 Health/g, 'value="heart-pulse">Health');
html = html.replace(/value="🔑">🔑 Other/g, 'value="key">Other');

// Header buttons
html = html.replace('📤 Export', '<i data-lucide="download" class="icon-sm"></i>');
html = html.replace('📥 Import', '<i data-lucide="upload" class="icon-sm"></i>');
html = html.replace('🚪 Sign Out', '<i data-lucide="log-out" class="icon-sm" style="margin-right:6px"></i> Sign Out');

// Modals
html = html.replace('<h3>Delete Password?</h3>', '<h3 style="display:flex;align-items:center;gap:8px"><i data-lucide="trash-2" style="color:var(--accent3)"></i> Delete Password?</h3>');
html = html.replace('🗑 Delete', '<i data-lucide="trash" class="icon-sm" style="margin-right:6px"></i> Delete');
html = html.replace('<h3>✏️ Edit Entry</h3>', '<h3 style="display:flex;align-items:center;gap:8px"><i data-lucide="pen-line" style="color:var(--accent)"></i> Edit Entry</h3>');
html = html.replace('💾 Save', '<i data-lucide="save" class="icon-sm" style="margin-right:6px"></i> Save');
html = html.replace('<h3>🛡 Health Report</h3>', '<h3 style="display:flex;align-items:center;gap:8px"><i data-lucide="shield-alert" style="color:var(--accent)"></i> Health Report</h3>');
html = html.replace('<h3>📤 Export Vault</h3>', '<h3 style="display:flex;align-items:center;gap:8px"><i data-lucide="download" style="color:var(--accent)"></i> Export Vault</h3>');
html = html.replace('<h3>📥 Import Passwords</h3>', '<h3 style="display:flex;align-items:center;gap:8px"><i data-lucide="upload" style="color:var(--accent)"></i> Import Passwords</h3>');
html = html.replace('<div class="ei2">📄</div>', '<div class="ei2"><i data-lucide="file-json" style="width:36px;height:36px;color:var(--accent)"></i></div>');
html = html.replace('<div class="ei2">📊</div>', '<div class="ei2"><i data-lucide="file-spreadsheet" style="width:36px;height:36px;color:var(--accent2)"></i></div>');
html = html.replace('<div class="ii">📁</div>', '<div class="ii"><i data-lucide="upload-cloud" style="width:42px;height:42px;color:var(--accent)"></i></div>');

html = html.replace('</body>', '<script>lucide.createIcons();</script>\n</body>');
fs.writeFileSync('public/app.html', html);
console.log('App.html updated!');
