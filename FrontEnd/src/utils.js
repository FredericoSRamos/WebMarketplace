/**
 * Função cliente HTTP genérica para realizar requisições ao servidor.
 * Essa função abstrai a utilização da API `fetch` do navegador, permitindo
 * a realização de operações HTTP (`GET`, `POST`, `PUT`, `DELETE`) de maneira
 * simples e consistente. Ela cuida da configuração da requisição, tratamento
 * de erros e serialização/deserialização de dados.
 *
 * @async
 * @function client
 * @param {string} endpoint - O URL completo ou relativo para o recurso do servidor que será acessado.
 * @param {Object} [options] - Um objeto contendo configurações adicionais para a requisição.
 * @param {Object} [options.body] - Um objeto contendo os dados que serão enviados no corpo da requisição.
 * Pode ser qualquer estrutura serializável em JSON, como um objeto ou array.
 * @param {string} [options.body.key] - Um exemplo de chave que pode estar presente no corpo do objeto enviado.
 * @param {Object} [options.customConfig] - Configurações adicionais específicas da requisição, como cabeçalhos personalizados,
 * método HTTP, ou outros parâmetros aceitos pela API `fetch`.
 * @param {Object} [options.customConfig.headers] - Cabeçalhos adicionais que serão enviados com a requisição.
 * Estes sobrescrevem os valores padrão configurados pela função.
 *
 * @returns {Promise<Object>} - Uma `Promise` que resolve para o corpo da resposta da requisição, convertido em JSON.
 * Se a resposta for bem-sucedida (status HTTP 2xx), o JSON da resposta será retornado.
 * Caso contrário, a `Promise` será rejeitada com um erro.
 *
 * @throws {Error} - Lança um erro se a resposta não for bem-sucedida ou se houver problemas de rede.
 * O erro contém uma mensagem indicando o problema ou a descrição do status HTTP.
 *
 * @example
 * // Fazendo uma requisição GET
 * client('https://api.exemplo.com/recurso')
 *   .then(data => console.log(data))
 *   .catch(err => console.error(err));
 *
 * @example
 * // Fazendo uma requisição POST com dados no corpo
 * client('https://api.exemplo.com/recurso', {
 *   body: { nome: 'João', idade: 30 },
 *   customConfig: { method: 'POST' }
 * })
 *   .then(data => console.log(data))
 *   .catch(err => console.error(err));
 */
async function client(endpoint, { body, ...customConfig } = {}) {
  const headers = { 'Content-Type': 'application/json' }; // Cabeçalhos padrão para JSON.

  const config = {
    method: body ? 'POST' : 'GET', // Define o método padrão (POST se body estiver presente, caso contrário GET).
    ...customConfig,              // Mescla configurações adicionais passadas pelo usuário.
    headers: {
      ...headers,                 // Mescla os cabeçalhos padrão com cabeçalhos personalizados.
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body); // Serializa o corpo da requisição para JSON, se presente.
  }

  try {
    const response = await window.fetch(endpoint, config); // Realiza a requisição HTTP.
    const data = await response.json();                   // Converte a resposta para JSON.
    if (response.ok) {
      return data; // Retorna os dados se a resposta for bem-sucedida.
    }
    throw new Error(response.statusText); // Lança um erro com o status HTTP caso a resposta não seja bem-sucedida.
  } catch (err) {
    return Promise.reject(err.message ? err.message : 'Erro desconhecido'); // Rejeita a Promise com a mensagem do erro.
  }
}

/**
 * Realiza uma requisição HTTP GET para obter dados de um recurso do servidor.
 * Essa função utiliza `client` para simplificar chamadas GET.
 *
 * @async
 * @function httpGet
 * @param {string} endpoint - O URL completo ou relativo do recurso a ser acessado.
 * @param {Object} [customConfig] - Configurações adicionais para a requisição, como cabeçalhos personalizados.
 * @returns {Promise<Object>} - Uma `Promise` que resolve para os dados retornados pelo servidor.
 *
 * @example
 * httpGet('https://api.exemplo.com/recurso')
 *   .then(data => console.log(data))
 *   .catch(err => console.error(err));
 */
export const httpGet = async function (endpoint, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: 'GET' });
};

/**
 * Realiza uma requisição HTTP POST para enviar dados ao servidor.
 * Essa função é ideal para criar novos recursos ou enviar informações.
 *
 * @async
 * @function httpPost
 * @param {string} endpoint - O URL completo ou relativo do recurso a ser acessado.
 * @param {Object} body - Dados que serão enviados no corpo da requisição. 
 * Deve ser um objeto serializável em JSON.
 * @param {Object} [customConfig] - Configurações adicionais para a requisição.
 * @returns {Promise<Object>} - Uma `Promise` que resolve para os dados retornados pelo servidor.
 *
 * @example
 * httpPost('https://api.exemplo.com/recurso', { nome: 'João', idade: 30 })
 *   .then(data => console.log(data))
 *   .catch(err => console.error(err));
 */
export const httpPost = async function (endpoint, body, customConfig = {}) {
  return client(endpoint, { body, ...customConfig, method: 'POST' });
};

/**
 * Realiza uma requisição HTTP PUT para atualizar recursos no servidor.
 *
 * @async
 * @function httpPut
 * @param {string} endpoint - O URL completo ou relativo do recurso a ser acessado.
 * @param {Object} body - Dados que serão enviados no corpo da requisição. 
 * Deve ser um objeto serializável em JSON.
 * @param {Object} [customConfig] - Configurações adicionais para a requisição.
 * @returns {Promise<Object>} - Uma `Promise` que resolve para os dados retornados pelo servidor.
 *
 * @example
 * httpPut('https://api.exemplo.com/recurso/1', { nome: 'Maria', idade: 25 })
 *   .then(data => console.log(data))
 *   .catch(err => console.error(err));
 */
export const httpPut = async function (endpoint, body, customConfig = {}) {
  return client(endpoint, { body, ...customConfig, method: 'PUT' });
};

/**
 * Realiza uma requisição HTTP DELETE para remover recursos do servidor.
 *
 * @async
 * @function httpDelete
 * @param {string} endpoint - O URL completo ou relativo do recurso a ser acessado.
 * @param {Object} [customConfig] - Configurações adicionais para a requisição.
 * @returns {Promise<Object>} - Uma `Promise` que resolve para os dados retornados pelo servidor.
 *
 * @example
 * httpDelete('https://api.exemplo.com/recurso/1')
 *   .then(data => console.log(data))
 *   .catch(err => console.error(err));
 */
export const httpDelete = async function (endpoint, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: 'DELETE' });
};
