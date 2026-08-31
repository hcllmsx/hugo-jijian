#!/usr/bin/env node
/**
 * 中文单字索引预处理器（jijian 主题内置）
 *
 * 背景：pagefind 建索引（Rust 词典分词）与浏览器查询（Intl.Segmenter/ICU 词典分词）
 * 使用两本不同的词典，中文切分不一致时（如"二维码"索引为[二维,码]、查询为[二,维,码]）
 * 查询词在索引中不存在，导致搜不到。这是 pagefind 已知问题（issue #987）。
 *
 * 方案：将 HTML 文本中相邻的 CJK 字符之间插入零宽空格（U+200B），
 * 使索引端按"单字"建索引；查询端由主题 baseof.html 内补丁将中文查询词按单字切分，
 * 两端对齐后任意中文子串均可命中。
 *
 * 处理结果写入临时目录，仅供 pagefind 索引使用，部署的 HTML 不受影响。
 *
 * 用法（在站点根目录执行，pagefind 改索引 _temp/pf-site 即可）：
 *   node themes/jijian/scripts/pf-prep.cjs [srcDir] [destDir]
 *   默认： public -> _temp/pf-site
 *
 * 开关：设置环境变量 PAGEFIND_ZWSP=0（或 false/off/no）可跳过预处理。
 * 当 pagefind 官方修复 #987（中文按词索引）后，将构建流程改回
 * "pagefind --site public"，并把 baseof.html 里的中文单字查询补丁移除即可，
 * 本脚本可保留在主题内不执行，互不影响。
 */
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(process.argv[2] || 'public');
const DEST = path.resolve(process.argv[3] || '_temp/pf-site');

// pagefind 官方修复后可设 PAGEFIND_ZWSP=0 一键跳过
const DISABLED = /^(0|false|off|no)$/i.test(process.env.PAGEFIND_ZWSP || '');
if (DISABLED) {
    console.log('[pf-prep] PAGEFIND_ZWSP=0，已跳过中文单字预处理，请改回 pagefind --site public 使用原生索引');
    process.exit(0);
}

// 相邻 CJK 表意字符之间插入零宽空格
const INSERT = /([\u3400-\u9fff\uf900-\ufaff])(?=[\u3400-\u9fff\uf900-\ufaff])/g;

let fileCount = 0;

function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === 'pagefind') continue; // 跳过旧索引目录
            walk(full);
        } else if (entry.name.endsWith('.html')) {
            processFile(full);
        }
    }
}

function processFile(full) {
    const rel = path.relative(SRC, full);
    const dest = path.join(DEST, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const html = fs.readFileSync(full, 'utf8');
    fs.writeFileSync(dest, insertZwsp(html));
    fileCount++;
}

/**
 * 标签感知的文本处理：只在标签外的文本节点中插入 ZWSP，
 * 跳过 <script>/<style>/<pre>/<code>/<textarea> 的原始内容。
 */
function insertZwsp(html) {
    let out = '';
    let i = 0;
    const n = html.length;
    while (i < n) {
        if (html[i] === '<') {
            const close = html.indexOf('>', i);
            if (close === -1) { out += html.slice(i); break; }
            const tag = html.slice(i, close + 1);
            out += tag;
            i = close + 1;
            // 原始文本块整体跳过；<title>/<h1> 跳过以保持搜索结果标题干净（匹配靠正文即可）
            const m = /^<\s*(script|style|pre|code|textarea|title|h1)\b/i.exec(tag);
            if (m) {
                const closeRe = new RegExp(`</\\s*${m[1]}\\s*>`, 'i');
                const rest = html.slice(i);
                const mm = closeRe.exec(rest);
                if (mm) {
                    out += rest.slice(0, mm.index + mm[0].length);
                    i += mm.index + mm[0].length;
                } else {
                    out += rest;
                    i = n;
                }
            }
            continue;
        }
        const next = html.indexOf('<', i);
        const text = next === -1 ? html.slice(i) : html.slice(i, next);
        out += text.replace(INSERT, '$1\u200b');
        i = next === -1 ? n : next;
    }
    return out;
}

if (!fs.existsSync(SRC)) {
    console.error(`[pf-prep] 源目录不存在: ${SRC}`);
    process.exit(1);
}

fs.rmSync(DEST, { recursive: true, force: true });
walk(SRC);
console.log(`[pf-prep] ${fileCount} 个 HTML 已处理 -> ${path.relative(process.cwd(), DEST)}`);
