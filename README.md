# Hugo jijian（极简）

> **jijian（极简）** 是基于 [PaperMod](https://github.com/adityatelange/hugo-PaperMod) 二次开发的 Hugo 主题。
> 本主题旨在更简洁、极致高效的基础上，保留 PaperMod 的优秀特性，并针对中文用户和个人需求做了大量优化和定制。

---

## 主题简介

jijian 继承了 PaperMod 的简洁、响应式、无依赖等优点，并在此基础上进行了如下改进和个性化调整：

- **完美的中文统计体验**：彻底重构了 Hugo 与 PaperMod 原本对中文极不友好的字数统计逻辑。内置精确的正则分离算法，精准识别并统计汉字、字母和数字；基于精准字数计算出更合理的阅读时长（支持在 `hugo.yaml` 中配置 `readingSpeed` 设定个人阅读速度）。
- **更极简的视觉风格**：去除冗余装饰，优化排版与留白，整体视觉更清爽纯粹。
- **文章列表封面交互优化**：取消了原本在 Posts 和 Archives 页面列表中直接展现大面积图片占据篇幅的封面显示形式；改为更干练的纯文字列表排版，并新增了 **鼠标悬停预览封面** 功能（鼠标移至文章标题或列表项上方区域时，以浮窗形式展示文章封面图）。
- **导航菜单增强**：为顶部主导航栏新增及支持了 **子菜单导航**；同时对移动端（手机模式）下的折叠菜单栏样式与交互进行了重新设计与调优，提供更为精致友好的手机阅读体验。
- **本土化社交图标整合聚拢**：新增了哔哩哔哩（Bilibili）、豆瓣等诸多国内主流社交媒体的专属 SVG 图标。主页社交区域更是引入了悬挂式二维码气泡功能，经过 `hoverImage` 配置后，鼠标移至对应的图标上方即可自动浮起弹出该平台的二维码名片。
- **特定语言专心维护**：主动移除了原版主题中多达五六十种、不仅臃肿且因深度特化定制后无法完美兼容其余环境小语种支持；当前主动瘦身缩减并声明仅专门长期提供和维护对 **简体中文（zh）、繁体中文（zh-tw）与英文（en）** 的支持！
- **中文古文竖排支持**：移除了原版中阿拉伯语使用的 `rtl` 特性，新增了 `vertical` 短代码，专门完美支持中文古诗词和部分特殊引用文段的从右到左竖排版展现。
- **自定义布局与底层架构重构**：首页信息结构、独立文章页以及归档的底层布局更加灵活。重构梳理了部分模板和布局脚本层，使结构代码相较于原版更加清晰明了，方便二次深度定制与开发。
- **代码区块加强**：保留了优秀的 Chroma 高亮支持，同时也进一步调优了代码区块面板的显示效果以及配套的一键复制按钮样式。
- **全新的 Pagefind 搜索方案**：废弃了原版 PaperMod 使用的 Fuse.js 方案，全面接入了高性能静态搜索引擎 **Pagefind**。这为中文用户带来了极致的搜索体验：极速的索引加载、精准的长句匹配以及美观的搜索结果预览，且对大体量站点的搜索性能有着质的飞跃。
- **视频自适应与专属 Bilibili 短代码**：全面优化了文章中嵌入 `iframe`（如各大视频平台外链）的样式，使其默认宽度自适应并保持 16:9 画幅比例自动缩放，配合全局圆角更显精致。为 B 站原生提供简易短代码（`{{< bilibili bvid="BVxxx" >}}`），彻底告别大段 HTML 及默认自动播放的烦恼，支持自由传参。
- **图片优雅灯箱（medium-zoom）**：内置了优雅的图片缩放组件。点击文章内图片即可平滑放大，支持滚轮缩放，背景色自动适配主题。同时拥有智能过滤逻辑：如果图片本身带有超链接（如设置了 `link` 参数的 `figure`），则保持原有跳转功能，不触发灯箱。
- **静态资源深度本地化**：为了彻底解决国内网络环境下 `cdn.jsdelivr.net` 等服务偶尔无法访问的问题，我们将 `medium-zoom` 和 `giscus-client` 等核心脚本及配套样式全部本地化到了 `assets` 目录中。结合 Hugo 的资源指纹（Fingerprinting）校验，既提升了加载稳定性，又增强了隐私保护。
- **路径级文件夹密码保护**：结合 Vercel Edge Middleware，实现了开箱即用的特定文件夹（如 `protected`）访问控制。保护区内的文章不仅在列表中强制隐藏摘要，在访问时也会弹出精致的磨砂玻璃风格验证页面；支持“原地解锁”和自定义 Cookie 有效期。
- **外部链接智能新标签打开**：补充并完善了原版缺失的基础 Markdown 链接渲染钩子。现在只要在文章中插入以 `http` 或 `https` 开头的外网址，访客点击时均会自动带上安全防护属性并在**新标签页**中打开；而本站内部的跳转链接（锚点、站内文章等）则依然保持在当前页跳转，体验舒适加倍。
- **注重性能与 SEO 优化**：深度精简各类静态化调用流程加载的资源以保持超高标准的响应速度，强化开箱即用的 SEO 基础方案支撑。

---

## 前置环境要求

在使用本主题之前，为了保证完美的体验，请确保您的环境满足以下条件：

1. **Hugo（必需）**：用于生成和构建静态网页，建议使用最新的**扩展版（Extended）**。
2. **Git（推荐）**：用于方便地克隆并拉取本主题的代码与更新。
3. **Node.js / npm（搜索组件运行环境）**：
   - **必须在本地安装**：如果您想在自己的电脑上**本地构建并在本地预览和测试 Pagefind 搜索引擎**，则您的电脑必须安装 Node.js（它自带了执行命令所需的 `npx` 工具）。
   - **不需要在本地安装**：如果您只在本地编写 Markdown 文章，然后将代码推送到代码托管平台（如 GitHub），**利用 GitHub Actions、Vercel、Cloudflare Pages 等云端服务进行自动化部署**，那么您的本地电脑无需安装 Node.js。您只需要在云端 CI/CD 构建脚本中配置 `npx pagefind` 即可（云服务器中通常已默认配置并自带了 npm 环境）。

---

## 快速开始

1. **安装并引入主题（提供两种主要方式）**

   **方式一：使用 Hugo Modules 引入（推荐现代玩法）**
   如果您已初始化了 Hugo 模块环境变量（`hugo mod init github.com/your/yoursite`），无需物理下载任何文件，只需在站点根目录的配置文件（如 `hugo.yaml`）中，引入并定义该模块路径：
   ```yaml
   module:
     imports:
       - path: github.com/hcllmsx/hugo-jijian
   ```

   **方式二：通过 Git 克隆到本地（经典方案）**
   将本主题直接克隆拉取到您的 Hugo 开发站点的 `themes` 目录下：
   ```bash
   git clone https://github.com/hcllmsx/hugo-jijian.git themes/jijian
   ```

2. **激活并启用主题：**
   如果您使用的是上方**方式二**（通过 Git 将文件克隆到了本地主题包），请确保在根目录配置文件如 `hugo.yaml` 或 `config.toml` 中应用本主题作为当前激活选项：
   ```yaml
   theme: jijian
   ```
   *(注：如果您使用的是方式一，则上方 `module` 引入行为已自带并隐式激活了该主题，无需再配置 `theme` 字段)*

3. **配置更准确的人性化阅读时间基准（可选）：**
   如果您需要启用并基于本主题重构的极其准确之纯文字识别量来体现“阅读用时”，除了激活组件外还推荐自定一项针对本站主要受众习惯使用的参数值（如下方的200字即可满足常规情况）：

   ```yaml
   params:
     ShowReadingTime: true # 开启显示当前文章内容的预测阅读时长参数面板机制
     readingSpeed: 200     # 自定义常规默认阅读速度能力（即平均每分钟阅读字数限制基准量，默认设 200 ）
   ```

4. **主页配置带悬浮弹出图片/二维码形式的外部社交功能区图标（可选）：**
   只需要在 `params.socialIcons` 组件内容节点设置对应元素的 `hoverImage` 即完成此扩充体验：

   ```yaml
   params:
     socialIcons:
       - name: bilibili
         url: "https://space.bilibili.com/xxxxxx"
       - name: wechat
         url: "javascript:void(0);"                   # 不需要直接导向的地方可用这类作为空位防止默认跳出
         hoverImage: "/images/wechat-qr.png"  # 在这填写你的二维码名片之类的实际站内绝对或跨站路径内容
   ```

5. **配置 Pagefind 搜索功能（必需）：**
   本主题已将搜索方案升级为 Pagefind。由于 Pagefind 是在构建后的静态文件上运行的，因此需要额外的索引生成步骤。

   在 `hugo.yaml` 中，您只需保留搜索页面的菜单配置，旧的 `fuseOpts` 已不再需要：

   ```yaml
   menu:
     main:
       - identifier: search
         name: 搜索
         url: /search/
         weight: 21
   ```

   **部署与运行指南：**
   
   生成搜索索引依赖于你当前是在**本地开发预览**还是准备**发布到线上环境**。

   **场景一：本地开发预览（边写文章边测试）**
   因为 `hugo server` 会将 `static` 目录作为网站根目录的资源，所以你需要把搜索索引直接生成到 `static` 目录下：
   ```bash
   hugo && npx pagefind --site public --output-path static/pagefind
   hugo server
   ```
   *注意：后续如果修改了文章需要更新搜索结果，需要重新运行第一条命令，再启动 `hugo server`。*

   **场景二：部署并发布到线上生产环境**
   当你准备将网站正式发布到服务器时，索引只需要生成在最终打包的 `public` 文件夹中即可。

   如果你使用 **GitHub Actions** 自动化部署，你只需在构建脚本的执行步骤中补充一行执行 `npx pagefind` 的指令。**例如在 GitHub Pages 中**：
   ```yaml
   - name: Build with Hugo
     env:
       HUGO_ENVIRONMENT: production
       HUGO_ENV: production
     run: |
       hugo \
         --minify \
         --baseURL "${{ steps.pages.outputs.base_url }}/"
       # 紧接在 hugo 构建指令之后，加入下面这行即可：
       npx pagefind --site public
   ```
   *云端服务器带有完整的 npm 环境，以上流程能够完美无感生成所需文件。*

   **场景三：使用 Pagefind 自带的服务器预览最终的构建文件**
   如果你已经执行了 `hugo && npx pagefind --site public` 生成了最终要上线的静态文件，并且你想在本地预览这套**完全静态的、脱离了 Hugo 环境的文件**，可以使用：
   ```bash
   npx pagefind --site public --serve
   ```
   *这会在本地启动一个小型的 HTTP 服务器，专门用来预览 `public` 文件夹里的最终成品。*

---

## 高级功能：路径路径密码保护 (Vercel)

本主题支持在 Vercel 平台上实现“免服务器”的文件夹访问控制。

1. **启用方式**：将您的文章放入 `content/posts/protected/`（或其他你指定的目录）。
2. **配置中间件**：
   - 在站点根目录创建 `middleware.js`。
   - 在 `package.json` 中添加 `@vercel/edge` 依赖。
3. **功能特性**：
   - **内容锁定**：非授权用户无法访问受保护的内容。
   - **隐私保护**：系统会自动识别路径包含 `protected` 的文章，并强制在列表页隐藏其摘要。
   - **自定义时长**：可通过 Vercel 环境变量 `AUTH_DURATION` 自定义授权有效期（秒）。

---

## 致谢

- 本主题核心骨架和脉络基于 [PaperMod](https://github.com/adityatelange/hugo-PaperMod) 修改并在此致谢延伸，因 PaperMod 也是受启发于 [hugo-paper](https://github.com/nanxiaobei/hugo-paper)，在此一同拜谢两位前行者。
- 感谢提供了有关完美拆解中文汉字、全解标点及数字字母分离统计算法匹配思路的 [在线字数统计](https://www.eteste.com/)（它为本方案带来了最核心计算方式启发依据）。
- 感谢 [medium-zoom](https://github.com/francoischalifour/medium-zoom/) 提供了优雅的图片灯箱缩放方案。
- 感谢 [giscus](https://github.com/giscus/giscus) 提供了强大的基于 GitHub Discussions 的评论组件。

---

## 许可证

MIT License
