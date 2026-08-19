/**
 * EntryLens 样例集生成器（gen-fixtures.js）
 * 用法：node tools/gen-fixtures.js
 * 职责：把下方 CASES 数据（100 条设计语料）落地为 fixtures/<category>/<name>/{input.txt,expected.json}
 * 注意：这是样例的"源"，修改样例请改本文件后重新生成；expected 结构见 tools/run-fixtures.js 的 normalizeBlocks。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const FIXTURES = path.join(ROOT, 'fixtures');

/* ==================================================================== *
 * 样例定义（cat: 分类, name: 目录名, input: 原文, expected: 期望块）
 * 正例 = 应被识别；反例 = 不应被识别（blocks: []）
 * ==================================================================== */

const CASES = [];

/* ---------------- panel：装备/属性/技能面板（正例 12+2） ---------------- */

CASES.push(
  {
    cat: 'panel', name: '01-equip-white',
    input: '【破旧的燧发枪（白色）】\n产地：海贼王，利奥波特作坊\n耐久度：6/30\n攻击力：2~13（根据距离计算）',
    expected: {
      blocks: [{ type: 'panel', name: '破旧的燧发枪', rarity: '白色', rarityColor: '#C0C0C0', fields: [
        { label: '产地', value: '海贼王，利奥波特作坊' }, { label: '耐久度', value: '6/30' }, { label: '攻击力', value: '2~13（根据距离计算）' }
      ] }]
    }
  },
  {
    cat: 'panel', name: '02-equip-green',
    input: '【精铁长剑（绿色）】\n品质：精良\n攻击力：15~22\n耐久度：80/80\n重量：2.5kg\n售价：120金币',
    expected: {
      blocks: [{ type: 'panel', name: '精铁长剑', rarity: '绿色', rarityColor: '#2ECC71', fields: [
        { label: '品质', value: '精良' }, { label: '攻击力', value: '15~22' }, { label: '耐久度', value: '80/80' }, { label: '重量', value: '2.5kg' }, { label: '售价', value: '120金币' }
      ] }]
    }
  },
  {
    cat: 'panel', name: '03-equip-blue',
    input: '【秘银护腕（蓝色）】\n装备等级：30\n防御力：45\n魔抗：28\n暴击率：3%\n套装效果：秘银套（2/3）激活',
    expected: {
      blocks: [{ type: 'panel', name: '秘银护腕', rarity: '蓝色', rarityColor: '#4A90D9', fields: [
        { label: '装备等级', value: '30' }, { label: '防御力', value: '45' }, { label: '魔抗', value: '28' }, { label: '暴击率', value: '3%' }, { label: '套装效果', value: '秘银套（2/3）激活' }
      ] }]
    }
  },
  {
    cat: 'panel', name: '04-equip-purple',
    input: '【幽影法袍（紫色）】\n品质：史诗\n法术强度：+35\n法力值：+200\n冷却缩减：10%\n被动效果：施法后30%概率返还消耗',
    expected: {
      blocks: [{ type: 'panel', name: '幽影法袍', rarity: '紫色', rarityColor: '#9B59B6', fields: [
        { label: '品质', value: '史诗' }, { label: '法术强度', value: '+35' }, { label: '法力值', value: '+200' }, { label: '冷却缩减', value: '10%' }, { label: '被动效果', value: '施法后30%概率返还消耗' }
      ] }]
    }
  },
  {
    cat: 'panel', name: '05-equip-legend-alias',
    input: '【龙鳞战甲（传说）】\n防御力：120\n生命值：+800\n火抗：+40\n套装效果：龙威（3/3）',
    expected: {
      blocks: [{ type: 'panel', name: '龙鳞战甲', rarity: '橙色', rarityColor: '#E67E22', fields: [
        { label: '防御力', value: '120' }, { label: '生命值', value: '+800' }, { label: '火抗', value: '+40' }, { label: '套装效果', value: '龙威（3/3）' }
      ] }]
    }
  },
  {
    cat: 'panel', name: '06-equip-myth-alias',
    input: '【灭世魔剑（神话）】\n攻击力：500~700\n暴击率：25%\n吸血：15%\n特效：攻击时20%概率释放灭世斩',
    expected: {
      blocks: [{ type: 'panel', name: '灭世魔剑', rarity: '红色', rarityColor: '#E74C3C', fields: [
        { label: '攻击力', value: '500~700' }, { label: '暴击率', value: '25%' }, { label: '吸血', value: '15%' }, { label: '特效', value: '攻击时20%概率释放灭世斩' }
      ] }]
    }
  },
  {
    cat: 'panel', name: '07-equip-no-rarity',
    input: '【无名短弓】\n攻击力：8~12\n射程：30米\n重量：1.2kg',
    expected: {
      blocks: [{ type: 'panel', name: '无名短弓', fields: [
        { label: '攻击力', value: '8~12' }, { label: '射程', value: '30米' }, { label: '重量', value: '1.2kg' }
      ] }]
    }
  },
  {
    cat: 'panel', name: '08-attr-panel',
    input: '生命值：100/100\n法力值：50/50\n力量：12\n敏捷：15\n体质：10',
    expected: {
      blocks: [{ type: 'panel', fields: [
        { label: '生命值', value: '100/100' }, { label: '法力值', value: '50/50' }, { label: '力量', value: '12' }, { label: '敏捷', value: '15' }, { label: '体质', value: '10' }
      ] }]
    }
  },
  {
    cat: 'panel', name: '09-attr-panel-2',
    input: '攻击力：120\n防御力：85\n移动速度：3.2\n暴击伤害：150%',
    expected: {
      blocks: [{ type: 'panel', fields: [
        { label: '攻击力', value: '120' }, { label: '防御力', value: '85' }, { label: '移动速度', value: '3.2' }, { label: '暴击伤害', value: '150%' }
      ] }]
    }
  },
  {
    cat: 'panel', name: '10-skill-fireball',
    input: '【火球术：Lv.5（主动）】\n凝聚火焰之力，对目标造成火焰伤害。\n冷却时间：10秒\n消耗法力：30',
    expected: {
      blocks: [{ type: 'panel', name: '火球术：Lv.5（主动）', fields: [
        { label: '冷却时间', value: '10秒' }, { label: '消耗法力', value: '30' }
      ] }]
    }
  },
  {
    cat: 'panel', name: '11-skill-ice',
    input: '【冰霜新星：Lv.3（控制）】\n冻结周围所有敌人，持续3秒。\n冷却时间：25秒',
    expected: {
      blocks: [{ type: 'panel', name: '冰霜新星：Lv.3（控制）', fields: [
        { label: '冷却时间', value: '25秒' }
      ] }]
    }
  },
  {
    cat: 'panel', name: '12-equip-desc-mixed',
    input: '【骑士头盔（橙色）】\n防御力：60\n一顶饱经战火的骑士头盔。\n耐久度：45/45\n不可交易',
    expected: {
      // 描述行夹在字段行之间（真实形态：标题后首行必须字段行）
      blocks: [{ type: 'panel', name: '骑士头盔', rarity: '橙色', rarityColor: '#E67E22', fields: [
        { label: '防御力', value: '60' }, { label: '耐久度', value: '45/45' }
      ] }]
    }
  },
  {
    cat: 'panel', name: '13-panel-end-next-block',
    input: '【兽皮靴（白色）】\n防御力：5\n移动速度：+1\n【狼牙项链（绿色）】\n攻击力：+6\n暴击率：2%',
    expected: {
      blocks: [
        { type: 'panel', name: '兽皮靴', rarity: '白色', rarityColor: '#C0C0C0', fields: [
          { label: '防御力', value: '5' }, { label: '移动速度', value: '+1' }
        ] },
        { type: 'panel', name: '狼牙项链', rarity: '绿色', rarityColor: '#2ECC71', fields: [
          { label: '攻击力', value: '+6' }, { label: '暴击率', value: '2%' }
        ] }
      ]
    }
  },
  {
    cat: 'panel', name: '14-attr-panel-3rows',
    input: '体力：80/80\n精力：60/60\n幸运：7',
    expected: {
      blocks: [{ type: 'panel', fields: [
        { label: '体力', value: '80/80' }, { label: '精力', value: '60/60' }, { label: '幸运', value: '7' }
      ] }]
    }
  },
  {
    cat: 'panel', name: '15-equip-epic-alias',
    input: '【星辉法杖（史诗）】\n法术强度：+80\n法力值：+300\n施法速度：+15%',
    expected: {
      blocks: [{ type: 'panel', name: '星辉法杖', rarity: '紫色', rarityColor: '#9B59B6', fields: [
        { label: '法术强度', value: '+80' }, { label: '法力值', value: '+300' }, { label: '施法速度', value: '+15%' }
      ] }]
    }
  },
  {
    cat: 'panel', name: '16-equip-fine-alias',
    input: '【铁质短刀（精良）】\n攻击力：12~18\n攻击速度：1.4\n售价：85金币',
    expected: {
      blocks: [{ type: 'panel', name: '铁质短刀', rarity: '绿色', rarityColor: '#2ECC71', fields: [
        { label: '攻击力', value: '12~18' }, { label: '攻击速度', value: '1.4' }, { label: '售价', value: '85金币' }
      ] }]
    }
  }
);

