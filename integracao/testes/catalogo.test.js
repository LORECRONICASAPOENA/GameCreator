"use strict";
const assert=require("node:assert/strict");
const A=require("../catalogo.js");

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
console.log("Concluído: "+passed+" testes de contrato e regras isoladas.");
