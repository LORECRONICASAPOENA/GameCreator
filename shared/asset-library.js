(function(root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ApoenaLibrary = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function(root) {
  "use strict";
  const CHANNEL = "apoena.gamecreator.library.v1";
  const DB_NAME = "apoena.gamecreator.library.v1";
  const DB_VERSION = 1;
  const ASSETS = "assets";
  const PROJECTS = "projects";
  const isNode = typeof module === "object" && !!module.exports;
  const memory = { assets: new Map(), projects: new Map() };
  const pending = new Map();
  let dbPromise = null;
  let requestCounter = 0;
  let channel = null;

  function clone(value) {
    if (typeof structuredClone === "function") {
      try { return structuredClone(value); } catch (_) {}
    }
    if (value === undefined) return undefined;
    if (value === null || typeof value !== "object") return value;
    if (Array.isArray(value)) return value.map(clone);
    const out = {};
    Object.keys(value).forEach(function(key) { out[key] = clone(value[key]); });
    return out;
  }
  function jsonCopy(value, fallback) {
    try { return JSON.parse(JSON.stringify(value == null ? fallback : value)); }
    catch (_) { return clone(fallback); }
  }
  function trace(stage, detail) {
    try { if (root && typeof root.__apoenaLibraryTrace === "function") root.__apoenaLibraryTrace(stage, detail == null ? "" : String(detail)); } catch (_) {}
  }
  function validTimestamp(value) {
    return typeof value === "string" && Number.isFinite(Date.parse(value)) ? value : null;
  }
  function makeId(prefix) {
    prefix = prefix || "asset";
    if (root.crypto && typeof root.crypto.randomUUID === "function") return prefix + "-" + root.crypto.randomUUID();
    return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 11);
  }
  function emit(detail, broadcast) {
    if (root && typeof root.dispatchEvent === "function" && typeof root.CustomEvent === "function") {
      root.dispatchEvent(new root.CustomEvent("apoena:library-change", { detail: detail }));
    }
    if (broadcast !== false && channel) {
      try { channel.postMessage(detail); } catch (_) {}
    }
  }
  if (!isNode && root && typeof root.BroadcastChannel === "function") {
    try {
      channel = new root.BroadcastChannel(CHANNEL + ".events");
      channel.onmessage = function(event) { emit(event.data, false); };
    } catch (_) { channel = null; }
  }
  if (!isNode && root && typeof root.addEventListener === "function") {
    root.addEventListener("message", function(event) {
      if (!root.parent || root.parent === root || event.source !== root.parent) return;
      const message = event.data;
      if (!message || message.channel !== CHANNEL || message.type !== "response") return;
      const waiter = pending.get(message.id);
      if (!waiter) return;
      pending.delete(message.id);
      clearTimeout(waiter.timer);
      if (message.ok) waiter.resolve(message.value);
      else waiter.reject(new Error(message.error && message.error.message ? message.error.message : "Falha na biblioteca central."));
    });
  }
  function openDB() {
    if (!root || !root.indexedDB) {
      if (isNode) return Promise.resolve(null);
      return Promise.reject(new Error("Este navegador não disponibilizou IndexedDB. Abra o GameCreator em um navegador compatível."));
    }
    if (dbPromise) return dbPromise;
    trace("db-open-start");
    dbPromise = new Promise(function(resolve, reject) {
      const request = root.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = function() {
        trace("db-upgrade");
        const db = request.result;
        if (!db.objectStoreNames.contains(ASSETS)) {
          const assets = db.createObjectStore(ASSETS, { keyPath: "id" });
          assets.createIndex("category", "category", { unique: false });
          assets.createIndex("nameKey", "nameKey", { unique: false });
          assets.createIndex("updatedAt", "updatedAt", { unique: false });
        }
        if (!db.objectStoreNames.contains(PROJECTS)) {
          const projects = db.createObjectStore(PROJECTS, { keyPath: "id" });
          projects.createIndex("updatedAt", "updatedAt", { unique: false });
        }
      };
      request.onsuccess = function() {
        const db = request.result;
        db.onversionchange = function() { db.close(); dbPromise = null; };
        trace("db-open-success");
        resolve(db);
      };
      request.onerror = function() { trace("db-open-error", request.error && request.error.name); reject(request.error || new Error("Não foi possível abrir a biblioteca.")); };
      request.onblocked = function() { trace("db-open-blocked"); reject(new Error("A biblioteca está aberta em outra versão. Feche outras abas do GameCreator e tente novamente.")); };
    });
    return dbPromise;
  }
  async function getRecord(storeName, id) {
    trace("get-record-start", storeName);
    const db = await openDB();
    if (!db) return clone(memory[storeName].get(id) || null);
    return new Promise(function(resolve, reject) {
      const tx = db.transaction(storeName, "readonly");
      const request = tx.objectStore(storeName).get(id);
      request.onsuccess = function() { trace("get-record-success", storeName); resolve(request.result || null); };
      request.onerror = function() { trace("get-record-error", request.error && request.error.name); reject(request.error || new Error("Falha ao consultar a biblioteca.")); };
    });
  }
  async function getAllRecords(storeName) {
    const db = await openDB();
    if (!db) return Array.from(memory[storeName].values()).map(clone);
    return new Promise(function(resolve, reject) {
      const tx = db.transaction(storeName, "readonly");
      const request = tx.objectStore(storeName).getAll();
      request.onsuccess = function() { resolve(request.result || []); };
      request.onerror = function() { reject(request.error || new Error("Falha ao listar a biblioteca.")); };
    });
  }
  async function putRecord(storeName, record) {
    const db = await openDB();
    if (!db) {
      memory[storeName].set(record.id, clone(record));
      return clone(record);
    }
    return new Promise(function(resolve, reject) {
      trace("put-record-start", storeName);
      const tx = db.transaction(storeName, "readwrite");
      const request = tx.objectStore(storeName).put(record);
      request.onsuccess = function() { trace("put-request-success", storeName); };
      request.onerror = function() { trace("put-request-error", request.error && request.error.name); };
      tx.oncomplete = function() { trace("put-transaction-complete", storeName); resolve(record); };
      tx.onerror = function() { trace("put-transaction-error", tx.error && tx.error.name); reject(tx.error || new Error("Falha ao salvar na biblioteca.")); };
      tx.onabort = function() { trace("put-transaction-abort", tx.error && tx.error.name); reject(tx.error || new Error("O salvamento foi cancelado.")); };
    });
  }
  async function removeRecord(storeName, id) {
    const db = await openDB();
    if (!db) return memory[storeName].delete(id);
    return new Promise(function(resolve, reject) {
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).delete(id);
      tx.oncomplete = function() { resolve(true); };
      tx.onerror = function() { reject(tx.error || new Error("Falha ao excluir da biblioteca.")); };
      tx.onabort = function() { reject(tx.error || new Error("A exclusão foi cancelada.")); };
    });
  }
  async function toBlob(value, mimeType) {
    if (value && typeof value.arrayBuffer === "function" && typeof value.type === "string") {
      if (!value.type && mimeType && root.Blob) return new root.Blob([value], { type: mimeType });
      return value;
    }
    if (typeof value !== "string" || value.slice(0, 5) !== "data:") throw new Error("O recurso precisa conter uma imagem Blob ou data URL.");
    const comma = value.indexOf(",");
    if (comma < 0) throw new Error("A imagem codificada está inválida.");
    const header = value.slice(5, comma);
    const mime = (header.split(";")[0] || mimeType || "application/octet-stream").trim();
    const data = value.slice(comma + 1);
    let bytes;
    if (header.indexOf(";base64") >= 0) {
      const binary = root.atob ? root.atob(data) : Buffer.from(data, "base64").toString("binary");
      bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    } else {
      const decoded = decodeURIComponent(data);
      bytes = new TextEncoder().encode(decoded);
    }
    return new root.Blob([bytes], { type: mime });
  }
  async function localSaveAsset(input) {
    input = input || {};
    const name = String(input.name || "Recurso sem nome").trim().slice(0, 120);
    if (!name) throw new Error("Informe um nome para o recurso.");
    const category = String(input.category || "outro").trim().toLowerCase().slice(0, 48) || "outro";
    const type = String(input.type || "image").trim().toLowerCase().slice(0, 48) || "image";
    const blob = await toBlob(input.blob || input.dataUrl, input.mimeType || "image/png");
    if (!blob.type || blob.type.indexOf("image/") !== 0) throw new Error("A biblioteca aceita arquivos de imagem.");
    let previous = input.id ? await getRecord(ASSETS, input.id) : null;
    if (!previous && input.replaceExisting) {
      const all = await getAllRecords(ASSETS);
      const key = name.toLocaleLowerCase();
      previous = all.find(function(item) { return item.category === category && item.type === type && item.nameKey === key; }) || null;
    }
    const now = new Date().toISOString();
    let originalBlob = previous ? previous.originalBlob || null : null;
    if (input.originalBlob) originalBlob = await toBlob(input.originalBlob, input.originalMimeType || "image/png");
    const record = {
      id: input.id || (previous && previous.id) || makeId("asset"),
      name: name,
      nameKey: name.toLocaleLowerCase(),
      category: category,
      type: type,
      mimeType: blob.type,
      blob: blob,
      originalBlob: originalBlob,
      width: Math.max(0, Number(input.width) || (previous ? previous.width : 0)),
      height: Math.max(0, Number(input.height) || (previous ? previous.height : 0)),
      sourceWidth: Math.max(0, Number(input.sourceWidth) || (previous ? previous.sourceWidth : 0)),
      sourceHeight: Math.max(0, Number(input.sourceHeight) || (previous ? previous.sourceHeight : 0)),
      size: blob.size,
      originalSize: originalBlob ? originalBlob.size : 0,
      tags: Array.isArray(input.tags) ? input.tags.map(function(tag) { return String(tag).trim().slice(0, 48); }).filter(Boolean).slice(0, 40) : (previous ? previous.tags || [] : []),
      metadata: jsonCopy(input.metadata, previous ? previous.metadata || {} : {}),
      createdAt: validTimestamp(input.createdAt) || (previous ? previous.createdAt : now),
      updatedAt: validTimestamp(input.updatedAt) || now
    };
    await putRecord(ASSETS, record);
    emit({ action: "saveAsset", id: record.id, category: record.category, updatedAt: record.updatedAt });
    return record;
  }
  async function localListAssets(filters) {
    filters = filters || {};
    const category = String(filters.category || "").trim().toLowerCase();
    const search = String(filters.search || "").trim().toLocaleLowerCase();
    return (await getAllRecords(ASSETS)).filter(function(item) {
      if (category && category !== "all" && item.category !== category) return false;
      if (search) {
        const haystack = [item.name, item.category, item.type, (item.tags || []).join(" ")].join(" ").toLocaleLowerCase();
        if (haystack.indexOf(search) < 0) return false;
      }
      return true;
    }).sort(function(a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
  }
  async function localDeleteAsset(id) {
    if (!id) throw new Error("Identificador de recurso ausente.");
    const deleted = await removeRecord(ASSETS, id);
    if (deleted) emit({ action: "deleteAsset", id: id });
    return { id: id, deleted: !!deleted };
  }
  async function localSaveProject(input) {
    input = input || {};
    const name = String(input.name || "Projeto sem nome").trim().slice(0, 120);
    if (!name) throw new Error("Informe um nome para o projeto.");
    const id = input.id || makeId("project");
    const previous = await getRecord(PROJECTS, id);
    const now = new Date().toISOString();
    const record = {
      id: id,
      name: name,
      schema: String(input.schema || "apoena.gamecreator.project.v1").slice(0, 80),
      type: String(input.type || "project").slice(0, 48),
      data: jsonCopy(input.data, {}),
      metadata: jsonCopy(input.metadata, {}),
      createdAt: validTimestamp(input.createdAt) || (previous ? previous.createdAt : now),
      updatedAt: validTimestamp(input.updatedAt) || now
    };
    await putRecord(PROJECTS, record);
    emit({ action: "saveProject", id: id, updatedAt: record.updatedAt });
    return record;
  }
  async function localListProjects(filters) {
    filters = filters || {};
    const search = String(filters.search || "").trim().toLocaleLowerCase();
    const items = (await getAllRecords(PROJECTS)).filter(function(item) {
      return !search || (item.name + " " + item.type + " " + item.schema).toLocaleLowerCase().indexOf(search) >= 0;
    }).sort(function(a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
    if (filters.includeData !== false) return items;
    return items.map(function(item) {
      return {
        id: item.id, name: item.name, schema: item.schema, type: item.type,
        metadata: clone(item.metadata || {}), createdAt: item.createdAt, updatedAt: item.updatedAt
      };
    });
  }
  async function localDeleteProject(id) {
    if (!id) throw new Error("Identificador de projeto ausente.");
    const deleted = await removeRecord(PROJECTS, id);
    if (deleted) emit({ action: "deleteProject", id: id });
    return { id: id, deleted: !!deleted };
  }
  async function dispatch(action, payload) {
    payload = payload || {};
    switch (action) {
      case "saveAsset": return localSaveAsset(payload);
      case "getAsset": return getRecord(ASSETS, payload.id);
      case "listAssets": return localListAssets(payload);
      case "deleteAsset": return localDeleteAsset(payload.id);
      case "saveProject": return localSaveProject(payload);
      case "getProject": return getRecord(PROJECTS, payload.id);
      case "listProjects": return localListProjects(payload);
      case "deleteProject": return localDeleteProject(payload.id);
      default: throw new Error("Ação de biblioteca não permitida: " + String(action));
    }
  }
  function requestHost(action, payload) {
    return new Promise(function(resolve, reject) {
      const id = makeId("request") + "-" + (++requestCounter);
      const timer = setTimeout(function() {
        pending.delete(id);
        const error = new Error("O shell principal não respondeu à biblioteca.");
        error.code = "APOENA_HOST_TIMEOUT";
        reject(error);
      }, 1800);
      pending.set(id, { resolve: resolve, reject: reject, timer: timer });
      try {
        root.parent.postMessage({ channel: CHANNEL, type: "request", id: id, action: action, payload: payload || {} }, "*");
      } catch (error) {
        clearTimeout(timer);
        pending.delete(id);
        reject(error);
      }
    });
  }
  async function call(action, payload) {
    if (!isNode && root && root.parent && root.parent !== root && typeof root.parent.postMessage === "function") {
      try {
        const value = await requestHost(action, payload);
        emit({ action: action, remote: true });
        return value;
      } catch (error) {
        if (!error || error.code !== "APOENA_HOST_TIMEOUT") throw error;
      }
    }
    return dispatch(action, payload);
  }
  function blobToDataURL(blob) {
    return new Promise(function(resolve, reject) {
      if (!blob) return reject(new Error("Imagem ausente."));
      if (root.FileReader) {
        const reader = new root.FileReader();
        reader.onload = function() { resolve(reader.result); };
        reader.onerror = function() { reject(reader.error || new Error("Não foi possível ler a imagem.")); };
        reader.readAsDataURL(blob);
        return;
      }
      if (blob.arrayBuffer && root.Buffer) {
        blob.arrayBuffer().then(function(buffer) {
          resolve("data:" + (blob.type || "application/octet-stream") + ";base64," + root.Buffer.from(buffer).toString("base64"));
        }, reject);
        return;
      }
      reject(new Error("Este navegador não consegue converter a imagem."));
    });
  }
  function subscribe(callback) {
    if (!root || typeof root.addEventListener !== "function") return function() {};
    const handler = function(event) { callback(event.detail || event.data || {}); };
    root.addEventListener("apoena:library-change", handler);
    return function() { root.removeEventListener("apoena:library-change", handler); };
  }
  return {
    schema: CHANNEL,
    saveAsset: function(input) { return call("saveAsset", input); },
    getAsset: function(id) { return call("getAsset", { id: id }); },
    listAssets: function(filters) { return call("listAssets", filters); },
    deleteAsset: function(id) { return call("deleteAsset", { id: id }); },
    saveProject: function(input) { return call("saveProject", input); },
    getProject: function(id) { return call("getProject", { id: id }); },
    listProjects: function(filters) { return call("listProjects", filters); },
    deleteProject: function(id) { return call("deleteProject", { id: id }); },
    blobToDataURL: blobToDataURL,
    dataURLToBlob: toBlob,
    subscribe: subscribe,
    dispatch: dispatch
  };
});