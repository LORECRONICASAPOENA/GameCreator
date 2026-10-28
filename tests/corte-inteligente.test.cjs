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
const grid=cutoff.grid(121,121,4,3,0,0,2,-2);
assert.equal(grid.x.length,5);assert.equal(grid.y.length,4);
for(const axis of [grid.x,grid.y])for(let i=1;i<axis.length;i++)assert.ok(axis[i]>axis[i-1],'divisórias crescentes');
const html=fs.readFileSync(path.join(__dirname,'../pixel-art/estudio.html'),'utf8');
const js=fs.readFileSync(path.join(__dirname,'../pixel-art/estudio.js'),'utf8');
assert.doesNotThrow(()=>new Function(js),'script UI válido');
for(const id of ['meshMode','meshReset','smartSelected','smartAll','smartPanel','smartApply','smartCancel','smartUndoBatch'])
  assert.ok(html.includes('id="'+id+'"'),'falta controle '+id);
assert.ok(html.indexOf('corte-inteligente.js')<html.indexOf('estudio.js'),'ordem de scripts');
console.log('CORTE INTELIGENTE OK: malha ajustável, transparência, isolamento, proteção e UI');
