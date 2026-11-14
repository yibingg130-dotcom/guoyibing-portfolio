(() => {
  const robot = document.querySelector('.robot-motion');
  if (!robot) return;
  const eyes = robot.querySelector('.robot-live-eyes');
  const smile = robot.querySelector('.robot-live-closed');
  if (!eyes) return;
  const gaze = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  eyes.before(gaze);
  gaze.append(eyes);
  robot.classList.add('interactive-eyes');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let nearby = false, timer, frame = 0, x = 0, y = 0, tx = 0, ty = 0;
  let blinking = false;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(blink, 4000 + Math.random() * 2000);
  }
  function blink() {
    if (blinking || document.hidden) { schedule(); return; }
    blinking = true;
    const animation = eyes.animate([
      {transform:'scaleY(1)',opacity:1},
      {transform:'scaleY(.08)',opacity:1,offset:.42},
      {transform:'scaleY(.08)',opacity:1,offset:.58},
      {transform:'scaleY(1)',opacity:1}
    ], {duration:260,easing:'ease-in-out'});
    smile?.animate([{opacity:0},{opacity:1,offset:.42},{opacity:1,offset:.58},{opacity:0}],{duration:260,easing:'ease-in-out'});
    animation.onfinish = () => { blinking = false; schedule(); };
  }
  function moveEyes() {
    x += (tx-x) * .18; y += (ty-y) * .18;
    gaze.setAttribute('transform', `translate(${x.toFixed(3)} ${y.toFixed(3)})`);
    if (Math.abs(tx-x)+Math.abs(ty-y) > .015) frame = requestAnimationFrame(moveEyes);
    else frame = 0;
  }
  function aim(nextX, nextY) {
    tx = nextX; ty = nextY;
    if (!frame) frame = requestAnimationFrame(moveEyes);
  }
  function leave() {
    if (!nearby) return;
    nearby = false;
    aim(0,0);
    clearTimeout(timer);
    blink();
  }
  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const rect = robot.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width/2);
    const dy = event.clientY - (rect.top + rect.height*.59);
    const visible = rect.bottom > 0 && rect.top < innerHeight;
    if (visible && Math.abs(dx)<rect.width/2+64 && Math.abs(dy)<rect.height/2+48) {
      nearby = true;
      const length = Math.max(1, Math.hypot(dx/105,dy/75));
      aim(reduced.matches ? 0 : dx/105/length*4, reduced.matches ? 0 : dy/75/length*2.6);
    } else leave();
  }, {passive:true});
  document.addEventListener('pointerleave', leave);
  window.addEventListener('blur', leave);
  document.addEventListener('scroll', leave, {capture:true,passive:true});
  document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(); });
  schedule();
})();
