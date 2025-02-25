/**
 * Slice Redux para gerenciar o estado das pechinchas (operações CRUD).
 *
 * @module slices/pechinchaSlice
 */
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { httpDelete, httpGet, httpPost, httpPut } from '../utils';

/**
 * Adaptador para gerenciar o estado das entidades relacionadas às pechinchas.
 */
const pechinchasAdapter = createEntityAdapter();

/**
 * Estado inicial do slice de pechinchas.
 * @type {Object}
 * @property {string} status - Estado geral do carregamento (e.g., "not_loaded", "loaded", "loading").
 * @property {string} pstatus - Estado específico da pechincha (e.g., "pendente").
 * @property {string|null} error - Mensagem de erro em caso de falha.
 */
const initialState = pechinchasAdapter.getInitialState({
    status: "not_loaded",
    pstatus: "pendente",
    error: null
});

/**
 * URL base para as requisições relacionadas às pechinchas.
 * @constant
 * @type {string}
 */
const baseUrl = "http://localhost:3004";

/**
 * Thunk para buscar todas as pechinchas no servidor.
 *
 * @async
 * @function fetchPechinchas
 * @param {void} _ - Parâmetro ignorado.
 * @param {Object} thunkAPI - API do thunk, usada para acessar o estado.
 * @returns {Promise<Object[]>} Lista de pechinchas.
 */
export const fetchPechinchas = createAsyncThunk("pechinchas/fetchPechinchas", async (_, { getState }) => {
  return await httpGet(`${baseUrl}/pechinchas`, {headers: { 'Authorization': `Bearer ${getState().logins.token}` }});
});

/**
 * Thunk para adicionar uma nova pechincha no servidor.
 *
 * @async
 * @function addPechinchaServer
 * @param {Object} pechincha - Dados da pechincha a ser adicionada.
 * @param {Object} thunkAPI - API do thunk, usada para acessar o estado.
 * @returns {Promise<Object>} Pechincha adicionada.
 */
export const addPechinchaServer = createAsyncThunk("pechinchas/addPechinchaServer", async (pechincha, { getState }) => {
  return await httpPost(`${baseUrl}/pechinchas`, pechincha, {headers: { 'Authorization': `Bearer ${getState().logins.token}` }});
});

/**
 * Thunk para atualizar uma pechincha existente no servidor.
 *
 * @async
 * @function updatePechinchaServer
 * @param {Object} pechincha - Dados da pechincha a ser atualizada.
 * @param {Object} thunkAPI - API do thunk, usada para acessar o estado.
 * @returns {Promise<Object>} Pechincha atualizada.
 */
export const updatePechinchaServer = createAsyncThunk("pechinchas/updatePechinchaServer", async (pechincha, { getState }) => {
  return await httpPut(`${baseUrl}/pechinchas/${pechincha.id}`, pechincha, {headers: { 'Authorization': `Bearer ${getState().logins.token}` }});
});

/**
 * Thunk para remover uma pechincha no servidor.
 *
 * @async
 * @function removePechinchaServer
 * @param {string} pechinchaId - ID da pechincha a ser removida.
 * @param {Object} thunkAPI - API do thunk, usada para acessar o estado.
 * @returns {Promise<string>} ID da pechincha removida.
 */
export const removePechinchaServer = createAsyncThunk("pechinchas/removePechinchaServer", async (pechinchaId, { getState }) => {
  await httpDelete(`${baseUrl}/pechinchas/${pechinchaId}`, {headers: { 'Authorization': `Bearer ${getState().logins.token}` }});
  return pechinchaId;
});

/**
 * Slice que gerencia as ações e estado relacionados às pechinchas.
 */
export const pechinchaSlice = createSlice({
  name: 'pechinchas',
  initialState: initialState,
  extraReducers: builder => {
    builder.addCase(fetchPechinchas.fulfilled, (state, action) => {
      state.status = "loaded";
      pechinchasAdapter.setAll(state, action.payload);
    });
    builder.addCase(fetchPechinchas.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchPechinchas.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });

    builder.addCase(addPechinchaServer.fulfilled, (state, action) => {
      state.status = "saved";
      pechinchasAdapter.addOne(state, action.payload);
    });
    builder.addCase(addPechinchaServer.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(updatePechinchaServer.fulfilled, (state, action) => {
      state.status = "saved";
      state.pstatus = action.payload.status;
    });

    builder.addCase(updatePechinchaServer.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(removePechinchaServer.fulfilled, (state, action) => {
      state.status = "deleted";
      pechinchasAdapter.removeOne(state, action.payload);
    });
    builder.addCase(removePechinchaServer.pending, (state) => {
      state.status = "loading";
    });
  }
});

export default pechinchaSlice.reducer;

/**
 * Seletores gerados automaticamente pelo adaptador de pechinchas.
 * @typedef {Object} PechinchaSelectors
 * @property {Function} selectAll - Retorna todas as pechinchas.
 * @property {Function} selectById - Retorna uma pechincha pelo ID.
 * @property {Function} selectIds - Retorna os IDs de todas as pechinchas.
 */
export const {
  selectAll: selectAllPechinchas,
  selectById: selectPechinchasById,
  selectIds: selectPechinchasIds
} = pechinchasAdapter.getSelectors(state => state.pechinchas);
