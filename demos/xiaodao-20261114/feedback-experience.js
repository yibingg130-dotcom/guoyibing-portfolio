(() => {
  const art = {
    neutral: 'assets/feedback-neutral-audited.svg', like: 'assets/feedback-like-audited.svg',
    dislike: 'assets/feedback-dislike-audited.svg', support: 'assets/feedback-support.svg',
    chevron: 'assets/feedback-chevron.svg', done: 'assets/feedback-done.svg', close: 'assets/feedback-close.svg'
  };
  const descriptions = {
    gift: '根据您提供的信息，匹配到最佳商品，已为您匹配最低价，挑一个当礼物的吧~',
    ranking: '已为您匹配到最近爆火IP排行~快挑挑有没有喜欢的ip吧!点击可直接匹配低价！',
    value: '已为您寻找到近期特惠促销的超值盲盒！性价比超高！快挑选一个您喜欢的吧！',
    desk: '已为您挑选了一些高颜值的桌面摆件！每一个都有超高的颜值~快挑选一个您喜欢的吧！',
    plush: '已为您挑选了一些超可爱的毛绒挂件~ 快挑选一个您喜欢的带回家吧！'
  };
  const rankNames = ['小猫静悄悄', '小狗飞飞', '迷路千纸鹤', '瞄准你的心', '满格晴天', '和云做邻居', '幸运彩虹'];
  let resultSequence = 0, thinkingSequence = 0, activeThought = null, toastTimer = null;
  let critiqueOrigin = null, inertElements = [];
  const votes = new Map();

  function explanation(text) {
    const p = document.createElement('p'); p.className = 'result-explanation'; p.textContent = text; return p;
  }
  function tools(scope, productId, refresh) {
    const el = document.createElement('div'); el.className = 'result-tools';
    el.dataset.voteKey = scope + ':' + productId;
    const reaction = votes.get(el.dataset.voteKey) || '';
    const image = art[reaction] || art.neutral;
    el.innerHTML = '<div class="result-votes" data-reaction="' + reaction + '"><span class="vote-strip" aria-hidden="true"><img src="' + image + '" alt=""></span>' + ['like', 'dislike'].map(v =>
      '<button type="button" class="result-vote ' + v + '" data-vote="' + v + '" aria-label="' + (v === 'like' ? '赞' : '吐槽') + '" aria-pressed="' + (reaction === v) + '"></button>'
    ).join('') + '</div>';
    if (refresh) el.append(refresh);
    return el;
  }
  const baseRenderProduct = renderProduct;
  renderProduct = function () {
    baseRenderProduct();
    const target = $('#recommendation');
    if (!target) return;
    target.dataset.resultRoute = majorRoute; target.dataset.resultProduct = product;
    if (!target.dataset.resultScope) target.dataset.resultScope = 'result-' + (++resultSequence);
    let text = descriptions[majorRoute];
    if (majorRoute === 'rank') {
      const caption = target.previousElementSibling;
      if (caption?.classList.contains('reply')) {
        caption.classList.add('result-caption');
        for (const node of Array.from(caption.childNodes)) {
          if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
          const label = document.createElement('span'); label.textContent = node.textContent; node.replaceWith(label);
        }
      }
      const index = majorCatalog.rank.indexOf(product);
      const series = [4, 6].includes(index) ? '今日心情预报系列盲盒' : '飞行幻想系列盲盒';
      text = '这是最近爆火的泡泡玛特Dimoo ' + series + ' ' + rankNames[index] + '，已为您匹配最低价~';
    }
    target.prepend(explanation(text || descriptions.gift));
    const refresh = target.querySelector('.product-refresh');
    target.append(tools(target.dataset.resultScope, product, refresh));
  };
  const baseRanking = majorRanking;
  majorRanking = function () {
    baseRanking();
    const list = Array.from(document.querySelectorAll('.major-ranking')).at(-1);
    if (!list) return;
    list.before(explanation(descriptions.ranking));
    const footer = tools('ranking-' + (++resultSequence), 'list'); footer.classList.add('ranking-result-tools');
    list.after(footer);
  };

  function showFeedback(reaction) {
    clearTimeout(toastTimer); document.querySelector('.feedback-toast')?.remove();
    const toast = document.createElement('div');
    toast.className = 'feedback-toast ' + (reaction === 'like' ? 'support-toast' : 'critique-toast');
    toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = (reaction === 'like' ? '<img src="' + art.support + '" alt="">' : '') +
      '<span>' + (reaction === 'like' ? '感谢您的支持！' : '感谢您的反馈！') + '</span>';
    $('.screen').append(toast);
    toastTimer = setTimeout(() => toast.remove(), 2000);
  }
  function closeCritique(restoreFocus = true) {
    document.querySelector('#critique-overlay')?.remove();
    inertElements.forEach(({ element, previous }) => element.inert = previous); inertElements = [];
    if (restoreFocus && critiqueOrigin?.isConnected) critiqueOrigin.focus({ preventScroll: true });
    critiqueOrigin = null;
  }
  function updateCritiqueForm() {
    const form = document.querySelector('#critique-form'); if (!form) return;
    const text = form.querySelector('textarea');
    form.querySelector('.critique-count').textContent = text.value.length + '/200';
    form.querySelector('.critique-submit').disabled = !text.value.trim() && !form.querySelector('[data-feedback-reason][aria-pressed="true"]');
  }
  function openCritique(button) {
    closeCritique(false); clearTimeout(toastTimer); document.querySelector('.feedback-toast')?.remove();
    critiqueOrigin = button;
    const overlay = document.createElement('div'); overlay.id = 'critique-overlay';
    overlay.innerHTML = '<section class="critique-sheet" role="dialog" aria-modal="true" aria-labelledby="critique-title">' +
      '<h2 id="critique-title">请反馈您体验不佳的地方</h2><button type="button" class="critique-close" data-close-critique aria-label="关闭反馈"><img src="' + art.close + '" alt=""></button>' +
      '<form id="critique-form"><div class="critique-options">' + ['推荐内容我不喜欢', '响应速度慢', '内容难选择', '价格不够优惠'].map(reason =>
        '<button type="button" data-feedback-reason aria-pressed="false">' + reason + '</button>').join('') +
      '</div><label class="critique-comment"><span class="visually-hidden">其他反馈意见</span><textarea maxlength="200" aria-label="其他反馈意见" placeholder="欢迎您提出宝贵意见"></textarea><span class="critique-count" aria-live="polite">0/200</span></label>' +
      '<button type="submit" class="critique-submit" disabled>提交</button></form><div class="critique-home" aria-hidden="true"></div></section>';
    const screen = $('.screen');
    inertElements = Array.from(screen.children).map(element => ({ element, previous: element.inert }));
    inertElements.forEach(({ element }) => element.inert = true);
    screen.append(overlay);
    overlay.querySelector('.critique-close').focus({ preventScroll: true });
    overlay.addEventListener('click', event => {
      if (event.target === overlay || event.target.closest('[data-close-critique]')) { closeCritique(); return; }
      const choice = event.target.closest('[data-feedback-reason]');
      if (choice) { choice.setAttribute('aria-pressed', String(choice.getAttribute('aria-pressed') !== 'true')); updateCritiqueForm(); }
    });
    overlay.querySelector('textarea').addEventListener('input', updateCritiqueForm);
    overlay.querySelector('form').addEventListener('submit', event => {
      event.preventDefault(); const submit = overlay.querySelector('.critique-submit'); if (submit.disabled) return;
      closeCritique(); showFeedback('dislike');
    });
    overlay.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); closeCritique(); return; }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(overlay.querySelectorAll('button:not(:disabled),textarea'));
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-vote]');
    if (!button) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const footer = button.closest('.result-tools'), reaction = button.dataset.vote;
    votes.set(footer.dataset.voteKey, reaction);
    footer.querySelectorAll('[data-vote]').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.vote === reaction));
    });
    footer.querySelector('.result-votes').dataset.reaction = reaction;
    footer.querySelector('.vote-strip img').src = art[reaction];
    if (reaction === 'dislike') openCritique(button); else showFeedback(reaction);
  }, true);

  function completedText(text) {
    return text.replace(/^正在帮您寻找/, '已经帮您寻找到').replace(/^正在/, '已经');
  }
  function getCompletedLines(record) {
    return record.phases.map(completedText);
  }
  function rows(record, running) {
    return record.completed.map((line, index) => '<div class="thinking-history-line" data-history-step="' + index + '"><span>' + escapeHtml(running ? record.phases[index] : line) + '</span><img class="thinking-check" src="' + (running ? record.spinner : art.done) + '" alt="' + (running ? '思考中' : '完成') + '"></div>').join('');
  }
  function updateRunning(job) {
    const record = job.uiThoughtRecord;
    if (!record || !job.el.isConnected) return;
    job.el.querySelectorAll('[data-history-step]').forEach(row => {
      const index = Number(row.dataset.historyStep);
      const done = (!job.thought && ['match', 'table'].includes(record.type)) || (job.thought && (index < Math.floor(job.index / 2) || (index === Math.floor(job.index / 2) && job.index % 2 === 1)));
      row.querySelector('span').textContent = done ? record.completed[index] : record.phases[index];
      row.querySelector('img').src = done ? art.done : record.spinner;
      row.querySelector('img').alt = done ? '完成' : '思考中';
      row.querySelector('img').classList.toggle('thinking-spinner', !done);
    });
  }
  function decorateRunning(job, record) {
    job.uiThoughtRecord = record; record.job = job;
    if (!record.completed.length || job.el.querySelector('.thinking-toggle')) return;
    const button = document.createElement('button'); button.type = 'button'; button.className = 'thinking-toggle';
    button.setAttribute('aria-label', '展开思考过程'); button.setAttribute('aria-expanded', 'false');
    const id = 'thinking-progress-' + record.id;
    button.setAttribute('aria-controls', id); button.innerHTML = '<img src="' + art.chevron + '" alt="">';
    const panel = document.createElement('div'); panel.id = id; panel.className = 'thinking-history-preview'; panel.hidden = !record.expanded;
    button.setAttribute('aria-expanded', String(!!record.expanded)); job.el.classList.toggle('thinking-expanded', !!record.expanded);
    panel.innerHTML = rows(record, true);
    if (job.thought) {
      job.el.classList.add('expandable-thought-loading');
      job.el.querySelector('.thought-window').after(button); job.el.append(panel);
    } else {
      const replyEl = job.el.querySelector('.reply');
      replyEl?.append(button); replyEl?.after(panel);
    }
    updateRunning(job);
  }
  function makeDisclosure(record, caption, avatar) {
    const details = document.createElement('details'); details.className = 'thinking-disclosure'; if (caption === '已找到三份惊喜！') details.classList.add('gift-thinking-summary');
    details.innerHTML = '<summary class="reply thinking-summary"><img class="thinking-avatar" src="' + asset('1:789', 'imgGroup491') + '" alt="小岛"><span>' + escapeHtml(caption) + '</span><img class="thinking-chevron" src="' + art.chevron + '" alt=""></summary><div class="thinking-history">' + rows(record, false) + '</div>';
    details.open = !!record.expanded;
    details.querySelector('summary').setAttribute('aria-label', caption + (details.open ? '，收起思考过程' : '，展开思考过程'));
    if (avatar) { avatar.className = 'thinking-avatar'; details.querySelector('.thinking-avatar').replaceWith(avatar); }
    details.addEventListener('toggle', () => details.querySelector('summary').setAttribute('aria-label', caption + (details.open ? '，收起思考过程' : '，展开思考过程')));
    return details;
  }
  function completeRecord(record, callback) {
    const source = record.job?.el;
    const avatar = source?.querySelector('.reply>img,.thought-avatar>img');
    callback();
    let section = conversation.lastElementChild;
    let header = section !== source ? section?.querySelector(':scope > .reply') : null;
    if (record.refresh) {
      section = $('#recommendation')?.closest('section');
      header = section?.querySelector(':scope > .thinking-disclosure,:scope > .reply');
    }
    if (!header) {
      add(reply(completedText(record.text)));
      section = conversation.lastElementChild; header = section.querySelector('.reply');
    }
    const caption = header.matches('details') ? header.querySelector('summary>span').textContent : header.textContent.trim();
    header.replaceWith(makeDisclosure(record, caption, avatar));
    section.classList.add('stable-avatar-section', 'thinking-result-section');
    if (activeThought === record) activeThought = null;
  }
  const baseScheduleGeneration = scheduleGeneration;
  scheduleGeneration = function (job) {
    const record = job.uiThoughtRecord || activeThought;
    if (record?.completed.length) { decorateRunning(job, record); updateRunning(job); }
    return baseScheduleGeneration(job);
  };
  const baseLoading = loading;
  loading = function (text, callback) {
    if (busy || taskStatus === 'paused') return;
    const progressLabels = {'正在了解朋友的喜好':'根据已填条件，整理需确认的偏好','正在记录喜好':'根据已选偏好，补充已有收藏信息','正在寻找更多惊喜':'保留当前需求，整理下一组候选款式','正在匹配低价与配送方案':'根据所选款式，整理演示报价与配送信息'};
    text = progressLabels[text] || text;
    const record = { id: ++thinkingSequence, route: majorRoute, text, phases: [], completed: [], refresh: callback === renderProduct };
    activeThought = record;
    const result = baseLoading(text, () => completeRecord(record, callback));
    const job = pendingGeneration;
    if (!job) { activeThought = null; return result; }
    record.type = job.type;
    record.phases = job.thought ? thoughtSets[job.type].filter((_, index) => index % 2 === 0) : [text];
    record.completed = getCompletedLines(record);
    record.spinner = revisionAssets[job.type === 'table' ? '1:3610' : '1:3784'].imgFrame6;
    decorateRunning(job, record);
    return result;
  };
  document.addEventListener('click', event => {
    const button = event.target.closest('.thinking-toggle');
    if (!button) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const root = button.closest('.generation-loading');
    const panel = root.querySelector('.thinking-history-preview');
    const open = panel.hidden; if (activeThought?.job?.el === root) activeThought.expanded = open; panel.hidden = !open; root.classList.toggle('thinking-expanded', open);
    button.setAttribute('aria-expanded', String(open)); button.setAttribute('aria-label', open ? '收起思考过程' : '展开思考过程');
  }, true);
  const baseWelcome = welcome;
  welcome = function () {
    activeThought = null; closeCritique(false); clearTimeout(toastTimer); document.querySelector('.feedback-toast')?.remove();
    votes.clear(); return baseWelcome();
  };
})();
