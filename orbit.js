// Portraits use individual source images; each circle clips its own image.
const orbitPositions=[
[47,46,23],[20,17,17],[48,11,14],[77,20,18],[13,48,15],[81,49,16],[26,78,17],[55,82,16],[83,78,13],[29,41,11],[63,30,11],[45,67,10],[67,66,11],[8,76,10],[90,9,9],[7,12,9],[35,9,9],[72,91,9],[92,33,8],[13,93,8],[34,93,8],[93,61,8],[57,94,8],[33,59,9],[63,10,8],[8,32,8],[92,91,8],[70,42,8],[33,25,8],[74,6,8]
];
let orbitList=[], orbitSelected=-1, orbitEra=8;
const eraScopes={0:'含传统夏代世系与相关传说人物',1:'含商代君主、名臣及甲骨文记载人物',3:'含统一前秦国及秦末相关人物',7:'含隋末政治与军事人物',9:'涵盖五代及十国诸政权',10:'涵盖宋、辽、金并立政权'};
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function renderPeople(era){
 orbitEra=era;orbitList=historyFigures.filter(p=>p.era===era);orbitSelected=-1;
 const r=rows[era];document.body.classList.add('people-page');
 const area=document.getElementById('content');
 area.innerHTML=`<div class="orbit-toolbar"><div><h2>时代群像 <span class="orbit-counter">${orbitList.length} <small>位人物</small></span></h2><p>悬停或轻触肖像，查看姓名、生卒年与生平。</p>${eraScopes[era]?`<p class="orbit-scope">${eraScopes[era]}</p>`:''}</div><button class="reset-orbits" onclick="clearOrbitSelection()">查看全景 ↗</button></div><div class="orbit-layout"><section class="orbit-field" aria-label="${escapeHtml(r[0])}人物肖像" onkeydown="if(event.key==='Escape')clearOrbitSelection()">${Array.from({length:12},(_,j)=>`<i class="orbit-speck" style="left:${8+(j*29)%85}%;top:${6+(j*17)%88}%"></i>`).join('')}${orbitList.map((p,j)=>{let pt=orbitList.length<=5?[[48,45,28],[20,23,20],[78,24,20],[23,77,18],[78,77,18]][j]:orbitPositions[j%orbitPositions.length];return `<div class="orbit-node" data-person="${j}" style="--x:${pt[0]}%;--y:${pt[1]}%;--size:${pt[2]}%;--delay:-${j*.73}s;--duration:${6+(j%5)}s"><div class="orbit-float"><button class="portrait-orb" aria-label="${escapeHtml(p.name)}，${escapeHtml(p.life)}" aria-pressed="false" onpointerenter="selectOrbit(${j})" onfocus="selectOrbit(${j})" onclick="selectOrbit(${j})" onpointermove="orbParallax(event,this)" onpointerleave="this.style.setProperty('--mx','0px');this.style.setProperty('--my','0px')"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}的历史艺术形象" style="width:${p.viewport.width}%;height:${p.viewport.height}%;left:${p.viewport.left}%;top:${p.viewport.top}%" loading="eager" decoding="async"></button></div></div>`}).join('')}</section><aside class="orbit-info" aria-live="polite" aria-atomic="true"></aside></div><p class="orbit-footnote">本页收录本时期的重要代表人物，按主要活动时代归属，跨朝人物可能生于上一时期。画像多为后世绘画或纪念雕像；无可用画像者采用明确标注的 AI 艺术想象图，均不代表真实容貌。生卒年有争议处注明。人物与图片出处可在介绍中查看。</p>`;
 if(orbitList.length)selectOrbit(0);else clearOrbitSelection();
}
function selectOrbit(index){
 if(index===orbitSelected)return;const p=orbitList[index];if(!p)return;orbitSelected=index;
 const scene=document.querySelector('.orbit-field');if(!scene)return;scene.classList.add('has-selection');
 scene.querySelectorAll('.orbit-node').forEach((node,j)=>{node.classList.toggle('selected',j===index);node.querySelector('button').setAttribute('aria-pressed',String(j===index))});
 const panel=document.querySelector('.orbit-info');panel.classList.remove('info-change');
 panel.innerHTML=`<div class="info-kicker">${escapeHtml(rows[orbitEra][0])} · 人物志</div><h2>${escapeHtml(p.name)}</h2><div class="life">${escapeHtml(p.life)}</div><span class="field-tag">${escapeHtml(p.field)}</span><p class="bio">${escapeHtml(p.bio)}</p><a class="source-link" href="${escapeHtml(p.page)}" target="_blank" rel="noopener">阅读人物资料 ↗</a> <a class="source-link image-source" href="${escapeHtml(p.imagePage||p.page)}" target="_blank" rel="noopener">${p.imagined?"查看艺术想象图":"画像出处"} ↗</a><p class="image-note">${escapeHtml(p.imageNote||'后世艺术形象 · 画像来自 Wikimedia 所收录资料')}</p><div class="orbit-navigation"><button aria-label="上一位人物" onclick="stepOrbit(-1)">←</button><button aria-label="下一位人物" onclick="stepOrbit(1)">→</button></div>`;
 requestAnimationFrame(()=>panel.classList.add('info-change'));
}
function clearOrbitSelection(){orbitSelected=-1;const scene=document.querySelector('.orbit-field');if(!scene)return;scene.classList.remove('has-selection');scene.querySelectorAll('.orbit-node').forEach(node=>{node.classList.remove('selected');node.querySelector('button').setAttribute('aria-pressed','false')});document.querySelector('.orbit-info').innerHTML='<div class="info-kicker">相逢于历史之中</div><h2 class="empty-title">每一张面孔，<br>都是一个时代的注脚。</h2><p class="bio">将光标移到人物肖像上，或轻触一个圆圈，即可查看姓名、生卒年与生平介绍。</p><div class="orbit-legend"><i></i> 悬停聚焦　／　方向按钮逐一浏览</div>';}
function stepOrbit(direction){if(!orbitList.length)return;selectOrbit((orbitSelected+direction+orbitList.length)%orbitList.length)}
function orbParallax(event,button){if(event.pointerType==='touch'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const rect=button.getBoundingClientRect();button.style.setProperty('--mx',((event.clientX-rect.left-rect.width/2)*.045).toFixed(1)+'px');button.style.setProperty('--my',((event.clientY-rect.top-rect.height/2)*.045).toFixed(1)+'px');}
const previousEraShow=show;
show=function(era,tab='people') {document.body.classList.remove('people-page');previousEraShow(era,tab);if(tab==='people')renderPeople(era);window.scrollTo({top:0,behavior:'instant'});};
const previousHome=home;
home=function(){document.body.classList.remove('people-page');previousHome();window.scrollTo({top:0,behavior:'instant'});};
// Deep links and browser back restore the matching era and page.
function restoreRoute(){const match=location.hash.match(/^#(\d+)\/(map|people|books)$/);if(match&&rows[Number(match[1])])show(Number(match[1]),match[2]);else if(document.body.classList.contains('people-page'))home();}
window.addEventListener('popstate',restoreRoute);

if(typeof initialPageHash!=='undefined'&&/^#\d+\/(map|people|books)$/.test(initialPageHash)){history.replaceState(null,'',initialPageHash);restoreRoute();}
