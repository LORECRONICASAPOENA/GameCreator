"use strict";
const assert=require("node:assert/strict");
const M=require("../modos-partida.js");
let passed=0;
function test(label,fn){fn();passed++;process.stdout.write("✓ "+label+"\n")}
test("Configuração padrão mantém os três modos e História individual offline",()=>{
  const c=M.createDefaultConfig();
  assert.equal(c.modes.historia.offline,true);
  assert.equal(c.modes.historia.multiplayer,false);
  assert.equal(c.modes.exploracao.offline,true);
  assert.equal(c.modes.moba.teamCount,2);
  assert.equal(c.modes.moba.playersPerTeam,5);
  assert.equal(M.validateConfig(c).valid,true);
});
test("Preserva os oito campeões iniciais e o alias Birará/Agan",()=>{
  const roster=M.getRoster();
  assert.deepEqual(roster.map(x=>x.id),["apoena","serena","orion","birara","aqua","rufy","blim","kael"]);
  assert.deepEqual(roster.find(x=>x.id==="birara").aliases,["Agan"]);
});
test("Nomes pendentes do lore não são inventados como campeões",()=>{
  const lore=M.getLore();
  assert.equal(lore.find(x=>x.id==="arconte_ar").name,null);
  assert.equal(lore.find(x=>x.id==="arconte_terra").name,null);
  assert.equal(M.getRoster().some(x=>x.id==="akniel"),false);
});
test("Rejeita configuração que transforma História em multijogador",()=>{
  const c=M.createDefaultConfig();c.modes.historia.multiplayer=true;
  assert.equal(M.validateConfig(c).valid,false);
});
test("Cria lobby MOBA com anfitrião e limite de dez vagas",()=>{
  const lobby=M.createLobby({hostId:"jogador_1",hostName:"Anfitrião",lobbyId:"teste_1"});
  assert.equal(lobby.maxPlayers,10);
  assert.equal(lobby.teams.length,2);
  assert.equal(lobby.teams[0].players[0].id,"jogador_1");
});
test("Distribui jogadores entre equipes sem ultrapassar cinco por equipe",()=>{
  const lobby=M.createLobby({hostId:"j1"});
  for(let i=2;i<=10;i++)M.joinLobby(lobby,{id:"j"+i,name:"Jogador "+i});
  assert.deepEqual(lobby.teams.map(t=>t.players.length),[5,5]);
  assert.equal(M.listPlayers(lobby).length,10);
  assert.throws(()=>M.joinLobby(lobby,{id:"j11",name:"Extra"}),/Sala cheia/);
});
test("Rejeita IDs duplicados e campeões desconhecidos",()=>{
  const lobby=M.createLobby({hostId:"j1"});
  assert.throws(()=>M.joinLobby(lobby,{id:"j1",name:"Duplicado"}),/duplicado/i);
  assert.throws(()=>M.joinLobby(lobby,{id:"j2",name:"Inválido",championId:"desconhecido"}),/Campeão inexistente/);
});
test("Bots completam as duas equipes até cinco membros cada",()=>{
  const lobby=M.createLobby({hostId:"j1"});
  M.joinLobby(lobby,{id:"j2",name:"Amigo"});
  M.fillWithBots(lobby);
  assert.deepEqual(lobby.teams.map(t=>t.players.length),[5,5]);
  assert.equal(M.listPlayers(lobby).filter(p=>p.isBot).length,8);
  assert.ok(M.listPlayers(lobby).every(p=>p.championId));
});
test("Inicia a partida somente com as equipes completas",()=>{
  const lobby=M.createLobby({hostId:"j1"});
  M.startLobby(lobby);
  assert.equal(lobby.status,"in_progress");
  assert.throws(()=>M.joinLobby(lobby,{id:"j2",name:"Tarde demais"}),/não está aceitando/);
});
test("Configuração pode desativar bots sem iniciar equipe incompleta",()=>{
  const c=M.createDefaultConfig();c.modes.moba.fillEmptySlotsWithBots=false;
  const lobby=M.createLobby({hostId:"j1",config:c});
  assert.throws(()=>M.startLobby(lobby),/Equipe incompleta/);
});
console.log("Concluído: "+passed+" testes de contrato de modos e salas.");
