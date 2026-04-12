(function () {
  function bindCategoriaForm() {
    GestaoView.byId("form-categoria").addEventListener("submit", (event) => {
      event.preventDefault();
      GestaoView.clearMessage("msg-categoria");

      const nome = GestaoView.byId("categoria-nome").value.trim();
      const descricao = GestaoView.byId("categoria-descricao").value.trim();

      try {
        window.AppDb.withDb((db) => {
          const duplicated = db.categorias.some((item) => item.Nome.toLowerCase() === nome.toLowerCase());
          if (duplicated) {
            throw new Error("Categoria ja cadastrada");
          }

          const id = window.AppDb.nextId(db.categorias, "ID_Categoria");
          db.categorias.push(new Categoria(id, nome, descricao));
        });

        GestaoView.byId("form-categoria").reset();
        GestaoView.showMessage("msg-categoria", "Categoria cadastrada com sucesso.", "success");
        GestaoView.renderAll();
      } catch (error) {
        GestaoView.showMessage("msg-categoria", error.message, "danger");
      }
    });
  }

  function bindCursoForm() {
    GestaoView.byId("form-curso").addEventListener("submit", (event) => {
      event.preventDefault();
      GestaoView.clearMessage("msg-curso");

      const titulo = GestaoView.byId("curso-titulo").value.trim();
      const descricao = GestaoView.byId("curso-descricao").value.trim();
      const idCategoria = Number(GestaoView.byId("curso-categoria").value);
      const nivel = GestaoView.byId("curso-nivel").value;

      try {
        window.AppDb.withDb((db) => {
          const id = window.AppDb.nextId(db.cursos, "ID_Curso");
          db.cursos.push(
            new Curso(
              id,
              titulo,
              descricao,
              1,
              idCategoria,
              nivel,
              new Date().toISOString(),
              0,
              0
            )
          );
        });

        GestaoView.byId("form-curso").reset();
        GestaoView.showMessage("msg-curso", "Curso cadastrado com sucesso.", "success");
        GestaoView.renderAll();
      } catch (error) {
        GestaoView.showMessage("msg-curso", error.message, "danger");
      }
    });
  }

  function bindTrilhaForms() {
    GestaoView.byId("form-trilha").addEventListener("submit", (event) => {
      event.preventDefault();
      GestaoView.clearMessage("msg-trilha");

      const titulo = GestaoView.byId("trilha-titulo").value.trim();
      const descricao = GestaoView.byId("trilha-descricao").value.trim();
      const idCategoria = Number(GestaoView.byId("trilha-categoria").value);

      try {
        window.AppDb.withDb((db) => {
          const id = window.AppDb.nextId(db.trilhas, "ID_Trilha");
          db.trilhas.push(new Trilha(id, titulo, descricao, idCategoria));
        });

        GestaoView.byId("form-trilha").reset();
        GestaoView.showMessage("msg-trilha", "Trilha cadastrada com sucesso.", "success");
        GestaoView.renderAll();
      } catch (error) {
        GestaoView.showMessage("msg-trilha", error.message, "danger");
      }
    });

    GestaoView.byId("form-trilha-curso").addEventListener("submit", (event) => {
      event.preventDefault();
      GestaoView.clearMessage("msg-trilha-curso");

      const idTrilha = Number(GestaoView.byId("trilha-curso-trilha").value);
      const idCurso = Number(GestaoView.byId("trilha-curso-curso").value);
      const ordem = Number(GestaoView.byId("trilha-curso-ordem").value);

      try {
        window.AppDb.withDb((db) => {
          const exists = db.trilhasCursos.some(
            (item) => Number(item.ID_Trilha) === idTrilha && Number(item.ID_Curso) === idCurso
          );

          if (exists) {
            throw new Error("Curso ja vinculado a esta trilha");
          }

          db.trilhasCursos.push(new Trilha_Curso(idTrilha, idCurso, ordem));
        });

        GestaoView.byId("form-trilha-curso").reset();
        GestaoView.showMessage("msg-trilha-curso", "Curso vinculado a trilha.", "success");
        GestaoView.renderAll();
      } catch (error) {
        GestaoView.showMessage("msg-trilha-curso", error.message, "danger");
      }
    });
  }

  function bindConteudoForms() {
    GestaoView.byId("form-modulo").addEventListener("submit", (event) => {
      event.preventDefault();
      GestaoView.clearMessage("msg-modulo");

      const idCurso = Number(GestaoView.byId("modulo-curso").value);
      const titulo = GestaoView.byId("modulo-titulo").value.trim();
      const ordem = Number(GestaoView.byId("modulo-ordem").value);

      try {
        window.AppDb.withDb((db) => {
          const id = window.AppDb.nextId(db.modulos, "ID_Modulo");
          db.modulos.push(new Modulo(id, idCurso, titulo, ordem));
        });

        GestaoView.byId("form-modulo").reset();
        GestaoView.showMessage("msg-modulo", "Modulo cadastrado.", "success");
        GestaoView.renderAll();
      } catch (error) {
        GestaoView.showMessage("msg-modulo", error.message, "danger");
      }
    });

    GestaoView.byId("form-aula").addEventListener("submit", (event) => {
      event.preventDefault();
      GestaoView.clearMessage("msg-aula");

      const idModulo = Number(GestaoView.byId("aula-modulo").value);
      const titulo = GestaoView.byId("aula-titulo").value.trim();
      const tipo = GestaoView.byId("aula-tipo").value;
      const url = GestaoView.byId("aula-url").value.trim();
      const duracao = Number(GestaoView.byId("aula-duracao").value);
      const ordem = Number(GestaoView.byId("aula-ordem").value);

      try {
        window.AppDb.withDb((db) => {
          const id = window.AppDb.nextId(db.aulas, "ID_Aula");
          db.aulas.push(new Aula(id, idModulo, titulo, tipo, url, duracao, ordem));

          const modulo = db.modulos.find((item) => Number(item.ID_Modulo) === idModulo);
          if (modulo) {
            GestaoView.recalculateCourseStats(db, modulo.ID_Curso);
          }
        });

        GestaoView.byId("form-aula").reset();
        GestaoView.showMessage("msg-aula", "Aula cadastrada.", "success");
        GestaoView.renderAll();
      } catch (error) {
        GestaoView.showMessage("msg-aula", error.message, "danger");
      }
    });
  }

  function bindDeletes() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) {
        return;
      }

      const action = button.getAttribute("data-action");
      const id = Number(button.getAttribute("data-id"));

      try {
        window.AppDb.withDb((db) => {
          if (action === "delete-categoria") {
            const linkedCourse = db.cursos.some((item) => Number(item.ID_Categoria) === id);
            const linkedTrack = db.trilhas.some((item) => Number(item.ID_Categoria) === id);
            if (linkedCourse || linkedTrack) {
              throw new Error("Categoria vinculada a curso/trilha");
            }
            db.categorias = db.categorias.filter((item) => Number(item.ID_Categoria) !== id);
          }

          if (action === "delete-curso") {
            const moduleIds = db.modulos.filter((item) => Number(item.ID_Curso) === id).map((item) => item.ID_Modulo);
            const lessonIds = db.aulas.filter((item) => moduleIds.includes(item.ID_Modulo)).map((item) => item.ID_Aula);

            db.cursos = db.cursos.filter((item) => Number(item.ID_Curso) !== id);
            db.trilhasCursos = db.trilhasCursos.filter((item) => Number(item.ID_Curso) !== id);
            db.modulos = db.modulos.filter((item) => Number(item.ID_Curso) !== id);
            db.aulas = db.aulas.filter((item) => !moduleIds.includes(item.ID_Modulo));
            db.matriculas = db.matriculas.filter((item) => Number(item.ID_Curso) !== id);
            db.progressoAulas = db.progressoAulas.filter((item) => !lessonIds.includes(item.ID_Aula));
            db.certificados = db.certificados.filter((item) => Number(item.ID_Curso) !== id);
          }

          if (action === "delete-trilha") {
            db.trilhas = db.trilhas.filter((item) => Number(item.ID_Trilha) !== id);
            db.trilhasCursos = db.trilhasCursos.filter((item) => Number(item.ID_Trilha) !== id);
          }

          if (action === "delete-modulo") {
            const modulo = db.modulos.find((item) => Number(item.ID_Modulo) === id);
            const lessonIds = db.aulas.filter((item) => Number(item.ID_Modulo) === id).map((item) => item.ID_Aula);

            db.modulos = db.modulos.filter((item) => Number(item.ID_Modulo) !== id);
            db.aulas = db.aulas.filter((item) => Number(item.ID_Modulo) !== id);
            db.progressoAulas = db.progressoAulas.filter((item) => !lessonIds.includes(item.ID_Aula));

            if (modulo) {
              GestaoView.recalculateCourseStats(db, modulo.ID_Curso);
            }
          }

          if (action === "delete-aula") {
            const aula = db.aulas.find((item) => Number(item.ID_Aula) === id);
            db.aulas = db.aulas.filter((item) => Number(item.ID_Aula) !== id);
            db.progressoAulas = db.progressoAulas.filter((item) => Number(item.ID_Aula) !== id);

            if (aula) {
              const modulo = db.modulos.find((item) => Number(item.ID_Modulo) === Number(aula.ID_Modulo));
              if (modulo) {
                GestaoView.recalculateCourseStats(db, modulo.ID_Curso);
              }
            }
          }
        });

        GestaoView.renderAll();
      } catch (error) {
        GestaoView.showMessage("msg-global", error.message, "danger");
      }
    });
  }

  window.GestaoActions = {
    bindAll() {
      bindCategoriaForm();
      bindCursoForm();
      bindTrilhaForms();
      bindConteudoForms();
      bindDeletes();
    }
  };
})();
