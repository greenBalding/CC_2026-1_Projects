function getLogoutEndpoints() {
  const sameOrigin = "/api/logout";
  const localHost = "http://127.0.0.1:3000/api/logout";
  const localhostName = "http://localhost:3000/api/logout";

  const isBackendHost =
    (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") &&
    window.location.port === "3000";

  if (isBackendHost) {
    return [sameOrigin, localHost, localhostName];
  }

  return [localHost, localhostName, sameOrigin];
}

async function callLogout() {
  let lastError = null;

  for (const endpoint of getLogoutEndpoints()) {
    try {
      await fetch(endpoint, {
        method: "POST"
      });
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Falha ao chamar logout");
}

async function doLogout(event) {
  event.preventDefault();

  try {
    await callLogout();
  } finally {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "./index.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutButtons = document.querySelectorAll("[data-logout]");
  logoutButtons.forEach((button) => {
    button.addEventListener("click", doLogout);
  });
});
