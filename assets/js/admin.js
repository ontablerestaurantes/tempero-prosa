import {
  auth,
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
  serverTimestamp,
  onAuthStateChanged,
  signOut
} from "./firebase-config.js";

import { produtos, formatCurrency, getTodayISO } from "./products.js";

const adminDate = document.getElementById("adminDate");
const loadDateBtn = document.getElementById("loadDateBtn");
const copyPreviousBtn = document.getElementById("copyPreviousBtn");
const markAllBtn = document.getElementById("markAllBtn");
const unmarkAllBtn = document.getElementById("unmarkAllBtn");
const saveMenuBtn = document.getElementById("saveMenuBtn");
const logoutBtn = document.getElementById("logoutBtn");

const adminCafeList = document.getElementById("adminCafeList");
const adminPfList = document.getElementById("adminPfList");
const adminBaianaList = document.getElementById("adminBaianaList");
const adminDiferenciadosList = document.getElementById("adminDiferenciadosList");
const adminBebidaNaoAlcoolicaList = document.getElementById("adminBebidaNaoAlcoolicaList");
const adminBebidaAlcoolicaList = document.getElementById("adminBebidaAlcoolicaList");
const adminSobremesaList = document.getElementById("adminSobremesaList");
const adminPetiscoList = document.getElementById("adminPetiscoList");
const adminPorcaoList = document.getElementById("adminPorcaoList");
const adminStatus = document.getElementById("adminStatus");
const lastConfiguredInfo = document.getElementById("lastConfiguredInfo");

let adminMenuState = {};

adminDate.value = getTodayISO();

renderAdminLists();

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    await updateLastConfiguredDate();
    await loadExactDate(adminDate.value);
  } catch (error) {
    console.error(error);
    adminStatus.textContent = "Erro ao carregar dados do admin.";
  }
});

loadDateBtn.addEventListener("click", async () => {
  await loadExactDate(adminDate.value);
});

copyPreviousBtn.addEventListener("click", async () => {
  if (!adminDate.value) {
    adminStatus.textContent = "Selecione uma data primeiro.";
    return;
  }

  adminStatus.textContent = "Copiando cardápio anterior...";

  try {
    const previous = await getPreviousMenu(adminDate.value);

    if (!previous) {
      adminStatus.textContent = "Nenhum cardápio anterior encontrado.";
      return;
    }

    adminMenuState = normalizeMenuData(previous);
    renderAdminLists();
    adminStatus.textContent = `Cardápio copiado de ${formatDateBR(previous.date)}.`;
  } catch (error) {
    console.error(error);
    adminStatus.textContent = "Erro ao copiar cardápio anterior.";
  }
});

markAllBtn.addEventListener("click", () => {
  adminMenuState = buildFullEnabledState();
  renderAdminLists();
  adminStatus.textContent = "Todos os itens e opções foram marcados.";
});

unmarkAllBtn.addEventListener("click", () => {
  adminMenuState = buildEmptyState();
  renderAdminLists();
  adminStatus.textContent = "Todos os itens e opções foram desmarcados.";
});

