const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const cutoff=require('../pixel-art/corte-inteligente.js');
function image(w,h,bg=null){
  const data=new Uint8ClampedArray(w*h*4);
  if(bg)for(let i=0;i<w*h;i++)data.set([...bg,255],i*4);
  return {width:w,height:h,data};
}
function rect(im,x,y,w,h,rgba=[255,180,30,255]){
  for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)im.data.set(rgba,(j*im.width+i)*4);
}
const transparent=image(100,100);
rect(transparent,30,20,40,60);rect(transparent,1,2,3,3,[0,255,0,255]);
const r1=cutoff.analyze(transparent);
assert.equal(r1.fragments,1,'sobra isolada detectada');
assert.equal(r1.removed,9,'apenas 9 pixels da sobra removidos');
const clean=cutoff.cleaned(transparent,r1);
assert.equal(clean.data[(40*100+40)*4+3],255,'corpo preservado');
assert.equal(clean.data[(2*100+1)*4+3],0,'sobra apagada');
assert.equal(transparent.data[(2*100+1)*4+3],255,'original intacto até confirmação');
const opaque=image(100,100,[0,0,0]);
rect(opaque,20,10,60,78);
const r2=cutoff.analyze(opaque);
assert.ok(r2.backgroundRemoved>3000,'fundo preto conectado removível');
const clean2=cutoff.cleaned(opaque,r2);
assert.equal(clean2.data[3],0,'canto preto transparente');
assert.equal(clean2.data[(40*100+40)*4+3],255,'corpo preservado em fundo opaco');
const connected=image(100,100);
rect(connected,0,10,65,65);
const r3=cutoff.analyze(connected);
assert.equal(r3.confidence,'revisar','figura tocando lateral exige revisão');
const variableSheet=image(120,80);
rect(variableSheet,10,12,12,16);rect(variableSheet,72,24,15,12);
const variableOriginal=new Uint8ClampedArray(variableSheet.data);
const detected=cutoff.detectSprites(variableSheet,{minArea:8,mergeGap:0});
assert.deepEqual(variableSheet.data,variableOriginal,'detecção não altera a imagem de origem');
assert.equal(detected.sprites.length,2,'sprites separados detectados sem grade fixa');
assert.deepEqual(detected.sprites.map(({x,y,w,h})=>({x,y,w,h})),[{x:10,y:12,w:12,h:16},{x:72,y:24,w:15,h:12}],'limites automáticos dos sprites');
const noisySheet=image(120,80);
rect(noisySheet,10,12,12,16);rect(noisySheet,72,24,15,12);rect(noisySheet,40,5,3,3,[255,0,0,255]);
const noisyDetected=cutoff.detectSprites(noisySheet,{mergeGap:0});
assert.equal(noisyDetected.sprites.length,2,'área mínima padrão filtra fragmentos pequenos');
const sparseOpaque=image(100,100,[0,0,0]);
rect(sparseOpaque,10,12,12,16);rect(sparseOpaque,72,24,15,12);
const sparseDetected=cutoff.detectSprites(sparseOpaque,{minArea:8,mergeGap:0});
assert.equal(sparseDetected.sprites.length,2,'fundo opaco esparso não engole os sprites');
assert.ok(sparseDetected.backgroundRemoved>9000,'fundo opaco conectado removido mesmo com mais de 94% da imagem');
assert.match(sparseDetected.warning,/fundo ocupa quase toda a imagem/i,'fundo esparso pede revisão manual');
const grid=cutoff.grid(121,121,4,3,0,0,2,-2);
assert.equal(grid.x.length,5);assert.equal(grid.y.length,4);
for(const axis of [grid.x,grid.y])for(let i=1;i<axis.length;i++)assert.ok(axis[i]>axis[i-1],'divisórias crescentes');
const html=fs.readFileSync(path.join(__dirname,'../pixel-art/estudio.html'),'utf8');
const js=fs.readFileSync(path.join(__dirname,'../pixel-art/estudio.js'),'utf8');
const mapHtml=fs.readFileSync(path.join(__dirname,'../map-editor/index.html'),'utf8');
const libraryHtml=fs.readFileSync(path.join(__dirname,'../biblioteca/index.html'),'utf8');
const shellHtml=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const mapScriptStart=mapHtml.indexOf('<script>');
const mapScriptEnd=mapHtml.indexOf('</script>',mapScriptStart);
assert.ok(mapScriptStart>=0&&mapScriptEnd>mapScriptStart,'script do editor de mapas encontrado');
assert.doesNotThrow(()=>new Function(mapHtml.slice(mapScriptStart+8,mapScriptEnd)),'script do editor de mapas sintaticamente válido');
assert.doesNotThrow(()=>new Function(js),'script UI válido');
for(const id of ['meshMode','meshReset','smartSelected','smartAll','smartPanel','smartApply','smartCancel','smartUndoBatch','projectFile','libraryProjects','libraryProjectSave','libraryProjectOpen','libraryProjectRefresh','detectSprites','detectMergeGap','detectPadding','detectMinArea','habitat','behavior','resourceMetadata','autoDetectPanel','autoDetectApply','autoDetectCancel'])
  assert.ok(html.includes('id="'+id+'"'),'falta controle '+id);
