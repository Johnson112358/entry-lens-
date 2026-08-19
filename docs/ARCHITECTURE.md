# EntryLens 架构文档（MVP）

> 版本：v0.1.0-beta 设计稿
> 关联：prd.md / dev-plan.md / AI-CONSTRAINTS.md / PROGRESS.md

## 1. 总体方案

**Legado 3.x 正文为 Canvas 自绘渲染，无 DOM 可注入**（调研见 PROGRESS.md 会话 1）。因此 MVP 采用官方能力组合：

```
章节文本
   │
   ▼
Legado 替换规则（书籍需启用"替换规则"）
   │  pattern: (?s)^[\s\S]*$   （一次匹配整章）
   │  replacement: @js:<EntryLens 脚本>（Rhino 1.8.1 eval，变量 result=整章文本）
   ▼
增强后的章节文本（普通段落 + <usehtml>HTML段落< 混合）
   │
   ▼
Legado 阅读页（需开启"适配特殊样式"）
   │  普通段：Canvas 原文直绘（无样式）
   │  <usehtml>段：HtmlCompat.parseAsHtml 渲染（font 颜色/加粗/下划线/横线…）
   ▼
阅读体验：面板/提示/大框/数值高亮
```

- 主规则一条：`EL_MAIN`。pattern `(?s)^[\s\S]*$` 贪婪匹配整章一次，Rhino eval 一次完成扫描+渲染，返回替换后全文。
- 脚本内所有处理在 `try/catch` 中，异常返回原文（降级保护）。
- 其他规则（`EL_*` 开关规则）留作功能开关与后续规则更新入口（P1）。

## 2. 代码结构

```
plugin/
├── src/
│   ├── el-config.js     # 配置区：属性词表/稀有度颜色/关键词/正则片段（数据驱动）
│   ├── el-core.js       # 解析器：文本 → 块对象数组（PRD §8 数据模型），纯 ES5
│   └── el-render.js     # 渲染器：块/文本 → HTML（<usehtml> 段落），纯 ES5
├── entry-lens-rule.js   # 构建产物：三文件合并压缩，供 @js: 内嵌（由 tools/build-rule.js 生成）
├── replace-rules.json   # 构建产物：Legado 可导入的替换规则组
└── README.md            # 插件包说明
fixtures/                # 样例集（input.txt + expected.json）
tools/
├── run-fixtures.js      # 断言脚本（Node）：准确率/原文完整性/性能
└── build-rule.js        # 构建：合并 src → entry-lens-rule.js + replace-rules.json
docs/
├── ARCHITECTURE.md      # 本文档
└── INSTALL.md           # 安装与冒烟指引
```

## 3. 数据模型（与 prd.md §8 一致）

- **Panel**：`{type:'panel', name, rarity?, rarityColor?, fields:[{label,value}], sourceRange:[s,e]}`
- **SystemBlock**：`{type:'system', subType:'prompt'|'quest'|'choice'|'confirm', title, fields:[{label,value}], options:[str], sourceRange:[s,e]}`
- **ValueChange**：`{type:'valueChange', attribute, change, sourceRange:[s,e]}`（渲染期产物，解析期以内联标记输出）

解析器输出**块数组**；渲染器消费块数组 + 剩余普通文本，输出增强 HTML。

## 4. 识别规则（el-core.js）

### 4.1 输入归一化
- 输入为整章文本（行以 `\n` 分隔；Legado 替换前已对每行 trim）。
- 解析器按行扫描（单次遍历），保留每行原文与行号。

### 4.2 面板（PRD 5.1）
- **装备面板**：行以 `【名称（稀有度）】` 或 `【名称】` 开头（【】内无"："，或含"：Lv."为技能面板），后续 ≥2 行命中 `字段名：字段值`（字段名词表或通用键值形态），字段行 ≤ 12 行。
- **属性面板**：连续 ≥2 行 `属性字段名：值`（字段名命中属性词表）。
- **技能面板**：`【技能名：Lv.X（类型）】` 开头，后续行描述（无字段对也可）。
- **结束条件**：空行、`……`、`【】` 起始的新块、普通叙述行（非键值对）。
- **稀有度提取**：`（稀有度）` 内文本与稀有度词表（白/绿/蓝/紫/橙/红及变体）匹配。

### 4.3 系统提示（PRD 5.2）
- 单行 `【提示：…】` 或 `【…】`（长度 ≤ 60 字），独立成行。
- 每行一个块，不合并。

### 4.4 任务/奖励/确认大框（PRD 5.3）
- **quest**：`【支线任务：…】`/`【主线任务：…】`/`【任务：…】` 开头 + 后续字段行。
- **choice**：行内含"你可在以下奖励中"/"请在以下"/"选择"/"奖励"等关键词 + 后续 `A. B. C.`/`A、B、C、` 选项行（≥2 个）。
- **confirm**：`【是/否…】`/`【是否…】` + 后续说明行。
- 大框不套稀有度色。

