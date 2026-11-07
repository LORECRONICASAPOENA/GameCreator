(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  if(root)root.ApoenaWorldSystems=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const SCHEMA="apoena.world.systems.v1";
  const VERSION=1;
  const ALLOWED_PLACEMENT_RULES=["terrain","biome","collision","protected_area","ownership","distance_from_city"];
  const DEFAULT_SYSTEMS={
    schema:SCHEMA,version:VERSION,
    catalog:{itemDefinitions:"state.items",recipes:"state.recipes",assets:"state.assets"},
    inventory:{strategy:"reuse_existing_runtime",allowDuplicateInventory:false},
    gathering:{enabled:true,hostAuthoritative:true,outputsUseCatalogItemIds:true},
    crafting:{enabled:true,recipeSource:"state.recipes",consumeAtomically:true,requireAllIngredients:true,hostAuthoritative:true},
    construction:{enabled:true,hostAuthoritative:true,persistence:"host-local-save",allowFreePlacement:true,requireRecipeForStructures:true,placementRules:["terrain","biome","collision","protected_area","ownership"]},
    persistence:{offlineSolo:true,cooperativeAuthority:"host",simulateWhenHostClosed:false},
    resources:[],structures:[]
  };
  function isRecord(value){return value!==null&&typeof value==="object"&&!Array.isArray(value)}
  function text(value){return typeof value==="string"?value.trim():""}
  function canonicalId(value){return text(value).toLowerCase()}
  function clone(value){return JSON.parse(JSON.stringify(value))}
  function createDefaultWorldSystems(){return clone(DEFAULT_SYSTEMS)}
  function uniqueIds(entries,label,errors){
    const ids=new Set();
    entries.forEach((entry,index)=>{
      if(!isRecord(entry)||!text(entry.id)){
        errors.push(label+" "+(index+1)+" precisa ter um ID.");return
      }
      if(entry.id!==entry.id.trim())errors.push(label+" "+(index+1)+" tem ID com espaços nas extremidades.");
      const key=canonicalId(entry.id);
      if(ids.has(key))errors.push(label+" com ID duplicado: "+entry.id);
      ids.add(key);
    });
    return ids;
  }
  function indexCatalogEntries(entries,label,errors){
    const result=new Map();
    entries.forEach((entry,index)=>{
      if(!isRecord(entry)||!text(entry.id)){
        errors.push(label+" "+(index+1)+" precisa ser um objeto com ID.");return
      }
      const id=text(entry.id),key=canonicalId(id);
      if(result.has(key)){
        errors.push("ID duplicado no catálogo de "+label.toLowerCase()+": "+id);return
      }
      result.set(key,entry);
    });
    return result;
  }
  function validateCatalog(catalog,errors){
    if(!isRecord(catalog)||!Array.isArray(catalog.items)||!Array.isArray(catalog.recipes)){
      errors.push("Catálogo informado para validação é inválido.");return null
    }
    const supportedSchemas=["apoena.central.v1","apoena.gamecreator.catalogo.v1"];
    if(catalog.schema!==undefined&&!supportedSchemas.includes(catalog.schema))
      errors.push("Schema de catálogo não suportado: "+String(catalog.schema));
    const items=indexCatalogEntries(catalog.items,"itens",errors);
    const recipes=indexCatalogEntries(catalog.recipes,"receitas",errors);
    for(const [id,recipe] of recipes){
      if(!items.has(canonicalId(recipe.resultId)))
        errors.push("Receita "+text(recipe.id)+" produz item inexistente: "+text(recipe.resultId));
      if(!Array.isArray(recipe.ingredients)){
        errors.push("Receita "+text(recipe.id)+" possui ingredientes inválidos.");
      }else{
        recipe.ingredients.forEach((ingredient,index)=>{
          if(!isRecord(ingredient)||!items.has(canonicalId(ingredient.id)))
            errors.push("Receita "+text(recipe.id)+" possui ingrediente inválido na posição "+(index+1)+".");
          else if(!Number.isSafeInteger(Number(ingredient.qty))||Number(ingredient.qty)<1)
            errors.push("Receita "+text(recipe.id)+" possui quantidade de ingrediente inválida.");
        });
      }
      if(!Number.isSafeInteger(Number(recipe.quantity))||Number(recipe.quantity)<1)
        errors.push("Receita "+text(recipe.id)+" possui quantidade produzida inválida.");
    }
    return {items,recipes};
  }
  function validateWorldSystems(config,catalog){
    const errors=[],warnings=[];
    if(!isRecord(config))return {valid:false,errors:["Configuração de mundo inválida."],warnings};
    if(config.schema!==SCHEMA)errors.push("Schema de sistemas de mundo inválido.");
    if(config.version!==VERSION)errors.push("Versão de sistemas de mundo inválida.");
    if(!isRecord(config.catalog)||config.catalog.itemDefinitions!=="state.items"||
       config.catalog.recipes!=="state.recipes"||config.catalog.assets!=="state.assets")
      errors.push("Os sistemas devem reutilizar o catálogo existente de itens, receitas e assets.");
    if(!isRecord(config.inventory)||config.inventory.strategy!=="reuse_existing_runtime"||
       config.inventory.allowDuplicateInventory!==false)
      errors.push("Não é permitido criar um segundo inventário.");
    if(!isRecord(config.gathering)||typeof config.gathering.enabled!=="boolean"||
       config.gathering.hostAuthoritative!==true||config.gathering.outputsUseCatalogItemIds!==true)
      errors.push("Coleta deve usar IDs do catálogo e autoridade do anfitrião.");
    if(!isRecord(config.crafting)||typeof config.crafting.enabled!=="boolean"||
       config.crafting.recipeSource!=="state.recipes"||config.crafting.consumeAtomically!==true||
       config.crafting.requireAllIngredients!==true||config.crafting.hostAuthoritative!==true)
      errors.push("Crafting deve reutilizar receitas, consumir materiais atomicamente e usar autoridade do anfitrião.");
    if(!isRecord(config.construction)||typeof config.construction.enabled!=="boolean"||
       config.construction.persistence!=="host-local-save"||config.construction.hostAuthoritative!==true||
       typeof config.construction.allowFreePlacement!=="boolean"||
       typeof config.construction.requireRecipeForStructures!=="boolean")
      errors.push("Construção deve ser validada pelo anfitrião, ter persistência local e regras explícitas.");
    const rules=config.construction&&config.construction.placementRules;
    if(!Array.isArray(rules)||rules.length===0){
      errors.push("Regras de posicionamento precisam ser uma lista não vazia.");
    }else{
      const seen=new Set();
      for(const rule of rules){
        if(!ALLOWED_PLACEMENT_RULES.includes(rule))errors.push("Regra de posicionamento desconhecida: "+String(rule));
        if(seen.has(rule))errors.push("Regra de posicionamento duplicada: "+rule);
        seen.add(rule);
      }
    }
    if(!isRecord(config.persistence)||config.persistence.offlineSolo!==true||
       config.persistence.cooperativeAuthority!=="host"||config.persistence.simulateWhenHostClosed!==false)
      errors.push("Persistência deve permitir solo offline e não simular o mundo cooperativo quando o anfitrião estiver fechado.");
    const resources=Array.isArray(config.resources)?config.resources:[];
    const structures=Array.isArray(config.structures)?config.structures:[];
    if(!Array.isArray(config.resources))errors.push("resources precisa ser uma lista.");
    if(!Array.isArray(config.structures))errors.push("structures precisa ser uma lista.");
    uniqueIds(resources,"Recurso",errors);
    uniqueIds(structures,"Estrutura",errors);
    for(const resource of resources){
      if(!isRecord(resource))continue;
      if(!text(resource.itemId))errors.push("Recurso "+text(resource.id)+" precisa apontar para itemId.");
      if(resource.yieldQuantity!==undefined&&(!Number.isSafeInteger(resource.yieldQuantity)||resource.yieldQuantity<1))
        errors.push("Quantidade coletável inválida no recurso "+text(resource.id)+".");
    }
    const requireRecipe=!!(config.construction&&config.construction.requireRecipeForStructures);
    for(const structure of structures){
      if(!isRecord(structure))continue;
      if(!text(structure.name))errors.push("Estrutura "+text(structure.id)+" precisa ter nome.");
      if(requireRecipe&&!text(structure.recipeId))errors.push("Estrutura "+text(structure.id)+" precisa referenciar uma receita.");
      if(!requireRecipe&&structure.recipeId!==undefined&&structure.recipeId!==null&&!text(structure.recipeId))
        errors.push("recipeId inválido na estrutura "+text(structure.id)+".");
      const footprint=structure.footprint;
      if(!isRecord(footprint)||!Number.isSafeInteger(footprint.width)||footprint.width<1||
         !Number.isSafeInteger(footprint.height)||footprint.height<1)
        errors.push("Estrutura "+text(structure.id)+" precisa ter footprint com largura e altura positivas.");
      if(structure.placementRules!==undefined){
        if(!Array.isArray(structure.placementRules))
          errors.push("placementRules da estrutura "+text(structure.id)+" precisa ser uma lista.");
        else{
          const seen=new Set();
          for(const rule of structure.placementRules){
            if(!ALLOWED_PLACEMENT_RULES.includes(rule))
              errors.push("Regra de posicionamento desconhecida na estrutura "+text(structure.id)+": "+String(rule));
            if(seen.has(rule))errors.push("Regra de posicionamento duplicada na estrutura "+text(structure.id)+": "+rule);
            seen.add(rule);
          }
        }
      }
    }
    if(catalog!==undefined){
      const indexes=validateCatalog(catalog,errors);
      if(indexes){
        for(const resource of resources){
          if(isRecord(resource)&&text(resource.itemId)&&!indexes.items.has(canonicalId(resource.itemId)))
            errors.push("Recurso "+text(resource.id)+" aponta para item inexistente: "+text(resource.itemId));
        }
        for(const structure of structures){
          if(!isRecord(structure)||!text(structure.recipeId))continue;
          const recipe=indexes.recipes.get(canonicalId(structure.recipeId));
          if(!recipe)errors.push("Estrutura "+text(structure.id)+" aponta para receita inexistente: "+text(structure.recipeId));
          else if(!indexes.items.has(canonicalId(recipe.resultId)))
            errors.push("A receita da estrutura "+text(structure.id)+" produz item inexistente: "+text(recipe.resultId));
        }
      }
    }else if(resources.length||structures.length){
      warnings.push("As referências de recursos e estruturas só foram verificadas estruturalmente; valide-as contra o catálogo antes de exportar.");
    }
    return {valid:errors.length===0,errors,warnings};
  }
  return Object.freeze({
    SCHEMA,VERSION,ALLOWED_PLACEMENT_RULES:ALLOWED_PLACEMENT_RULES.slice(),
    createDefaultWorldSystems,validateWorldSystems
  });
});
