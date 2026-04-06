# Hugo jijian（极简）

[极简(jijian)](https://github.com/hcllmsx/hugo-jijian)是基于 [PaperMod](https://github.com/adityatelange/hugo-PaperMod) 二次开发的 Hugo 主题，更简洁、极致高效，针对中文用户优化。

![极简(jijian)主题-名片模式首页](./docs/images/2026.03.27-极简jijian主题_首页黑白模式切换动态图.gif)

## 特性概览

- **可视化配置工具** — [极简(hugo-jijian)配置工具](https://ihcll.cn/hugo-jijian-config-tools/)
- **Pagefind** 搜索 — 高性能静态搜索
- **导航菜单增强** — 支持子菜单导航，优化移动端体验
- **文章列表置顶功能** — 支持置顶文章，数字越小越靠前，仅支持正整数
- **分类内循环导航** — 确保上一篇/下一篇在同分类文章中跳转（解决了 Hugo “反直觉”的 Next/Prev 逻辑问题）
- **文章列表封面交互优化** — 鼠标悬停预览封面
- **文章元数据增强** — 支持显示最后修改时间，优化移动端和手机端的样式
- **完美的中文统计** — 重构字数统计逻辑，精准识别汉字、字母和数字
- **文章内容级安全加密** — 静态本地 AES-256-GCM 加密
- **中文古文竖排** — 完美支持中文古诗词竖排版展现
- **图片灯箱** — medium-zoom
- **中国本土化社交图标** — 哔哩哔哩、豆瓣等，支持悬浮显示二维码
- 还有一些小细节的优化，等你探索...

**支持的语言**：简体中文 | 繁體中文 | English

## 更新日志

### 2026-04-06 13:13
- 优化了首页的页面布局的样式，避免出现双滚动条。

### 2026-04-06 11:30
- 调整菜单栏的样式，使用下划线动画而不是加粗。

### 2026-04-06 09:50
- 修复pagefind搜索时错误抓取了topCover的问题，现在抓取的是cover，没有则使用defaultImage。如果defaultImage也没有，就显示网站的favicon图标。

### 2026-04-06 00:05
- EdgeOne Pages其实是有Hugo支持的，只是在列表中没有显示。但它依然支持识别HUGO_VERSION环境变量，因此我们可以不需要使用edgeone.json文件来下载hugo了。直接移除，然后和其他云平台使用同一`package.json`文件。

### 2026-03-31 19:03
- 代码高亮样式改为github的样式，支持黑白模式。且不再支持更换为其他高亮风格。
- 将所有 HTTP 请求升级为 HTTPS（修复网易云音乐外链播放器在手机端不显示的问题）。
- 完美支持了原生 GitHub 样式的提示框（Alerts），现在只需使用 `> [!NOTE]` 等语法即可直接生成漂亮的警示块。
- 用户在创建评论时，若文章标题为中文，此前由 giscus [bot] 在 GitHub Discussions 中生成的帖子标题会显示为 URL 编码格式，目前该问题已修复。
- 优化了giscus评论系统的配置，现在可以在`hugo.yaml`中配置`termSuffix`参数，用于指定GitHub Discussions帖子标题后缀，配置后生成讨论帖的标题格式为“文章名-XXXX”。
- 带密码或受保护的文章默认不开启评论，不受全局设置的影响，除非你在Front Matter中配置`comments: true`手动开启评论。

### 2026-03-30 21:19
- 搜索页面中的文字现在由`i18n`管理。
- 文章的顶部封面图改为32:5的比例。
- 更新blank布局，支持在front matter中手动开启评论，不受全局设置的影响。
- 优化文章中引用的文字的样式，之前引用的文字和正文的样式相比除了左边有一条竖线，其他一毛一样。现在引用的文字有背景色，且字小更密集。

### 2026-03-30 13:40
- 新增了 `文章列表置顶功能`，在文章的 `Front Matter` 中添加 `pin: 1` 即可置顶文章，数字越小越靠前，仅支持正整数。
- 优化了文章中“上下篇”按钮的逻辑，支持`分类内循环`。
- 在文章底部的标签（tags）前添加了`分类（categories）`的链接显示。
- 优化手机端的显示，posts列表页的“下一页”按钮居中了，避免和“返回顶部”按钮重叠。优化手机端列表也，点击时不会再显示封面图了。封面图是电脑端鼠标悬停时才显示的。
- 算啦，我不想搞Github上的这个 📚wiki 了，直接去我网站看吧，传送门在这里：[莫莫先生丨Jijian Wiki](https://ihcll.cn/categories/jijian-wiki/)。

## 📚文档 JijianWiki

去这里看吧：[莫莫先生丨Jijian Wiki](https://ihcll.cn/categories/jijian-wiki/)

## 致谢

- [PaperMod](https://github.com/adityatelange/hugo-PaperMod) — 主题核心骨架
- [Pagefind](https://pagefind.app/) — 高性能静态搜索引擎
- [medium-zoom](https://github.com/francoischalifour/medium-zoom) — 图片灯箱
- [giscus](https://github.com/giscus/giscus) — 评论系统
- [Node.js crypto](https://nodejs.org/api/crypto.html) — 构建时文章内容加密
- [Web Crypto API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Crypto_API) — 浏览器端密码验证解密
- [js-yaml](https://github.com/nodeca/js-yaml) — YAML 解析依赖（加密脚本必需）
- [Shields.io](https://shields.io/) — 静态徽标生成服务
- [在线字数统计](https://www.eteste.com/) — 为本主题提供了中文汉字、标点及数字字母的统计算法匹配思路

## 许可证

[MIT License](LICENSE)
