"use strict";
const assert=require("node:assert/strict");
const W=require("../sistemas-mundo.js");
let passed=0;
function test(label,fn){fn();passed++;process.stdout.write("✓ "+label+"\n")}
function catalog(){return {
  schema:"apoena.central.v1",
  items:[{id:"madeira",name:"Madeira"},{id:"bancada",name:"Bancada"}],
  recipes:[{id:"fazer_bancada",resultId:"bancada",ingredients:[{id:"madeira",qty:4}],quantity:1}]
}}
test("configuração padrão reutiliza catálogo e não cria inventário duplicado",()=>{
  const config=W.createDefaultWorldSystems();
  assert.equal(W.validateWorldSystems(config).valid,true);
  assert.equal(config.catalog.itemDefinitions,"state.items");
  assert.equal(config.crafting.recipeSource,"state.recipes");
  assert.equal(config.inventory.allowDuplicateInventory,false);
});
test("regras permitidas incluem distance_from_city e são exportadas integralmente",()=>{
  assert.ok(W.ALLOWED_PLACEMENT_RULES.includes("distance_from_city"));
});
test("coleta, crafting e construção exigem autoridade do anfitrião",()=>{
  const config=W.createDefaultWorldSystems();
  assert.equal(config.gathering.hostAuthoritative,true);
  assert.equal(config.crafting.hostAuthoritative,true);
  assert.equal(config.construction.hostAuthoritative,true);
  assert.equal(config.persistence.cooperativeAuthority,"host");
  assert.equal(config.persistence.simulateWhenHostClosed,false);
});
test("rejeita inventário duplicado e crafting não atômico",()=>{
  const config=W.createDefaultWorldSystems();config.inventory.allowDuplicateInventory=true;
  assert.equal(W.validateWorldSystems(config).valid,false);
  const other=W.createDefaultWorldSystems();other.crafting.consumeAtomically=false;
  assert.equal(W.validateWorldSystems(other).valid,false);
});
test("rejeita regras de posicionamento desconhecidas e duplicadas",()=>{
  const config=W.createDefaultWorldSystems();config.construction.placementRules.push("regra_desconhecida");
  assert.ok(W.validateWorldSystems(config).errors.some(error=>error.includes("desconhecida")));
  const duplicate=W.createDefaultWorldSystems();duplicate.construction.placementRules.push("terrain");
  assert.ok(W.validateWorldSystems(duplicate).errors.some(error=>error.includes("duplicada")));
});
test("valida recurso coletável contra ID real do catálogo",()=>{
  const config=W.createDefaultWorldSystems();config.resources=[{id:"arvore",itemId:"madeira",yieldQuantity:3}];
  assert.equal(W.validateWorldSystems(config,catalog()).valid,true);
  config.resources[0].itemId="item_inexistente";
  assert.ok(W.validateWorldSystems(config,catalog()).errors.some(error=>error.includes("item inexistente")));
});
test("valida estrutura, footprint, receita e resultado da receita",()=>{
  const config=W.createDefaultWorldSystems();
  config.structures=[{id:"bancada_1",name:"Bancada",recipeId:"fazer_bancada",footprint:{width:2,height:2},placementRules:["terrain","collision"]}];
  assert.equal(W.validateWorldSystems(config,catalog()).valid,true);
  config.structures[0].recipeId="receita_inexistente";
  assert.ok(W.validateWorldSystems(config,catalog()).errors.some(error=>error.includes("receita inexistente")));
  const badResult=catalog();badResult.recipes[0].resultId="nao_existe";
  assert.ok(W.validateWorldSystems(config,badResult).errors.some(error=>error.includes("produz item inexistente")));
});
test("rejeita IDs duplicados sem diferença de caixa e footprint inválido",()=>{
  const config=W.createDefaultWorldSystems();
  config.structures=[
    {id:"Casa",name:"Casa",recipeId:"fazer_bancada",footprint:{width:0,height:2}},
    {id:"casa",name:"Outra casa",recipeId:"fazer_bancada",footprint:{width:2,height:2}}
  ];
  const report=W.validateWorldSystems(config,catalog());
  assert.ok(report.errors.some(error=>error.includes("footprint")));
  assert.ok(report.errors.some(error=>error.includes("ID duplicado")));
});
test("detecta IDs duplicados e receitas inconsistentes no catálogo",()=>{
  const config=W.createDefaultWorldSystems(),invalid=catalog();
  invalid.items.push({id:"MADEIRA",name:"Madeira duplicada"});
  invalid.recipes.push({id:"fazer_bancada",resultId:"bancada",ingredients:[],quantity:1});
  const report=W.validateWorldSystems(config,invalid);
  assert.ok(report.errors.some(error=>error.includes("ID duplicado no catálogo")));
});
test("avisa quando recursos e estruturas não podem ser cruzados sem catálogo",()=>{
  const config=W.createDefaultWorldSystems();config.resources=[{id:"arvore",itemId:"madeira"}];
  const report=W.validateWorldSystems(config);
  assert.equal(report.valid,true);assert.equal(report.warnings.length,1);
});
test("aceita catálogo exportado pelo módulo principal",()=>{
  const config=W.createDefaultWorldSystems(),exported=catalog();
  exported.schema="apoena.gamecreator.catalogo.v1";
  assert.equal(W.validateWorldSystems(config,exported).valid,true);
});
console.log("Concluído: "+passed+" testes de contrato de sistemas de mundo.");