/* ---------------- panel 反例（6） ---------------- */

CASES.push(
  {
    cat: 'panel', name: 'neg-01-dialogue-bracket',
    input: '【王小明】\n“今天天气不错，我们去打猎吧。”',
    expected: { blocks: [] }
  },
  {
    cat: 'panel', name: 'neg-02-single-field',
    input: '【木棍】\n耐久度：5/5',
    expected: { blocks: [] }
  },
  {
    cat: 'panel', name: 'neg-03-battle-start',
    input: '【战斗开始！】\n双方陷入混战，喊杀声震天。',
    expected: { blocks: [] }
  },
  {
    cat: 'panel', name: 'neg-04-single-attr',
    input: '力量：12',
    expected: { blocks: [] }
  },
  {
    cat: 'panel', name: 'neg-05-dialogue-fields',
    input: '张三：你好，好久不见。\n李四：是啊，最近还好吗？',
    expected: { blocks: [] }
  },
  {
    cat: 'panel', name: 'neg-06-no-title-fields',
    input: '【这是章节标题】\n他推开酒馆的门，热闹的气息扑面而来。',
    expected: { blocks: [] }
  }
);

/* ---------------- prompt：系统提示单行框（正例 12） ---------------- */

CASES.push(
  {
    cat: 'prompt', name: '01-promote',
    input: '【提示：你已晋升至绝强者。】',
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '提示：你已晋升至绝强者。', fields: [], options: [] }] }
  },
  {
    cat: 'prompt', name: '02-level-cap',
    input: '【你的烙印等级上限提升至Lv.95。】',
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '你的烙印等级上限提升至Lv.95。', fields: [], options: [] }] }
  },
  {
    cat: 'prompt', name: '03-warning',
    input: '【警告：前方区域危险，请谨慎前进。】',
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '警告：前方区域危险，请谨慎前进。', fields: [], options: [] }] }
  },
  {
    cat: 'prompt', name: '04-announce',
    input: '【公告：服务器将于23:00进行例行维护。】',
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '公告：服务器将于23:00进行例行维护。', fields: [], options: [] }] }
  },
  {
    cat: 'prompt', name: '05-unlock-skill',
    input: '【你已解锁新技能：影袭。】',
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '你已解锁新技能：影袭。', fields: [], options: [] }] }
  },
  {
    cat: 'prompt', name: '06-gain-title',
    input: '【获得称号：屠龙者。】',
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '获得称号：屠龙者。', fields: [], options: [] }] }
  },
  {
    cat: 'prompt', name: '07-quest-progress',
    input: '【任务进度更新：击杀野狼 3/10。】',
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '任务进度更新：击杀野狼 3/10。', fields: [], options: [] }] }
  },
  {
    cat: 'prompt', name: '08-sys-notice',
    input: '【系统提示：背包空间不足，请及时清理。】',
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '系统提示：背包空间不足，请及时清理。', fields: [], options: [] }] }
  },
  {
    cat: 'prompt', name: '09-skill-learned',
    input: '【你学会了新技能：冲锋。】',
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '你学会了新技能：冲锋。', fields: [], options: [] }] }
  },
  {
    cat: 'prompt', name: '10-level-up',
    input: '【等级提升！当前等级：Lv.32】',
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '等级提升！当前等级：Lv.32', fields: [], options: [] }] }
  },
  {
    cat: 'prompt', name: '11-two-lines-one-by-one',
    input: '【提示：你已晋升至绝强者。】\n【你的烙印等级上限提升至Lv.95。】',
    expected: {
      blocks: [
        { type: 'system', subType: 'prompt', title: '提示：你已晋升至绝强者。', fields: [], options: [] },
        { type: 'system', subType: 'prompt', title: '你的烙印等级上限提升至Lv.95。', fields: [], options: [] }
      ]
    }
  },
  {
    cat: 'prompt', name: '12-exp-gain',
    input: '【获得经验+500，金币+100。】',
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '获得经验+500，金币+100。', fields: [], options: [] }] }
  },
  {
    cat: 'prompt', name: '13-recovery',
    input: '【你的伤势已恢复，生命值回满。】',
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '你的伤势已恢复，生命值回满。', fields: [], options: [] }] }
  },
  {
    cat: 'prompt', name: '14-cooldown',
    input: '【技能冷却完毕：冲锋。】',
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '技能冷却完毕：冲锋。', fields: [], options: [] }] }
  }
);

