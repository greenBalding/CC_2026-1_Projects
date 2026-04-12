(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  function showMessage(text, type) {
    window.AppUtils.clearMessage(byId("msg-cursos"));
    window.AppUtils.setMessage(byId("msg-cursos"), text, type);
  }

  function getCategoryName(db, categoryId) {
    const category = db.categorias.find((item) => Number(item.ID_Categoria) === Number(categoryId));
    return category ? category.Nome : "Sem categoria";
  }

  function getCourseModules(db, courseId) {
    return db.modulos
      .filter((item) => Number(item.ID_Curso) === Number(courseId))
      .sort((a, b) => Number(a.Ordem) - Number(b.Ordem));
  }

  function isEnrolled(db, userId, courseId) {
    return db.matriculas.some(
      (item) => Number(item.ID_Usuario) === Number(userId) && Number(item.ID_Curso) === Number(courseId)
    );
  }

  function renderCategoryFilter(db) {
    const select = byId("filtro-categoria");
    if (!select) {
      return;
    }

    const options = db.categorias.map((item) => `<option value="${item.ID_Categoria}">${item.Nome}</option>`).join("");
    select.innerHTML = `<option value="">Todas</option>${options}`;
  }

  function getCourseImage(course) {
    return course.Imagem || "./img/school.svg";
  }

  function buildGenericModuleList(modules) {
    const total = Math.max(modules.length, 4);

    let html = "";
    for (let index = 1; index <= total; index += 1) {
      html += `
        <li class="list-group-item">
          <strong>Modulo ${index}:</strong> Tema do modulo ${index}
          <div class="small text-muted">[conteudo generico]</div>
        </li>
      `;
    }

    return html;
  }

  function buildCourseCard(db, user, course) {
    const enrolled = isEnrolled(db, user.ID_Usuario, course.ID_Curso);
    const modules = getCourseModules(db, course.ID_Curso);
    const moduleHtml = buildGenericModuleList(modules);

    return `
      <div class="col-12 col-md-6 col-xl-4">
        <div class="card h-100 shadow-sm">
          <img src="${getCourseImage(course)}" class="card-img-top" alt="Imagem do curso" style="height: 180px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${course.Titulo}</h5>
            <p class="text-muted small mb-2">${getCategoryName(db, course.ID_Categoria)} | ${course.Nivel}</p>
            <p class="card-text">${course.Descricao || "Sem descricao"}</p>
            <p class="small mb-2">[tantas] aulas | [tantas] horas</p>
            <div class="mt-auto d-grid">
              <button class="btn ${enrolled ? "btn-success" : "btn-primary"}" data-action="matricular" data-id="${course.ID_Curso}" ${enrolled ? "disabled" : ""}>
                ${enrolled ? "Matriculado" : "Matricular"}
              </button>
            </div>
            <div class="mt-3">
              <ul class="list-group list-group-flush">${moduleHtml}</ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderCourses() {
    const db = window.AppDb.loadDb();
    const user = window.AppSession.getLoggedUser();
    const filterValue = byId("filtro-categoria").value;

    let courses = db.cursos;
    if (filterValue) {
      courses = courses.filter((item) => Number(item.ID_Categoria) === Number(filterValue));
    }

    byId("lista-cursos").innerHTML = courses.map((course) => buildCourseCard(db, user, course)).join("");
  }

  function enroll(courseId) {
    const user = window.AppSession.getLoggedUser();

    try {
      window.AppDb.withDb((db) => {
        const alreadyEnrolled = isEnrolled(db, user.ID_Usuario, courseId);
        if (alreadyEnrolled) {
          throw new Error("Voce ja esta matriculado neste curso");
        }

        const id = window.AppDb.nextId(db.matriculas, "ID_Matricula");
        db.matriculas.push(new Matricula(id, user.ID_Usuario, courseId, new Date().toISOString(), null));
      });

      showMessage("Matricula realizada com sucesso.", "success");
      renderCourses();
    } catch (error) {
      showMessage(error.message, "danger");
    }
  }

  function bindEvents() {
    byId("filtro-categoria").addEventListener("change", renderCourses);

    document.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action='matricular']");
      if (!button) {
        return;
      }
      enroll(Number(button.getAttribute("data-id")));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.AppLayout.initPage({ active: "cursos", pageTitle: "Cursos Disponiveis" });
    if (!window.AppSession.isLoggedIn()) {
      return;
    }

    renderCategoryFilter(window.AppDb.loadDb());
    bindEvents();
    renderCourses();
  });
})();
