(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  root.ApoenaWorldSystems=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const SCHEMA="apoena.world.systems.v1";
  const clone=value=>JSON.parse(JSON.stringify(value));
  const text=value=>typeof value==="string"?value.trim():"";
  const ALLOWED_PLACEMENT_RULES=["terrain","biome","collision","protected_area","ownership","distance_from_city"];
  const DEFAULT_SYSTEMS={
    schema:SCHEMA,
    version:1,
    catalog:{itemDefinitions:"state.items",recipes:"state.recipes",assets:"state.assets"},
    inventory:{strategy:"reuse_existing_runtime",allowDuplicateInventory:false},
    gathering:{enabled:true,hostAuthoritative:true,outputsUseCatalogItemIds:true},
    crafting:{enabled:true,recipeSource:"state.recipes",consumeAtomically:true,requireAllIngredients:true,hostAuthoritative:true},
    construction:{enabled:true,hostAuthoritative:true,persistence:"host-local-save",allowFreePlacement:true,requireRecipeForStructures:true,placementRules:["terrain","biome","collision","protected_area","ownership"]},
    persistence:{offlineSolo:true,cooperativeAuthority:"host",simulateWhenHostClosed:false},
    resources:[],
    structures:[]
  };
  function createDefaultWorldSystems(){return clone(DEFAULT_SYSTEMS)}
  function uniqueIds(entries,label,errors){
    const ids=new Set();
    entries.forEach((entry,index)=>{
      if(!entry||typeof entry!=="object"||!text(entry.id)){
        errors.push(label+" "+(index+1)+" precisa ter um ID.");
        return;
      }
      if(ids.has(entry.id))errors.push(label+" com ID duplicado: "+entry.id);
      ids.add(entry.id);
    });
    return ids;
  }
  function validateWorldSystems(config,catalog){
    const errors=[],warnings=[];
    if(!config||typeof config!=="object"||Array.isArray(config))return {valid:false,errors:["Configuração de mundo inválida."],warnings};
    if(config.schema!==SCHEMA)errors.push("Schema de sistemas de mundo inválido.");
    if(!config.catalog||config.catalog.itemDefinitions!=="state.items"||config.catalog.recipes!=="state.recipes"||config.catalog.assets!=="state.assets")
      errors.push("Os sistemas devem reutilizar o catálogo existente de itens, receitas e assets.");
    if(!config.inventory||config.inventory.strategy!=="reuse_existing_runtime"||config.inventory.allowDuplicateInventory!==false)
      errors.push("Não é permitido criar um segundo inventário.");
    if(!config.gathering||config.gathering.outputsUseCatalogItemIds!==true)
      errors.push("A coleta deve produzir IDs do catálogo existente.");
    if(!config.crafting||config.crafting.recipeSource!=="state.recipes"||config.crafting.consumeAtomically!==true||config.crafting.requireAllIngredients!==true)
      errors.push("Crafting deve reutilizar receitas existentes e consumir materiais atomicamente.");
    if(!config.construction||config.construction.persistence!=="host-local-save"||config.construction.hostAuthoritative!==true)
      errors.push("Construções cooperativas devem ser validadas pelo anfitrião e persistidas no save local dele.");
    const rules=config.construction&&config.construction.placementRules;
    if(!Array.isArray(rules))errors.push("Regras de posicionamento precisam ser uma lista.");
    else for(const rule of rules)if(!ALLOWED_PLACEMENT_RULES.includes(rule))errors.push("Regra de posicionamento desconhecida: "+rule);
    if(!config.persistence||config.persistence.offlineSolo!==true||config.persistence.cooperativeAuthority!=="host"||config.persistence.simulateWhenHostClosed!==false)
      errors.push("Persistência deve permitir solo offline e não simular o mundo cooperativo quando o anfitrião estiver fechado.");
    const resources=Array.isArray(config.resources)?config.resources:[];
    const structures=Array.isArray(config.structures)?config.structures:[];
    if(!Array.isArray(config.resources))errors.push("resources precisa ser uma lista.");
    if(!Array.isArray(config.structures))errors.push("structures precisa ser uma lista.");
    uniqueIds(resources,"Recurso",errors);
    uniqueIds(structures,"Estrutura",errors);
    for(const resource of resources){
      if(!resource||typeof resource!=="object")continue;
      if(!text(resource.itemId))errors.push("Recurso "+text(resource.id)+" precisa apontar para itemId.");
      if(resource.yieldQuantity!==undefined&&(!Number.isSafeInteger(resource.yieldQuantity)||resource.yieldQuantity<1))
        errors.push("Quantidade coletável inválida no recurso "+text(resource.id)+".");
    }
    for(const structure of structures){
      if(!structure||typeof structure!=="object")continue;
      if(!text(structure.name))errors.push("Estrutura "+text(structure.id)+" precisa ter nome.");
      if(!text(structure.recipeId))errors.push("Estrutura "+text(structure.id)+" precisa referenciar uma receita.");
      const footprint=structure.footprint;
      if(!footprint||!Number.isSafeInteger(footprint.width)||footprint.width<1||!Number.isSafeInteger(footprint.height)||footprint.height<1)
        errors.push("Estrutura "+text(structure.id)+" precisa ter footprint com largura e altura positivas.");
      if(structure.placementRules!==undefined){
        if(!Array.isArray(structure.placementRules))errors.push("placementRules da estrutura "+text(structure.id)+" precisa ser uma lista.");
        else for(const rule of structure.placementRules)if(!ALLOWED_PLACEMENT_RULES.includes(rule))errors.push("Regra de posicionamento desconhecida na estrutura "+text(structure.id)+": "+rule);
      }
    }
    if(catalog!==undefined){
      if(!catalog||!Array.isArray(catalog.items)||!Array.isArray(catalog.recipes))errors.push("Catálogo informado para validação é inválido.");
      else{
        const itemIds=new Set(catalog.items.filter(Boolean).map(item=>item.id));
        const recipesById=new Map(catalog.recipes.filter(Boolean).map(recipe=>[recipe.id,recipe]));
        for(const resource of resources)if(resource&&text(resource.itemId)&&!itemIds.has(resource.itemId))
          errors.push("Recurso "+text(resource.id)+" aponta para item inexistente: "+resource.itemId);
        for(const structure of structures){
          if(!structure||!text(structure.recipeId))continue;
          const recipe=recipesById.get(structure.recipeId);
          if(!recipe)errors.push("Estrutura "+text(structure.id)+" aponta para receita inexistente: "+structure.recipeId);
          else if(!itemIds.has(recipe.resultId))errors.push("A receita da estrutura "+text(structure.id)+" produz item inexistente: "+text(recipe.resultId));
        }
      }
    }else{
      if(resources.length||structures.length)warnings.push("As referências de recursos e estruturas só foram verificadas estruturalmente; valide-as contra o catálogo antes de exportar.");
    }
    return {valid:errors.length===0,errors,warnings};
  }
  return Object.freeze({SCHEMA,ALLOWED_PLACEMENT_RULES:createDefaultWorldSystems().construction.placementRules,createDefaultWorldSystems,validateWorldSystems});
});
