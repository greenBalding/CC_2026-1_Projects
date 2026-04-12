(function () {
  function getApiCandidates(path) {
    const isBackendHost =
      (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") &&
      window.location.port === "3000";

    const sameOrigin = path;
    const localIp = `http://127.0.0.1:3000${path}`;
    const localhost = `http://localhost:3000${path}`;

    if (isBackendHost) {
      return [sameOrigin, localIp, localhost];
    }

    return [localIp, localhost, sameOrigin];
  }

  function setMessage(element, message, type) {
    if (!element) {
      return;
    }

    element.textContent = message;
    element.className = `alert alert-${type} mt-3 py-2`;
    element.classList.remove("d-none");
  }

  function clearMessage(element) {
    if (!element) {
      return;
    }

    element.textContent = "";
    element.className = "alert d-none";
  }

  async function postJson(path, payload, options) {
    let lastError = null;
    const config = options || {};

    for (const endpoint of getApiCandidates(path)) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: config.withCredentials ? "include" : "omit",
          body: JSON.stringify(payload || {})
        });

        const text = await response.text();
        let data = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          data = {};
        }

        return { response, data };
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error("Falha ao conectar com o servidor");
  }

  async function logout() {
    try {
      await postJson("/api/logout", {}, { withCredentials: true });
    } catch {
      // No-op: local cleanup still logs out on frontend.
    }

    localStorage.removeItem("usuarioLogado");
    window.location.href = "./index.html";
  }

  window.AppUtils = {
    getApiCandidates,
    setMessage,
    clearMessage,
    postJson,
    logout
  };
})();
