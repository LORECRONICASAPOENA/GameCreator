'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const createGuard = require('../pixel-art/preset-request-guard.js');

const guard = createGuard();
const first = guard.begin();
const second = guard.begin();
assert.equal(guard.isCurrent(first), false, 'Uma solicitação antiga não pode continuar válida.');
assert.equal(guard.isCurrent(second), true, 'A solicitação mais recente deve permanecer válida.');
const third = guard.begin();
assert.equal(guard.isCurrent(second), false, 'Uma nova solicitação deve invalidar a anterior.');
assert.equal(guard.isCurrent(third), true, 'A última solicitação deve ser a única autorizada a aplicar o preset.');

const html = fs.readFileSync(path.join(__dirname, '../pixel-art/estudio.html'), 'utf8');
const guardScript = html.indexOf('<script src="preset-request-guard.js"></script>');
const studioScript = html.indexOf('<script src="estudio.js"></script>');
assert.ok(guardScript >= 0 && studioScript > guardScript, 'O helper deve carregar antes do Estúdio.');

const studio = fs.readFileSync(path.join(__dirname, '../pixel-art/estudio.js'), 'utf8');
assert.match(studio, /const presetRequestGuard\s*=\s*ApoenaPresetRequestGuard\(\)/, 'O Estúdio deve criar o guard.');
assert.match(studio, /const requestId\s*=\s*presetRequestGuard\.begin\(\)/, 'Cada carregamento deve receber um identificador.');
assert.match(studio, /if\s*\(!presetRequestGuard\.isCurrent\(requestId\)\)\s*return;/, 'onload deve ignorar uma solicitação antiga.');
assert.match(studio, /if\s*\(presetRequestGuard\.isCurrent\(requestId\)\)\s*msg\(/, 'onerror antigo não deve sobrescrever o status atual.');
const section = (start, end, label) => {
  const from = studio.indexOf(start);
  const to = studio.indexOf(end, from + start.length);
  assert.ok(from >= 0 && to > from, 'Seção de integração encontrada: ' + label);
  return studio.slice(from, to);
};
const presetHandler = section("$('loadApoenaPreset').onclick=()=>{", "$('categories').querySelectorAll('[data-kind]')", 'preset');
assert.match(presetHandler, /const requestId=presetRequestGuard\.begin\(\)/, 'Cada preset deve receber um token.');
assert.match(presetHandler, /if\(!presetRequestGuard\.isCurrent\(requestId\)\)return;/, 'Um preset antigo não pode substituir a seleção atual.');
assert.match(presetHandler, /resetEditorContentState\(\)/, 'Aplicar um preset deve limpar estados transitórios antigos.');

const assetHandler = section("$('libraryAssets').onchange=async()=>{", "if(ApoenaLibrary.subscribe)", 'asset da biblioteca');
assert.match(assetHandler, /const requestId=presetRequestGuard\.begin\(\)/, 'Carregar um asset deve invalidar solicitações anteriores.');
assert.match(assetHandler, /if\(!presetRequestGuard\.isCurrent\(requestId\)\)return;/, 'O retorno da biblioteca deve ser conferido.');
assert.match(assetHandler, /if\(!presetRequestGuard\.isCurrent\(requestId\)\)\{URL\.revokeObjectURL\(url\);return;\}/, 'Imagem de asset obsoleta deve ser descartada e liberada.');
assert.match(assetHandler, /im\.onerror=\(\)=>\{URL\.revokeObjectURL\(url\);if\(presetRequestGuard\.isCurrent\(requestId\)\)/, 'Erro de asset obsoleto não deve alterar o status atual.');
assert.match(assetHandler, /im\.width\*im\.height>32000000/, 'Assets da biblioteca devem respeitar o limite de memória do Estúdio.');
assert.match(assetHandler, /resetEditorContentState\(\)/, 'Carregar asset deve limpar prévias e operações transitórias.');

const fileHandler = section("$('file').onchange=ev=>{", "$('projectFile').onchange=async ev=>{", 'importação manual');
assert.match(fileHandler, /const requestId=presetRequestGuard\.begin\(\)/, 'Importar imagem manualmente deve invalidar solicitações anteriores.');
assert.match(fileHandler, /if\(!presetRequestGuard\.isCurrent\(requestId\)\)\{URL\.revokeObjectURL\(url\);return;\}/, 'Importação manual obsoleta não pode substituir a imagem atual.');
assert.match(fileHandler, /im\.onerror=\(\)=>\{URL\.revokeObjectURL\(url\);if\(presetRequestGuard\.isCurrent\(requestId\)\)/, 'Falha de imagem deve liberar o object URL e respeitar a solicitação atual.');
assert.match(fileHandler, /resetEditorContentState\(\)/, 'Importação manual deve limpar prévias e operações transitórias.');

const projectFileHandler = section("$('projectFile').onchange=async ev=>{", "$('action').addEventListener('change'", 'importação de projeto JSON');
assert.match(projectFileHandler, /const requestId=presetRequestGuard\.begin\(\)/, 'Importar projeto JSON deve invalidar solicitações anteriores.');
assert.match(projectFileHandler, /await loadProjectData\(data,requestId\)/, 'O token deve acompanhar a leitura do projeto.');

const libraryProjectHandler = section("$('libraryProjectOpen').onclick=async()=>{", "$('librarySave').onclick=async()=>{", 'abrir projeto da biblioteca');
assert.match(libraryProjectHandler, /const requestId=presetRequestGuard\.begin\(\)/, 'Abrir projeto da biblioteca deve criar um token.');
assert.match(libraryProjectHandler, /await loadProjectData\(project\.data,requestId\)/, 'O token deve acompanhar a abertura do projeto salvo.');

const projectLoader = section("async function loadProjectData(data,requestId){", "$('libraryRefresh').onclick=refreshLibrary;", 'decodificação do projeto');
const loaderGuards = projectLoader.match(/if\(!presetRequestGuard\.isCurrent\(requestId\)\)return false;/g) || [];
assert.ok(loaderGuards.length >= 3, 'O projeto deve verificar o token antes, durante e antes de aplicar os quadros.');
assert.match(projectLoader, /resetEditorContentState\(\)/, 'Importar projeto deve invalidar operações transitórias anteriores.');

const reset = section("function resetEditorContentState(){", "function crop(){", 'reset do editor');
assert.match(reset, /smartRunId\+\+/, 'Trocar a fonte deve invalidar limpezas em lote pendentes.');
assert.match(reset, /smartBusy=false/, 'Trocar a fonte deve liberar o estado de limpeza em lote.');
assert.match(reset, /smartPending=null/, 'Trocar a fonte deve descartar prévias antigas.');

const batch = section("function applySmart(){", "function safeName(){", 'limpeza inteligente em lote');
assert.match(batch, /const runId=\+\+smartRunId/, 'Cada lote deve receber um identificador próprio.');
assert.match(batch, /if\(runId!==smartRunId\)return;/, 'Lote antigo deve parar quando uma nova fonte é carregada.');

const saveHandler = section("$('librarySave').onclick=async()=>{", "$('libraryAssets').onchange=async()=>{", 'salvamento do asset');
const snapshotAt = saveHandler.indexOf('const snapshotManifest=');
const firstAwaitAt = saveHandler.indexOf('await canvasBlob(output)');
assert.ok(snapshotAt >= 0 && firstAwaitAt > snapshotAt, 'Metadados devem ser capturados antes da primeira operação assíncrona.');
assert.match(saveHandler, /sourceSnapshot=image\?canvasCopy\(image\):null/, 'A imagem original deve ser copiada no início do salvamento.');
assert.match(saveHandler, /metadata:\{manifest:snapshotManifest,frames:snapshotFrames\}/, 'A biblioteca deve receber os metadados do mesmo snapshot da spritesheet.');
assert.match(saveHandler, /manifest:snapshotManifest,png:output\.toDataURL\('image\/png'\)/, 'A ponte V4.0 deve receber o mesmo snapshot salvo na biblioteca.');

const raceGuard = createGuard();
const pendingPreset = raceGuard.begin();
const newerManualImport = raceGuard.begin();
const applied = [];
if (raceGuard.isCurrent(newerManualImport)) applied.push('importação manual');
if (raceGuard.isCurrent(pendingPreset)) applied.push('preset antigo');
assert.deepEqual(applied, ['importação manual'], 'A intenção mais recente deve vencer a corrida assíncrona.');

const referenceAssets = [
  { file: 'apoena-corrida-multidirecional.png', width: 1024, height: 1536, columns: 4, rows: 4 },
  { file: 'apoena-ataque-lateral-direita.png', width: 2048, height: 682, columns: 6, rows: 2 },
  { file: 'apoena-ataque-lateral-esquerda.png', width: 2048, height: 682, columns: 6, rows: 2 }
];
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
for (const asset of referenceAssets) {
  const file = path.join(__dirname, '../pixel-art/references/apoena', asset.file);
  assert.ok(fs.existsSync(file), 'Referência Apoena presente: ' + asset.file);
  const bytes = fs.readFileSync(file);
  assert.ok(bytes.length >= 24 && bytes.subarray(0, 8).equals(pngSignature), 'Referência deve ser PNG válido: ' + asset.file);
  assert.equal(bytes.readUInt32BE(16), asset.width, 'Largura de referência preservada: ' + asset.file);
  assert.equal(bytes.readUInt32BE(20), asset.height, 'Altura de referência preservada: ' + asset.file);
  assert.ok(asset.width * asset.height <= 32000000, 'Referência deve respeitar o limite do editor: ' + asset.file);
  assert.ok(asset.width >= asset.columns && asset.height >= asset.rows, 'Grade deve permitir células não vazias: ' + asset.file);
}

assert.match(studio, /andar_ref:\{file:'references\/apoena\/apoena-corrida-multidirecional\.png'.*label:'prévia de andar com poses de corrida'\}/, 'A prévia de andar deve continuar identificada como corrida.');
assert.match(studio, /corrida:\{file:'references\/apoena\/apoena-corrida-multidirecional\.png',name:'apoena_corrida',cols:4,rows:4/, 'A corrida deve preservar a grade 4×4.');
assert.match(studio, /ataque_direita:\{file:'references\/apoena\/apoena-ataque-lateral-direita\.png',name:'apoena_ataque_direita',cols:6,rows:2/, 'Ataque à direita deve preservar a grade 6×2.');
assert.match(studio, /ataque_esquerda:\{file:'references\/apoena\/apoena-ataque-lateral-esquerda\.png',name:'apoena_ataque_lateral_esquerda',cols:6,rows:2/, 'Ataque à esquerda deve preservar a grade 6×2.');
assert.match(studio, /ataque_direita:\{[^}]*directions:\['direita','esquerda'\]/, 'A sequência de ataque à direita deve preservar a ordem das direções.');
assert.match(studio, /ataque_esquerda:\{[^}]*directions:\['esquerda','direita'\]/, 'A sequência de ataque à esquerda deve preservar a ordem das direções.');

console.log('PASSOU: concorrência entre todas as fontes do Estúdio, cancelamento da limpeza em lote, snapshot de salvamento e integridade estrutural das referências Apoena.');
