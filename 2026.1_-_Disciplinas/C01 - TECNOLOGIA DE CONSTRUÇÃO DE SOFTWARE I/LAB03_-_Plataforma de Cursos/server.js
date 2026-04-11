const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const HOST = "127.0.0.1";
const PORT = 3000;
const ROOT_DIR = __dirname;
const USERS_DB_PATH = path.join(ROOT_DIR, "banco de dados", "usuarios.json");
const USERS_FILES_DIR = path.join(ROOT_DIR, "banco de dados", "usuarios");
const sessions = new Map();
const PROTECTED_HTML_PATHS = new Set([
  "/cursos.html",
  "/trilhas.html",
  "/projetos.html",
  "/sobre.html",
  "/contato.html"
]);

class Usuario {
  constructor(ID_Usuario, NomeCompleto, Email, SenhaHash, DataCadastro) {
    this.ID_Usuario = ID_Usuario;
    this.NomeCompleto = NomeCompleto;
    this.Email = Email;
    this.SenhaHash = SenhaHash;
    this.DataCadastro = DataCadastro;
  }
}

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

function hashPassword(password) {
  return String(password || "");
}

function ensureUsersDb() {
  const dbDirPath = path.dirname(USERS_DB_PATH);
  if (!fs.existsSync(dbDirPath)) {
    fs.mkdirSync(dbDirPath, { recursive: true });
  }

  if (!fs.existsSync(USERS_FILES_DIR)) {
    fs.mkdirSync(USERS_FILES_DIR, { recursive: true });
  }

  if (!fs.existsSync(USERS_DB_PATH)) {
    fs.writeFileSync(USERS_DB_PATH, JSON.stringify({ usuarios: [] }, null, 2));
  }
}

function loadUsersDb() {
  ensureUsersDb();
  const raw = fs.readFileSync(USERS_DB_PATH, "utf-8");
  const parsed = JSON.parse(raw);
  if (!parsed.usuarios || !Array.isArray(parsed.usuarios)) {
    return { usuarios: [] };
  }
  return parsed;
}

function saveUsersDb(db) {
  fs.writeFileSync(USERS_DB_PATH, JSON.stringify(db, null, 2));
}

function getUserFilePath(userId) {
  return path.join(USERS_FILES_DIR, `${userId}.json`);
}

function saveUserFile(user) {
  fs.writeFileSync(getUserFilePath(user.ID_Usuario), JSON.stringify(user, null, 2));
}

function loadUsersFromFiles() {
  ensureUsersDb();
  const entries = fs.readdirSync(USERS_FILES_DIR, { withFileTypes: true });
  const users = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) {
      continue;
    }

    try {
      const filePath = path.join(USERS_FILES_DIR, entry.name);
      const content = fs.readFileSync(filePath, "utf-8");
      const user = JSON.parse(content);
      if (user && user.Email && user.SenhaHash) {
        users.push(user);
      }
    } catch {
      // Ignore invalid user file and continue.
    }
  }

  return users;
}

function findUserByEmailFromFiles(email) {
  const normalizedTargetEmail = normalizeEmail(email);
  const users = loadUsersFromFiles();
  return users.find((user) => normalizeEmail(user.Email) === normalizedTargetEmail) || null;
}

function getNextUserId(usuarios) {
  const maxId = usuarios.reduce((max, user) => Math.max(max, Number(user.ID_Usuario) || 0), 0);
  return maxId + 1;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function parseJsonSafely(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, value: null };
  }
}

function getUrlPath(req) {
  return decodeURIComponent((req.url || "/").split("?")[0]);
}

function parseCookies(req) {
  const cookieHeader = req.headers.cookie || "";
  const parts = cookieHeader.split(";").map((item) => item.trim()).filter(Boolean);
  const cookies = {};

  for (const part of parts) {
    const separatorIndex = part.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();
    cookies[key] = decodeURIComponent(value);
  }

  return cookies;
}

