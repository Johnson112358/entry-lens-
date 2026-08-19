/**
 * EntryLens 构建脚本（build-rule.js）
 * 用法：node tools/build-rule.js
 * 职责：
 *   1. 合并 plugin/src/ 三个 ES5 源文件（config → core → render，顺序敏感）
 *   2. 轻量压缩（去注释/空行/行首缩进），生成 plugin/entry-lens-rule.js（可读版）
 *   3. 生成 plugin/replace-rules.json（Legado 替换规则导入格式）
 * 产物冒烟：tools/run-fixtures.js 末尾会以 vm 模拟 Rhino eval 验证产物可执行。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'plugin/src');

const FILES = ['el-config.js', 'el-core.js', 'el-render.js'];

/** 轻量压缩：去块注释（斜杠星号…星号斜杠）、行首双斜杠注释、空行、行首缩进（源码约定字符串内不含块注释标记） */
function minify(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map((l) => l.replace(/^\s*\/\/.*$/, '').trim())
    .filter((l) => l !== '')
    .join('\n');
}

function build() {
  const parts = FILES.map((f) => fs.readFileSync(path.join(SRC, f), 'utf8'));
  const version = /version:\s*'([^']+)'/.exec(parts[0]);
  const ver = version ? version[1] : '0.0.0';

  const bundle = parts.map(minify).join('\n\n');

  /* ---- 可读版（供审阅） ---- */
  const readable =
    '/*\n' +
    ' * EntryLens rule bundle v' + ver + '\n' +
    ' * 由 tools/build-rule.js 生成，勿手改；改源码后重新构建。\n' +
    ' * 运行环境：Legado 替换规则 @js:（Rhino 1.8.1），入口见 replace-rules.json。\n' +
    ' */\n' + bundle + '\n';

  /* ---- 替换规则 replacement（@js: 表达式） ---- */
  const script =
    '(function(r){' + bundle + ';return ELRender.renderChapter(r);})(result)';

  /* ---- replace-rules.json（Legado 导入格式：ReplaceRule 实体字段） ---- */
  const rules = [
    {
      name: 'EntryLens 主规则 v' + ver,
      group: 'EntryLens',
      pattern: '(?s)^[\\s\\S]*$',
      replacement: '@js:' + script,
      isRegex: true,
      isEnabled: true,
      scope: '',
      scopeTitle: false,
      scopeContent: true,
      order: 1
    }
  ];

  fs.writeFileSync(path.join(ROOT, 'plugin/entry-lens-rule.js'), readable, 'utf8');
  fs.writeFileSync(
    path.join(ROOT, 'plugin/replace-rules.json'),
    JSON.stringify(rules, null, 2) + '\n',
    'utf8'
  );

  console.log('构建完成：');
  console.log('  plugin/entry-lens-rule.js  ' + (readable.length / 1024).toFixed(1) + ' KB');
  console.log('  plugin/replace-rules.json  ' + (JSON.stringify(rules).length / 1024).toFixed(1) + ' KB（replacement 内嵌 ' + (script.length / 1024).toFixed(1) + ' KB）');
}

build();
