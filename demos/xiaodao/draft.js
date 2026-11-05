function resizeDraft(){const input=$('#input');if(!input)return;input.style.height='0px';const contentHeight=input.scrollHeight;input.style.height=Math.min(87,Math.max(48,contentHeight))+'px';input.style.overflowY=contentHeight>87?'auto':'hidden';$('#composer').classList.toggle('multiline-draft',contentHeight>48)}
function fillDraft(text){if(!['idle','waiting'].includes(taskStatus))return;voiceMode=false;$('#input').value=text;composerState();resizeDraft();$('#input').focus();$('#input').setSelectionRange(text.length,text.length);$('#input').scrollTop=0}
document.addEventListener('click',e=>{const b=e.target.closest('[data-start]');if(!b||!['idle','waiting'].includes(taskStatus))return;e.preventDefault();e.stopImmediatePropagation();const label=(b.querySelector('span:not(.shortcut-icon)')?.textContent||b.textContent).trim();fillDraft(/送礼选购|朋友.*生日|生日惊喜/.test(label)?promptText:label)},true);
const draftComposerState=composerState;composerState=function(){draftComposerState();resizeDraft()};$('#input').addEventListener('input',resizeDraft);window.addEventListener('resize',resizeDraft);$('#composer').addEventListener('submit',()=>queueMicrotask(resizeDraft));resizeDraft();

// The opening screen includes an editable example, ready for an explicit send.
const draftWelcome=welcome;
welcome=function(){draftWelcome();$('#input').value=promptText;composerState()};
const giftStart=start;
start=function(text=promptText){
  if(busy||taskStatus==='paused')return;
  const giftRequest=/(送|礼物|生日|盲盒|小猫|猫咪|朋友|下单|惊喜)/i.test(text)&&!/(卖掉|出售|闲置|热门ip|热门IP|爆火)/.test(text);
  if(giftRequest)return giftStart(text);
  if(stage===0)conversation.innerHTML='';
  add(`<div class="user">${escapeHtml(text)}</div>`);
  stage=0;
  loading('正在思考中...',()=>{
    add(`<div class="reply demo-thought"><img src="${asset('1:789','imgGroup491')}" alt="小岛"><span>正在思考中...</span></div><div class="demo-guide"><h3>可以说具体一些哦</h3><p>这是一个送礼物给好友流程的演示demo，可以输入下方案例查看~</p><div class="demo-example">${escapeHtml(promptText)}</div><button type="button" data-use-example>用这句话试试<img src="assets/demo-example-arrow.svg" alt=""></button></div>`);
  });
};
document.addEventListener('click',e=>{
  if(e.target.closest('[data-use-example]'))fillDraft(promptText);
});
