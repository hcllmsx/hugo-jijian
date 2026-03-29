import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import yaml from 'js-yaml';

const PUBLIC_DIR = path.resolve('public');
const CONFIG_FILE = path.resolve('hugo.yaml');
const ENCRYPT_MARKER = 'id="encrypt-container"';

// 读取配置
let authDuration = 3600; // 默认 1 小时
try {
  if (fs.existsSync(CONFIG_FILE)) {
    const config = yaml.load(fs.readFileSync(CONFIG_FILE, 'utf8'));
    if (config.params && config.params.authDuration !== undefined) {
      authDuration = parseInt(config.params.authDuration);
    }
  }
} catch (e) {
  console.warn('[Encrypt] Failed to read authDuration from hugo.yaml, using default 3600s');
}

/**
 * 核心加密库 (Node.js 端)
 */
function encrypt(plaintext, password) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const tag = cipher.getAuthTag().toString('base64');

  return `${salt.toString('base64')}.${iv.toString('base64')}.${tag}.${encrypted}`;
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath);
    } else if (file.endsWith('.html')) {
      processFile(filePath);
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes(ENCRYPT_MARKER)) return;

  console.log(`[Encrypt] Processing: ${filePath}`);

  // 增强的正则，捕获密码、i18n 标签和待加密内容
  const regex = /<div id="encrypt-container">[\s\S]*?<div id="hcl-pw-raw"[^>]*>([^<]+)<\/div>\s*(<div id="hcl-i18n"[\s\S]*?><\/div>)([\s\S]+?)<div id="hcl-content-end"[^>]*><\/div>[\s\S]*?<\/div>/g;

  function getAttr(tag, attr) {
    const m = new RegExp(`${attr}="([^"]*)"`).exec(tag);
    return m ? m[1] : '';
  }

  let match;
  while ((match = regex.exec(content)) !== null) {
    const [fullMatch, password, i18nTag, innerHtml] = match;
    const encryptedData = encrypt(innerHtml.trim(), password);

    // 提取翻译文本
    const t = {
      title: getAttr(i18nTag, 'data-title'),
      tip: getAttr(i18nTag, 'data-tip'),
      placeholder: getAttr(i18nTag, 'data-placeholder'),
      button: getAttr(i18nTag, 'data-button'),
      back: getAttr(i18nTag, 'data-back'),
      error: getAttr(i18nTag, 'data-error')
    };

    const decryptionUI = `
<div class="hcl-encrypt-wrapper">
  <div class="hcl-encrypt-card">
    <div class="hcl-icon">🔒</div>
    <div class="hcl-title">${t.title}</div>
    <div class="hcl-tip">${t.tip}</div>
    <div class="hcl-input-group">
      <input type="password" id="hcl-pw-input" placeholder="${t.placeholder}" onkeypress="if(event.key==='Enter')hclDecrypt(null, true)">
      <button type="button" onclick="hclDecrypt(null, true)" class="hcl-btn-primary">${t.button}</button>
      <a href="javascript:history.back()" class="hcl-btn-back">${t.back}</a>
    </div>
    <div id="hcl-msg" class="hcl-error"></div>
  </div>
  <template id="hcl-data">${encryptedData}</template>
</div>

<style>
.hcl-encrypt-wrapper { margin: 60px auto; padding: 20px; max-width: 420px; text-align: center; font-family: inherit; }
.hcl-encrypt-card { background: rgba(255, 255, 255, 0.7) !important; backdrop-filter: blur(25px) saturate(200%); -webkit-backdrop-filter: blur(25px) saturate(200%); border: 1px solid rgba(255, 255, 255, 0.4) !important; border-radius: 30px; padding: 50px 40px; box-shadow: 0 30px 60px -12px rgba(0,0,0,0.18); position: relative; z-index: 999; }
[data-theme='dark'] .hcl-encrypt-card { background: rgba(30, 30, 32, 0.9) !important; border-color: rgba(255, 255, 255, 0.1) !important; box-shadow: 0 30px 60px -12px rgba(0,0,0,0.5); }
.hcl-icon { font-size: 60px; margin-bottom: 25px; animation: hcl-float 3s ease-in-out infinite; }
@keyframes hcl-float { 0% { transform: translateY(0px); } 50% { transform: translateY(-12px); } 100% { transform: translateY(0px); } }
.hcl-title { font-size: 1.5rem; font-weight: 700; color: #1d1d1f; margin-bottom: 12px; }
[data-theme='dark'] .hcl-title { color: #f1f1f1; }
.hcl-tip { font-size: 0.95rem; color: #86868b; margin-bottom: 40px; }
.hcl-input-group { display: flex; flex-direction: column; gap: 14px; }
#hcl-pw-input { background: rgba(0, 0, 0, 0.05); border: 2px solid transparent; padding: 18px 20px; border-radius: 16px; font-size: 16px; outline: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); color: inherit; text-align: center; }
[data-theme='dark'] #hcl-pw-input { background: rgba(255, 255, 255, 0.1); color: #fff; }
[data-theme='dark'] .hcl-tip { color: #a1a1a6; }
#hcl-pw-input:focus { border-color: #0071e3; background: transparent; }
#hcl-pw-input.error { border-color: #ff3b30 !important; background: rgba(255, 59, 48, 0.1) !important; }
.hcl-btn-primary { background: #0071e3; color: white; border: none; padding: 18px; border-radius: 16px; font-size: 17px; font-weight: 600; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.hcl-btn-primary:hover { background: #0077ed; transform: scale(1.02); box-shadow: 0 10px 20px rgba(0, 113, 227, 0.2); }
.hcl-btn-primary:active { transform: scale(0.97); }
.hcl-btn-back { margin-top: 15px; color: #0071e3; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; font-size: 0.95rem; font-weight: 500; transition: 0.2s; cursor: pointer; }
.hcl-btn-back:hover { text-decoration-thickness: 2px; opacity: 0.8; transform: translateY(-1px); }
.hcl-error { margin-top: 30px; color: #ff3b30; font-size: 0.95rem; min-height: 1.2em; font-weight: 600; }
@keyframes hclshake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
</style>

<script>
(function() {
  const AUTH_DURATION = ${authDuration};
  const STORAGE_KEY_PREFIX = 'hcl_auth_';
  const pathHash = btoa(window.location.pathname).replace(/=/g, '');
  const storageKey = STORAGE_KEY_PREFIX + pathHash;

  async function decrypt(password, isManual) {
    const inputEl = document.getElementById('hcl-pw-input');
    const msgEl = document.getElementById('hcl-msg');
    const card = document.querySelector('.hcl-encrypt-card');
    
    try {
      const data = document.getElementById('hcl-data').innerHTML.split('.');
      const salt = Uint8Array.from(atob(data[0]), c => c.charCodeAt(0));
      const iv = Uint8Array.from(atob(data[1]), c => c.charCodeAt(0));
      const tag = Uint8Array.from(atob(data[2]), c => c.charCodeAt(0));
      const encrypted = Uint8Array.from(atob(data[3]), c => c.charCodeAt(0));
      
      const passwordBytes = new TextEncoder().encode(password);
      const baseKey = await window.crypto.subtle.importKey('raw', passwordBytes, 'PBKDF2', false, ['deriveKey']);
      const key = await window.crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );

      const combined = new Uint8Array(encrypted.length + tag.length);
      combined.set(encrypted);
      combined.set(tag, encrypted.length);

      const decrypted = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, combined);
      const result = new TextDecoder().decode(decrypted);

      // 解密成功逻辑
      const container = document.getElementById('encrypt-container');
      container.innerHTML = result;
      
      // 激活解密内容中的脚本 (如评论插件、自定义脚本)
      container.querySelectorAll('script').forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.innerHTML = oldScript.innerHTML;
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });

      // 联动修改真实的 Title B
      const realTitleEl = document.getElementById('real-title');
      if (realTitleEl && realTitleEl.innerText) {
        const titleTextEl = document.querySelector('.post-title-text');
        if (titleTextEl) {
          titleTextEl.innerText = realTitleEl.innerText;
        }
      }
      
      // 联动修改真实的 Cover（竖版封面/列表封面）
      const realCoverEl = document.getElementById('real-cover');
      if (realCoverEl) {
        const rcImgUrl = realCoverEl.getAttribute('data-image');
        const rcCaption = realCoverEl.getAttribute('data-caption');
        const coverImg = document.querySelector('.entry-cover img');
        if (coverImg && rcImgUrl) {
          coverImg.src = rcImgUrl;
          coverImg.srcset = ''; // 清除旧的响应式图片集
          const rcAlt = realCoverEl.getAttribute('data-alt');
          if (rcAlt) {
            coverImg.alt = rcAlt;
          }
          const figCaption = document.querySelector('.entry-cover figcaption');
          if (figCaption && rcCaption) {
            figCaption.innerText = rcCaption;
          }
        }
      }

      // 联动修改真实的 TopCover（横版顶部封面）
      const realTopCoverEl = document.getElementById('real-top-cover');
      if (realTopCoverEl) {
        const rtcImgUrl = realTopCoverEl.getAttribute('data-image');
        const rtcCaption = realTopCoverEl.getAttribute('data-caption');
        const coverImg = document.querySelector('.entry-cover img');
        if (coverImg && rtcImgUrl) {
          coverImg.src = rtcImgUrl;
          coverImg.srcset = '';
          const rtcAlt = realTopCoverEl.getAttribute('data-alt');
          if (rtcAlt) {
            coverImg.alt = rtcAlt;
          }
          const figCaption = document.querySelector('.entry-cover figcaption');
          if (figCaption && rtcCaption) {
            figCaption.innerText = rtcCaption;
          }
        }
      }

      // 联动显示 TOC 和 Description
      const toc = document.querySelector('.toc, #toc, .post-toc');
      if (toc) toc.style.display = 'block';
      const desc = document.querySelector('.post-description');
      if (desc) desc.style.display = 'block';

      // 动态挂载评论区（针对加密文章的 template 延迟加载方案）
      const commentsBlock = document.getElementById('comments');
      const commentsTemplate = document.getElementById('hcl-comments-template');
      if (commentsBlock && commentsTemplate) {
        commentsBlock.style.display = 'block';
        commentsBlock.innerHTML = '';
        commentsBlock.appendChild(commentsTemplate.content.cloneNode(true));
        // 激活评论区内的所有脚本 (Giscus 等)
        commentsBlock.querySelectorAll('script').forEach(oldScript => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
          newScript.innerHTML = oldScript.innerHTML;
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });
      } else if (commentsBlock) {
        commentsBlock.style.display = 'block';
      }

      // 存储凭据
      if (AUTH_DURATION > 0) {
        localStorage.setItem(storageKey, JSON.stringify({
          pw: password,
          expiry: Date.now() + (AUTH_DURATION * 1000)
        }));
      }

      if (window.location.hash) {
        const h = window.location.hash;
        window.location.hash = "";
        window.location.hash = h;
      }
    } catch (e) {
      if (isManual) {
        msgEl.innerText = '${t.error}';
        inputEl.classList.add('error');
        inputEl.value = '';
        card.style.animation = 'hclshake 0.5s cubic-bezier(.36,.07,.19,.97) both';
        setTimeout(() => { card.style.animation = ''; inputEl.classList.remove('error'); }, 1000);
      } else {
        localStorage.removeItem(storageKey);
      }
    }
  }

  window.hclDecrypt = function(e, isManual) {
    if (e && e.preventDefault) e.preventDefault();
    const pw = isManual ? document.getElementById('hcl-pw-input').value : e;
    if (pw) decrypt(pw, isManual);
  };

  // 自动解密检查
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    const auth = JSON.parse(saved);
    if (auth.expiry > Date.now()) {
      decrypt(auth.pw, false);
    } else {
      localStorage.removeItem(storageKey);
    }
  }
})();
</script>
    `;

    const newDiv = `<div id="encrypt-container">${decryptionUI}</div>`;
    content = content.replace(fullMatch, newDiv);
  }

  content = content.replace(/\sdata-pw="[^"]*"/g, '');
  fs.writeFileSync(filePath, content);
}

console.log('--- HTML Client-Side Encryption Start ---');
if (fs.existsSync(PUBLIC_DIR)) {
  walk(PUBLIC_DIR);
  console.log('--- Done ---');
} else {
  console.error('Error: "public" directory not found.');
}
