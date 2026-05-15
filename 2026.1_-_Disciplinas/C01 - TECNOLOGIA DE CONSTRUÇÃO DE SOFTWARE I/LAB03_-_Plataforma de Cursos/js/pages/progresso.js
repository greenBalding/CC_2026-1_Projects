(function () {
  const STATUS_OPTIONS = ["Nao Iniciado", "Em Progresso", "Concluido"];

  function byId(id) {
    return document.getElementById(id);
  }

  function showMessage(text, type) {
    window.AppUtils.clearMessage(byId("msg-progresso"));
    window.AppUtils.setMessage(byId("msg-progresso"), text, type);
  }

  function getCourseName(db, courseId) {
    const course = db.cursos.find((item) => Number(item.ID_Curso) === Number(courseId));
    return course ? course.Titulo : "Curso removido";
  }

  function getProgressRecord(db, userId, lessonId) {
    return (
      db.progressoAulas.find(
        (item) => Number(item.ID_Usuario) === Number(userId) && Number(item.ID_Aula) === Number(lessonId)
      ) || null
    );
  }

  function getLessonsByCourse(db, courseId) {
    const moduleIds = db.modulos
      .filter((item) => Number(item.ID_Curso) === Number(courseId))
      .map((item) => item.ID_Modulo);

    return db.aulas
      .filter((item) => moduleIds.includes(item.ID_Modulo))
      .sort((a, b) => Number(a.Ordem) - Number(b.Ordem));
  }

  function ensureCourseCertificate(db, userId, courseId) {
    const lessons = getLessonsByCourse(db, courseId);
    if (!lessons.length) {
      return;
    }

    const allDone = lessons.every((lesson) => {
      const progress = getProgressRecord(db, userId, lesson.ID_Aula);
      return progress && progress.Status === "Concluido";
    });

    const enrollment = db.matriculas.find(
      (item) => Number(item.ID_Usuario) === Number(userId) && Number(item.ID_Curso) === Number(courseId)
    );

    if (!enrollment) {
      return;
    }

    if (!allDone) {
      enrollment.DataConclusao = null;
      return;
    }

    enrollment.DataConclusao = new Date().toISOString();

    const alreadyCertified = db.certificados.some(
      (item) => Number(item.ID_Usuario) === Number(userId) && Number(item.ID_Curso) === Number(courseId)
    );

    if (alreadyCertified) {
      return;
    }

    const id = window.AppDb.nextId(db.certificados, "ID_Certificado");
    const code = `CERT-${courseId}-${userId}-${Date.now().toString(36).toUpperCase()}`;
    db.certificados.push(new Certificado(id, userId, courseId, null, code, new Date().toISOString()));
  }

  function renderProgress() {
    const db = window.AppDb.loadDb();
    const user = window.AppSession.getLoggedUser();
    const enrollments = db.matriculas.filter((item) => Number(item.ID_Usuario) === Number(user.ID_Usuario));

    if (!enrollments.length) {
      byId("lista-progresso").innerHTML = '<p class="text-muted">Voce ainda nao possui matriculas.</p>';
      return;
    }

    const html = enrollments
      .map((enrollment) => {
        const modules = db.modulos
          .filter((item) => Number(item.ID_Curso) === Number(enrollment.ID_Curso))
          .sort((a, b) => Number(a.Ordem) - Number(b.Ordem));

        const moduleHtml = modules
          .map((module) => {
            const lessons = db.aulas
              .filter((item) => Number(item.ID_Modulo) === Number(module.ID_Modulo))
              .sort((a, b) => Number(a.Ordem) - Number(b.Ordem));

            const lessonHtml = lessons.length
              ? lessons
                  .map((lesson) => {
                    const progress = getProgressRecord(db, user.ID_Usuario, lesson.ID_Aula);
                    const selectedStatus = progress ? progress.Status : "Nao Iniciado";
                    const options = STATUS_OPTIONS.map(
                      (status) =>
                        `<option value="${status}" ${status === selectedStatus ? "selected" : ""}>${status}</option>`
                    ).join("");

                    return `
                      <tr>
                        <td>${lesson.Ordem}. ${lesson.Titulo}</td>
                        <td>${lesson.TipoConteudo}</td>
                        <td>
                          <select class="form-select form-select-sm" data-action="status-aula" data-curso="${enrollment.ID_Curso}" data-aula="${lesson.ID_Aula}">
                            ${options}
                          </select>
                        </td>
                      </tr>
                    `;
                  })
                  .join("")
              : '<tr><td colspan="3" class="text-muted">Sem aulas neste modulo.</td></tr>';

            return `
              <div class="border rounded p-2 mb-2">
                <strong>Modulo ${module.Ordem}: ${module.Titulo}</strong>
                <div class="table-responsive mt-2">
                  <table class="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Aula</th>
                        <th>Tipo</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>${lessonHtml}</tbody>
                  </table>
                </div>
              </div>
            `;
          })
          .join("");

        return `
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${getCourseName(db, enrollment.ID_Curso)}</h5>
                <p class="text-muted small">Matriculado em: [data de matricula]</p>
                ${moduleHtml || '<p class="text-muted">Este curso ainda nao possui modulos.</p>'}
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    byId("lista-progresso").innerHTML = html;
  }

  function renderCertificates() {
    const db = window.AppDb.loadDb();
    const user = window.AppSession.getLoggedUser();
    const certificates = db.certificados.filter((item) => Number(item.ID_Usuario) === Number(user.ID_Usuario));

    if (!certificates.length) {
      byId("lista-certificados").innerHTML = '<p class="text-muted">Nenhum certificado gerado ate agora.</p>';
      return;
    }

    byId("lista-certificados").innerHTML = certificates
      .map(
        (item) => `
          <div class="col-12 col-lg-6">
            <div class="card h-100 border-success">
              <div class="card-body">
                <h5 class="card-title text-success">Certificado</h5>
                <p class="mb-1"><strong>Curso:</strong> ${getCourseName(window.AppDb.loadDb(), item.ID_Curso)}</p>
                <p class="mb-1"><strong>Codigo:</strong> [codigo de verificacao]</p>
                <p class="mb-0"><strong>Emissao:</strong> [data de emissao]</p>
              </div>
            </div>
          </div>
        `
      )
      .join("");
  }

  function bindEvents() {
    document.addEventListener("change", (event) => {
      const select = event.target.closest("select[data-action='status-aula']");
      if (!select) {
        return;
      }

      const lessonId = Number(select.getAttribute("data-aula"));
      const courseId = Number(select.getAttribute("data-curso"));
      const status = select.value;
      const user = window.AppSession.getLoggedUser();

      window.AppDb.withDb((db) => {
        const existing = getProgressRecord(db, user.ID_Usuario, lessonId);
        if (existing) {
          existing.Status = status;
          existing.DataConclusao = status === "Concluido" ? new Date().toISOString() : null;
        } else {
          db.progressoAulas.push(
            new Progresso_Aula(
              user.ID_Usuario,
              lessonId,
              status === "Concluido" ? new Date().toISOString() : null,
              status
            )
          );
        }

        ensureCourseCertificate(db, user.ID_Usuario, courseId);
      });

      showMessage("Status atualizado.", "success");
      renderProgress();
      renderCertificates();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.AppLayout.initPage({ active: "progresso", pageTitle: "Matriculas e Progresso" });
    if (!window.AppSession.isLoggedIn()) {
      return;
    }

    bindEvents();
    renderProgress();
    renderCertificates();
  });
})();
