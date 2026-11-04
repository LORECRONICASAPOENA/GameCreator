const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const bridgeSource = fs.readFileSync(path.join(root, "shared/creator-bridge.js"), "utf8");
const nativeBridgeSource = fs.readFileSync(path.join(root, "pixel-art/ponte-creator.js"), "utf8");
const pixelModuleSource = fs.readFileSync(path.join(root, "pixel-art/modulo-integrado.js"), "utf8");
const studioHtml = fs.readFileSync(path.join(root, "pixel-art/estudio.html"), "utf8");
const studioJs = fs.readFileSync(path.join(root, "pixel-art/estudio.js"), "utf8");
const mapHtml = fs.readFileSync(path.join(root, "map-editor/index.html"), "utf8");
assert.doesNotThrow(() => new Function(bridgeSource), "ponte compartilhada deve ser sintaticamente válida");

class FakePort {
  constructor() {
    this.peer = null;
    this.onmessage = null;
    this.onmessageerror = null;
    this.closed = false;
  }
  postMessage(data) {
    if (this.closed || !this.peer || this.peer.closed) throw new Error("MessagePort fechado");
    queueMicrotask(() => {
      if (!this.peer.closed) this.peer.onmessage?.({data});
    });
  }
  start() {}
  close() { this.closed = true; }
}
class FakeMessageChannel {
  constructor() {
    this.port1 = new FakePort();
    this.port2 = new FakePort();
    this.port1.peer = this.port2;
    this.port2.peer = this.port1;
  }
}
function fakeWindow(origin = "null") {
  const listeners = new Map();
  const win = {
    closed: false,
    name: "",
    opener: null,
    parent: null,
    location: {origin},
    MessageChannel: FakeMessageChannel,
    crypto: {getRandomValues(bytes) { bytes.fill(7); return bytes; }},
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    emit(type, event) { for (const fn of [...(listeners.get(type) || [])]) fn(event); }
  };
  win.parent = win;
  return win;
}
function pairWindows(origin = "null") {
  const host = fakeWindow(origin);
  const child = fakeWindow(origin);
  child.parent = host;
  child.postMessage = (data, targetOrigin, transfer) => host.emit("message", {
    source: child, origin, data, ports: transfer || []
  });
  host.postMessage = (data, targetOrigin, transfer) => child.emit("message", {
    source: host, origin, data, ports: transfer || []
  });
  return {host, child};
}
function loadBridge(win) {
  vm.runInNewContext(bridgeSource, {
    window: win, setTimeout, clearTimeout, Promise, TypeError, Date, Number, String,
    Math, Error, Uint8Array, Map, WeakMap, Array, Object
  });
}
async function flush() { await new Promise(resolve => setImmediate(resolve)); }

