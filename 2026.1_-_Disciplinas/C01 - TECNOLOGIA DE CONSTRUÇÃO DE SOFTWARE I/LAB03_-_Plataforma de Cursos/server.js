const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Usuario = require("./js/modelo-de-dados/core/Usuarios.js");

const HOST = "127.0.0.1";
const PORT = 3000;
const ROOT_DIR = __dirname;

const USERS_DIR = path.join(ROOT_DIR, "banco de dados", "usuarios");
const USERS_INDEX_PATH = path.join(ROOT_DIR, "banco de dados", "usuarios.json");
const PLATFORM_DATA_DIR = path.join(ROOT_DIR, "banco de dados", "plataforma");
const PLATFORM_COLLECTION_KEYS = [
  "categorias",
  "cursos",
  "trilhas",
  "trilhasCursos",
  "modulos",
  "aulas",
  "matriculas",
  "progressoAulas",
  "certificados",
  "planos",
  "assinaturas",
  "pagamentos"
];

const sessions = new Map();

const PROTECTED_HTML_PATHS = new Set([
  "/cursos.html",
  "/trilhas.html",
  "/projetos.html",
  "/sobre.html",
  "/contato.html",
  "/gestao.html"
]);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function setApiCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function ensureUsersStorage() {
  if (!fs.existsSync(USERS_DIR)) {
    fs.mkdirSync(USERS_DIR, { recursive: true });
  }
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeRole(user) {
  if (user && user.TipoUsuario) {
    return user.TipoUsuario;
  }
  return normalizeEmail(user && user.Email) === "admin@email.com" ? "admin" : "aluno";
}

function getDefaultPlatformData() {
  const cursos = [
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
      Imagem: "./img/react.png"
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
      Imagem: "./img/swift.png"
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
      Imagem: "./img/big-data.png"
    }
  ];

  const modulos = [];
  const aulas = [];
  let idModulo = 1;
  let idAula = 1;

  cursos.forEach((curso) => {
    for (let ordemModulo = 1; ordemModulo <= 4; ordemModulo += 1) {
      modulos.push({
        ID_Modulo: idModulo,
        ID_Curso: curso.ID_Curso,
        Titulo: `Modulo ${ordemModulo} - Tema do modulo ${ordemModulo}`,
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
    modulos,
    aulas,
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

function getCollectionFilePath(key) {
  return path.join(PLATFORM_DATA_DIR, `${key}.json`);
}

function ensureJsonFile(filePath, fallbackValue) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallbackValue, null, 2));
  }
}

function ensurePlatformStorage() {
  if (!fs.existsSync(PLATFORM_DATA_DIR)) {
    fs.mkdirSync(PLATFORM_DATA_DIR, { recursive: true });
  }

  const defaults = getDefaultPlatformData();
  PLATFORM_COLLECTION_KEYS.forEach((key) => {
    ensureJsonFile(getCollectionFilePath(key), defaults[key] || []);
  });
}

function normalizePlatformData(raw) {
  const defaults = getDefaultPlatformData();
  const normalized = { ...defaults };

  PLATFORM_COLLECTION_KEYS.forEach((key) => {
    if (raw && Array.isArray(raw[key])) {
      normalized[key] = raw[key];
    }
  });

  return normalized;
}

function loadPlatformData() {
  ensurePlatformStorage();

  const data = {};
  const defaults = getDefaultPlatformData();

  PLATFORM_COLLECTION_KEYS.forEach((key) => {
    try {
      const filePath = getCollectionFilePath(key);
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      data[key] = Array.isArray(parsed) ? parsed : defaults[key] || [];
    } catch {
      data[key] = defaults[key] || [];
    }
  });

  return normalizePlatformData(data);
}

function savePlatformData(rawData) {
  ensurePlatformStorage();

  const data = normalizePlatformData(rawData);
  PLATFORM_COLLECTION_KEYS.forEach((key) => {
    const filePath = getCollectionFilePath(key);
    fs.writeFileSync(filePath, JSON.stringify(data[key], null, 2));
  });

  return data;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1e6) {
        reject(new Error("Body muito grande"));
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function parseJsonSafely(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, value: null };
  }
}

function parseCookies(req) {
  const raw = req.headers.cookie || "";
  const cookieMap = {};

  raw
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      const separator = part.indexOf("=");
      if (separator <= 0) {
        return;
      }
      const key = part.slice(0, separator).trim();
      const value = part.slice(separator + 1).trim();
      cookieMap[key] = decodeURIComponent(value);
    });

  return cookieMap;
}

