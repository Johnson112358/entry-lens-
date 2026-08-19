/**
 * EntryLens 断言脚本（run-fixtures.js）
 * 用法：node tools/run-fixtures.js
 * 职责：
 *   1. 解析断言：parseChapter(input) 与 expected.json 逐块比对（准确率口径）
 *   2. 原文完整性断言：stripHtml(renderChapter(input)) === input（铁律，全量强制）
 *   3. 性能抽查：5000 字长文整章渲染 < 50ms（Node 环境预算）
 * 出口标准：总准确率 ≥ 85% 且 原文完整性 100%（否则 exit 1）
 */
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const CORE = require(path.join(ROOT, 'plugin/src/el-core.js'));
const RENDER = require(path.join(ROOT, 'plugin/src/el-render.js'));

/* ------------------------------------------------------------------ *
 * 工具
 * ------------------------------------------------------------------ */

/** 去掉 HTML 标签/包裹符，还原为原文 */
function stripHtml(html) {
  return html
    .replace(/<usehtml>/g, '')
    .replace(/<\n/g, '\n')
    .replace(/<$/g, '')
    .replace(/<br>/g, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"');
}

/** 深比较（忽略对象键顺序） */
function deepEqual(a, b) {
  if (a === b) { return true; }
  if (typeof a !== typeof b) { return false; }
  if (a === null || b === null) { return a === b; }
  if (Array.isArray(a) !== Array.isArray(b)) { return false; }
  if (Array.isArray(a)) {
    if (a.length !== b.length) { return false; }
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) { return false; }
    }
    return true;
  }
  if (typeof a === 'object') {
    const ka = Object.keys(a).sort();
    const kb = Object.keys(b).sort();
    if (ka.length !== kb.length) { return false; }
    for (let i = 0; i < ka.length; i++) {
      if (ka[i] !== kb[i]) { return false; }
      if (!deepEqual(a[ka[i]], b[kb[i]])) { return false; }
    }
    return true;
  }
  return false;
}

/** 归一化解析结果为可比结构（忽略行号/渲染细节） */
function normalizeBlocks(blocks) {
  return blocks.map((b) => {
    if (b.type === 'panel') {
      const o = { type: 'panel', fields: b.fields };
      if (b.name !== null && b.name !== undefined) { o.name = b.name; }
      if (b.rarity) { o.rarity = b.rarity; }
      if (b.rarityColor) { o.rarityColor = b.rarityColor; }
      return o;
    }
    if (b.type === 'system') {
      return {
        type: 'system',
        subType: b.subType,
        title: b.title,
        fields: b.fields,
        options: b.options
      };
    }
    if (b.type === 'value') {
      return {
        type: 'value',
        changes: b.changes.map((c) => ({ attr: c.attr, sign: c.sign, raw: c.raw }))
      };
    }
    return b;
  });
}

/* ------------------------------------------------------------------ *
 * 样例扫描
 * ------------------------------------------------------------------ */

