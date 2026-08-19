/*
 * EntryLens rule bundle v0.1.0
 * 由 tools/build-rule.js 生成，勿手改；改源码后重新构建。
 * 运行环境：Legado 替换规则 @js:（Rhino 1.8.1），入口见 replace-rules.json。
 */
(function (global) {
'use strict';
var ELConfig = {
version: '0.1.0',
rarity: {
order: ['白色', '绿色', '蓝色', '紫色', '橙色', '红色'],
colors: {
'白色': '#C0C0C0',
'绿色': '#2ECC71',
'蓝色': '#4A90D9',
'紫色': '#9B59B6',
'橙色': '#E67E22',
'红色': '#E74C3C'
},
aliases: {
'白': '白色', '白色': '白色', '普通': '白色', '粗糙': '白色', '破旧': '白色', '凡品': '白色',
'绿': '绿色', '绿色': '绿色', '精良': '绿色', '优秀': '绿色', '良好': '绿色', '优良': '绿色', '良品': '绿色',
'蓝': '蓝色', '蓝色': '蓝色', '稀有': '蓝色', '罕见': '蓝色', '珍稀': '蓝色', '高级': '蓝色', '上品': '蓝色',
'紫': '紫色', '紫色': '紫色', '暗紫色': '紫色', '史诗': '紫色', '史诗级': '紫色', '极品': '紫色', '完美': '紫色', '完美级': '紫色', '珍宝': '紫色', '绝品': '紫色',
'橙': '橙色', '橙色': '橙色', '传说': '橙色', '传说级': '橙色', '传奇': '橙色', '绝世': '橙色', '神器': '橙色', '仙品': '橙色', '金色': '橙色', '淡金色': '橙色', '暗金色': '橙色',
'红': '红色', '红色': '红色', '神话': '红色', '超神': '红色', '神品': '红色', '禁忌': '红色'
}
},
panel: {
attrWords: [
'名称', '生命值', '法力值', '魔法值', '体力值', '精力值', '怒气值',
'力量', '敏捷', '智力', '体质', '耐力', '精神', '感知', '意志', '魅力', '幸运',
'攻击力', '防御力', '护甲', '魔抗', '法抗', '物抗',
'暴击', '暴击率', '暴击伤害', '攻击速度', '移动速度', '施法速度',
'生命恢复', '法力恢复', '体力恢复', '生命回复', '法力回复',
'经验值', '经验', '等级', '职业', '种族', '称号', '阵营', '战力',
'金币', '银币', '铜币', '装备等级', '耐久度', '品质', '稀有度', '产地', '重量', '售价',
'攻击', '防御', '生命', '法力', '魔力', '体力', '精力', '耐力',
'格挡', '闪避', '命中', '穿透', '吸血', '伤害加成', '伤害减免', '冷却缩减',
'技能伤害', '治疗效果', '护盾值', '怒气', '仇恨值',
'抗性', '火抗', '冰抗', '雷抗', '毒抗', '暗抗', '光抗', '风抗', '土抗',
'属性点', '自由属性点', '技能点', '天赋点', '觉醒点',
'境界', '修为', '灵力', '真气', '魂力', '斗气', '剑气', '精神力', '灵气',
'伤害', '速度', '射程', '范围', '距离', '冷却时间', '持续时间', '生效时间',
'需求', '使用要求', '穿戴要求', '绑定', '是否绑定', '可否交易', '可否出售',
'描述', '说明', '效果', '特效', '被动效果', '主动效果', '套装效果',
'材料', '数量', '上限', '当前值', '容量', '进度', '完成度', '目标', '奖励', '惩罚'
],
maxFieldLines: 12,
minFieldLines: 2,
skillTitleRegex: /^【[\u4e00-\u9fa5A-Za-z0-9 ]{1,12}[:：][Ll][Vv]\.?\d+[^】]*】$/,
nameTitleRegex: /^【([^】:：]+)】$/
},
system: {
questKeywords: ['支线任务', '主线任务', '每日任务', '每周任务', '隐藏任务', '活动任务', '任务'],
choiceKeywords: ['你可在以下奖励中', '请在以下奖励中', '请在以下选项', '请选择以下', '请选择', '选择其一', '获得以下奖励', '奖励如下', '可选择', '奖励列表', '请做出选择', '二选一', '三选一'],
confirmKeywords: ['是/否', '是否', '确认', '激活', '启动'],
promptKeywords: ['提示', '系统提示', '公告', '警告'],
promptHints: [
'提升', '获得', '开启', '解锁', '下降', '上升', '成功', '完成', '激活',
'触发', '增加', '减少', '失效', '恢复', '晋升', '突破', '升级', '降级', '学会',
'称号', '等级', 'Lv', 'lv', 'LV', '％', '%', '经验', '金币', '奖励', '惩罚',
'进度', '更新', '刷新', '冷却',
'属性点', '检核', '匹配', '公证', '结算', '传送', '传输', '强化', '契约', '击杀',
'图纸', '宝箱', '光环', '加持', '失败', '天赋', '卷轴', '技能'
],
promptFallback: {
minLineLen: 9,
punct: '，。！？!?…'
},
promptMaxLength: 60,
optionLineRegex: /^[A-Za-z0-9一二三四五六七八九十]{1,2}[.、:：]\s*\S/,
yesNoLineRegex: /^[是]\/[否]/,
maxBlockLines: 20
},
value: {
prefixes: ['获得', '消耗', '提升', '增加', '减少', '失去', '恢复', '扣除', '降低', '上涨', '下跌', '增长', '掉落'],
abbrWords: ['HP', 'MP', 'EXP', 'SP', 'ATK', 'DEF', 'STR', 'AGI', 'INT', 'VIT', 'LUK', 'LV', 'Lv'],
attrMinLen: 2,
attrMaxLen: 5,
attrTailBlacklist: ['说', '道', '问', '答', '喊', '叫', '是', '有', '要', '能', '会', '在'],
minHits: 1,
maxHits: 6
},
colors: {
fieldLabel: '#8A8A8A',
warn: '#E74C3C',
title: '#C9A227',
plus: '#2ECC71',
minus: '#E74C3C',
badge: '#C9A227',
yesColor: '#2ECC71',
noColor: '#E74C3C'
},
render: {
panelHr: 1,
systemHr: 1,
entryUnderline: 1,
valueBold: 1
}
};
if (typeof module !== 'undefined' && module.exports) {
module.exports = ELConfig;
}
if (global) {
global.ELConfig = ELConfig;
}
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));

