(function(root){
  "use strict";
  const CHANNEL = "apoena.creator.v4.bridge.v1";
  let sequence = 0;
  let sessionToken = "";
  let connection = null;
  let connectionPromise = null;
  const pending = new Map();
  const authorizedSources = new Map();
  const activePorts = new Map();

  function originOf(win){
    try {
      const value = win && win.location ? win.location.origin : "";
      return typeof value === "string" && value ? value : "null";
    } catch (_) {
      return "null";
    }
  }

  function createToken(){
    const cryptoApi = root.crypto || root.msCrypto;
    if (!cryptoApi || typeof cryptoApi.getRandomValues !== "function") {
      throw new Error("O navegador não oferece geração criptográfica segura para a sessão do Creator.");
    }
    const bytes = new Uint8Array(32);
    cryptoApi.getRandomValues(bytes);
    return Array.from(bytes, value => value.toString(16).padStart(2, "0")).join("");
  }

  function authorizeSource(source, token){
    const value = String(token || "");
    if (!source || source === root || typeof source.postMessage !== "function" || !/^[a-f0-9]{64}$/.test(value)) {
      throw new TypeError("Janela ou token inválido para autorizar a ponte do Creator.");
    }
    authorizedSources.set(source, value);
    return true;
  }

  function revokeSource(source){
    authorizedSources.delete(source);
    const port = activePorts.get(source);
    if (port) {
      try { port.close(); } catch (_) {}
      activePorts.delete(source);
    }
  }

  function targetWindow(){
    try {
      if (root.parent && root.parent !== root) return root.parent;
      if (root.opener && !root.opener.closed) return root.opener;
    } catch (_) {}
    return null;
  }

  function readSessionToken(){
    if (sessionToken) return sessionToken;
    try {
      sessionToken = String(root.name || "");
      root.name = "";
    } catch (_) {
      sessionToken = "";
    }
    if (!/^[a-f0-9]{64}$/.test(sessionToken)) sessionToken = "";
    return sessionToken;
  }

  function failPending(error){
    for (const [id, item] of pending) {
      clearTimeout(item.timer);
      item.reject(error);
      pending.delete(id);
    }
  }

  function receiveResponse(event){
    const data = event && event.data;
    if (!data || data.channel !== CHANNEL || data.type !== "response" || typeof data.id !== "string") return;
    const item = pending.get(data.id);
    if (!item) return;
    clearTimeout(item.timer);
    pending.delete(data.id);
    if (!data.ok) {
      const message = data.error && data.error.message ? data.error.message : "O Creator V4.0 recusou a sincronização.";
      item.reject(new Error(message));
    } else {
      item.resolve(data.value);
    }
  }

  function connect(timeoutMs){
    if (connection) return Promise.resolve(connection);
    if (connectionPromise) return connectionPromise;
    const target = targetWindow();
    const token = readSessionToken();
    if (!target) return Promise.reject(new Error("O Creator V4.0 não está aberto. Abra esta ferramenta pelo menu Pixel Art do Creator para sincronizar o projeto."));
    if (!token) return Promise.reject(new Error("Esta janela não possui uma sessão autorizada. Reabra a ferramenta pelo menu Pixel Art do Creator."));
    const ownOrigin = originOf(root);
    const targetOrigin = ownOrigin === "null" ? "*" : ownOrigin;
    connectionPromise = new Promise((resolve, reject) => {
      let timer = null;
      const cleanup = () => {
        if (timer !== null) clearTimeout(timer);
        root.removeEventListener("message", receiveInit);
      };
      const receiveInit = event => {
        const data = event && event.data;
        const eventOrigin = String(event && event.origin || "null");
        if (event.source !== target || eventOrigin !== ownOrigin || !data ||
            data.channel !== CHANNEL || data.type !== "init" || data.token !== token ||
            !event.ports || !event.ports[0]) return;
        cleanup();
        connection = event.ports[0];
        connection.onmessage = receiveResponse;
        connection.onmessageerror = () => {
          connection = null;
          connectionPromise = null;
          failPending(new Error("O canal privado com o Creator foi interrompido."));
        };
        if (typeof connection.start === "function") connection.start();
        resolve(connection);
      };
      root.addEventListener("message", receiveInit);
      timer = setTimeout(() => {
        cleanup();
        connectionPromise = null;
        reject(new Error("O Creator V4.0 não autorizou a conexão segura dentro do prazo."));
      }, timeoutMs);
      try {
        // A mensagem global contém somente o nonce de sessão; os dados seguem pelo MessagePort.
        target.postMessage({channel: CHANNEL, type: "ready", token}, targetOrigin);
      } catch (error) {
        cleanup();
        connectionPromise = null;
        reject(error);
      }
    });
    return connectionPromise;
  }

  function request(action, payload, timeoutMs){
    const timeout = Number.isFinite(Number(timeoutMs)) ? Math.max(500, Math.min(15000, Number(timeoutMs))) : 5000;
    return connect(timeout).then(port => new Promise((resolve, reject) => {
      const id = "apoena-v4-" + Date.now() + "-" + (++sequence);
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error("O Creator V4.0 não respondeu. O recurso permanece salvo na biblioteca central."));
      }, timeout);
      pending.set(id, {resolve, reject, timer});
      try {
        port.postMessage({channel: CHANNEL, type: "request", id, action: String(action || ""), payload: payload || {}});
      } catch (error) {
        clearTimeout(timer);
        pending.delete(id);
        connection = null;
        connectionPromise = null;
        reject(error);
      }
    }));
  }

  function listen(handler){
    if (typeof handler !== "function") throw new TypeError("O listener do Creator precisa ser uma função.");
    const ownOrigin = originOf(root);
    const receive = event => {
      const data = event && event.data;
      const token = authorizedSources.get(event.source);
      const eventOrigin = String(event && event.origin || "null");
      // Origem opaca só é aceita quando source e nonce foram autorizados pelo host.
      if (!token || eventOrigin !== ownOrigin || !data || data.channel !== CHANNEL ||
          data.type !== "ready" || data.token !== token || typeof root.MessageChannel !== "function") return;

      const previous = activePorts.get(event.source);
      if (previous) {
        try { previous.close(); } catch (_) {}
        activePorts.delete(event.source);
      }
      const channel = new root.MessageChannel();
      const source = event.source;
      const context = {source, origin: eventOrigin};
      channel.port1.onmessage = async messageEvent => {
        const requestData = messageEvent && messageEvent.data;
        if (!requestData || requestData.channel !== CHANNEL || requestData.type !== "request" ||
            typeof requestData.id !== "string" || typeof requestData.action !== "string") return;
        try {
          const value = await handler(requestData.action, requestData.payload || {}, context);
          channel.port1.postMessage({channel: CHANNEL, type: "response", id: requestData.id, ok: true, value});
        } catch (error) {
          const message = error && error.message ? error.message : "Falha na integração com o Creator.";
          try {
            channel.port1.postMessage({channel: CHANNEL, type: "response", id: requestData.id, ok: false, error: {message}});
          } catch (_) {}
        }
      };
      channel.port1.onmessageerror = () => {
        try { channel.port1.close(); } catch (_) {}
        activePorts.delete(source);
      };
      if (typeof channel.port1.start === "function") channel.port1.start();
      activePorts.set(source, channel.port1);
      const targetOrigin = eventOrigin === "null" ? "*" : eventOrigin;
      try {
        // Para file:// o browser exige "*"; somente o port é transferido após source+nonce.
        source.postMessage({channel: CHANNEL, type: "init", token}, targetOrigin, [channel.port2]);
      } catch (_) {
        try { channel.port1.close(); } catch (_) {}
        activePorts.delete(source);
      }
    };
    root.addEventListener("message", receive);
    return () => {
      root.removeEventListener("message", receive);
      for (const port of activePorts.values()) {
        try { port.close(); } catch (_) {}
      }
      activePorts.clear();
      authorizedSources.clear();
    };
  }

  root.ApoenaCreatorBridge = Object.freeze({
    channel: CHANNEL,
    createToken,
    authorizeSource,
    revokeSource,
    request,
    listen
  });
})(window);
