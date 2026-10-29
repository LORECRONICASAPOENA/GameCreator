"use strict";
const assert=require("node:assert/strict");
const W=require("../sistemas-mundo.js");
let passed=0;
function test(label,fn){fn();passed++;process.stdout.write("✓ "+label+"\n")}
function catalog(){return {
  schema:"apoena.central.v1",
  items:[{id:"madeira",name:"Madeira"},{id:"bancada",name:"Bancada"}],
  recipes:[{id:"fazer_bancada",resultId:"bancada",ingredients:[{id:"madeira",qty:4}]}]
}}
test("Configuração padrão reutiliza catálogo e não cria inventário duplicado",()=>{
  const c=W.createDefaultWorldSystems(),r=W.validateWorldSystems(c);
  assert.equal(r.valid,true);
  assert.equal(c.catalog.itemDefinitions,"state.items");
  assert.equal(c.crafting.recipeSource,"state.recipes");
  assert.equal(c.inventory.allowDuplicateInventory,false);
});
test("Coleta, crafting e construção são definidos com autoridade do anfitrião",()=>{
  const c=W.createDefaultWorldSystems();
  assert.equal(c.gathering.hostAuthoritative,true);
  assert.equal(c.crafting.consumeAtomically,true);
  assert.equal(c.construction.hostAuthoritative,true);
  assert.equal(c.persistence.cooperativeAuthority,"host");
  assert.equal(c.persistence.simulateWhenHostClosed,false);
});
test("Rejeita uma segunda implementação de inventário",()=>{
  const c=W.createDefaultWorldSystems();c.inventory.allowDuplicateInventory=true;
  assert.equal(W.validateWorldSystems(c).valid,false);
});
test("Rejeita regra de posicionamento desconhecida",()=>{
  const c=W.createDefaultWorldSystems();c.construction.placementRules.push("qualquer_lugar_sem_validacao");
  assert.ok(W.validateWorldSystems(c).errors.some(e=>e.includes("Regra de posicionamento desconhecida")));
});
test("Valida recurso coletável contra o ID do catálogo",()=>{
  const c=W.createDefaultWorldSystems();c.resources=[{id:"arvore",itemId:"madeira",yieldQuantity:3}];
  assert.equal(W.validateWorldSystems(c,catalog()).valid,true);
  c.resources[0].itemId="item_inexistente";
  assert.ok(W.validateWorldSystems(c,catalog()).errors.some(e=>e.includes("item inexistente")));
});
test("Valida estrutura, footprint e receita contra o catálogo",()=>{
  const c=W.createDefaultWorldSystems();
  c.structures=[{id:"bancada_1",name:"Bancada",recipeId:"fazer_bancada",footprint:{width:2,height:2},placementRules:["terrain","collision"]}];
  assert.equal(W.validateWorldSystems(c,catalog()).valid,true);
  c.structures[0].recipeId="receita_inexistente";
  assert.ok(W.validateWorldSystems(c,catalog()).errors.some(e=>e.includes("receita inexistente")));
});
test("Rejeita footprint inválido e IDs duplicados",()=>{
  const c=W.createDefaultWorldSystems();
  c.structures=[
    {id:"casa",name:"Casa",recipeId:"fazer_bancada",footprint:{width:0,height:2}},
    {id:"casa",name:"Outra casa",recipeId:"fazer_bancada",footprint:{width:2,height:2}}
  ];
  const report=W.validateWorldSystems(c,catalog());
  assert.ok(report.errors.some(e=>e.includes("footprint")));
  assert.ok(report.errors.some(e=>e.includes("ID duplicado")));
});
console.log("Concluído: "+passed+" testes de contrato de sistemas de mundo.");
