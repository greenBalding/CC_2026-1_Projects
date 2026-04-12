const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const cadastroSuccessMessage = document.getElementById("cadastroSuccessMessage");
const cadastroModalElement = document.getElementById("cadastroModal");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    window.AppUtils.clearMessage(loginMessage);
    window.AppUtils.clearMessage(cadastroSuccessMessage);

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    try {
      const { response, data } = await window.AppUtils.postJson("/api/login", { email, senha });

      if (!response.ok) {
        window.AppUtils.setMessage(loginMessage, data.message || "Credenciais invalidas", "danger");
        return;
      }

      localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario));
      window.location.href = "./cursos.html";
    } catch {
      window.AppUtils.setMessage(loginMessage, "Nao foi possivel conectar ao servidor", "danger");
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

  window.AppUtils.clearMessage(loginMessage);
  window.AppUtils.setMessage(cadastroSuccessMessage, "Cadastro realizado. Agora faca login.", "success");

  if (cadastroModalElement && window.bootstrap && window.bootstrap.Modal) {
    window.bootstrap.Modal.getOrCreateInstance(cadastroModalElement).hide();
  }
});
