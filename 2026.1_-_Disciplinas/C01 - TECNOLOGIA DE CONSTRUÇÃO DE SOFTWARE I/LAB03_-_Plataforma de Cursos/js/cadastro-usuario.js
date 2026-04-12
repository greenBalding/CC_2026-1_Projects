const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    window.AppUtils.clearMessage(registerMessage);

    const nomeCompleto = document.getElementById("novoNome").value.trim();
    const email = document.getElementById("novoEmail").value.trim();
    const senha = document.getElementById("novaSenha").value;

    try {
      const { response, data } = await window.AppUtils.postJson("/api/usuarios", { nomeCompleto, email, senha });

      if (!response.ok) {
        window.AppUtils.setMessage(registerMessage, data.message || "Erro ao cadastrar usuario", "danger");
        return;
      }

      window.AppUtils.setMessage(registerMessage, "Usuario cadastrado com sucesso.", "success");
      registerForm.reset();

      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: "cadastro-realizado",
            email: data.usuario ? data.usuario.Email : email
          },
          window.location.origin
        );
      }
    } catch {
      window.AppUtils.setMessage(registerMessage, "Nao foi possivel conectar ao servidor", "danger");
    }
  });
}
