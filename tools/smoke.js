// 快速冒烟（临时）：核心解析与渲染正确性 + 原文完整性
const path = require('path');
const ROOT = path.join(__dirname, '..');
const CORE = require(path.join(ROOT, 'plugin/src/el-core.js'));
const RENDER = require(path.join(ROOT, 'plugin/src/el-render.js'));

const samples = [
  '【破旧的燧发枪（白色）】\n产地：海贼王，利奥波特作坊\n耐久度：6/30\n攻击力：2~13（根据距离计算）',
  '【提示：你已晋升至绝强者。】',
  '【支线任务：宝藏。】\n难度等级：Lv.？？？\n目标：击败守宝者',
  '力量+5',
  '他说："力量+5"这话说完后转身离去。',
  '【火球术：Lv.5（主动）】\n凝聚火焰，对目标造成火焰伤害。\n冷却时间：10秒',
  '生命值：100/100\n法力值：50/50\n力量：12',
  '林风抬头看向远方，天边的云层翻涌着。',
  '【叮！恭喜获得：经验值+200】',
  '【系统公告】服务器将于今晚维护。',
  '你获得了 力量+5 的加成，同时消耗了 HP-30。',
  '【是否启动「超·界级封禁术式」。】\n此术式将封印整个副本区域，持续30分钟。\n是/否',
  '【你可在以下奖励中做出选择】\nA. 精铁长剑（绿色）\nB. 秘银护腕（蓝色）\nC. 金币×500'
];

function strip(html) {
  return html
    .replace(/<usehtml>/g, '')
    .replace(/<$/, '')
    .replace(/<br>/g, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

let pass = 0, fail = 0;
for (const s of samples) {
  let r;
  try { r = RENDER.renderChapter(s); } catch (e) { r = 'EXCEPTION:' + e.message; }
  const ok = strip(r) === s;
  if (ok) { pass++; } else {
    fail++;
    console.log('FAIL:', JSON.stringify(s.slice(0, 24)));
    console.log('  in :', JSON.stringify(s));
    console.log('  out:', JSON.stringify(r));
    console.log('  strip:', JSON.stringify(strip(r)));
  }
}
// 块解析诊断
console.log('--- blocks of sample 1 ---');
console.log(JSON.stringify(CORE.parseChapter(samples[0]).blocks, null, 1));
console.log('--- blocks of sample 7 ---');
console.log(JSON.stringify(CORE.parseChapter(samples[6]).blocks, null, 1));
console.log('--- blocks of sample 13 ---');
console.log(JSON.stringify(CORE.parseChapter(samples[12]).blocks, null, 1));
console.log('--- blocks of sample 11 (value line) ---');
console.log(JSON.stringify(CORE.parseChapter(samples[10]).blocks, null, 1));
console.log('PASS=' + pass + ' FAIL=' + fail);
