import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from "./firebase-config.js";

import { produtos, getTodayISO } from "./products.js";

const cafeList = document.getElementById("cafeList");
const pfList = document.getElementById("pfList");
const baianaList = document.getElementById("baianaList");
const diferenciadosList = document.getElementById("diferenciadosList");
const bebidaNaoAlcoolicaList = document.getElementById("bebidaNaoAlcoolicaList");
const bebidaAlcoolicaList = document.getElementById("bebidaAlcoolicaList");
const sobremesaList = document.getElementById("sobremesaList");
const petiscoList = document.getElementById("petiscoList");
const porcaoList = document.getElementById("porcaoList");
const sectionNodes = document.querySelectorAll(".menu-section");
const filterButtons = document.querySelectorAll(".menu-filter");

const adminShortcut = document.getElementById("adminShortcut");
const floatingCartBtn = document.getElementById("floatingCartBtn");
const floatingCount = document.getElementById("floatingCount");

const cartOverlay = document.getElementById("cartOverlay");
const cartDrawer = document.getElementById("cartDrawer");
const closeCartBtn = document.getElementById("closeCartBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const finishOrderBtn = document.getElementById("finishOrderBtn");

const drawerEmpty = document.getElementById("drawerEmpty");
const drawerContent = document.getElementById("drawerContent");
const cartFooter = document.getElementById("cartFooter");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const customerName = document.getElementById("customerName");
const customerNameHint = document.getElementById("customerNameHint");
const tableNumber = document.getElementById("tableNumber");
const openTablePickerBtn = document.getElementById("openTablePickerBtn");
const selectedTableLabel = document.getElementById("selectedTableLabel");
const selectedTableState = document.getElementById("selectedTableState");
const selectedTableInfo = document.getElementById("selectedTableInfo");
const tablePickerModal = document.getElementById("tablePickerModal");
const closeTablePickerBtn = document.getElementById("closeTablePickerBtn");
const refreshTablesBtn = document.getElementById("refreshTablesBtn");
const tablePickerGrid = document.getElementById("tablePickerGrid");
const tablePickerStatus = document.getElementById("tablePickerStatus");
const tableFilterButtons = document.querySelectorAll("[data-table-filter]");
const restaurantFields = document.getElementById("restaurantFields");
const deliveryFields = document.getElementById("deliveryFields");
const deliveryName = document.getElementById("deliveryName");
const deliveryPhone = document.getElementById("deliveryPhone");
const deliveryAddress = document.getElementById("deliveryAddress");
const deliveryNeighborhood = document.getElementById("deliveryNeighborhood");
const deliveryReference = document.getElementById("deliveryReference");
const deliveryScheduleType = document.getElementById("deliveryScheduleType");
const scheduledTimeField = document.getElementById("scheduledTimeField");
const deliveryTime = document.getElementById("deliveryTime");
const paymentMethod = document.getElementById("paymentMethod");
const orderTypeInputs = document.querySelectorAll('input[name="orderType"]');
const orderStatusMessage = document.getElementById("orderStatusMessage");
const obsPedido = document.getElementById("obsPedido");

const confirmOrderModal = document.getElementById("confirmOrderModal");
const closeConfirmModalBtn = document.getElementById("closeConfirmModalBtn");
const backConfirmBtn = document.getElementById("backConfirmBtn");
const confirmSendBtn = document.getElementById("confirmSendBtn");
const confirmOrderSummary = document.getElementById("confirmOrderSummary");

const successOrderModal = document.getElementById("successOrderModal");
const successOrderSummary = document.getElementById("successOrderSummary");
const whatsappFallbackLink = document.getElementById("whatsappFallbackLink");
const closeSuccessModalBtn = document.getElementById("closeSuccessModalBtn");

const occupiedTableModal =
  document.getElementById("occupiedTableModal");

const occupiedTableModalTitle =
  document.getElementById(
    "occupiedTableModalTitle"
  );

const cancelOccupiedTableBtn =
  document.getElementById(
    "cancelOccupiedTableBtn"
  );

const continueOccupiedTableBtn =
  document.getElementById(
    "continueOccupiedTableBtn"
  );

const occupiedTableBackdrop =
  occupiedTableModal?.querySelector(
    ".occupied-table-modal__backdrop"
  );

let occupiedTableResolve = null;

const WHATSAPP_NUMBER = "5571988682935";


const IS_LOCAL =
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "localhost";

const ONTABLE_API_BASE_URL =
  IS_LOCAL
    ? "http://127.0.0.1:5000"
    : "";

let visibleProducts = [];
let currentSelectedDate = getTodayISO();
let currentSourceDate = null;
let currentFilter = "todos";
let pendingOrder = null;
let isSubmittingOrder = false;

let tableFilter = "todos";
let tableStateByNumber = new Map();
let selectedTableContext = null;
let isLoadingTables = false;

adminShortcut?.addEventListener("click", () => {
  window.location.href = "login.html";
});

floatingCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
clearCartBtn.addEventListener("click", clearCart);
finishOrderBtn.addEventListener("click", finishOrder);
confirmSendBtn.addEventListener("click", submitPendingOrder);
closeConfirmModalBtn.addEventListener("click", closeConfirmModal);
backConfirmBtn.addEventListener("click", closeConfirmModal);
closeSuccessModalBtn.addEventListener("click", closeSuccessModal);

openTablePickerBtn?.addEventListener("click", openTablePicker);
closeTablePickerBtn?.addEventListener("click", closeTablePicker);
refreshTablesBtn?.addEventListener("click", () => loadTableStates(true));
tablePickerModal?.addEventListener("click", (event) => {
  if (event.target === tablePickerModal) closeTablePicker();
});

tableFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tableFilterButtons.forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");
    tableFilter = button.dataset.tableFilter || "todos";
    renderTableGrid();
  });
});

deliveryPhone.addEventListener("input", () => {
  deliveryPhone.value = formatBrazilianPhone(deliveryPhone.value);
});

orderTypeInputs.forEach((input) => {
  input.addEventListener("change", updateOrderTypeUI);
});

deliveryScheduleType.addEventListener("change", updateScheduleUI);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");
    currentFilter = button.dataset.filter;
    applySectionFilter();
  });
});

cancelOccupiedTableBtn?.addEventListener(
  "click",
  () => {
    closeOccupiedTableModal(false);
  }
);


continueOccupiedTableBtn?.addEventListener(
  "click",
  () => {
    closeOccupiedTableModal(true);
  }
);


occupiedTableBackdrop?.addEventListener(
  "click",
  () => {
    closeOccupiedTableModal(false);
  }
);


document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      occupiedTableModal &&
      !occupiedTableModal.classList.contains(
        "hidden"
      )
    ) {
      closeOccupiedTableModal(false);
    }
  }
);


function populateTables() {
  tableNumber.innerHTML = `
    <option value="">
      Selecione a mesa
    </option>
  `;
}

