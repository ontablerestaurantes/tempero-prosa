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

import { produtos, formatCurrency, getTodayISO } from "./products.js?v=2509-menu3";

const adminDate = document.getElementById("adminDate");
const loadDateBtn = document.getElementById("loadDateBtn");
const copyPreviousBtn = document.getElementById("copyPreviousBtn");
const markAllBtn = document.getElementById("markAllBtn");
const unmarkAllBtn = document.getElementById("unmarkAllBtn");
const saveMenuBtn = document.getElementById("saveMenuBtn");
const logoutBtn = document.getElementById("logoutBtn");

const adminCafeList = document.getElementById("adminCafeList");
const adminPratosIndividuaisList = document.getElementById("adminPratosIndividuaisList");
const adminBaianaList = document.getElementById("adminBaianaList");
const adminFeijoadaList = document.getElementById("adminFeijoadaList");
const adminMocotoList = document.getElementById("adminMocotoList");
const adminSarapatelList = document.getElementById("adminSarapatelList");
const adminChurrascoList = document.getElementById("adminChurrascoList");
const adminPetiscoList = document.getElementById("adminPetiscoList");
const adminPorcaoGuarnicaoList = document.getElementById("adminPorcaoGuarnicaoList");
const adminPorcaoProteinaList = document.getElementById("adminPorcaoProteinaList");
const adminBebidaList = document.getElementById("adminBebidaList");
const adminEmbalagemList = document.getElementById("adminEmbalagemList");
const adminCervejaLongNeckList = document.getElementById("adminCervejaLongNeckList");
const adminCerveja600List = document.getElementById("adminCerveja600List");
const adminDoseList = document.getElementById("adminDoseList");
const adminSobremesaList = document.getElementById("adminSobremesaList");
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
      catalogoFormato: 3,
      catalogoSnapshot: criarCatalogoSnapshot(),
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

function criarCatalogoSnapshot() {
  // products.js continua sendo a fonte de edição do catálogo.
  // O snapshot guarda apenas o que o backend precisa para validar
  // produto, preço e opções. Imagem/descrição continuam só no frontend.
  return produtos.map((produto) => ({
    id: Number(produto.id),
    nome: String(produto.nome || "").trim(),
    categoria: String(produto.categoria || "").trim(),
    preco: Number(produto.preco || 0),
    ...(produto.ativo === false ? { ativo: false } : {}),
    opcoes: Array.isArray(produto.opcoes)
      ? produto.opcoes.map((grupo) => ({
          titulo: String(grupo.titulo || "").trim(),
          tipo: String(grupo.tipo || "radio").trim().toLowerCase(),
          obrigatorio: grupo.obrigatorio === true,
          ...(grupo.min != null ? { min: Number(grupo.min) } : {}),
          ...(grupo.max != null ? { max: Number(grupo.max) } : {}),
          itens: Array.isArray(grupo.itens)
            ? grupo.itens.map((item) => ({
                nome: String(item.nome || "").trim(),
                ...(item.precoVariacao != null
                  ? { precoVariacao: Number(item.precoVariacao) }
                  : {}),
                ...(item.precoAdicional != null
                  ? { precoAdicional: Number(item.precoAdicional) }
                  : {})
              }))
            : []
        }))
      : []
  }));
}


function produtoTemVariacaoDePreco(produto) {
  return (produto.opcoes || []).some((grupo) =>
    (grupo.itens || []).some((item) => item.precoVariacao != null)
  );
}

