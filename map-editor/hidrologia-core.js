/* Apoena - hidrologia 2D v1. Motor sem renderizacao e sem dependencia externa.
   Unidades normalizadas para gameplay, nao escala hidraulica real. */
(function(root){
"use strict";
const SCHEMA="apoena.hidrologia.v1";
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const valido=(v,padrao)=>Number.isFinite(Number(v))?Number(v):padrao;
function arr(input,n,defaultValue,min,max) {
  if(!Array.isArray(input)||input.length!==n)return Array(n).fill(defaultValue);
  return input.map(v=>clamp(valido(v,defaultValue),min,max));
}
class Hidrologia{
  constructor(width,height,config={}){
    if(!Number.isInteger(width)||!Number.isInteger(height)||width<4||height<4||width>160||height>160)throw Error("Grade hidrologica invalida.");
    this.width=width;this.height=height;this.size=width*height;
    this.elevation=arr(config.elevation||config.heights,this.size,0,-6,16);
    this.capacity=arr(config.capacity,this.size,0,0,6);
    this.water=arr(config.water,this.size,0,0,12);
    this.moisture=arr(config.moisture,this.size,.36,0,1);
    this.permeability=arr(config.permeability,this.size,.45,0,1);
    this.hardness=arr(config.hardness,this.size,.35,0,1);
    this.sediment=arr(config.sediment,this.size,0,0,6);
    this.protected=arr(config.protected,this.size,0,0,1);
    this.ocean=arr(config.ocean,this.size,0,0,1);
    this.flow=Array(this.size).fill(0);
    this.ticks=Math.max(0,Math.floor(valido(config.ticks,0)));
  }
  index(x,y){return y*this.width+x}
  valid(x,y){return Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x<this.width&&y<this.height}
  get(x,y){if(!this.valid(x,y))return null;const i=this.index(x,y);return {x,y,elevation:this.elevation[i],capacity:this.capacity[i],water:this.water[i],moisture:this.moisture[i],flow:this.flow[i],kind:this.kind(i),health:this.vegetation(i)}}
  paintBasin(cx,cy,radius,level){
    const n=clamp(Math.round(valido(level,1)),1,6),r=clamp(Math.round(valido(radius,2)),1,40);
    for(let y=Math.max(0,Math.floor(cy-r));y<=Math.min(this.height-1,Math.ceil(cy+r));y++)for(let x=Math.max(0,Math.floor(cx-r));x<=Math.min(this.width-1,Math.ceil(cx+r));x++){
      const d=Math.hypot(x-cx,y-cy);if(d>r)continue;
      const i=this.index(x,y),depth=Math.max(1,Math.round(n*(1-d/(r+1))));
      this.elevation[i]=Math.min(this.elevation[i],-depth);this.capacity[i]=Math.max(this.capacity[i],n);
    }
  }
  paintElevation(cx,cy,radius,height){
    const r=clamp(Math.round(valido(radius,1)),0,40),h=clamp(valido(height,0),-6,16);
    for(let y=Math.max(0,cy-r);y<=Math.min(this.height-1,cy+r);y++)for(let x=Math.max(0,cx-r);x<=Math.min(this.width-1,cx+r);x++){
      if(Math.hypot(x-cx,y-cy)<=r&&!this.protected[this.index(x,y)])this.elevation[this.index(x,y)]=h;
    }
  }
  setSoil(x,y,options={}){
    if(!this.valid(x,y))return false;const i=this.index(x,y);
    for(const key of ["permeability","hardness","protected"]){
      if(Object.prototype.hasOwnProperty.call(options,key))this[key][i]=clamp(valido(options[key],this[key][i]),0,1);
    }
    return true;
  }
  kind(i){
    if(this.ocean[i]&&this.water[i]>.1)return "oceano";
    if(this.water[i]<.07)return "seco";
    if(this.flow[i]>.15)return this.flow[i]>.45?"rio":"riacho";
    if(this.water[i]<.33)return "poca";
    return this.water[i]<.95?"lagoa":"lago";
  }
  vegetation(i){
    if(this.water[i]>.55&&this.moisture[i]>.85)return "inundada";
    if(this.moisture[i]<.16)return "seca";
    return "saudavel";
  }
  advance(options={}){
    const rain=clamp(valido(options.rain,0),0,3),sun=clamp(valido(options.sun,0.025),0,.3);
    const dt=clamp(valido(options.dt,1),.01,4),delta=Array(this.size).fill(0);
    let rainAdded=0,infiltrated=0,evaporated=0,eroded=0,discharged=0;
    for(let i=0;i<this.size;i++){
      const rainfall=rain*dt;this.water[i]=clamp(this.water[i]+rainfall,0,12);rainAdded+=rainfall;
      const infiltration=Math.min(this.water[i],this.permeability[i]*(1-this.moisture[i])*.075*dt);
      this.water[i]-=infiltration;infiltrated+=infiltration;
      this.moisture[i]=clamp(this.moisture[i]+infiltration*.55+rain*.12*dt-sun*.12*dt,0,1);
      const evaporation=Math.min(this.water[i],sun*.18*dt);this.water[i]-=evaporation;evaporated+=evaporation;
      this.flow[i]=0;
    }
    // Cada celula elege um unico destino: evita gastar mais agua do que possui.
    for(let y=0;y<this.height;y++)for(let x=0;x<this.width;x++){
      const i=this.index(x,y),w=this.water[i];if(w<=.002)continue;
      const surface=this.elevation[i]+w;
      let dest=-1,drop=0;
      for(const [dx,dy] of [[0,1],[1,0],[0,-1],[-1,0]]){
        const nx=x+dx,ny=y+dy;if(!this.valid(nx,ny))continue;
        const j=this.index(nx,ny),gradient=surface-(this.elevation[j]+this.water[j]);
        if(gradient>drop){drop=gradient;dest=j}
      }
      if(dest<0)continue;
      const moved=Math.min(w*.42,drop*.23,.8);
      if(moved<=.001)continue;
      delta[i]-=moved;delta[dest]+=moved;this.flow[i]+=moved;discharged+=moved;
    }
    for(let i=0;i<this.size;i++)this.water[i]=clamp(this.water[i]+delta[i],0,12);
    for(let i=0;i<this.size;i++){
      if(!this.protected[i]&&this.flow[i]>.05&&this.moisture[i]>.45){
        const amount=Math.min(.06,this.flow[i]*(1-this.hardness[i])*.045*dt);
        this.elevation[i]=Math.max(-6,this.elevation[i]-amount);
        this.sediment[i]=clamp(this.sediment[i]+amount*.7,0,6);
        eroded+=amount;
      } else if(!this.protected[i]&&this.flow[i]<.025&&this.water[i]>.08&&this.sediment[i]>.003){
        const deposit=Math.min(this.sediment[i],.003*dt);
        this.elevation[i]=Math.min(16,this.elevation[i]+deposit);this.sediment[i]-=deposit;
      }
    }
    this.ticks++;
    return {ticks:this.ticks,rainAdded,infiltrated,evaporated,eroded,discharged,wet:this.water.filter(w=>w>.07).length,channels:this.flow.filter(f=>f>.15).length,waterTotal:this.water.reduce((s,v)=>s+v,0)};
  }
  serialize(){
    return {schema:SCHEMA,width:this.width,height:this.height,ticks:this.ticks,
      elevation:this.elevation.slice(),capacity:this.capacity.slice(),water:this.water.slice(),
      moisture:this.moisture.slice(),permeability:this.permeability.slice(),
      hardness:this.hardness.slice(),sediment:this.sediment.slice(),protected:this.protected.slice(),ocean:this.ocean.slice()};
  }
  static fromData(data){
    if(!data||data.schema!==SCHEMA)throw Error("Dados hidrologicos incompatíveis.");
    if(!Array.isArray(data.elevation)||data.elevation.length!==data.width*data.height)throw Error("Altitudes invalidas.");
    return new Hidrologia(data.width,data.height,data);
  }
}
const API={SCHEMA,Hidrologia,fromMap(map){
  if(!map||!Number.isInteger(map.width)||!Number.isInteger(map.height))throw Error("Mapa invalido.");
  if(map.hydrology&&map.hydrology.schema===SCHEMA&&map.hydrology.width===map.width&&map.hydrology.height===map.height)return Hidrologia.fromData(map.hydrology);
  return new Hidrologia(map.width,map.height,{heights:map.heights});
}};
root.ApoenaHidrologia=API;
if(typeof module!=="undefined"&&module.exports)module.exports=API;
})(typeof globalThis!=="undefined"?globalThis:this);
