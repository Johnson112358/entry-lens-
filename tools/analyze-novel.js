/**
 * 真实语料分析（analyze-novel.js）——临时工具
 * 用法：node tools/analyze-novel.js [窗口数] [每窗口行数]
 * 职责：对《轮回乐园》真实文本随机采样窗口，跑解析器，
 *       输出识别块清单/类型分布/可疑未识别行，供人工审查调优。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const CORE = require(path.join(ROOT, 'plugin/src/el-core.js'));
const RENDER = require(path.join(ROOT, 'plugin/src/el-render.js'));

const NOVEL = path.join(ROOT, '轮回乐园.txt');
const WINDOWS = parseInt(process.argv[2] || '30', 10);
const WIN_LINES = parseInt(process.argv[3] || '400', 10);

function strip(html) {
  return html
    .replace(/<usehtml>/g, '')
    .replace(/<\n/g, '\n')
    .replace(/<$/g, '')
    .replace(/<br>/g, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
}

const text = fs.readFileSync(NOVEL, 'utf8');
const lines = text.split(/\r?\n/);
console.log('总行数:', lines.length, ' 窗口数:', WINDOWS, ' 每窗口行数:', WIN_LINES);

// 均匀采样窗口起点
const starts = [];
const step = Math.max(1, Math.floor(lines.length / (WINDOWS + 1)));
for (let i = 0; i < WINDOWS; i++) { starts.push(step * (i + 1)); }

const stats = { panel: 0, prompt: 0, quest: 0, choice: 0, confirm: 0, value: 0, integrityFail: 0 };
const suspicious = []; // 未识别但可疑的行
const blockSamples = []; // 各类块的代表样本

let processed = 0;
for (const s of starts) {
  const win = lines.slice(s, s + WIN_LINES).join('\n');
  const blocks = CORE.parseChapter(win).blocks;
  const rendered = RENDER.renderChapter(win);
  if (strip(rendered) !== win) { stats.integrityFail++; }
  for (const b of blocks) {
    if (b.type === 'system') { stats[b.subType]++; }
    else { stats[b.type]++; }
    if (blockSamples.length < 60) {
      blockSamples.push({ atLine: s, block: b, lines: win.split('\n').slice(b.startLine, Math.min(b.endLine + 1, b.startLine + 6)) });
    }
  }
  processed++;
}

console.log('\n=== 块类型统计（' + processed + ' 窗口 × ' + WIN_LINES + ' 行）===');
console.log(JSON.stringify(stats));
console.log('原文完整性失败窗口:', stats.integrityFail);

console.log('\n=== 识别块样本（前 60 个）===');
for (const s of blockSamples) {
  const b = s.block;
  const head = b.type === 'panel'
    ? 'panel name=' + (b.name || '(属性)') + ' rarity=' + (b.rarity || '-') + ' fields=' + b.fields.length
    : b.type === 'system'
      ? b.subType + ' title=' + (b.title || '').slice(0, 30) + ' fields=' + b.fields.length + ' opts=' + b.options.length
      : 'value changes=' + b.changes.map(c => c.attr + c.raw).join(',');
  console.log('@L' + s.atLine + ' [' + head + ']');
  for (const l of s.lines) { console.log('    | ' + l.slice(0, 70)); }
}

// 可疑未识别行：含【】但未被分类的行
console.log('\n=== 未识别【】行样本（每窗口前 8 条）===');
let shown = 0;
for (const s of starts) {
  const winLines = lines.slice(s, s + WIN_LINES);
  const blocks = CORE.parseChapter(winLines.join('\n')).blocks;
  const blockLines = new Set();
  for (const b of blocks) { for (let i = b.startLine; i <= b.endLine; i++) { blockLines.add(i); } }
  let cnt = 0;
  for (let i = 0; i < winLines.length && cnt < 8; i++) {
    const l = winLines[i];
    if (blockLines.has(i)) { continue; }
    if (/^【[^】]{2,40}】$/.test(l.trim()) && l.length <= 80) {
      console.log('  @L' + (s + i) + ': ' + l.slice(0, 70));
      cnt++; shown++;
    }
  }
  if (shown > 120) { break; }
}
console.log('（共展示 ' + Math.min(shown, 120) + ' 条）');
