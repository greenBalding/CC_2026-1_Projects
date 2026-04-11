const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

function getApiCandidates(path) {
  const localCandidate = `http://127.0.0.1:3000${path}`;
  const localhostCandidate = `http://localhost:3000${path}`;
  const sameOriginCandidate = path;

  const isBackendHost =
    (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") &&
    window.location.port === "3000";

  if (isBackendHost) {
    return [sameOriginCandidate, localCandidate, localhostCandidate];
  }

  return [localCandidate, localhostCandidate, sameOriginCandidate];
}

function setMessage(message, type) {
  registerMessage.textContent = message;
  registerMessage.className = `alert alert-${type} mt-3 py-2`;
  registerMessage.classList.remove("d-none");
}

function clearMessage() {
  registerMessage.textContent = "";
  registerMessage.className = "alert d-none";
}

async function postJson(url, payload) {
  let lastNetworkError = null;

  for (const endpoint of getApiCandidates(url)) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const raw = await response.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }

      return { response, data };
    } catch (error) {
      lastNetworkError = error;
    }
  }

  throw lastNetworkError || new Error("Falha ao conectar com a API");
}

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();

    const nomeCompleto = document.getElementById("novoNome").value.trim();
    const email = document.getElementById("novoEmail").value.trim();
    const senha = document.getElementById("novaSenha").value;

    try {
      const { response, data } = await postJson("/api/usuarios", { nomeCompleto, email, senha });

      if (!response.ok) {
        setMessage(data.message || "Erro ao cadastrar usuario", "danger");
        return;
      }

      setMessage("Usuario cadastrado com sucesso.", "success");
      registerForm.reset();

      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: "cadastro-realizado",
          email: data.usuario ? data.usuario.Email : email
        }, window.location.origin);
      }
    } catch (error) {
      setMessage("Nao foi possivel conectar ao servidor. Inicie com: node server.js", "danger");
    }
  });
}
