import {
  db,
  doc,
  getDoc
} from "./firebase-config.js";

import { produtos, getTodayISO } from "./products.js";

const productDetail = document.getElementById("productDetail");

const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));
const today = getTodayISO();

let produtoOriginal = produtos.find((p) => p.id === productId);

if (!produtoOriginal) {
  document.title = "OnTable Saas - Produto não encontrado";
  renderNotFound();
} else {
  init();
}

async function init() {
  try {
    const menuConfig = await getMenuConfig(today);
    const produtoFiltrado = applyAdminConfigToProduct(produtoOriginal, menuConfig);

    if (!produtoFiltrado) {
      document.title = `OnTable Saas - ${produtoOriginal.nome}`;
      renderUnavailable();
      return;
    }

    renderProduto(produtoFiltrado);
  } catch (error) {
    console.error(error);
    renderProduto(produtoOriginal);
  }
}

async function getMenuConfig(date) {
  const ref = doc(db, "cardapios", date);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  return snap.data();
}

function applyAdminConfigToProduct(produto, menuConfig) {
  if (!menuConfig?.products) {
    return produto;
  }

  const productState =
    menuConfig.products[String(produto.id)] ||
    menuConfig.products[produto.id];

  if (!productState) {
    return produto;
  }

  if (!productState.enabled) {
    return null;
  }

  const produtoClonado = {
    ...produto,
    opcoes: (produto.opcoes || []).map((grupo, index) => {
      const optionKey = getOptionKey(index, grupo);

      const savedOption =
        productState.options?.[optionKey] ||
        productState.options?.[String(index)] ||
        productState.options?.[grupo.titulo];

      if (!savedOption || !Array.isArray(savedOption.enabledItems)) {
        return grupo;
      }

      const itensFiltrados = (grupo.itens || []).filter((item) =>
        savedOption.enabledItems.includes(item.nome)
      );

      return {
        ...grupo,
        itens: itensFiltrados
      };
    }).filter((grupo) => (grupo.itens || []).length > 0)
  };

  return produtoClonado;
}

function renderNotFound() {
  productDetail.innerHTML = `
    <div class="product-shell">
      <div class="product-extra-box">
        <h3>Prato não encontrado.</h3>
      </div>
    </div>
  `;
}

function renderUnavailable() {
  productDetail.innerHTML = `
    <div class="product-shell">
      <div class="product-extra-box">
        <h3>Esse Prato não está disponível hoje.</h3>
        <p>Volte aos itens e escolha outro produto disponível.</p>
      </div>
    </div>
  `;
}