/* ---------------- prompt 反例（4） ---------------- */

CASES.push(
  {
    cat: 'prompt', name: 'neg-01-too-long',
    input: '【这是一段非常长的普通说明文字，讲述了村庄里流传已久的古老传说与禁忌，足足超过六十个字符的限制条件，因此不应被识别为系统提示。】',
    expected: { blocks: [] }
  },
  {
    cat: 'prompt', name: 'neg-02-name',
    input: '【王小明】',
    expected: { blocks: [] }
  },
  {
    cat: 'prompt', name: 'neg-03-ding',
    input: '【叮！】',
    expected: { blocks: [] }
  },
  {
    cat: 'prompt', name: 'neg-04-emphasis',
    input: '【十分重要】',
    expected: { blocks: [] }
  }
);

/* ---------------- system-block：任务/奖励/确认大框（正例 14） ---------------- */

CASES.push(
  {
    cat: 'system-block', name: '01-quest-treasure',
    input: '【支线任务：宝藏。】\n难度等级：Lv.？？？\n目标：击败守宝者\n奖励：金币×500',
    expected: {
      blocks: [{ type: 'system', subType: 'quest', title: '支线任务：宝藏。', fields: [
        { label: '难度等级', value: 'Lv.？？？' }, { label: '目标', value: '击败守宝者' }, { label: '奖励', value: '金币×500' }
      ], options: [] }]
    }
  },
  {
    cat: 'system-block', name: '02-quest-main',
    input: '【主线任务：讨伐魔王。】\n目标：击败魔王\n难度：SSS\n奖励：金币×10000',
    expected: {
      blocks: [{ type: 'system', subType: 'quest', title: '主线任务：讨伐魔王。', fields: [
        { label: '目标', value: '击败魔王' }, { label: '难度', value: 'SSS' }, { label: '奖励', value: '金币×10000' }
      ], options: [] }]
    }
  },
  {
    cat: 'system-block', name: '03-quest-daily',
    input: '【每日任务：采集草药。】\n进度：0/5\n奖励：经验×200',
    expected: {
      blocks: [{ type: 'system', subType: 'quest', title: '每日任务：采集草药。', fields: [
        { label: '进度', value: '0/5' }, { label: '奖励', value: '经验×200' }
      ], options: [] }]
    }
  },
  {
    cat: 'system-block', name: '04-quest-hidden',
    input: '【隐藏任务：寻找失落遗迹。】\n地点：迷雾森林\n提示：小心机关陷阱',
    expected: {
      blocks: [{ type: 'system', subType: 'quest', title: '隐藏任务：寻找失落遗迹。', fields: [
        { label: '地点', value: '迷雾森林' }, { label: '提示', value: '小心机关陷阱' }
      ], options: [] }]
    }
  },
  {
    cat: 'system-block', name: '05-quest-escort',
    input: '【支线任务：护送商队。】\n难度等级：C\n目标：安全抵达绿洲\n失败条件：商队被摧毁',
    expected: {
      blocks: [{ type: 'system', subType: 'quest', title: '支线任务：护送商队。', fields: [
        { label: '难度等级', value: 'C' }, { label: '目标', value: '安全抵达绿洲' }, { label: '失败条件', value: '商队被摧毁' }
      ], options: [] }]
    }
  },
  {
    cat: 'system-block', name: '06-quest-with-narration',
    input: '【支线任务：深入矿洞。】\n难度等级：B\n他大步走向洞穴入口，握紧了火把。',
    expected: {
      blocks: [{ type: 'system', subType: 'quest', title: '支线任务：深入矿洞。', fields: [
        { label: '难度等级', value: 'B' }
      ], options: [] }]
    }
  },
  {
    cat: 'system-block', name: '07-choice-rewards',
    input: '【你可在以下奖励中做出选择】\nA. 精铁长剑（绿色）\nB. 秘银护腕（蓝色）\nC. 金币×500',
    expected: {
      blocks: [{ type: 'system', subType: 'choice', title: '你可在以下奖励中做出选择', fields: [], options: [
        'A. 精铁长剑（绿色）', 'B. 秘银护腕（蓝色）', 'C. 金币×500'
      ] }]
    }
  },
  {
    cat: 'system-block', name: '08-choice-dunhao',
    input: '【请在以下选项中选择一项】\nA、勇者之剑\nB、贤者之杖\nC、王者之盾',
    expected: {
      blocks: [{ type: 'system', subType: 'choice', title: '请在以下选项中选择一项', fields: [], options: [
        'A、勇者之剑', 'B、贤者之杖', 'C、王者之盾'
      ] }]
    }
  },
  {
    cat: 'system-block', name: '09-choice-number',
    input: '【检测到敌人，请选择应对方式】\n1. 正面迎击\n2. 迂回包抄\n3. 撤退',
    expected: {
      blocks: [{ type: 'system', subType: 'choice', title: '检测到敌人，请选择应对方式', fields: [], options: [
        '1. 正面迎击', '2. 迂回包抄', '3. 撤退'
      ] }]
    }
  },
  {
    cat: 'system-block', name: '10-confirm-seal',
    input: '【是否启动「超·界级封禁术式」。】\n此术式将封印整个副本区域，持续30分钟。\n是/否',
    expected: {
      // 说明行不吞并（防叙述污染），单行确认降级为提示框
      blocks: [{ type: 'system', subType: 'prompt', title: '是否启动「超·界级封禁术式」。', fields: [], options: [] }]
    }
  },
  {
    cat: 'system-block', name: '11-confirm-revive',
    input: '【确认消耗1000金币复活？】\n复活后将在安全区重生。\n是/否',
    expected: {
      blocks: [{ type: 'system', subType: 'prompt', title: '确认消耗1000金币复活？', fields: [], options: [] }]
    }
  },
  {
    cat: 'system-block', name: '12-confirm-potion',
    input: '【激活「龙血药剂」？】\n饮用后生命值上限永久+500。\n是/否',
    expected: {
      blocks: [{ type: 'system', subType: 'prompt', title: '激活「龙血药剂」？', fields: [], options: [] }]
    }
  },
  {
    cat: 'system-block', name: '13-confirm-with-fields',
    input: '【是/否接受任务「猎杀狼王」？】\n任务等级：B\n奖励：狼王皮×1\n是/否',
    expected: {
      blocks: [{ type: 'system', subType: 'confirm', title: '是/否接受任务「猎杀狼王」？', fields: [
        { label: '任务等级', value: 'B' }, { label: '奖励', value: '狼王皮×1' }
      ], options: ['是/否'] }]
    }
  },
  {
    cat: 'system-block', name: '14-quest-choose-reward',
    input: '【任务完成！请选择奖励】\nA. 经验+500\nB. 金币×1000',
    expected: {
      blocks: [{ type: 'system', subType: 'choice', title: '任务完成！请选择奖励', fields: [], options: [
        'A. 经验+500', 'B. 金币×1000'
      ] }]
    }
  },
  {
    cat: 'system-block', name: '15-quest-name-end',
    input: '【猎杀狼王任务】\n目标：击败狼王\n奖励：狼王皮×1',
    expected: {
      blocks: [{ type: 'system', subType: 'quest', title: '猎杀狼王任务', fields: [
        { label: '目标', value: '击败狼王' }, { label: '奖励', value: '狼王皮×1' }
      ], options: [] }]
    }
  },
  {
    cat: 'system-block', name: '16-choice-three',
    input: '【请在以下奖励中选择一项】\nA. 洞察之眼（紫色）\nB. 疾风之靴（蓝色）\nC. 属性点×3',
    expected: {
      blocks: [{ type: 'system', subType: 'choice', title: '请在以下奖励中选择一项', fields: [], options: [
        'A. 洞察之眼（紫色）', 'B. 疾风之靴（蓝色）', 'C. 属性点×3'
      ] }]
    }
  }
);