function createSession(email) {
  const sessionId = crypto.randomBytes(24).toString("hex");
  sessions.set(sessionId, { email, createdAt: Date.now() });
  return sessionId;
}

function getSession(req) {
  const cookies = parseCookies(req);
  const sessionId = cookies.sessionId;
  if (!sessionId) {
    return null;
  }

  const data = sessions.get(sessionId);
  if (!data) {
    return null;
  }

  return { sessionId, data };
}

function loadUsers() {
  ensureUsersStorage();

  const files = fs.readdirSync(USERS_DIR, { withFileTypes: true });
  const users = [];

  for (const file of files) {
    if (!file.isFile() || !file.name.endsWith(".json")) {
      continue;
    }

    try {
      const fullPath = path.join(USERS_DIR, file.name);
      const content = fs.readFileSync(fullPath, "utf-8");
      const user = JSON.parse(content);
      if (user && user.Email && user.SenhaHash) {
        users.push(user);
      }
    } catch {
      // Ignore malformed records.
    }
  }

  return users;
}

function saveUser(user) {
  ensureUsersStorage();
  const filePath = path.join(USERS_DIR, `${user.ID_Usuario}.json`);
  fs.writeFileSync(filePath, JSON.stringify(user, null, 2));
}

function syncUsersIndex(users) {
  const payload = { usuarios: users };
  fs.writeFileSync(USERS_INDEX_PATH, JSON.stringify(payload, null, 2));
}

function findUserByEmail(users, email) {
  const normalized = normalizeEmail(email);
  return users.find((user) => normalizeEmail(user.Email) === normalized) || null;
}

function getNextUserId(users) {
  return users.reduce((max, user) => Math.max(max, Number(user.ID_Usuario) || 0), 0) + 1;
}

function userToPublicDto(user) {
  return {
    ID_Usuario: user.ID_Usuario,
    NomeCompleto: user.NomeCompleto,
    Email: user.Email,
    DataCadastro: user.DataCadastro,
    TipoUsuario: normalizeRole(user)
  };
}

function isAuthenticated(req) {
  const session = getSession(req);
  if (!session) {
    return false;
  }

  const users = loadUsers();
  const existing = findUserByEmail(users, session.data.email);
  if (!existing) {
    sessions.delete(session.sessionId);
    return false;
  }

  return true;
}

function getUrlPath(req) {
  return decodeURIComponent((req.url || "/").split("?")[0]);
}

function redirectToLogin(res) {
  res.writeHead(302, { Location: "/index.html" });
  res.end();
}

function serveStaticFile(req, res) {
  const urlPath = getUrlPath(req);
  const requestedPath = urlPath === "/" ? "/index.html" : urlPath;
  const safePath = path.normalize(path.join(ROOT_DIR, requestedPath));

  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Acesso negado");
    return;
  }

  fs.readFile(safePath, (err, file) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Arquivo nao encontrado");
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(file);
  });
}

