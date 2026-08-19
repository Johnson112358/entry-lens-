# EntryLens 插件包（plugin/）

数值词条流小说阅读增强（Legado 替换规则包）。

## 内容

| 文件 | 说明 |
| ---- | ---- |
| `replace-rules.json` | **导入 Legado 的文件**（替换净化 → 从文件导入） |
| `entry-lens-rule.js` | 规则内嵌脚本的可读版（由 `tools/build-rule.js` 生成） |
| `src/el-config.js` | 配置区：属性词表/稀有度颜色/关键词（**自定义入口**） |
| `src/el-core.js` | 解析器：整章文本 → 块对象（面板/系统/数值） |
| `src/el-render.js` | 渲染器：块/文本 → `<usehtml>` HTML |

## 开发

```bash
node tools/build-rule.js    # 改 src/ 后重新构建产物
node tools/run-fixtures.js  # 全量回归（100 条样例 + 产物冒烟 + 性能）
node tools/gen-fixtures.js  # 重新生成样例文件（改 tools/gen-fixtures.js 后）
```

## 约束

- src/ 三件套为 **ES5.1**（Rhino 1.8.1 执行），禁止 DOM/浏览器 API、禁止现代语法。
- 原文永不丢：渲染只包裹、不增删改字符；任何异常返回原文。
- 详见根目录 `AI-CONSTRAINTS.md`。
