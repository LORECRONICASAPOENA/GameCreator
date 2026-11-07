(function (root) {
  'use strict';

  function createPresetRequestGuard() {
    let latestRequest = 0;
    return {
      begin: function () {
        latestRequest += 1;
        return latestRequest;
      },
      isCurrent: function (requestId) {
        return requestId === latestRequest;
      }
    };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = createPresetRequestGuard;
  }
  root.ApoenaPresetRequestGuard = createPresetRequestGuard;
})(typeof window !== 'undefined' ? window : globalThis);