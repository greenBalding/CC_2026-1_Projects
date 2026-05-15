(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const node = byId(id);
    if (node) {
      node.textContent = String(value);
    }
  }

  function renderSummary() {
    const db = window.AppDb.loadDb();
    const user = window.AppSession.getLoggedUser();

    const userEnrollments = db.matriculas.filter((item) => Number(item.ID_Usuario) === Number(user.ID_Usuario));
    const userCertificates = db.certificados.filter((item) => Number(item.ID_Usuario) === Number(user.ID_Usuario));
    const userSubscriptions = db.assinaturas.filter((item) => Number(item.ID_Usuario) === Number(user.ID_Usuario));

    setText("sum-categorias", db.categorias.length);
    setText("sum-cursos", db.cursos.length);
    setText("sum-trilhas", db.trilhas.length);
    setText("sum-modulos", db.modulos.length);
    setText("sum-aulas", db.aulas.length);
    setText("sum-matriculas", userEnrollments.length);
    setText("sum-certificados", userCertificates.length);
    setText("sum-assinaturas", userSubscriptions.length);
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.AppLayout.initPage({ active: "resumo", pageTitle: "Resumo da Plataforma" });
    if (!window.AppSession.isLoggedIn()) {
      return;
    }

    renderSummary();
  });
})();
