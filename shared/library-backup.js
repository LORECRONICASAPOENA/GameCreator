(function(root){
  "use strict";
  const SCHEMA="apoena.gamecreator.library-backup.v1";
  const MAX_RECORDS=10000;
  const MAX_IMPORT_CHARS=120*1024*1024;
  function library(){const api=root.ApoenaLibrary;if(!api)throw new Error("Biblioteca central não carregada.");return api}
  async function exportSnapshot(){
    const api=library();
    const [assets,projects]=await Promise.all([api.listAssets({includeData:true}),api.listProjects({includeData:true})]);
    if(assets.length+projects.length>MAX_RECORDS)throw new Error("A biblioteca ultrapassa o limite de registros do backup.");
    const encode=async blob=>blob?await api.blobToDataURL(blob):null;
    const serializedAssets=[];
    for(const item of assets){
      serializedAssets.push({id:item.id,name:item.name,category:item.category,type:item.type,mimeType:item.mimeType||item.blob?.type||"image/png",blob:await encode(item.blob),originalBlob:await encode(item.originalBlob),width:item.width||0,height:item.height||0,sourceWidth:item.sourceWidth||0,sourceHeight:item.sourceHeight||0,tags:item.tags||[],metadata:item.metadata||{},createdAt:item.createdAt||null,updatedAt:item.updatedAt||null});
    }
    return {schema:SCHEMA,version:1,exportedAt:new Date().toISOString(),assets:serializedAssets,projects:projects.map(p=>({id:p.id,name:p.name,schema:p.schema,type:p.type,data:p.data,metadata:p.metadata||{},createdAt:p.createdAt||null,updatedAt:p.updatedAt||null}))};
  }
  function validate(snapshot){
    if(!snapshot||snapshot.schema!==SCHEMA||snapshot.version!==1||!Array.isArray(snapshot.assets)||!Array.isArray(snapshot.projects))throw new Error("Backup incompatível. Esperado apoena.gamecreator.library-backup.v1.");
    if(snapshot.assets.length+snapshot.projects.length>MAX_RECORDS)throw new Error("Backup excede o limite de registros.");
    const ids=new Set();
    for(const a of snapshot.assets){
      if(!a||typeof a.id!=="string"||!a.id||typeof a.name!=="string"||typeof a.blob!=="string"||!a.blob.startsWith("data:image/"))throw new Error("Backup contém recurso de imagem inválido.");
      if(ids.has("asset:"+a.id))throw new Error("Backup contém IDs de recurso duplicados.");ids.add("asset:"+a.id);
    }
    for(const p of snapshot.projects){
      if(!p||typeof p.id!=="string"||!p.id||typeof p.name!=="string"||!Object.prototype.hasOwnProperty.call(p,"data"))throw new Error("Backup contém projeto inválido.");
      if(ids.has("project:"+p.id))throw new Error("Backup contém IDs de projeto duplicados.");ids.add("project:"+p.id);
    }
    return snapshot;
  }
  async function importSnapshot(snapshot){
    const api=library();validate(snapshot);
    const encodeLength=JSON.stringify(snapshot).length;
    if(encodeLength>MAX_IMPORT_CHARS)throw new Error("Backup maior que 120 MB de texto; divida a biblioteca em backups menores.");
    let assets=0,projects=0;
    for(const item of snapshot.assets){
      const blob=api.dataURLToBlob(item.blob,item.mimeType||"image/png");
      const originalBlob=item.originalBlob?api.dataURLToBlob(item.originalBlob):null;
      await api.saveAsset({id:item.id,name:item.name,category:item.category,type:item.type,blob:blob,originalBlob:originalBlob,width:item.width,height:item.height,sourceWidth:item.sourceWidth,sourceHeight:item.sourceHeight,tags:item.tags,metadata:item.metadata,createdAt:item.createdAt,updatedAt:item.updatedAt});
      assets++;
    }
    for(const project of snapshot.projects){
      await api.saveProject({id:project.id,name:project.name,schema:project.schema,type:project.type,data:project.data,metadata:project.metadata,createdAt:project.createdAt,updatedAt:project.updatedAt});
      projects++;
    }
    return {assets:assets,projects:projects};
  }
  root.ApoenaLibraryBackup=Object.freeze({schema:SCHEMA,exportSnapshot:exportSnapshot,importSnapshot:importSnapshot});
})(typeof globalThis!=="undefined"?globalThis:this);