### 4.5 数值增减（PRD 5.4）
- 行内匹配 `(?:获得|消耗|提升|增加|减少|失去)?属性词?[+-]数字`（属性词 = 词表 ∪ 任意中文词 + 常见缩写 HP/MP/EXP 等）。
- 仅对**普通叙述行**生效（面板/大框内的数值由渲染器在块内处理）。
- 命中行整行进入"数值高亮块"渲染（该行其余文本原样）。

### 4.6 降级
- 任何块校验失败 → 该块不输出，原文原样输出。
- 相邻同类块合并规则：面板与面板之间若只隔 0 行不合并；提示一行一框。

## 5. 渲染设计（el-render.js）

输出 HTML 字符串，规则：

1. 原文文本一律转义（`& < >`），标签用拼接；保证 `去标签 === 原文`。
2. 普通段原样输出（不含任何标签）。
3. 命中块 → `<usehtml>` 段：
   - 面板：首行 `名称` 用稀有度色 + `<u>` 下划线 + `<b>` 加粗（无稀有度 → 不加色只加下划线）；字段行 `字段名` 用次要色（灰 `#8A8A8A`）、值用主要色（主题正文色自适应 → 不加色，继承正文色）；`提示`/`警告` 前缀标红；`？？？` 原样；首尾 `<hr>` 上下分隔线。
   - 提示：单行框 = 上下 `<hr>` + 内容行；`提示：` 前缀标红加粗。
   - 大框：上下 `<hr>`；标题行加粗 + 主题强调色；字段分级同面板；选项行 `A.`/`B.` 等前缀用徽章样式（`<b><font color=…>A</font></b>` 或 【A】形态）；`是/否` 用 `<b>` + 颜色区分。
   - 数值高亮：`+数字` 绿色 `<font color="#2ECC71"><b>+5</b></font>`，`-数字` 红色。
4. 输出内容中禁止出现裸 `<`（转义保证）与 `$`/`\`（quoteReplacementJs 语义安全）。

## 6. 构建流程（tools/build-rule.js）

1. 读 `el-config.js` + `el-core.js` + `el-render.js`，剥离注释/空行（轻量压缩），拼接为 IIFE：
   `@js:(function(){ … })()` 形式规则 replacement 前缀在 JSON 中直接写 `@js:`。
2. 生成 `plugin/entry-lens-rule.js`（可读版，带版本头）与 `plugin/replace-rules.json`：
   ```json
   [{
     "pattern": "(?s)^[\\s\\S]*$",
     "replacement": "@js:…",
     "name": "EntryLens 主规则",
     "group": "EntryLens",
     "isRegex": true,
     "isEnabled": true,
     "scope": "",
     "order": 1
   }]
   ```
3. 幂等构建，`npm` 脚本 `tools/` 直接 `node` 运行，无需依赖。

## 7. 测试与回归（tools/run-fixtures.js）

- 读 `fixtures/**/input.txt` + `expected.json`。
- 解析断言：`parseBlocks(input)` 与 expected 比对（类型/名称/稀有度/字段/子类型/选项），按 PRD §10 准确率口径（块级完全匹配计数）。
- 原文完整性断言：`stripHtml(renderChapter(input)) === input`（全量样例强制）。
- 性能断言：`renderChapter` 对 5000 字长文 < 50ms（Node 环境预算；Rhino 真机预算整章 < 500ms 由用户冒烟确认）。
- 输出：每类准确率 + 总准确率 + 失败样例清单。**准确率 ≥ 85% 为绿**。

## 8. 已知限制与后续（P1/P2 映射）

| PRD 需求 | MVP 状态 | P1/P2 计划 |
| -------- | -------- | ---------- |
| 点击弹窗（3.2.2） | 内嵌面板块替代（平台限制） | 跟踪 Legado 新 API；或 WebView 阅读模式 |
| 数值动效（3.2.5） | 仅颜色高亮 | 动效开关 |
| 稀有度颜色自定义（3.3） | 编辑规则内颜色表 | 正式配置 UI（按书存储） |
| UI 预设（3.3） | 固定"深色游戏风"基调 | 5 套预设切换 |
| 导入导出配置（3.3） | 规则 JSON 即配置，可导出 | 配置包导入导出 |
| 规则更新（3.3） | 规则 JSON 手动替换 | 规则更新入口/远程推送 |
| 图标/AI 图（3.4） | — | Backlog |

## 9. 性能预算

- 整章 5000 字：扫描 O(n)、行数 ≤ 200；正则仅行级；Rhino eval 一次。
- 预算：Node 环境 < 20ms，Rhino 真机整章 < 500ms（含 eval 编译），单页分摊 < 50ms。
- 超时兜底：Legado 规则超时 3000ms 自动禁用规则并提示。
