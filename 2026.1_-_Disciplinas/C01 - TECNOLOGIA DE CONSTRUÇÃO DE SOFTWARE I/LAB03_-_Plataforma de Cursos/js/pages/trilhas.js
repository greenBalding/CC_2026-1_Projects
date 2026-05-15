(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  function getCategoryName(db, categoryId) {
    const category = db.categorias.find((item) => Number(item.ID_Categoria) === Number(categoryId));
    return category ? category.Nome : "Sem categoria";
  }

  function getCourseName(db, courseId) {
    const course = db.cursos.find((item) => Number(item.ID_Curso) === Number(courseId));
    return course ? course.Titulo : "Curso removido";
  }

  function renderTrilhas() {
    const db = window.AppDb.loadDb();
    const filterValue = byId("filtro-categoria-trilha").value;

    let tracks = db.trilhas;
    if (filterValue) {
      tracks = tracks.filter((item) => Number(item.ID_Categoria) === Number(filterValue));
    }

    const html = tracks
      .map((track) => {
        const links = db.trilhasCursos
          .filter((item) => Number(item.ID_Trilha) === Number(track.ID_Trilha))
          .sort((a, b) => Number(a.Ordem) - Number(b.Ordem));

        const listHtml = links.length
          ? links
              .map((item) => `<li class="list-group-item">${item.Ordem}. ${getCourseName(db, item.ID_Curso)}</li>`)
              .join("")
          : '<li class="list-group-item text-muted">Sem cursos vinculados</li>';

        return `
          <div class="col-12 col-lg-6">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">${track.Titulo}</h5>
                <p class="text-muted small">Categoria: ${getCategoryName(db, track.ID_Categoria)}</p>
                <p>${track.Descricao || "Sem descricao"}</p>
                <ul class="list-group list-group-flush">${listHtml}</ul>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    byId("lista-trilhas").innerHTML = html || '<p class="text-muted">Nenhuma trilha cadastrada.</p>';
  }

  function renderCategoryFilter() {
    const db = window.AppDb.loadDb();
    const options = db.categorias.map((item) => `<option value="${item.ID_Categoria}">${item.Nome}</option>`).join("");
    byId("filtro-categoria-trilha").innerHTML = `<option value="">Todas</option>${options}`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.AppLayout.initPage({ active: "trilhas", pageTitle: "Trilhas de Conhecimento" });
    if (!window.AppSession.isLoggedIn()) {
      return;
    }

    renderCategoryFilter();
    byId("filtro-categoria-trilha").addEventListener("change", renderTrilhas);
    renderTrilhas();
  });
})();
