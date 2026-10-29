(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  root.ApoenaGameModes=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const SCHEMA="apoena.game.modes.v1";
  const SESSION_SCHEMA="apoena.game.session.v1";
  const clone=value=>JSON.parse(JSON.stringify(value));
  const text=value=>typeof value==="string"?value.trim():"";
  const CHAMPIONS=[
    {id:"apoena",name:"Apoena",relationship:"protagonista"},
    {id:"serena",name:"Serena",relationship:"mãe de Apoena"},
    {id:"orion",name:"Órion",relationship:"pai de Apoena"},
    {id:"birara",name:"Birará",aliases:["Agan"],relationship:"identidade informada pelo criador"},
    {id:"aqua",name:"Aqua",relationship:"irmã de Apoena"},
    {id:"rufy",name:"Rufy",relationship:"colega de escola"},
    {id:"blim",name:"Blim",relationship:"colega de escola"},
    {id:"kael",name:"Kael",relationship:"colega de escola"}
  ];
  const LORE=[
    {id:"akniel",name:"Akniel",role:"Arconte do Fogo",status:"informado"},
    {id:"arconte_agua",name:"Luna / Oluna",role:"Arconte da Água",status:"nome_a_confirmar"},
    {id:"arconte_ar",name:null,role:"Arconte do Ar",status:"nome_pendente"},
    {id:"arconte_terra",name:null,role:"Arconte da Terra",status:"nome_pendente"},
    {id:"lucas",name:"Lucas",role:"sacerdote da capital",status:"informado"}
  ];
  const DEFAULT_CONFIG={
    schema:SCHEMA,
    version:1,
    gameId:"apoena",
    modes:{
      historia:{enabled:true,offline:true,multiplayer:false,scope:"private"},
      exploracao:{enabled:true,offline:true,multiplayer:true,hostAuthority:true,persistence:"host-local-save",connections:["solo","lan","internet"]},
      moba:{enabled:true,offline:true,multiplayer:true,teamCount:2,playersPerTeam:5,fillEmptySlotsWithBots:true,connections:["solo","lan","internet"]}
    },
    voice:{enabledByDefault:false,microphonePermissionRequired:true,explorationProximity:true,mobaTeamChannel:true},
    networking:{lanWithoutInternet:true,internetMayRequireSignalingOrRelay:true},
    roster:CHAMPIONS,
    lore:LORE
  };
  function createDefaultConfig(){return clone(DEFAULT_CONFIG)}
  function validateConfig(config){
    const errors=[],warnings=[];
    if(!config||typeof config!=="object"||Array.isArray(config))return {valid:false,errors:["Configuração raiz inválida."],warnings};
    if(config.schema!==SCHEMA)errors.push("Schema de modos inválido.");
    if(!config.modes||typeof config.modes!=="object")errors.push("Configuração de modos ausente.");
    else{
      const story=config.modes.historia,explore=config.modes.exploracao,moba=config.modes.moba;
      if(!story)errors.push("Modo História ausente.");
      else{
        if(story.offline!==true)errors.push("O modo História deve funcionar offline.");
        if(story.multiplayer!==false)errors.push("O modo História deve permanecer individual.");
      }
      if(!explore)errors.push("Modo Exploração Livre ausente.");
      else{
        if(explore.offline!==true)errors.push("Exploração Livre deve funcionar offline.");
        if(explore.multiplayer===true&&explore.hostAuthority!==true)errors.push("Cooperação da Exploração precisa definir autoridade do anfitrião.");
        if(explore.multiplayer===true&&!Array.isArray(explore.connections))errors.push("Exploração precisa declarar os tipos de conexão.");
      }
      if(!moba)errors.push("Modo MOBA ausente.");
      else{
        if(moba.offline!==true)errors.push("O MOBA deve permitir partida offline/solo.");
        if(!Number.isInteger(moba.teamCount)||moba.teamCount<2||moba.teamCount>4)errors.push("MOBA: teamCount deve ser um inteiro entre 2 e 4.");
        if(!Number.isInteger(moba.playersPerTeam)||moba.playersPerTeam<1||moba.playersPerTeam>10)errors.push("MOBA: playersPerTeam deve ser um inteiro entre 1 e 10.");
        if(Number.isInteger(moba.teamCount)&&Number.isInteger(moba.playersPerTeam)&&moba.teamCount*moba.playersPerTeam>40)errors.push("MOBA: o total configurado excede 40 vagas.");
        if(moba.multiplayer===true&&!Array.isArray(moba.connections))errors.push("MOBA precisa declarar os tipos de conexão.");
        if(moba.fillEmptySlotsWithBots!==true&&moba.fillEmptySlotsWithBots!==false)errors.push("MOBA: fillEmptySlotsWithBots deve ser booleano.");
      }
    }
    if(!Array.isArray(config.roster)||config.roster.length===0)errors.push("A lista de campeões está vazia.");
    else{
      const ids=new Set();
      for(const character of config.roster){
        if(!character||typeof character!=="object"||!text(character.id)||!text(character.name)){
          errors.push("Cada campeão precisa ter ID e nome.");
          continue;
        }
        if(ids.has(character.id))errors.push("ID de campeão duplicado: "+character.id);
        ids.add(character.id);
      }
    }
    if(!config.voice||config.voice.microphonePermissionRequired!==true)warnings.push("O módulo de voz deve solicitar permissão de microfone antes de capturar áudio.");
    return {valid:errors.length===0,errors,warnings};
  }
  function getRoster(config){return clone(config&&Array.isArray(config.roster)?config.roster:CHAMPIONS)}
  function getLore(config){return clone(config&&Array.isArray(config.lore)?config.lore:LORE)}
  function requireValidConfig(config){
    const report=validateConfig(config);
    if(!report.valid)throw Error(report.errors.join("\n"));
  }
  function createLobby(options){
    options=options||{};
    const config=options.config||createDefaultConfig();
    requireValidConfig(config);
    const mode=config.modes.moba;
    if(!mode.enabled)throw Error("O modo MOBA está desativado.");
    const hostId=text(options.hostId);
    if(!hostId)throw Error("O anfitrião precisa ter um ID.");
    const connectionType=text(options.connectionType)||"lan";
    if(!mode.connections.includes(connectionType))throw Error("Tipo de conexão não permitido para o MOBA: "+connectionType);
    const roster=getRoster(config);
    const labels=["Azul","Vermelha","Verde","Amarela"];
    const teams=Array.from({length:mode.teamCount},(_,i)=>({
      id:"team_"+(i+1),
      name:labels[i]||("Equipe "+(i+1)),
      players:[]
    }));
    const lobby={
      schema:SESSION_SCHEMA,
      id:text(options.lobbyId)||("lobby_"+hostId),
      mode:"moba",
      hostId,
      connectionType,
      authority:"host",
      status:"waiting",
      teamCount:mode.teamCount,
      playersPerTeam:mode.playersPerTeam,
      maxPlayers:mode.teamCount*mode.playersPerTeam,
      botsEnabled:mode.fillEmptySlotsWithBots===true,
      rosterIds:roster.map(character=>character.id),
      teams
    };
    teams[0].players.push({id:hostId,name:text(options.hostName)||hostId,isBot:false,championId:null});
    return lobby;
  }
  function listPlayers(lobby){
    if(!lobby||!Array.isArray(lobby.teams))throw Error("Sala inválida.");
    return lobby.teams.flatMap(team=>team.players.map(player=>({...player,teamId:team.id})));
  }
  function joinLobby(lobby,player){
    if(!lobby||lobby.schema!==SESSION_SCHEMA)throw Error("Sala incompatível.");
    if(lobby.status!=="waiting")throw Error("A sala não está aceitando jogadores.");
    if(!player||!text(player.id)||!text(player.name))throw Error("Jogador precisa ter ID e nome.");
    if(player.isBot===true)throw Error("Bots devem ser adicionados pelo preenchimento automático.");
    if(listPlayers(lobby).some(existing=>existing.id===player.id))throw Error("Jogador duplicado: "+player.id);
    if(listPlayers(lobby).length>=lobby.maxPlayers)throw Error("Sala cheia.");
    if(player.championId&&!lobby.rosterIds.includes(player.championId))throw Error("Campeão inexistente: "+player.championId);
    let team=player.teamId?lobby.teams.find(candidate=>candidate.id===player.teamId):null;
    if(player.teamId&&!team)throw Error("Equipe inexistente: "+player.teamId);
    if(!team)team=lobby.teams.filter(candidate=>candidate.players.length<lobby.playersPerTeam).sort((a,b)=>a.players.length-b.players.length)[0];
    if(!team||team.players.length>=lobby.playersPerTeam)throw Error("Não há vaga disponível na equipe.");
    team.players.push({id:player.id,name:text(player.name),isBot:false,championId:player.championId||null});
    return {teamId:team.id,player:team.players[team.players.length-1]};
  }
  function selectChampion(lobby,playerId,championId){
    if(!lobby||lobby.schema!==SESSION_SCHEMA)throw Error("Sala incompatível.");
    if(lobby.status!=="waiting")throw Error("A seleção de campeões já foi encerrada.");
    if(!lobby.rosterIds.includes(championId))throw Error("Campeão inexistente: "+championId);
    for(const team of lobby.teams){
      const player=team.players.find(candidate=>candidate.id===playerId);
      if(player){player.championId=championId;return player}
    }
    throw Error("Jogador não encontrado: "+playerId);
  }
  function fillWithBots(lobby){
    if(!lobby||lobby.schema!==SESSION_SCHEMA)throw Error("Sala incompatível.");
    if(lobby.status!=="waiting")throw Error("Só é possível preencher bots antes da partida.");
    if(!lobby.botsEnabled)throw Error("Preenchimento automático de bots está desativado.");
    if(!lobby.rosterIds.length)throw Error("Não há campeões disponíveis para bots.");
    let botIndex=0;
    for(const team of lobby.teams){
      while(team.players.length<lobby.playersPerTeam){
        const slot=team.players.length+1;
        const id="bot_"+team.id+"_"+slot;
        if(listPlayers(lobby).some(player=>player.id===id))throw Error("ID de bot duplicado: "+id);
        team.players.push({id,name:"Bot "+slot,isBot:true,championId:lobby.rosterIds[botIndex%lobby.rosterIds.length]});
        botIndex++;
      }
    }
    return lobby;
  }
  function startLobby(lobby){
    if(!lobby||lobby.schema!==SESSION_SCHEMA)throw Error("Sala incompatível.");
    if(lobby.status!=="waiting")throw Error("A partida não está aguardando início.");
    if(lobby.botsEnabled)fillWithBots(lobby);
    const incomplete=lobby.teams.find(team=>team.players.length!==lobby.playersPerTeam);
    if(incomplete)throw Error("Equipe incompleta: "+incomplete.name);
    const unselected=listPlayers(lobby).find(player=>!player.championId);
    if(unselected)throw Error("Jogador sem campeão selecionado: "+unselected.id);
    lobby.status="in_progress";
    return lobby;
  }
  return Object.freeze({
    SCHEMA,SESSION_SCHEMA,createDefaultConfig,validateConfig,getRoster,getLore,
    createLobby,listPlayers,joinLobby,selectChampion,fillWithBots,startLobby
  });
});