function renderProduto(produto) {
  document.title = `OnTable Saas - ${produto.nome}`;

  productDetail.innerHTML = `
    <div class="product-shell">
      <section class="product-hero">
        <img src="${produto.imagem}" alt="${produto.nome}">
        <div class="product-hero__content">
          <h1 class="product-hero__title">${produto.nome}</h1>
          <p class="product-hero__desc">${produto.descricao || ""}</p>
          <p class="product-hero__price">${produtoTemVariacaoDePreco(produto) ? `A partir de ${formatCurrency(produto.preco)}` : formatCurrency(produto.preco)}</p>
        </div>
      </section>

      <form id="pedidoForm" novalidate>
        <section class="product-options">
          ${renderOpcoes(produto)}
        </section>

        <section class="product-extra-box">
          <h3>Observação do item</h3>
          <div class="product-observation">
            <textarea name="observacao" placeholder="Ex.: sem cebola, bem passado, pouco sal"></textarea>
          </div>
        </section>

        <section class="product-extra-box">
          <h3>Quantidade</h3>
          <div class="product-qty-row">
            <div class="product-qty-box">
              <button type="button" id="minusQty">-</button>
              <span id="qtyValue">1</span>
              <button type="button" id="plusQty">+</button>
            </div>
          </div>
        </section>

        <div class="product-submit-bar">
          <button type="submit" class="product-submit-btn">Adicionar ao pedido</button>
        </div>
      </form>
    </div>
  `;

  initOptionAccordions();

  let quantidade = 1;
  const qtyValue = document.getElementById("qtyValue");

  document.getElementById("minusQty").addEventListener("click", () => {
    if (quantidade > 1) {
      quantidade--;
      qtyValue.textContent = quantidade;
    }
  });

  document.getElementById("plusQty").addEventListener("click", () => {
    quantidade++;
    qtyValue.textContent = quantidade;
  });

  document.getElementById("pedidoForm").addEventListener("submit", (e) => {
    e.preventDefault();

    clearProductErrors();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const opcoesEscolhidas = {};

    let firstInvalidGroup = null;
    let isValid = true;

    (produto.opcoes || []).forEach((grupo, index) => {
      const groupEl = document.querySelector(`[data-group-index="${index}"]`);
      const fieldName = `grupo_${index}`;

      if (grupo.tipo === "checkbox") {
        const selectedValues = formData.getAll(fieldName);
        const min = Number(grupo.min || 0);
        const max = Number(grupo.max || grupo.itens?.length || 999);

        if (min > 0 && selectedValues.length < min) {
          isValid = false;
          markGroupInvalid(
            groupEl,
            `Selecione no mínimo ${min} ${min === 1 ? "opção" : "opções"}.`
          );
          if (!firstInvalidGroup) firstInvalidGroup = groupEl;
        } else if (selectedValues.length > max) {
          isValid = false;
          markGroupInvalid(
            groupEl,
            `Selecione no máximo ${max} ${max === 1 ? "opção" : "opções"}.`
          );
          if (!firstInvalidGroup) firstInvalidGroup = groupEl;
        }

        if (selectedValues.length) {
          opcoesEscolhidas[grupo.titulo] = selectedValues;
        }
      } else {
        const selectedValue = formData.get(fieldName);

        if (grupo.obrigatorio && !selectedValue) {
          isValid = false;
          markGroupInvalid(groupEl, "Selecione uma opção para continuar.");
          if (!firstInvalidGroup) firstInvalidGroup = groupEl;
        }

        if (selectedValue) {
          opcoesEscolhidas[grupo.titulo] = selectedValue;
        }
      }
    });

    if (!isValid) {
      firstInvalidGroup?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      return;
    }

    const precoUnitario = calcularPrecoUnitario(produto, opcoesEscolhidas);

    const item = {
      id: produto.id,
      nome: produto.nome,
      categoria: produto.categoria,
      imagem: produto.imagem,
      precoUnitario,
      quantidade,
      observacao: formData.get("observacao") || "",
      opcoesEscolhidas
    };

    if (produto.categoria === "bebida") {
      item.destinos = Array.from({ length: quantidade }, () => "");
      item.destino = "";
    }

    const carrinho = JSON.parse(localStorage.getItem("carrinhoCardapio") || "[]");

    const existingIndex = carrinho.findIndex((cartItem) => isSameCartItem(cartItem, item));

    if (existingIndex >= 0) {
      carrinho[existingIndex].quantidade =
        Number(carrinho[existingIndex].quantidade || 1) + Number(item.quantidade || 1);

      if (item.categoria === "bebida") {
        const destinosExistentes = Array.isArray(carrinho[existingIndex].destinos)
          ? carrinho[existingIndex].destinos
          : [];

        const quantidadeNova = Number(item.quantidade || 1);
        const novosDestinos = Array.from({ length: quantidadeNova }, () => "");

        carrinho[existingIndex].destinos = [...destinosExistentes, ...novosDestinos];
        carrinho[existingIndex].destino = carrinho[existingIndex].destinos[0] || "";
      }
    } else {
      carrinho.push(item);
    }

    localStorage.setItem("carrinhoCardapio", JSON.stringify(carrinho));

    window.location.href = "index.html";
  });

  initCheckboxLimits(produto);
}

function clearProductErrors() {
  document.querySelectorAll(".option-group__error").forEach((el) => el.remove());
  document.querySelectorAll(".option-group.is-invalid").forEach((el) => {
    el.classList.remove("is-invalid");
  });
}

function markGroupInvalid(groupEl, message) {
  if (!groupEl) return;

  groupEl.classList.add("is-invalid");
  groupEl.classList.remove("closed");

  const error = document.createElement("p");
  error.className = "option-group__error";
  error.textContent = message;
  groupEl.appendChild(error);
}

function renderOpcoes(produto) {
  if (!produto.opcoes?.length) return "";

  return produto.opcoes.map((grupo, index) => `
    <section class="option-group ${index === 0 ? "" : "closed"}" data-group-index="${index}">
      <div class="option-group__head option-toggle" role="button" tabindex="0">
        <div class="option-group__head-text">
          <h3 class="option-group__title">
            ${grupo.titulo}
            <span class="option-group__info">${getGroupSubtitle(grupo)}</span>
          </h3>
          <p class="option-group__note">Fotos meramente ilustrativas</p>
        </div>

        <span class="option-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6 9L12 15L18 9" />
          </svg>
        </span>
      </div>

      <div class="option-list">
        ${grupo.tipo === "checkbox"
      ? renderCheckboxGroup(`grupo_${index}`, grupo.itens, produto.imagem)
      : renderRadioGroup(`grupo_${index}`, grupo.itens, produto.imagem)
    }
      </div>
    </section>
  `).join("");
}

function getGroupSubtitle(grupo) {
  if (grupo.tipo === "checkbox") {
    const min = Number(grupo.min || 0);
    const max = Number(grupo.max || grupo.itens?.length || 0);

    if (min > 0 && max > 0) {
      if (min === max) {
        return `Escolha ${min} ${min === 1 ? "opção" : "opções"}`;
      }
      return `Escolha de ${min} até ${max} opções`;
    }

    if (max > 0) {
      return `Escolha até ${max} opções`;
    }

    return "Escolha uma ou mais opções";
  }

  return grupo.subtitulo || "Escolha 1 opção";
}

