/**
 * Adaptador de pedidos que gerencia o estado normalizado de pedidos no Redux
 * @module slices/PedidoSlice
 */
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { httpDelete, httpGet, httpPost, httpPut } from '../utils';

/**
 * Adaptador de pedidos que gerencia o estado normalizado de pedidos no Redux.
 * @constant {Object} pedidosAdapter - O adaptador de pedidos.
 */
const pedidosAdapter = createEntityAdapter();

/**
 * Estado inicial para o slice de pedidos.
 * @constant {Object} initialState - Estado inicial do slice de pedidos.
 * @property {string} status - O status atual da requisição de pedidos. Pode ser 'not_loaded', 'loading', 'succeeded', 'failed', 'saved', ou 'deleted'.
 * @property {Object} error - Armazena o erro da requisição, caso haja.
 */
const initialState = pedidosAdapter.getInitialState({
  status: 'not_loaded',
  error: null,
});

/**
 * URL base para a API de pedidos.
 * @constant {string} baseUrl - URL base para as operações relacionadas a pedidos.
 */
const baseUrl = "http://localhost:3004/pedidos"; 

/**
 * Ação assíncrona para buscar todos os pedidos.
 * @function fetchPedidos
 * @param {Function} getState - Função do Redux para obter o estado atual.
 * @returns {Promise<Object[]>} Lista de pedidos retornada pela API.
 */
export const fetchPedidos = createAsyncThunk("pedidos/fetchPedidos", async (_, { getState }) => {
  return await httpGet(`${baseUrl}`, {headers: { 'Authorization': `Bearer ${getState().logins.token}`}});
});

/**
 * Ação assíncrona para adicionar um novo pedido no servidor.
 * @function addPedidoServer
 * @param {Object} pedido - O pedido a ser adicionado.
 * @param {Function} getState - Função do Redux para obter o estado atual.
 * @returns {Promise<Object>} O pedido adicionado.
 * @throws {Error} Se o pedido com o mesmo ID já existe.
 */
export const addPedidoServer = createAsyncThunk("pedidos/addPedidoServer", async (pedido, { getState }) => {
  const state = getState();
  const existeID = state.pedidos.ids;
  if (existeID.includes(pedido.id)) {
    throw new Error()
  }

  return await httpPost(`${baseUrl}`, pedido, {headers: { 'Authorization': `Bearer ${getState().logins.token}`}});
});

/**
 * Ação assíncrona para atualizar um pedido no servidor.
 * @function updatePedidoServer
 * @param {Object} pedido - O pedido a ser atualizado.
 * @param {Function} getState - Função do Redux para obter o estado atual.
 * @returns {Promise<Object>} O pedido atualizado.
 */
export const updatePedidoServer = createAsyncThunk("pedidos/updatePedidoServer", async (pedido, { getState }) => {
  return await httpPut(`${baseUrl}/${pedido.id}`, pedido, {headers: { 'Authorization': `Bearer ${getState().logins.token}`}});
});

/**
 * Ação assíncrona para remover um pedido do servidor.
 * @function removePedidoServer
 * @param {string} pedidoId - ID do pedido a ser removido.
 * @param {Function} getState - Função do Redux para obter o estado atual.
 * @returns {string} O ID do pedido removido.
 */
export const removePedidoServer = createAsyncThunk("pedidos/removePedidoServer", async (pedidoId, { getState }) => {
  await httpDelete(`${baseUrl}/${pedidoId}`, {headers: { 'Authorization': `Bearer ${getState().logins.token}`}});
  return pedidoId;
});

/**
 * Redutor de pedidos que define como o estado de pedidos é alterado em resposta às ações.
 * @constant {Object} pedidosSlice - O slice de pedidos, contendo as configurações e ações do Redux.
 * @returns {Object} Redutor de pedidos.
 */
const pedidosSlice = createSlice({
  name: 'pedidos',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchPedidos.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchPedidos.fulfilled, (state, action) => {
      state.status = 'succeeded';
      pedidosAdapter.setAll(state, action.payload);
    });
    builder.addCase(fetchPedidos.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
    builder.addCase(addPedidoServer.fulfilled, (state, action) => {
      state.status = 'saved';
      pedidosAdapter.addOne(state, action.payload);
    });
    builder.addCase(addPedidoServer.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(updatePedidoServer.fulfilled, (state, action) => {
      state.status = 'saved';
      pedidosAdapter.upsertOne(state, action.payload);
    });
    builder.addCase(updatePedidoServer.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(removePedidoServer.fulfilled, (state, action) => {
      state.status = 'deleted';
      pedidosAdapter.removeOne(state, action.payload);
    });
    builder.addCase(removePedidoServer.pending, (state) => {
      state.status = 'loading';
    });
  },
});

export default pedidosSlice.reducer;

/**
 * Seletores do adaptador de pedidos para acessar o estado de pedidos.
 * @constant {Function} selectAllPedidos - Seleciona todos os pedidos do estado.
 * @constant {Function} selectPedidoById - Seleciona um pedido específico pelo ID.
 * @constant {Function} selectPedidosIds - Seleciona os IDs de todos os pedidos.
 */
export const {
  selectAll: selectAllPedidos,
  selectById: selectPedidoById,
  selectIds: selectPedidosIds,
} = pedidosAdapter.getSelectors((state) => state.pedidos);