saveMenuBtn.addEventListener("click", async () => {
  const date = adminDate.value;

  if (!date) {
    adminStatus.textContent = "Escolha uma data.";
    return;
  }

  try {
    adminStatus.textContent = "Salvando...";

    await setDoc(doc(db, "cardapios", date), {
      date,
      products: adminMenuState,
      updatedAt: serverTimestamp()
    });

    adminStatus.textContent = `Cardápio de ${formatDateBR(date)} salvo com sucesso.`;
    await updateLastConfiguredDate();
  } catch (error) {
    console.error(error);
    adminStatus.textContent = "Erro ao salvar cardápio.";
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

async function loadExactDate(date) {
  if (!date) {
    adminStatus.textContent = "Escolha uma data.";
    return;
  }

  adminStatus.textContent = "Carregando data...";

  try {
    const ref = doc(db, "cardapios", date);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      adminMenuState = normalizeMenuData(data);
      adminStatus.textContent = `Cardápio de ${formatDateBR(date)} carregado.`;
    } else {
      adminMenuState = buildEmptyState();
      adminStatus.textContent = "Essa data ainda não foi configurada.";
    }

    renderAdminLists();
  } catch (error) {
    console.error(error);
    adminStatus.textContent = "Erro ao carregar data.";
    adminMenuState = buildEmptyState();
    renderAdminLists();
  }
}

async function getPreviousMenu(date) {
  const cardapiosRef = collection(db, "cardapios");

  const q = query(
    cardapiosRef,
    where("date", "<", date),
    orderBy("date", "desc"),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  return snapshot.docs[0].data();
}

async function updateLastConfiguredDate() {
  try {
    const cardapiosRef = collection(db, "cardapios");
    const q = query(cardapiosRef, orderBy("date", "desc"), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      lastConfiguredInfo.textContent = "Última data configurada: --";
      return;
    }

    const data = snapshot.docs[0].data();
    lastConfiguredInfo.textContent = `Última data configurada: ${formatDateBR(data.date)}`;
  } catch (error) {
    console.error(error);
    lastConfiguredInfo.textContent = "Última data configurada: --";
  }
}

function produtoTemVariacaoDePreco(produto) {
  return (produto.opcoes || []).some((grupo) =>
    (grupo.itens || []).some((item) => item.precoVariacao != null)
  );
}

function renderAdminLists() {
  renderAdminCategory("cafe", adminCafeList);
  renderAdminCategory("pf", adminPfList);
  renderAdminCategory("baiana", adminBaianaList);
  renderAdminCategory("diferenciados", adminDiferenciadosList);
  renderAdminCategory("porcao", adminPorcaoList);
  renderAdminCategory("petisco", adminPetiscoList);
  renderAdminCategory("bebida", adminBebidaNaoAlcoolicaList, "nao_alcoolica");
  renderAdminCategory("bebida", adminBebidaAlcoolicaList, "alcoolica");
  renderAdminCategory("sobremesa", adminSobremesaList);
}

function renderAdminCategory(category, container, subcategoria = null) {
  const items = produtos.filter((p) =>
    p.categoria === category && (!subcategoria || p.subcategoria === subcategoria)
  );

  if (!items.length) {
    container.innerHTML = `<div class="empty-state">Nenhum produto nesta categoria.</div>`;
    return;
  }

  container.innerHTML = items.map((product) => {
    const productState = getProductState(product.id);
    const checked = !!productState.enabled;

    return `
      <div class="admin-product-card">
        <label class="admin-product-row">
          <img src="${product.imagem}" alt="${product.nome}">
          <div>
            <p class="admin-product-name">${product.nome}</p>
            <span>${produtoTemVariacaoDePreco(product) ? `A partir de ${formatCurrency(product.preco)}` : formatCurrency(product.preco)}</span>
          </div>
          <input
            class="toggle-check"
            type="checkbox"
            data-product-toggle="${product.id}"
            ${checked ? "checked" : ""}
          >
        </label>

        ${product.opcoes?.length
        ? `
              <div class="admin-options-wrap ${checked ? "" : "is-disabled"}" data-options-wrap="${product.id}">
                ${product.opcoes.map((grupo, index) => renderOptionGroup(product, grupo, index)).join("")}
              </div>
            `
        : ""
      }
      </div>
    `;
  }).join("");

  bindCategoryEvents(container, items);
}

function renderOptionGroup(product, grupo, index) {
  const enabledItems = getEnabledItems(product.id, grupo);
  const optionKey = getOptionKey(index, grupo);

  return `
    <div class="admin-option-group">
      <div class="admin-option-group__head">
        <strong>${grupo.titulo}</strong>
        <span>${getOptionRuleLabel(grupo)}</span>
      </div>

      <div class="admin-option-items">
        ${grupo.itens.map((item) => {
    const itemEnabled = enabledItems.includes(item.nome);

    return `
            <label class="admin-option-item">
              <input
                type="checkbox"
                data-option-item="${product.id}"
                data-option-key="${escapeAttr(optionKey)}"
                data-item-name="${escapeAttr(item.nome)}"
                ${itemEnabled ? "checked" : ""}
              >
              <span>${item.nome}${item.precoVariacao != null ? ` — ${formatCurrency(item.precoVariacao)}` : item.precoAdicional ? ` — + ${formatCurrency(item.precoAdicional)}` : ""}</span>
            </label>
          `;
  }).join("")}
      </div>
    </div>
  `;
}

function bindCategoryEvents(container, items) {
  container.querySelectorAll("[data-product-toggle]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const productId = String(checkbox.dataset.productToggle);
      const productState = getProductState(productId);

      productState.enabled = checkbox.checked;

      const wrap = container.querySelector(`[data-options-wrap="${productId}"]`);
      if (wrap) {
        wrap.classList.toggle("is-disabled", !checkbox.checked);
      }
    });
  });

  container.querySelectorAll("[data-option-item]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const productId = checkbox.dataset.optionItem;
      const optionKey = checkbox.dataset.optionKey;
      const itemName = checkbox.dataset.itemName;

      const product = items.find((p) => String(p.id) === String(productId));
      if (!product) return;

      const grupoIndex = product.opcoes.findIndex((grupo, index) => getOptionKey(index, grupo) === optionKey);
      const grupo = product.opcoes[grupoIndex];
      if (!grupo) return;

      const productState = getProductState(productId);
      const currentEnabled = new Set(productState.options[optionKey]?.enabledItems || []);

      if (checkbox.checked) {
        currentEnabled.add(itemName);
      } else {
        currentEnabled.delete(itemName);
      }

      productState.options[optionKey] = {
        titulo: grupo.titulo,
        tipo: grupo.tipo || "radio",
        enabledItems: grupo.itens
          .map((item) => item.nome)
          .filter((name) => currentEnabled.has(name))
      };
    });
  });
}