/* ---------------- system-block 反例（6） ---------------- */

CASES.push(
  {
    cat: 'system-block', name: 'neg-01-choice-one-option',
    input: '【请选择一项】\nA. 只有这一个选项',
    expected: { blocks: [] }
  },
  {
    cat: 'system-block', name: 'neg-02-quest-empty',
    input: '【支线任务：宝藏。】',
    // 单行任务发布：无后续字段时降级为提示框
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '支线任务：宝藏。', fields: [], options: [] }] }
  },
  {
    cat: 'system-block', name: 'neg-03-confirm-empty',
    input: '【确认删除存档？】',
    // 单行确认：无后续行时降级为提示框
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '确认删除存档？', fields: [], options: [] }] }
  },
  {
    cat: 'system-block', name: 'neg-04-quote',
    input: '【他说：今天天气不错。】',
    expected: { blocks: [] }
  },
  {
    cat: 'system-block', name: 'neg-05-shop-list',
    input: '【以下是商店物品清单】\nA. 红药水（商店常驻）\nB. 蓝药水（商店常驻）',
    expected: { blocks: [] }
  },
  {
    cat: 'system-block', name: 'neg-06-enemy-appear',
    input: '【野狼出现了！】\n野狼发出低沉的咆哮，缓缓逼近。',
    expected: { blocks: [] }
  }
);

