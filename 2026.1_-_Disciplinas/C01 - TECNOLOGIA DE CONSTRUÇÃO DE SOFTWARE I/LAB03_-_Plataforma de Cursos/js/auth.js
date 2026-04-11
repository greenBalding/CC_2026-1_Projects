const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const cadastroSuccessMessage = document.getElementById("cadastroSuccessMessage");
const cadastroModalElement = document.getElementById("cadastroModal");

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

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage(loginMessage);
    clearMessage(cadastroSuccessMessage);

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    try {
      const { response, data } = await postJson("/api/login", { email, senha });

      if (!response.ok) {
        setMessage(loginMessage, data.message || "Usuário não cadastrado", "danger");
        return;
      }

      localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario));
      window.location.href = "./cursos.html";
    } catch (error) {
      setMessage(loginMessage, "Usuário não cadastrado", "danger");
    }
  });
}

window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin) {
    return;
  }

  if (!event.data || event.data.type !== "cadastro-realizado") {
    return;
  }

  const emailField = document.getElementById("email");
  if (emailField && event.data.email) {
    emailField.value = event.data.email;
  }

  clearMessage(loginMessage);
  setMessage(cadastroSuccessMessage, "Cadastro realizado. Agora faca login.", "success");

  if (cadastroModalElement && window.bootstrap && window.bootstrap.Modal) {
    const modalInstance = window.bootstrap.Modal.getOrCreateInstance(cadastroModalElement);
    modalInstance.hide();
  }
});