function buildEmptyState() {
  const state = {};

  produtos.forEach((product) => {
    state[String(product.id)] = {
      enabled: false,
      options: buildOptionsState(product, false)
    };
  });

  return state;
}

function buildFullEnabledState() {
  const state = {};

  produtos.forEach((product) => {
    state[String(product.id)] = {
      enabled: true,
      options: buildOptionsState(product, true)
    };
  });

  return state;
}

function buildOptionsState(product, enableAllItems = false) {
  const options = {};

  (product.opcoes || []).forEach((grupo, index) => {
    const key = getOptionKey(index, grupo);

    options[key] = {
      titulo: grupo.titulo,
      tipo: grupo.tipo || "radio",
      enabledItems: enableAllItems ? grupo.itens.map((item) => item.nome) : []
    };
  });

  return options;
}

function normalizeMenuData(data) {
  if (data?.products && typeof data.products === "object") {
    const normalized = buildEmptyState();

    produtos.forEach((product) => {
      const productId = String(product.id);
      const savedState = data.products[productId] || data.products[product.id] || {};
      const normalizedProduct = normalized[productId];

      normalizedProduct.enabled = Boolean(savedState.enabled);

      (product.opcoes || []).forEach((grupo, index) => {
        const key = getOptionKey(index, grupo);
        const savedOption =
          savedState.options?.[key] ||
          savedState.options?.[String(index)] ||
          savedState.options?.[grupo.titulo];

        const allowedNames = grupo.itens.map((item) => item.nome);
        const enabledItems = Array.isArray(savedOption?.enabledItems)
          ? savedOption.enabledItems.filter((name) => allowedNames.includes(name))
          : [];

        normalizedProduct.options[key] = {
          titulo: grupo.titulo,
          tipo: grupo.tipo || "radio",
          enabledItems
        };
      });
    });

    return normalized;
  }

  if (Array.isArray(data?.visibleProducts)) {
    const normalized = buildEmptyState();

    produtos.forEach((product) => {
      const productId = String(product.id);
      const enabled = data.visibleProducts.includes(product.id);

      normalized[productId] = {
        enabled,
        options: buildOptionsState(product, enabled)
      };
    });

    return normalized;
  }

  return buildEmptyState();
}