assert.ok(html.includes('id="action" list="actionOptions"')&&html.includes('id="direction" list="directionOptions"'),'ações e direções são configuráveis');
assert.ok(js.includes('async function loadProjectData')&&js.includes('ApoenaLibrary.saveProject')&&js.includes('ApoenaLibrary.getProject'),'projeto editável pode ser importado, salvo e reaberto');
assert.ok(js.includes('frames.filter(f=>f.action===action&&f.direction===direction)'),'prévia animada filtra quadros pela ação e direção selecionadas');
assert.ok(js.includes('function readResourceMetadata()')&&js.includes('resource:{habitat:')&&js.includes("$('resourceMetadata').value=JSON.stringify(resource.metadata"),'metadados específicos são validados e persistidos no projeto');
assert.ok(js.includes('ApoenaCorte.detectSprites')&&js.includes('runSpriteDetection'),'detecção automática tem implementação e handler real');
assert.ok(js.includes('Limites detectados carregados nos campos de recorte'),'limites detectados podem ser corrigidos manualmente');
assert.ok(html.indexOf('corte-inteligente.js')<html.indexOf('estudio.js'),'ordem de scripts');
const alphaStart=js.indexOf('function alpha()'),alphaEnd=js.indexOf('function trim()',alphaStart);
assert.ok(alphaStart>=0&&alphaEnd>alphaStart,'rotina de limpeza de alfa presente');
assert.ok(js.slice(alphaStart,alphaEnd).includes('saveUndo();'),'limpeza de alfa permite desfazer');
assert.ok(mapHtml.includes('<script src="../shared/asset-library.js"></script>'),'editor de mapas carrega a biblioteca compartilhada');
for(const id of ['saveMapLibrary','libraryMaps','loadMapLibrary'])
  assert.ok(mapHtml.includes('id="'+id+'"'),'falta controle de mapas na biblioteca: '+id);
