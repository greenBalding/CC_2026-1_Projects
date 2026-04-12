(function () {
  function getNavItems() {
    return [
      { href: "./cursos.html", label: "Cursos", key: "cursos" },
      { href: "./trilhas.html", label: "Trilhas", key: "trilhas" },
      { href: "./projetos.html", label: "Progresso", key: "progresso" },
      { href: "./contato.html", label: "Financeiro", key: "financeiro" },
      { href: "./sobre.html", label: "Resumo", key: "resumo" }
    ];
  }

  function buildLink(item, activeKey) {
    const activeClass = item.key === activeKey ? "active" : "";
    return `<li class="nav-item"><a href="${item.href}" class="nav-link ${activeClass}">${item.label}</a></li>`;
  }

  function buildAdminLink(activeKey) {
    if (!window.AppSession.isAdmin()) {
      return "";
    }
    const activeClass = activeKey === "gestao" ? "active" : "";
    return `<li class="nav-item"><a href="./gestao.html" class="nav-link ${activeClass}">Gestao</a></li>`;
  }

  function buildProfileToggle(user) {
    const currentRole = user && user.TipoUsuario === "admin" ? "admin" : "aluno";

    return `
      <div class="d-flex align-items-center gap-2">
        <label for="perfil-toggle" class="small mb-0 text-white">Perfil</label>
        <select id="perfil-toggle" class="form-select form-select-sm" data-action="alternar-perfil" style="width: 130px;">
          <option value="aluno" ${currentRole === "aluno" ? "selected" : ""}>Aluno</option>
          <option value="admin" ${currentRole === "admin" ? "selected" : ""}>Administrador</option>
        </select>
      </div>
    `;
  }

  function renderNavbar(activeKey) {
    const user = window.AppSession.getLoggedUser();
    const roleLabel = user && user.TipoUsuario === "admin" ? "Administrador" : "Aluno";
    const nomeUsuario = user ? user.NomeCompleto : "Usuario";

    const links = getNavItems().map((item) => buildLink(item, activeKey)).join("");
    const adminLink = buildAdminLink(activeKey);
    const togglePerfil = buildProfileToggle(user);

    return `
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand d-flex align-items-center gap-2" href="./cursos.html">
            <img src="./img/school.svg" alt="Logo da plataforma" width="24" height="24">
            <span>DevTech-SILVA</span>
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Alternar menu">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="mainNavbar">
            <ul class="navbar-nav me-auto">
              ${links}
              ${adminLink}
            </ul>
            <div class="d-flex align-items-center gap-3 text-white flex-wrap justify-content-end">
              <small>${nomeUsuario} (${roleLabel})</small>
              ${togglePerfil}
              <a href="#" class="btn btn-sm btn-outline-light" data-action="logout">Sair</a>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  function mountNavbar(activeKey) {
    const root = document.getElementById("navbar-root");
    if (!root) {
      return;
    }

    root.innerHTML = renderNavbar(activeKey);

    const logoutBtn = root.querySelector("[data-action='logout']");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        await window.AppUtils.logout();
      });
    }

    const profileToggle = root.querySelector("[data-action='alternar-perfil']");
    if (profileToggle) {
      profileToggle.addEventListener("change", (event) => {
        const nextRole = event.target.value;
        window.AppSession.alternarPerfil(nextRole);

        const currentPage = (window.location.pathname.split("/").pop() || "").toLowerCase();
        if (currentPage === "gestao.html" && nextRole !== "admin") {
          window.location.href = "./cursos.html";
          return;
        }

        window.location.reload();
      });
    }
  }

  function initPage(options) {
    const config = options || {};
    const isAllowed = window.AppSession.requireLogin();
    if (!isAllowed) {
      return;
    }

    if (config.adminOnly && !window.AppSession.requireAdmin()) {
      return;
    }

    mountNavbar(config.active || "");

    if (config.pageTitle) {
      const titleNode = document.getElementById("page-title");
      if (titleNode) {
        titleNode.textContent = config.pageTitle;
      }
    }
  }

  window.AppLayout = {
    initPage
  };
})();
