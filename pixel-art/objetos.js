(()=>{
"use strict";
const nav=document.createElement("nav");
nav.setAttribute("aria-label","Ferramentas Pixel Art do Game Creator");
nav.className="apo-pixel-tabs";
nav.innerHTML='<button type="button" data-pixel-tab="characters" aria-selected="true">◉ Personagens / Animações</button><button type="button" data-pixel-tab="objects" aria-selected="false">▧ Objetos / Funções / Clima</button>';
const main=document.querySelector("main");
if(!main)return;
const host=document.createElement("main");
host.className="apo-objects-main";
host.hidden=true;
const style=document.createElement("style");
style.textContent='.apo-pixel-tabs{display:flex;overflow-x:auto;gap:9px;padding:10px 14px;background:#10283b;border-bottom:1px solid #355064;white-space:nowrap}.apo-pixel-tabs button{background:#26495b;color:#f5f9ff;min-width:max-content}.apo-pixel-tabs button[aria-selected=true]{background:#f0d08e;color:#132433}.apo-objects-main[hidden],main[hidden]{display:none!important}.apo-objects-main{display:grid;gap:12px;max-width:1200px;margin:0 auto;padding:14px}.apoobj-top{display:flex;gap:8px;flex-wrap:wrap}.apoobj-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}.apoobj-pane{background:#17283a;border:1px solid #355064;border-radius:11px;padding:14px}.apoobj-pane h2{margin:0 0 12px;color:#f0d08e}.apoobj-pane label{display:block;font-size:13px;color:#c4d3df}.apoobj-pane input,.apoobj-pane select,.apoobj-pane textarea{width:100%;padding:10px;min-height:41px;border:1px solid #355064;border-radius:7px;background:#0d1b2b;color:#f3f8ff;font:inherit}.apoobj-pane textarea{min-height:78px}.apoobj-pane input[type=checkbox]{width:22px;min-height:22px}.apoobj-top button,.apoobj-pane button{min-height:43px;border-radius:8px;background:#8cdbe0;color:#0b1d25;padding:9px 12px;border:0;font-weight:700;cursor:pointer}.apoobj-pane button.alt{background:#294458;color:#f3f8ff}.apoobj-note{font-size:12px;color:#c4d3df;line-height:1.5}.apoobj-status{white-space:pre-wrap;color:#a3eabe;font-size:13px;min-height:18px}.apoobj-art{display:grid;grid-template-columns:minmax(128px,260px) minmax(140px,1fr);gap:14px}.apoobj-art canvas{width:100%;max-width:256px;aspect-ratio:1;background-color:#1b3345;background-image:linear-gradient(45deg,#29485b 25%,transparent 25%),linear-gradient(-45deg,#29485b 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#29485b 75%),linear-gradient(-45deg,transparent 75%,#29485b 75%);background-position:0 0,0 8px,8px -8px,-8px 0;background-size:16px 16px;image-rendering:pixelated;touch-action:none;border:1px solid #658092}.apoobj-conditions{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:9px}.apoobj-conditions fieldset{border:1px solid #45657a;border-radius:8px;min-width:0}.apoobj-conditions legend{color:#f0d08e}.apoobj-warning{border-left:3px solid #f0d08e;padding-left:10px;color:#f1e5c4}.apoobj-inline{display:flex;align-items:center;gap:9px;flex-wrap:wrap}.apoobj-inline>*{flex:1 1 140px}@media(max-width:550px){.apoobj-art{grid-template-columns:1fr}.apo-objects-main{padding:10px}}';
document.head.append(style);
document.querySelector("header").after(nav);
main.after(host);
host.innerHTML=
'<section class="apoobj-pane"><h2>Objetos Pixel Art • comportamento do mundo</h2><p class="apoobj-warning">Os objetos usam <strong>o mesmo item da Fábrica de Itens do Game Creator</strong>. Importe seu projeto editável v4.0, escolha um item e configure o comportamento. Ao salvar, exporte novamente o projeto para reabri-lo no Game Creator. Os efeitos no mundo exigem conexão com o jogo.</p><div class="apoobj-top"><label class="button secondary">Importar projeto v4.0 (.json)<input type="file" id="apoobj-import" accept=".json,application/json" hidden></label><button type="button" id="apoobj-save-project">Baixar projeto atualizado</button><button type="button" class="alt" id="apoobj-new">Novo item</button></div><p id="apoobj-info" class="apoobj-note">Nenhum projeto completo carregado. É possível rascunhar um objeto e exportar a ficha; para reintegrar ao Creator, importe o projeto primeiro.</p></section>'+
'<section class="apoobj-pane"><h2>1 • Item e função do objeto</h2><div class="apoobj-row"><label>Buscar item<input id="apoobj-search" placeholder="Nome ou ID"></label><label>Item do catálogo<select id="apoobj-list"><option value="">Novo objeto</option></select></label><label>ID do item<input id="apoobj-id" placeholder="ex.: tronco_madeira"></label><label>Nome<input id="apoobj-name" placeholder="ex.: Tronco de coqueiro"></label><label>Categoria<select id="apoobj-category"><option value="material">Material / ingrediente</option><option value="arma">Arma</option><option value="escudo">Escudo</option><option value="armadura">Armadura</option><option value="acessorio">Acessório</option><option value="pocao">Poção</option><option value="alimento">Alimento</option><option value="cristal">Cristal</option><option value="outro">Outro</option></select></label><label>Uso no mundo<select id="apoobj-kind"><option value="objeto">Objeto interativo</option><option value="planta">Planta / árvore</option><option value="recurso">Recurso coletável</option><option value="estrutura">Estrutura / construção</option><option value="equipamento">Equipamento</option><option value="obstaculo">Obstáculo</option></select></label><label>Ação ao interagir<select id="apoobj-interact"><option value="coletar">Coletar</option><option value="usar">Usar</option><option value="equipar">Equipar</option><option value="abrir">Abrir</option><option value="atacar">Atacar</option><option value="nenhuma">Nenhuma</option></select></label><label>Descrição<textarea id="apoobj-description" placeholder="O que o objeto faz no universo Apoena?"></textarea></label></div><div class="apoobj-row"><label>Vida / resistência<input id="apoobj-hp" type="number" min="0" value="100"></label><label>Ataque<input id="apoobj-attack" type="number" min="0" value="0"></label><label>Defesa<input id="apoobj-defense" type="number" min="0" value="0"></label><label>Durabilidade<input id="apoobj-durability" type="number" min="0" value="100"></label><label>Valor na loja<input id="apoobj-price" type="number" min="0" value="0"></label><label>Limite por pilha<input id="apoobj-stack" type="number" min="1" value="99"></label><label>Efeito original<select id="apoobj-effect"><option value="nenhum">Nenhum</option><option value="dano_fixo">Dano fixo</option><option value="restaurar_hp_fixo">Curar HP fixo</option><option value="restaurar_hp_percentual">Curar % HP</option><option value="restaurar_aurium_percentual">Curar % Aurium</option><option value="bonus_ataque_percentual">Bônus de ataque</option><option value="bonus_defesa_percentual">Bônus de defesa</option><option value="escudo_temporario">Escudo temporário</option><option value="veneno_periodico">Veneno periódico</option><option value="customizado">Personalizado</option></select></label><label>Intensidade do efeito<input id="apoobj-effect-value" type="number" value="0" step="0.1"></label><label>Duração do efeito (s)<input id="apoobj-effect-duration" type="number" value="0" min="0"></label></div><div class="apoobj-inline"><label><input id="apoobj-collision" type="checkbox" checked> Possui colisão</label><label><input id="apoobj-collect" type="checkbox" checked> Pode ser coletado</label><label><input id="apoobj-breakable" type="checkbox"> Pode ser quebrado / destruído</label></div></section>'+
'<section class="apoobj-pane"><h2>2 • Reação ao ambiente</h2><p class="apoobj-note">Defina uma reação para cada condição. A intensidade é um parâmetro salvo no cadastro. A simulação abaixo mostra um resultado de exemplo; o clima do jogo precisa interpretar essas regras.</p><div class="apoobj-conditions" id="apoobj-weather"></div><div class="apoobj-inline" style="margin-top:10px"><label>Testar condição<select id="apoobj-preview-weather"></select></label><button type="button" class="alt" id="apoobj-test-weather">Simular reação</button></div><p id="apoobj-weather-result" class="apoobj-status"></p></section>'+
'<section class="apoobj-pane"><h2>3 • Arte Pixel Art, recorte e transparência</h2><p class="apoobj-note">Importe um PNG/WebP, retire o fundo externo semelhante à cor do canto, apague sobras com toque ou mouse e exporte um PNG transparente 64 × 64. O recorte de margens transparentes mantém o objeto inteiro e centralizado.</p><div class="apoobj-art"><canvas id="apoobj-canvas" width="64" height="64" aria-label="Imagem transparente do objeto, editável por toque"></canvas><div><label>Importar imagem<input id="apoobj-image" type="file" accept="image/png,image/webp,image/jpeg"></label><div class="apoobj-inline"><button type="button" id="apoobj-trim" class="alt">Cortar bordas transparentes</button><button type="button" id="apoobj-transparent" class="alt">Remover fundo externo</button></div><label>Tolerância do fundo (0–100)<input id="apoobj-tolerance" type="range" min="0" max="100" value="20"></label><label><input id="apoobj-eraser" type="checkbox"> Ativar borracha (toque para apagar)</label><label>Raio da borracha<input id="apoobj-radius" type="range" min="1" max="18" value="5"></label><div class="apoobj-inline"><button type="button" class="alt" id="apoobj-clear">Limpar imagem</button><button type="button" id="apoobj-export-png">Exportar PNG transparente</button></div></div></div></section>'+
'<section class="apoobj-pane"><div class="apoobj-top"><button type="button" id="apoobj-save-item">Gravar objeto no catálogo carregado</button><button type="button" id="apoobj-export-json" class="alt">Exportar ficha JSON do objeto</button></div><p id="apoobj-status" class="apoobj-status" role="status" aria-live="polite"></p><p class="apoobj-warning">O botão "Gravar" atualiza o projeto <strong>em memória</strong>. Para continuar no outro dispositivo ou reabrir no Creator, use "Baixar projeto atualizado" antes de sair desta página. A v4.0 preserva os campos novos no JSON; executar o comportamento no jogo exige um adaptador.</p></section>';
const $=id=>host.querySelector("#"+id);
const conditions=[["rain","Chuva"],["sun","Sol"],["wind","Vento"],["cold","Frio"],["storm","Tempestade"]];
const actions=[["nenhum","Sem reação"],["molhar","Molhar"],["crescer","Crescer"],["secar","Secar"],["apodrecer","Apodrecer"],["enferrujar","Enferrujar"],["queimar","Queimar"],["perder_vida","Perder vida"],["ganhar_vida","Recuperar vida"],["bonus_ataque","Aumentar ataque"],["bonus_defesa","Aumentar defesa"],["produzir","Produzir recurso"]];
for(const [key,name] of conditions){
 const fs=document.createElement("fieldset");fs.innerHTML='<legend>'+name+'</legend><label>Reação<select data-weather="'+key+'">'+actions.map(x=>'<option value="'+x[0]+'">'+x[1]+'</option>').join("")+'</select></label><label>Intensidade por ciclo<input type="number" data-power="'+key+'" min="0" step="0.1" value="0"></label>';
 $("apoobj-weather").append(fs);
 $("apoobj-preview-weather").add(new Option(name,key));
}
let project=null,currentOriginalId="",spriteChanged=false;
const can=$("apoobj-canvas"),ctx=can.getContext("2d",{willReadFrequently:true});
ctx.imageSmoothingEnabled=false;
const num=(id,d=0)=>{const n=Number($(id).value);return Number.isFinite(n)?n:d};
const val=id=>$(id).value.trim();
const set=(id,v)=>{$(id).value=v??""};
const status=(s,bad=false)=>{$("apoobj-status").textContent=s;$("apoobj-status").style.color=bad?"#ffbeb8":"#a3eabe"};
const slug=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"").slice(0,55);
const download=(data,name,type)=>{const url=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),8000)};
function clearForm(){
 currentOriginalId="";for(const id of ["apoobj-id","apoobj-name","apoobj-description"])set(id,"");
 for(const id of ["apoobj-hp","apoobj-durability"])set(id,100);
 for(const id of ["apoobj-attack","apoobj-defense","apoobj-price","apoobj-effect-value","apoobj-effect-duration"])set(id,0);
 set("apoobj-stack",99);set("apoobj-category","material");set("apoobj-kind","objeto");set("apoobj-interact","coletar");set("apoobj-effect","nenhum");
 $("apoobj-collision").checked=true;$("apoobj-collect").checked=true;$("apoobj-breakable").checked=false;
 for(const [key] of conditions){host.querySelector('[data-weather="'+key+'"]').value="nenhum";host.querySelector('[data-power="'+key+'"]').value=0}
 ctx.clearRect(0,0,64,64);spriteChanged=false;status("Novo objeto. Cadastre o ID e o nome.");
}
function itemList(){
 const select=$("apoobj-list"),search=val("apoobj-search").toLowerCase(),selected=currentOriginalId;
 select.replaceChildren(new Option("Novo objeto",""));
 if(project)for(const item of project.items){
  if(!item||typeof item.id!=="string")continue;
  if(search&&!String(item.name+" "+item.id).toLowerCase().includes(search))continue;
  select.add(new Option((item.name||item.id)+" • "+item.id,item.id));
 }
 if([...select.options].some(o=>o.value===selected))select.value=selected;
}
function loadItem(id){
 const i=project?.items.find(x=>x.id===id);
 if(!i)return clearForm();
 currentOriginalId=i.id;set("apoobj-id",i.id);set("apoobj-name",i.name);set("apoobj-description",i.description);
 set("apoobj-category",i.category||"material");set("apoobj-price",i.price||0);set("apoobj-stack",i.maxStack||99);
 const w=i.worldBehavior||{};
 set("apoobj-kind",w.kind||"objeto");set("apoobj-interact",w.interact||"coletar");
 set("apoobj-hp",w.hp??100);set("apoobj-attack",w.attack??0);set("apoobj-defense",w.defense??0);set("apoobj-durability",w.durability??100);
 $("apoobj-collision").checked=w.collision??true;$("apoobj-collect").checked=w.collectable??true;$("apoobj-breakable").checked=w.breakable??false;
 set("apoobj-effect",i.effect?.type||"nenhum");set("apoobj-effect-value",i.effect?.value??0);set("apoobj-effect-duration",i.effect?.duration??0);
 for(const [key] of conditions){host.querySelector('[data-weather="'+key+'"]').value=w.weather?.[key]?.action||"nenhum";host.querySelector('[data-power="'+key+'"]').value=w.weather?.[key]?.power??0}
 ctx.clearRect(0,0,64,64);
 const a=project.assets.find(x=>x?.id===i.iconId);
 if(a&&typeof a.data==="string"){
  const img=new Image();
  img.onload=()=>{if(currentOriginalId===i.id&&!spriteChanged){ctx.imageSmoothingEnabled=false;drawFit(img)}};
  img.src=a.data;
 }
 spriteChanged=false;status("Item carregado: "+i.name+" ("+i.id+").");
}
function drawFit(img){
 ctx.clearRect(0,0,64,64);
 const scale=Math.min(60/img.width,60/img.height);
 const dw=Math.max(1,Math.round(img.width*scale)),dh=Math.max(1,Math.round(img.height*scale));
 ctx.drawImage(img,Math.round((64-dw)/2),Math.round((64-dh)/2),dw,dh);
}
function build(){
 const id=slug(val("apoobj-id")||val("apoobj-name")),name=val("apoobj-name");
 if(!id||!name)throw Error("Informe nome e ID do objeto.");
 const current=project?.items.find(x=>x.id===currentOriginalId);
 if(project&&project.items.some(x=>x.id===id&&x!==current))throw Error("Já existe outro item com esse ID.");
 const effect={...(current?.effect||{}),type:val("apoobj-effect"),value:num("apoobj-effect-value"),duration:Math.max(0,num("apoobj-effect-duration"))};
 const weather={};
 for(const [key] of conditions)weather[key]={action:host.querySelector('[data-weather="'+key+'"]').value,power:Math.max(0,Number(host.querySelector('[data-power="'+key+'"]').value)||0)};
 const worldBehavior={...(current?.worldBehavior||{}),schema:"apoena.world.object.v1",kind:val("apoobj-kind"),interact:val("apoobj-interact"),hp:Math.max(0,num("apoobj-hp")),attack:Math.max(0,num("apoobj-attack")),defense:Math.max(0,num("apoobj-defense")),durability:Math.max(0,num("apoobj-durability")),collision:$("apoobj-collision").checked,collectable:$("apoobj-collect").checked,breakable:$("apoobj-breakable").checked,weather};
 return {...(current||{rarity:"comum",visibility:{inventory:true,lab:true,store:false,forge:false,crystal:false,available:true},gameplayEnabled:false,status:"rascunho"}),id,name,category:val("apoobj-category"),description:val("apoobj-description"),price:Math.max(0,num("apoobj-price")),maxStack:Math.max(1,Math.round(num("apoobj-stack",99))),effect,worldBehavior};
}
function save(){
 const item=build();
 if(!project)throw Error("Importe seu projeto editável v4.0 antes de gravar no catálogo. Você pode exportar uma ficha de rascunho sem importar.");
 const previous=project.items.findIndex(x=>x.id===currentOriginalId);
 if(spriteChanged){
  const assetId="pixelobj_"+item.id;
  const asset={id:assetId,name:item.name,file:assetId+".png",source:"pixel-art-objetos",category:item.category,data:can.toDataURL("image/png")};
  const oldIndex=project.assets.findIndex(x=>x?.id===assetId);
  if(oldIndex>=0)project.assets[oldIndex]=asset;else project.assets.push(asset);
  item.iconId=assetId;item.worldBehavior.spriteAssetId=assetId;
 }
 if(previous>=0)project.items[previous]=item;else project.items.push(item);
 currentOriginalId=item.id;spriteChanged=false;itemList();$("apoobj-list").value=item.id;
 status("Objeto gravado no projeto: "+item.name+". Agora baixe o JSON atualizado para não perder.");
 return item;
}
function validateProject(x){
 if(!x||x.schema!=="apoena.central.v1"||!Array.isArray(x.items)||!Array.isArray(x.recipes)||!Array.isArray(x.assets)||!x.screens||typeof x.screens!=="object")
  throw Error("Importe o JSON completo salvo pelo botão 'Salvar projeto editável' do Game Creator, não somente o catálogo leve de itens.");
 if(x.items.length>10000||x.assets.length>5000)throw Error("Arquivo com quantidade de registros excessiva.");
 const ids=new Set();for(const i of x.items){if(!i||typeof i.id!=="string"||!i.id||ids.has(i.id))throw Error("Item com ID vazio ou duplicado.");ids.add(i.id)}
 return x;
}
function rgbDistance(data,i,r,g,b){return Math.hypot(data[i]-r,data[i+1]-g,data[i+2]-b)}
function trim(){
 const d=ctx.getImageData(0,0,64,64),p=d.data;let x0=64,y0=64,x1=-1,y1=-1;
 for(let y=0;y<64;y++)for(let x=0;x<64;x++)if(p[(y*64+x)*4+3]>8){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}
 if(x1<0){status("Não há pixels para recortar.",true);return}
 const t=document.createElement("canvas");t.width=x1-x0+1;t.height=y1-y0+1;t.getContext("2d").putImageData(d,-x0,-y0);
 drawFit(t);spriteChanged=true;status("Margens transparentes recortadas. Objeto centralizado.");
}
function removeEdgeBackground(){
 const d=ctx.getImageData(0,0,64,64),p=d.data;
 const corner=[p[0],p[1],p[2]];const threshold=Number($("apoobj-tolerance").value)*2.3;
 const visited=new Uint8Array(4096),queue=[];
 for(let x=0;x<64;x++){queue.push(x,4032+x)}
 for(let y=0;y<64;y++){queue.push(y*64,y*64+63)}
 for(let head=0;head<queue.length;head++){
  const n=queue[head];if(n<0||n>=4096||visited[n])continue;visited[n]=1;
  const off=n*4;if(p[off+3]===0)continue;
  if(rgbDistance(p,off,...corner)>threshold)continue;
  p[off+3]=0;
  const x=n%64,y=Math.floor(n/64);
  if(x>0)queue.push(n-1);if(x<63)queue.push(n+1);if(y>0)queue.push(n-64);if(y<63)queue.push(n+64);
 }
 ctx.putImageData(d,0,0);spriteChanged=true;status("Fundo externo removido. Confira a transparência na prévia.");
}
$("apoobj-import").addEventListener("change",async e=>{
 const file=e.target.files?.[0];if(!file)return;
 try{
  if(file.size>40e6)throw Error("Projeto acima de 40 MB. Exporte um projeto menor.");
  const obj=validateProject(JSON.parse(await file.text()));
  project=obj;clearForm();itemList();
  $("apoobj-info").textContent="Projeto: "+(project.name||"Sem nome")+" • "+project.items.length+" itens, "+project.recipes.length+" receitas. As receitas existentes serão preservadas.";
  status("Projeto completo importado. Escolha um item para editar ou crie um novo.");
 }catch(err){status("Falha ao importar: "+err.message,true)}
 e.target.value="";
});
$("apoobj-list").addEventListener("change",e=>e.target.value?loadItem(e.target.value):clearForm());
$("apoobj-search").addEventListener("input",itemList);
$("apoobj-new").addEventListener("click",()=>{clearForm();$("apoobj-list").value=""});
$("apoobj-save-item").addEventListener("click",()=>{try{save()}catch(e){status(e.message,true)}});
$("apoobj-save-project").addEventListener("click",()=>{
 try{
  if(!project)throw Error("Importe o projeto primeiro.");
  // Também grava as edições visíveis antes do download.
  save();
  download(JSON.stringify(project),"APOENA_PROJETO_EDITAVEL_OBJETOS.json","application/json");
  status("Projeto completo baixado, incluindo itens, receitas e imagens. Reabra no Game Creator v4.0.");
 }catch(e){status(e.message,true)}
});
$("apoobj-export-json").addEventListener("click",()=>{
 try{
  const i=build();download(JSON.stringify({schema:"apoena.pixel.objeto.v1",version:1,item:i},null,2),i.id+".json","application/json");
  status("Ficha do objeto exportada. Para integração no banco oficial, importe o projeto completo.");
 }catch(e){status(e.message,true)}
});
$("apoobj-image").addEventListener("change",e=>{
 const file=e.target.files?.[0];if(!file)return;
 if(file.size>8e6){status("Imagem grande demais. Máximo 8 MB.",true);return}
 const url=URL.createObjectURL(file),img=new Image();
 img.onload=()=>{drawFit(img);spriteChanged=true;URL.revokeObjectURL(url);status("Imagem importada. Confira corte e transparência antes de gravar o objeto.");};
 img.onerror=()=>{URL.revokeObjectURL(url);status("Não foi possível carregar a imagem.",true)};
 img.src=url;e.target.value="";
});
$("apoobj-trim").addEventListener("click",trim);
$("apoobj-transparent").addEventListener("click",removeEdgeBackground);
$("apoobj-clear").addEventListener("click",()=>{ctx.clearRect(0,0,64,64);spriteChanged=true;status("Imagem apagada.")});
$("apoobj-export-png").addEventListener("click",()=>can.toBlob(b=>{if(b)download(b,slug(val("apoobj-id")||"objeto")+".png","image/png")},"image/png"));
let erasing=false;
function erase(e){
 if(!$("apoobj-eraser").checked||!erasing)return;
 e.preventDefault();
 const r=can.getBoundingClientRect(),x=(e.clientX-r.left)*64/r.width,y=(e.clientY-r.top)*64/r.height;
 ctx.save();ctx.globalCompositeOperation="destination-out";ctx.beginPath();ctx.arc(x,y,Number($("apoobj-radius").value),0,2*Math.PI);ctx.fill();ctx.restore();spriteChanged=true;
}
can.addEventListener("pointerdown",e=>{if(!$("apoobj-eraser").checked)return;erasing=true;can.setPointerCapture(e.pointerId);erase(e)});
can.addEventListener("pointermove",erase);
can.addEventListener("pointerup",()=>{erasing=false});
can.addEventListener("pointercancel",()=>{erasing=false});
$("apoobj-test-weather").addEventListener("click",()=>{
 const key=val("apoobj-preview-weather"),action=host.querySelector('[data-weather="'+key+'"]').value;
 const power=Math.max(0,Number(host.querySelector('[data-power="'+key+'"]').value)||0);
 const label=actions.find(x=>x[0]===action)?.[1]||action;
 $("apoobj-weather-result").textContent=action==="nenhum"?"Sem reação definida para esta condição.":"Simulação de regra: "+label+" (intensidade "+power+" por ciclo). Isso é uma prévia de dados, não a física real do jogo.";
});
for(const btn of nav.querySelectorAll("button")){
 btn.addEventListener("click",()=>{
  const isObject=btn.dataset.pixelTab==="objects";
  for(const x of nav.querySelectorAll("button"))x.setAttribute("aria-selected",String(x===btn));
  main.hidden=isObject;host.hidden=!isObject;
  try{history.replaceState(null,"",isObject?"#objetos":"#personagens")}catch(_){}
 });
}
clearForm();
if(location.hash==="#objetos")nav.querySelector('[data-pixel-tab="objects"]').click();
})();