/* ---------------- value：数值增减（正例 13） ---------------- */

CASES.push(
  {
    cat: 'value', name: '01-str-plus',
    input: '力量+5',
    expected: { blocks: [{ type: 'value', changes: [{ attr: '力量', sign: '+', raw: '+5' }] }] }
  },
  {
    cat: 'value', name: '02-hp-minus',
    input: 'HP-100',
    expected: { blocks: [{ type: 'value', changes: [{ attr: 'HP', sign: '-', raw: '-100' }] }] }
  },
  {
    cat: 'value', name: '03-exp-plus',
    input: '获得经验值+200',
    expected: { blocks: [{ type: 'value', changes: [{ attr: '获得经验值', sign: '+', raw: '+200' }] }] }
  },
  {
    cat: 'value', name: '04-mana-cost',
    input: '消耗魔力-30',
    expected: { blocks: [{ type: 'value', changes: [{ attr: '消耗魔力', sign: '-', raw: '-30' }] }] }
  },
  {
    cat: 'value', name: '05-agi-decimal',
    input: '敏捷+3.5',
    expected: { blocks: [{ type: 'value', changes: [{ attr: '敏捷', sign: '+', raw: '+3.5' }] }] }
  },
  {
    cat: 'value', name: '06-multi-changes',
    input: '生命值+50，法力值-20',
    expected: {
      blocks: [{ type: 'value', changes: [
        { attr: '生命值', sign: '+', raw: '+50' }, { attr: '法力值', sign: '-', raw: '-20' }
      ] }]
    }
  },
  {
    cat: 'value', name: '07-in-narration',
    input: '你获得了 力量+5 的加成，同时消耗了 HP-30。',
    expected: {
      blocks: [{ type: 'value', changes: [
        { attr: '力量', sign: '+', raw: '+5' }, { attr: 'HP', sign: '-', raw: '-30' }
      ] }]
    }
  },
  {
    cat: 'value', name: '08-percent',
    input: '经验+200%',
    expected: { blocks: [{ type: 'value', changes: [{ attr: '经验', sign: '+', raw: '+200' }] }] }
  },
  {
    cat: 'value', name: '09-level-and-power',
    input: '等级+1，战力+50',
    expected: {
      blocks: [{ type: 'value', changes: [
        { attr: '等级', sign: '+', raw: '+1' }, { attr: '战力', sign: '+', raw: '+50' }
      ] }]
    }
  },
  {
    cat: 'value', name: '10-exp-abbr',
    input: 'EXP+100 获得',
    expected: { blocks: [{ type: 'value', changes: [{ attr: 'EXP', sign: '+', raw: '+100' }] }] }
  },
  {
    cat: 'value', name: '11-attr-plus-attr',
    input: '你的攻击力增加了+10 点。',
    expected: { blocks: [{ type: 'value', changes: [{ attr: '攻击力', sign: '+', raw: '+10' }] }] }
  },
  {
    cat: 'value', name: '12-in-panel-field',
    input: '【圣光护盾（绿色）】\n护盾值：+500 生命\n持续时间：10秒',
    expected: {
      blocks: [{ type: 'panel', name: '圣光护盾', rarity: '绿色', rarityColor: '#2ECC71', fields: [
        { label: '护盾值', value: '+500 生命' }, { label: '持续时间', value: '10秒' }
      ] }]
    }
  },
  {
    cat: 'value', name: '13-quoted-value',
    input: '他说："力量+5"这话说完后转身离去。',
    expected: { blocks: [{ type: 'value', changes: [{ attr: '力量', sign: '+', raw: '+5' }] }] }
  },
  {
    cat: 'value', name: '14-mp-restore',
    input: '恢复法力+40',
    expected: { blocks: [{ type: 'value', changes: [{ attr: '恢复法力', sign: '+', raw: '+40' }] }] }
  }
);

