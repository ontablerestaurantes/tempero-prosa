import { firebaseProjectId } from "./firebase-config.js";
import { ONTABLE_API_BASE_URL } from "./ontable-config.js";

const SESSION_KEY = `ontable:operador-cardapio:${firebaseProjectId}`;
const MODAL_ID = "operatorPinModal";
const BAR_ID = "operatorSessionBar";

let loginPromise = null;
let loginResolve = null;

function apiAtiva() {
  return Boolean(String(ONTABLE_API_BASE_URL || "").trim());
}

function apiUrl(path) {
  const base = String(ONTABLE_API_BASE_URL || "").trim().replace(/\/+$/, "");
  if (!base) {
    throw new Error("A API do OnTable ainda não foi configurada neste cardápio.");
  }
  return `${base}${path}`;
}

function lerSessao() {
  if (!apiAtiva()) return null;
  try {
    const bruto = sessionStorage.getItem(SESSION_KEY);
    if (!bruto) return null;
    const dados = JSON.parse(bruto);
    if (!dados || typeof dados !== "object") return null;
    if (!dados.id || !dados.nome || !dados.token) return null;
    if (Number(dados.expiraEm || 0) <= Date.now()) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return dados;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

function salvarSessao(operador) {
  const duracaoMs = Math.max(60, Number(operador?.expiraEmSegundos || 0)) * 1000;
  const sessao = {
    id: String(operador?.id || "").trim(),
    nome: String(operador?.nome || "").trim(),
    perfil: String(operador?.perfil || "").trim(),
    token: String(operador?.token || "").trim(),
    expiraEm: Date.now() + duracaoMs
  };
  if (!sessao.id || !sessao.nome || !sessao.token) {
    throw new Error("O OnTable retornou uma identificação de atendente inválida.");
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessao));
  return sessao;
}

export function limparOperadorCardapio() {
  sessionStorage.removeItem(SESSION_KEY);
  renderizarBarra();
}

export function obterOperadorAtual() {
  return lerSessao();
}

export function operadorParaPedido() {
  const operador = lerSessao();
  if (!operador) return null;
  return {
    id: operador.id,
    nome: operador.nome,
    perfil: operador.perfil,
    token: operador.token
  };
}

function montarInterface() {
  if (!apiAtiva()) return;

  if (!document.getElementById(BAR_ID)) {
    const barra = document.createElement("div");
    barra.id = BAR_ID;
    barra.className = "operator-session-bar";
    barra.setAttribute("aria-live", "polite");
    const topbar = document.querySelector(".topbar");
    if (topbar?.parentNode) {
      topbar.insertAdjacentElement("afterend", barra);
    } else {
      document.body.prepend(barra);
    }
  }

  if (!document.getElementById(MODAL_ID)) {
    const modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.className = "operator-pin-modal";
    modal.hidden = true;
    modal.innerHTML = `
      <div class="operator-pin-modal__backdrop" aria-hidden="true"></div>
      <section class="operator-pin-modal__card" role="dialog" aria-modal="true" aria-labelledby="operatorPinTitle">
        <span class="operator-pin-modal__eyebrow">CARDÁPIO INTERNO</span>
        <h2 id="operatorPinTitle">Identificar atendente</h2>
        <p>Digite o seu PIN para registrar quem está lançando os pedidos neste aparelho.</p>
        <form id="operatorPinForm" novalidate>
          <label class="operator-pin-modal__field">
            <span>PIN</span>
            <input id="operatorPinInput" type="password" inputmode="numeric" autocomplete="off" maxlength="6" pattern="[0-9]{4,6}" placeholder="••••" required />
          </label>
          <div id="operatorPinError" class="operator-pin-modal__error" hidden></div>
          <button id="operatorPinSubmit" class="operator-pin-modal__submit" type="submit">ENTRAR</button>
        </form>
      </section>
    `;
    document.body.appendChild(modal);

    modal.querySelector("#operatorPinInput")?.addEventListener("input", (event) => {
      event.target.value = String(event.target.value || "").replace(/\D/g, "").slice(0, 6);
    });

    modal.querySelector("#operatorPinForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = modal.querySelector("#operatorPinInput");
      const erro = modal.querySelector("#operatorPinError");
      const botao = modal.querySelector("#operatorPinSubmit");
      const pin = String(input?.value || "").trim();

      erro.hidden = true;
      erro.textContent = "";

      if (!/^\d{4,6}$/.test(pin)) {
        erro.hidden = false;
        erro.textContent = "Informe um PIN de 4 a 6 números.";
        input?.focus();
        return;
      }

      botao.disabled = true;
      botao.textContent = "IDENTIFICANDO...";

      try {
        const response = await fetch(apiUrl("/api/cardapio/operador/identificar"), {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ firebaseProjectId, pin })
        });
        const resultado = await response.json().catch(() => ({}));
        if (!response.ok || resultado?.ok !== true || !resultado?.operador) {
          throw new Error(resultado?.erro || "PIN inválido.");
        }

        const sessao = salvarSessao(resultado.operador);
        if (input) input.value = "";
        modal.hidden = true;
        document.body.classList.remove("operator-pin-open");
        renderizarBarra();

        const resolver = loginResolve;
        loginPromise = null;
        loginResolve = null;
        resolver?.(sessao);
      } catch (error) {
        erro.hidden = false;
        if (error instanceof TypeError) {
          erro.textContent = "Não foi possível conectar ao OnTable. Verifique se o backend está ligado e se a URL da API está correta.";
        } else {
          erro.textContent = error instanceof Error ? error.message : "Não foi possível identificar o atendente.";
        }
      } finally {
        botao.disabled = false;
        botao.textContent = "ENTRAR";
      }
    });
  }
}