(function (global) {
'use strict';
var CFG = (typeof ELConfig !== 'undefined') ? ELConfig : require('./el-config.js');
function trim(s) {
return String(s).replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
}
function hasChinese(s) {
return /[\u4e00-\u9fa5]/.test(s);
}
var FIELD_RE = /^([^:：【】]{1,12})([:：])(.+)$/;
function isBlockEndLine(line) {
if (line === '') { return true; }
if (/^…{2,}/.test(line) || /…+$/.test(line)) { return true; }
if (/^【/.test(line)) { return true; }
return false;
}
function isOptionLine(line) {
return CFG.system.optionLineRegex.test(line);
}
function isYesNoLine(line) {
return CFG.system.yesNoLineRegex.test(line);
}
function inArray(arr, v) {
return arr.indexOf(v) !== -1;
}
function startsWithAny(str, keywords) {
for (var k = 0; k < keywords.length; k++) {
if (str.indexOf(keywords[k]) === 0) { return true; }
}
return false;
}
function containsAny(str, keywords) {
for (var k = 0; k < keywords.length; k++) {
if (str.indexOf(keywords[k]) !== -1) { return true; }
}
return false;
}
function parseRarityText(text) {
var t = trim(String(text)).replace(/[。．.、，,；;：:]|（[^（）]*）$/g, '');
var aliases = CFG.rarity.aliases;
var bestKey = null;
for (var k in aliases) {
if (t.indexOf(k) !== -1 && (bestKey === null || k.length > bestKey.length)) {
bestKey = k;
}
}
if (bestKey === null) { return null; }
var rarity = aliases[bestKey];
return { rarity: rarity, color: CFG.rarity.colors[rarity] || null };
}
function parseRarity(text) {
var m = /（([^（）]{1,6})）$/.exec(trim(text));
if (!m) { return null; }
var alias = CFG.rarity.aliases[m[1]];
if (!alias) { return null; }
return {
rarity: alias,
color: CFG.rarity.colors[alias] || null
};
}
function classifyBracketLine(line) {
var m = /^【([^】]*)】$/.exec(trim(line));
if (!m) { return { kind: 'plain' }; }
var inner = m[1];
var r = { kind: 'plain', title: inner, inner: inner, rarity: null, color: null };
if (CFG.panel.skillTitleRegex.test(trim(line))) {
r.kind = 'skill';
return r;
}
if (containsAny(inner, CFG.system.confirmKeywords)) {
r.kind = 'confirm';
return r;
}
if (isQuestTitle(inner)) {
r.kind = 'quest';
return r;
}
if (containsAny(inner, CFG.system.choiceKeywords)) {
r.kind = 'choice';
return r;
}
if (CFG.panel.nameTitleRegex.test(trim(line))) {
var rar = parseRarity(inner);
r.kind = 'panel-head';
if (rar) {
r.rarity = rar.rarity;
r.color = rar.color;
r.name = trim(inner.replace(/（[^（）]{1,6}）$/, ''));
} else {
r.name = trim(inner);
}
return r;
}
if (isPromptLike(inner, trim(line))) {
r.kind = 'prompt';
return r;
}
return r; // 其他【】行（含冒号非Lv等）→ plain
}
function isPromptLike(inner, line) {
if (startsWithAny(inner, CFG.system.promptKeywords) || containsAny(inner, CFG.system.promptHints)) {
return line.length <= CFG.system.promptMaxLength;
}
if (line.length <= CFG.system.promptMaxLength && line.length >= CFG.system.promptFallback.minLineLen && !/^(他|她|我|你|他们|她们|你们)[说道问答喊叫]/.test(inner)) {
var punct = CFG.system.promptFallback.punct;
for (var p = 0; p < punct.length; p++) {
if (inner.indexOf(punct.charAt(p)) !== -1) { return true; }
}
}
return false;
}
function isQuestTitle(inner) {
var qk = CFG.system.questKeywords;
for (var i = 0; i < qk.length; i++) {
var kw = qk[i];
if (kw === '任务') {
if (/^任务[:：!！]/.test(inner)) { return true; }
} else if (inner.indexOf(kw) === 0) {
return true;
}
}
if (/任务$/.test(inner)) { return true; }
return false;
}
var ABBR_SET = (function () {
var s = {};
var arr = CFG.value.abbrWords;
for (var i = 0; i < arr.length; i++) { s[arr[i].toLowerCase()] = 1; }
return s;
})();
var PREFIX_SET = (function () {
var s = {};
var arr = CFG.value.prefixes;
for (var i = 0; i < arr.length; i++) { s[arr[i]] = 1; }
return s;
})();
var ATTR_WORD_SET = (function () {
var s = {};
var arr = CFG.panel.attrWords;
for (var i = 0; i < arr.length; i++) { s[arr[i]] = 1; }
return s;
})();
var TAIL_BLACKLIST = CFG.value.attrTailBlacklist;
function validAttrBefore(prefix) {
if (prefix === '') { return false; }
var lo = prefix.toLowerCase();
if (ABBR_SET[lo] || ABBR_SET[prefix]) { return true; }
if (!hasChinese(prefix)) { return false; }
if (ATTR_WORD_SET[prefix]) {
return attrWordOk(prefix);
}
for (var pi = 0; pi < CFG.value.prefixes.length; pi++) {
var pre = CFG.value.prefixes[pi];
if (prefix.indexOf(pre) === 0) {
var rest = prefix.slice(pre.length);
if (rest !== '' && ATTR_WORD_SET[rest]) {
return attrWordOk(rest);
}
break;
}
}
return false;
}
function attrWordOk(w) {
var len = w.length;
if (len < CFG.value.attrMinLen || len > CFG.value.attrMaxLen) { return false; }
var last = w.charAt(w.length - 1);
if (inArray(TAIL_BLACKLIST, last)) { return false; }
return true;
}
function extractAttr(before) {
var seg = /([\u4e00-\u9fa5A-Za-z]{1,6})$/.exec(before);
if (!seg) { return ''; }
var s = seg[1];
if (validAttrBefore(s)) { return s; }
for (var vi = 0; vi < CFG.value.prefixes.length; vi++) {
var v = CFG.value.prefixes[vi] + '了';
if (s.length > v.length && s.slice(s.length - v.length) === v) {
var t = s.slice(0, s.length - v.length);
if (validAttrBefore(t)) { return t; }
}
}
for (var pi = 0; pi < CFG.value.prefixes.length; pi++) {
var pre = CFG.value.prefixes[pi];
if (s.indexOf(pre) === 0) {
var rest = s.slice(pre.length);
if (rest !== '' && validAttrBefore(rest)) { return rest; }
}
}
return '';
}
function analyzeValueLine(line) {
var changes = [];
var re = /([+-])(\d+(?:\.\d+)?)/g;
var m;
while ((m = re.exec(line)) !== null) {
var before = line.slice(Math.max(0, m.index - 6), m.index);
var attr = extractAttr(before);
if (attr !== '') {
changes.push({
raw: m[0],
sign: m[1],
digits: m[2],
attr: attr,
startCol: m.index,
endCol: m.index + m[0].length
});
}
if (changes.length > CFG.value.maxHits) {
return { hit: false, changes: [] }; // 数字过多，视为普通文本
}
}
return { hit: changes.length >= CFG.value.minHits, changes: changes };
}
function parseChapter(text) {
var blocks = [];
var lines = String(text).split('\n');
var i = 0;
var n = lines.length;
function buildPanelBlock(cls, rows, startLine, endLine) {
var fields = [];
var descLines = [];
var rowKinds = [];
for (var ri = 0; ri < rows.length; ri++) {
var r = rows[ri];
if (r.kind === 'field') {
fields.push({ label: r.label, value: r.value, sep: r.sep });
rowKinds.push('field');
} else {
descLines.push(r.text);
rowKinds.push('line');
}
}
var rarity = cls.rarity;
var rarityColor = cls.color;
if (!rarity) {
for (var fi = 0; fi < fields.length; fi++) {
var lbl = fields[fi].label;
if (lbl === '品质' || lbl === '稀有度' || lbl === '品级') {
var rar2 = parseRarityText(fields[fi].value);
if (rar2) {
rarity = rar2.rarity;
rarityColor = rar2.color;
break;
}
}
}
}
return {
type: 'panel',
name: (cls.kind === 'skill') ? cls.title : cls.name,
rarity: rarity,
rarityColor: rarityColor,
fields: fields,
descLines: descLines,
rowKinds: rowKinds,
startLine: startLine,
endLine: endLine
};
}
function collectSystemBlock(kind, title, startIdx) {
var fields = [];
var options = [];
var contentLines = [];
var rowKinds = [];
var j = startIdx;
while (j < n) {
var line = trim(lines[j]);
if (line === '' || isBlockEndLine(line)) { break; }
if (fields.length + options.length + contentLines.length >= CFG.system.maxBlockLines) { break; }
var fm = FIELD_RE.exec(line);
if (fm) {
fields.push({ label: trim(fm[1]), value: trim(fm[3]), sep: fm[2] });
rowKinds.push('field');
} else if (isOptionLine(line)) {
options.push(line);
rowKinds.push('option');
} else if (isYesNoLine(line)) {
options.push(line);
rowKinds.push('option');
} else {
break; // 普通叙述行：结束大框
}
j++;
}
var block = {
type: 'system',
subType: kind,
title: title,
fields: fields,
options: options,
lines: contentLines,
rowKinds: rowKinds,
startLine: startIdx - 1,
endLine: j - 1
};
return { block: block, endIdx: j };
}
while (i < n) {
var rawLine = lines[i];
var line = trim(rawLine);
if (line === '') { i++; continue; }
if (/^【/.test(line)) {
var cls = classifyBracketLine(line);
if (cls.kind === 'panel-head' || cls.kind === 'skill') {
var rows = [];
var j2 = i + 1;
while (j2 < n) {
var l2 = trim(lines[j2]);
if (l2 === '' || isBlockEndLine(l2)) { break; }
if (rows.length >= CFG.panel.maxFieldLines) { break; }
var m2 = FIELD_RE.exec(l2);
if (m2) {
rows.push({ kind: 'field', label: trim(m2[1]), value: trim(m2[3]), sep: m2[2] });
} else {
rows.push({ kind: 'line', text: l2 });
}
j2++;
}
if (cls.kind === 'panel-head') {
var fieldCount = 0;
for (var fc = 0; fc < rows.length; fc++) { if (rows[fc].kind === 'field') { fieldCount++; } }
if (fieldCount >= CFG.panel.minFieldLines) {
blocks.push(buildPanelBlock(cls, rows, i, j2 - 1));
i = j2;
continue;
}
if (isPromptLike(cls.title, line)) {
blocks.push({
type: 'system',
subType: 'prompt',
title: cls.title,
fields: [],
options: [],
lines: [],
rowKinds: [],
startLine: i,
endLine: i
});
}
i++;
continue;
}
if (rows.length >= 1) {
blocks.push(buildPanelBlock(cls, rows, i, j2 - 1));
i = j2;
continue;
}
i++; // 无后续内容 → 降级
continue;
}
if (cls.kind === 'quest' || cls.kind === 'choice' || cls.kind === 'confirm') {
var collected = collectSystemBlock(cls.kind, cls.title, i + 1);
var ok = false;
if (cls.kind === 'quest') {
ok = collected.block.fields.length + collected.block.options.length + collected.block.lines.length >= 1;
} else if (cls.kind === 'choice') {
ok = collected.block.options.length >= 2;
} else { // confirm
ok = collected.block.fields.length + collected.block.options.length + collected.block.lines.length >= 1;
}
if (ok) {
blocks.push(collected.block);
i = collected.endIdx;
} else {
if (isPromptLike(cls.title, line)) {
blocks.push({
type: 'system',
subType: 'prompt',
title: cls.title,
fields: [],
options: [],
lines: [],
rowKinds: [],
startLine: i,
endLine: i
});
}
i++;
}
continue;
}
if (cls.kind === 'prompt') {
blocks.push({
type: 'system',
subType: 'prompt',
title: cls.title,
fields: [],
options: [],
lines: [],
startLine: i,
endLine: i
});
i++;
continue;
}
i++;
continue;
}
var fm2 = FIELD_RE.exec(line);
if (fm2) {
var label = trim(fm2[1]);
if (ATTR_WORD_SET[label]) {
var attrFields = [];
var j = i;
var seen = 0;
var hitCount = 0;
while (j < n) {
var l2 = trim(lines[j]);
if (l2 === '' || isBlockEndLine(l2)) { break; }
var m2 = FIELD_RE.exec(l2);
if (!m2) { break; }
seen++;
if (ATTR_WORD_SET[trim(m2[1])]) { hitCount++; }
attrFields.push({ label: trim(m2[1]), value: trim(m2[3]), sep: m2[2] });
if (seen >= CFG.panel.maxFieldLines) { j++; break; }
j++;
}
var ok2 = (hitCount >= 2) || (seen >= 3);
if (ok2 && seen >= 2) {
var fieldKinds = [];
for (var fk = 0; fk < attrFields.length; fk++) { fieldKinds.push('field'); }
blocks.push({
type: 'panel',
name: null, // 属性面板无名称
rarity: null,
rarityColor: null,
fields: attrFields,
rowKinds: fieldKinds,
startLine: i,
endLine: j - 1
});
i = j;
continue;
}
}
}
var v = analyzeValueLine(line);
if (v.hit) {
blocks.push({
type: 'value',
changes: v.changes,
startLine: i,
endLine: i
});
i++;
continue;
}
i++;
}
return { blocks: blocks };
}
var api = { parseChapter: parseChapter, classifyBracketLine: classifyBracketLine, analyzeValueLine: analyzeValueLine, parseRarity: parseRarity };
if (typeof module !== 'undefined' && module.exports) {
module.exports = api;
}
if (global) {
global.ELCore = api;
}
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));

