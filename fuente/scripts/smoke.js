// Smoke test injected after the app script in a local wrapper page (headless Chrome)
window.__log = [];
window.addEventListener('error', e => __log.push('ERR ' + e.message + ' @' + e.lineno));
const sleep = ms => new Promise(r => setTimeout(r, ms));
function click(sel) { const el = document.querySelector(sel); if (!el) throw new Error('missing ' + sel + ' in view ' + cur().v); el.click(); }
async function step(name, fn) { try { await fn(); __log.push('ok   ' + name); } catch (e) { __log.push('FAIL ' + name + ': ' + (e && e.message)); } }
function expect(c, msg) { if (!c) throw new Error(msg); }
async function playPairs() {
  for (let guard = 0; guard < 10 && !S.end; guard++) {
    const set = S.sets[S.si];
    for (const x of S.left.slice()) {
      const j = S.right.findIndex((r, k) => !S.doneR[k] && r.t === set.items[x.i][1]);
      ACT.pairL({ k: String(x.i) }); ACT.pairR({ k: String(j) });
    }
    await sleep(900);
  }
}
async function run() {
  await step('home renders', () => expect(document.querySelectorAll('.wp').length === 19, 'route != 19'));
  await step('open topic 1', () => click('.wp[data-t="1"]'));
  await step('lesson', () => { click('.stage[data-v="lesson"]'); for (let i = 0; i < 60 && !S.end; i++) ACT.lessonNext(); expect(S.end, 'lesson not ended'); expect(tpr(1).lesson === 1, 'lesson flag'); });
  await step('tf', () => {
    click('[data-act="stage"][data-v="tf"]');
    const first = S.items[S.i]; tfAnswer(!first.a); expect(S.lives === 2, 'life not lost'); ACT.tfNext();
    for (let k = 0; k < 30 && !S.end; k++) { tfAnswer(S.items[S.i].a); ACT.tfNext(); }
    expect(S.end && tpr(1).tf >= 60, 'tf not passed ' + tpr(1).tf);
  });
  await step('pairs wrong then all', async () => {
    click('[data-act="stage"][data-v="pairs"]');
    const set = S.sets[S.si];
    const x = S.left[0]; const wrong = S.right.findIndex(r => r.t !== set.items[x.i][1]);
    ACT.pairL({ k: String(x.i) }); ACT.pairR({ k: String(wrong) });
    expect(S.totalMiss === 1 && document.querySelectorAll('.tile.no').length === 2, 'flash');
    await playPairs();
    expect(S.end && tpr(1).pairs === 1, 'pairs not done');
  });
  await step('cloze', () => {
    click('[data-act="stage"][data-v="cloze"]');
    for (let k = 0; k < 20 && !S.end; k++) { ACT.clozeAns({ j: String(S.items[S.i].ans) }); expect(document.querySelector('.blank.ok'), 'blank'); ACT.clozeNext(); }
    expect(tpr(1).cloze === 100, 'cloze ' + tpr(1).cloze);
  });
  await step('topic exam', () => {
    click('[data-act="stage"][data-v="exam"]');
    const n = S.items.length;
    expect(S.items.some(it => it.q.src === 'oficial'), 'no official');
    for (let k = 0; k < n; k++) { const it = S.items[S.i]; ACT.qAns({ j: String(k === 0 ? (it.ans + 1) % 4 : it.ans) }); ACT.qNext(); }
    expect(S.end && tpr(1).exam === Math.round(100 * (n - 1) / n), 'exam score ' + tpr(1).exam);
    expect(document.querySelectorAll('.result').length === 1, 'result');
  });
  await step('jump to topic 2', () => { click('[data-act="topicJump"]'); expect(cur().v === 'topic' && cur().p.t === 2 && NAV.stack.length === 2, 'stack ' + JSON.stringify(NAV.stack)); });
  await step('every topic and stage renders', () => {
    for (const t of TOPICS) for (const v of ['topic', 'lesson', 'tf', 'pairs', 'cloze', 'exam']) {
      swap(v, { t: t.id });
      expect(document.getElementById('view').innerHTML.length > 200, `${v} ${t.id} empty`);
      if (v === 'lesson') { ACT.lessonList(); expect(document.querySelectorAll('.lcard').length === t.cards.length, 'list ' + t.id); }
    }
    tab('home');
  });
  await step('random sim', () => {
    tab('simMenu'); click('.panel [data-v="sim"]');
    expect(S.items.length === 30, 'sim len ' + S.items.length);
    const per = {}; S.items.forEach(it => { per[it.q.t] = (per[it.q.t] || 0) + 1; });
    TOPICS.forEach(t => expect(per[t.id] === t.weight, 'weight t' + t.id));
    ACT.simStart(); expect(document.getElementById('clock'), 'clock');
    S.items.forEach((it, k) => { S.i = k; ACT.simPick({ j: String(k < 25 ? it.ans : (it.ans + 1) % 4) }); });
    simSubmit(false);
    expect(S.res.ok === 25 && P.sims.length === 1 && trips() === 1, 'sim result ' + S.res.ok);
    expect(document.querySelectorAll('.qgrid button.ok').length === 25, 'grid');
    ACT.simSee({ k: '27' }); expect(S.ri === 27, 'see');
  });
  await step('real exam replica keeps order', () => {
    tab('simMenu'); click('[data-v="sim"][data-c="2026abr"]');
    expect(S.items[0].q.id === '2026abr-1-01' && S.items.every(it => it.order.join() === '0,1,2,3'), 'order');
    ACT.simStart(); simSubmit(false);
    expect(S.res.ok === 0, 'blank exam');
  });
  await step('leave guard', () => {
    tab('simMenu'); click('.panel [data-v="sim"]'); ACT.simStart();
    tab('home'); expect(document.querySelector('.modal'), 'no modal'); expect(cur().v === 'sim', 'left without confirm');
    document.querySelector('.modal [data-m="1"]').click(); expect(cur().v === 'home', 'did not leave');
  });
  await step('review due', () => {
    tab('review'); const due = dueIds().length; expect(due > 0, 'nothing due');
    click('[data-v="reviewRun"][data-k="due"]');
    for (let k = 0; k < 25 && !S.end; k++) { ACT.qAns({ j: String(S.items[S.i].ans) }); ACT.qNext(); }
    expect(S.end, 'review end');
  });
  await step('bank', () => { tab('review'); click('[data-k="bank"]'); expect(S.items.length === 20 && S.items.every(it => it.q.src === 'oficial'), 'bank'); });
  await step('log + theme', () => {
    tab('log'); ACT.theme({ k: 'dark' }); expect(document.documentElement.getAttribute('data-theme') === 'dark', 'dark');
    ACT.theme({ k: 'auto' }); expect(!document.documentElement.hasAttribute('data-theme'), 'auto');
    expect(document.querySelectorAll('.badges .on').length === Object.keys(P.badges).length, 'badges');
  });
  await step('info', () => { tab('info'); expect(document.getElementById('view').textContent.includes('Kelsen'), 'info'); });
  await step('persisted', () => { const s = JSON.parse(localStorage.getItem('rumbo-pper-v1')); expect(s && s.xp === P.xp && s.xp > 0, 'local'); });
  await step('continue goes to pending stage', () => {
    tab('home'); click('[data-act="continue"]');
    const nt = nextTopic();
    expect(NAV.stack.length === 3 && NAV.stack[1].v === 'topic' && NAV.stack[1].p.t === nt && cur().v === nextStage(nt), 'stack ' + JSON.stringify(NAV.stack));
    back(); expect(cur().v === 'topic', 'back to topic');
  });
  await step('intro panel', () => {
    tab('home'); expect(document.querySelector('[data-act="introOk"]'), 'no intro');
    click('[data-act="introOk"]'); expect(!document.querySelector('[data-act="introOk"]') && P.intro === 1, 'intro not dismissed');
  });
  __log.push('xp=' + P.xp + ' days=' + JSON.stringify(P.days) + ' badges=' + Object.keys(P.badges).join(',') + ' L=' + Object.keys(P.L).length);
  await step('reset', () => { tab('log'); ACT.reset(); document.querySelector('.modal [data-m="1"]').click(); expect(P.xp === 0, 'reset'); });
  const pre = document.createElement('pre'); pre.id = 'testlog'; pre.textContent = __log.join('\n'); document.body.appendChild(pre);
}
setTimeout(run, 50);