/* ---------------- value 反例（10） ---------------- */

CASES.push(
  {
    cat: 'value', name: 'neg-01-ta-shuo',
    input: '他说+5 很开心。',
    expected: { blocks: [] }
  },
  {
    cat: 'value', name: 'neg-02-math',
    input: '3+5=8 是简单的数学题。',
    expected: { blocks: [] }
  },
  {
    cat: 'value', name: 'neg-03-algebra',
    input: 'a+b=c 这样的等式很常见。',
    expected: { blocks: [] }
  },
  {
    cat: 'value', name: 'neg-04-version',
    input: '版本号 v2.0+1 补丁已发布。',
    expected: { blocks: [] }
  },
  {
    cat: 'value', name: 'neg-05-chapter',
    input: '第1+2章 更新了。',
    expected: { blocks: [] }
  },
  {
    cat: 'value', name: 'neg-06-math2',
    input: '1+1=2，2+2=4。',
    expected: { blocks: [] }
  },
  {
    cat: 'value', name: 'neg-07-number-bomb',
    input: '价格+1+2+3+4+5+6+7 一路狂飙。',
    expected: { blocks: [] }
  },
  {
    cat: 'value', name: 'neg-08-swing-sword',
    input: '他挥剑+5 米才堪堪避开攻击。',
    expected: { blocks: [] }
  },
  {
    cat: 'value', name: 'neg-09-gain-alone',
    input: '获得+200 这样的表述不完整。',
    expected: { blocks: [] }
  },
  {
    cat: 'value', name: 'neg-10-url',
    input: '详情请访问 https://example.com/page+1 查看。',
    expected: { blocks: [] }
  }
);

/* ---------------- negative：通用反例（10） ---------------- */

CASES.push(
  {
    cat: 'negative', name: '01-plain-paragraph',
    input: '林风握紧手中的长剑，目光坚定地望向远处的山巅。风呼啸着掠过耳畔，他深吸一口气，迈出了第一步。',
    expected: { blocks: [] }
  },
  {
    cat: 'negative', name: '02-dialogue',
    input: '“你真的要去吗？”苏婉轻声问道。\n“非去不可。”林风的声音很平静。',
    expected: { blocks: [] }
  },
  {
    cat: 'negative', name: '03-messy-layout',
    input: '这是　一段　排版　混乱　　的　文字 　夹杂着　奇怪　空格　和 换行',
    expected: { blocks: [] }
  },
  {
    cat: 'negative', name: '04-poem',
    input: '大漠孤烟直，\n长河落日圆。\n萧关逢候骑，\n都护在燕然。',
    expected: { blocks: [] }
  },
  {
    cat: 'negative', name: '05-html-literal',
    input: '作者备注：<font color="red">这里不是标签</font>，只是文字。',
    expected: { blocks: [] }
  },
  {
    cat: 'negative', name: '06-english',
    input: 'The quick brown fox jumps over the lazy dog. Numbers: 123 + 456 = 579.',
    expected: { blocks: [] }
  },
  {
    cat: 'negative', name: '07-schedule',
    input: '今日行程：9:00-10:00 开会，14:00-15:00 训练，19:00-20:00 自由活动。',
    expected: { blocks: [] }
  },
  {
    cat: 'negative', name: '08-symbols',
    input: '※※※ 华丽的分割线 ※※※',
    expected: { blocks: [] }
  },
  {
    cat: 'negative', name: '09-long-bracket',
    input: '【本章内容较为复杂，包含大量背景设定与人物关系梳理，以及世界观补充说明，故篇幅较长。】',
    // 作者注式【】说明句：形态与系统提示一致，按提示框处理（可接受）
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '本章内容较为复杂，包含大量背景设定与人物关系梳理，以及世界观补充说明，故篇幅较长。', fields: [], options: [] }] }
  },
  {
    cat: 'negative', name: '10-tel-number',
    input: '联系方式：138-0000-0000，请加好友联系。',
    expected: { blocks: [] }
  }
);

/* ---------------- mixed：混合章节（4 章，含多个块与原文完整性） ---------------- */