async function handleRegister(req, res) {
  const body = await readBody(req);
  const parsed = parseJsonSafely(body);

  if (!parsed.ok) {
    sendJson(res, 400, { ok: false, message: "JSON invalido" });
    return;
  }

  const nomeCompleto = String(parsed.value.nomeCompleto || "").trim();
  const email = normalizeEmail(parsed.value.email);
  const senha = String(parsed.value.senha || "");

  if (!nomeCompleto || !email || !senha) {
    sendJson(res, 400, { ok: false, message: "Nome, email e senha sao obrigatorios" });
    return;
  }

  const users = loadUsers();
  if (findUserByEmail(users, email)) {
    sendJson(res, 409, { ok: false, message: "Email ja cadastrado" });
    return;
  }

  const nextId = getNextUserId(users);
  const user = new Usuario(nextId, nomeCompleto, email, senha, new Date().toISOString(), "aluno");

  saveUser(user);
  syncUsersIndex([...users, user]);

  sendJson(res, 201, {
    ok: true,
    message: "Usuario cadastrado com sucesso",
    usuario: userToPublicDto(user)
  });
}

async function handleLogin(req, res) {
  const body = await readBody(req);
  const parsed = parseJsonSafely(body);

  if (!parsed.ok) {
    sendJson(res, 400, { ok: false, message: "JSON invalido" });
    return;
  }

  const email = normalizeEmail(parsed.value.email);
  const senha = String(parsed.value.senha || "");

  if (!email || !senha) {
    sendJson(res, 400, { ok: false, message: "Email e senha sao obrigatorios" });
    return;
  }

  const users = loadUsers();
  const user = findUserByEmail(users, email);

  if (!user) {
    sendJson(res, 401, { ok: false, message: "Usuario nao cadastrado" });
    return;
  }

  if (String(user.SenhaHash) !== senha) {
    sendJson(res, 401, { ok: false, message: "Credenciais invalidas" });
    return;
  }

  user.TipoUsuario = normalizeRole(user);
  saveUser(user);

  const sessionId = createSession(user.Email);
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Set-Cookie": `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Lax`
  });
  res.end(
    JSON.stringify({
      ok: true,
      message: "Login realizado com sucesso",
      usuario: userToPublicDto(user)
    })
  );
}

function handleLogout(req, res) {
  const session = getSession(req);
  if (session) {
    sessions.delete(session.sessionId);
  }

  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Set-Cookie": "sessionId=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
  });
  res.end(JSON.stringify({ ok: true, message: "Logout realizado" }));
}

function handleGetPlatformData(res) {
  const dados = loadPlatformData();
  sendJson(res, 200, { ok: true, dados });
}

async function handleSavePlatformData(req, res) {
  const body = await readBody(req);
  const parsed = parseJsonSafely(body);

  if (!parsed.ok) {
    sendJson(res, 400, { ok: false, message: "JSON invalido" });
    return;
  }

  const payload = parsed.value && parsed.value.dados ? parsed.value.dados : parsed.value;
  if (!payload || typeof payload !== "object") {
    sendJson(res, 400, { ok: false, message: "Payload invalido" });
    return;
  }

  const dados = savePlatformData(payload);
  sendJson(res, 200, { ok: true, message: "Dados salvos com sucesso", dados });
}

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = getUrlPath(req);

    if (urlPath.startsWith("/api/")) {
      setApiCorsHeaders(res);
    }

    if (req.method === "OPTIONS" && urlPath.startsWith("/api/")) {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === "POST" && urlPath === "/api/usuarios") {
      await handleRegister(req, res);
      return;
    }

    if (req.method === "POST" && urlPath === "/api/login") {
      await handleLogin(req, res);
      return;
    }

    if (req.method === "POST" && urlPath === "/api/logout") {
      handleLogout(req, res);
      return;
    }

    if (req.method === "GET" && urlPath === "/api/dados") {
      handleGetPlatformData(res);
      return;
    }

    if (req.method === "POST" && urlPath === "/api/dados") {
      await handleSavePlatformData(req, res);
      return;
    }

    if (req.method === "GET") {
      if (PROTECTED_HTML_PATHS.has(urlPath) && !isAuthenticated(req)) {
        redirectToLogin(res);
        return;
      }

      serveStaticFile(req, res);
      return;
    }

    sendJson(res, 405, { ok: false, message: "Metodo nao permitido" });
  } catch (error) {
    sendJson(res, 500, { ok: false, message: "Erro interno", detail: error.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
