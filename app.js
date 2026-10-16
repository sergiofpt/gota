(()=>{const C=window.GOTA_CONFIG,P=window.PERFUMES,S=[2,5,10],$=s=>document.querySelector(s),app=$("#app");
const eur=v=>v.toFixed(2).replace(".",",")+" €",byId=id=>P.find(p=>p.id===id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let uid=0;
function bottleSvg(p,shape){const [a,b]=p.col,i="g"+(uid++),k=shape??(p.n.length%4);
const bodies=['<rect x="22" y="52" width="56" height="88" rx="6"/>','<path d="M50 50c22 0 32 18 32 46s-10 44-32 44-32-16-32-44 10-46 32-46z"/>','<path d="M28 52h44l8 88H20z"/>','<rect x="18" y="58" width="64" height="82" rx="30"/>'];
return `<svg viewBox="0 0 100 150" aria-hidden="true"><defs><linearGradient id="${i}" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${a}"/></linearGradient></defs>
<rect x="38" y="10" width="24" height="26" rx="3" fill="#17130f"/><rect x="41" y="36" width="18" height="14" fill="#c9a46a"/>
<g fill="url(#${i})" stroke="rgba(0,0,0,.08)">${bodies[k]}</g><rect x="30" y="${k==1?62:66}" width="7" height="58" rx="3.5" fill="#fff" opacity=".28"/>
<rect x="33" y="92" width="34" height="22" fill="#f6f1ea" opacity=".85"/><text x="50" y="106" text-anchor="middle" font-family="Cormorant Garamond,serif" font-size="9" fill="#17130f">${esc(p.c.split(" ").map(w=>w[0]).join("").slice(0,3))}</text></svg>`}
window.gotaFb=(el,id,k)=>{const p=byId(id);if(!p)return;const t=document.createElement("span");t.className="fb";t.innerHTML=bottleSvg(p,k===""?undefined:+k);el.replaceWith(t.firstChild)};
function bottle(p,shape){return p.img?`<img class="photo" src="${p.img}" alt="${esc(p.n)} · ${esc(p.c)}" loading="lazy" decoding="async" onerror="gotaFb(this,'${p.id}','${shape??""}')">`:bottleSvg(p,shape)}
// ---- cart
let cart=JSON.parse(localStorage.getItem("gota_cart")||"[]").filter(l=>l&&!l.box&&byId(l.id)&&S.includes(l.s));
const save=()=>{localStorage.setItem("gota_cart",JSON.stringify(cart));$("#cartCount").textContent=cart.reduce((s,l)=>s+l.q,0)};
const lineP=l=>byId(l.id).p[S.indexOf(l.s)];
const sub=()=>cart.reduce((s,l)=>s+lineP(l)*l.q,0);
function add(id,s,q=1){const l=cart.find(x=>x.id===id&&x.s===s&&!x.box);l?l.q+=q:cart.push({id,s,q});save();toast(`${byId(id).n} · ${s} mL adicionado`);renderCart()}
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("on");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("on"),2200)}
function openCart(){renderCart();$("#drawer").classList.add("on");$("#veil").classList.add("on")}
function closeAll(){["#drawer","#veil","#modal","#nav"].forEach(s=>$(s).classList.remove("on"))}
function renderCart(){const b=$("#drawerBody");if(!cart.length){b.innerHTML=`<div style="margin:auto;text-align:center"><p style="font:italic 28px var(--serif)">Ainda sem gotas.</p><p style="color:var(--muted);margin:8px 0 22px">Comece pelo catálogo.</p><a class="btn" href="#/catalogo" data-close>Ver catálogo</a></div>`;return}
const st=sub(),f=C.envio.gratisAcima,rest=Math.max(0,f-st);
b.innerHTML=cart.map((l,i)=>{const p=byId(l.id);return `<div class="line">${bottle(p)}<div><b>${esc(p.n)}</b><small>${esc(p.c)} · ${l.s} mL</small><div class="qty"><button data-q="${i}" data-d="-1">−</button><span>${l.q}</span><button data-q="${i}" data-d="1">+</button></div></div><div>${eur(lineP(l)*l.q)}</div></div>`}).join("")+
`<div class="tot"><small style="color:var(--muted)">${rest>0?`Faltam ${eur(rest)} para envio grátis`:"Tem envio grátis ✦"}</small><div class="prog"><i style="width:${Math.min(100,st/f*100)}%"></i></div><div class="big"><span>Subtotal</span><span>${eur(st)}</span></div><a class="btn full" href="#/checkout" data-close>Finalizar encomenda</a></div>`}
document.addEventListener("click",e=>{const t=e.target.closest("[data-q],[data-close],[data-open],[data-add],[data-size]");if(!t)return;
if(t.dataset.q!==undefined){const l=cart[+t.dataset.q];l.q+=+t.dataset.d;if(l.q<1)cart.splice(+t.dataset.q,1);save();renderCart()}
if(t.dataset.close!==undefined)closeAll();
if(t.dataset.open)openProduct(t.dataset.open);
if(t.dataset.size){t.parentNode.querySelectorAll("button").forEach(x=>x.classList.remove("on"));t.classList.add("on")}
if(t.dataset.add){const s=+($("#modal .sizes .on")?.dataset.size||5);add(t.dataset.add,s);closeAll();openCart()}});
$("#veil").onclick=closeAll;$("#cartBtn").onclick=openCart;$("#menuBtn").onclick=()=>$("#nav").classList.toggle("on");
document.addEventListener("keydown",e=>e.key==="Escape"&&closeAll());
function openProduct(id){const p=byId(id),m=$("#modal");m.innerHTML=`<div class="pd"><div class="ph">${bottle(p)}</div><div class="info"><button class="ico x" data-close>✕</button><span class="eyebrow">${esc(p.c)}</span><h2>${esc(p.n)}</h2><div class="meta"><span>${p.f}</span><span>${p.g}</span><span>${p.t}</span></div><p style="color:var(--muted)">${esc(p.d)}</p>
<div class="pyr"><div><b>Topo</b><span>${p.top.join(", ")}</span></div><div><b>Coração</b><span>${p.mid.join(", ")}</span></div><div><b>Fundo</b><span>${p.base.join(", ")}</span></div></div>
<small style="letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-size:11px">Tamanho</small><div class="sizes">${S.map((s,i)=>`<button data-size="${s}" class="${s===5?"on":""}"><b>${s} mL</b><small>${eur(p.p[i])} · ~${s*12} borrifos</small></button>`).join("")}</div>
<button class="btn full" data-add="${p.id}">Adicionar ao saco</button></div></div>`;m.classList.add("on");$("#veil").classList.add("on")}
const card=p=>`<a class="card fade" data-open="${p.id}"><div class="ph">${bottle(p)}<span class="tag">${p.f}</span></div><div class="house">${esc(p.c)}</div><h3>${esc(p.n)}</h3><div class="pr">desde ${eur(p.p[0])}</div></a>`;
// ---- views
const V={};
V[""]=()=>{const pick=["naxos-xerjoff","aventus-creed","tobacolor-dior"].map(byId),feat=["aventus-creed","hundred-silent-ways-nishane","khamrah-lattafa","dior-homme-intense","light-blue-pour-homme-eau-intense-dolce-gabbana","spicebomb-extreme-viktor-rolf","office-for-men-fragrance-one","sweet-vanilla-montale"].map(byId);
return `<section class="hero"><div class="fade"><span class="eyebrow">Atelier de decants · Portugal</span><h1>Prove o frasco<br>antes de o <em>comprar.</em></h1><p>Perfumes de uma coleção pessoal em 2, 5 e 10 mL, decantados à mão a partir dos frascos originais da prateleira. Use durante dias e decida com a pele, não com o papel.</p><a class="btn" href="#/catalogo">Explorar perfumes</a></div><div class="stage">${pick.map((p,i)=>`<div class="b${p.img?" ph-photo":""}" style="height:${[78,100,70][i]}%">${bottle(p,[0,3,1][i])}</div>`).join("")}</div></section>
<div class="marq"><span>${Array(2).fill([...new Set(P.map(p=>p.c))].map(c=>`${c}<em>✦</em>`).join("")).join("")}</span></div>
<section class="section"><div class="shead"><h2>Em destaque</h2><a href="#/catalogo" class="btn ghost">Ver os ${P.length}</a></div><div class="grid">${feat.map(card).join("")}</div></section>`};
let F={f:new Set,c:new Set,g:new Set,max:40,q:"",sort:"rel"};
V.catalogo=()=>{const fam=[...new Set(P.map(p=>p.f))].sort(),houses=[...new Set(P.map(p=>p.c))].sort();
const ch=(k,arr)=>`<div class="chips">${arr.map(v=>`<button class="chip ${F[k].has(v)?"on":""}" data-f="${k}" data-v="${esc(v)}">${esc(v)}</button>`).join("")}</div>`;
setTimeout(drawGrid);return `<section class="section"><div class="shead"><div><span class="eyebrow">Catálogo</span><h2>Todos os perfumes</h2></div></div><div class="layout"><aside class="filters" id="filters"><h4>Família</h4>${ch("f",fam)}<h4>Público</h4>${ch("g",["Feminino","Masculino","Unissexo"])}<h4>Preço máx. (5 mL): <span id="mx">${F.max} €</span></h4><input type="range" id="price" min="8" max="40" value="${F.max}"><h4>Casa</h4>${ch("c",houses)}<p style="margin-top:20px"><button class="chip" id="clr">Limpar filtros</button></p></aside>
<div><div class="bar"><input type="search" id="q" placeholder="Procurar perfume, casa ou nota (ex.: baunilha)" value="${esc(F.q)}"><button class="chip ffbtn" id="ff">Filtros</button><select id="sort"><option value="rel">Destaque</option><option value="asc">Preço ↑</option><option value="desc">Preço ↓</option><option value="az">A–Z</option></select></div><p class="count" id="cnt"></p><div class="grid" id="grid"></div></div></div></section>`};
function drawGrid(){const g=$("#grid");if(!g)return;const q=F.q.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
let r=P.filter(p=>(!F.f.size||F.f.has(p.f))&&(!F.c.size||F.c.has(p.c))&&(!F.g.size||F.g.has(p.g))&&p.p[1]<=F.max&&(!q||[p.n,p.c,p.f,...p.top,...p.mid,...p.base].join(" ").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").includes(q)));
if(F.sort==="asc")r.sort((a,b)=>a.p[1]-b.p[1]);if(F.sort==="desc")r.sort((a,b)=>b.p[1]-a.p[1]);if(F.sort==="az")r.sort((a,b)=>a.n.localeCompare(b.n));
$("#cnt").textContent=r.length+" perfumes";g.innerHTML=r.length?r.map(card).join(""):`<p style="font:italic 26px var(--serif);color:var(--muted)">Nenhum perfume com esses filtros.</p>`;$("#sort").value=F.sort}
document.addEventListener("click",e=>{const t=e.target.closest("[data-f]");if(t){const s=F[t.dataset.f];s.has(t.dataset.v)?s.delete(t.dataset.v):s.add(t.dataset.v);t.classList.toggle("on");drawGrid()}
if(e.target.id==="clr"){F={f:new Set,c:new Set,g:new Set,max:40,q:"",sort:"rel"};route()}if(e.target.id==="ff")$("#filters").classList.toggle("on")});
document.addEventListener("input",e=>{if(e.target.id==="q"){F.q=e.target.value;drawGrid()}if(e.target.id==="price"){F.max=+e.target.value;$("#mx").textContent=F.max+" €";drawGrid()}if(e.target.id==="sort"){F.sort=e.target.value;drawGrid()}});
// ---- checkout
V.checkout=()=>{if(!cart.length)return `<section class="page"><h1>O saco está vazio.</h1><a class="btn" href="#/catalogo">Ver catálogo</a></section>`;
return `<section class="section"><div class="box"><form class="form" id="co"><span class="eyebrow">Finalizar encomenda</span><h2 style="font-size:48px">Os seus dados</h2>
<input type="text" name="nome" placeholder="Nome" required><div class="two"><input type="email" name="email" placeholder="Email" required><input type="tel" name="tel" placeholder="Telemóvel"></div>
<input type="text" name="morada" placeholder="Morada" required><div class="two"><input type="text" name="cp" placeholder="Código postal (0000-000)" pattern="\\d{4}-\\d{3}" required><input type="text" name="loc" placeholder="Localidade" required></div>
<input type="text" name="nif" placeholder="NIF (opcional, para fatura)"><h4 style="margin-top:10px;font-weight:500">Envio</h4>
<label class="r"><input type="radio" name="env" value="ctt" checked> CTT Correio registado · 2–3 dias úteis · ${eur(C.envio.ctt)}</label><label class="r"><input type="radio" name="env" value="expresso"> CTT Expresso · 24 h · ${eur(C.envio.expresso)}</label>
<textarea name="nota" rows="3" placeholder="Nota (opcional): mensagem de oferta, preferências…"></textarea>
<h4 style="margin-top:10px;font-weight:500">Enviar encomenda</h4><p style="color:var(--muted);font-size:13px">Recebe a confirmação e os dados de pagamento (MB WAY, transferência${C.stripePaymentLink?" ou cartão":""}) em resposta.</p>
<div class="two"><button class="btn full" name="via" value="wa">Enviar por WhatsApp</button><button class="btn full ghost" style="margin:0" name="via" value="mail">Enviar por email</button></div>
${C.stripePaymentLink?`<button class="btn full" name="via" value="stripe" style="background:var(--gold)">Pagar com cartão</button>`:""}</form>
<div class="panel" id="sum"></div></div></section>`};
function shipCost(){const v=document.querySelector("[name=env]:checked")?.value||"ctt",st=sub();return st>=C.envio.gratisAcima&&v==="ctt"?0:C.envio[v]}
function drawSum(){const e=$("#sum");if(!e)return;const sh=shipCost();e.innerHTML=`<h3 style="font-size:28px;margin-bottom:10px">Resumo</h3>${cart.map(l=>`<div class="tot" style="padding:0"><div><span>${l.q}× ${esc(byId(l.id).n)} ${l.s} mL</span><span>${eur(lineP(l)*l.q)}</span></div></div>`).join("")}<hr style="border:0;border-top:1px solid var(--line);margin:14px 0"><div class="tot" style="padding:0"><div><span>Envio</span><span>${sh?eur(sh):"Grátis"}</span></div><div class="big"><span>Total</span><span>${eur(sub()+sh)}</span></div></div>`}
document.addEventListener("change",e=>{if(e.target.name==="env")drawSum()});
document.addEventListener("submit",e=>{if(e.target.id!=="co")return;e.preventDefault();const d=Object.fromEntries(new FormData(e.target)),via=e.submitter?.value||"wa",sh=shipCost(),ref="G"+Date.now().toString(36).toUpperCase().slice(-6);
const txt=[`Nova encomenda ${C.marca} · ${ref}`,"",...cart.map(l=>`• ${l.q}× ${byId(l.id).n} (${byId(l.id).c}) ${l.s} mL = ${eur(lineP(l)*l.q)}`),"",`Envio (${d.env==="expresso"?"CTT Expresso":"CTT registado"}): ${sh?eur(sh):"grátis"}`,`TOTAL: ${eur(sub()+sh)}`,"",`Nome: ${d.nome}`,`Email: ${d.email}`,d.tel&&`Tel: ${d.tel}`,`Morada: ${d.morada}, ${d.cp} ${d.loc}`,d.nif&&`NIF: ${d.nif}`,d.nota&&`Nota: ${d.nota}`].filter(x=>x!==""&&x).join("\n");
localStorage.setItem("gota_last",JSON.stringify({ref,txt}));
const url=via==="mail"?`mailto:${C.email}?subject=${encodeURIComponent("Encomenda "+ref)}&body=${encodeURIComponent(txt)}`:via==="stripe"?`${C.stripePaymentLink}?prefilled_email=${encodeURIComponent(d.email)}&client_reference_id=${ref}`:`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(txt)}`;
window.open(url,"_blank");cart=[];save();location.hash="#/obrigado"});
V.obrigado=()=>{const l=JSON.parse(localStorage.getItem("gota_last")||"{}");return `<section class="page" style="text-align:center"><span class="eyebrow">Encomenda ${l.ref||""}</span><h1>Obrigado.</h1><p>O resumo foi preparado e aberto no WhatsApp ou no email. Assim que o enviar, respondemos com os dados de pagamento e, depois de confirmado, os decants seguem em 24–48 h úteis.</p><a class="btn" href="#/catalogo" style="margin-top:20px">Continuar a explorar</a></section>`};
// ---- static pages
V.envios=()=>`<section class="page"><span class="eyebrow">Ajuda</span><h1>Envios e devoluções</h1><h2>Envios</h2><ul><li>Enviamos para Portugal continental, Açores e Madeira.</li><li>CTT Correio registado (2–3 dias úteis): ${eur(C.envio.ctt)}. Grátis em encomendas a partir de ${eur(C.envio.gratisAcima)}.</li><li>CTT Expresso (24 h, continente): ${eur(C.envio.expresso)}.</li><li>As encomendas confirmadas até às 14h seguem no próprio dia útil.</li></ul>
<h2>Embalagem</h2><p>Cada atomizador segue protegido e numa caixa rígida. Perfumes são líquidos inflamáveis, por isso enviamos apenas por via terrestre quando a transportadora o exige.</p>
<h2>Devoluções</h2><p>Por razões de higiene, os decants abertos não podem ser devolvidos. Se um artigo chegar danificado ou trocado, envie uma fotografia em 14 dias e substituímos sem custos. Tem sempre o direito de livre resolução de 14 dias sobre artigos fechados, nos termos da lei portuguesa.</p></section>`;
V.faq=()=>`<section class="page"><span class="eyebrow">Perguntas frequentes</span><h1>FAQ</h1>${[["Os perfumes são originais?","Sim. Cada decant sai de um frasco original da coleção. O catálogo inclui algumas casas árabes e de preço acessível, apresentadas com o nome e a marca reais."],["Quanto tempo dura um decant?","Guardado longe da luz e do calor, mantém-se estável durante anos, tal como o frasco original."],["Posso levar no avião?","Sim. Todos os tamanhos estão abaixo do limite de 100 mL da bagagem de mão."],["Como pago?","Depois de enviar o resumo da encomenda por WhatsApp ou email, recebe os dados para MB WAY ou transferência bancária."],["Fazem embrulho para oferta?","Deixe uma nota na encomenda e tratamos do embrulho."],["Posso pedir um perfume que não está no catálogo?","Pode. Escreva-nos e dizemos se o conseguimos decantar."],["Porque é que os preços variam tanto?","O preço acompanha o valor do frasco original. Um perfume de nicho custa mais por mililitro do que um de grande distribuição."]].map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</section>`;
V.sobre=()=>`<section class="page"><span class="eyebrow">Sobre</span><h1>Uma gota de cada vez.</h1><p>A Gota nasceu de uma frustração simples: comprar um frasco de 100 mL depois de cheirar uma tira de papel numa loja barulhenta raramente corre bem.</p><p>Um perfume muda ao longo do dia, reage à pele e ao tempo que faz lá fora. Por isso decantamos os perfumes da coleção em tamanhos pequenos, para que os possa usar a sério antes de decidir.</p><p>Trabalhamos em pequenas quantidades, à mão, e o catálogo é a própria coleção: só entram perfumes que temos e usamos, do clássico ao contemporâneo.</p><a class="btn" href="#/catalogo" style="margin-top:20px">Ver o catálogo</a></section>`;
function route(){const h=location.hash.replace(/^#\/?/,"").split("?")[0];closeAll();app.innerHTML=(V[h]||V[""])();document.querySelectorAll("nav a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#/"+h));if(h==="checkout")drawSum();}
addEventListener("hashchange",()=>{route();scrollTo(0,0)});save();route();
})();