function createSession(email) {
  const sessionId = crypto.randomBytes(24).toString("hex");
  sessions.set(sessionId, {
    email,
    createdAt: Date.now()
  });
  return sessionId;
}

function getSession(req) {
  const cookies = parseCookies(req);
  const sessionId = cookies.sessionId;
  if (!sessionId) {
    return null;
  }
  return { sessionId, sessionData: sessions.get(sessionId) || null };
}

function isUserStillRegistered(email) {
  if (!email) {
    return false;
  }
  return Boolean(findUserByEmailFromFiles(email));
}

function canAccessProtectedPages(req) {
  const session = getSession(req);
  if (!session || !session.sessionData) {
    return false;
  }

  const exists = isUserStillRegistered(session.sessionData.email);
  if (!exists) {
    sessions.delete(session.sessionId);
    return false;
  }

  return true;
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

  const { nomeCompleto, email, senha } = parsed.value;
  const normalizedEmail = normalizeEmail(email);
  const cleanName = String(nomeCompleto || "").trim();

  if (!cleanName || !normalizedEmail || !senha) {
    sendJson(res, 400, { ok: false, message: "Nome, email e senha sao obrigatorios" });
    return;
  }

  const db = loadUsersDb();
  const exists = Boolean(findUserByEmailFromFiles(normalizedEmail));

  if (exists) {
    sendJson(res, 409, { ok: false, message: "Email ja cadastrado" });
    return;
  }

  const user = new Usuario(
    getNextUserId(db.usuarios),
    cleanName,
    normalizedEmail,
    hashPassword(String(senha)),
    new Date().toISOString()
  );

  db.usuarios.push(user);
  saveUsersDb(db);
  saveUserFile(user);

  sendJson(res, 201, {
    ok: true,
    message: "Usuario cadastrado com sucesso",
    usuario: {
      ID_Usuario: user.ID_Usuario,
      NomeCompleto: user.NomeCompleto,
      Email: user.Email,
      DataCadastro: user.DataCadastro
    }
  });
}

async function handleLogin(req, res) {
  const body = await readBody(req);
  const parsed = parseJsonSafely(body);

  if (!parsed.ok) {
    sendJson(res, 400, { ok: false, message: "JSON invalido" });
    return;
  }

  const { email, senha } = parsed.value;
  const normalizedEmail = normalizeEmail(email);
  const passwordHash = hashPassword(String(senha || ""));

  if (!normalizedEmail || !senha) {
    sendJson(res, 400, { ok: false, message: "Email e senha sao obrigatorios" });
    return;
  }

  const user = findUserByEmailFromFiles(normalizedEmail);

  if (!user) {
    sendJson(res, 401, { ok: false, message: "Usuário não cadastrado" });
    return;
  }

  if (user.SenhaHash !== passwordHash) {
    sendJson(res, 401, { ok: false, message: "Credenciais invalidas" });
    return;
  }

  const sessionId = createSession(user.Email);

  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Set-Cookie": `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Lax`
  });
  res.end(JSON.stringify({
    ok: true,
    message: "Login realizado com sucesso",
    usuario: {
      ID_Usuario: user.ID_Usuario,
      NomeCompleto: user.NomeCompleto,
      Email: user.Email,
      DataCadastro: user.DataCadastro
    }
  }));
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
      const session = getSession(req);
      if (session && session.sessionId) {
        sessions.delete(session.sessionId);
      }
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Set-Cookie": "sessionId=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
      });
      res.end(JSON.stringify({ ok: true, message: "Logout realizado" }));
      return;
    }

    if (req.method === "GET") {
      if (PROTECTED_HTML_PATHS.has(urlPath) && !canAccessProtectedPages(req)) {
        redirectToLogin(res);
        return;
      }

      serveStaticFile(req, res);
      return;
    }

    res.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: false, message: "Metodo nao permitido" }));
  } catch (error) {
    sendJson(res, 500, { ok: false, message: "Erro interno", detail: error.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
