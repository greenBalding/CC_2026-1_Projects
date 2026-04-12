(function () {
  document.addEventListener("DOMContentLoaded", () => {
    window.AppLayout.initPage({ active: "gestao", adminOnly: true, pageTitle: "Gestao Academica" });
    if (!window.AppSession.isAdmin()) {
      return;
    }

    try {
      window.GestaoActions.bindAll();
      window.GestaoView.renderAll();
    } catch (error) {
      window.GestaoView.showMessage("msg-global", error.message, "danger");
    }
  });
})();
