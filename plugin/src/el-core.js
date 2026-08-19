/**
 * EntryLens 解析器（el-core.js）
 * 版本：v0.1.0
 * 职责：整章文本 → 块对象数组（PRD §8 数据模型）。
 * 环境：Rhino 1.8.1（Legado @js:）与 Node（测试）双环境，必须 ES5.1 兼容。
 * 铁律：只读输入、不修改原文；识别不确定 → 不产出块（降级由调用方保证原文输出）。
 */
(function (global) {
  'use strict';

  var CFG = (typeof ELConfig !== 'undefined') ? ELConfig : require('./el-config.js');

  /* ==================================================================== *
   * 工具函数
   * ==================================================================== */

  function trim(s) {
    return String(s).replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
  }

  /** 行内是否含中文 */
  function hasChinese(s) {
    return /[\u4e00-\u9fa5]/.test(s);
  }

  /** 字段行：字段名：值（字段名 1-12 字符，不含【】与冒号） */
  var FIELD_RE = /^([^:：【】]{1,12})[:：](.+)$/;

  /** 面板结束标记：空行 / …… / 新【】块 */
  function isBlockEndLine(line) {
    if (line === '') { return true; }
    if (/^…{2,}/.test(line) || /…+$/.test(line)) { return true; }
    if (/^【/.test(line)) { return true; }
    return false;
  }

  /** 选项行：A. / A、 / 1. / 一、 等 */
  function isOptionLine(line) {
    return CFG.system.optionLineRegex.test(line);
  }

  /** 是/否 行 */
  function isYesNoLine(line) {
    return CFG.system.yesNoLineRegex.test(line);
  }

  /** 在数组中查（indexOf 包装） */
  function inArray(arr, v) {
    return arr.indexOf(v) !== -1;
  }

  /** 字符串是否以任一关键词开头 */
  function startsWithAny(str, keywords) {
    for (var k = 0; k < keywords.length; k++) {
      if (str.indexOf(keywords[k]) === 0) { return true; }
    }
    return false;
  }

  /** 字符串是否包含任一关键词 */
  function containsAny(str, keywords) {
    for (var k = 0; k < keywords.length; k++) {
      if (str.indexOf(keywords[k]) !== -1) { return true; }
    }
    return false;
  }

  /** 稀有度解析：文本 → {rarity, color} 或 null */
  function parseRarity(text) {
    // 提取末尾括号：xxx（白色）
    var m = /（([^（）]{1,6})）$/.exec(trim(text));
    if (!m) { return null; }
    var alias = CFG.rarity.aliases[m[1]];
    if (!alias) { return null; }
    return {
      rarity: alias,
      color: CFG.rarity.colors[alias] || null
    };
  }

  /* ==================================================================== *
   * 【】行分类
   * 返回：{kind: 'panel-head'|'skill'|'quest'|'choice'|'confirm'|'prompt'|'plain',
   *        title, inner, rarity, color}
   * ==================================================================== */

  function classifyBracketLine(line) {
    var m = /^【([^】]*)】$/.exec(trim(line));
    if (!m) { return { kind: 'plain' }; }
    var inner = m[1];
    var r = { kind: 'plain', title: inner, inner: inner, rarity: null, color: null };

    // 技能面板：【技能名：Lv.X（类型）】
    if (CFG.panel.skillTitleRegex.test(trim(line))) {
      r.kind = 'skill';
      return r;
    }
    // 确认/激活（优先于任务，避免"是/否接受任务…"被任务抢占）
    if (containsAny(inner, CFG.system.confirmKeywords)) {
      r.kind = 'confirm';
      return r;
    }
    // 任务（发布形态：以任务结构词开头，或以"任务"结尾）
    if (isQuestTitle(inner)) {
      r.kind = 'quest';
      return r;
    }
    // 选择/奖励
    if (containsAny(inner, CFG.system.choiceKeywords)) {
      r.kind = 'choice';
      return r;
    }
    // 系统提示（以"提示"等开头，或含系统提示特征词，且行短）
    if (startsWithAny(inner, CFG.system.promptKeywords) || containsAny(inner, CFG.system.promptHints)) {
      if (trim(line).length <= CFG.system.promptMaxLength) {
        r.kind = 'prompt';
      }
      return r;
    }
    // 纯名称标题：【名称】或【名称（稀有度）】
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
    return r; // 其他【】行（含冒号非Lv等）→ plain
  }

  /** 任务标题判定：以任务结构词开头，或以"任务"结尾（排除"任务进度更新"等提示形态） */
  function isQuestTitle(inner) {
    var qk = CFG.system.questKeywords;
    for (var i = 0; i < qk.length; i++) {
      var kw = qk[i];
      if (kw === '任务') {
        // 裸"任务"只认"任务：/任务！"等发布形态，防"任务进度更新"误判
        if (/^任务[:：!！]/.test(inner)) { return true; }
      } else if (inner.indexOf(kw) === 0) {
        return true;
      }
    }
    if (/任务$/.test(inner)) { return true; }
    return false;
  }

  /** 单句说明行（confirm 大框可吞）：以句末标点结尾，≤40 字，不含冒号 */
  function isSentenceLine(line) {
    return /^[^:：]{1,40}[。！？!?]$/.test(line);
  }

  /* ==================================================================== *
   * 数值增减行分析
   * 返回：{hit: bool, changes: [{raw, startCol, endCol, sign, digits}]}
   * ==================================================================== */

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

  /** 检查"±数字"前导是否构成合法属性段 */
  function validAttrBefore(prefix) {
    if (prefix === '') { return false; }
    // 英文缩写整词
    var lo = prefix.toLowerCase();
    if (ABBR_SET[lo] || ABBR_SET[prefix]) { return true; }
    if (!hasChinese(prefix)) { return false; }
    // 中文属性词：整体命中词表（防"挥剑+5"类误报）
    if (ATTR_WORD_SET[prefix]) {
      return attrWordOk(prefix);
    }
    // 组合形态："获得经验值" → 剥离开头前缀动词后命中词表
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

  /** 属性词长度/尾字校验 */
  function attrWordOk(w) {
    var len = w.length;
    if (len < CFG.value.attrMinLen || len > CFG.value.attrMaxLen) { return false; }
    var last = w.charAt(w.length - 1);
    if (inArray(TAIL_BLACKLIST, last)) { return false; }
    return true;
  }

  /** 从符号前的文本段中提取合法属性词（支持 前缀词+属性 / 属性+了 组合） */
  function extractAttr(before) {
    var seg = /([\u4e00-\u9fa5A-Za-z]{1,6})$/.exec(before);
    if (!seg) { return ''; }
    var s = seg[1];
    if (validAttrBefore(s)) { return s; }
    // 剥离去尾动词："攻击力增加了" → "攻击力"
    for (var vi = 0; vi < CFG.value.prefixes.length; vi++) {
      var v = CFG.value.prefixes[vi] + '了';
      if (s.length > v.length && s.slice(s.length - v.length) === v) {
        var t = s.slice(0, s.length - v.length);
        if (validAttrBefore(t)) { return t; }
      }
    }
    // 剥离开头前缀动词："获得经验值" → "经验值"
    for (var pi = 0; pi < CFG.value.prefixes.length; pi++) {
      var pre = CFG.value.prefixes[pi];
      if (s.indexOf(pre) === 0) {
        var rest = s.slice(pre.length);
        if (rest !== '' && validAttrBefore(rest)) { return rest; }
      }
    }
    return '';
  }

  /** 行内数值增减扫描（列号基于 trim 后行文本；渲染时按原始行定位需对齐） */
  function analyzeValueLine(line) {
    var changes = [];
    var re = /([+-])(\d+(?:\.\d+)?)/g;
    var m;
    while ((m = re.exec(line)) !== null) {
      // 前导属性段：符号前的 0..6 个连续非符号字符
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

  /* ==================================================================== *
   * 主解析：text → { blocks: [...] }
   * 块类型：
   *   panel   {type:'panel', name, rarity, rarityColor, fields:[{label,value}], startLine, endLine}
   *   system  {type:'system', subType, title, fields:[], options:[], lines:[], startLine, endLine}
   *   value   {type:'value', changes:[...], startLine, endLine}
   * ==================================================================== */

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
          fields.push({ label: r.label, value: r.value });
          rowKinds.push('field');
        } else {
          descLines.push(r.text);
          rowKinds.push('line');
        }
      }
      return {
        type: 'panel',
        name: (cls.kind === 'skill') ? cls.title : cls.name,
        rarity: cls.rarity,
        rarityColor: cls.color,
        fields: fields,
        descLines: descLines,
        rowKinds: rowKinds,
        startLine: startLine,
        endLine: endLine
      };
    }

    function collectSystemBlock(kind, title, startIdx) {
      // 大框：吞并后续字段行/选项行/是-否行，直到结束条件
      // 普通叙述行 = 结束条件（防止把正文叙述吞进框内，PRD 结束条件精神）
      // 行序经 rowKinds 保留
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
          fields.push({ label: trim(fm[1]), value: trim(fm[2]) });
          rowKinds.push('field');
        } else if (isOptionLine(line)) {
          options.push(line);
          rowKinds.push('option');
        } else if (isYesNoLine(line)) {
          options.push(line);
          rowKinds.push('option');
        } else if (kind === 'confirm' && contentLines.length < 2 && isSentenceLine(line)) {
          // confirm 允许吞入少量"单句说明行"（是/否确认的说明文字）
          contentLines.push(line);
          rowKinds.push('line');
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

      // ---- 【】行 ----
      if (/^【/.test(line)) {
        var cls = classifyBracketLine(line);

        if (cls.kind === 'panel-head' || cls.kind === 'skill') {
          // 收集标题后的连续内容行（字段行 / 描述行），行序经 rowKinds 保留
          var rows = [];
          var j2 = i + 1;
          while (j2 < n) {
            var l2 = trim(lines[j2]);
            if (l2 === '' || isBlockEndLine(l2)) { break; }
            if (rows.length >= CFG.panel.maxFieldLines) { break; }
            var m2 = FIELD_RE.exec(l2);
            if (m2) {
              rows.push({ kind: 'field', label: trim(m2[1]), value: trim(m2[2]) });
            } else {
              rows.push({ kind: 'line', text: l2 });
            }
            j2++;
          }

          if (cls.kind === 'panel-head') {
            // 装备面板：字段行 ≥ minFieldLines 才成立
            var fieldCount = 0;
            for (var fc = 0; fc < rows.length; fc++) { if (rows[fc].kind === 'field') { fieldCount++; } }
            if (fieldCount >= CFG.panel.minFieldLines) {
              blocks.push(buildPanelBlock(cls, rows, i, j2 - 1));
              i = j2;
              continue;
            }
            i++; // 字段不足 → 降级普通行
            continue;
          }

          // 技能面板：标题 + ≥1 内容行即成立
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
          // 校验：quest 需要 ≥1 后续内容；choice 需要 ≥2 选项；confirm 需要 ≥1 后续
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
            i++; // 降级
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

        // plain：普通【】行
        i++;
        continue;
      }

      // ---- 属性面板：连续字段行（字段名命中词表）----
      var fm2 = FIELD_RE.exec(line);
      if (fm2) {
        var label = trim(fm2[1]);
        if (ATTR_WORD_SET[label]) {
          // 收集连续字段行：≥2 行且每行字段名在词表，或 ≥3 行放宽
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
            attrFields.push({ label: trim(m2[1]), value: trim(m2[2]) });
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

      // ---- 数值增减行 ----
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