(function (global) {
'use strict';
var CFG = (typeof ELConfig !== 'undefined') ? ELConfig : require('./el-config.js');
var CORE = (typeof ELCore !== 'undefined') ? ELCore : require('./el-core.js');
var C = CFG.colors;
function esc(s) {
return String(s)
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;');
}
function trim(s) {
return String(s).replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
}
function font(color, innerHtml) {
return '<font color="' + color + '">' + innerHtml + '</font>';
}
function bold(innerHtml) {
return '<b>' + innerHtml + '</b>';
}
function underline(innerHtml) {
return '<u>' + innerHtml + '</u>';
}
function hr() {
return '<hr>';
}
function trimTrailingNewline(s) {
return String(s).replace(/\n+$/, '');
}
function useHtml(innerHtml) {
return '<usehtml>' + innerHtml + '<';
}
function highlightChanges(text, changes) {
var out = [];
var pos = 0;
for (var i = 0; i < changes.length; i++) {
var ch = changes[i];
if (ch.startCol > pos) {
out.push(esc(text.slice(pos, ch.startCol)));
}
var color = (ch.sign === '-') ? C.minus : C.plus;
var inner = esc(ch.raw);
if (CFG.render.valueBold) { inner = bold(inner); }
out.push(font(color, inner));
pos = ch.endCol;
}
if (pos < text.length) {
out.push(esc(text.slice(pos)));
}
return out.join('');
}
function highlightValueInText(text) {
var v = CORE.analyzeValueLine(text);
if (!v.hit) { return esc(text); }
return highlightChanges(text, v.changes);
}
function renderField(f) {
var label = font(C.fieldLabel, esc(f.label));
var sep = f.sep || '：'; // 保留原文分隔符（半角/全角）
var value = f.value;
var prefixHit = /^(提示|警告|注意)[:：]?/.exec(value);
var valueHtml;
if (prefixHit) {
var head = prefixHit[0];
var rest = value.slice(head.length);
valueHtml = font(C.warn, bold(esc(head))) + esc(rest);
} else {
valueHtml = highlightValueInText(value);
}
return label + sep + valueHtml;
}
function renderPanel(block, lines) {
var out = [];
if (CFG.render.panelHr) { out.push(hr()); }
var rowKinds = block.rowKinds || [];
if (block.name !== null && block.name !== undefined) {
var nameLine = trim(lines[block.startLine]); // 【名称（稀有度）】
var inner = nameLine.replace(/^【/, '').replace(/】$/, '');
var rarM = /（([^（）]{1,6})）$/.exec(inner);
var namePart = inner;
var rarityPart = '';
if (rarM && CFG.rarity.aliases[rarM[1]]) {
namePart = inner.slice(0, rarM.index);
rarityPart = rarM[0];
}
var nameHtml = esc(namePart);
var nameIsSentence = /[。！？.!?]$/.test(namePart);
if (block.rarityColor) {
nameHtml = font(block.rarityColor, nameIsSentence ? bold(nameHtml) : bold(underline(nameHtml)));
} else {
nameHtml = nameIsSentence ? bold(nameHtml) : underline(nameHtml);
}
out.push('【' + nameHtml + esc(rarityPart) + '】');
}
var fi = 0;
var li = 0;
for (var k = 0; k < rowKinds.length; k++) {
if (k === 0 && block.name !== null && block.name !== undefined) { out.push('<br>'); }
if (rowKinds[k] === 'field') {
out.push(renderField(block.fields[fi++]));
} else {
out.push(esc(block.descLines[li++]));
}
if (k < rowKinds.length - 1) { out.push('<br>'); }
}
if (CFG.render.panelHr) { out.push(hr()); }
return useHtml(out.join(''));
}
function renderPrompt(block) {
var inner = block.title; // 【】内文本
var prefixHit = /^(提示|系统提示|公告|警告)[:：]?/.exec(inner);
var html;
if (prefixHit) {
var head = prefixHit[0];
var rest = inner.slice(head.length);
html = font(C.warn, bold(esc(head))) + esc(rest);
} else {
html = esc(inner);
}
var out = [];
if (CFG.render.systemHr) { out.push(hr()); }
out.push('【' + html + '】'); // 原文【】保留
if (CFG.render.systemHr) { out.push(hr()); }
return useHtml(out.join(''));
}
function renderOptionLine(line) {
var m = /^([A-Za-z0-9一二三四五六七八九十]{1,2})([.、:：])(\s*)(.*)$/.exec(line);
if (m) {
return font(C.badge, bold(esc(m[1]))) + esc(m[2]) + esc(m[3]) + esc(m[4]);
}
var yn = /^[是]\/[否](.*)$/.exec(line);
if (yn) {
return font(C.yesColor, bold(esc('是'))) + '/' + font(C.noColor, bold(esc('否'))) + esc(yn[1]);
}
return esc(line);
}
function renderSystemBlock(block, lines) {
var out = [];
if (CFG.render.systemHr) { out.push(hr()); }
var titleLine = trim(lines[block.startLine]);
out.push(font(C.title, bold(esc(titleLine))));
out.push('\n');
var fi = 0;
var oi = 0;
var li = 0;
for (var k = 0; k < block.rowKinds.length; k++) {
var kind = block.rowKinds[k];
if (kind === 'field') {
out.push(renderField(block.fields[fi++]));
} else if (kind === 'option') {
out.push(renderOptionLine(block.options[oi++]));
} else {
out.push(esc(block.lines[li++]));
}
if (k < block.rowKinds.length - 1) { out.push('<br>'); }
}
if (CFG.render.systemHr) { out.push(hr()); }
return useHtml(out.join(''));
}
function renderValueBlock(block) {
return useHtml(highlightChanges(trim(block.rawLine), block.changes));
}
function renderChapter(text) {
var result = parseBlocks(text);
if (result.error) { return String(text); } // 降级：异常返回原文
var lines = result.lines;
var blocks = result.blocks;
var out = [];
var i = 0;
var n = lines.length;
var bi = 0;
while (i < n) {
var block = null;
if (bi < blocks.length && blocks[bi].startLine === i) {
block = blocks[bi];
}
if (block) {
var html;
if (block.type === 'panel') {
html = renderPanel(block, lines);
} else if (block.type === 'system' && block.subType === 'prompt') {
html = renderPrompt(block);
} else if (block.type === 'system') {
html = renderSystemBlock(block, lines);
} else { // value
html = renderValueBlock(block);
}
out.push(html);
i = block.endLine + 1;
bi++;
} else {
out.push(esc(trim(lines[i])));
i++;
}
if (i < n) { out.push('\n'); }
}
return out.join('');
}
function parseBlocks(text) {
try {
var lines = String(text).split('\n');
var parsed = CORE.parseChapter(text);
var blocks = parsed.blocks;
for (var i = 0; i < blocks.length; i++) {
if (blocks[i].type === 'value') {
blocks[i].rawLine = lines[blocks[i].startLine];
}
}
return { lines: lines, blocks: blocks };
} catch (e) {
return { error: true };
}
}
var api = {
renderChapter: renderChapter,
parseBlocks: parseBlocks,
renderField: renderField,
highlightValueInText: highlightValueInText
};
if (typeof module !== 'undefined' && module.exports) {
module.exports = api;
}
if (global) {
global.ELRender = api;
}
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
