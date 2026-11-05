const journeySteps=[
  {title:'表达送礼需求',user:'填写或修改示例提示词，点击发送。',assistant:'理解送礼场景，开始为朋友挑选惊喜。',result:'进入条件确认，补齐选购信息。',tip:'试试：修改输入框中的需求，再点击发送。'},
  {title:'补全必要条件',user:'确认地址、送达时间、预算与包装规格。',assistant:'保留已有信息，结合条件缩小选购范围。',result:'确认后，继续了解朋友的喜好。',tip:'试试：选择预算，再确认信息。'},
  {title:'确认朋友喜好',user:'选择朋友喜欢的小猫类型。',assistant:'根据偏好寻找更合适的潮玩系列。',result:'记录喜好，继续确认已有收藏。',tip:'试试：点击「小猫拟人」。'},
  {title:'补充已有收藏',user:'补充已有系列，或选择「没有」。',assistant:'了解已有收藏，帮助避开重复款。',result:'生成三份礼物推荐方案。',tip:'试试：选择「没有」，等待推荐出现。'},
  {title:'挑选礼物方案',user:'切换方案、查看详情，确认喜欢的款式。',assistant:'展示商品与价格，继续匹配低价渠道。',result:'匹配完成后进入下单页面。',tip:'试试：切换方案，再点击「确认款式，匹配低价」。'},
  {title:'确认订单并支付',user:'核对商品，选择自己买或送礼物及支付方式。',assistant:'展示订单信息与费用明细。',result:'确认支付后，展示演示购买成功状态。',tip:'本页面为交互演示，点击确认支付不会实际扣款。'},
  {title:'购买成功',user:'查看礼物订单创建成功的反馈。',assistant:'确认心意已准备好，本次演示到此完成。',result:'点击「重复体验」回到第一步。',tip:'可以从左侧重新选择任意步骤进行体验。'}
];
let journeyIndex=-1,paymentSuccessTimer=null;
const journeyAside=document.querySelector('aside');
journeyAside.innerHTML=`<div class="journey-brand"><span class="brand-orb">✦</span><div><b>小岛 · AI 送礼助手</b><span>从挑选惊喜，到送出心意</span></div></div><h2>逐步查看交互</h2><div class="journey-steps" aria-label="演示步骤">${journeySteps.map((s,i)=>`<button type="button" data-journey="${i}"><span>${String(i+1).padStart(2,'0')}</span><b>${s.title}</b><i>↗</i></button>`).join('')}</div><button class="journey-restart" data-repeat>↻ 重复体验</button>`;
const journeyDetails=document.createElement('section');journeyDetails.className='journey-details';journeyDetails.setAttribute('aria-live','polite');document.querySelector('.phone').after(journeyDetails);
function updateJourney(index){
  if(index===journeyIndex)return;journeyIndex=index;
  document.querySelectorAll('[data-journey]').forEach((b,i)=>{b.classList.toggle('active',i===index);if(i===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
  const s=journeySteps[index];journeyDetails.innerHTML=`<div class="journey-count">步骤 ${index+1} / ${journeySteps.length}</div><h1>${s.title}</h1><dl><dt>用户</dt><dd>${s.user}</dd><dt>助手</dt><dd>${s.assistant}</dd><dt>结果</dt><dd>${s.result}</dd></dl><p class="journey-tip">↳ ${s.tip}</p><button class="journey-next" data-journey="${index===6?0:index+1}">${index===6?'重复体验':'下一步'} <span>↗</span></button>`;
}
function syncJourney(){
  if(!$('#modal').hidden&&$('#post-layer'))return updateJourney(6);
  if(!$('#modal').hidden&&$('#modal .success'))return updateJourney(6);
  if(!$('#modal').hidden&&$('#modal').classList.contains('checkout'))return updateJourney(5);
  const index=stage===0?0:stage===1?1:stage===2?2:stage===3?3:4;
  updateJourney(index);
}
function showPurchaseSuccess(){
  clearTimeout(paymentSuccessTimer);paymentSuccessTimer=null;
  taskStatus='idle';busy=false;renderTaskControls();
  modal('<div class="success"><b>✓</b><h2>心意已准备好</h2><p>礼物订单创建成功（演示）</p><button class="primary wide" data-repeat>重复体验</button></div>');
  updateJourney(6);
}
function completePurchase(button){
  button.disabled=true;button.textContent='正在确认…';
  clearTimeout(paymentSuccessTimer);paymentSuccessTimer=setTimeout(showPurchaseSuccess,900);
}
function repeatJourney(){
  clearTimeout(paymentSuccessTimer);paymentSuccessTimer=null;
  product=0;reset();$('#modal').classList.remove('checkout','checkout-self');updateJourney(0);
}
async function goToJourney(index){
  clearTimeout(paymentSuccessTimer);paymentSuccessTimer=null;
  clearGeneration();stopVoice();voiceMode=false;$('#modal').hidden=true;$('#modal').classList.remove('checkout','checkout-self');$('.screen').classList.remove('generation-paused');
  if(index===0){welcome();updateJourney(0);return}
  conversation.innerHTML='';$('#input').value='';composerState();
  add(`<div class="user">${escapeHtml(promptText)}</div>`);
  if(index===1)conditions();
  if(index===2){stage=2;question('她喜欢哪种小猫？',['可爱软萌','小猫拟人','暂不确定'],'owned')}
  if(index===3){stage=3;question('当前对方拥有哪些系列呢？',['输入名称','没有','暂不确定'],'recommend')}
  if(index>=4)recommend();
  if(index===5){stage=5;await renderCheckout()}
  if(index===6)showPurchaseSuccess();
  updateJourney(index);
}
document.addEventListener('click',event=>{
  const repeat=event.target.closest('[data-repeat]');if(repeat){event.preventDefault();event.stopImmediatePropagation();repeatJourney();return}
  const step=event.target.closest('[data-journey]');if(step){event.preventDefault();goToJourney(Number(step.dataset.journey))}
},true);
const journeyObserver=new MutationObserver(syncJourney);
journeyObserver.observe(conversation,{childList:true,subtree:true});journeyObserver.observe($('#modal'),{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class']});
function sizeJourneyPreview(){document.documentElement.style.setProperty('--preview-scale',Math.min(1,Math.max(.5,(innerHeight-80)/864)))}
window.addEventListener('resize',sizeJourneyPreview);sizeJourneyPreview();
updateJourney(0);
