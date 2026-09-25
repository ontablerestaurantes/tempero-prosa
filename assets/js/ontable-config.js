// Integração do cardápio interno com o backend OnTable.
//
// PRODUÇÃO: este pacote aponta SEMPRE para o backend oficial.
// Isso evita que abrir o cardápio pelo Live Server (127.0.0.1/localhost)
// faça o navegador tentar acessar um backend local inexistente.

export const ONTABLE_API_BASE_URL = "https://app.ontablesaas.online";
