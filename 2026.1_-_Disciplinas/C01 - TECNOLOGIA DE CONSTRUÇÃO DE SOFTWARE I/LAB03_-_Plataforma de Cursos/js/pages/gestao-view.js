(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  function showMessage(elementId, text, type) {
    const element = byId(elementId);
    window.AppUtils.clearMessage(element);
    window.AppUtils.setMessage(element, text, type);
  }

  function clearMessage(elementId) {
    window.AppUtils.clearMessage(byId(elementId));
  }

  function getCategoryName(db, categoryId) {
    const category = db.categorias.find((item) => Number(item.ID_Categoria) === Number(categoryId));
    return category ? category.Nome : "-";
  }

  function getCourseName(db, courseId) {
    const course = db.cursos.find((item) => Number(item.ID_Curso) === Number(courseId));
    return course ? course.Titulo : "-";
  }

  function recalculateCourseStats(db, courseId) {
    const course = db.cursos.find((item) => Number(item.ID_Curso) === Number(courseId));
    if (!course) {
      return;
    }

    const moduleIds = db.modulos
      .filter((item) => Number(item.ID_Curso) === Number(courseId))
      .map((item) => item.ID_Modulo);

    const aulas = db.aulas.filter((item) => moduleIds.includes(item.ID_Modulo));
    const totalMinutes = aulas.reduce((sum, item) => sum + (Number(item.DuracaoMinutos) || 0), 0);

    course.TotalAulas = aulas.length;
    course.TotalHoras = Number((totalMinutes / 60).toFixed(2));
  }

  function populateSelect(elementId, items, valueField, labelGetter, placeholder) {
    const select = byId(elementId);
    if (!select) {
      return;
    }

    const options = items
      .map((item) => `<option value="${item[valueField]}">${labelGetter(item)}</option>`)
      .join("");

    select.innerHTML = `<option value="">${placeholder}</option>${options}`;
  }

  function renderCategorias(db) {
    const tbody = byId("table-categorias-body");
    if (!tbody) {
      return;
    }

    tbody.innerHTML = db.categorias
      .map(
        (item) => `
          <tr>
            <td>${item.ID_Categoria}</td>
            <td>${item.Nome}</td>
            <td>${item.Descricao || "-"}</td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-danger" data-action="delete-categoria" data-id="${item.ID_Categoria}">Excluir</button>
            </td>
          </tr>
        `
      )
      .join("");
  }

  function renderCursos(db) {
    const tbody = byId("table-cursos-body");
    if (!tbody) {
      return;
    }

    tbody.innerHTML = db.cursos
      .map(
        (item) => `
          <tr>
            <td>${item.ID_Curso}</td>
            <td>${item.Titulo}</td>
            <td>${getCategoryName(db, item.ID_Categoria)}</td>
            <td>${item.Nivel}</td>
            <td>[tantas]</td>
            <td>[tantas] horas</td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-danger" data-action="delete-curso" data-id="${item.ID_Curso}">Excluir</button>
            </td>
          </tr>
        `
      )
      .join("");
  }

  function renderTrilhas(db) {
    const container = byId("list-trilhas");
    if (!container) {
      return;
    }

    container.innerHTML = db.trilhas
      .map((trilha) => {
        const relatedCourses = db.trilhasCursos
          .filter((item) => Number(item.ID_Trilha) === Number(trilha.ID_Trilha))
          .sort((a, b) => Number(a.Ordem) - Number(b.Ordem));

        const courseList = relatedCourses.length
          ? relatedCourses
              .map((item) => `${item.Ordem}. ${getCourseName(db, item.ID_Curso)}`)
              .join("<br>")
          : "Sem cursos vinculados";

        return `
          <div class="col-12 col-lg-6">
            <div class="card h-100">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <h5 class="card-title mb-1">${trilha.Titulo}</h5>
                    <p class="text-muted small mb-2">Categoria: ${getCategoryName(db, trilha.ID_Categoria)}</p>
                  </div>
                  <button class="btn btn-sm btn-outline-danger" data-action="delete-trilha" data-id="${trilha.ID_Trilha}">Excluir</button>
                </div>
                <p class="mb-2">${trilha.Descricao || "Sem descricao"}</p>
                <div class="small">${courseList}</div>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function renderConteudo(db) {
    const container = byId("list-conteudo");
    if (!container) {
      return;
    }

    container.innerHTML = db.cursos
      .map((curso) => {
        const modulos = db.modulos
          .filter((item) => Number(item.ID_Curso) === Number(curso.ID_Curso))
          .sort((a, b) => Number(a.Ordem) - Number(b.Ordem));

        const moduloLines = modulos
          .map((modulo) => {
            const aulas = db.aulas
              .filter((item) => Number(item.ID_Modulo) === Number(modulo.ID_Modulo))
              .sort((a, b) => Number(a.Ordem) - Number(b.Ordem));

            const aulaLines = aulas.length
              ? aulas
                  .map(
                    (aula) =>
                      `<li class="list-group-item d-flex justify-content-between align-items-center">
                        <span>${aula.Ordem}. ${aula.Titulo} (${aula.TipoConteudo})</span>
                        <button class="btn btn-sm btn-outline-danger" data-action="delete-aula" data-id="${aula.ID_Aula}">Excluir</button>
                      </li>`
                  )
                  .join("")
              : '<li class="list-group-item text-muted">Sem aulas</li>';

            return `
              <div class="border rounded p-2 mb-2">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <strong>Modulo ${modulo.Ordem}: ${modulo.Titulo}</strong>
                  <button class="btn btn-sm btn-outline-danger" data-action="delete-modulo" data-id="${modulo.ID_Modulo}">Excluir</button>
                </div>
                <ul class="list-group list-group-flush">${aulaLines}</ul>
              </div>
            `;
          })
          .join("");

        return `
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${curso.Titulo}</h5>
                ${moduloLines || '<p class="text-muted mb-0">Sem modulos.</p>'}
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function renderAll() {
    const db = window.AppDb.loadDb();

    renderCategorias(db);
    renderCursos(db);
    renderTrilhas(db);
    renderConteudo(db);

    populateSelect("curso-categoria", db.categorias, "ID_Categoria", (item) => item.Nome, "Selecione");
    populateSelect("trilha-categoria", db.categorias, "ID_Categoria", (item) => item.Nome, "Selecione");
    populateSelect("trilha-curso-trilha", db.trilhas, "ID_Trilha", (item) => item.Titulo, "Selecione trilha");
    populateSelect("trilha-curso-curso", db.cursos, "ID_Curso", (item) => item.Titulo, "Selecione curso");
    populateSelect("modulo-curso", db.cursos, "ID_Curso", (item) => item.Titulo, "Selecione curso");
    populateSelect(
      "aula-modulo",
      db.modulos,
      "ID_Modulo",
      (item) => `${item.Titulo} (${getCourseName(db, item.ID_Curso)})`,
      "Selecione modulo"
    );
  }

  window.GestaoView = {
    byId,
    clearMessage,
    showMessage,
    renderAll,
    recalculateCourseStats
  };
})();