assert.ok(mapHtml.includes('ApoenaLibrary.saveProject')&&mapHtml.includes('ApoenaLibrary.getProject'),'mapas podem ser salvos e reabertos pela biblioteca central');
assert.ok(mapHtml.includes('ApoenaTilesetCheck.analyze')&&mapHtml.includes('id="checkTilesetFit"'),'verificador de encaixe de tilesets está conectado ao editor');
assert.ok(mapHtml.includes("new URLSearchParams(location.search).get('projeto')")&&mapHtml.includes('openLibraryMap(requestedMapId)'),'mapa pode ser aberto por link com ID salvo');
for(const id of ['projectStatus','projects'])assert.ok(libraryHtml.includes('id="'+id+'"'),'biblioteca sem área de projetos: '+id);
assert.ok(libraryHtml.includes('ApoenaLibrary.listProjects')&&libraryHtml.includes('ApoenaLibrary.deleteProject'),'biblioteca lista e exclui projetos');
assert.ok(libraryHtml.includes('includeData:false')&&libraryHtml.includes('ApoenaLibrary.getProject(project.id)'),'biblioteca carrega payload grande apenas sob demanda');
assert.ok(mapHtml.includes('listProjects({includeData:false})'),'editor de mapas lista metadados sem baixar mapas completos');
assert.ok(js.includes('listProjects({includeData:false})'),'estúdio lista projetos sem baixar todos os quadros');
assert.ok(libraryHtml.includes("window.open(url,'_blank','noopener')"),'biblioteca pode abrir mapa salvo no editor');
const root=path.join(__dirname,'..');
const entryHtml=fs.readFileSync(path.join(root,'index.html'),'utf8');
const loaderPath=path.join(root,'.ci-results','index-loader.html');
const loaderHtml=fs.existsSync(loaderPath)?fs.readFileSync(loaderPath,'utf8'):entryHtml;
if(loaderHtml.includes('bundle-v4/parte_000.js')){
  assert.ok(loaderHtml.includes('window.__APOENA_V4_PARTES')&&loaderHtml.includes('document.write(full)')&&loaderHtml.includes('shared/creator-bridge.js')&&!loaderHtml.includes('<iframe src='),'loader compacto preserva o Creator V4.0 sem iframe de substituição');
}
if(entryHtml.includes('window.__APOENA_V4_PARTES')){
  assert.ok(entryHtml.includes('document.write(full)')&&entryHtml.includes('shared/creator-bridge.js')&&!entryHtml.includes('<iframe src='),'entrada compacta preserva o Creator V4.0');
}else{
  assert.ok(entryHtml.includes('id="page-pixelart"')&&entryHtml.includes('pixel-art/modulo-integrado.js')&&!entryHtml.includes('<iframe'),'build produz Creator V4.0 nativo sem iframe');
}
if(!entryHtml.includes('window.__APOENA_V4_PARTES')) {
  assert.ok(entryHtml.includes('shared/asset-library.js')&&entryHtml.includes('shared/creator-bridge.js')&&entryHtml.includes('pixel-art/natureza.js'),'entrada nativa carrega biblioteca, ponte e editor de Natureza');
}
const integratedModule=fs.readFileSync(path.join(__dirname,'../pixel-art/modulo-integrado.js'),'utf8');
for(const href of ['pixel-art/estudio.html','map-editor/index.html','biblioteca/index.html','integracao/index.html'])
  assert.ok(integratedModule.includes(href),'ferramenta V4.1 não acessível pela área Pixel Art: '+href);
console.log('CORTE INTELIGENTE OK: malha ajustável, transparência, isolamento, proteção, desfazer e UI');
console.log('MAPAS/BIBLIOTECA OK: salvar/reabrir, link direto, lista de projetos e ponte central');

/* Regressão da integração: todos os módulos apontados pelo menu unificado devem existir. */
const modulePaths=[
  'APOENA_GAME_CREATOR_V4_0_BANCADA_INTEGRADA.html',
  'pixel-art/estudio.html',
  'pixel-art/index.html',
  'map-editor/index.html',
  'integracao/index.html',
  'legacy/iniciador-anterior.html',
  'ORGANIZACAO_EDITOR.html'
];
for(const file of modulePaths)assert.ok(fs.existsSync(path.join(root,file)),'módulo do menu ausente: '+file);
if(loaderHtml.includes('bundle-v4/parte_000.js'))
  assert.ok(loaderHtml.includes('shared/asset-library.js')&&loaderHtml.includes('shared/creator-bridge.js')&&loaderHtml.includes('pixel-art/natureza.js'),'loader injeta biblioteca, ponte e Natureza');
assert.ok(entryHtml.includes('shared/asset-library.js')&&entryHtml.includes('shared/creator-bridge.js')&&entryHtml.includes('pixel-art/natureza.js'),'biblioteca central, ponte e Natureza incluídas na entrada nativa');
assert.ok(!entryHtml.includes('<iframe src='),'entrada principal não substitui o Creator por um shell com iframe');
assert.ok(integratedModule.includes('data-pixel-tab="objects"')&&integratedModule.includes('data-pixel-tab="maps"'),'abas nativas de objetos e mapas preservadas');
console.log('INTEGRAÇÃO V4.1 OK: entrada nativa, módulos existentes e ferramentas acessíveis');
