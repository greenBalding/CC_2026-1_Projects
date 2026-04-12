(function () {
  const CHAVE_BANCO = "json-servidor";
  const ENDPOINT_DADOS = "/api/dados";
  let cacheDb = null;
  let cacheInicializado = false;

  const IMAGENS_CURSOS = [
    "./img/react.png",
    "./img/swift.png",
    "./img/big-data.png"
  ];

  const ID_FIELDS = {
    categorias: "ID_Categoria",
    cursos: "ID_Curso",
    trilhas: "ID_Trilha",
    modulos: "ID_Modulo",
    aulas: "ID_Aula",
    matriculas: "ID_Matricula",
    certificados: "ID_Certificado",
    planos: "ID_Plano",
    assinaturas: "ID_Assinatura",
    pagamentos: "ID_Pagamento"
  };

  function obterImagemPadrao(indice) {
    return IMAGENS_CURSOS[indice % IMAGENS_CURSOS.length] || "./img/school.svg";
  }

  function criarCursosPadrao() {
    return [
      {
        ID_Curso: 1,
        Titulo: "Curso Generico 1",
        Descricao: "Descricao generica do curso",
        ID_Instrutor: 1,
        ID_Categoria: 1,
        Nivel: "Iniciante",
        DataPublicacao: "2026-01-01",
        TotalAulas: 8,
        TotalHoras: 4,
        Imagem: obterImagemPadrao(0)
      },
      {
        ID_Curso: 2,
        Titulo: "Curso Generico 2",
        Descricao: "Descricao generica do curso",
        ID_Instrutor: 1,
        ID_Categoria: 2,
        Nivel: "Intermediario",
        DataPublicacao: "2026-01-01",
        TotalAulas: 8,
        TotalHoras: 4,
        Imagem: obterImagemPadrao(1)
      },
      {
        ID_Curso: 3,
        Titulo: "Curso Generico 3",
        Descricao: "Descricao generica do curso",
        ID_Instrutor: 1,
        ID_Categoria: 3,
        Nivel: "Avancado",
        DataPublicacao: "2026-01-01",
        TotalAulas: 8,
        TotalHoras: 4,
        Imagem: obterImagemPadrao(2)
      }
    ];
  }

  function criarConteudoPadrao(cursos) {
    const modulos = [];
    const aulas = [];

    let idModulo = 1;
    let idAula = 1;

    cursos.forEach((curso) => {
      for (let ordemModulo = 1; ordemModulo <= 4; ordemModulo += 1) {
        const tituloModulo = `Modulo ${ordemModulo} - Tema do modulo ${ordemModulo}`;
        modulos.push({
          ID_Modulo: idModulo,
          ID_Curso: curso.ID_Curso,
          Titulo: tituloModulo,
          Ordem: ordemModulo
        });

        for (let ordemAula = 1; ordemAula <= 2; ordemAula += 1) {
          aulas.push({
            ID_Aula: idAula,
            ID_Modulo: idModulo,
            Titulo: `Aula ${ordemAula} - Conteudo generico`,
            TipoConteudo: ordemAula % 2 === 0 ? "Texto" : "Video",
            URL_Conteudo: `https://conteudo-generico.local/${curso.ID_Curso}/${ordemModulo}/${ordemAula}`,
            DuracaoMinutos: 30,
            Ordem: ordemAula
          });
          idAula += 1;
        }

        idModulo += 1;
      }
    });

    return { modulos, aulas };
  }

  function buildDefaultDb() {
    const cursos = criarCursosPadrao();
    const conteudo = criarConteudoPadrao(cursos);

    return {
      categorias: [
        { ID_Categoria: 1, Nome: "Categoria 1", Descricao: "Descricao generica" },
        { ID_Categoria: 2, Nome: "Categoria 2", Descricao: "Descricao generica" },
        { ID_Categoria: 3, Nome: "Categoria 3", Descricao: "Descricao generica" }
      ],
      cursos,
      trilhas: [
        { ID_Trilha: 1, Titulo: "Trilha Generica 1", Descricao: "Descricao generica", ID_Categoria: 1 },
        { ID_Trilha: 2, Titulo: "Trilha Generica 2", Descricao: "Descricao generica", ID_Categoria: 2 }
      ],
      trilhasCursos: [
        { ID_Trilha: 1, ID_Curso: 1, Ordem: 1 },
        { ID_Trilha: 1, ID_Curso: 2, Ordem: 2 },
        { ID_Trilha: 2, ID_Curso: 3, Ordem: 1 }
      ],
      modulos: conteudo.modulos,
      aulas: conteudo.aulas,
      matriculas: [],
      progressoAulas: [],
      certificados: [],
      planos: [
        { ID_Plano: 1, Nome: "Plano Generico 1", Descricao: "Descricao generica", Preco: 100, DuracaoMeses: 1 },
        { ID_Plano: 2, Nome: "Plano Generico 2", Descricao: "Descricao generica", Preco: 200, DuracaoMeses: 6 },
        { ID_Plano: 3, Nome: "Plano Generico 3", Descricao: "Descricao generica", Preco: 300, DuracaoMeses: 12 }
      ],
      assinaturas: [],
      pagamentos: []
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizarCursos(cursos) {
    return (cursos || []).map((curso, indice) => ({
      ...curso,
      Imagem: curso.Imagem || obterImagemPadrao(indice)
    }));
  }

  function normalizeDb(raw) {
    const base = buildDefaultDb();
    const db = raw && typeof raw === "object" ? raw : {};

    Object.keys(base).forEach((key) => {
      if (Array.isArray(db[key])) {
        base[key] = db[key];
      }
    });

    base.cursos = normalizarCursos(base.cursos);

    if (!base.modulos.length || !base.aulas.length) {
      const conteudo = criarConteudoPadrao(base.cursos);
      base.modulos = conteudo.modulos;
      base.aulas = conteudo.aulas;
    }

    if (!base.planos.length) {
      base.planos = buildDefaultDb().planos;
    }

    return base;
  }

  function parseJsonSafely(rawText) {
    try {
      return rawText ? JSON.parse(rawText) : null;
    } catch {
      return null;
    }
  }

  function getApiCandidates(path) {
    if (window.AppUtils && typeof window.AppUtils.getApiCandidates === "function") {
      return window.AppUtils.getApiCandidates(path);
    }
    return [path];
  }

  function requestJsonSync(method, path, payload) {
    let lastError = null;

    const endpoints = getApiCandidates(path);
    for (const endpoint of endpoints) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open(method, endpoint, false);

        if (method !== "GET") {
          xhr.setRequestHeader("Content-Type", "application/json");
        }

        xhr.send(payload ? JSON.stringify(payload) : null);

        if (xhr.status >= 200 && xhr.status < 300) {
          return {
            ok: true,
            data: parseJsonSafely(xhr.responseText),
            status: xhr.status
          };
        }
      } catch (error) {
        lastError = error;
      }
    }

    return { ok: false, data: null, error: lastError, status: 0 };
  }

  function loadFromServerSync() {
    const response = requestJsonSync("GET", ENDPOINT_DADOS);
    if (!response.ok || !response.data || !response.data.dados) {
      return null;
    }
    return response.data.dados;
  }

  function saveToServerSync(db) {
    const response = requestJsonSync("POST", ENDPOINT_DADOS, { dados: db });
    return response.ok;
  }

  function ensureCache() {
    if (cacheInicializado) {
      return;
    }

    const dadosServidor = loadFromServerSync();
    cacheDb = normalizeDb(dadosServidor || buildDefaultDb());
    cacheInicializado = true;

    if (!dadosServidor) {
      saveToServerSync(cacheDb);
    }
  }

  function loadDb() {
    ensureCache();
    return clone(cacheDb);
  }

  function saveDb(db) {
    cacheDb = normalizeDb(db);
    cacheInicializado = true;
    saveToServerSync(cacheDb);
    return clone(cacheDb);
  }

  function nextId(items, fieldName) {
    if (!Array.isArray(items) || !items.length) {
      return 1;
    }

    return items.reduce((max, item) => {
      const value = Number(item[fieldName]) || 0;
      return Math.max(max, value);
    }, 0) + 1;
  }

  function withDb(mutator) {
    ensureCache();
    const result = mutator(cacheDb);
    saveToServerSync(cacheDb);
    return result;
  }

  function findById(items, fieldName, value) {
    return (items || []).find((item) => Number(item[fieldName]) === Number(value)) || null;
  }

  function resetDb() {
    cacheDb = buildDefaultDb();
    cacheInicializado = true;
    saveToServerSync(cacheDb);
  }

  window.AppDb = {
    DB_KEY: CHAVE_BANCO,
    ID_FIELDS,
    loadDb,
    saveDb,
    nextId,
    withDb,
    findById,
    resetDb,
    clone
  };
})();
