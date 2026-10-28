(function(root){
"use strict";
// Painel reutilizado dentro do unico GameCreator e no editor Pixel Art isolado.
const SCHEMA="apoena.natureza.asset.v1";
const FASES=[
 ["semente","Semente seca no chão","Um objeto por arquivo. Mostrar semente inteira e isolada."],
 ["semente_molhada","Semente molhada/enterrando","A mesma semente, solo úmido sem fundo e sem chão grande."],
 ["germinacao","Germinação e raiz","Primeira raiz e broto, mesma espécie."],
 ["muda","Mudinha","Tamanho menor que a jovem. Base no mesmo ponto."],
 ["jovem","Planta jovem","Cresceu em altura e volume, tronco/folhas coerentes."],
 ["adulta","Planta adulta sem fruto","Proporção final, visão elevada 3/4 do Apoena."],
 ["floracao","Flores","Flores sobre a planta; não mudar tronco/copa."],
 ["frutificando","Planta com frutos","Frutos ligados corretamente ao caule/tronco."],
 ["fruto_caido","Fruto individual caído","Fruto completo isolado, sem árvore."],
 ["murchando","Planta debilitada","Folhas murchas e sinais de seca ou solo pobre."],
 ["morta","Planta morta","Sem folhas, tronco/caule seco."],
 ["tronco_caido","Madeira caída","Tronco inteiro, separado da planta em pé."],
 ["decompondo","Madeira apodrecendo","Mesma madeira, menor, rachada, com decomposição."],
 ["po","Restos virando adubo","Etapa final de madeira que vira matéria orgânica."]
];
const MODELOS={
 bananeira:{nome:"Bananeira",propagacao:"rebentos",rebentos:3,agua:0.43,nutrientes:0.30,luz:0.36,temperaturaMin:18,temperaturaMax:36,maturidade:190,frutificacao:230,morte:285,decomposicao:90,cor:"#368f4c"},
 jabuticabeira:{nome:"Jabuticabeira",propagacao:"sementes",rebentos:0,agua:0.36,nutrientes:0.34,luz:0.40,temperaturaMin:14,temperaturaMax:34,maturidade:520,frutificacao:570,morte:1400,decomposicao:110,cor:"#3e7b48"},
 arvore:{nome:"Árvore brasileira",propagacao:"sementes",rebentos:0,agua:0.40,nutrientes:0.45,luz:0.40,temperaturaMin:15,temperaturaMax:34,maturidade:300,frutificacao:420,morte:1100,decomposicao:100,cor:"#4e9255"}
};
const e=(v)=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slug=(v)=>String(v).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"").slice(0,60)||"planta";
function baixar(blob,nome){const u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=nome;document.body.append(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(u)},600);}
function mount(dest){
 if(!dest||dest.querySelector("[data-natureza-editor]"))return;
 const nav=dest.querySelector("nav.apo-pixel-tabs");
 const main=dest.querySelector("main");
 if(!main)return;
 const painel=document.createElement("main");painel.className="apn-main";painel.hidden=true;painel.dataset.naturezaEditor="1";
 const botao=document.createElement("button");botao.type="button";botao.dataset.pixelTab="natureza";botao.textContent="🌿 Natureza / Plantas";
 botao.setAttribute("aria-selected","false");
 if(nav){nav.append(botao);main.after(painel)}else{
  const novo=document.createElement("nav");novo.className="apn-nav";novo.append(botao);
  const voltar=document.createElement("button");voltar.type="button";voltar.textContent="Personagens";novo.prepend(voltar);
  const header=dest.querySelector("header");if(header)header.after(novo);main.after(painel);
  voltar.onclick=()=>{painel.hidden=true;main.hidden=false;botao.setAttribute("aria-selected","false")};
 }
 const style=document.createElement("style");
 style.textContent=`.apn-main{max-width:1200px;margin:0 auto;padding:15px;display:grid;gap:13px;color:#f4f7ec}.apn-main[hidden]{display:none!important}.apn-card{padding:16px;background:#142b30;border:1px solid #496767;border-radius:12px}.apn-card h2{color:#efcd85;margin:0 0 12px;font-size:1.12rem}.apn-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:12px}.apn-main label{display:block;font-size:.83rem;color:#cee2df}.apn-main label span{display:block;margin-bottom:4px}.apn-main input,.apn-main select{background:#0a1924;color:#fff;border:1px solid #507075;border-radius:7px;padding:9px;min-height:42px;width:100%;font:inherit}.apn-main button,.apn-nav button{background:#8cdbe0;border:0;border-radius:8px;color:#102932;font-weight:700;padding:10px 12px;min-height:43px;cursor:pointer}.apn-main p,.apn-main small{color:#c4d8d5;line-height:1.45}.apn-main .apn-actions{display:flex;gap:8px;flex-wrap:wrap}.apn-actions button{flex:1 1 130px}.apn-stage{display:flex;gap:12px;padding:10px;border-bottom:1px solid #456068;align-items:center;flex-wrap:wrap}.apn-stage>div:first-child{flex:1 1 240px}.apn-stage strong{color:#f2dfac}.apn-stage img{max-height:95px;max-width:120px;object-fit:contain;image-rendering:pixelated;background:repeating-conic-gradient(#506678 0% 25%,#213545 0% 50%) 50% / 16px 16px;border:1px solid #6c818a}.apn-stage input{max-width:240px;min-width:180px;flex:1}.apn-warning{border-left:3px solid #edbd71;padding-left:10px;color:#ffe7ad!important}.apn-hint{font-size:12px}.apn-nav{display:flex;gap:8px;padding:8px;background:#122936}.apn-main output{white-space:pre-wrap;display:block;color:#a5ebc3}`;
 dest.append(style);
 const state={imagens:{},modelo:"bananeira"};
 painel.innerHTML=`<section class="apn-card"><h2>Biblioteca de natureza — Apoena Agar</h2><p>Você cria cada imagem. Este painel organiza a mesma espécie em etapas e exporta nomes e dados padronizados para o jogo. Não gera PNG por IA e não modifica as imagens.</p><p class="apn-warning">Arte: Pixel Art Apoena 2D, perspectiva 3/4 elevada, cores nítidas, fundo realmente transparente. Cada arquivo deve conter só uma peça e manter a base do tronco centralizada. Sem texto, sem quadros juntos.</p><div class="apn-grid"><label><span>Modelo</span><select id="apn-model"><option value="bananeira">Bananeira</option><option value="jabuticabeira">Jabuticabeira</option><option value="arvore">Árvore brasileira</option></select></label><label><span>ID da espécie (único)</span><input id="apn-id" value="bananeira"></label><label><span>Nome da planta</span><input id="apn-name" value="Bananeira"></label><label><span>Reprodução</span><select id="apn-repro"><option value="rebentos">Rebentos / mudas</option><option value="sementes">Sementes dos frutos</option></select></label><label><span>Nº de rebentos por ciclo</span><input type="number" id="apn-rebentos" min="0" max="6" value="3"></label></div></section>
 <section class="apn-card"><h2>Condições biológicas no jogo</h2><div class="apn-grid">
 <label><span>Umidade mínima (0–100%)</span><input type="number" id="apn-agua" min="0" max="100"></label>
 <label><span>Fertilidade mínima (0–100%)</span><input type="number" id="apn-nutrientes" min="0" max="100"></label>
 <label><span>Luz mínima (0–100%)</span><input type="number" id="apn-luz" min="0" max="100"></label>
 <label><span>Temperatura mínima (°C)</span><input type="number" id="apn-tmin" min="-10" max="50"></label>
 <label><span>Temperatura máxima (°C)</span><input type="number" id="apn-tmax" min="0" max="60"></label>
 <label><span>Idade adulta (dias do jogo)</span><input type="number" id="apn-madura" min="2" max="10000"></label>
 <label><span>Primeiro fruto (dias do jogo)</span><input type="number" id="apn-fruto" min="3" max="15000"></label>
 <label><span>Fim da vida (dias do jogo)</span><input type="number" id="apn-morte" min="4" max="20000"></label>
 <label><span>Decomposição do tronco (dias do jogo)</span><input type="number" id="apn-decomp" min="5" max="2000"></label></div><p class="apn-hint">Esses números são parâmetros de balanceamento do jogo, não medidas científicas. Se faltar água, nutrientes, luz ou temperatura adequada, o fruto pode falhar; estresse prolongado leva à morte e à decomposição.</p></section>
 <section class="apn-card"><h2>Imagens da mesma planta — importar PNG separado</h2><p>Cada fase exige um arquivo próprio. Não juntar 14 imagens numa folha única; o jogo decidirá quando trocar o sprite. Use o mesmo ângulo e alinhe a base ao centro inferior. Plantas adultas devem ser maiores do que mudas.</p><div id="apn-stages"></div></section>
 <section class="apn-card"><h2>Salvar ficha e arquivos para Godot / HTML</h2><p>Baixe a ficha JSON e, em cada fase, o PNG renomeado. Coloque tudo em <code>assets/natureza/ID_DA_PLANTA/</code>. O JSON contém caminhos, fases e propriedades; ele não incorpora os arquivos PNG automaticamente.</p><div class="apn-actions"><button id="apn-export">Baixar ficha JSON</button><button id="apn-prompt">Copiar guia visual</button><button id="apn-clear">Limpar imagens</button></div><output id="apn-status" aria-live="polite"></output></section>`;
 const $(id)=>painel.querySelector("#"+id);
 const inputNames={agua:"agua",nutrientes:"nutrientes",luz:"luz",tmin:"temperaturaMin",tmax:"temperaturaMax",madura:"maturidade",fruto:"frutificacao",morte:"morte",decomp:"decomposicao",rebentos:"rebentos"};
 function modeloInicial(id){const p=MODELOS[id]||MODELOS.arvore;state.modelo=id;$("apn-id").value=id;$("apn-name").value=p.nome;$("apn-repro").value=p.propagacao;for(const [field,key] of Object.entries(inputNames))$("apn-"+field).value=field==="agua"||field==="nutrientes"||field==="luz"?Math.round(p[key]*100):p[key];}
 function ficha(){
  const id=slug($("apn-id").value),r={};
  for(const [field,key] of Object.entries(inputNames)){const input=$("apn-"+field),v=Number(input.value);if(!input.value||!Number.isFinite(v)||v<Number(input.min)||v>Number(input.max))throw Error("Campo inválido: "+field);r[key]=v;}
  if(r.temperaturaMin>r.temperaturaMax||r.maturidade>=r.frutificacao||r.frutificacao>=r.morte)throw Error("A temperatura e as idades precisam estar em ordem: adulta < fruto < morte.");
  for(const k of ["agua","nutrientes","luz"])r[k]=r[k]/100;
  const fases={};
  for(const [key,descricao] of FASES){const img=state.imagens[key];fases[key]={arquivo:`assets/natureza/${id}/${id}_${key}.png`,largura:img?.w||null,altura:img?.h||null,transparente:img?.alpha??null,registrado:!!img,ancora:"centro_inferior",descricao};}
  return {schema:SCHEMA,version:1,game:"apoena-agar",id,nome:$("apn-name").value.trim()||id,especie:state.modelo,propagacao:$("apn-repro").value,regras:r,fases,observacoes:"Sprites independentes PNG com transparencia; sem interpolacao de tamanhos. Animações de decomposição podem usar quadros extras no futuro."};
 }
 const fases=$("apn-stages");
 for(const [key,label,instrucao] of FASES){
  const card=document.createElement("div");card.className="apn-stage";card.dataset.stage=key;
  card.innerHTML=`<div><strong>${e(label)}</strong><small style="display:block">${e(instrucao)}</small><small class="apn-hint" data-info>PNG pendente</small></div><input type="file" accept="image/png" aria-label="Importar PNG ${e(label)}"><img alt="Prévia ${e(label)}" hidden><button type="button" disabled>Baixar PNG</button>`;
  fases.append(card);
  const input=card.querySelector("input"),img=card.querySelector("img"),info=card.querySelector("[data-info]"),btn=card.querySelector("button");
  input.addEventListener("change",async()=>{
   const file=input.files?.[0];if(!file)return;
   if(file.type!=="image/png"&&!file.name.toLowerCase().endsWith(".png")){info.textContent="Somente PNG";return}
   if(file.size>12*1024*1024){info.textContent="Máximo 12 MB";return}
   const url=URL.createObjectURL(file),ref=new Image();ref.onload=()=>{
    const cv=document.createElement("canvas");cv.width=ref.width;cv.height=ref.height;
    if(ref.width>2048||ref.height>2048){info.textContent="Imagem maior que 2048 px; diminuir antes de usar.";URL.revokeObjectURL(url);return;}
    const cx=cv.getContext("2d",{willReadFrequently:true});cx.drawImage(ref,0,0);const pixels=cx.getImageData(0,0,cv.width,cv.height).data;
    let transpar=false;for(let i=3;i<pixels.length;i+=4)if(pixels[i]<250){transpar=true;break;}
    const prev=state.imagens[key];if(prev)URL.revokeObjectURL(prev.url);
    state.imagens[key]={file,url,w:ref.width,h:ref.height,alpha:transpar};img.src=url;img.hidden=false;btn.disabled=false;
    info.textContent=ref.width+"×"+ref.height+" px | "+(transpar?"transparência OK":"ATENÇÃO: fundo opaco");
    $("apn-status").value="Imagem registrada nesta sessão. Use Baixar PNG para salvar o nome padronizado.";
   };ref.onerror=()=>{info.textContent="PNG inválido";URL.revokeObjectURL(url)};ref.src=url;
  });
  btn.onclick=()=>{const file=state.imagens[key]?.file;if(!file)return;baixar(file,slug($("apn-id").value)+"_"+key+".png")};
 }
 $("apn-model").onchange=()=>modeloInicial($("apn-model").value);
 $("apn-export").onclick=()=>{try{const x=ficha();baixar(new Blob([JSON.stringify(x,null,2)],{type:"application/json"}),x.id+".natureza.json");$("apn-status").value="Ficha exportada. Fases sem PNG continuam marcadas como pendentes."}catch(err){$("apn-status").value=err.message}};
 $("apn-prompt").onclick=()=>{const x=ficha(),txt=`Apoena Agar: ${x.nome}, pixel art anime 2D, perspectiva 3/4 elevada, desenho simples nítido, cores consistentes, fundo PNG transparente, objeto único centralizado, base no centro inferior. Gerar fases SEPARADAS: ${FASES.map(f=>f[1]).join(", ")}. Mudas menores; adultos maiores; frutos e sementes isolados; decomposição em etapas. Não incluir texto nem cenário.`;if(navigator.clipboard?.writeText)navigator.clipboard.writeText(txt).then(()=>$("apn-status").value="Guia copiado.");else $("apn-status").value=txt;};
 $("apn-clear").onclick=()=>{for(const key of Object.keys(state.imagens))URL.revokeObjectURL(state.imagens[key].url);state.imagens={};for(const c of fases.children){c.querySelector("input").value="";c.querySelector("img").hidden=true;c.querySelector("button").disabled=true;c.querySelector("[data-info]").textContent="PNG pendente";}$("apn-status").value="Prévia de imagens limpa, sem alterar outras ferramentas."};
 modeloInicial("bananeira");
 const abrir=()=>{if(nav){for(const b of nav.querySelectorAll("button"))b.setAttribute("aria-selected",String(b===botao));}const near=main.parentNode;for(const child of near.children){if(child.tagName==="MAIN"&&child!==painel)child.hidden=true;}main.hidden=true;painel.hidden=false;try{history.replaceState(null,"","#natureza")}catch(_){}};
 botao.addEventListener("click",abrir);
 if(nav){nav.addEventListener("click",evt=>{if(evt.target.closest("[data-pixel-tab]")!==botao)painel.hidden=true},true);}
 if(location.hash==="#natureza")abrir();
}
root.ApoenaNaturezaEditor={mount,SCHEMA,FASES,MODELOS};
})(window);