function listFixtures() {
  const out = [];
  const root = path.join(ROOT, 'fixtures');
  const dirs = fs.readdirSync(root);
  for (const d of dirs) {
    const dirPath = path.join(root, d);
    if (!fs.statSync(dirPath).isDirectory()) { continue; }
    const subs = fs.readdirSync(dirPath);
    for (const s of subs) {
      const caseDir = path.join(dirPath, s);
      if (!fs.statSync(caseDir).isDirectory()) { continue; }
      const inputPath = path.join(caseDir, 'input.txt');
      const expectedPath = path.join(caseDir, 'expected.json');
      if (fs.existsSync(inputPath) && fs.existsSync(expectedPath)) {
        out.push({ category: d, name: s, dir: caseDir, inputPath, expectedPath });
      }
    }
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * 主流程
 * ------------------------------------------------------------------ */

function main() {
  const fixtures = listFixtures();
  let total = 0;
  let parsePass = 0;
  let integrityFailures = [];

  const results = [];

  for (const fx of fixtures) {
    total++;
    const input = fs.readFileSync(fx.inputPath, 'utf8');
    const expected = JSON.parse(fs.readFileSync(fx.expectedPath, 'utf8'));

    // 1) 解析断言
    const parsed = CORE.parseChapter(input);
    const actual = normalizeBlocks(parsed.blocks);
    const exp = expected.blocks || [];
    const ok = deepEqual(actual, exp);
    if (ok) { parsePass++; }

    // 2) 原文完整性断言（铁律：任何样例都必须通过）
    let rendered;
    try {
      rendered = RENDER.renderChapter(input);
    } catch (e) {
      rendered = 'EXCEPTION:' + e.message;
    }
    const stripped = stripHtml(rendered);
    if (stripped !== input) {
      integrityFailures.push({ name: fx.category + '/' + fx.name, input, stripped });
    }

    results.push({ fx, ok, detail: actual });
  }

  /* ---- 输出 ---- */
  const rate = total > 0 ? (parsePass / total * 100).toFixed(1) : 0;
  console.log('=== EntryLens fixtures 回归 ===');
  console.log('样例总数: ' + total);
  console.log('解析通过: ' + parsePass + ' / ' + total + '（准确率 ' + rate + '%）');
  console.log('原文完整性失败: ' + integrityFailures.length);
  if (integrityFailures.length > 0) {
    for (const f of integrityFailures.slice(0, 5)) {
      console.log('  [完整性失败] ' + f.name);
      console.log('    in : ' + JSON.stringify(f.input));
      console.log('    out: ' + JSON.stringify(f.stripped));
    }
  }

  const failures = results.filter((r) => !r.ok);
  if (failures.length > 0) {
    console.log('\n--- 解析失败样例（前 20 个）---');
    for (const f of failures.slice(0, 20)) {
      console.log('[' + f.fx.category + '/' + f.fx.name + ']');
      console.log('  input   : ' + JSON.stringify(fs.readFileSync(f.fx.inputPath, 'utf8')));
      console.log('  actual  : ' + JSON.stringify(f.detail));
    }
  }

  /* ---- 性能抽查 ---- */
  console.log('\n--- 性能抽查（5000 字长文，Node 预算 <50ms）---');
  const longText = buildLongText();
  const t0 = process.hrtime.bigint();
  RENDER.renderChapter(longText);
  const t1 = process.hrtime.bigint();
  const ms = Number(t1 - t0) / 1e6;
  console.log('整章渲染耗时: ' + ms.toFixed(2) + 'ms（' + longText.length + ' 字）');
  console.log('单页分摊(500字/页): ' + (ms / 10).toFixed(2) + 'ms');

  /* ---- 规则产物冒烟（vm 模拟 Rhino eval @js: 替换规则） ---- */
  console.log('\n--- 替换规则产物冒烟（vm 模拟 Rhino eval）---');
  const vm = require('vm');
  const rulesFile = path.join(ROOT, 'plugin/replace-rules.json');
  if (!fs.existsSync(rulesFile)) {
    console.log('❌ 未找到 plugin/replace-rules.json，请先运行 node tools/build-rule.js');
    process.exit(1);
  }
  const rules = JSON.parse(fs.readFileSync(rulesFile, 'utf8'));
  const mainRule = rules[0];
  const isJs = mainRule.replacement.startsWith('@js:');
  if (!isJs) { console.log('❌ 主规则 replacement 不以 @js: 开头'); process.exit(1); }
  const jsCode = mainRule.replacement.slice(4);
  // 用 vm 模拟 Rhino eval（bindings: result）
  const mixed = fs.readFileSync(path.join(ROOT, 'fixtures/mixed/03-panel-quest-value/input.txt'), 'utf8');
  const out = vm.runInNewContext(jsCode, { result: mixed });
  const enhanced = typeof out === 'string' && out.indexOf('<usehtml>') !== -1;
  const intact = stripHtml(String(out)) === mixed;
  const plainOut = vm.runInNewContext(jsCode, { result: '普通段落文本。' });
  const plainIntact = stripHtml(String(plainOut)) === '普通段落文本。';
  console.log('整章处理: ' + (enhanced ? '✅ 产出增强' : '❌ 无 <usehtml>'));
  console.log('原文保真: ' + (intact ? '✅' : '❌'));
  console.log('普通文本原样: ' + (plainIntact ? '✅' : '❌'));

  /* ---- 出口判定 ---- */
  const pass = parsePass / total >= 0.85 && integrityFailures.length === 0 && enhanced && intact && plainIntact;
  console.log('\n出口标准: 准确率>=85% 且 原文完整性100% → ' + (pass ? '✅ 通过' : '❌ 未通过'));
  process.exit(pass ? 0 : 1);
}

/** 构造 5000 字混合长文（面板/提示/大框/数值/普通段落交替） */
function buildLongText() {
  const parts = [];
  const panel = '【破旧的燧发枪（白色）】\n产地：海贼王，利奥波特作坊\n耐久度：6/30\n攻击力：2~13（根据距离计算）\n暴击率：5%';
  const prompt = '【提示：你已晋升至绝强者。】';
  const quest = '【支线任务：宝藏。】\n难度等级：Lv.？？？\n目标：击败守宝者\n奖励：金币×500';
  const value = '他只觉得浑身一暖，力量+5，敏捷+3，连带着体力也恢复了。';
  const plain = '林风握紧手中的长剑，目光坚定地望向远处的山巅。风呼啸着掠过耳畔，他深吸一口气，迈出了第一步。';
  while (parts.join('\n').length < 5000) {
    parts.push(plain, panel, prompt, quest, value, plain, '【火球术：Lv.5（主动）】\n凝聚火焰，对目标造成火焰伤害。\n冷却时间：10秒', plain);
  }
  return parts.join('\n').slice(0, 5200);
}

main();
