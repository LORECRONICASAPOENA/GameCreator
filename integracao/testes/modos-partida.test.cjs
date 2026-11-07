"use strict";
const assert=require("node:assert/strict");
const M=require("../modos-partida.js");
let passed=0;
function test(label,fn){fn();passed++;process.stdout.write("✓ "+label+"\n")}
test("configuração padrão mantém História offline individual, Exploração e MOBA 5v5",()=>{
  const config=M.createDefaultConfig();
  assert.equal(M.validateConfig(config).valid,true);
  assert.equal(config.modes.historia.offline,true);
  assert.equal(config.modes.historia.multiplayer,false);
  assert.equal(config.modes.exploracao.offline,true);
  assert.equal(config.modes.moba.teamCount,2);
  assert.equal(config.modes.moba.playersPerTeam,5);
});
test("configuração padrão é isolada e não expõe referências mutáveis internas",()=>{
  const first=M.createDefaultConfig();
  first.roster[0].name="Alterado";
  assert.equal(M.createDefaultConfig().roster[0].name,"Apoena");
});
test("preserva os oito campeões iniciais e o alias Birará/Agan",()=>{
  const roster=M.getRoster();
  assert.deepEqual(roster.map(character=>character.id),["apoena","serena","orion","birara","aqua","rufy","blim","kael"]);
  assert.deepEqual(roster.find(character=>character.id==="birara").aliases,["Agan"]);
});
test("nomes pendentes do lore não são inventados como campeões",()=>{
  const lore=M.getLore();
  assert.equal(lore.find(entry=>entry.id==="arconte_ar").name,null);
  assert.equal(lore.find(entry=>entry.id==="arconte_terra").name,null);
  assert.equal(M.getRoster().some(character=>character.id==="akniel"),false);
});
test("rejeita História multijogador e conexões não suportadas",()=>{
  const story=M.createDefaultConfig();story.modes.historia.multiplayer=true;
  assert.equal(M.validateConfig(story).valid,false);
  const connections=M.createDefaultConfig();connections.modes.moba.connections=["solo","bluetooth"];
  assert.ok(M.validateConfig(connections).errors.some(error=>error.includes("não suportada")));
});
test("rejeita roster com IDs duplicados sem diferenciar caixa",()=>{
  const config=M.createDefaultConfig();config.roster.push({id:"APOENA",name:"Duplicado"});
  assert.equal(M.validateConfig(config).valid,false);
});
test("rejeita config sem conexões porque o lobby depende delas",()=>{
  const config=M.createDefaultConfig();delete config.modes.moba.connections;
  assert.equal(M.validateConfig(config).valid,false);
  assert.throws(()=>M.createLobby({hostId:"j1",config}),/conexão/);
});
test("cria lobby 5v5 com anfitrião e opção LAN",()=>{
  const lobby=M.createLobby({hostId:"jogador_1",hostName:"Anfitrião",lobbyId:"teste_1"});
  assert.equal(lobby.maxPlayers,10);assert.equal(lobby.teams.length,2);
  assert.equal(lobby.teams[0].players[0].id,"jogador_1");assert.equal(lobby.connectionType,"lan");
});
test("permite lobby solo offline quando configurado",()=>{
  const lobby=M.createLobby({hostId:"j1",connectionType:"solo"});
  assert.equal(lobby.connectionType,"solo");
});
test("distribui jogadores sem ultrapassar cinco por equipe",()=>{
  const lobby=M.createLobby({hostId:"j1"});
  for(let index=2;index<=10;index++)M.joinLobby(lobby,{id:"j"+index,name:"Jogador "+index});
  assert.deepEqual(lobby.teams.map(team=>team.players.length),[5,5]);
  assert.equal(M.listPlayers(lobby).length,10);
  assert.throws(()=>M.joinLobby(lobby,{id:"j11",name:"Extra"}),/vaga disponível/);
});
test("rejeita IDs duplicados, equipes desconhecidas e campeões inválidos",()=>{
  const lobby=M.createLobby({hostId:"j1"});
  assert.throws(()=>M.joinLobby(lobby,{id:"j1",name:"Duplicado"}),/duplicado/i);
  assert.throws(()=>M.joinLobby(lobby,{id:"j2",name:"Inválido",championId:"desconhecido"}),/Campeão inexistente/);
  assert.throws(()=>M.joinLobby(lobby,{id:"j3",name:"Sem equipe",teamId:"team_99"}),/Equipe inexistente/);
});
test("bots completam 5v5 e recebem campeões válidos",()=>{
  const lobby=M.createLobby({hostId:"j1"});
  M.joinLobby(lobby,{id:"j2",name:"Amigo"});
  M.selectChampion(lobby,"j1","apoena");M.selectChampion(lobby,"j2","serena");
  M.fillWithBots(lobby);
  assert.deepEqual(lobby.teams.map(team=>team.players.length),[5,5]);
  assert.equal(M.listPlayers(lobby).filter(player=>player.isBot).length,8);
  assert.ok(M.listPlayers(lobby).every(player=>player.championId));
});
test("preenchimento de bots é atômico quando encontra ID já ocupado",()=>{
  const lobby=M.createLobby({hostId:"j1"});
  M.joinLobby(lobby,{id:"bot_team_2_2",name:"Colisão"});
  const before=JSON.stringify(lobby);
  assert.throws(()=>M.fillWithBots(lobby),/ID de bot duplicado/);
  assert.equal(JSON.stringify(lobby),before);
});
test("não inicia sem campeão e não altera a sala quando a validação falha",()=>{
  const lobby=M.createLobby({hostId:"j1"}),before=JSON.stringify(lobby);
  assert.throws(()=>M.startLobby(lobby),/sem campeão selecionado/);
  assert.equal(JSON.stringify(lobby),before);
});
test("inicia após seleção do anfitrião e bots; bloqueia entradas tardias",()=>{
  const lobby=M.createLobby({hostId:"j1"});M.selectChampion(lobby,"j1","apoena");M.startLobby(lobby);
  assert.equal(lobby.status,"in_progress");
  assert.deepEqual(lobby.teams.map(team=>team.players.length),[5,5]);
  assert.ok(M.listPlayers(lobby).every(player=>player.championId));
  assert.throws(()=>M.joinLobby(lobby,{id:"j2",name:"Tarde demais"}),/não está aceitando/);
});
test("com bots desativados, não inicia equipe incompleta",()=>{
  const config=M.createDefaultConfig();config.modes.moba.fillEmptySlotsWithBots=false;
  const lobby=M.createLobby({hostId:"j1",config});M.selectChampion(lobby,"j1","apoena");
  assert.throws(()=>M.startLobby(lobby),/Equipe incompleta/);
});
test("não permite selecionar campeão para bot nem iniciar sala adulterada",()=>{
  const lobby=M.createLobby({hostId:"j1"});M.selectChampion(lobby,"j1","apoena");M.fillWithBots(lobby);
  const bot=M.listPlayers(lobby).find(player=>player.isBot);
  assert.throws(()=>M.selectChampion(lobby,bot.id,"serena"),/bot/);
  const corrupted=JSON.parse(JSON.stringify(lobby));corrupted.teams[0].players[0].championId="not-in-roster";
  assert.throws(()=>M.startLobby(corrupted),/Campeão inexistente/);
});
console.log("Concluído: "+passed+" testes de contrato de modos e salas.");
