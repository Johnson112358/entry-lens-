/**
 * EntryLens 渲染器（el-render.js）
 * 版本：v0.1.0
 * 职责：整章文本 → 增强 HTML（普通段落原样 + <usehtml>HTML段落<）。
 * 环境：Rhino 1.8.1（Legado @js:）与 Node 双环境，必须 ES5.1 兼容。
 * 铁律：
 *   1. 原文一个字符都不增删改（HTML 标签是包裹层；原文文本一律转义 & < >）。
 *   2. 输出中禁止裸 "<"（<usehtml> 段以 "<" 结尾，Legado 取最后一个 "<" 之前内容）。
 *   3. 任何异常 → 返回原文（降级保护）。
 */
(function (global) {
  'use strict';

  var CFG = (typeof ELConfig !== 'undefined') ? ELConfig : require('./el-config.js');
  var CORE = (typeof ELCore !== 'undefined') ? ELCore : require('./el-core.js');

  var C = CFG.colors;

  /* ==================================================================== *
   * HTML 工具
   * ==================================================================== */

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

  function small(innerHtml) {
    return '<small>' + innerHtml + '</small>';
  }

  function hr() {
    return '<hr>';
  }

  /** 去掉字符串尾部换行（块内行分隔符不产生多余换行） */
  function trimTrailingNewline(s) {
    return String(s).replace(/\n+$/, '');
  }

  /** usehtml 段包裹 */
  function useHtml(innerHtml) {
    return '<usehtml>' + innerHtml + '<';
  }

  /* ==================================================================== *
   * 数值高亮（PRD 3.2.5：+ 绿 / - 红；面板/大框内同样生效）
   * ==================================================================== */

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

  /** 对任意短文本做数值高亮（字段值内） */
  function highlightValueInText(text) {
    var v = CORE.analyzeValueLine(text);
    if (!v.hit) { return esc(text); }
    return highlightChanges(text, v.changes);
  }

  /* ==================================================================== *
   * 字段行渲染：<font 灰>字段名</font>：值
   * 值中"提示/警告"前缀标红、数值增减高亮
   * ==================================================================== */

  function renderField(f) {
    var label = font(C.fieldLabel, esc(f.label));
    var sep = f.sep || '：'; // 保留原文分隔符（半角/全角）
    var value = f.value;
    // 值以 提示/警告 等开头 → 前缀标红
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

  /* ==================================================================== *
   * 面板块渲染（PRD 3.2.2）
   * ==================================================================== */

  function renderPanel(block, lines) {
    var out = [];
    if (CFG.render.panelHr) { out.push(hr()); }
    var rowKinds = block.rowKinds || [];

    // 名称行（原文整行保留：【名称（稀有度）】；名称稀有度色 + 下划线，无稀有度 → 正文样式 + 下划线）
    if (block.name !== null && block.name !== undefined) {
      var nameLine = trim(lines[block.startLine]); // 【名称（稀有度）】
      var inner = nameLine.replace(/^【/, '').replace(/】$/, '');
      // 拆出稀有度后缀（（白色）），仅名称部分着色
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
      if (block.bracketed === false) {
        // 独立名称行（原文无【】）：破旧的燧发枪（白色）
        out.push(nameHtml + esc(rarityPart));
      } else {
        out.push('【' + nameHtml + esc(rarityPart) + '】');
      }
    }

    // 内容行按原始行序渲染（rowKinds 保序）：字段行分级 + 描述行原样；行间 <br> 换行
    // 内容整体 <small> 缩小字号（名称行保持正常字号突出）
    var fi = 0;
    var li = 0;
    var body = [];
    for (var k = 0; k < rowKinds.length; k++) {
      if (k === 0 && block.name !== null && block.name !== undefined) { body.push('<br>'); }
      if (rowKinds[k] === 'field') {
        body.push(renderField(block.fields[fi++]));
      } else {
        body.push(esc(block.descLines[li++]));
      }
      if (k < rowKinds.length - 1) { body.push('<br>'); }
    }
    if (CFG.render.smallPanel && body.length > 0) {
      out.push(small(body.join('')));
    } else {
      out.push(body.join(''));
    }

    if (CFG.render.panelHr) { out.push(hr()); }
    return useHtml(out.join(''));
  }

  /* ==================================================================== *
   * 系统提示单行框（PRD 3.2.3）：一行一框，前缀标红/加粗，不弹窗
   * ==================================================================== */

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
    var box = '【' + html + '】'; // 原文【】保留
    out.push(CFG.render.smallSystem ? small(box) : box);
    if (CFG.render.systemHr) { out.push(hr()); }
    return useHtml(out.join(''));
  }

  /* ==================================================================== *
   * 系统大框（PRD 3.2.4）：quest / choice / confirm
   * ==================================================================== */

  function renderOptionLine(line) {
    // 选项字母徽章：A. / 1、 / 二、 等
    var m = /^([A-Za-z0-9一二三四五六七八九十]{1,2})([.、:：])(\s*)(.*)$/.exec(line);
    if (m) {
      return font(C.badge, bold(esc(m[1]))) + esc(m[2]) + esc(m[3]) + esc(m[4]);
    }
    // 是/否 按钮样式
    var yn = /^[是]\/[否](.*)$/.exec(line);
    if (yn) {
      return font(C.yesColor, bold(esc('是'))) + '/' + font(C.noColor, bold(esc('否'))) + esc(yn[1]);
    }
    return esc(line);
  }

  function renderSystemBlock(block, lines) {
    var out = [];
    if (CFG.render.systemHr) { out.push(hr()); }

    // 标题行（原文整行保留，加粗高亮；不缩小以保持层级）
    var titleLine = trim(lines[block.startLine]);
    out.push(font(C.title, bold(esc(titleLine))));

    // 后续行按原始行序渲染（rowKinds 保序）；行间 <br> 换行；内容整体 <small> 缩小字号
    var fi = 0;
    var oi = 0;
    var li = 0;
    var body = [];
    for (var k = 0; k < block.rowKinds.length; k++) {
      var kind = block.rowKinds[k];
      if (kind === 'field') {
        body.push(renderField(block.fields[fi++]));
      } else if (kind === 'option') {
        body.push(renderOptionLine(block.options[oi++]));
      } else {
        body.push(esc(block.lines[li++]));
      }
      if (k < block.rowKinds.length - 1) { body.push('<br>'); }
    }
    if (CFG.render.smallSystem && body.length > 0) {
      out.push('<br>');
      out.push(small(body.join('')));
    } else {
      out.push('<br>');
      out.push(body.join(''));
    }

    if (CFG.render.systemHr) { out.push(hr()); }
    return useHtml(out.join(''));
  }

  /* ==================================================================== *
   * 数值增减行（PRD 3.2.5）：整行包裹，数值段高亮
   * ==================================================================== */

  function renderValueBlock(block) {
    return useHtml(highlightChanges(trim(block.rawLine), block.changes));
  }

  /* ==================================================================== *
   * 主入口：text → 增强 HTML
   * ==================================================================== */

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

  /**
   * 解析 + 行数据准备（供测试与渲染共用）
   * 返回 {lines, blocks}；任何异常 → {error: true}
   */
  function parseBlocks(text) {
    try {
      var lines = String(text).split('\n');
      var parsed = CORE.parseChapter(text);
      var blocks = parsed.blocks;
      // value 块补充 rawLine（渲染需要原始行）
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
