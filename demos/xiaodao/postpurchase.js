let postAssets={},postMode='',purchaseMode=false;
const postReady=fetch('post-assets.json').then(r=>r.json()).then(a=>postAssets=a);
const postAsset=(node,key)=>postAssets[node]?.[key]||'';
function postImage(node,key,cls){return `<img class="${cls}" src="${postAsset(node,key)}" alt="">`}
function removePost(){document.querySelector('#post-layer')?.remove();postMode=''}
function postLayer(html,mode){removePost();postMode=mode;const el=document.createElement('div');el.id='post-layer';el.innerHTML=html;$('#modal').append(el);updateJourney(6)}
function currentProduct(){const p=products[product];return `<span class="post-brand">${escapeHtml(p.brand)}</span> ${escapeHtml(p.name)}`}
async function showPostCard(){
 await postReady;const gift=purchaseMode,node=gift?'40:1146':'40:969';
 postLayer(`<div class="post-dimmer"></div><div class="post-card ${gift?'gift':'self'}">${postImage(node,'imgRectangle408','post-paper')}${postImage(node,gift?'imgExec498324BfBd3D4C4E9081A7039B88E1967':'img9269D8F16Db780Ccf1657D64666943180393439F8C013NfUlgiFw440Webp2','post-decoration left')}${postImage(node,gift?'imgExecCbcb480ED9Ec4E80979D1De5C99434013':'imgExecCbcb480ED9Ec4E80979D1De5C99434012','post-decoration cat')}<h2>${gift?'送礼物给好友':'恭喜您获得新IP'}</h2><img class="post-product" src="${asset(products[product].node,products[product].key)}" alt="${escapeHtml(products[product].name)}"><p class="post-name">${currentProduct()}</p><button class="post-order" data-post="order">规格 单个盲盒 原盒未拆封... 查看订单 ›</button>${postImage(node,'imgRectangle411','post-envelope')}<button class="post-primary" data-post="${gift?'share':'done'}">${gift?'去送礼物':'确认'}</button>${postImage(node,gift?'imgStar11':'imgStar9','post-star one')}${postImage(node,gift?'imgStar12':'imgStar10','post-star two')}</div>${gift?`<button class="post-close" data-post="close" aria-label="关闭礼物卡片">${postImage(node,'imgGroup2147232508','')}</button>`:''}`,gift?'gift':'self');
}
async function showShareSheet(){
 await postReady;const n='40:1274';postLayer(`<div class="post-dimmer"></div><div class="share-preview"><img src="${asset(products[product].node,products[product].key)}" alt="礼物"><p>${currentProduct()}</p><b class="share-spec">${postImage(n,'imgGroup2147232847','share-spec-icon')}<span>整盒</span></b>${postImage(n,'imgGroup2147232936','share-preview-envelope')}</div><div class="post-sheet"><div class="sheet-handle"></div><div class="share-options"><button data-post="wechat">${postImage(n,'imgD2999777644Cbfd3Ae777D6A772596D33C979D1F6160QaTgztFw480Webp1','')}<span>微信</span></button><button data-post="qq">${postImage(n,'img2378F6E24Cef4Dfcdb605B86Cbccf62C38916D98Ba5AR0TydbFw480Webp1','')}<span>QQ</span></button><button data-post="copy">${postImage(n,'imgGroup2147232850','')}<span>复制链接</span></button></div><div class="friend-heading"><span>分享给好友</span><button data-post="add">添加好友 ›</button></div><div class="share-friends">${['圆圆','红红','冰冻兔砸'].map((name,i)=>`<button data-post="island" data-friend="${name}">${postImage(n,['imgEllipse198','imgEllipse199','imgEllipse200'][i],'friend-avatar')}<b>${name}</b><span>${postImage(n,['imgGroup2147232851','imgGroup2147232852','imgGroup2147232853'][i],'friend-share-icon')}分享</span></button>`).join('')}</div><button class="sheet-cancel" data-post="cancel">取消</button><div class="home"></div></div>`,'share');
}
function giftArt(node){return `<div class="gift-art">${postImage(node,'img9E36A2Ba1904436EA540Fdeb53876Ec51','gift-art-base')}${postImage(node,'imgExecCbcb480ED9Ec4E80979D1De5C99434014','gift-art-cat')}${postImage(node,'imgA6E08Ec7Dc399D943D8B799Cf1479Fae2Add7713Bd1E20Enjw8Fw480Webp1','gift-art-gift')}</div>`}
function showGiftDestination(channel){
 if(channel==='wechat')postLayer(`${postImage('40:1093','imgD8Aac6380870B0Bb877D47C7827C87391','wechat-background')}<div class="post-dimmer"></div><button class="wechat-gift" data-post="open"><div class="mini-brand">千岛App <span>交易保障</span></div><p>冰冻兔砸送出的礼物，快拆开看看吧</p>${giftArt('40:1093')}<small>♧ 小程序</small></button><button class="destination-back" data-post="share">‹ 返回分享</button>`,'wechat');
 else postLayer(`<div class="island-chat"><div class="island-status"><b>20:36</b><span class="dynamic-island"></span><span>▥ ◉ ▰</span></div><div class="island-nav"><button data-post="share" aria-label="返回分享">‹</button><span>迷</span><button class="island-follow" data-post="follow">关注</button><span>⋮</span></div><div class="island-notice">以任何名义添加联系方式，引导至平台外交易或缴费的都是骗子！千岛客服只在千岛APP/小程序内，无其他渠道！</div><div class="previous-message"><div class="red-present">🎁<small>▦</small></div><img src="${postAsset('40:1274','imgEllipse198')}" alt="好友头像"><span>未读</span></div><img class="island-avatar" src="${postAsset('40:1274','imgEllipse198')}" alt="好友头像"><div class="island-chat-bottom"><div class="chat-stickers">谢谢　　送花　　尴尬　　比心　　啵啵　　OK</div><div class="chat-input"><span>☷</span><div>说点什么...</div><span>◷</span><span>⊕</span></div></div></div><div class="post-dimmer island-dimmer"></div><div class="island-gift"><h3>冰冻兔砸送你一份礼物</h3>${giftArt('40:1471')}<button class="post-primary" data-post="open">打开礼盒</button></div><button class="destination-back" data-post="share">‹ 返回分享</button><div class="destination-home home"></div>`,'island');
}
const originalPostSuccess=showPurchaseSuccess;
showPurchaseSuccess=function(){clearTimeout(paymentSuccessTimer);paymentSuccessTimer=null;taskStatus='idle';busy=false;renderTaskControls();purchaseMode=giftMode;showPostCard()};
const originalPostComplete=completePurchase;
completePurchase=function(button){purchaseMode=giftMode;originalPostComplete(button)};
const originalPostSync=syncJourney;syncJourney=function(){if($('#post-layer'))return updateJourney(6);originalPostSync()};
const originalPostRepeat=repeatJourney;repeatJourney=function(){removePost();originalPostRepeat()};
const originalPostGo=goToJourney;goToJourney=async function(index){removePost();if(index===6){await originalPostGo(5);showPurchaseSuccess();return}return originalPostGo(index)};
const postDraw=drawCheckout;drawCheckout=function(){postDraw();if(!giftMode){const brand=$('#modal .pay-brand'),shipping=$('#modal .self-shipping');if(brand&&shipping)shipping.after(brand)}removePost()};
document.addEventListener('click',async e=>{
 const b=e.target.closest('[data-post]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
 const action=b.dataset.post;
 if(action==='share')showShareSheet();
 if(action==='cancel')showPostCard();
 if(action==='close')removePost();
 if(action==='done'){removePost();originalPostSuccess()}
 if(action==='wechat')showGiftDestination('wechat');
 if(action==='island')showGiftDestination('island');
 if(action==='open')showUnwrapCard();
 if(action==='follow'){b.textContent=b.textContent==='关注'?'已关注':'关注'}
 if(action==='order'){toast('礼物订单已创建成功（演示）')}
 if(action==='qq')toast('QQ 分享演示暂未提供参考画面，可选择微信或千岛好友');
 if(action==='add')toast('可选择下方千岛好友进行分享');
 if(action==='copy'){try{await navigator.clipboard.writeText(location.origin+'/#gift-demo');toast('演示链接已复制')}catch{toast('演示礼物链接：'+location.origin+'/#gift-demo')}}
},true);
journeySteps[6]={title:'购买成功与送礼',user:'自己买确认新IP；送礼物可继续分享好友。',assistant:'根据购买方式展示对应的成功卡片与分享入口。',result:'支持微信或千岛好友的礼物展示。',tip:'试试：在下单页切换自己买与送礼物，查看不同分支。'};

document.querySelector('[data-journey="6"] b').textContent="购买成功与送礼";
