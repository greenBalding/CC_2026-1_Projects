(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  function showMessage(text, type) {
    window.AppUtils.clearMessage(byId("msg-financeiro"));
    window.AppUtils.setMessage(byId("msg-financeiro"), text, type);
  }

  function addMonths(isoDate, months) {
    const date = new Date(isoDate);
    date.setMonth(date.getMonth() + Number(months || 0));
    return date.toISOString();
  }

  function formatCurrency() {
    return "[valor]";
  }

  function renderPlans() {
    const db = window.AppDb.loadDb();

    byId("lista-planos").innerHTML = db.planos
      .map(
        (plan) => `
          <div class="col-12 col-md-4">
            <div class="card h-100">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${plan.Nome}</h5>
                <p class="card-text">${plan.Descricao || "-"}</p>
                <p class="mb-1"><strong>Preco:</strong> [valor]</p>
                <p class="mb-3"><strong>Duracao:</strong> [periodo]</p>
                <button class="btn btn-outline-primary mt-auto" data-action="escolher-plano" data-id="${plan.ID_Plano}">Escolher</button>
              </div>
            </div>
          </div>
        `
      )
      .join("");

    byId("checkout-plano").innerHTML = db.planos
      .map((plan) => `<option value="${plan.ID_Plano}">${plan.Nome} - [valor]</option>`)
      .join("");
  }

  function renderHistory() {
    const db = window.AppDb.loadDb();
    const user = window.AppSession.getLoggedUser();

    const userSubscriptions = db.assinaturas.filter((item) => Number(item.ID_Usuario) === Number(user.ID_Usuario));
    const subscriptionIds = userSubscriptions.map((item) => item.ID_Assinatura);
    const userPayments = db.pagamentos.filter((item) => subscriptionIds.includes(item.ID_Assinatura));

    byId("table-assinaturas-body").innerHTML = userSubscriptions
      .map(
        (item) => `
          <tr>
            <td>[id]</td>
            <td>[plano]</td>
            <td>[inicio]</td>
            <td>[fim]</td>
          </tr>
        `
      )
      .join("");

    byId("table-pagamentos-body").innerHTML = userPayments
      .map(
        (item) => `
          <tr>
            <td>[id]</td>
            <td>[valor]</td>
            <td>${item.MetodoPagamento}</td>
            <td>[transacao]</td>
            <td>[data]</td>
          </tr>
        `
      )
      .join("");
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action='escolher-plano']");
      if (!button) {
        return;
      }

      byId("checkout-plano").value = button.getAttribute("data-id");
      byId("checkout-plano").focus();
    });

    byId("form-checkout").addEventListener("submit", (event) => {
      event.preventDefault();

      const user = window.AppSession.getLoggedUser();
      const planId = Number(byId("checkout-plano").value);
      const paymentMethod = byId("checkout-metodo").value;

      window.AppDb.withDb((db) => {
        const plan = db.planos.find((item) => Number(item.ID_Plano) === planId);
        if (!plan) {
          throw new Error("Plano invalido");
        }

        const now = new Date().toISOString();
        const endDate = addMonths(now, plan.DuracaoMeses);

        const subscriptionId = window.AppDb.nextId(db.assinaturas, "ID_Assinatura");
        db.assinaturas.push(new Assinatura(subscriptionId, user.ID_Usuario, plan.ID_Plano, now, endDate));

        const paymentId = window.AppDb.nextId(db.pagamentos, "ID_Pagamento");
        const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        db.pagamentos.push(
          new Pagamento(
            paymentId,
            subscriptionId,
            plan.Preco,
            now,
            paymentMethod,
            transactionId,
            endDate
          )
        );
      });

      byId("form-checkout").reset();
      showMessage("Pagamento registrado com sucesso.", "success");
      renderPlans();
      renderHistory();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.AppLayout.initPage({ active: "financeiro", pageTitle: "Assinaturas e Pagamentos" });
    if (!window.AppSession.isLoggedIn()) {
      return;
    }

    bindEvents();
    renderPlans();
    renderHistory();
  });
})();