function renderAdminLists() {
  renderAdminCategory("cafe", adminCafeList);
  renderAdminCategory("pratos_individuais", adminPratosIndividuaisList);
  renderAdminCategory("baiana", adminBaianaList);
  renderAdminCategory("feijoada", adminFeijoadaList);
  renderAdminCategory("mocoto", adminMocotoList);
  renderAdminCategory("sarapatel", adminSarapatelList);
  renderAdminCategory("churrasco", adminChurrascoList);
  renderAdminCategory("petisco", adminPetiscoList);
  renderAdminCategory("porcao_guarnicao", adminPorcaoGuarnicaoList);
  renderAdminCategory("porcao_proteina", adminPorcaoProteinaList);
  renderAdminCategory("bebida", adminBebidaList);
  renderAdminCategory("embalagem", adminEmbalagemList);
  renderAdminCategory("cerveja_long_neck", adminCervejaLongNeckList);
  renderAdminCategory("cerveja_600", adminCerveja600List);
  renderAdminCategory("dose", adminDoseList);
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
          <img src="${product.imagem}" alt="${product.nome}" onerror="this.onerror=null;this.src='assets/img/sem-nada.jpg';">
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


function getLegacyGroupedOptionItems(product, data) {
  if (Number(data?.catalogoFormato || 0) >= 3) {
    return null;
  }

  const isEnabled = (id) => {
    if (Array.isArray(data?.visibleProducts)) {
      return data.visibleProducts.includes(id);
    }

    const state = data?.products?.[String(id)] || data?.products?.[id];
    return Boolean(state?.enabled);
  };

  if (Number(product.id) === 40) {
    return [
      [41, "Moqueca de Peixe"],
      [40, "Moqueca de Marisco"],
      [43, "Peixe Frito"],
      [42, "Xinxim de Frango"]
    ]
      .filter(([id]) => isEnabled(id))
      .map(([, nome]) => nome);
  }

  if (Number(product.id) === 109) {
    return [
      [109, "Café preto mini — 50 ml"],
      [118, "Café preto médio — 200 ml"],
      [119, "Café com leite médio — 200 ml"]
    ]
      .filter(([id]) => isEnabled(id))
      .map(([, nome]) => nome);
  }

  return null;
}

function normalizeMenuData(data) {
  if (data?.products && typeof data.products === "object") {
    const normalized = buildEmptyState();

    const legacyChurrascoState = data.products["54"] || data.products[54];
    const legacyChurrascoEnabled = Boolean(legacyChurrascoState?.enabled);

    produtos.forEach((product) => {
      const productId = String(product.id);
      const savedState = data.products[productId] || data.products[product.id] || {};
      const normalizedProduct = normalized[productId];
      const legacyGroupedItems = getLegacyGroupedOptionItems(product, data);

      normalizedProduct.enabled =
        legacyGroupedItems !== null
          ? legacyGroupedItems.length > 0
          : Boolean(savedState.enabled);

      if (
        legacyChurrascoEnabled &&
        [55, 56].includes(Number(product.id)) &&
        !data.products[productId] &&
        !data.products[product.id]
      ) {
        normalizedProduct.enabled = true;
      }

      (product.opcoes || []).forEach((grupo, index) => {
        const key = getOptionKey(index, grupo);
        const savedOption =
          savedState.options?.[key] ||
          savedState.options?.[String(index)] ||
          savedState.options?.[grupo.titulo];

        const allowedNames = grupo.itens.map((item) => item.nome);
        const enabledItems = Array.isArray(savedOption?.enabledItems)
          ? migrarEnabledItemsLegados(
              product,
              grupo,
              savedOption.enabledItems,
              data.catalogoFormato
            ).filter((name) => allowedNames.includes(name))
          : legacyGroupedItems !== null
            ? legacyGroupedItems.filter((name) => allowedNames.includes(name))
            : (normalizedProduct.enabled ? allowedNames : []);

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

    const legacyChurrascoEnabled = data.visibleProducts.includes(54);

    produtos.forEach((product) => {
      const productId = String(product.id);
      const legacyGroupedItems = getLegacyGroupedOptionItems(product, data);
      const enabled =
        legacyGroupedItems !== null
          ? legacyGroupedItems.length > 0
          : (
              data.visibleProducts.includes(product.id) ||
              (legacyChurrascoEnabled && [55, 56].includes(Number(product.id)))
            );

      const options = buildOptionsState(product, enabled);

      if (legacyGroupedItems !== null) {
        (product.opcoes || []).forEach((grupo, index) => {
          const key = getOptionKey(index, grupo);
          const allowedNames = grupo.itens.map((item) => item.nome);
          options[key].enabledItems = legacyGroupedItems.filter((name) =>
            allowedNames.includes(name)
          );
        });
      }

      normalized[productId] = {
        enabled,
        options
      };
    });

    return normalized;
  }

  return buildEmptyState();
}

function migrarEnabledItemsLegados(product, grupo, enabledItems, catalogoFormato) {
  const itens = Array.isArray(enabledItems) ? [...enabledItems] : [];

  const aliases = {
    "Salada de tomate, cebola e pepino": "Salada mista",
    "500 ml": "200 ml",
    "200 ml (pequeno)": "200 ml",
    "Carne seca": "Carne de sertão frita",
    "Carne seca frita": "Carne de sertão frita",
    "Coca-Cola": "Coca-Cola Zero"
  };

  const migrados = itens.map((nome) => aliases[nome] || nome);

  if (Number(catalogoFormato || 0) >= 2) {
    return [...new Set(migrados)];
  }

  if (
    [100, 101].includes(Number(product.id)) &&
    grupo.titulo === "Sabor" &&
    migrados.length > 0 &&
    !migrados.includes("Graviola")
  ) {
    migrados.push("Graviola");
  }

  return [...new Set(migrados)];
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

