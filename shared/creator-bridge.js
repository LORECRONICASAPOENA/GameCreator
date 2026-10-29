(function(root){
  "use strict";
  const CHANNEL = "apoena.creator.v4.bridge.v1";
  let sequence = 0;

  function targetWindow(){
    try {
      if (root.opener && !root.opener.closed) return root.opener;
      if (root.parent && root.parent !== root) return root.parent;
    } catch (_) {}
    return null;
  }

  function request(action, payload, timeoutMs){
    const target = targetWindow();
    if (!target) return Promise.reject(new Error("O Creator V4.0 não está aberto. Abra esta ferramenta pelo menu Pixel Art do Creator para sincronizar o projeto."));
    const id = "apoena-v4-" + Date.now() + "-" + (++sequence);
    const timeout = Number.isFinite(Number(timeoutMs)) ? Math.max(500, Math.min(15000, Number(timeoutMs))) : 5000;

    return new Promise((resolve, reject) => {
      let timer = null;
      const cleanup = () => {
        if (timer !== null) clearTimeout(timer);
        root.removeEventListener("message", receive);
      };
      const receive = event => {
        const data = event.data;
        if (event.source !== target || !data || data.channel !== CHANNEL || data.type !== "response" || data.id !== id) return;
        cleanup();
        if (!data.ok) reject(new Error(data.error && data.error.message ? data.error.message : "O Creator V4.0 recusou a sincronização."));
        else resolve(data.value);
      };
      root.addEventListener("message", receive);
      timer = setTimeout(() => {
        cleanup();
        reject(new Error("O Creator V4.0 não respondeu. O recurso permanece salvo na biblioteca central."));
      }, timeout);
      try {
        target.postMessage({channel: CHANNEL, type: "request", id, action: String(action || ""), payload: payload || {}}, "*");
      } catch (error) {
        cleanup();
        reject(error);
      }
    });
  }

  function listen(handler){
    if (typeof handler !== "function") throw new TypeError("O listener do Creator precisa ser uma função.");
    const receive = event => {
      const data = event.data;
      let origin = "";
      try { origin = root.location && root.location.origin ? root.location.origin : "null"; } catch (_) {}
      if ((event.origin !== origin && event.origin !== "null") || !data || data.channel !== CHANNEL ||
          data.type !== "request" || typeof data.id !== "string" || !event.source || event.source === root) return;
      Promise.resolve().then(() => handler(String(data.action || ""), data.payload || {}, event)).then(value => {
        try { event.source.postMessage({channel: CHANNEL, type: "response", id: data.id, ok: true, value}, "*"); } catch (_) {}
      }).catch(error => {
        try { event.source.postMessage({channel: CHANNEL, type: "response", id: data.id, ok: false,
          error: {message: error && error.message ? error.message : "Falha na integração com o Creator."}}, "*"); } catch (_) {}
      });
    };
    root.addEventListener("message", receive);
    return () => root.removeEventListener("message", receive);
  }

  root.ApoenaCreatorBridge = Object.freeze({channel: CHANNEL, request, listen});
})(window);
