// Regressões GC-KEY-007 (digitação x atalhos WASD dentro de Shadow DOM) e
// GC-TILE-002 (perfil de tileset preservado/validado ao recarregar da biblioteca ou de JSON).
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');

// ---------- GC-KEY-007 ----------
const pixelSrc=read('pixel-art/modulo-integrado.js');
const block=pixelSrc.match(/const mapping=[\s\S]*?(?=document\.addEventListener\("keydown")/);
assert.ok(block,'bloco de teclado localizado em pixel-art/modulo-integrado.js');
const ctx=vm.createContext({});
vm.runInContext(block[0]+';this.typing=typing;this.movementKey=movementKey;',ctx);
const {typing,movementKey}=ctx;

const el=(tagName,extra={})=>({nodeType:1,tagName,isContentEditable:false,...extra});
const host=el('DIV');
const shadowInput=el('INPUT');
// Em um Shadow DOM, o document enxerga o host como target; o campo real só aparece em composedPath().
const shadowEvent={key:'a',target:host,composedPath:()=>[shadowInput,{nodeType:11},host,el('BODY')]};
assert.equal(typing(shadowEvent),true,'campo dentro de Shadow DOM é reconhecido como digitação');
assert.equal(typing({key:'a',target:el('TEXTAREA'),composedPath:()=>[]}),true,'textarea direto');
assert.equal(typing({key:'a',target:el('SELECT')}),true,'select sem composedPath');
assert.equal(typing({key:'a',target:el('DIV',{isContentEditable:true}),composedPath:()=>[]}),true,'contenteditable');
assert.equal(typing({key:'a',target:el('CANVAS'),composedPath:()=>[el('CANVAS'),host]}),false,'canvas da arena não é campo editável');
assert.equal(typing({key:'a',target:null}),false,'evento sem alvo não quebra');

for(const [key,dir] of [['w','up'],['a','left'],['s','down'],['d','right'],['W','up'],['A','left'],['ArrowUp','up'],['ArrowLeft','left'],['ArrowDown','down'],['ArrowRight','right']])
  assert.equal(movementKey({key}),dir,'tecla '+key+' mapeia para '+dir);
assert.equal(movementKey({key:'a',ctrlKey:true}),undefined,'Ctrl+A (selecionar tudo) não move o personagem');
assert.equal(movementKey({key:'d',metaKey:true}),undefined,'Cmd+D não move o personagem');
assert.equal(movementKey({key:'s',altKey:true}),undefined,'Alt+S não move o personagem');
assert.equal(movementKey({key:'x'}),undefined,'tecla sem atalho');
assert.equal(movementKey({key:undefined}),undefined,'evento sem key (autofill) não quebra');

// O keydown precisa consultar typing(e) e o keyup não pode chamar preventDefault.
assert.match(pixelSrc,/typing\(e\)\)return/,'keydown usa a detecção por composedPath');
const keyup=pixelSrc.match(/document\.addEventListener\("keyup",[^\n]*/)[0];
assert.ok(!keyup.includes('preventDefault'),'keyup não bloqueia a digitação');

// ---------- GC-TILE-002 (persistência do perfil) ----------
for(const file of ['map-editor/index.html','map-editor/modulo-integrado.js']){
  const src=read(file);
  const m=src.match(/const SHEET_PROFILES=(\[[^\]]*\]);function safeProfile\(p\)\{[^}]*\}/);
  assert.ok(m,file+' define safeProfile');
  const c=vm.createContext({});
  vm.runInContext(m[0]+';this.safeProfile=safeProfile;this.list=SHEET_PROFILES;',c);
  assert.deepEqual([...c.list],['agar24','grass16','manual'],file+': perfis conhecidos');
  assert.equal(c.safeProfile('agar24'),'agar24',file+': preserva agar24');
  assert.equal(c.safeProfile('grass16'),'grass16',file+': preserva grass16');
  assert.equal(c.safeProfile('manual'),'manual',file+': preserva manual');
  assert.equal(c.safeProfile('<img onerror=1>'),'manual',file+': valor desconhecido vira manual');
  assert.equal(c.safeProfile(undefined),'manual',file+': ausência vira manual');
  assert.equal(c.safeProfile('__proto__'),'manual',file+': chaves de protótipo rejeitadas');
  assert.ok(!/sheetProfile=d\.sheetProfile\|\|'manual'/.test(src),file+': nenhuma importação usa o perfil sem validação');
}
const editor=read('map-editor/index.html');
const loader=editor.match(/\$\('loadTileset'\)\.onclick=async\(\)=>\{[\s\S]*?\n\};/);
assert.ok(loader,'carregamento de tileset da biblioteca localizado');
assert.ok(!/sheetProfile='manual'/.test(loader[0]),'carregar da biblioteca não força mais o perfil manual');
assert.ok(/sheetProfile=safeProfile\(item\.metadata&&item\.metadata\.profile\)/.test(loader[0]),'carregar da biblioteca restaura o perfil salvo nos metadados');

console.log('TECLADO E PERFIL OK: digitação em Shadow DOM, modificadores, perfis de tileset validados e restaurados');