(async () => {
  const {host, child} = pairWindows("null");
  const token = "a".repeat(64);
  child.name = token;
  loadBridge(host);
  loadBridge(child);
  host.ApoenaCreatorBridge.authorizeSource(child, token);

  const received = [];
  host.ApoenaCreatorBridge.listen(async (action, payload, context) => {
    received.push({action, payload, source: context.source, origin: context.origin});
    if (action === "saveMap") return {id: payload.id, saved: true};
    if (action === "saveAsset") return {id: payload.id || "asset-test"};
    throw new Error("Ação recusada pelo teste");
  });

  // Origem nula sem source+nonce previamente autorizados não estabelece canal.
  const attacker = fakeWindow("null");
  host.emit("message", {
    source: attacker, origin: "null",
    data: {channel: host.ApoenaCreatorBridge.channel, type: "ready", token}
  });
  await flush();
  assert.equal(received.length, 0, "origem null não autorizada deve ser ignorada");

  // Token errado e origem externa também não podem estabelecer canal.
  host.emit("message", {
    source: child, origin: "null",
    data: {channel: host.ApoenaCreatorBridge.channel, type: "ready", token: "b".repeat(64)}
  });
  host.emit("message", {
    source: child, origin: "https://evil.example",
    data: {channel: host.ApoenaCreatorBridge.channel, type: "ready", token}
  });
  await flush();
  assert.equal(received.length, 0, "token errado/origem externa devem ser ignorados");

  const response = await child.ApoenaCreatorBridge.request("saveMap", {id: "mapa-teste"});
  assert.equal(response.saved, true);
  assert.equal(response.id, "mapa-teste");
  assert.equal(received.length, 1);
  assert.equal(received[0].source, child);
  assert.equal(received[0].origin, "null");

  const asset = await child.ApoenaCreatorBridge.request("saveAsset", {id: "personagem-teste"});
  assert.equal(asset.id, "personagem-teste");
  assert.equal(received.length, 2);

  await assert.rejects(child.ApoenaCreatorBridge.request("acao-invalida", {}), /Ação recusada/);
  assert.equal(received.length, 3);

  const standalone = fakeWindow("null");
  loadBridge(standalone);
  await assert.rejects(standalone.ApoenaCreatorBridge.request("saveAsset", {}), /Creator V4.0 não está aberto|sessão autorizada/);

  assert.equal(host.ApoenaCreatorBridge.channel, "apoena.creator.v4.bridge.v1");
  assert.equal(child.name, "", "o nonce deve ser retirado de window.name após leitura");
  assert.ok(pixelModuleSource.includes('rel="opener"') || pixelModuleSource.includes('rel=\\\"opener\\\"'), "links locais preservam opener");
  assert.ok(pixelModuleSource.includes("authorizeSource") && pixelModuleSource.includes("createToken"), "ferramentas são abertas com source+nonce autorizados");
  assert.ok(nativeBridgeSource.includes("ApoenaCreatorBridge?.listen"), "Creator V4.0 registra o listener da ponte");
  assert.ok(nativeBridgeSource.includes('action==="saveAsset"') && nativeBridgeSource.includes('action==="saveMap"'), "ponte grava spritesheets e mapas no estado V4.0");
  assert.ok(studioHtml.includes("../shared/creator-bridge.js") && studioJs.includes("ApoenaCreatorBridge.request('saveAsset'"), "Estúdio carrega e usa a ponte compartilhada");
  assert.ok(mapHtml.includes("../shared/creator-bridge.js") && mapHtml.includes("ApoenaCreatorBridge.request('saveMap'"), "editor de mapas envia alterações ao Creator");
  assert.ok(bridgeSource.includes("new root.MessageChannel()"), "payload usa canal privado, não mensagens globais");
  assert.ok(bridgeSource.includes("authorizedSources.get(event.source)"), "source precisa estar allowlisted");

  const nativeState = {assets: [], characters: [], pixelArtMaps: [], items: []};
  const nativeWindow = fakeWindow("null");
  const nativeDocument = {
    getElementById(id) { return id === "page-pixelart" || id === "gc40PixelRoot" ? {} : null; },
    querySelector() { return {querySelector() { return null; }}; },
    createElement() { return {style: {}, addEventListener() {}}; }
  };
  vm.runInNewContext(nativeBridgeSource, {
    window: nativeWindow, document: nativeDocument, state: nativeState,
    switchPage() {}, location: {hash: ""}, console, JSON, Object, Array, String, Math, Error
  });
  const largeManifest = {
    schema: "apoena.pixelart.v1", name: "Apoena", kind: "personagem",
    frames: Array.from({length: 768}, (_, index) => ({
      index, action: ("acao_" + index).padEnd(40, "x"), direction: "nenhuma",
      atlas: {x: index * 128, y: 0, w: 128, h: 128}
    }))
  };
  const largeManifestSize = JSON.stringify(largeManifest).length;
  assert.ok(largeManifestSize > 50000, "fixture deve reproduzir o limite anterior da ponte");
  assert.ok(largeManifestSize <= nativeWindow.ApoenaCreatorIntegrated.maxPixelManifestChars);
  const savedCharacter = nativeWindow.ApoenaCreatorIntegrated.savePixelAsset(largeManifest, "data:image/png;base64,AA==");
  assert.equal(savedCharacter.category, "personagem");
  assert.equal(nativeState.characters.length, 1, "manifesto grande válido deve ser salvo no Creator");
  assert.equal(nativeState.assets.length, 1, "spritesheet deve ser registrada como asset");

  console.log("CREATOR BRIDGE OK: nonce por source, origem null controlada, MessageChannel privado, erros e contratos V4.0/V4.1");
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
