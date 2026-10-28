(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  root.ApoenaCatalogo=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const SCHEMA="apoena.gamecreator.catalogo.v1";
  const text=v=>typeof v==="string"?v.trim():"";
  const num=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
  const cleanId=v=>text(v);
  function detect(payload){
    if(!payload||typeof payload!=="object"||Array.isArray(payload))throw Error("JSON raiz inválido.");
    if(payload.schema==="apoena.central.v1"&&Array.isArray(payload.items)&&Array.isArray(payload.recipes))
      return {kind:"projeto completo",items:payload.items,recipes:payload.recipes,assets:Array.isArray(payload.assets)?payload.assets:[],name:text(payload.name)||"Projeto sem nome"};
    if(payload.schema===SCHEMA&&Array.isArray(payload.items)&&Array.isArray(payload.recipes))
      return {kind:"catálogo integrado",items:payload.items,recipes:payload.recipes,assets:Array.isArray(payload.assets)?payload.assets:[],name:text(payload.project)||"Projeto sem nome"};
    if(payload.schema==="apoena.items.v1"&&Array.isArray(payload.items))
      return {kind:"arquivo de itens",items:payload.items,recipes:[],assets:[],name:"Itens importados"};
    if(payload.schema==="apoena.recipes.v1"&&Array.isArray(payload.recipes))
      return {kind:"arquivo de receitas",items:[],recipes:payload.recipes,assets:[],name:"Receitas importadas"};
    throw Error("Formato não reconhecido. Importe APOENA_PROJETO_EDITAVEL.json ou um catálogo exportado pela Central.");
  }
  function examine(items,recipes,assets){
    const errors=[],warnings=[],byId=new Map(),assetIds=new Set();
    (Array.isArray(assets)?assets:[]).forEach(a=>{if(a&&cleanId(a.id))assetIds.add(cleanId(a.id))});
    for(let p=0;p<items.length;p++){
      const it=items[p];
      if(!it||typeof it!=="object"){errors.push("Item "+(p+1)+" não é um objeto.");continue}
      const id=cleanId(it.id);
      if(!id){errors.push("Item "+(p+1)+" sem ID.");continue}
      if(byId.has(id)){errors.push("ID de item duplicado: "+id);continue}
      byId.set(id,it);
      if(!text(it.name))warnings.push("Item "+id+" não tem nome.");
      if(it.iconId&&!assetIds.has(cleanId(it.iconId))&&assets.length)
        warnings.push("Ícone do item "+id+" não foi localizado na biblioteca.");
    }
    const recipeIds=new Set();
    for(let p=0;p<recipes.length;p++){
      const r=recipes[p];
      if(!r||typeof r!=="object"){errors.push("Receita "+(p+1)+" não é um objeto.");continue}
      const id=cleanId(r.id);
      if(!id){errors.push("Receita "+(p+1)+" sem ID.");continue}
      if(recipeIds.has(id))errors.push("ID de receita duplicado: "+id);
      recipeIds.add(id);
      if(!byId.has(cleanId(r.resultId)))errors.push("Receita "+id+": item produzido "+cleanId(r.resultId)+" não existe.");
      if(!Array.isArray(r.ingredients))errors.push("Receita "+id+": ingredientes inválidos.");
      else for(const x of r.ingredients){
        if(!x||typeof x!=="object"){errors.push("Receita "+id+": ingrediente malformado.");continue}
        if(!byId.has(cleanId(x.id)))errors.push("Receita "+id+": ingrediente "+cleanId(x.id)+" não existe.");
        if(!Number.isSafeInteger(Number(x.qty))||Number(x.qty)<1)errors.push("Receita "+id+": quantidade de ingrediente inválida.");
      }
      if(!Number.isSafeInteger(Number(r.quantity))||Number(r.quantity)<1)errors.push("Receita "+id+": quantidade produzida inválida.");
      if(num(r.gold)<0||num(r.seconds)<0)errors.push("Receita "+id+": preço ou tempo negativo.");
    }
    return {errors,warnings,items:items.length,recipes:recipes.length,assets:assets.length};
  }
  function portable(source,gameId){
    const data=detect(source);
    if(data.kind==="arquivo de itens"||data.kind==="arquivo de receitas")
      throw Error("Para integrar outro jogo, importe o projeto completo ou um catálogo contendo itens E receitas.");
    const report=examine(data.items,data.recipes,data.assets);
    if(report.errors.length)throw Error("Corrija os vínculos antes de exportar:\n"+report.errors.join("\n"));
    const target=cleanId(gameId)||"jogo-sem-nome";
    // Nunca modifica o original. A cópia do runtime não inclui imagens base64 gigantes.
    const items=data.items.map(i=>{
      const v=Object.assign({},i);
      delete v.icon_data;delete v.base64;delete v.data;
      return v;
    });
    const recipes=data.recipes.map(r=>Object.assign({},r,{
      ingredients:r.ingredients.map(x=>({id:cleanId(x.id),qty:Number(x.qty)}))
    }));
    const assets=data.assets.map(a=>({
      id:cleanId(a.id),name:text(a.name),file:text(a.file),category:text(a.category),
      source:text(a.source),has_embedded_image:typeof a.data==="string"&&a.data.startsWith("data:image/")
    }));
    return {schema:SCHEMA,version:1,project:data.name,game_id:target,items,recipes,assets};
  }
  function validateCatalog(c){
    if(!c||c.schema!==SCHEMA)throw Error("Catálogo com schema incorreto.");
    if(!Array.isArray(c.items)||!Array.isArray(c.recipes))throw Error("Catálogo sem lista de itens ou receitas.");
    const report=examine(c.items,c.recipes,Array.isArray(c.assets)?c.assets:[]);
    if(report.errors.length)throw Error(report.errors.join("\n"));
    return report;
  }
  // Pequena simulação isolada para testar o contrato antes de conectá-lo ao Godot.
  function createSession(c){validateCatalog(c);return {inventory:{},gold:0,hp:100,maxhp:100,aurium:100,maxaurium:100}}
  function collect(c,session,id,qty=1){
    validateCatalog(c);
    if(!c.items.some(x=>x.id===id))throw Error("Item inexistente: "+id);
    if(!Number.isSafeInteger(qty)||qty<=0)throw Error("Quantidade inválida.");
    session.inventory[id]=(session.inventory[id]||0)+qty;
    return session.inventory[id];
  }
  function craft(c,session,recipeId){
    validateCatalog(c);
    const recipe=c.recipes.find(x=>x.id===recipeId);
    if(!recipe)throw Error("Receita não encontrada: "+recipeId);
    const totals={};
    for(const x of recipe.ingredients)totals[x.id]=(totals[x.id]||0)+Number(x.qty);
    for(const [id,qty] of Object.entries(totals)){
      if((session.inventory[id]||0)<qty)throw Error("Falta ingrediente: "+id);
    }
    if((session.gold||0)<num(recipe.gold))throw Error("Ouro insuficiente.");
    for(const [id,qty] of Object.entries(totals))session.inventory[id]-=qty;
    session.gold-=num(recipe.gold);
    session.inventory[recipe.resultId]=(session.inventory[recipe.resultId]||0)+Number(recipe.quantity);
    return {item_id:recipe.resultId,quantity:Number(recipe.quantity)};
  }
  return Object.freeze({SCHEMA,detect,examine,portable,validateCatalog,createSession,collect,craft});
});