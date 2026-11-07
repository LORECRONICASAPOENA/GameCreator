(function(root,factory){
  "use strict";
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  if(root)root.ApoenaGameModes=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const SCHEMA="apoena.game.modes.v1";
  const SESSION_SCHEMA="apoena.game.session.v1";
  const VERSION=1;
  const CONNECTION_TYPES=["solo","lan","internet"];
  const LOOP_STATUSES=["waiting","in_progress","finished"];
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
    schema:SCHEMA,version:VERSION,gameId:"apoena",
    modes:{
      historia:{enabled:true,offline:true,multiplayer:false,scope:"private"},
      exploracao:{enabled:true,offline:true,multiplayer:true,hostAuthority:true,persistence:"host-local-save",connections:["solo","lan","internet"]},
      moba:{enabled:true,offline:true,multiplayer:true,teamCount:2,playersPerTeam:5,fillEmptySlotsWithBots:true,connections:["solo","lan","internet"]}
    },
    voice:{enabledByDefault:false,microphonePermissionRequired:true,explorationProximity:true,mobaTeamChannel:true},
    networking:{lanWithoutInternet:true,internetMayRequireSignalingOrRelay:true},
    roster:CHAMPIONS,lore:LORE
  };
  function isRecord(value){return value!==null&&typeof value==="object"&&!Array.isArray(value)}
  function text(value){return typeof value==="string"?value.trim():""}
  function canonicalId(value){return text(value).toLowerCase()}
  function clone(value){return JSON.parse(JSON.stringify(value))}
  function createDefaultConfig(){return clone(DEFAULT_CONFIG)}
  function validateConnections(value,label,errors,multiplayer){
    if(!Array.isArray(value)||value.length===0){errors.push(label+" precisa declarar ao menos uma conexão.");return}
    const seen=new Set();
    for(const connection of value){
      if(typeof connection!=="string"||!CONNECTION_TYPES.includes(connection)){
        errors.push(label+" contém conexão não suportada: "+String(connection)+".");continue
      }
      if(seen.has(connection))errors.push(label+" contém conexão duplicada: "+connection+".");
      seen.add(connection);
    }
    if(!seen.has("solo"))errors.push(label+" deve preservar a opção solo.");
    if(multiplayer===true&&!value.some(connection=>connection==="lan"||connection==="internet"))
      errors.push(label+" precisa declarar LAN ou internet quando o modo é multijogador.");
    if(multiplayer===false&&value.some(connection=>connection!=="solo"))
      errors.push(label+" não pode oferecer LAN/internet quando o modo não é multijogador.");
  }
  function validateModeObject(mode,label,errors){
    if(!isRecord(mode)){errors.push(label+" ausente ou inválido.");return false}
    ["enabled","offline","multiplayer"].forEach(key=>{
      if(typeof mode[key]!=="boolean")errors.push(label+"."+key+" deve ser booleano.");
    });
    return true;
  }
  function validateConfig(config){
    const errors=[],warnings=[];
    if(!isRecord(config))return {valid:false,errors:["Configuração raiz inválida."],warnings};
    if(config.schema!==SCHEMA)errors.push("Schema de modos inválido.");
    if(config.version!==VERSION)errors.push("Versão do contrato de modos inválida.");
    if(!text(config.gameId))errors.push("gameId precisa ser informado.");
    const modes=isRecord(config.modes)?config.modes:null;
    if(!modes)errors.push("Configuração de modos ausente.");
    else{
      const story=modes.historia;
      if(validateModeObject(story,"Modo História",errors)){
        if(story.offline!==true)errors.push("O modo História deve funcionar offline.");
        if(story.multiplayer!==false)errors.push("O modo História deve permanecer individual.");
      }
      const explore=modes.exploracao;
      if(validateModeObject(explore,"Modo Exploração Livre",errors)){
        if(explore.offline!==true)errors.push("Exploração Livre deve funcionar offline.");
        if(explore.multiplayer===true&&explore.hostAuthority!==true)
          errors.push("Cooperação da Exploração precisa definir autoridade do anfitrião.");
        if(explore.multiplayer===true&&explore.persistence!=="host-local-save")
          errors.push("Cooperação da Exploração precisa usar o save local do anfitrião.");
        validateConnections(explore.connections,"Exploração Livre",errors,explore.multiplayer);
      }
      const moba=modes.moba;
      if(validateModeObject(moba,"Modo MOBA",errors)){
        if(moba.offline!==true)errors.push("O MOBA deve permitir partida offline/solo.");
        if(!Number.isInteger(moba.teamCount)||moba.teamCount<2||moba.teamCount>4)
          errors.push("MOBA: teamCount deve ser um inteiro entre 2 e 4.");
        if(!Number.isInteger(moba.playersPerTeam)||moba.playersPerTeam<1||moba.playersPerTeam>10)
          errors.push("MOBA: playersPerTeam deve ser um inteiro entre 1 e 10.");
        if(Number.isInteger(moba.teamCount)&&Number.isInteger(moba.playersPerTeam)&&moba.teamCount*moba.playersPerTeam>40)
          errors.push("MOBA: o total configurado excede 40 vagas.");
        if(typeof moba.fillEmptySlotsWithBots!=="boolean")
          errors.push("MOBA: fillEmptySlotsWithBots deve ser booleano.");
        validateConnections(moba.connections,"MOBA",errors,moba.multiplayer);
      }
    }
    if(!isRecord(config.voice))errors.push("Configuração de voz ausente ou inválida.");
    else{
      if(typeof config.voice.enabledByDefault!=="boolean")errors.push("voice.enabledByDefault deve ser booleano.");
      if(config.voice.microphonePermissionRequired!==true)
        errors.push("O módulo de voz deve exigir permissão explícita de microfone.");
      ["explorationProximity","mobaTeamChannel"].forEach(key=>{
        if(typeof config.voice[key]!=="boolean")errors.push("voice."+key+" deve ser booleano.");
      });
    }
    if(!isRecord(config.networking))errors.push("Configuração de rede ausente ou inválida.");
    else{
      if(typeof config.networking.lanWithoutInternet!=="boolean")errors.push("networking.lanWithoutInternet deve ser booleano.");
      if(typeof config.networking.internetMayRequireSignalingOrRelay!=="boolean")
        errors.push("networking.internetMayRequireSignalingOrRelay deve ser booleano.");
    }
    if(!Array.isArray(config.roster)||config.roster.length===0)errors.push("A lista de campeões está vazia.");
    else{
      const ids=new Set();
      for(const character of config.roster){
        if(!isRecord(character)||!text(character.id)||!text(character.name)){
          errors.push("Cada campeão precisa ter ID e nome.");continue
        }
        if(character.id!==character.id.trim())errors.push("ID de campeão não pode conter espaços nas extremidades.");
        if(character.name.length>80)errors.push("Nome de campeão excede 80 caracteres.");
        const key=canonicalId(character.id);
        if(ids.has(key))errors.push("ID de campeão duplicado: "+character.id);
        ids.add(key);
        if(character.aliases!==undefined&&(!Array.isArray(character.aliases)||character.aliases.some(alias=>typeof alias!=="string"||!text(alias))))
          errors.push("Aliases inválidos para o campeão "+character.id+".");
      }
    }
    if(config.lore!==undefined&&!Array.isArray(config.lore))errors.push("lore deve ser um array quando informado.");
    return {valid:errors.length===0,errors,warnings};
  }
  function getRoster(config){return clone(isRecord(config)&&Array.isArray(config.roster)?config.roster:CHAMPIONS)}
  function getLore(config){return clone(isRecord(config)&&Array.isArray(config.lore)?config.lore:LORE)}
  function requireValidConfig(config){
    const report=validateConfig(config);
    if(!report.valid)throw new TypeError(report.errors.join("\n"));
  }
  function assertLobby(lobby){
    if(!isRecord(lobby)||lobby.schema!==SESSION_SCHEMA)throw new TypeError("Sala incompatível.");
    if(!LOOP_STATUSES.includes(lobby.status))throw new TypeError("Estado da sala inválido.");
    if(!Number.isInteger(lobby.teamCount)||lobby.teamCount<2||lobby.teamCount>4)
      throw new TypeError("Quantidade de equipes inválida.");
    if(!Number.isInteger(lobby.playersPerTeam)||lobby.playersPerTeam<1||lobby.playersPerTeam>10)
      throw new TypeError("Limite de jogadores por equipe inválido.");
    if(lobby.maxPlayers!==lobby.teamCount*lobby.playersPerTeam||lobby.maxPlayers>40)
      throw new TypeError("Limite total de jogadores inconsistente.");
    if(typeof lobby.botsEnabled!=="boolean")throw new TypeError("Configuração de bots inválida.");
    if(!Array.isArray(lobby.rosterIds)||lobby.rosterIds.length===0)
      throw new TypeError("Elenco de campeões inválido.");
    const roster=new Set();
    for(const id of lobby.rosterIds){
      if(!text(id)||canonicalId(id)!==id||roster.has(canonicalId(id)))
        throw new TypeError("Elenco de campeões contém ID inválido ou duplicado.");
      roster.add(canonicalId(id));
    }
    if(!Array.isArray(lobby.teams)||lobby.teams.length!==lobby.teamCount)
      throw new TypeError("Estrutura de equipes inválida.");
    const teamIds=new Set(),playerIds=new Set();
    let hostFound=false;
    for(const team of lobby.teams){
      if(!isRecord(team)||!text(team.id)||!text(team.name)||!Array.isArray(team.players))
        throw new TypeError("Equipe inválida.");
      const teamKey=canonicalId(team.id);
      if(teamIds.has(teamKey))throw new TypeError("ID de equipe duplicado: "+team.id);
      teamIds.add(teamKey);
      if(team.players.length>lobby.playersPerTeam)throw new TypeError("Equipe acima do limite: "+team.name);
      for(const player of team.players){
        if(!isRecord(player)||!text(player.id)||!text(player.name)||typeof player.isBot!=="boolean")
          throw new TypeError("Jogador inválido.");
        if(text(player.id).length>128||text(player.name).length>80)
          throw new TypeError("ID ou nome do jogador excede o limite permitido.");
        const playerKey=canonicalId(player.id);
        if(playerIds.has(playerKey))throw new TypeError("Jogador duplicado: "+player.id);
        playerIds.add(playerKey);
        if(player.id===lobby.hostId)hostFound=true;
        if(player.championId!==null&&player.championId!==undefined&&!roster.has(canonicalId(player.championId)))
          throw new TypeError("Campeão inexistente: "+String(player.championId));
      }
    }
    if(!text(lobby.hostId)||!hostFound)throw new TypeError("Anfitrião não encontrado na sala.");
    if(!CONNECTION_TYPES.includes(lobby.connectionType))throw new TypeError("Tipo de conexão da sala inválido.");
    return true;
  }
  function createLobby(options){
    if(options==null)options={};
    if(!isRecord(options))throw new TypeError("Opções da sala devem ser um objeto.");
    const config=options.config==null?createDefaultConfig():options.config;
    requireValidConfig(config);
    const mode=config.modes.moba;
    if(!mode.enabled)throw new Error("O modo MOBA está desativado.");
    const hostId=text(options.hostId);
    if(!hostId||hostId.length>128)throw new Error("O anfitrião precisa ter um ID válido.");
    const connectionType=text(options.connectionType)||(mode.multiplayer?"lan":"solo");
    if(!mode.connections.includes(connectionType))
      throw new Error("Tipo de conexão não permitido para o MOBA: "+connectionType);
    if(connectionType!=="solo"&&!mode.multiplayer)
      throw new Error("O MOBA está configurado sem multijogador.");
    const lobbyId=text(options.lobbyId)||("lobby_"+hostId);
    const hostName=text(options.hostName)||hostId;
    if(lobbyId.length>128||hostName.length>80)throw new Error("ID da sala ou nome do anfitrião excede o limite permitido.");
    const labels=["Azul","Vermelha","Verde","Amarela"];
    const teams=Array.from({length:mode.teamCount},(_,index)=>({
      id:"team_"+(index+1),name:labels[index]||("Equipe "+(index+1)),players:[]
    }));
    const lobby={
      schema:SESSION_SCHEMA,id:lobbyId,mode:"moba",hostId,connectionType,
      authority:"host",status:"waiting",teamCount:mode.teamCount,
      playersPerTeam:mode.playersPerTeam,maxPlayers:mode.teamCount*mode.playersPerTeam,
      botsEnabled:mode.fillEmptySlotsWithBots,rosterIds:getRoster(config).map(character=>character.id),teams
    };
    teams[0].players.push({id:hostId,name:hostName,isBot:false,championId:null});
    assertLobby(lobby);
    return lobby;
  }
  function listPlayers(lobby){
    assertLobby(lobby);
    return lobby.teams.flatMap(team=>team.players.map(player=>({...player,teamId:team.id})));
  }
  function joinLobby(lobby,player){
    assertLobby(lobby);
    if(lobby.status!=="waiting")throw new Error("A sala não está aceitando jogadores.");
    if(!isRecord(player)||!text(player.id)||!text(player.name))
      throw new Error("Jogador precisa ter ID e nome.");
    if(text(player.id).length>128||text(player.name).length>80)
      throw new Error("ID ou nome do jogador excede o limite permitido.");
    if(player.isBot===true)throw new Error("Bots devem ser adicionados pelo preenchimento automático.");
    const playerKey=canonicalId(player.id);
    if(listPlayers(lobby).some(existing=>canonicalId(existing.id)===playerKey))
      throw new Error("Jogador duplicado: "+text(player.id));
    if(player.championId!==undefined&&player.championId!==null&&!lobby.rosterIds.includes(player.championId))
      throw new Error("Campeão inexistente: "+String(player.championId));
    let team=null;
    if(player.teamId!==undefined&&player.teamId!==null){
      if(!text(player.teamId))throw new Error("Equipe inválida.");
      team=lobby.teams.find(candidate=>candidate.id===player.teamId);
      if(!team)throw new Error("Equipe inexistente: "+player.teamId);
    }else{
      team=lobby.teams.filter(candidate=>candidate.players.length<lobby.playersPerTeam)
        .sort((a,b)=>a.players.length-b.players.length)[0]||null;
    }
    if(!team||team.players.length>=lobby.playersPerTeam)
      throw new Error("Não há vaga disponível na equipe.");
    const newPlayer={id:text(player.id),name:text(player.name),isBot:false,championId:player.championId||null};
    team.players.push(newPlayer);
    assertLobby(lobby);
    return {teamId:team.id,player:newPlayer};
  }
  function selectChampion(lobby,playerId,championId){
    assertLobby(lobby);
    if(lobby.status!=="waiting")throw new Error("A seleção de campeões já foi encerrada.");
    if(typeof championId!=="string"||!lobby.rosterIds.includes(championId))
      throw new Error("Campeão inexistente: "+String(championId));
    const normalizedPlayerId=text(playerId);
    for(const team of lobby.teams){
      const player=team.players.find(candidate=>candidate.id===normalizedPlayerId);
      if(player){
        if(player.isBot)throw new Error("Não é possível alterar a seleção de um bot.");
        player.championId=championId;
        return player;
      }
    }
    throw new Error("Jogador não encontrado: "+normalizedPlayerId);
  }
  function fillWithBots(lobby){
    assertLobby(lobby);
    if(lobby.status!=="waiting")throw new Error("Só é possível preencher bots antes da partida.");
    if(!lobby.botsEnabled)throw new Error("Preenchimento automático de bots está desativado.");
    if(!lobby.rosterIds.length)throw new Error("Não há campeões disponíveis para bots.");
    const existing=new Set(listPlayers(lobby).map(player=>canonicalId(player.id)));
    const additions=[];
    let botIndex=0;
    for(const team of lobby.teams){
      for(let slot=team.players.length+1;slot<=lobby.playersPerTeam;slot++){
        const id="bot_"+team.id+"_"+slot;
        const key=canonicalId(id);
        if(existing.has(key))throw new Error("ID de bot duplicado: "+id);
        existing.add(key);
        additions.push({
          team,
          player:{id,name:"Bot "+slot,isBot:true,championId:lobby.rosterIds[botIndex%lobby.rosterIds.length]}
        });
        botIndex++;
      }
    }
    additions.forEach(addition=>addition.team.players.push(addition.player));
    assertLobby(lobby);
    return lobby;
  }
  function startLobby(lobby){
    assertLobby(lobby);
    if(lobby.status!=="waiting")throw new Error("A partida não está aguardando início.");
    const unselectedHuman=listPlayers(lobby).find(player=>!player.isBot&&!player.championId);
    if(unselectedHuman)throw new Error("Jogador sem campeão selecionado: "+unselectedHuman.id);
    const candidate=clone(lobby);
    if(candidate.botsEnabled)fillWithBots(candidate);
    const incomplete=candidate.teams.find(team=>team.players.length!==candidate.playersPerTeam);
    if(incomplete)throw new Error("Equipe incompleta: "+incomplete.name);
    const unselected=listPlayers(candidate).find(player=>!player.championId);
    if(unselected)throw new Error("Jogador sem campeão selecionado: "+unselected.id);
    candidate.status="in_progress";
    lobby.teams=candidate.teams;
    lobby.status=candidate.status;
    assertLobby(lobby);
    return lobby;
  }
  return Object.freeze({
    SCHEMA,SESSION_SCHEMA,VERSION,CONNECTION_TYPES:CONNECTION_TYPES.slice(),
    createDefaultConfig,validateConfig,getRoster,getLore,
    createLobby,listPlayers,joinLobby,selectChampion,fillWithBots,startLobby
  });
});
