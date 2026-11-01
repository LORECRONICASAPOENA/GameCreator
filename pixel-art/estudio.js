(()=>{'use strict';
const $=id=>document.getElementById(id),num=(id,def=0)=>Number.isFinite(Number($(id).value))?Number($(id).value):def,clamp=(n,a,b)=>Math.max(a,Math.min(n,b));let image=null,imageUrl='',frames=[],current=-1,kind='personagem',tool='erase',undo=[],grid=false,dragStart=null,drawing=false,lastPreview=0,mesh={x:[],y:[]},meshMode=false,meshDrag=null,smartPending=null,smartBusy=false,batchBackup=null,detectedSprites=[];
const source=$('sourceCanvas'),sc=source.getContext('2d'),edit=$('editCanvas'),ec=edit.getContext('2d',{willReadFrequently:true}),preview=$('preview'),pc=preview.getContext('2d');
const msg=s=>{$('status').textContent=s},selected=()=>frames[current]||null;
function canvasCopy(c){const o=document.createElement('canvas');o.width=c.width;o.height=c.height;o.getContext('2d').drawImage(c,0,0);return o}
function crop(){if(!image)return null;const x=clamp(Math.round(num('cropX')),0,image.width-1),y=clamp(Math.round(num('cropY')),0,image.height-1);return {x,y,w:clamp(Math.round(num('cropW')),1,image.width-x),h:clamp(Math.round(num('cropH')),1,image.height-y)}}
function resetMesh(){if(!image)return;if(num('cols')>image.width||num('rows')>image.height){msg('A imagem tem menos pixels que as divisões solicitadas.');return}mesh=ApoenaCorte.grid(image.width,image.height,clamp(num('cols'),1,24),clamp(num('rows'),1,24),num('meshOffsetX'),num('meshOffsetY'),num('meshGapX'),num('meshGapY'))}
function setCrop(r){for(const [id,val] of [['cropX',r.x],['cropY',r.y],['cropW',r.w],['cropH',r.h]])$(id).value=val;drawSource()}
function scale(){return clamp(num('zoom')/100,.25,1.6)}
function drawSource(){if(!image)return;const z=scale();source.width=Math.max(1,Math.round(image.width*z));source.height=Math.max(1,Math.round(image.height*z));sc.imageSmoothingEnabled=false;sc.clearRect(0,0,source.width,source.height);sc.drawImage(image,0,0,source.width,source.height);if((grid||meshMode)&&mesh.x.length){sc.strokeStyle='#47eee9cb';sc.lineWidth=meshMode?2:1;for(let i=1;i<mesh.x.length-1;i++){sc.beginPath();sc.moveTo(mesh.x[i]*z,0);sc.lineTo(mesh.x[i]*z,source.height);sc.stroke()}for(let i=1;i<mesh.y.length-1;i++){sc.beginPath();sc.moveTo(0,mesh.y[i]*z);sc.lineTo(source.width,mesh.y[i]*z);sc.stroke()}}for(let i=0;i<detectedSprites.length;i++){const b=detectedSprites[i],x=b.x*z,y=b.y*z,w=b.w*z,h=b.h*z;sc.strokeStyle='#55e8a8';sc.lineWidth=2;sc.strokeRect(x,y,w,h);sc.fillStyle='#55e8a8';sc.fillRect(x,y,Math.max(17,Math.min(26,w)),14);sc.fillStyle='#06251c';sc.font='11px sans-serif';sc.fillText(String(i+1),x+3,y+11)}const r=crop();sc.lineWidth=2;sc.strokeStyle='#ffcf4e';sc.strokeRect(r.x*z,r.y*z,r.w*z,r.h*z)}
function add(rect,silent=false){if(!image){msg('Importe uma imagem primeiro.');return}if(rect.w<1||rect.h<1){msg('Recorte vazio: ajuste a malha.');return}if(frames.length>=160){msg('Limite de 160 quadros, para proteger o desempenho do celular.');return}const c=document.createElement('canvas');c.width=rect.w;c.height=rect.h;c.getContext('2d').drawImage(image,rect.x,rect.y,rect.w,rect.h,0,0,rect.w,rect.h);frames.push({canvas:c,original:canvasCopy(c),rect,action:$('action').value,direction:$('direction').value});if(!silent)pick(frames.length-1)}
function list(){const host=$('frames');host.replaceChildren();$('frameCount').textContent='('+frames.length+')';frames.forEach((f,i)=>{const b=document.createElement('button');if(i===current)b.className='selected';const thumb=document.createElement('canvas');thumb.width=55;thumb.height=52;const scale=Math.min(54/f.canvas.width,51/f.canvas.height);thumb.getContext('2d').drawImage(f.canvas,(55-f.canvas.width*scale)/2,52-f.canvas.height*scale,f.canvas.width*scale,f.canvas.height*scale);const title=document.createElement('div');title.textContent=i+1;b.append(thumb,title);b.onclick=()=>pick(i);host.append(b)})}
function pick(i){current=i;undo=[];smartPending=null;$('smartPanel').hidden=true;const f=selected();if(f){$('action').value=f.action||'parado';$('direction').value=f.direction||'nenhuma'}list();drawEdit()}
function drawEdit(){const f=selected();if(!f){ec.clearRect(0,0,edit.width,edit.height);return}const z=Math.max(.3,Math.min(1.8,380/Math.max(f.canvas.width,f.canvas.height)));edit.width=Math.max(1,Math.round(f.canvas.width*z));edit.height=Math.max(1,Math.round(f.canvas.height*z));ec.imageSmoothingEnabled=false;ec.drawImage(f.canvas,0,0,edit.width,edit.height);$('editStatus').textContent='Quadro '+(current+1)+' • '+f.action+' • '+f.direction+' • '+f.canvas.width+'×'+f.canvas.height+' px'}
function saveUndo(){if(batchBackup){batchBackup=null;$('smartUndoBatch').disabled=true}const f=selected();if(!f)return;undo.push(canvasCopy(f.canvas));if(undo.length>12)undo.shift()}
function xy(ev,canvas,width,height){const r=canvas.getBoundingClientRect();return{x:clamp(Math.floor((ev.clientX-r.left)*width/r.width),0,width-1),y:clamp(Math.floor((ev.clientY-r.top)*height/r.height),0,height-1)}}
function brush(ev){const f=selected();if(!f)return;const p=xy(ev,edit,f.canvas.width,f.canvas.height),ctx=f.canvas.getContext('2d',{willReadFrequently:true}),rad=clamp(num('brush'),2,80)/2;ctx.save();ctx.beginPath();ctx.arc(p.x,p.y,rad,0,Math.PI*2);ctx.clip();ctx.clearRect(p.x-rad,p.y-rad,rad*2,rad*2);if(tool==='restore')ctx.drawImage(f.original,0,0);ctx.restore();drawEdit()}
function removeColor(ev){const f=selected();if(!f)return;const p=xy(ev,edit,f.canvas.width,f.canvas.height),ctx=f.canvas.getContext('2d',{willReadFrequently:true}),w=f.canvas.width,h=f.canvas.height,data=ctx.getImageData(0,0,w,h),a=data.data,start=(p.y*w+p.x)*4,target=[a[start],a[start+1],a[start+2],a[start+3]],tol=clamp(num('tolerance'),0,255),visited=new Uint8Array(w*h),queue=[p.y*w+p.x];let head=0,count=0;visited[queue[0]]=1;while(head<queue.length){const pos=queue[head++],i=pos*4;if(Math.max(Math.abs(a[i]-target[0]),Math.abs(a[i+1]-target[1]),Math.abs(a[i+2]-target[2]),Math.abs(a[i+3]-target[3]))>tol)continue;a[i+3]=0;count++;const x=pos%w,y=Math.floor(pos/w);for(const v of [x>0?pos-1:-1,x<w-1?pos+1:-1,y>0?pos-w:-1,y<h-1?pos+w:-1])if(v>=0&&!visited[v]){visited[v]=1;queue.push(v)}}ctx.putImageData(data,0,0);drawEdit();list();msg('Removidos '+count+' pixels conectados. Confira o resultado.')}
function alpha(){const f=selected();if(!f)return;saveUndo();const ctx=f.canvas.getContext('2d',{willReadFrequently:true}),d=ctx.getImageData(0,0,f.canvas.width,f.canvas.height),limit=clamp(num('alpha'),0,255);for(let i=3;i<d.data.length;i+=4)if(d.data[i]<=limit)d.data[i]=0;ctx.putImageData(d,0,0);drawEdit();list();msg('Alfa fraco limpo.')}
function trim(){const f=selected();if(!f)return;const c=f.canvas,d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let x0=c.width,y0=c.height,x1=-1,y1=-1;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(d[(y*c.width+x)*4+3]>4){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)}if(x1<0){msg('Quadro vazio.');return}const pad=clamp(num('padding'),0,64),x=Math.max(0,x0-pad),y=Math.max(0,y0-pad),w=Math.min(c.width-x,x1-x+1+pad),h=Math.min(c.height-y,y1-y+1+pad);saveUndo();const n=document.createElement('canvas');n.width=w;n.height=h;n.getContext('2d').drawImage(c,x,y,w,h,0,0,w,h);f.canvas=n;drawEdit();list();msg('Bordas vazias cortadas: '+w+'×'+h+' px.')}

function getSmart(f){
  const c=f.canvas,w=c.width,h=c.height;
  const data=c.getContext('2d',{willReadFrequently:true}).getImageData(0,0,w,h);
  const analysis=ApoenaCorte.analyze(data,{tolerance:num('tolerance'),strength:$('smartStrength').value});
  return {data,analysis};
}
function previewSmart(mode){
  if(smartBusy)return;
  if(!frames.length){msg('Separe os quadros primeiro.');return}
  const i=mode==='todos'?0:Math.max(0,current),f=frames[i];
  try{
    const {data,analysis}=getSmart(f);
    const result=ApoenaCorte.cleaned(data,analysis);
    smartPending={mode,index:i};
    const imageCanvas=document.createElement('canvas');
    imageCanvas.width=data.width;imageCanvas.height=data.height;
    imageCanvas.getContext('2d').putImageData(new ImageData(result.data,data.width,data.height),0,0);
    const c=$('smartCanvas'),ctx=c.getContext('2d'),w=data.width,h=data.height,k=Math.min(182/w,182/h);
    ctx.clearRect(0,0,c.width,c.height);ctx.imageSmoothingEnabled=false;
    ctx.drawImage(imageCanvas,(192-w*k)/2,(192-h*k)/2,w*k,h*k);
    $('smartInfo').textContent=(mode==='todos'?'Prévia do primeiro de '+frames.length+' quadros. ':'Prévia deste quadro. ')
      +analysis.removed+' pixels serão tornados transparentes; '+analysis.fragments+' sobras pequenas detectadas. '
      +(analysis.warning||'Confira se o personagem está inteiro antes de aplicar.');
    $('smartPanel').hidden=false;
    msg('Prévia pronta. Nenhum pixel foi alterado ainda.');
  }catch(e){msg('Não foi possível calcular o corte: '+e.message)}
}
function cleanSingle(i){
  const f=frames[i];
  if(!f)return {applied:false,warning:true,removed:0};
  const {data,analysis}=getSmart(f);
  if(analysis.confidence==='revisar')return {applied:false,warning:true,removed:analysis.removed};
  if(analysis.removed>0){
    if(i===current)saveUndo();
    const result=ApoenaCorte.cleaned(data,analysis);
    f.canvas.getContext('2d').putImageData(new ImageData(result.data,data.width,data.height),0,0);
  }
  return {applied:true,warning:false,removed:analysis.removed};
}
function applySmart(){
  if(!smartPending||smartBusy)return;
  const pending=smartPending;smartPending=null;$('smartPanel').hidden=true;
  if(pending.mode!=='todos'){
    try{
      const f=frames[pending.index],{data,analysis}=getSmart(f);
      if(analysis.confidence==='revisar')msg('Quadro incerto: limpeza automática bloqueada para proteger o desenho. Use a borracha manual ou refaça o recorte.');
      else{
        saveUndo();
        f.canvas.getContext('2d').putImageData(new ImageData(ApoenaCorte.cleaned(data,analysis).data,data.width,data.height),0,0);
        drawEdit();list();msg('Corte Inteligente aplicado: '+analysis.removed+' pixels limpos. Desfazer disponível.');
      }
    }catch(e){msg('Falha na limpeza: '+e.message)}
    return;
  }
  const bytes=frames.reduce((n,f)=>n+f.canvas.width*f.canvas.height*4,0);
  if(bytes>32000000){msg('Lote muito grande para memória do celular. Use Corte Inteligente • quadro em grupos menores.');return}
  batchBackup=frames.map(f=>canvasCopy(f.canvas));$('smartUndoBatch').disabled=true;
  smartBusy=true;let i=0,cleaned=0,skipped=0,removed=0;
  function chunk(){
    const stop=Math.min(frames.length,i+2);
    for(;i<stop;i++){
      try{
        const r=cleanSingle(i);
        if(r.applied){cleaned++;removed+=r.removed}
        else skipped++;
      }catch(e){skipped++}
    }
    msg('Corte inteligente: '+i+'/'+frames.length+' quadros analisados...');
    if(i<frames.length)setTimeout(chunk,5);
    else{smartBusy=false;$('smartUndoBatch').disabled=false;drawEdit();list();
      msg('Limpeza concluída: '+cleaned+' quadros, '+removed+' pixels removidos, '+skipped+' quadros incertos preservados. Confira cada quadro antes de exportar.');
    }
  }
  chunk();
}
function safeName(){return ($('name').value||'apoena_sprite').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9_-]/g,'_').slice(0,48)}
function sheet(){const cell=clamp(num('cell'),128,512),cols=clamp(num('cols'),1,24),rows=Math.ceil(frames.length/cols),out=document.createElement('canvas');out.width=cols*cell;out.height=Math.max(1,rows)*cell;const ctx=out.getContext('2d');frames.forEach((f,i)=>{const c=f.canvas,scale=Math.min((cell-8)/c.width,(cell-8)/c.height),w=c.width*scale,h=c.height*scale;ctx.drawImage(c,(i%cols)*cell+(cell-w)/2,Math.floor(i/cols)*cell+cell-h-4,w,h)});return{out,cell,cols,rows}}
function readResourceMetadata(){const raw=$('resourceMetadata').value.trim();if(!raw)return {};const value=JSON.parse(raw);if(!value||Array.isArray(value)||typeof value!=='object')throw Error('Metadados específicos devem ser um objeto JSON.');if(JSON.stringify(value).length>50000)throw Error('Metadados específicos acima de 50 KB.');return value}
function manifest(){const s=sheet();return{schema:'apoena.pixelart.v1',version:1,name:safeName(),kind,resource:{habitat:String($('habitat').value||'').trim().slice(0,120),behavior:String($('behavior').value||'').trim().slice(0,120),metadata:readResourceMetadata()},texture:safeName()+'.png',transparent:true,anchor:{x:.5,y:1},cell_px:s.cell,columns:s.cols,rows:s.rows,fps:clamp(num('fps'),1,30),frames:frames.map((f,i)=>({index:i,action:f.action,direction:f.direction,source:f.rect,atlas:{x:(i%s.cols)*s.cell,y:Math.floor(i/s.cols)*s.cell,w:s.cell,h:s.cell}}))}}
function download(obj,name){const url=typeof obj==='string'?URL.createObjectURL(new Blob([obj],{type:'application/json'})):obj.toDataURL('image/png'),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();if(typeof obj==='string')setTimeout(()=>URL.revokeObjectURL(url),1000)}
function canvasBlob(canvas){return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Não foi possível preparar a imagem PNG.')),'image/png'))}
async function refreshLibrary(){
  const select=$('libraryAssets'),prior=select.value;
  try{
    const items=await ApoenaLibrary.listAssets({category:'all'});
    select.replaceChildren(new Option('Selecione um recurso da biblioteca…',''));
    items.forEach(item=>select.add(new Option(item.name+' · '+item.category+' · '+item.width+'×'+item.height,item.id)));
    if(items.some(item=>item.id===prior))select.value=prior;
    msg(items.length+' recurso(s) disponíveis na biblioteca central.');
  }catch(error){msg('Biblioteca indisponível: '+error.message)}
}
async function refreshLibraryProjects(){
  const select=$('libraryProjects'),prior=select.value;
  try{
    const all=await ApoenaLibrary.listProjects({includeData:false});
    const projects=all.filter(p=>p&&p.schema==='apoena.pixelart.v1');
    select.replaceChildren(new Option('Selecione um projeto…',''));
    projects.forEach(p=>select.add(new Option(p.name+' · '+Number((p.metadata||{}).frames||0)+' quadros',p.id)));
    if(projects.some(p=>p.id===prior))select.value=prior;
  }catch(error){msg('Não foi possível listar projetos: '+error.message)}
}
function projectData(){
  const data=manifest();
  data.name=String($('name').value||safeName()).trim().slice(0,80)||safeName();
  data.frames=frames.map((f,i)=>({...data.frames[i],dataUrl:f.canvas.toDataURL('image/png')}));
  return data;
}
async function loadProjectData(data){
  if(!data||data.schema!=='apoena.pixelart.v1'||!Array.isArray(data.frames)||data.frames.length<1||data.frames.length>160)
    throw Error('Projeto editável incompatível. Use o JSON de projeto exportado pelo Estúdio Pixel Art.');
  const loaded=[];let totalPixels=0;
  for(const item of data.frames){
    if(!item||typeof item.dataUrl!=='string'||!/^data:image\/(png|webp);base64,/.test(item.dataUrl))
      throw Error('O projeto não contém as imagens dos quadros. Exporte como Projeto JSON editável.');
    const canvas=await new Promise((resolve,reject)=>{
      const im=new Image();
      im.onload=()=>{
        try{
          if(!im.width||!im.height||im.width*im.height>32000000)throw Error('Quadro de imagem inválido ou grande demais.');
          totalPixels+=im.width*im.height;
          if(totalPixels*4>32000000)throw Error('Projeto excede 32 MB de quadros descompactados. Importe em partes menores.');
          const c=document.createElement('canvas');c.width=im.width;c.height=im.height;c.getContext('2d').drawImage(im,0,0);resolve(c);
        }catch(error){reject(error)}
      };
      im.onerror=()=>reject(Error('Não foi possível decodificar um quadro do projeto.'));
      im.src=item.dataUrl;
    });
    const source=item.source||{};
    const rect=[source.x,source.y,source.w,source.h].every(Number.isFinite)
      ?{x:source.x,y:source.y,w:source.w,h:source.h}:{x:0,y:0,w:canvas.width,h:canvas.height};
    loaded.push({canvas,original:canvasCopy(canvas),rect,action:String(item.action||'parado').trim().slice(0,40)||'parado',direction:String(item.direction||'nenhuma').trim().slice(0,20)||'nenhuma'});
  }
  if(imageUrl)URL.revokeObjectURL(imageUrl);
  imageUrl='';image=null;frames=loaded;current=-1;undo=[];batchBackup=null;smartPending=null;detectedSprites=[];$('autoDetectPanel').hidden=true;
  mesh={x:[],y:[]};grid=false;meshMode=false;
  $('smartUndoBatch').disabled=true;$('smartPanel').hidden=true;
  $('meshMode').classList.remove('selected');$('meshMode').setAttribute('aria-pressed','false');
  source.width=400;source.height=260;sc.clearRect(0,0,source.width,source.height);
  $('name').value=String(data.name||'apoena_sprite').slice(0,80);
  const resource=data.resource&&typeof data.resource==='object'?data.resource:{};
  $('habitat').value=String(resource.habitat||'').slice(0,120);$('behavior').value=String(resource.behavior||'').slice(0,120);
  $('resourceMetadata').value=JSON.stringify(resource.metadata&&typeof resource.metadata==='object'?resource.metadata:{},null,2);
  $('fps').value=clamp(Number(data.fps)||8,1,30);
  const cell=String(Number(data.cell_px)||256);
  $('cell').value=[...$('cell').options].some(o=>o.value===cell)?cell:'256';
  $('cols').value=clamp(Number(data.columns)||4,1,24);
  $('rows').value=clamp(Number(data.rows)||Math.ceil(loaded.length/Number($('cols').value)),1,24);
  const importedKind=String(data.kind||'');
  if(['personagem','animal','cenario','efeito'].includes(importedKind)){const button=$('categories').querySelector('[data-kind="'+importedKind+'"]');if(button)button.click()}
  $('sourceInfo').textContent='Projeto editável carregado · '+loaded.length+' quadros · a imagem de origem completa não está incluída.';
  $('cropStatus').textContent='Quadros restaurados do projeto editável.';
  pick(0);
  msg('Projeto editável importado: '+loaded.length+' quadros. Selecione um quadro para revisar ação e direção.');
}
$('libraryRefresh').onclick=refreshLibrary;
$('libraryProjectRefresh').onclick=refreshLibraryProjects;
$('libraryProjectSave').onclick=async()=>{
  if(!ready())return;
  const button=$('libraryProjectSave');button.disabled=true;
  try{
    const data=projectData(),serialized=JSON.stringify(data);
    if(serialized.length>18000000)throw Error('Projeto acima de 18 MB. Exporte em partes menores.');
    const name=String($('name').value||safeName()).trim().slice(0,80)||safeName();
    const saved=await ApoenaLibrary.saveProject({id:'pixelart-'+safeName(),name,schema:'apoena.pixelart.v1',type:'pixelart',data,metadata:{kind:kind,frames:frames.length,cell_px:data.cell_px,fps:data.fps}});
    await refreshLibraryProjects();$('libraryProjects').value=saved.id;
    msg('Projeto editável salvo na biblioteca central: '+saved.name+' ('+frames.length+' quadros).');
  }catch(error){msg('Falha ao salvar projeto editável: '+error.message)}
  finally{button.disabled=false}
};
$('libraryProjectOpen').onclick=async()=>{
  const id=$('libraryProjects').value;if(!id)return msg('Selecione um projeto editável salvo.');
  try{const project=await ApoenaLibrary.getProject(id);if(!project)throw Error('Projeto não encontrado.');await loadProjectData(project.data);$('libraryProjects').value=project.id}
  catch(error){msg('Falha ao abrir projeto: '+error.message)}
};
$('librarySave').onclick=async()=>{
  if(!ready())return;
  const button=$('librarySave');button.disabled=true;
  try{
    const output=sheet().out,blob=await canvasBlob(output);
    const sourceBlob=image?await new Promise((resolve,reject)=>{const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const ctx=c.getContext('2d');ctx.drawImage(image,0,0);c.toBlob(b=>b?resolve(b):reject(new Error('Falha ao preservar o original.')),'image/png')}):null;
    const item=await ApoenaLibrary.saveAsset({
      name:safeName(),category:kind==='cenario'?'cenario':kind==='personagem'?'personagem':kind,
      type:'spritesheet',blob:blob,originalBlob:sourceBlob,width:output.width,height:output.height,
      sourceWidth:image?image.width:0,sourceHeight:image?image.height:0,
      tags:[kind,'pixel-art'],metadata:{manifest:manifest(),frames:frames.map((f,i)=>({index:i,action:f.action,direction:f.direction,rect:f.rect}))},
      replaceExisting:true
    });
    let syncMessage='';
    if(window.opener&&!window.opener.closed&&blob.size<=10*1024*1024&&window.ApoenaCreatorBridge){
      try{
        const synced=await ApoenaCreatorBridge.request('saveAsset',{manifest:manifest(),png:output.toDataURL('image/png')});
        syncMessage=' Também sincronizada com a sessão V4.0 ('+synced.name+'). Use "Salvar projeto editável" para guardar o projeto completo.';
      }catch(error){syncMessage=' A biblioteca central foi salva, mas a sessão V4.0 não foi sincronizada: '+error.message}
    }else if(blob.size>10*1024*1024){
      syncMessage=' O PNG excede 10 MB; permanece salvo na biblioteca central, sem cópia base64 na sessão V4.0.';
    }else{
      syncMessage=' Para também gravar no projeto V4.0, abra o Estúdio pelo menu Pixel Art do Creator.';
    }
    await refreshLibrary();$('libraryAssets').value=item.id;msg('Spritesheet salva na biblioteca central: '+item.name+'.'+syncMessage);
  }catch(error){msg('Falha ao salvar na biblioteca: '+error.message)}
  finally{button.disabled=false}
};
$('libraryAssets').onchange=async()=>{
  const id=$('libraryAssets').value;if(!id)return;
  try{
    const item=await ApoenaLibrary.getAsset(id);if(!item)throw new Error('Recurso não encontrado.');
    const url=URL.createObjectURL(item.blob),im=new Image();
    im.onload=()=>{
      if(imageUrl)URL.revokeObjectURL(imageUrl);imageUrl=url;image=im;frames=[];current=-1;batchBackup=null;detectedSprites=[];$('autoDetectPanel').hidden=true;
      $('smartUndoBatch').disabled=true;
      resetMesh();setCrop({x:0,y:0,w:im.width,h:im.height});
      list();drawEdit();$('sourceInfo').textContent=item.name+' · biblioteca central · '+im.width+'×'+im.height+' px';
      msg('Recurso carregado. Se for uma spritesheet, ajuste linhas e colunas antes de separar os quadros.');
    };
    im.onerror=()=>{URL.revokeObjectURL(url);msg('Não foi possível abrir a imagem salva.')};im.src=url;
  }catch(error){msg('Falha ao carregar recurso: '+error.message)}
};
if(ApoenaLibrary.subscribe)ApoenaLibrary.subscribe(()=>{refreshLibrary();refreshLibraryProjects()});
refreshLibrary();refreshLibraryProjects();
function ready(){if(frames.length)return true;msg('Adicione quadros antes de exportar.');return false}
function animate(t){if(t-lastPreview>1000/clamp(num('fps'),1,30)){pc.clearRect(0,0,preview.width,preview.height);const action=$('action').value,direction=$('direction').value;const matching=frames.filter(f=>f.action===action&&f.direction===direction);const sequence=matching.length?matching:frames;const index=$('playing').checked?Math.floor(t/(1000/clamp(num('fps'),1,30)))%Math.max(1,sequence.length):Math.max(0,current);const f=$('playing').checked?sequence[index]:frames[index];if(f){const c=f.canvas,k=Math.min(178/c.width,178/c.height);pc.imageSmoothingEnabled=false;pc.drawImage(c,(192-c.width*k)/2,185-c.height*k,c.width*k,c.height*k)}lastPreview=t}requestAnimationFrame(animate)}
$('file').onchange=ev=>{const f=ev.target.files?.[0];if(!f)return;detectedSprites=[];$('autoDetectPanel').hidden=true;if(!/^image\/(png|webp|jpeg)$/.test(f.type)||f.size>22*1024*1024)return msg('Use PNG, WebP ou JPG com até 22MB.');if(imageUrl)URL.revokeObjectURL(imageUrl);imageUrl=URL.createObjectURL(f);const im=new Image();im.onload=()=>{if(im.width*im.height>32000000)return msg('Imagem muito grande para celular.');image=im;frames=[];current=-1;batchBackup=null;$('smartUndoBatch').disabled=true;const cols=clamp(num('cols'),1,24),rows=clamp(num('rows'),1,24);resetMesh();setCrop({x:0,y:0,w:Math.floor(im.width/cols),h:Math.floor(im.height/rows)});list();drawEdit();$('sourceInfo').textContent=f.name+' • '+im.width+'×'+im.height+' px';msg('Importado. Ajuste recortes e limpe antes de exportar.')};im.src=imageUrl};
$('projectFile').onchange=async ev=>{
 const file=ev.target.files?.[0];if(!file)return;
 try{if(file.size>18000000)throw Error('Arquivo acima de 18 MB.');const data=JSON.parse(await file.text());await loadProjectData(data)}
 catch(error){msg('Falha ao importar projeto editável: '+error.message)}
 ev.target.value='';
};
$('action').addEventListener('change',()=>{const f=selected();if(!f)return;f.action=String($('action').value||'parado').trim().slice(0,40)||'parado';list();drawEdit();msg('Ação do quadro atual atualizada.')});
$('direction').addEventListener('change',()=>{const f=selected();if(!f)return;f.direction=String($('direction').value||'nenhuma').trim().slice(0,20)||'nenhuma';list();drawEdit();msg('Direção do quadro atual atualizada.')});
for(const id of ['zoom','cols','rows','cropX','cropY','cropW','cropH','meshOffsetX','meshOffsetY','meshGapX','meshGapY'])$(id).addEventListener('input',()=>{if(image){if(['cols','rows','meshOffsetX','meshOffsetY','meshGapX','meshGapY'].includes(id)){resetMesh();if(id==='cols'||id==='rows')setCrop({x:0,y:0,w:Math.floor(image.width/clamp(num('cols'),1,24)),h:Math.floor(image.height/clamp(num('rows'),1,24))});else drawSource()}else drawSource()}});
$('grid').onclick=()=>{grid=!grid;drawSource()};
$('meshMode').onclick=()=>{meshMode=!meshMode;if(meshMode)grid=true;$('meshMode').classList.toggle('selected',meshMode);$('meshMode').setAttribute('aria-pressed',String(meshMode));drawSource();msg(meshMode?'Arraste uma linha azul para ajustar a malha. Toque numa célula para selecionar.':'Arraste para fazer um recorte livre.')};
$('meshReset').onclick=()=>{resetMesh();drawSource();msg('Malha reiniciada.')};
function runSpriteDetection(){
 if(!image)return msg('Importe uma imagem antes de detectar sprites.');
 try{
  const c=document.createElement('canvas');c.width=image.width;c.height=image.height;
  const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
  const result=ApoenaCorte.detectSprites(ctx.getImageData(0,0,c.width,c.height),{
   tolerance:num('tolerance'),strength:$('smartStrength').value,
   minArea:clamp(num('detectMinArea'),1,100000),mergeGap:clamp(num('detectMergeGap'),0,16),padding:clamp(num('detectPadding'),0,64)
  });
  detectedSprites=result.sprites;
  $('autoDetectStatus').textContent='Prévia: '+detectedSprites.length+' recorte(s) detectado(s). Nenhum quadro foi adicionado ainda. Clique num contorno verde para carregar os limites e ajustar manualmente. '+(result.warning||'Confira os limites antes de aplicar.');
  $('autoDetectPanel').hidden=false;drawSource();
  msg('Detecção pronta. Revise os contornos verdes; o original ainda não foi alterado.');
 }catch(error){detectedSprites=[];$('autoDetectPanel').hidden=true;drawSource();msg('Não foi possível detectar sprites: '+error.message)}
}
$('detectSprites').onclick=runSpriteDetection;
$('autoDetectApply').onclick=()=>{
 if(!image||!detectedSprites.length)return msg('Nenhum recorte detectado para adicionar.');
 if(frames.length+detectedSprites.length>160)return msg('A detecção excede o limite de 160 quadros; remova quadros ou reduza os recortes.');
 const first=frames.length,boxes=detectedSprites.slice();
 for(const b of boxes)add({x:b.x,y:b.y,w:b.w,h:b.h},true);
 detectedSprites=[];$('autoDetectPanel').hidden=true;pick(first);
 msg(boxes.length+' recorte(s) adicionados. Revise cada quadro e sua ordem antes de exportar.');
};
$('autoDetectCancel').onclick=()=>{detectedSprites=[];$('autoDetectPanel').hidden=true;drawSource();msg('Detecção cancelada; nenhum quadro foi adicionado.')};
$('smartSelected').onclick=()=>previewSmart('quadro');
$('smartAll').onclick=()=>previewSmart('todos');
$('smartApply').onclick=applySmart;
$('smartCancel').onclick=()=>{smartPending=null;$('smartPanel').hidden=true;msg('Corte cancelado: imagem preservada.')};
$('smartUndoBatch').onclick=()=>{if(smartBusy||!batchBackup)return;frames.forEach((f,i)=>{f.canvas=batchBackup[i]});batchBackup=null;$('smartUndoBatch').disabled=true;drawEdit();list();msg('Corte em lote desfeito: todos os quadros voltaram ao estado anterior.');};$('addFrame').onclick=()=>{const c=crop();if(c)add(c)};$('allGrid').onclick=()=>{if(!image)return msg('Importe imagem primeiro.');detectedSprites=[];$('autoDetectPanel').hidden=true;const cols=clamp(num('cols'),1,24),rows=clamp(num('rows'),1,24);if(cols*rows>160)return msg('Limite 160 quadros.');if(cols>image.width||rows>image.height)return msg('A malha tem mais divisões que pixels. Diminua linhas/colunas.');frames=[];if(mesh.x.length!==cols+1||mesh.y.length!==rows+1)resetMesh();for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const lx=mesh.x[x],ly=mesh.y[y];add({x:lx,y:ly,w:mesh.x[x+1]-lx,h:mesh.y[y+1]-ly},true)}pick(0);msg('Grade separada em '+frames.length+' quadros. Confira os cortes.');};
source.onpointerdown=ev=>{
 if(!image)return;source.setPointerCapture(ev.pointerId);
 const p=xy(ev,source,image.width,image.height);
 if(!meshMode&&detectedSprites.length){const hit=detectedSprites.find(b=>p.x>=b.x&&p.x<b.x+b.w&&p.y>=b.y&&p.y<b.y+b.h);if(hit){setCrop({x:hit.x,y:hit.y,w:hit.w,h:hit.h});msg('Limites detectados carregados nos campos de recorte; ajuste X/Y/largura/altura antes de adicionar.');return}}
 if(!meshMode){dragStart=p;return}
 const tolerance=14/scale();
 let axis=null,index=-1,distance=Infinity;
 for(let i=1;i<mesh.x.length-1;i++){const d=Math.abs(mesh.x[i]-p.x);if(d<distance){distance=d;axis='x';index=i}}
 for(let i=1;i<mesh.y.length-1;i++){const d=Math.abs(mesh.y[i]-p.y);if(d<distance){distance=d;axis='y';index=i}}
 if(distance<=tolerance){meshDrag={axis,index};return}
 const col=mesh.x.findIndex((v,i)=>i<mesh.x.length-1&&p.x>=v&&p.x<mesh.x[i+1]);
 const row=mesh.y.findIndex((v,i)=>i<mesh.y.length-1&&p.y>=v&&p.y<mesh.y[i+1]);
 if(col>=0&&row>=0)setCrop({x:mesh.x[col],y:mesh.y[row],w:mesh.x[col+1]-mesh.x[col],h:mesh.y[row+1]-mesh.y[row]});
};
source.onpointermove=ev=>{
 if(!meshDrag||!image)return;
 const p=xy(ev,source,image.width,image.height),a=mesh[meshDrag.axis],i=meshDrag.index;
 a[i]=clamp(Math.round(p[meshDrag.axis]),a[i-1]+2,a[i+1]-2);
 drawSource();
};
source.onpointerup=ev=>{
 if(meshDrag){meshDrag=null;msg('Divisória ajustada. Use Separar malha ajustada para recortar com a nova medida.');return}
 if(!dragStart)return;
 const p=xy(ev,source,image.width,image.height),a=dragStart;dragStart=null;
 setCrop({x:Math.min(a.x,p.x),y:Math.min(a.y,p.y),w:Math.max(1,Math.abs(a.x-p.x)),h:Math.max(1,Math.abs(a.y-p.y))});
};
source.onpointercancel=()=>{dragStart=null;meshDrag=null};
$('tools').querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>{tool=b.dataset.tool;$('tools').querySelectorAll('[data-tool]').forEach(v=>v.classList.toggle('selected',v===b))});
edit.onpointerdown=ev=>{if(!selected())return;ev.preventDefault();edit.setPointerCapture(ev.pointerId);saveUndo();if(tool==='remove')removeColor(ev);else{drawing=true;brush(ev)}};edit.onpointermove=ev=>{if(drawing)brush(ev)};edit.onpointerup=edit.onpointercancel=()=>{if(drawing){drawing=false;list()}};
$('undo').onclick=()=>{const f=selected();if(!f||!undo.length)return;f.canvas=undo.pop();drawEdit();list()};$('applyAlpha').onclick=alpha;$('trim').onclick=trim;$('resetFrame').onclick=()=>{const f=selected();if(!f)return;saveUndo();f.canvas=canvasCopy(f.original);drawEdit();list()};
$('previous').onclick=()=>{if(frames.length)pick((current+frames.length-1)%frames.length)};$('next').onclick=()=>{if(frames.length)pick((current+1)%frames.length)};$('duplicate').onclick=()=>{const f=selected();if(f){frames.splice(current+1,0,{...f,canvas:canvasCopy(f.canvas),original:canvasCopy(f.original)});pick(current+1)}};$('deleteFrame').onclick=()=>{if(current<0)return;frames.splice(current,1);pick(frames.length?Math.min(current,frames.length-1):-1)};$('moveLeft').onclick=()=>{if(current>0){[frames[current-1],frames[current]]=[frames[current],frames[current-1]];pick(current-1)}};$('moveRight').onclick=()=>{if(current<frames.length-1&&current>=0){[frames[current],frames[current+1]]=[frames[current+1],frames[current]];pick(current+1)}};
$('exportFrame').onclick=()=>{if(selected())download(selected().canvas,safeName()+'_'+(current+1)+'.png')};$('exportSheet').onclick=()=>{if(ready()){download(sheet().out,safeName()+'.png');msg('Spritesheet transparente exportada.')}};$('exportManifest').onclick=()=>{if(ready())download(JSON.stringify(manifest(),null,2),safeName()+'.godot.json')};$('exportProject').onclick=()=>{if(!ready())return;try{const serialized=JSON.stringify(projectData());if(serialized.length>18000000)throw Error('Projeto acima de 18 MB. Exporte em partes menores.');download(serialized,safeName()+'.projeto.json');msg('Projeto editável JSON exportado.')}catch(error){msg('Falha ao exportar projeto: '+error.message)}};
const apoenaPresets={andar_ref:{file:'references/apoena/apoena-corrida-multidirecional.png',name:'apoena_movimento_andar_previa',cols:4,rows:4,action:'andar',directions:['frente','costas','esquerda','direita'],label:'prévia de andar com poses de corrida'},corrida:{file:'references/apoena/apoena-corrida-multidirecional.png',name:'apoena_corrida',cols:4,rows:4,action:'correr',directions:['frente','costas','esquerda','direita'],label:'corrida multidirecional'},ataque_direita:{file:'references/apoena/apoena-ataque-lateral-direita.png',name:'apoena_ataque_direita',cols:6,rows:2,action:'atacar',directions:['direita','esquerda'],label:'ataque lateral para a direita'},ataque_esquerda:{file:'references/apoena/apoena-ataque-lateral-esquerda.png',name:'apoena_ataque_lateral_esquerda',cols:6,rows:2,action:'atacar',directions:['esquerda','direita'],label:'ataque lateral para a esquerda'}};
$('loadApoenaPreset').onclick=()=>{
 const preset=apoenaPresets[$('apoenaPreset').value];if(!preset)return;
 if((image||frames.length)&&!confirm('Carregar esta referência vai substituir os quadros atualmente abertos. Os arquivos originais permanecem intactos. Continuar?'))return;
 const im=new Image();
 im.onload=()=>{
  if(im.width*im.height>32000000)return msg('A referência excede o limite de imagem do editor.');
  if(imageUrl){URL.revokeObjectURL(imageUrl);imageUrl=''}
  image=im;frames=[];current=-1;undo=[];detectedSprites=[];batchBackup=null;smartPending=null;
  $('smartUndoBatch').disabled=true;$('autoDetectPanel').hidden=true;$('smartPanel').hidden=true;
  $('cols').value=preset.cols;$('rows').value=preset.rows;$('fps').value=8;
  $('meshOffsetX').value=0;$('meshOffsetY').value=0;$('meshGapX').value=0;$('meshGapY').value=0;
  resetMesh();
  for(let y=0;y<preset.rows;y++)for(let x=0;x<preset.cols;x++){
   $('action').value=preset.action;$('direction').value=preset.directions[y]||'nenhuma';
   add({x:mesh.x[x],y:mesh.y[y],w:mesh.x[x+1]-mesh.x[x],h:mesh.y[y+1]-mesh.y[y]},true);
  }
  $('name').value=preset.name;$('cell').value='384';
  setCrop({x:mesh.x[0],y:mesh.y[0],w:mesh.x[1]-mesh.x[0],h:mesh.y[1]-mesh.y[0]});
  const category=$('categories').querySelector('[data-kind="personagem"]');if(category)category.click();
  $('sourceInfo').textContent='Referência Apoena · '+preset.label+' · '+im.width+'×'+im.height+' px · '+frames.length+' quadros iniciais';
  pick(0);drawSource();msg('Quadros do Apoena carregados para edição. Confira os recortes e as direções antes de exportar.');
 };
 im.onerror=()=>msg('Não foi possível abrir a referência. Mantenha a pasta references/apoena junto ao Estúdio ou importe a imagem manualmente.');
 im.src=new URL(preset.file,document.baseURI).href;
};
$('categories').querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>{kind=b.dataset.kind;$('categories').querySelectorAll('[data-kind]').forEach(v=>v.classList.toggle('selected',v===b));msg('Categoria: '+kind)});const kindQuery=new URLSearchParams(location.search).get('tipo');if(kindQuery){const btn=$('categories').querySelector('[data-kind="'+kindQuery+'"]');if(btn)btn.click()}requestAnimationFrame(animate);
})();