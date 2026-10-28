/* Apoena Corte Inteligente 1.0
   Conservador: remove fundo uniforme conectado às bordas e pequenas sobras soltas.
   Não inventa áreas ocultas e não separa objetos fisicamente ligados. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object' && module.exports)module.exports=api;
  else root.ApoenaCorte=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  function analyze(src,options={}){
    if(!src||!src.data||!Number.isInteger(src.width)||!Number.isInteger(src.height))throw Error('Imagem inválida');
    const w=src.width,h=src.height,n=w*h,d=src.data;
    if(n<1||n>2500000||d.length!==n*4)throw Error('Quadro muito grande: limite 2,5 milhões de pixels');
    const tolerance=clamp(Number(options.tolerance??38),0,110);
    const strength=options.strength==='forte'?'forte':'seguro';
    const transparent=new Uint8Array(n),background=new Uint8Array(n),seen=new Uint8Array(n),remove=new Uint8Array(n);
    let alphaCount=0,edgeOpaque=0;
    for(let i=0;i<n;i++){transparent[i]=(d[i*4+3]<=12)?1:0;if(transparent[i])alphaCount++}
    // Cores de amostra nas quatro bordas: fundo opaco uniforme somente com confiança.
    const patches=[];
    const radius=Math.max(1,Math.min(5,Math.floor(Math.min(w,h)/10)));
    const corners=[[0,0],[w-radius,0],[0,h-radius],[w-radius,h-radius]];
    for(const [x0,y0] of corners){let r=0,g=0,b=0,c=0;for(let y=y0;y<Math.min(h,y0+radius);y++)for(let x=x0;x<Math.min(w,x0+radius);x++){const p=(y*w+x)*4;if(d[p+3]<240)continue;r+=d[p];g+=d[p+1];b+=d[p+2];c++}if(c)patches.push([r/c,g/c,b/c]);}
    let ref=[0,0,0],vary=Infinity;
    if(patches.length===4){
      ref=[0,1,2].map(k=>patches.reduce((s,p)=>s+p[k],0)/4);
      vary=Math.max(...patches.map(p=>Math.max(Math.abs(p[0]-ref[0]),Math.abs(p[1]-ref[1]),Math.abs(p[2]-ref[2]))));
    }
    // Evitar transformar a cor de um objeto em fundo quando suas bordas diferem.
    const opaque=alphaCount/n<.03 && vary<=Math.max(20,tolerance*.78);
    const similar=i=>{
      const j=i*4;
      return d[j+3]>12 && Math.max(Math.abs(d[j]-ref[0]),Math.abs(d[j+1]-ref[1]),Math.abs(d[j+2]-ref[2]))<=tolerance;
    };
    let bgCount=0;
    if(opaque){
      const queue=new Int32Array(n);let len=0,head=0;
      function seed(pos){if(!seen[pos]&&similar(pos)){seen[pos]=1;queue[len++]=pos}}
      for(let x=0;x<w;x++){seed(x);seed((h-1)*w+x)}
      for(let y=0;y<h;y++){seed(y*w);seed(y*w+w-1)}
      while(head<len){
        const v=queue[head++],x=v%w,y=(v/w)|0;
        background[v]=1;bgCount++;
        if(x>0)seed(v-1);if(x+1<w)seed(v+1);
        if(y>0)seed(v-w);if(y+1<h)seed(v+w);
      }
      // Não limpar se a cor detectada for a maior parte de um desenho, nem minúscula.
      if(bgCount/n<.08||bgCount/n>=1){background.fill(0);bgCount=0;}
      else for(let i=0;i<n;i++)if(background[i])remove[i]=1;
    }
    const body=new Uint8Array(n);
    for(let i=0;i<n;i++)if(!transparent[i]&&!background[i])body[i]=1;
    const marked=new Uint8Array(n),q=new Int32Array(n),components=[];
    for(let start=0;start<n;start++){
      if(!body[start]||marked[start])continue;
      let head=0,end=1,area=0,sx=0,sy=0,minX=w,maxX=0,minY=h,maxY=0,border=0;
      q[0]=start;marked[start]=1;
      while(head<end){
        const pos=q[head++],x=pos%w,y=(pos/w)|0;area++;sx+=x;sy+=y;
        minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
        if(x===0||y===0||x===w-1)border++;
        for(let yy=Math.max(0,y-1);yy<=Math.min(h-1,y+1);yy++)for(let xx=Math.max(0,x-1);xx<=Math.min(w-1,x+1);xx++){
          const other=yy*w+xx;
          if(!marked[other]&&body[other]){marked[other]=1;q[end++]=other}
        }
      }
      components.push({area,xc:sx/area,yc:sy/area,minX,maxX,minY,maxY,border});
    }
    let main=null,mainScore=-Infinity;
    for(const c of components){
      const dx=(c.xc-(w-1)/2)/(w/2),dy=(c.yc-(h-1)/2)/(h/2);
      const proximity=clamp(1-Math.sqrt(dx*dx+dy*dy)/1.5,0,1);
      const score=c.area*(.65+.7*proximity);
      if(score>mainScore){main=c;mainScore=score}
    }
    const total=components.reduce((s,c)=>s+c.area,0);
    const minComponent=main?.area||0;
    const removalCandidates=[];
    for(const c of components){
      if(c===main)continue;
      const dcenter=Math.hypot((c.xc-w/2)/(w/2),(c.yc-h/2)/(h/2));
      const edge=c.minX<w*.13||c.maxX>w*.87||c.minY<h*.13;
      const small=c.area<Math.max(9,minComponent*(strength==='forte'?.14:.055));
      if(small && (edge|| (strength==='forte'&&dcenter>.62)))removalCandidates.push(c);
    }
    const uncertain=(!opaque&&alphaCount/n<.03)||!main
      || (main.border>Math.max(4,main.area*.008))
      || (total>0&&main.area/total<.36)
      || (alphaCount/n<.03&&!opaque);
    // Reconstituir componentes escolhidos localmente, com máscara pequena e sem tocar no corpo principal.
    if(removalCandidates.length){
      const removeComponents=new Set(removalCandidates);
      marked.fill(0);
      for(let start=0;start<n;start++){
        if(!body[start]||marked[start])continue;
        let head=0,end=1,area=0,sx=0,sy=0;marked[start]=1;q[0]=start;
        while(head<end){
          const pos=q[head++],x=pos%w,y=(pos/w)|0;area++;sx+=x;sy+=y;
          for(let yy=Math.max(0,y-1);yy<=Math.min(h-1,y+1);yy++)for(let xx=Math.max(0,x-1);xx<=Math.min(w-1,x+1);xx++){
            const next=yy*w+xx;if(!marked[next]&&body[next]){marked[next]=1;q[end++]=next}
          }
        }
        if(removalCandidates.some(c=>c.area===area&&Math.abs(c.xc-sx/area)<.01&&Math.abs(c.yc-sy/area)<.01)){
          for(let j=0;j<end;j++)remove[q[j]]=1;
        }
      }
    }
    const beforeTransparent=alphaCount;
    let removed=0;
    for(let i=0;i<n;i++)if(remove[i]&&d[i*4+3]>0)removed++;
    return {width:w,height:h,mask:remove,removed,backgroundRemoved:bgCount,components:components.length,
      fragments:removalCandidates.length,confidence:uncertain?'revisar':'normal',
      warning:uncertain?'Confira manualmente: figuras encostadas ou fundo irregular não podem ser separados com segurança.':'',
      opaqueBackground:opaque,foregroundPixels:total,alreadyTransparent:beforeTransparent,
      backgroundMask:background,
      componentBounds:components.map(c=>({x:c.minX,y:c.minY,w:c.maxX-c.minX+1,h:c.maxY-c.minY+1,area:c.area,touchesBorder:c.minX===0||c.minY===0||c.maxX===w-1||c.maxY===h-1}))};
  }
  function cleaned(imageData,analysis){
    const out=new Uint8ClampedArray(imageData.data);
    for(let i=0;i<analysis.mask.length;i++)if(analysis.mask[i])out[i*4+3]=0;
    return {width:imageData.width,height:imageData.height,data:out};
  }
  function detectSprites(src,options={}){
    const analysis=analyze(src,options),w=src.width,h=src.height;
    const minArea=Number.isFinite(Number(options.minArea))&&Number(options.minArea)>=1
      ?Math.floor(Number(options.minArea)):Math.max(8,Math.floor(w*h*.00002));
    const mergeGap=Number.isFinite(Number(options.mergeGap))
      ?clamp(Math.floor(Number(options.mergeGap)),0,16):1;
    const padding=Number.isFinite(Number(options.padding))
      ?clamp(Math.floor(Number(options.padding)),0,64):0;
    const boxes=analysis.componentBounds.filter(c=>c.area>=minArea).map(c=>({...c}));
    let merged=true;
    while(merged){
      merged=false;
      outer:for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
        const a=boxes[i],b=boxes[j];
        const gapX=Math.max(0,Math.max(a.x-(b.x+b.w),b.x-(a.x+a.w)));
        const gapY=Math.max(0,Math.max(a.y-(b.y+b.h),b.y-(a.y+a.h)));
        if(gapX<=mergeGap&&gapY<=mergeGap){
          const left=Math.min(a.x,b.x),top=Math.min(a.y,b.y),right=Math.max(a.x+a.w,b.x+b.w),bottom=Math.max(a.y+a.h,b.y+b.h);
          a.x=left;a.y=top;a.w=right-left;a.h=bottom-top;a.area+=b.area;
          a.touchesBorder=a.touchesBorder||b.touchesBorder;boxes.splice(j,1);merged=true;break outer;
        }
      }
    }
    boxes.sort((a,b)=>a.y-b.y||a.x-b.x);
    const sprites=boxes.map(b=>({
      x:Math.max(0,b.x-padding),y:Math.max(0,b.y-padding),
      w:Math.min(w,b.x+b.w+padding)-Math.max(0,b.x-padding),
      h:Math.min(h,b.y+b.h+padding)-Math.max(0,b.y-padding),
      area:b.area,touchesBorder:b.touchesBorder
    }));
    const warnings=[];
    if(analysis.warning)warnings.push(analysis.warning);
    if(sprites.length<2)warnings.push('Foram encontrados menos de dois sprites separados; revise o resultado ou use a grade/manual.');
    if(sprites.some(b=>b.touchesBorder))warnings.push('Um ou mais sprites tocam a borda da imagem; confira os limites.');
    return {width:w,height:h,sprites,components:analysis.components,confidence:warnings.length?'revisar':'normal',warning:warnings.join(' '),backgroundRemoved:analysis.backgroundRemoved};
  }
  function grid(width,height,cols,rows,offsetX=0,offsetY=0,gapX=0,gapY=0){
    cols=clamp(Math.floor(cols),1,24);rows=clamp(Math.floor(rows),1,24);
    // Divisórias em pixels inteiros, para respeitar tiles sem difusão por arredondamento.
    const a=Array.from({length:cols+1},(_,i)=>clamp(Math.round(i*width/cols+offsetX+(i-cols/2)*gapX),0,width));
    const b=Array.from({length:rows+1},(_,i)=>clamp(Math.round(i*height/rows+offsetY+(i-rows/2)*gapY),0,height));
    a[0]=0;a[cols]=width;b[0]=0;b[rows]=height;
    for(let i=1;i<a.length-1;i++)a[i]=clamp(a[i],a[i-1]+1,width-(cols-i));
    for(let i=1;i<b.length-1;i++)b[i]=clamp(b[i],b[i-1]+1,height-(rows-i));
    return {x:a,y:b};
  }
  return {analyze,cleaned,detectSprites,grid};
});