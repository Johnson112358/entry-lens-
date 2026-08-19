# EntryLens

为**数值词条流小说**（游戏化网文：属性面板、装备词条、技能面板、系统提示、任务奖励）而生的 Legado 阅读增强插件。

自动识别并视觉增强：**面板类内容**（稀有度颜色 + 下划线 + 字段分级）、**系统提示单行框**、**任务/奖励/确认大框**、**数值增减高亮**（+绿 -红）。原文 100% 保留，只加样式、不改字符。

## 快速开始

1. 下载 [`plugin/replace-rules.json`](./plugin/replace-rules.json) 到手机；
2. Legado → 我的 → **替换净化** → ⋮ → **从文件导入**；
3. 设置 → 阅读设置 → 打开 **"适配特殊样式"**；
4. 打开小说，生效。

完整说明（含开关、限制、冒烟清单）：[`docs/INSTALL.md`](./docs/INSTALL.md)

## 效果一览

| 内容 | 识别特征 | 渲染 |
| ---- | -------- | ---- |
| 装备面板 | `【名称（稀有度）】` + 字段行 | 名称稀有度色+下划线，字段分级，上下分隔线 |
| 属性面板 | 连续属性字段行（生命值/力量…） | 同上面板样式 |
| 技能面板 | `【技能名：Lv.X（类型）】` | 技能名下划线加粗 + 描述/字段 |
| 系统提示 | 单行 `【提示：…】` 等 | 一行一框，前缀标红 |
| 任务/奖励/确认 | `【支线任务…】`/`【你可在以下奖励中…】`/`【是/否…】` | 大框 + 标题加粗 + 选项徽章 + 是/否按钮 |
| 数值增减 | `力量+5`、`HP-100`、`获得经验值+200` | + 绿 / - 红 |

## 项目结构

```
prd.md / dev-plan.md      # 产品需求 / 开发计划（Vibe Coding）
AI-CONSTRAINTS.md         # AI 开发约束（环境事实/铁律/平台限制）
PROGRESS.md               # 开发进度（跨会话记忆）
docs/
  ARCHITECTURE.md         # 技术方案（Legado 自绘渲染下的替换规则方案）
  INSTALL.md              # 安装/开关/冒烟/反馈指南
plugin/                   # 插件包（replace-rules.json = 导入文件）
  src/                    # ES5 源码：el-config（配置）/ el-core（解析）/ el-render（渲染）
fixtures/                 # 100 条样例集（input.txt + expected.json）
tools/
  gen-fixtures.js         # 样例生成器
  run-fixtures.js         # 断言/回归/产物冒烟/性能
  build-rule.js           # 构建 replace-rules.json
CHANGELOG.md              # 版本记录
```

## 开发

```bash
node tools/gen-fixtures.js   # 生成样例
node tools/run-fixtures.js   # 回归（准确率/原文完整性/产物冒烟/性能）
node tools/build-rule.js     # 构建插件包
```

当前状态：**v0.1.0-beta（MVP）** — P0 全部完成，样例集 100 条 100% 通过，整章解析 <1ms。

## 已知限制（平台决定）

Legado 阅读页为自绘渲染：**无点击弹窗、无数值动效、无 CSS**。MVP 以"内嵌美化块 + 颜色/字号/下划线/分隔线"实现视觉增强；弹窗与动效列入 P1（详见 PROGRESS.md 决策 D1）。

## 反馈

误报/漏报请带**原文摘录**提交 Issue（会加入样例集调优）。见 `docs/INSTALL.md` §6。