CASES.push(
  {
    cat: 'mixed', name: '01-chapter-battle',
    input: '战斗结束了。\n【提示：你已晋升至绝强者。】\n【破旧的燧发枪（白色）】\n产地：海贼王，利奥波特作坊\n耐久度：6/30\n攻击力：2~13（根据距离计算）\n他收起武器，感觉浑身充满了力量。',
    expected: {
      blocks: [
        { type: 'system', subType: 'prompt', title: '提示：你已晋升至绝强者。', fields: [], options: [] },
        { type: 'panel', name: '破旧的燧发枪', rarity: '白色', rarityColor: '#C0C0C0', fields: [
          { label: '产地', value: '海贼王，利奥波特作坊' }, { label: '耐久度', value: '6/30' }, { label: '攻击力', value: '2~13（根据距离计算）' }
        ] }
      ]
    }
  },
  {
    cat: 'mixed', name: '02-adjacent-panels',
    input: '系统将他掉落的两件装备展示出来。\n【兽皮靴（白色）】\n防御力：5\n移动速度：+1\n【狼牙项链（绿色）】\n攻击力：+6\n暴击率：2%',
    expected: {
      blocks: [
        { type: 'panel', name: '兽皮靴', rarity: '白色', rarityColor: '#C0C0C0', fields: [
          { label: '防御力', value: '5' }, { label: '移动速度', value: '+1' }
        ] },
        { type: 'panel', name: '狼牙项链', rarity: '绿色', rarityColor: '#2ECC71', fields: [
          { label: '攻击力', value: '+6' }, { label: '暴击率', value: '2%' }
        ] }
      ]
    }
  },
  {
    cat: 'mixed', name: '03-panel-quest-value',
    input: '【支线任务：宝藏。】\n难度等级：Lv.？？？\n目标：击败守宝者\n他击杀了守宝者，力量+5，经验+200。\n【你可在以下奖励中做出选择】\nA. 精铁长剑（绿色）\nB. 金币×500',
    expected: {
      blocks: [
        { type: 'system', subType: 'quest', title: '支线任务：宝藏。', fields: [
          { label: '难度等级', value: 'Lv.？？？' }, { label: '目标', value: '击败守宝者' }
        ], options: [] },
        { type: 'value', changes: [
          { attr: '力量', sign: '+', raw: '+5' }, { attr: '经验', sign: '+', raw: '+200' }
        ] },
        { type: 'system', subType: 'choice', title: '你可在以下奖励中做出选择', fields: [], options: [
          'A. 精铁长剑（绿色）', 'B. 金币×500'
        ] }
      ]
    }
  },
  {
    cat: 'mixed', name: '04-no-enhancement',
    input: '清晨的阳光洒进窗台。\n他伸了个懒腰，想起昨晚的梦。\n梦里有一只巨大的鲸鱼，在云海中遨游。\n“真是个奇怪的梦。”他自言自语道。',
    expected: { blocks: [] }
  }
);

/* ---------------- novel：真实语料样例（《轮回乐园》摘录，v0.1.1 调优后） ---------------- */

