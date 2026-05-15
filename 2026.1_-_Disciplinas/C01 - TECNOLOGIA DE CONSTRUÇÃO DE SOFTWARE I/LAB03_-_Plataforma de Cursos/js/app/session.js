(function () {
  function getLoggedUser() {
    try {
      return JSON.parse(localStorage.getItem("usuarioLogado") || "null");
    } catch {
      return null;
    }
  }

  function saveLoggedUser(user) {
    localStorage.setItem("usuarioLogado", JSON.stringify(user));
  }

  function isLoggedIn() {
    return Boolean(getLoggedUser());
  }

  function isAdmin() {
    const user = getLoggedUser();
    return Boolean(user && user.TipoUsuario === "admin");
  }

  function alternarPerfil(tipoUsuario) {
    const usuario = getLoggedUser();
    if (!usuario) {
      return null;
    }

    usuario.TipoUsuario = tipoUsuario === "admin" ? "admin" : "aluno";
    saveLoggedUser(usuario);
    return usuario;
  }

  function requireLogin() {
    if (!isLoggedIn()) {
      window.location.href = "./index.html";
      return false;
    }
    return true;
  }

  function requireAdmin() {
    if (!isAdmin()) {
      window.location.href = "./cursos.html";
      return false;
    }
    return true;
  }

  window.AppSession = {
    getLoggedUser,
    saveLoggedUser,
    isLoggedIn,
    isAdmin,
    alternarPerfil,
    requireLogin,
    requireAdmin
  };
})();
