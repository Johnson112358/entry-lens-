# PROGRESS.md（AI 跨会话记忆）

> 每次会话开始读它、结束更新它。记录：已完成 / 卡点 / 关键决策 / 下一步。

---

## 会话 1（2026-08-21，MVP 开发完成 ✅）

### 本轮目标
按 dev-plan.md 完成 MVP（I0~I8）：注入方案定稿、仓库骨架、P0 全部识别与渲染、样例集与回归、打包发布 v0.1.0-beta。

### I0 注入验证结论（Day 1 关键决策 ★）
基于 legado-E 源码（gedoor/legado 官方仓库已删库，仅剩公告；以 legado-E 镜像为准）调研结论：

| 调研项 | 结论 | 证据（legado-E 源码路径） |
| ------ | ---- | ------------------------- |
| 阅读页渲染方式 | **Canvas 自绘**（StaticLayout/TextPage），非 WebView DOM | `ui/book/read/page/provider/ChapterProvider.kt`、`ContentTextView.kt` |
| JS 注入正文可行性 | **不可行**（无 DOM 可操作） | 同上 |
| 替换规则 JS | 替换字段 `@js:` 开头 → **Rhino 1.8.1** eval，变量 `result`/`chapter`/`book`/`java`，结果字符串作替换文本 | `utils/RegexExtensions.kt`、`help/book/ContentProcessor.kt` |
| 段落 HTML 渲染 | 段落以 `<usehtml>` 开头、`<` 结尾 → `HtmlCompat.parseAsHtml` 渲染（font/b/u/i/a/hr 等子集） | `ui/book/read/page/provider/TextChapterLayout.kt`、`constant/AppPattern.kt` |
| 链接点击 | `<a href>` 点击打开"链接确认"页（OpenUrlConfirmActivity），**无自定义弹窗** | `ui/book/read/page/ContentTextView.kt` |
| 特殊样式开关 | HTML 段渲染依赖"适配特殊样式"（adaptSpecialStyle）开启 | `AppConfig.adaptSpecialStyle` |
| 章节替换开关 | 书籍需开启"启用替换规则"（book.getUseReplaceRule） | `ContentProcessor.getContent` |

**关键决策 D1**：按 dev-plan Day1 预案切换为"替换规则包裹"方案：
- 产品形态 = **Legado 替换规则包（JSON 导入）+ `<usehtml>` HTML 渲染**，一条主规则 `(?s)^[\s\S]*$` 整章一次 Rhino eval，脚本内完成全部识别与渲染。
- **"点击弹窗"（PRD 3.2.2）在 Canvas 平台不可实现** → MVP 决策：面板以"内嵌美化面板块"渲染（名称稀有度色+下划线、字段分级、警告标红、？？？保留），不折叠、不弹窗；弹窗能力列入 P1 跟踪。
- **数值"动效"（闪烁/渐变）在 Canvas 不可实现** → MVP 只做颜色高亮（+绿 -红），动效列入 P1。
- 稀有度颜色自定义：MVP 提供配置区（`el-config.js` 颜色表），用户可编辑规则文本自行修改；P1 再做正式 UI。

### 迭代完成状态

| 迭代 | 内容 | 状态 | 验证 |
| ---- | ---- | ---- | ---- |
| I0 | 注入验证 + 骨架 | ✅ | 源码调研结论记录；仓库骨架就绪 |
| I1 | 面板识别 + 样例集 + 断言 | ✅ | 100 条样例，解析 100% |
| I2 | 名称入口 + 面板渲染 | ✅ | 稀有度色/下划线/字段分级/警告红/？？？保留 |
| I3 | 系统提示单行框 | ✅ | 一行一框、前缀红 |
| I4 | 任务/奖励/确认大框 | ✅ | 标题加粗、选项徽章、是/否按钮 |
| I5 | 数值增减高亮 | ✅ | +绿 -红，词表防误报 |
| I6 | 替换规则包构建 | ✅ | build-rule → replace-rules.json（19.6KB），vm 冒烟通过 |
| I7 | 降级与异常保护 | ✅ | 36 条反例全部不识别；异常边界 10/10 无崩溃；<usehtml> 字面转义 |
| I8 | 打包 + 文档 + 版本 | ✅ | INSTALL/CHANGELOG/README；tag v0.1.0-beta |