function renderRadioGroup(name, itens, fallbackImagem) {
  return itens.map((item) => `
    <label class="option-item">
      <div class="option-item__thumb">
        <img src="${item.imagem || fallbackImagem}" alt="${item.nome}">
      </div>

      <div class="option-item__info">
        <p class="option-item__name">${item.nome}</p>
        ${item.precoVariacao != null ? `<p class="option-item__meta">${formatCurrency(item.precoVariacao)}</p>` : item.precoAdicional ? `<p class="option-item__meta">+ ${formatCurrency(item.precoAdicional)}</p>` : ""}
        ${item.descricao ? `<p class="option-item__meta">${item.descricao}</p>` : ""}
      </div>

      <div class="option-item__check-wrap">
        <input
          type="radio"
          name="${name}"
          value="${item.nome}"
        >
        <span class="option-item__check"></span>
      </div>
    </label>
  `).join("");
}

function renderCheckboxGroup(name, itens, fallbackImagem) {
  return itens.map((item) => `
    <label class="option-item">
      <div class="option-item__thumb">
        <img src="${item.imagem || fallbackImagem}" alt="${item.nome}">
      </div>

      <div class="option-item__info">
        <p class="option-item__name">${item.nome}</p>
        ${item.precoVariacao != null ? `<p class="option-item__meta">${formatCurrency(item.precoVariacao)}</p>` : item.precoAdicional ? `<p class="option-item__meta">+ ${formatCurrency(item.precoAdicional)}</p>` : ""}
        ${item.descricao ? `<p class="option-item__meta">${item.descricao}</p>` : ""}
      </div>

      <div class="option-item__check-wrap">
        <input
          type="checkbox"
          name="${name}"
          value="${item.nome}"
        >
        <span class="option-item__check"></span>
      </div>
    </label>
  `).join("");
}

function initOptionAccordions() {
  document.querySelectorAll(".option-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const group = toggle.closest(".option-group");
      if (!group) return;
      group.classList.toggle("closed");
    });

    toggle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const group = toggle.closest(".option-group");
        if (!group) return;
        group.classList.toggle("closed");
      }
    });
  });
}

function initCheckboxLimits(produto) {
  (produto.opcoes || []).forEach((grupo, index) => {
    if (grupo.tipo !== "checkbox") return;

    const fieldName = `grupo_${index}`;
    const checkboxes = Array.from(document.querySelectorAll(`input[name="${fieldName}"]`));
    const max = Number(grupo.max || checkboxes.length);

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const checked = checkboxes.filter((item) => item.checked);

        if (checked.length > max) {
          checkbox.checked = false;
          alert(`Você pode escolher no máximo ${max} ${max === 1 ? "opção" : "opções"}.`);
        }
      });
    });
  });
}

function calcularPrecoUnitario(produto, opcoesEscolhidas = {}) {
  let precoBase = Number(produto.preco || 0);
  let valorAdicionais = 0;

  (produto.opcoes || []).forEach((grupo) => {
    const escolhido = opcoesEscolhidas[grupo.titulo];
    if (!escolhido) return;

    const selecionados = Array.isArray(escolhido) ? escolhido : [escolhido];

    selecionados.forEach((nomeSelecionado) => {
      const item = (grupo.itens || []).find((opcao) => opcao.nome === nomeSelecionado);
      if (!item) return;

      // precoVariacao representa o valor integral daquela variação (ex.: 300 ml / 500 ml).
      // Não é adicional e, por isso, substitui o preço-base do produto.
      if (item.precoVariacao != null) {
        precoBase = Number(item.precoVariacao);
      }

      // precoAdicional continua reservado apenas para extras reais, como purê e ovos no PF.
      valorAdicionais += Number(item.precoAdicional || 0);
    });
  });

  return precoBase + valorAdicionais;
}

function produtoTemVariacaoDePreco(produto) {
  return (produto.opcoes || []).some((grupo) =>
    (grupo.itens || []).some((item) => item.precoVariacao != null)
  );
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

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function isSameCartItem(a, b) {
  return (
    String(a.id) === String(b.id) &&
    normalizeText(a.observacao) === normalizeText(b.observacao) &&
    areOptionsEqual(a.opcoesEscolhidas, b.opcoesEscolhidas)
  );
}

function areOptionsEqual(optionsA = {}, optionsB = {}) {
  const normalizeOptions = (obj) => {
    const normalized = {};

    Object.keys(obj || {})
      .sort()
      .forEach((key) => {
        const value = obj[key];

        if (Array.isArray(value)) {
          normalized[key] = [...value].map(String).sort();
        } else {
          normalized[key] = String(value);
        }
      });

    return JSON.stringify(normalized);
  };

  return normalizeOptions(optionsA) === normalizeOptions(optionsB);
}

function normalizeText(value = "") {
  return String(value).trim().replace(/\s+/g, " ");
}