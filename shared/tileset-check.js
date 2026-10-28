/* Verificação conservadora de bordas para tilesets Apoena. Não altera a imagem. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.ApoenaTilesetCheck=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clamp=(n,a,b)=>Math.max(a,Math.min(n,b));
  function analyze(imageData,columns,rows,options){
    options=options||{};
    if(!imageData||!imageData.data||!Number.isInteger(imageData.width)||!Number.isInteger(imageData.height)||imageData.width<1||imageData.height<1)
      throw Error('Imagem inválida para verificar encaixes.');
    const width=imageData.width,height=imageData.height,pixels=width*height,data=imageData.data;
    const maxPixels=Number.isFinite(Number(options.maxPixels))?Math.max(1,Number(options.maxPixels)):4000000;
    if(pixels>maxPixels)throw Error('Tileset grande demais para a verificação segura; reduza a imagem ou verifique uma versão menor.');
    if(data.length!==pixels*4)throw Error('Dados RGBA incompatíveis com as dimensões.');
    columns=clamp(Math.floor(Number(columns)||1),1,32);
    rows=clamp(Math.floor(Number(rows)||1),1,32);
    const alphaThreshold=clamp(Number.isFinite(Number(options.alphaThreshold))?Number(options.alphaThreshold):250,0,255);
    const maxTransparentRatio=clamp(Number.isFinite(Number(options.maxTransparentRatio))?Number(options.maxTransparentRatio):0.05,0,1);
    const checkRepeatSeams=options.checkRepeatSeams!==false;
    const colorTolerance=clamp(Number.isFinite(Number(options.colorTolerance))?Number(options.colorTolerance):0,0,255);
    const divisible=width%columns===0&&height%rows===0;
    const tiles=[];
    for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
      const x0=Math.floor(col*width/columns),x1=Math.floor((col+1)*width/columns);
      const y0=Math.floor(row*height/rows),y1=Math.floor((row+1)*height/rows);
      const w=x1-x0,h=y1-y0;
      if(w<1||h<1)continue;
      const edgeStats={top:{transparent:0,total:w},right:{transparent:0,total:h},bottom:{transparent:0,total:w},left:{transparent:0,total:h}};
      for(let x=x0;x<x1;x++){
        if(data[(y0*width+x)*4+3]<alphaThreshold)edgeStats.top.transparent++;
        if(data[((y1-1)*width+x)*4+3]<alphaThreshold)edgeStats.bottom.transparent++;
      }
      for(let y=y0;y<y1;y++){
        if(data[(y*width+x0)*4+3]<alphaThreshold)edgeStats.left.transparent++;
        if(data[(y*width+x1-1)*4+3]<alphaThreshold)edgeStats.right.transparent++;
      }
      const edges=Object.keys(edgeStats).filter(name=>edgeStats[name].transparent>0);
      const total=Object.values(edgeStats).reduce((sum,e)=>sum+e.total,0);
      const transparent=Object.values(edgeStats).reduce((sum,e)=>sum+e.transparent,0);
      const ratio=total?transparent/total:0;
      const pixelDiffers=(a,b)=>{for(let k=0;k<4;k++)if(Math.abs(data[a*4+k]-data[b*4+k])>colorTolerance)return true;return false};
      let repeatX=false,repeatY=false;
      for(let y=y0;y<y1;y++)if(pixelDiffers(y*width+x0,y*width+x1-1)){repeatX=true;break}
      for(let x=x0;x<x1;x++)if(pixelDiffers(y0*width+x,(y1-1)*width+x)){repeatY=true;break}
      if(ratio>maxTransparentRatio||(checkRepeatSeams&&(repeatX||repeatY)))tiles.push({
        tile:row*columns+col+1,row:row+1,column:col+1,x:x0,y:y0,width:w,height:h,
        transparentPixels:transparent,edgePixels:total,transparentRatio:ratio,edges,repeatX,repeatY
      });
    }
    const warnings=[];
    if(!divisible)warnings.push('As dimensões '+width+'×'+height+' não são divisíveis pela grade '+columns+'×'+rows+'; alguns tiles terão tamanhos diferentes.');
    const transparentTiles=tiles.filter(t=>t.transparentRatio>maxTransparentRatio).length;
    const seamTiles=tiles.filter(t=>t.repeatX||t.repeatY).length;
    if(transparentTiles)warnings.push(transparentTiles+' tile(s) têm pixels transparentes/semitransparentes nas bordas e podem formar frestas.');
    if(checkRepeatSeams&&seamTiles)warnings.push(seamTiles+' tile(s) têm bordas diferentes ao repetir a mesma peça; tiles de transição podem ser assimétricos por projeto.');
    if(!transparentTiles&&!seamTiles)warnings.push('Nenhum tile ultrapassou os limites de transparência ou repetição configurados.');
    return {width,height,columns,rows,cellWidth:divisible?width/columns:null,cellHeight:divisible?height/rows:null,divisible,ok:divisible&&tiles.length===0,tiles,warnings,alphaThreshold,maxTransparentRatio,checkRepeatSeams,colorTolerance};
  }
  return Object.freeze({analyze});
});
