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

function fakeWindow(origin = "https://apoena.test") {
  const listeners = new Map();
  const win = {
    closed: false,
    opener: null,
    parent: null,
    location: { origin },
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener(type, fn) {
      listeners.get(type)?.delete(fn);
    },
    emit(type, event) {
      for (const fn of [...(listeners.get(type) || [])]) fn(event);
    }
  };
  win.parent = win;
  return win;
}

async function flush() {
  await new Promise(resolve => setImmediate(resolve));
}

(async () => {
  const child = fakeWindow();
  const parent = { closed: false, postMessage(message) {
    queueMicrotask(() => child.emit("message", {
      source: parent,
      origin: "https://apoena.test",
      data: { channel: message.channel, type: "response", id: message.id, ok: true, value: { saved: true, action: message.action } }
    }));
  }};
  child.opener = parent;
  vm.runInNewContext(bridgeSource, { window: child, setTimeout, clearTimeout, Promise, TypeError, Date, Number, String, Math, Error });
  const response = await child.ApoenaCreatorBridge.request("saveAsset", { name: "Apoena" });
  assert.equal(response.saved, true);
  assert.equal(response.action, "saveAsset");
  assert.equal(child.ApoenaCreatorBridge.channel, "apoena.creator.v4.bridge.v1");

  const native = fakeWindow();
  vm.runInNewContext(bridgeSource, { window: native, setTimeout, clearTimeout, Promise, TypeError, Date, Number, String, Math, Error });
  const received = [];
  native.ApoenaCreatorBridge.listen((action, payload) => {
    if (action === "saveMap") return { id: payload.id, saved: true };
    throw new Error("Ação recusada pelo teste");
  });
  const childSource = { postMessage(message) { received.push(message); } };
  native.emit("message", {
    source: childSource,
    origin: "https://apoena.test",
    data: { channel: "apoena.creator.v4.bridge.v1", type: "request", id: "map-1", action: "saveMap", payload: { id: "mapa-teste" } }
  });
  await flush();
  assert.equal(received[0].ok, true);
  assert.equal(received[0].value.id, "mapa-teste");

  native.emit("message", {
    source: childSource,
    origin: "https://apoena.test",
    data: { channel: "apoena.creator.v4.bridge.v1", type: "request", id: "bad-1", action: "bad", payload: {} }
  });
  await flush();
  assert.equal(received[1].ok, false);
  assert.match(received[1].error.message, /recusada/);

  native.emit("message", {
    source: childSource,
    origin: "https://evil.example",
    data: { channel: "apoena.creator.v4.bridge.v1", type: "request", id: "evil-1", action: "saveMap", payload: { id: "evil" } }
  });
  await flush();
  assert.equal(received.length, 2, "origem externa deve ser ignorada");

  assert.ok(nativeBridgeSource.includes("ApoenaCreatorBridge?.listen"), "Creator V4.0 registra o listener da ponte");
  assert.ok(nativeBridgeSource.includes('action==="saveAsset"') && nativeBridgeSource.includes('action==="saveMap"'), "ponte grava spritesheets e mapas no estado V4.0");
  assert.ok(studioHtml.includes("../shared/creator-bridge.js") && studioJs.includes("ApoenaCreatorBridge.request('saveAsset'"), "Estúdio carrega e usa a ponte compartilhada");
  assert.ok(mapHtml.includes("../shared/creator-bridge.js") && mapHtml.includes("ApoenaCreatorBridge.request('saveMap'"), "editor de mapas envia alterações ao Creator");
  assert.ok(pixelModuleSource.includes('rel="opener"') || pixelModuleSource.includes('rel=\\"opener\\"'), "links locais preservam window.opener para a ponte");
  console.log("CREATOR BRIDGE OK: request/response, validação de origem, erros e contratos de sincronização");
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
