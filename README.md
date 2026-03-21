# Hugo jijian（极简）

> 基于 [PaperMod](https://github.com/adityatelange/hugo-PaperMod) 二次开发的 Hugo 主题，更简洁、极致高效。

## 特性概览

- **可视化配置工具** — 开箱即用的 `jijian-极简（jijian）配置工具-config-tools.html`
- **完美的中文统计** — 精准识别汉字、字母和数字
- **Pagefind 搜索** — 高性能静态搜索引擎
- **文章内容级本地加密** — 基于 AES-GCM 算法，支持自定义提示语与多语言
- **本土化社交图标** — 哔哩哔哩、豆瓣等国内平台
- **图片优雅灯箱** — medium-zoom 平滑缩放，支持背景自动适配
- **中文古文竖排** — 完美支持古诗词竖排展现
- **深色/浅色主题切换** — 支持跟随系统自动切换
- **跨平台一键部署** — 内置 EdgeOne Pages 与 Vercel 适配方案

**支持的語言**：简体中文（zh-cn）| 繁體中文（zh-tw）| English（en）

---

## 快速开始

### 环境要求

| 工具 | 版本 | 说明 |
|------|------|------|
| Hugo | ≥ 0.146.0 | 推荐 Extended 版本 |
| Git | 最新版 | 用于克隆主题 |

### 安装

**方式一：Hugo Modules（推荐）**

```yaml
module:
  imports:
    - path: github.com/hcllmsx/hugo-jijian
```

**方式二：Git Clone**

```bash
git clone https://github.com/hcllmsx/hugo-jijian.git themes/jijian
```

```yaml
theme: jijian
```

### 最小配置

```yaml
baseURL: https://your-domain.com/
title: 站点标题
theme: jijian

params:
  env: production
  description: "站点描述"
```

---

## 文档

📚 **详细文档请查看 [Wiki](https://github.com/hcllmsx/hugo-jijian/wiki)**

- [入门指南](https://github.com/hcllmsx/hugo-jijian/wiki/01‐入门指南)
- [配置详解](https://github.com/hcllmsx/hugo-jijian/wiki/02‐配置详解)
- [首页模式](https://github.com/hcllmsx/hugo-jijian/wiki/03‐首页模式)
- [短代码](https://github.com/hcllmsx/hugo-jijian/wiki/04‐短代码)
- [布局模板](https://github.com/hcllmsx/hugo-jijian/wiki/05‐布局模板)
- [功能配置](https://github.com/hcllmsx/hugo-jijian/wiki/06‐功能配置)
- [高级功能](https://github.com/hcllmsx/hugo-jijian/wiki/07‐高级功能)

---

## 致谢

- [PaperMod](https://github.com/adityatelange/hugo-PaperMod) — 主题核心骨架
- [Pagefind](https://pagefind.app/) — 高性能静态搜索引擎
- [medium-zoom](https://github.com/francoischalifour/medium-zoom) — 图片灯箱
- [giscus](https://github.com/giscus/giscus) — 评论系统
- [Web Crypto API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Crypto_API) — 浏览器原生加密底层支持

---

## 许可证

[MIT License](LICENSE)
