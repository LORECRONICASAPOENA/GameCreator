"use strict";
const assert=require("node:assert/strict");
const A=require("../catalogo.js");
const T=require("../../map-editor/terrain-system.js");

function source(){
  return {
    schema:"apoena.central.v1",name:"Jogo de teste",
    assets:[{id:"img_banana",name:"Banana",data:"data:image/png;base64,AAA",file:"banana.png"}],
    items:[
      {id:"banana",name:"Banana",category:"alimento",iconId:"img_banana",effect:{type:"nenhum",value:0}},
      {id:"erva",name:"Erva",category:"material"},
      {id:"pocao",name:"Poção de teste",category:"pocao",effect:{type:"restaurar_hp_percentual",value:20}}
    ],
    recipes:[
      {id:"fazer_pocao",name:"Poção de teste",resultId:"pocao",quantity:2,gold:5,seconds:60,
       ingredients:[{id:"banana",qty:1},{id:"banana",qty:1},{id:"erva",qty:3}]}
    ]
  };
}
let passed=0;
function test(label,fn){
  fn();passed++;process.stdout.write("✓ "+label+"\n");
}
test("Reconhece schema do Game Creator original",()=>{
  assert.equal(A.detect(source()).kind,"projeto completo");
});
test("Preserva IDs e efeitos sem alterar arquivo original",()=>{
  const s=source(),before=JSON.stringify(s),c=A.portable(s,"jogo_dois");
  assert.equal(c.schema,A.SCHEMA);
  assert.equal(c.game_id,"jogo_dois");
  assert.equal(c.items[2].effect.type,"restaurar_hp_percentual");
  assert.equal(c.assets[0].has_embedded_image,true);
  assert.equal(c.assets[0].data,undefined);
  assert.equal(JSON.stringify(s),before);
});
test("Vínculo de receita válido",()=>{
  assert.equal(A.validateCatalog(A.portable(source(),"rpg")).errors.length,0);
});
test("Produto inexistente bloqueia exportação",()=>{
  const s=source();s.items.pop();
  assert.throws(()=>A.portable(s,"rpg"),/item produzido/i);
});
test("Ingrediente inexistente bloqueia exportação",()=>{
  const s=source();s.recipes[0].ingredients.push({id:"nao_existe",qty:1});
  assert.throws(()=>A.portable(s,"rpg"),/ingrediente/i);
});
test("Quantidade inválida bloqueia exportação",()=>{
  const s=source();s.recipes[0].ingredients[0].qty=0;
  assert.throws(()=>A.portable(s,"rpg"),/quantidade/i);
});
test("Ingrediente nulo não causa crash",()=>{
  const s=source();s.recipes[0].ingredients=[null];
  assert.throws(()=>A.portable(s,"rpg"),/ingrediente/i);
});
test("Não fabrica com ingredientes insuficientes ou desconto parcial",()=>{
  const c=A.portable(source(),"rpg"),session=A.createSession(c);
  A.collect(c,session,"banana",1);
  A.collect(c,session,"erva",3);
  session.gold=5;
  assert.throws(()=>A.craft(c,session,"fazer_pocao"),/Falta ingrediente/);
  assert.equal(session.inventory.banana,1);
  assert.equal(session.inventory.erva,3);
  assert.equal(session.gold,5);
});
test("Fabricação válida consome ingredientes e produz resultado",()=>{
  const c=A.portable(source(),"rpg"),session=A.createSession(c);
  A.collect(c,session,"banana",2);
  A.collect(c,session,"erva",3);
  session.gold=5;
  const product=A.craft(c,session,"fazer_pocao");
  assert.deepEqual(product,{item_id:"pocao",quantity:2});
  assert.equal(session.inventory.banana,0);
  assert.equal(session.inventory.erva,0);
  assert.equal(session.inventory.pocao,2);
  assert.equal(session.gold,0);
});
test("IDs duplicados são rejeitados",()=>{
  const s=source();s.items.push({...s.items[0]});
  assert.throws(()=>A.portable(s,"rpg"),/duplicado/);
});

test("Registra material físico, biomas e variantes das quatro estações",()=>{
  const d=T.normalizeDefinition({
    name:"Areia de praia",role:"terrain",terrainKind:"sand_beach",
    biomeTags:["litoral","praia"],
    seasonalVariants:{spring:1,summer:2,autumn:3,winter:4},
    hydrology:{permeability:0.9,retention:0.15,erosionResistance:0.2,runoff:0.1,source:false}
  },"atlas:0");
  assert.equal(d.terrainKind,"sand_beach");
  assert.deepEqual(d.biomeTags,["litoral","praia"]);
  assert.deepEqual(d.seasonalVariants,{spring:1,summer:2,autumn:3,winter:4});
  assert.equal(d.hydrology.permeability,0.9);
  assert.equal(T.validateCatalog({schema:T.SCHEMA,version:1,tiles:{"atlas:0":d}}).valid,true);
});
test("Limita índices sazonais e valores hidrológicos inválidos",()=>{
  const d=T.normalizeDefinition({terrainKind:"sand_desert",seasonalVariants:{winter:9999},hydrology:{permeability:4,retention:-1,erosionResistance:0.2,runoff:0.3}});
  assert.equal(d.seasonalVariants.winter,null);
  assert.equal(d.hydrology.permeability,1);
  assert.equal(d.hydrology.retention,0);
});
test("Simula chuva, escoamento, acúmulo e erosão sem valores inválidos",()=>{
  const catalog=T.createDefaultCatalog();
  catalog.tiles["atlas:0"]=T.normalizeDefinition({name:"Areia frágil",role:"terrain",terrainKind:"sand_desert",hydrology:{permeability:0.05,retention:0.1,erosionResistance:0.1,runoff:0.9,source:false}});
  const map={width:8,height:8,tiles:Array(64).fill(1000),heights:Array.from({length:64},(_,i)=>Math.max(0,4-(i%8))),terrainCatalog:catalog};
  const sim=T.createHydrologySimulation(map);
  T.simulateHydrology(sim,30,day=>({tempo:day%6<2?"Tempestade":"Sol",estacao:"summer",temperatura:29}));
  assert.ok(sim.flowAccumulation.some(v=>v>0),"a água deve escoar em terreno inclinado");
  assert.ok(sim.waterDepth.every(v=>Number.isFinite(v)&&v>=0&&v<=4),"a profundidade deve permanecer limitada");
  assert.ok(sim.soilMoisture.every(v=>Number.isFinite(v)&&v>=0&&v<=1),"a umidade deve permanecer normalizada");
  assert.ok(sim.elevation.some((v,i)=>v<sim.originalElevation[i]),"o fluxo deve erodir ao menos uma célula vulnerável");
  assert.ok(T.hydrologyStats(sim).puddles>0,"o sistema deve identificar poças fora das fontes permanentes");
});
test("Mapas antigos recebem os perfis ambientais padrão",()=>{
  const prepared=T.prepareMap({schema:"apoena.map2d.v1",width:16,height:16,tiles:Array(256).fill(0)});
  assert.equal(prepared.terrainCatalog.tiles["builtin:0"].terrainKind,"grassland");
  assert.equal(prepared.terrainCatalog.tiles["builtin:3"].hydrology.source,true);
});
console.log("Concluído: "+passed+" testes de contrato e regras isoladas.");