function syncTableOptions() {
  const selectedNumber =
    Number(tableNumber.value);

  const mesas = Array.from(
    tableStateByNumber.values()
  ).sort(
    (mesaA, mesaB) =>
      Number(mesaA.numero) -
      Number(mesaB.numero)
  );

  const options = mesas
    .map((mesa) => {
      const numero = String(
        mesa.numero
      ).padStart(2, "0");

      return `
        <option value="${mesa.numero}">
          Mesa ${numero}
        </option>
      `;
    })
    .join("");

  tableNumber.innerHTML = `
    <option value="">
      Selecione a mesa
    </option>
    ${options}
  `;

  if (
    selectedNumber &&
    tableStateByNumber.has(
      selectedNumber
    )
  ) {
    tableNumber.value =
      String(selectedNumber);
  }
}

function normalizeTableStatus(status) {
  const normalized = String(status || "").trim().toUpperCase();
  if (normalized === "LIVRE") return "LIVRE";
  if (normalized === "OCUPADA") return "OCUPADA";
  return "DESCONHECIDA";
}

function getTableSnapshot(number) {
  return (
    tableStateByNumber.get(
      Number(number)
    ) ||
    null
  );
}

async function loadTableStates(
  force = false
) {
  if (
    isLoadingTables &&
    !force
  ) {
    return;
  }

  isLoadingTables = true;

  tablePickerStatus
    .classList.remove(
      "is-error"
    );

  tablePickerStatus.textContent =
    "Atualizando mesas ativas...";

  try {
    const snapshot =
      await getDocs(
        collection(
          db,
          "mesas"
        )
      );

    const nextState =
      new Map();

    snapshot.forEach(
      (mesaDoc) => {
        const data =
          mesaDoc.data() || {};

        const number =
          Number(
            data.numero ??
            mesaDoc.id
          );

        if (
          !Number.isInteger(
            number
          ) ||
          number <= 0
        ) {
          return;
        }

        // Compatibilidade: mesas antigas
        // sem o campo "ativa" continuam ativas.
        const ativa =
          data.ativa !== false;

        if (!ativa) {
          return;
        }

        nextState.set(
          number,
          {
            numero:
              number,

            status:
              normalizeTableStatus(
                data.status
              ),

            atendimentoAtualId:
              data.atendimentoAtualId ||
              null,

            ativa:
              true
          }
        );
      }
    );

    const mesaSelecionada =
      Number(
        tableNumber.value
      );

    tableStateByNumber =
      nextState;

    syncTableOptions();

    if (
      mesaSelecionada &&
      !tableStateByNumber.has(
        mesaSelecionada
      )
    ) {
      clearSelectedTable();
    }

    if (nextState.size > 0) {
      tablePickerStatus.textContent =
        `${nextState.size} mesas ativas disponíveis.`;
    } else {
      tablePickerStatus.textContent =
        "Nenhuma mesa ativa está disponível.";
    }
  } catch (error) {
    console.warn(
      "Não foi possível consultar " +
      "as mesas do OnTable Saas:",
      error
    );

    tablePickerStatus
      .classList.add(
        "is-error"
      );

    tablePickerStatus.textContent =
      "Não foi possível atualizar " +
      "as mesas agora.";
  } finally {
    isLoadingTables =
      false;

    renderTableGrid();
  }
}

function renderTableGrid() {
  if (!tablePickerGrid) return;

  const tables = Array
    .from(
      tableStateByNumber
        .values()
    )
    .sort(
      (mesaA, mesaB) =>
        Number(mesaA.numero) -
        Number(mesaB.numero)
    )
    .filter(
      (mesa) => {
        if (
          tableFilter ===
          "livre"
        ) {
          return (
            mesa.status ===
            "LIVRE"
          );
        }

        if (
          tableFilter ===
          "ocupada"
        ) {
          return (
            mesa.status ===
            "OCUPADA"
          );
        }

        return true;
      }
    );

  if (!tables.length) {
    tablePickerGrid.innerHTML = `<p class="table-picker-status">Nenhuma mesa encontrada neste filtro.</p>`;
    return;
  }

  const selectedNumber = Number(tableNumber.value);

  tablePickerGrid.innerHTML = tables.map((mesa) => {
    const statusClass = mesa.status === "LIVRE"
      ? "free"
      : mesa.status === "OCUPADA"
        ? "occupied"
        : "unknown";

    const statusLabel = mesa.status === "DESCONHECIDA" ? "SEM STATUS" : mesa.status;
    const selectedClass = selectedNumber === mesa.numero ? " is-selected" : "";

    return `
      <button
        type="button"
        class="table-card-btn table-card-btn--${statusClass}${selectedClass}"
        data-table-number="${mesa.numero}"
        aria-label="${formatTable(mesa.numero)} - ${statusLabel}"
      >
        <span class="table-card-btn__number">${String(mesa.numero).padStart(2, "0")}</span>
        <span class="table-card-btn__status">${statusLabel}</span>
      </button>
    `;
  }).join("");

  tablePickerGrid.querySelectorAll("[data-table-number]").forEach((button) => {
    button.addEventListener("click", () => selectTable(Number(button.dataset.tableNumber)));
  });
}

async function openTablePicker() {
  tablePickerModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
  renderTableGrid();
  await loadTableStates();
}

function closeTablePicker() {
  tablePickerModal.classList.add("hidden");

  if (
    confirmOrderModal.classList.contains("hidden") &&
    successOrderModal.classList.contains("hidden")
  ) {
    document.body.classList.remove("modal-open");
  }
}

async function selectTable(number) {
  const mesa =
    getTableSnapshot(
      number
    );

  if (!mesa) {
    clearSelectedTable();

    tablePickerStatus
      .classList.add(
        "is-error"
      );

    tablePickerStatus.textContent =
      "Esta mesa não está mais " +
      "disponível.";

    return;
  }

  tableNumber.value = String(number);
  selectedTableLabel.textContent = formatTable(number);
  selectedTableInfo.className = "selected-table-info";
  selectedTableInfo.classList.remove("hidden");

  if (mesa.status === "OCUPADA") {
    selectedTableState.textContent = "OCUPADA • carregando atendimento atual";
    selectedTableInfo.classList.add("selected-table-info--occupied");
    selectedTableInfo.innerHTML = "<strong>Mesa ocupada.</strong> Consultando comanda atual no OnTable Saas...";
    customerName.value = "";
    customerName.readOnly = true;
    customerNameHint.textContent = "O cliente será carregado do atendimento aberto desta mesa.";

    closeTablePicker();
    await loadOccupiedTableDetails(mesa);
    return;
  }

  if (mesa.status === "LIVRE") {
    selectedTableContext = {
      statusEsperado: "LIVRE",
      atendimentoIdEsperado: null
    };

    selectedTableState.textContent = "LIVRE • novo atendimento";
    selectedTableInfo.classList.add("selected-table-info--free");
    selectedTableInfo.innerHTML = "<strong>Mesa livre.</strong> Informe o cliente e lance o primeiro pedido.";
    customerName.value = "";
    customerName.readOnly = false;
    customerNameHint.textContent = "Esta mesa está livre. O primeiro lançamento abrirá um novo atendimento.";
    closeTablePicker();
    customerName.focus();
    return;
  }

  selectedTableContext = {
    statusEsperado: "DESCONHECIDA",
    atendimentoIdEsperado: null
  };

  selectedTableState.textContent = "Status não disponível";
  selectedTableInfo.classList.add("selected-table-info--warning");
  selectedTableInfo.innerHTML = "<strong>Status em tempo real indisponível.</strong> O lançamento continuará pelo fluxo original do Firebase.";
  customerName.value = "";
  customerName.readOnly = false;
  customerNameHint.textContent = "Informe o cliente para continuar.";
  closeTablePicker();
  customerName.focus();
}