function getProductState(productId) {
  const key = String(productId);

  if (!adminMenuState[key]) {
    const product = produtos.find((p) => String(p.id) === key);

    adminMenuState[key] = {
      enabled: false,
      options: product ? buildOptionsState(product, false) : {}
    };
  }

  if (!adminMenuState[key].options) {
    const product = produtos.find((p) => String(p.id) === key);
    adminMenuState[key].options = product ? buildOptionsState(product, false) : {};
  }

  return adminMenuState[key];
}

function getEnabledItems(productId, grupo) {
  const product = produtos.find((p) => String(p.id) === String(productId));
  if (!product) return [];

  const index = product.opcoes.findIndex((item) => item.titulo === grupo.titulo);
  const optionKey = getOptionKey(index, grupo);

  const productState = getProductState(productId);
  const optionState = productState.options?.[optionKey];

  if (!optionState?.enabledItems) return [];
  return optionState.enabledItems;
}

function getOptionKey(index, grupo) {
  const safeTitle = String(grupo.titulo || `opcao_${index}`)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return `grupo_${index}_${safeTitle}`;
}

function getOptionRuleLabel(grupo) {
  if (grupo.tipo === "checkbox") {
    const min = Number(grupo.min || 0);
    const max = Number(grupo.max || 0);

    if (min > 0 && max > 0) {
      if (min === max) {
        return `Escolha ${min}`;
      }
      return `Mín. ${min} • Máx. ${max}`;
    }

    if (max > 0) {
      return `Até ${max}`;
    }

    return "Múltipla escolha";
  }

  return grupo.obrigatorio ? "Escolha 1" : "Opcional";
}

function formatDateBR(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

function escapeAttr(value = "") {
  return String(value).replaceAll('"', "&quot;");
}

document.querySelectorAll(".accordion-header").forEach((header) => {
  header.addEventListener("click", () => {
    const section = header.closest(".accordion");
    section.classList.toggle("open");
  });
});


const adminSearch = document.getElementById("adminSearch");

adminSearch.addEventListener("input", () => {
  const term = adminSearch.value.toLowerCase();

  const accordions = document.querySelectorAll(".accordion");

  let foundSomething = false;

  document.querySelectorAll(".admin-product-card").forEach((card) => {

    const name = card
      .querySelector(".admin-product-name")
      .textContent
      .toLowerCase();

    const accordion = card.closest(".accordion");

    if (name.includes(term)) {

      card.style.display = "";
      accordion.classList.add("open");

      foundSomething = true;

    } else {

      if (term === "") {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }

    }

  });

  if (term === "") {
    accordions.forEach(a => a.classList.remove("open"));
  }

});


async function loadSavedMenus() {

  const list = document.getElementById("savedMenusList");

  try {

    const snapshot = await getDocs(collection(db, "cardapios"));

    if (snapshot.empty) {

      list.innerHTML = `
        <div class="saved-menu-item">
          Nenhum cardápio foi preparado ainda.
        </div>
      `;

      return;

    }

    const menus = snapshot.docs.map(doc => doc.data());

    menus.sort((a, b) => b.date.localeCompare(a.date));

    list.innerHTML = menus.map(menu => {

      const dataCardapio = formatDateBR(menu.date);

      const atualizado = menu.updatedAt?.toDate
        ? formatDateBR(menu.updatedAt.toDate().toISOString().split("T")[0])
        : "";

      return `
        <div class="saved-menu-item">

          Cardápio do dia <strong>${dataCardapio}</strong>
          ${atualizado ? `foi preparado em ${atualizado}` : ""}

        </div>
      `;

    }).join("");

  } catch (error) {

    console.error(error);

  }

}

loadSavedMenus();