CASES.push(
  {
    cat: 'novel', name: '01-panel-quality-rarity',
    input: '【战术皮靴】\n产地：轮回乐园，第五车间\n品质：紫色\n类别：鞋子（黑色）\n耐久度：59～59\n装备需求：力量15，敏捷17，体质5',
    expected: {
      // 稀有度从"品质"字段提取（名称无（品质）后缀）
      blocks: [{ type: 'panel', name: '战术皮靴', rarity: '紫色', rarityColor: '#9B59B6', fields: [
        { label: '产地', value: '轮回乐园，第五车间' }, { label: '品质', value: '紫色' }, { label: '类别', value: '鞋子（黑色）' }, { label: '耐久度', value: '59～59' }, { label: '装备需求', value: '力量15，敏捷17，体质5' }
      ] }]
    }
  },
  {
    cat: 'novel', name: '02-panel-welcome',
    input: '【欢迎使用属性强化仓，你的裸装属性如下。】\n力量：29\n敏捷：28\n体力：18\n智力：28\n魅力：3',
    expected: {
      blocks: [{ type: 'panel', name: '欢迎使用属性强化仓，你的裸装属性如下。', fields: [
        { label: '力量', value: '29' }, { label: '敏捷', value: '28' }, { label: '体力', value: '18' }, { label: '智力', value: '28' }, { label: '魅力', value: '3' }
      ] }]
    }
  },
  {
    cat: 'novel', name: '03-prompt-fallback',
    input: '【时间到，巨人开始进攻。】',
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '时间到，巨人开始进攻。', fields: [], options: [] }] }
  },
  {
    cat: 'novel', name: '04-prompt-fallback-num',
    input: '【蓝色宝箱×42。】',
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '蓝色宝箱×42。', fields: [], options: [] }] }
  },
  {
    cat: 'novel', name: '05-prompt-transfer',
    input: '【身体传输中……】',
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '身体传输中……', fields: [], options: [] }] }
  },
  {
    cat: 'novel', name: '06-skill-lowercase',
    input: '【刀术大师：lv.10.（被动）】\n刀类武器伤害+15%，攻击速度+8%。',
    expected: {
      blocks: [{ type: 'panel', name: '刀术大师：lv.10.（被动）', fields: [] }]
    }
  },
  {
    cat: 'novel', name: '07-confirm-single',
    input: '【是/否支付1000乐园币激活0182号强化仓。】\n苏晓站在一间真实属性强化仓前，支付1000乐园币后，属性强化仓开启。',
    expected: {
      // 单行确认降级为提示框；叙述行留在框外
      blocks: [{ type: 'system', subType: 'prompt', title: '是/否支付1000乐园币激活0182号强化仓。', fields: [], options: [] }]
    }
  },
  {
    cat: 'novel', name: '08-half-colon-fields',
    input: '力量:D(最高A)。\n敏捷:(最高A)。\n体力:D(最高A)。',
    expected: {
      // 半角冒号分隔符：解析为属性面板，渲染时保留半角冒号（原文不丢）
      blocks: [{ type: 'panel', fields: [
        { label: '力量', value: 'D(最高A)。' }, { label: '敏捷', value: '(最高A)。' }, { label: '体力', value: 'D(最高A)。' }
      ] }]
    }
  },
  {
    cat: 'novel', name: '09-prompt-ranking',
    input: '【第一名：白夜，攻防贡献值1650.】',
    expected: { blocks: [{ type: 'system', subType: 'prompt', title: '第一名：白夜，攻防贡献值1650.', fields: [], options: [] }] }
  },
  {
    cat: 'novel', name: '10-attr-panel-real',
    input: '智力：80（真实属性·主属性）\n魅力：8\n幸运：3\n杀戮天赋：噬灵者（S）',
    expected: {
      blocks: [{ type: 'panel', fields: [
        { label: '智力', value: '80（真实属性·主属性）' }, { label: '魅力', value: '8' }, { label: '幸运', value: '3' }, { label: '杀戮天赋', value: '噬灵者（S）' }
      ] }]
    }
  },
  {
    cat: 'novel', name: '11-get-equip-name-line',
    input: '【获得，破旧的燧发枪（白色）】\n破旧的燧发枪（白色）\n产地：海贼王，利奥波特作坊\n耐久度：6/30\n攻击力：2~13（根据距离计算）',
    expected: {
      // 获得提示 + 独立名称行 + 字段（《轮回乐园》装备标准形态）
      blocks: [
        { type: 'system', subType: 'prompt', title: '获得，破旧的燧发枪（白色）', fields: [], options: [] },
        { type: 'panel', name: '破旧的燧发枪', rarity: '白色', rarityColor: '#C0C0C0', fields: [
          { label: '产地', value: '海贼王，利奥波特作坊' }, { label: '耐久度', value: '6/30' }, { label: '攻击力', value: '2~13（根据距离计算）' }
        ] }
      ]
    }
  },
  {
    cat: 'novel', name: '12-get-equip-mixed-rarity',
    input: '【获得斩龙闪】\n斩龙闪（白色?稀有）\n产地：海贼王，钢铁熔炉铁匠铺\n耐久度：35/40-5（此武器曾受到严重破损，耐久度-5。）',
    expected: {
      // "白色?稀有" 拆段取第一档
      blocks: [
        { type: 'system', subType: 'prompt', title: '获得斩龙闪', fields: [], options: [] },
        { type: 'panel', name: '斩龙闪', rarity: '白色', rarityColor: '#C0C0C0', fields: [
          { label: '产地', value: '海贼王，钢铁熔炉铁匠铺' }, { label: '耐久度', value: '35/40-5（此武器曾受到严重破损，耐久度-5。）' }
        ] }
      ]
    }
  },
  {
    cat: 'novel', name: '13-special-quest',
    input: '【特殊任务：抉择】\n难度等级：？？？\n任务简介：将【世界树指环】交与轮回乐园。\n任务信息：无',
    expected: {
      blocks: [{ type: 'system', subType: 'quest', title: '特殊任务：抉择', fields: [
        { label: '难度等级', value: '？？？' }, { label: '任务简介', value: '将【世界树指环】交与轮回乐园。' }, { label: '任务信息', value: '无' }
      ], options: [] }]
    }
  },
  {
    cat: 'novel', name: '14-trigger-quest',
    input: '【触发支线任务：左大臣的藏品】\n左大臣的藏品\n难度等级：lv.2。\n任务简介：左大臣的藏品非常丰富，一切有价值的藏品，都会被这贪婪的老家伙看中。',
    expected: {
      blocks: [{ type: 'system', subType: 'quest', title: '触发支线任务：左大臣的藏品', fields: [
        { label: '难度等级', value: 'lv.2。' }, { label: '任务简介', value: '左大臣的藏品非常丰富，一切有价值的藏品，都会被这贪婪的老家伙看中。' }
      ], options: [] }]
    }
  }
);

/* ==================================================================== *
 * 生成
 * ==================================================================== */

function writeCase(c) {
  const dir = path.join(FIXTURES, c.cat, c.name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'input.txt'), c.input, 'utf8');
  fs.writeFileSync(path.join(dir, 'expected.json'), JSON.stringify(c.expected, null, 2) + '\n', 'utf8');
}

// 清理旧 fixtures 重新生成
fs.rmSync(FIXTURES, { recursive: true, force: true });
fs.mkdirSync(FIXTURES, { recursive: true });
const seen = new Set();
for (const c of CASES) {
  const key = c.cat + '/' + c.name;
  if (seen.has(key)) { throw new Error('重复样例: ' + key); }
  seen.add(key);
  writeCase(c);
}
console.log('生成完成：' + CASES.length + ' 个样例');
