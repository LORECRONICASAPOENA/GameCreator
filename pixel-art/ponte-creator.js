/* APOENA Game Creator v4.0 — Pixel Art nativo, um projeto/um catálogo.
   Executar após os scripts originais da v4.0. */
(function(){
"use strict";
if(typeof state==="undefined"||typeof switchPage!=="function"){
 console.error("Pixel Art integrado: estado principal da v4.0 não foi carregado.");
 return;
}
const root=document.getElementById("page-pixelart");
const host=document.getElementById("gc40PixelRoot");
if(!root||!host){console.error("Aba Pixel Art não encontrada no editor.");return}
const nav=document.querySelector('nav.tabs');
const nativeButton=nav?.querySelector('[data-page="pixelart"]');
const quick=document.createElement("button");
quick.id="apoenaQuickPixel";
quick.type="button";quick.textContent="▧ Pixel Art";
quick.className="v37-quick-pixel";
quick.style.cssText="background:#8cdbe0;color:#112436;border:1px solid #acdce8;border-radius:8px;padding:9px 14px;font-weight:800;min-height:43px;cursor:pointer;white-space:nowrap";
const quickNav=document.getElementById("v37Nav");
if(quickNav)quickNav.append(quick);
let ready=false;
function mount(){
 if(ready)return;
 if(typeof window.ApoenaPixelIntegrado?.mount!=="function"){
  host.textContent="Módulo Pixel Art ausente. Confirme a pasta pixel-art/ ao lado do index.html.";
  return;
 }
 window.ApoenaPixelIntegrado.mount(host);
 ready=true;
}
function open(){
 mount();
 switchPage("pixelart");
 try{location.hash="pixelart"}catch(_){}
 if(document.getElementById("v37AdvancedNav")?.open)document.getElementById("v37AdvancedNav").open=false;
}
quick.addEventListener("click",open);
if(nativeButton)nativeButton.addEventListener("click",()=>mount());
const refresh=()=>{
 for(const fn of ["renderItems","renderRecipes","renderDatabase","refreshAssetLists","creatorRenderHome"]){
  try{
   if(fn==="renderItems"&&typeof renderItems==="function")renderItems();
   if(fn==="renderRecipes"&&typeof renderRecipes==="function")renderRecipes();
   if(fn==="renderDatabase"&&typeof renderDatabase==="function")renderDatabase();
   if(fn==="refreshAssetLists"&&typeof refreshAssetLists==="function")refreshAssetLists();
   if(fn==="creatorRenderHome"&&typeof creatorRenderHome==="function")creatorRenderHome();
  }catch(e){console.warn("Atualização de painel "+fn+":",e)}
 }
};
const slug=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"").slice(0,48);
const deepCopy=x=>JSON.parse(JSON.stringify(x));
function addOrUpdateAsset(asset){
 if(!Array.isArray(state.assets))state.assets=[];
 const at=state.assets.findIndex(x=>x&&x.id===asset.id);
 if(at>=0)state.assets[at]=asset;else state.assets.push(asset);
}
function savePixelCharacter(manifest,png){
 if(!manifest||manifest.schema!=="apoena-pixel-v1"||typeof manifest.character?.nome!=="string")throw Error("Ficha Pixel Art inválida.");
 if(typeof png!=="string"||!png.startsWith("data:image/png;base64,"))throw Error("Spritesheet PNG inválido.");
 if(!Array.isArray(state.characters))state.characters=[];
 const data=manifest.character,id=slug(data.nome);
 if(!id)throw Error("O personagem precisa ter um nome.");
 const assetId="sprite_personagem_"+id,prev=state.characters.find(x=>x.id===id);
 addOrUpdateAsset({id:assetId,name:"Pixel Art de "+data.nome,file:assetId+".png",category:"personagem",source:"pixel-art-v1",data:png});
 const rec={
  ...(prev||{classe:"aventureiro",nivel:1,hp:100,aurium:100,ataque:0,defesa:0,equipamento:{}}),
  id,name:data.nome,retratoId:assetId,
  pixelArt:{...deepCopy(manifest),spriteAssetId:assetId},
  spriteAssetId:assetId
 };
 if(prev)Object.assign(prev,rec);else state.characters.push(rec);
 refresh();
 return rec;
}
function saveMap(map){
 if(!map||map.schema!=="apoena.map2d.v1"||!Array.isArray(map.tiles)||!Number.isInteger(map.width)||!Number.isInteger(map.height))
  throw Error("Mapa Pixel Art incompatível.");
 if(map.width*map.height!==map.tiles.length)throw Error("Grade do mapa não corresponde ao tamanho.");
 if(!Array.isArray(state.pixelArtMaps))state.pixelArtMaps=[];
 const name=String(map.name||"Mapa Pixel Art").trim(),id=slug(name);
 const idx=state.pixelArtMaps.findIndex(x=>x.id===id);
 const item={id,name,schema:"apoena.map2d.v1",project:deepCopy(map)};
 if(idx>=0)state.pixelArtMaps[idx]=item;else state.pixelArtMaps.push(item);
 return item;
}
window.ApoenaCreatorIntegrated=Object.freeze({
 version:"4.0.pixel-art.1",
 getProject:()=>state,
 refresh,
 savePixelCharacter,
 saveMap,
 open,
 getItem:id=>state.items?.find(x=>x.id===id)||null
});
// Um link contextual dentro do painel central; não cria uma segunda página inicial.
const panel=document.getElementById("page-creator");
if(panel&&!panel.querySelector("#gc40GoPixel")){
 const b=document.createElement("button");b.id="gc40GoPixel";b.textContent="▧ Criar Pixel Art de personagens, objetos e mapas";b.type="button";
 b.className="primary";b.addEventListener("click",open);
 const toolbar=panel.querySelector(".row");(toolbar||panel).append(b);
}
if(location.hash==="#pixelart")queueMicrotask(open);
})();