### 质量数据（会话 1 末次全量回归）

- 样例集：**100 条**（panel 16+6、prompt 14+4、system-block 16+6、value 14+10、negative 10、mixed 4）
- 解析准确率：**100%**（目标 ≥85%）
- 原文完整性：**0 失败**（全量断言 stripHtml(render) === input）
- 性能：5000 字整章 **0.55ms**（Node 基准；目标 <50ms，Rhino 真机预算 <500ms 待用户冒烟）
- 产物冒烟（vm 模拟 Rhino eval @js:）：整章增强 ✅ / 原文保真 ✅ / 普通文本原样 ✅

### 识别规则要点（当前实现，改动需跑回归）
- 面板：`【名称（稀有度）】`/`【名称】` + ≥2 字段行；属性面板 = ≥2 连续词表字段行（或 ≥3 行放宽）；技能面板 = `【技能名：Lv.X（类型）】`（技能名限中英文数字，防"等级提升！…Lv.32"误判）+ ≥1 内容行；结束 = 空行/……/新【】块/叙述行。
- 提示：单行 `【…】` ≤60 字，以 提示/警告/公告 开头或含特征词（提升/解锁/等级/Lv…；**不含**"了/开始/结束"等过泛词）。
- 大框：quest（任务结构词开头或"任务"结尾，排除"任务进度更新"形态）、choice（含选择/奖励关键词，需 ≥2 选项）、confirm（是/否/是否/确认/激活/启动，优先于 quest；可吞 ≤2 条单句说明行）；普通叙述行 = 结束条件。
- 数值：`±数字`，前导属性段 = 词表命中（含 前缀动词+"了"剥离、前缀+属性组合），英文缩写 HP/MP/EXP…；行内 >6 处数字 → 放弃。

### 当前卡点
- 无代码卡点。**待办（需用户执行）**：真机冒烟（docs/INSTALL.md §5）——Node 侧已全绿，Rhino 真机行为需用户验证后反馈调优。

### 勘误与补充（用户反馈后修正）
- **D2（2026-08-21，用户反馈）**：INSTALL.md 原写的"我的 → 设置 → 阅读设置"路径不存在。源码确认：
  - "适配特殊样式"开关实际位置：**阅读页 → 点屏幕中央 → 底部菜单 → 齿轮"设置"按钮 → 弹出的设置列表**（`MoreConfigDialog` 加载 `pref_config_read.xml`，位于"中文排版/两端对齐/底部对齐"之后）。
  - 该开关 **defaultValue=true（默认开启）**；书籍"启用替换规则"对网络小说也默认开启（`replaceEnableDefault=true`，图片书源/epub 除外）。→ INSTALL.md 2.2 已改为"默认开启，仅关过才需检查"，并新增 §2.4 排障表。
  - 证据：`res/xml/pref_config_read.xml`、`ui/book/read/config/MoreConfigDialog.kt`、`AppConfig.kt`、`Book.kt`。

### 下一步（P1 第二批）
1. 真机冒烟反馈 → 调优识别规则（误报/漏报入样例集）
2. I9 稀有度颜色自定义 UI / I10 UI 预设 / I11 动效开关（需评估 Legado 新版本能力）
3. I12 配置导入导出 / I13 规则更新入口（规则 JSON 即配置，先做导出模板）
4. I14 全量回归 + v0.2.0

### 关键文件索引
- `prd.md`、`dev-plan.md`、`AI-CONSTRAINTS.md`
- `docs/ARCHITECTURE.md`、`docs/INSTALL.md`
- `plugin/src/el-config.js`、`el-core.js`、`el-render.js`；`plugin/replace-rules.json`（导入文件）
- `fixtures/`（100 条）、`tools/gen-fixtures.js`、`tools/run-fixtures.js`、`tools/build-rule.js`
- `CHANGELOG.md`