function closeOccupiedTableModal(result) {
  if (!occupiedTableModal) return;

  occupiedTableModal.classList.add(
    "hidden"
  );

  const resolve =
    occupiedTableResolve;

  occupiedTableResolve = null;

  if (
    tablePickerModal.classList.contains(
      "hidden"
    ) &&
    confirmOrderModal.classList.contains(
      "hidden"
    ) &&
    successOrderModal.classList.contains(
      "hidden"
    )
  ) {
    document.body.classList.remove(
      "modal-open"
    );
  }

  if (resolve) {
    resolve(result);
  }
}


function confirmOccupiedTable(
  mesaNumero
) {
  if (
    !occupiedTableModal ||
    !occupiedTableModalTitle
  ) {
    return Promise.resolve(true);
  }

  occupiedTableModalTitle.textContent =
    `${formatTable(mesaNumero)} ocupada`;

  occupiedTableModal.classList.remove(
    "hidden"
  );

  document.body.classList.add(
    "modal-open"
  );

  setTimeout(() => {
    continueOccupiedTableBtn?.focus();
  }, 0);

  return new Promise((resolve) => {
    occupiedTableResolve = resolve;
  });
}

async function loadOccupiedTableDetails(mesa) {
  const atendimentoIdFirestore =
    mesa.atendimentoAtualId || null;

  selectedTableContext = {
    statusEsperado: "OCUPADA",
    atendimentoIdEsperado:
      atendimentoIdFirestore
  };

const continuar =
  await confirmOccupiedTable(
    mesa.numero
  );

if (!continuar) {
  clearSelectedTable();

  await openTablePicker();

  return;
}


  if (!atendimentoIdFirestore) {
    selectedTableState.textContent =
      "OCUPADA • atendimento não identificado";

    selectedTableInfo.className =
      "selected-table-info " +
      "selected-table-info--warning";

    selectedTableInfo.innerHTML = `
      <strong>Mesa ocupada sem atendimento identificado.</strong>
      Atualize as mesas antes de lançar.
    `;

    customerName.value = "";
    customerName.readOnly = false;

    customerNameHint.textContent =
      "Não foi possível identificar o atendimento atual.";

    return;
  }

  try {
    const response = await fetch(
      `${ONTABLE_API_BASE_URL}/api/mesas/${mesa.numero}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      }
    );

    const resultado = await response.json();

    if (
      !response.ok ||
      resultado?.ok !== true ||
      !resultado?.mesa
    ) {
      throw new Error(
        resultado?.erro ||
        "Não foi possível consultar a mesa no OnTable Saas."
      );
    }

    const mesaOnTable = resultado.mesa;

    const statusMesa = String(
      mesaOnTable.status || ""
    )
      .trim()
      .toUpperCase();

    if (statusMesa !== "OCUPADA") {
      throw new Error(
        `${formatTable(mesa.numero)} não está mais ocupada.`
      );
    }

    const atendimento =
      mesaOnTable.atendimento;

    if (!atendimento) {
      throw new Error(
        "A mesa está ocupada, mas o atendimento " +
        "não foi retornado pelo OnTable Saas."
      );
    }

    const atendimentoId = String(
      atendimento.id || ""
    ).trim();

    const clienteNome = String(
      atendimento.clienteNome || ""
    ).trim();

    const statusAtendimento = String(
      atendimento.status || ""
    )
      .trim()
      .toUpperCase();

    if (!atendimentoId) {
      throw new Error(
        "Atendimento atual sem identificador."
      );
    }

    if (statusAtendimento !== "ABERTO") {
      throw new Error(
        `Atendimento atual está ${statusAtendimento}.`
      );
    }

    if (
      atendimentoIdFirestore &&
      atendimentoId !== atendimentoIdFirestore
    ) {
      throw new Error(
        "O atendimento da mesa mudou. " +
        "Atualize a seleção."
      );
    }

    let abertura = "";

    if (atendimento.abertoEm) {
      const dataAbertura = new Date(
        atendimento.abertoEm
      );

      if (!Number.isNaN(dataAbertura.getTime())) {
        abertura =
          dataAbertura.toLocaleString(
            "pt-BR",
            {
              dateStyle: "short",
              timeStyle: "short"
            }
          );
      }
    }

    selectedTableContext = {
      statusEsperado: "OCUPADA",
      atendimentoIdEsperado:
        atendimentoId,
      clienteNome
    };

    customerName.value = clienteNome;
    customerName.readOnly = true;

    customerNameHint.textContent =
      "Mesa ocupada: o novo pedido será " +
      "acrescentado ao atendimento já aberto.";

    selectedTableState.textContent =
      "OCUPADA • adicionar à comanda";

    selectedTableInfo.className =
      "selected-table-info " +
      "selected-table-info--occupied";

    selectedTableInfo.innerHTML = `
      <div>
        <strong>Cliente:</strong>
        ${escapeHtml(
          clienteNome || "Não informado"
        )}
      </div>

      <div>
        <strong>Atendimento:</strong>
        ${escapeHtml(atendimentoId)}
      </div>

      ${
        abertura
          ? `
            <div>
              <strong>Aberto em:</strong>
              ${escapeHtml(abertura)}
            </div>
          `
          : ""
      }

      <div style="margin-top:8px;">
        <strong>
          O novo lançamento será adicionado
          a esta comanda.
        </strong>
      </div>
    `;

  } catch (error) {
    console.warn(
      "Não foi possível consultar " +
      "o atendimento pela API do OnTable Saas:",
      error
    );

    selectedTableState.textContent =
      "OCUPADA • detalhes indisponíveis";

    selectedTableInfo.className =
      "selected-table-info " +
      "selected-table-info--warning";

    selectedTableInfo.innerHTML = `
      <strong>Mesa ocupada.</strong>
      Não foi possível carregar os detalhes
      da comanda agora.

      O lançamento ainda pode continuar,
      porque o pedido será processado pelo
      worker do OnTable Saas.
    `;

    customerName.value = "";
    customerName.readOnly = false;

    customerNameHint.textContent =
      "Informe um nome para continuar. " +
      "O atendimento existente será preservado.";
  }
}

function clearSelectedTable() {
  selectedTableContext = null;
  tableNumber.value = "";
  selectedTableLabel.textContent = "Selecionar mesa";
  selectedTableState.textContent = "Consulte mesas livres e ocupadas";
  selectedTableInfo.className = "selected-table-info hidden";
  selectedTableInfo.innerHTML = "";
  customerName.value = "";
  customerName.readOnly = false;
  customerNameHint.textContent = "Em mesa livre, informe o cliente. Em mesa ocupada, o OnTable Saas carrega o atendimento atual.";
  renderTableGrid();
}

async function validateTableContextBeforeSubmit(order) {
  if (order.tipo !== "restaurante") return { ok: true };

  const contexto = order.mesaContexto;
  if (!contexto || contexto.statusEsperado === "DESCONHECIDA") {
    return {
      ok: true,
      warning: "A situação da mesa não pôde ser validada em tempo real."
    };
  }

  try {
    const mesaId = String(Number(order.mesa)).padStart(2, "0");
    const mesaSnap = await getDoc(doc(db, "mesas", mesaId));

    if (!mesaSnap.exists()) {
      return { ok: false, message: `${formatTable(order.mesa)} não foi encontrada no OnTable Saas.` };
    }

    const data = mesaSnap.data() || {};
    const statusAtual = normalizeTableStatus(data.status);
    const atendimentoAtualId = data.atendimentoAtualId || null;

    const ativa =
      data.ativa !== false;

    if (!ativa) {
      return {
        ok: false,
        message:
          `${formatTable(
            order.mesa
          )} foi desativada. ` +
          "Selecione outra mesa."
      };
    }

    if (statusAtual !== contexto.statusEsperado) {
      return {
        ok: false,
        message: `A situação da ${formatTable(order.mesa)} mudou de ${contexto.statusEsperado} para ${statusAtual}. Selecione a mesa novamente.`
      };
    }

    if (
      contexto.statusEsperado === "OCUPADA" &&
      atendimentoAtualId !== contexto.atendimentoIdEsperado
    ) {
      return {
        ok: false,
        message: `O atendimento da ${formatTable(order.mesa)} mudou. Atualize a mesa antes de lançar.`
      };
    }

    return { ok: true };
  } catch (error) {
    console.warn("Validação de contexto da mesa indisponível:", error);

    // Mantém compatibilidade com o fluxo anterior quando as regras atuais do
    // Firebase não autorizam leitura operacional dessas coleções.
    return {
      ok: true,
      warning: "Validação em tempo real indisponível; pedido seguirá pelo fluxo original."
    };
  }
}

function formatFirestoreDateTime(value) {
  try {
    const date = typeof value?.toDate === "function" ? value.toDate() : null;
    if (!date) return "";

    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return "";
  }
}

function formatBrazilianPhone(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 11);

  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function getOrderType() {
  return document.querySelector('input[name="orderType"]:checked')?.value || "restaurante";
}

function updateOrderTypeUI() {
  const type = getOrderType();
  const isRestaurant = type === "restaurante";

  restaurantFields.classList.toggle("hidden", !isRestaurant);
  restaurantFields.setAttribute("aria-hidden", String(!isRestaurant));
  deliveryFields.classList.toggle("hidden", isRestaurant);
  deliveryFields.setAttribute("aria-hidden", String(isRestaurant));

  document.querySelectorAll(".order-type-option").forEach((label) => {
    const input = label.querySelector("input");
    label.classList.toggle("is-active", Boolean(input?.checked));
  });

  clearOrderStatus();

  if (isRestaurant) {
    loadTableStates();
  }
}

function updateScheduleUI() {
  const isScheduled = deliveryScheduleType.value === "scheduled";
  scheduledTimeField.classList.toggle("hidden", !isScheduled);
  if (!isScheduled) deliveryTime.value = "";
}

async function getMenuByDateOrFallback(date) {
  const cardapiosRef = collection(db, "cardapios");
  const q = query(
    cardapiosRef,
    where("date", "<=", date),
    orderBy("date", "desc"),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  return snapshot.docs[0].data();
}

async function loadMenu() {
  try {
    const menuData = await getMenuByDateOrFallback(currentSelectedDate);

    if (!menuData) {
      visibleProducts = [];
      renderProducts();
      renderCart();
      return;
    }

    currentSourceDate = menuData.date || null;

    if (Array.isArray(menuData.visibleProducts)) {
      visibleProducts = produtos.filter((p) => menuData.visibleProducts.includes(p.id));
    } else if (menuData.products && typeof menuData.products === "object") {
      visibleProducts = produtos.filter((p) => {
        const config = menuData.products[String(p.id)] || menuData.products[p.id];
        return config?.enabled;
      });
    } else {
      visibleProducts = [];
    }

    renderProducts();
    applySectionFilter();
    renderCart();
  } catch (error) {
    console.error(error);
    visibleProducts = [];
    renderProducts();
    renderCart();
  }
}

function renderProducts() {
  renderCategory("cafe", cafeList);
  renderCategory("pf", pfList);
  renderCategory("baiana", baianaList);
  renderCategory("diferenciados", diferenciadosList);
  renderCategory("porcao", porcaoList);
  renderCategory("petisco", petiscoList);
  renderCategory("bebida", bebidaNaoAlcoolicaList, "nao_alcoolica");
  renderCategory("bebida", bebidaAlcoolicaList, "alcoolica");
  renderCategory("sobremesa", sobremesaList);
}

function renderCategory(category, container, subcategoria = null) {
  const items = visibleProducts.filter((p) =>
    p.categoria === category && (!subcategoria || p.subcategoria === subcategoria)
  );

  if (!items.length) {
    container.innerHTML = `<div class="empty-state-cart">Nenhum item disponível nesta seção.</div>`;
    return;
  }

  container.innerHTML = items.map((product) => `
    <article class="product-card menu-card">
      <img src="${product.imagem}" alt="${escapeHtml(product.nome)}" class="product-image" />
      <div class="product-content">
        <h3 class="product-name">${escapeHtml(product.nome)}</h3>
        <p class="product-desc">${escapeHtml(product.descricao || "")}</p>
        <p class="menu-product-price">${produtoTemVariacaoDePreco(product) ? `A partir de ${formatCurrency(product.preco)}` : formatCurrency(product.preco)}</p>
        <button class="menu-order-btn" type="button" data-id="${product.id}">
          Fazer pedido
        </button>
      </div>
    </article>
  `).join("");

  container.querySelectorAll(".menu-order-btn").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = `produto.html?id=${button.dataset.id}`;
    });
  });
}

function produtoTemVariacaoDePreco(produto) {
  return (produto.opcoes || []).some((grupo) =>
    (grupo.itens || []).some((item) => item.precoVariacao != null)
  );
}

function applySectionFilter() {
  sectionNodes.forEach((section) => {
    const sectionType = section.dataset.section;
    section.style.display = currentFilter === "todos" || currentFilter === sectionType ? "" : "none";
  });
}

function getCarrinho() {
  let raw = [];

  try {
    raw = JSON.parse(localStorage.getItem("carrinhoCardapio") || "[]");
  } catch (error) {
    console.warn("Carrinho inválido no localStorage. Ele será reiniciado.", error);
    localStorage.removeItem("carrinhoCardapio");
  }

  return raw
    .map(normalizeCartItem)
    .filter((item) => item && Number(item.quantidade) > 0);
}

function saveCarrinho(carrinho) {
  localStorage.setItem("carrinhoCardapio", JSON.stringify(carrinho));
}

function normalizeCartItem(item) {
  if (!item || typeof item !== "object") return null;

  const normalized = { ...item };
  const product = produtos.find((p) => Number(p.id) === Number(normalized.id));

  normalized.quantidade = Math.max(1, Number(normalized.quantidade || 1));
  normalized.precoUnitario = Number(
    normalized.precoUnitario ?? normalized.preco ?? product?.preco ?? 0
  );
  normalized.nome = normalized.nome || product?.nome || "Produto";
  normalized.categoria = normalized.categoria || product?.categoria || "";
  normalized.imagem = normalized.imagem || product?.imagem || "";
  normalized.opcoesEscolhidas = normalized.opcoesEscolhidas || {};
  normalized.observacao = normalized.observacao || "";

  if (normalized.categoria === "bebida") {
    if (Array.isArray(normalized.destinos)) {
      normalized.destinos = normalized.destinos.map(normalizeDestino);
    } else if (normalized.destino) {
      const destinoNormalizado = normalizeDestino(normalized.destino);
      normalized.destinos = destinoNormalizado
        ? Array.from({ length: normalized.quantidade }, () => destinoNormalizado)
        : [];
    } else {
      normalized.destinos = [];
    }

    if (normalized.destinos.length > normalized.quantidade) {
      normalized.destinos = normalized.destinos.slice(0, normalized.quantidade);
    }

    while (normalized.destinos.length < normalized.quantidade) {
      normalized.destinos.push("");
    }

    normalized.destino = normalized.destinos[0] || "";
  }

  return normalized;
}

function renderCart() {
  const carrinho = getCarrinho().filter((item) => item.quantidade > 0);
  const hasItems = carrinho.length > 0;

  drawerEmpty.hidden = hasItems;
  drawerContent.hidden = !hasItems;
  cartFooter.hidden = !hasItems;

  if (!hasItems) {
    cartItems.innerHTML = "";
    cartSubtotal.textContent = formatCurrency(0);
    updateFloatingCart();
    return;
  }

  cartItems.innerHTML = carrinho.map((item, index) => {
    const opcoesHtml = renderOpcoesEscolhidas(item);
    const itemObsHtml = item.observacao
      ? `<div class="cart-item__meta"><strong>Obs. do item:</strong> ${escapeHtml(item.observacao)}</div>`
      : "";
    const bebidaDestinoHtml = item.categoria === "bebida" ? buildDrinkDestinationHtml(item, index) : "";
    const itemTotal = Number(item.precoUnitario || 0) * Number(item.quantidade || 0);

    return `
      <div class="cart-item">
        <div class="cart-item__img">
          <img src="${item.imagem}" alt="${escapeHtml(item.nome)}">
        </div>

        <div>
          <div class="cart-item__name">${escapeHtml(item.nome)}</div>
          <div class="cart-item__price">
            ${formatCurrency(item.precoUnitario)} cada · <strong>${formatCurrency(itemTotal)}</strong>
          </div>

          ${opcoesHtml}
          ${bebidaDestinoHtml}
          ${itemObsHtml}

          <div class="cart-item__actions">
            <div class="qty-inline">
              <button type="button" data-cart-action="minus" data-index="${index}" aria-label="Diminuir quantidade">-</button>
              <span>${item.quantidade}</span>
              <button type="button" data-cart-action="plus" data-index="${index}" aria-label="Aumentar quantidade">+</button>
            </div>
            <button type="button" class="cart-remove-btn" data-cart-action="remove" data-index="${index}">
              Remover
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  cartItems.querySelectorAll("[data-cart-action]").forEach((btn) => {
    btn.addEventListener("click", () => updateCartItem(btn.dataset.index, btn.dataset.cartAction));
  });

  cartItems.querySelectorAll("[data-destino-select]").forEach((select) => {
    select.addEventListener("change", () => {
      updateDrinkUnitDestination(
        Number(select.dataset.index),
        Number(select.dataset.unit),
        select.value
      );
    });
  });

  cartSubtotal.textContent = formatCurrency(calculateSubtotal(carrinho));
  updateFloatingCart();
}

function buildDrinkDestinationHtml(item, index) {
  const destinos = Array.isArray(item.destinos) ? item.destinos : [];
  const validDestinos = destinos.filter(Boolean);

  if (item.quantidade <= 1) {
    return `
      <div class="cart-item__meta">
        <strong>Para:</strong> ${formatDestino(validDestinos[0] || "") || "Não definido"}
      </div>
      ${buildDrinkDestinationSelectors(item, index)}
    `;
  }

  const resumo = summarizeDestinations(validDestinos);

  return `
    <div class="cart-item__meta">
      <strong>Distribuição:</strong> ${resumo || "Defina o destino de cada bebida abaixo"}
    </div>
    ${buildDrinkDestinationSelectors(item, index)}
  `;
}

function buildDrinkDestinationSelectors(item, index) {
  const destinos = Array.isArray(item.destinos) ? item.destinos : [];
  const linhas = [];

  for (let unit = 0; unit < item.quantidade; unit++) {
    const destinoAtual = destinos[unit] || "";

    linhas.push(`
      <div class="cart-item__meta drink-destination-row">
        <strong>${unit + 1}ª bebida:</strong>
        <select data-destino-select="true" data-index="${index}" data-unit="${unit}">
          <option value="" ${destinoAtual === "" ? "selected" : ""}>Selecione</option>
          <option value="cafe" ${destinoAtual === "cafe" ? "selected" : ""}>Café da manhã</option>
          <option value="almoco" ${destinoAtual === "almoco" ? "selected" : ""}>Almoço</option>
        </select>
      </div>
    `);
  }

  return linhas.join("");
}

function updateDrinkUnitDestination(itemIndex, unitIndex, value) {
  const carrinho = getCarrinho();
  const item = carrinho[itemIndex];

  if (!item || item.categoria !== "bebida") return;

  item.destinos = Array.isArray(item.destinos) ? item.destinos : [];

  while (item.destinos.length < item.quantidade) {
    item.destinos.push("");
  }

  item.destinos[unitIndex] = normalizeDestino(value);
  item.destino = item.destinos[0] || "";

  saveCarrinho(carrinho);
  renderCart();
}

function summarizeDestinations(destinos) {
  const cafe = destinos.filter((d) => d === "cafe").length;
  const almoco = destinos.filter((d) => d === "almoco").length;
  const indefinido = destinos.filter((d) => !d).length;
  const partes = [];

  if (cafe) partes.push(`${cafe} para Café da manhã`);
  if (almoco) partes.push(`${almoco} para Almoço`);
  if (indefinido) partes.push(`${indefinido} sem destino`);

  return partes.join(", ");
}

function renderOpcoesEscolhidas(item) {
  if (!item.opcoesEscolhidas || typeof item.opcoesEscolhidas !== "object") return "";

  return Object.entries(item.opcoesEscolhidas)
    .filter(([chave, valor]) => {
      if (chave === "Refeição") return false;
      if (Array.isArray(valor)) return valor.length > 0;
      return Boolean(valor);
    })
    .map(([chave, valor]) => {
      const titulo = formatOptionKey(chave);
      const valorFormatado = Array.isArray(valor)
        ? valor.map((v) => escapeHtml(v)).join(", ")
        : escapeHtml(valor);

      return `<div class="cart-item__meta"><strong>${escapeHtml(titulo)}:</strong> ${valorFormatado}</div>`;
    })
    .join("");
}

function formatOptionKey(key) {
  return String(key)
    .replace(/^grupo_\d+_?/, "")
    .replace(/^opcao_\d+_/, "")
    .replace(/^destino_refeicao$/, "Refeição")
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
    .join(" ");
}

function updateCartItem(index, action) {
  const carrinho = getCarrinho();
  const i = Number(index);

  if (!carrinho[i]) return;

  if (action === "plus") {
    carrinho[i].quantidade += 1;

    if (carrinho[i].categoria === "bebida") {
      carrinho[i].destinos = Array.isArray(carrinho[i].destinos) ? carrinho[i].destinos : [];
      const ultimoDestino = carrinho[i].destinos[carrinho[i].destinos.length - 1] || "";
      carrinho[i].destinos.push(ultimoDestino);
      carrinho[i].destino = carrinho[i].destinos[0] || "";
    }
  }

  if (action === "minus") {
    carrinho[i].quantidade -= 1;

    if (carrinho[i].categoria === "bebida" && Array.isArray(carrinho[i].destinos)) {
      carrinho[i].destinos = carrinho[i].destinos.slice(0, Math.max(carrinho[i].quantidade, 0));
      carrinho[i].destino = carrinho[i].destinos[0] || "";
    }

    if (carrinho[i].quantidade <= 0) carrinho.splice(i, 1);
  }

  if (action === "remove") carrinho.splice(i, 1);

  saveCarrinho(carrinho);
  renderCart();
}

function updateFloatingCart() {
  const carrinho = getCarrinho();
  const totalItems = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  floatingCount.textContent = `${totalItems} ${totalItems === 1 ? "item" : "itens"}`;
  floatingCartBtn.style.display = "inline-flex";
}

function clearCart() {
  const carrinho = getCarrinho();
  if (!carrinho.length) return;

  const confirmou = confirm("Tem certeza de que deseja remover todos os itens do carrinho?");
  if (!confirmou) return;

  localStorage.removeItem("carrinhoCardapio");
  resetCheckoutForm();
  clearOrderStatus();
  renderCart();
}

function openCart() {
  cartOverlay.classList.remove("hidden");
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");

  if (getOrderType() === "restaurante") {
    loadTableStates();
  }
}

function closeCart() {
  if (isSubmittingOrder) return;
  cartOverlay.classList.add("hidden");
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function finishOrder() {
  if (isSubmittingOrder) return;

  clearOrderStatus();
  const validation = validateCheckout();
  if (!validation.ok) {
    showOrderStatus(validation.message, "error");
    validation.field?.focus();
    return;
  }

  pendingOrder = buildOrderDraft(validation.checkout, validation.carrinho);
  renderConfirmationSummary(pendingOrder);
  openConfirmModal();
}

function validateCheckout() {
  const carrinho = getCarrinho().filter((item) => item.quantidade > 0);

  if (!carrinho.length) {
    return { ok: false, message: "Nenhum item foi selecionado para o lançamento." };
  }

  const bebidasSemDestino = carrinho.filter((item) => {
    if (item.categoria !== "bebida") return false;
    const destinos = Array.isArray(item.destinos) ? item.destinos : [];
    return destinos.length !== item.quantidade || destinos.some((d) => !normalizeDestino(d));
  });

  if (bebidasSemDestino.length) {
    return {
      ok: false,
      message: "Defina para qual refeição vai cada bebida antes de lançar."
    };
  }

  const tipo = getOrderType();

  if (tipo === "restaurante") {
    const nome = customerName.value.trim();
    const mesa = Number(tableNumber.value);

    if (!mesa) {
      return {
        ok: false,
        message: "Selecione a mesa antes de lançar o pedido.",
        field: openTablePickerBtn
      };
    }

    if (!nome) {
      return {
        ok: false,
        message: selectedTableContext?.statusEsperado === "OCUPADA"
          ? "Não foi possível identificar o cliente desta mesa. Atualize a seleção."
          : "Informe o cliente da mesa.",
        field: customerName
      };
    }

    return {
      ok: true,
      carrinho,
      checkout: {
        tipo,
        nomeCliente: nome,
        mesa,
        mesaContexto: selectedTableContext
          ? {
              statusEsperado: selectedTableContext.statusEsperado,
              atendimentoIdEsperado: selectedTableContext.atendimentoIdEsperado || null
            }
          : null,
        telefone: "",
        endereco: "",
        bairro: "",
        referencia: "",
        horarioTipo: "",
        horario: "",
        formaPagamento: ""
      }
    };
  }

  const nome = deliveryName.value.trim();
  const telefone = deliveryPhone.value.trim();
  const endereco = deliveryAddress.value.trim();
  const bairro = deliveryNeighborhood.value.trim();
  const referencia = deliveryReference.value.trim();
  const horarioTipo = deliveryScheduleType.value;
  const horario = horarioTipo === "scheduled" ? deliveryTime.value : "";
  const formaPagamento = paymentMethod.value;
  const phoneDigits = telefone.replace(/\D/g, "");

  if (!nome) return { ok: false, message: "Informe o nome para entrega.", field: deliveryName };
  if (![10, 11].includes(phoneDigits.length)) {
    return {
      ok: false,
      message: "Informe um telefone válido com DDD (10 ou 11 dígitos).",
      field: deliveryPhone
    };
  }
  if (!endereco) return { ok: false, message: "Informe o endereço da entrega.", field: deliveryAddress };
  if (horarioTipo === "scheduled" && !horario) {
    return { ok: false, message: "Informe o horário agendado.", field: deliveryTime };
  }
  if (!formaPagamento) {
    return { ok: false, message: "Selecione a forma de pagamento.", field: paymentMethod };
  }

  return {
    ok: true,
    carrinho,
    checkout: {
      tipo,
      nomeCliente: nome,
      mesa: null,
      telefone,
      endereco,
      bairro,
      referencia,
      horarioTipo,
      horario,
      formaPagamento
    }
  };
}

function buildOrderDraft(checkout, carrinho) {
  const pedidoId = generateOrderId();
  const subtotal = calculateSubtotal(carrinho);

  return {
    pedidoId,
    codigoCurto: getShortOrderCode(pedidoId),
    tipo: checkout.tipo,
    mesa: checkout.mesa,
    mesaContexto: checkout.tipo === "restaurante" ? (checkout.mesaContexto || null) : null,
    cliente: {
      nome: checkout.nomeCliente,
      telefone: checkout.telefone || ""
    },
    entrega: checkout.tipo === "entrega"
      ? {
          endereco: checkout.endereco,
          bairro: checkout.bairro,
          referencia: checkout.referencia,
          horarioTipo: checkout.horarioTipo,
          horario: checkout.horario,
          formaPagamento: checkout.formaPagamento
        }
      : null,
    itens: carrinho.map((item) => ({
      produtoId: Number(item.id),
      nome: item.nome,
      categoria: item.categoria,
      quantidade: Number(item.quantidade),
      precoUnitario: Number(item.precoUnitario || 0),
      subtotalItem: roundMoney(Number(item.precoUnitario || 0) * Number(item.quantidade || 0)),
      opcoesEscolhidas: item.opcoesEscolhidas || {},
      observacao: item.observacao || "",
      destinos: item.categoria === "bebida" ? (item.destinos || []).map(normalizeDestino) : []
    })),
    observacaoGeral: obsPedido.value.trim(),
    subtotal,
    taxaServicoIncluida: false,
    status: "pendente",
    origem: "cardapio-digital",
    origemOperacional: "garcom",
    cardapioBase: currentSourceDate || null
  };
}

function renderConfirmationSummary(order) {
  const restaurantContext = order.tipo === "restaurante" && order.mesaContexto
    ? `<p><strong>Situação:</strong> ${order.mesaContexto.statusEsperado === "OCUPADA" ? "Adicionar à comanda existente" : "Abrir novo atendimento"}</p>`
    : "";

  const location = order.tipo === "restaurante"
    ? `<p><strong>Mesa:</strong> ${formatTable(order.mesa)}</p>${restaurantContext}`
    : `
      <p><strong>Telefone:</strong> ${escapeHtml(order.cliente.telefone)}</p>
      <p><strong>Entrega:</strong> ${escapeHtml(order.entrega.endereco)}${order.entrega.bairro ? ` · ${escapeHtml(order.entrega.bairro)}` : ""}</p>
      <p><strong>Horário:</strong> ${order.entrega.horarioTipo === "scheduled" ? escapeHtml(order.entrega.horario) : "O quanto antes"}</p>
      <p><strong>Pagamento:</strong> ${escapeHtml(formatPaymentMethod(order.entrega.formaPagamento))}</p>
    `;

  const items = order.itens.map((item) => `
    <li>
      <span>${item.quantidade}x ${escapeHtml(item.nome)}</span>
      <strong>${formatCurrency(item.subtotalItem)}</strong>
    </li>
  `).join("");

  confirmOrderSummary.innerHTML = `
    <div class="order-confirm-meta">
      <p><strong>Pedido:</strong> #${escapeHtml(order.codigoCurto)}</p>
      <p><strong>Tipo:</strong> ${order.tipo === "restaurante" ? "Mesa" : "Entrega"}</p>
      ${location}
      <p><strong>Cliente:</strong> ${escapeHtml(order.cliente.nome)}</p>
    </div>
    <ul class="order-confirm-items">${items}</ul>
    <div class="order-confirm-total">
      <span>Subtotal</span>
      <strong>${formatCurrency(order.subtotal)}</strong>
    </div>
  `;
}

async function submitPendingOrder() {
  if (!pendingOrder || isSubmittingOrder) return;

  setSubmittingState(true);
  closeConfirmModal(true);
  showOrderStatus(
    "Validando e lançando pedido no OnTable Saas...",
    "loading"
  );

  try {
    const tableValidation =
      await validateTableContextBeforeSubmit(
        pendingOrder
      );

    if (!tableValidation.ok) {
      const message =
        tableValidation.message ||
        "A situação da mesa mudou. Atualize antes de lançar.";

      pendingOrder = null;

      clearSelectedTable();

      await loadTableStates(true);

      showOrderStatus(
        message,
        "error"
      );

      openTablePicker();

      return;
    }

    const clienteParaSalvar = {
      nome: String(
        pendingOrder.cliente?.nome || ""
      ).trim(),

      telefone:
        pendingOrder.tipo === "restaurante"
          ? ""
          : String(
              pendingOrder.cliente?.telefone || ""
            ).trim()
    };

    const orderToSave = {
      pedidoId: pendingOrder.pedidoId,
      codigoCurto: pendingOrder.codigoCurto,
      tipo: pendingOrder.tipo,
      mesa: pendingOrder.mesa,
      cliente: clienteParaSalvar,
      entrega: pendingOrder.entrega,
      itens: pendingOrder.itens,
      observacaoGeral:
        pendingOrder.observacaoGeral,
      subtotal: pendingOrder.subtotal,
      taxaServicoIncluida:
        pendingOrder.taxaServicoIncluida,
      status: pendingOrder.status,
      origem: pendingOrder.origem,
      cardapioBase:
        pendingOrder.cardapioBase,
      criadoEm: serverTimestamp()
    };

    await setDoc(
      doc(
        db,
        "pedidos",
        pendingOrder.pedidoId
      ),
      orderToSave
    );

    const whatsappMessage =
      buildWhatsAppMessage(
        pendingOrder
      );

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}` +
      `?text=${encodeURIComponent(
        whatsappMessage
      )}`;

    const completedOrder =
      pendingOrder;

    pendingOrder = null;

    localStorage.removeItem(
      "carrinhoCardapio"
    );

    renderCart();
    resetCheckoutForm();
    clearOrderStatus();

    showSuccessModal(
      completedOrder,
      whatsappUrl
    );

  } catch (error) {
    console.error(
      "Falha ao registrar pedido:",
      error
    );

    showOrderStatus(
      "Não foi possível lançar o pedido. " +
      "Verifique a internet e tente novamente. " +
      "Os itens foram mantidos.",
      "error"
    );

  } finally {
    setSubmittingState(false);
  }
}

function buildWhatsAppMessage(order) {
  let msg = "NOVO PEDIDO\n";
  msg += `Pedido: #${order.codigoCurto}\n\n`;
  msg += `Tipo: ${order.tipo === "restaurante" ? "Mesa" : "Entrega"}\n`;

  if (order.tipo === "restaurante") {
    msg += `Mesa: ${formatTable(order.mesa)}\n`;
  }

  msg += `Cliente: ${order.cliente.nome}\n`;

  if (order.tipo === "entrega") {
    msg += `Telefone: ${order.cliente.telefone}\n`;
    msg += `Endereço: ${order.entrega.endereco}\n`;
    if (order.entrega.bairro) msg += `Bairro: ${order.entrega.bairro}\n`;
    if (order.entrega.referencia) msg += `Referência: ${order.entrega.referencia}\n`;
    msg += `Horário: ${order.entrega.horarioTipo === "scheduled" ? order.entrega.horario : "O quanto antes"}\n`;
    msg += `Pagamento: ${formatPaymentMethod(order.entrega.formaPagamento)}\n`;
  }

  if (order.cardapioBase) {
    msg += `Cardápio base: ${formatDateBR(order.cardapioBase)}\n`;
  }

  msg += "\nITENS\n";

  order.itens.forEach((item) => {
    msg += `${item.quantidade}x ${item.nome} — ${formatCurrency(item.subtotalItem)}\n`;
    msg += buildOptionsLines(item);

    if (item.categoria === "bebida" && item.destinos?.length) {
      const resumo = summarizeDestinations(item.destinos);
      if (resumo) msg += `Para: ${resumo}\n`;
    }

    if (item.observacao) msg += `Obs. do item: ${item.observacao}\n`;
    msg += "\n";
  });

  if (order.observacaoGeral) {
    msg += `Observação do pedido: ${order.observacaoGeral}\n\n`;
  }

  msg += `Subtotal: ${formatCurrency(order.subtotal)}\n`;
  msg += "10% de serviço: não incluído neste pedido";

  return msg.trim();
}

function buildOptionsLines(item) {
  if (!item.opcoesEscolhidas || typeof item.opcoesEscolhidas !== "object") return "";

  return Object.entries(item.opcoesEscolhidas)
    .filter(([chave, valor]) => {
      if (chave === "Refeição") return false;
      if (Array.isArray(valor)) return valor.length > 0;
      return Boolean(valor);
    })
    .map(([chave, valor]) => {
      const valorFormatado = Array.isArray(valor) ? valor.join(", ") : valor;
      return `- ${formatOptionKey(chave)}: ${valorFormatado}\n`;
    })
    .join("");
}

function showSuccessModal(order, whatsappUrl) {
  const locationText = order.tipo === "restaurante"
    ? `<p><strong>${formatTable(order.mesa)}</strong></p>`
    : `<p><strong>${escapeHtml(order.cliente.nome)}</strong></p>`;

  successOrderSummary.innerHTML = `
    ${locationText}
    <p>Pedido <strong>#${escapeHtml(order.codigoCurto)}</strong></p>
    <p>O pedido foi registrado no OnTable Saas e seguirá para a operação.</p>
  `;

  whatsappFallbackLink.href = whatsappUrl;
  whatsappFallbackLink.classList.remove("is-emphasized");
  successOrderModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function openConfirmModal() {
  confirmOrderModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closeConfirmModal(force = false) {
  if (isSubmittingOrder && !force) return;
  confirmOrderModal.classList.add("hidden");
  if (successOrderModal.classList.contains("hidden")) document.body.classList.remove("modal-open");
}

function closeSuccessModal() {
  successOrderModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  closeCart();
}

function setSubmittingState(isSubmitting) {
  isSubmittingOrder = isSubmitting;
  finishOrderBtn.disabled = isSubmitting;
  confirmSendBtn.disabled = isSubmitting;
  finishOrderBtn.textContent = isSubmitting ? "LANÇANDO..." : "LANÇAR PEDIDO";
  confirmSendBtn.textContent = isSubmitting ? "LANÇANDO..." : "Confirmar lançamento";
}

function showOrderStatus(message, type = "error") {
  orderStatusMessage.textContent = message;
  orderStatusMessage.className = `order-status order-status--${type}`;
}

function clearOrderStatus() {
  orderStatusMessage.textContent = "";
  orderStatusMessage.className = "order-status hidden";
}

function resetCheckoutForm() {
  clearSelectedTable();
  deliveryName.value = "";
  deliveryPhone.value = "";
  deliveryAddress.value = "";
  deliveryNeighborhood.value = "";
  deliveryReference.value = "";
  deliveryScheduleType.value = "asap";
  deliveryTime.value = "";
  paymentMethod.value = "";
  obsPedido.value = "";
  updateScheduleUI();
}

function calculateSubtotal(carrinho) {
  return roundMoney(carrinho.reduce((total, item) => {
    return total + Number(item.precoUnitario || 0) * Number(item.quantidade || 0);
  }, 0));
}

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function generateOrderId() {
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    "-",
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0")
  ].join("");

  const random = typeof crypto !== "undefined" && crypto.getRandomValues
    ? Array.from(crypto.getRandomValues(new Uint8Array(3)), (n) => n.toString(16).padStart(2, "0")).join("").toUpperCase()
    : Math.random().toString(36).slice(2, 8).toUpperCase();

  return `PED-${stamp}-${random}`;
}

function getShortOrderCode(orderId) {
  return String(orderId).split("-").pop() || String(orderId).slice(-6);
}

function formatTable(table) {
  return `Mesa ${String(Number(table) || 0).padStart(2, "0")}`;
}

function formatPaymentMethod(method) {
  const labels = {
    pix: "PIX",
    dinheiro: "Dinheiro",
    debito: "Débito",
    credito: "Crédito"
  };
  return labels[method] || method || "Não informado";
}

function normalizeDestino(destino) {
  const value = String(destino || "").trim().toLowerCase();
  if (!value) return "";
  if (value === "cafe" || value === "café da manhã" || value === "cafe da manhã") return "cafe";
  if (value === "almoco" || value === "almoço") return "almoco";
  return "";
}

function formatDestino(destino) {
  const value = normalizeDestino(destino);
  if (value === "cafe") return "Café da manhã";
  if (value === "almoco") return "Almoço";
  return "";
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function formatDateBR(dateString) {
  const [year, month, day] = String(dateString).split("-");
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
}

function escapeHtml(text = "") {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

populateTables();
updateOrderTypeUI();
updateScheduleUI();
await loadMenu();
await loadTableStates();
updateFloatingCart();
renderCart();