function renderizarBarra() {
  if (!apiAtiva()) return;
  montarInterface();
  const barra = document.getElementById(BAR_ID);
  if (!barra) return;
  const operador = lerSessao();

  if (!operador) {
    barra.innerHTML = `<span><strong>Atendente não identificado</strong></span><button type="button" data-operator-login>Entrar com PIN</button>`;
    barra.querySelector("[data-operator-login]")?.addEventListener("click", () => abrirIdentificacao());
    return;
  }

  barra.innerHTML = `
    <span>Atendente: <strong>${escapeHtml(operador.nome)}</strong></span>
    <div class="operator-session-bar__actions">
      <button type="button" data-operator-switch>Trocar</button>
      <button type="button" data-operator-logout>Sair</button>
    </div>
  `;
  barra.querySelector("[data-operator-switch]")?.addEventListener("click", async () => {
    limparOperadorCardapio();
    await abrirIdentificacao();
  });
  barra.querySelector("[data-operator-logout]")?.addEventListener("click", () => {
    limparOperadorCardapio();
    abrirIdentificacao();
  });
}

function abrirIdentificacao() {
  if (!apiAtiva()) return Promise.resolve(null);
  montarInterface();
  const existente = lerSessao();
  if (existente) return Promise.resolve(existente);
  if (loginPromise) return loginPromise;

  const modal = document.getElementById(MODAL_ID);
  if (!modal) return Promise.resolve(null);
  modal.hidden = false;
  document.body.classList.add("operator-pin-open");
  setTimeout(() => modal.querySelector("#operatorPinInput")?.focus(), 0);

  loginPromise = new Promise((resolve) => {
    loginResolve = resolve;
  });
  return loginPromise;
}

export async function iniciarOperadorCardapio() {
  if (!apiAtiva()) return null;
  montarInterface();
  renderizarBarra();
  return lerSessao() || abrirIdentificacao();
}

export async function garantirOperadorCardapio() {
  if (!apiAtiva()) return null;
  return lerSessao() || abrirIdentificacao();
}

export async function consultarContextoMesa(mesaNumero) {
  if (!apiAtiva()) return null;
  const operador = await garantirOperadorCardapio();
  if (!operador) return null;

  const response = await fetch(apiUrl("/api/cardapio/mesa/contexto"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      firebaseProjectId,
      mesaNumero: Number(mesaNumero),
      operadorToken: operador.token
    })
  });
  const resultado = await response.json().catch(() => ({}));

  if (response.status === 401) {
    limparOperadorCardapio();
  }
  if (!response.ok || resultado?.ok !== true || !resultado?.mesa) {
    throw new Error(resultado?.erro || "Não foi possível consultar a comanda no OnTable.");
  }
  return resultado.mesa;
}

function escapeHtml(text = "") {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
