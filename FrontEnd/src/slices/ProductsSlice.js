/**
 * Adaptador de produtos que gerencia o estado normalizado de produtos no Redux
 * @module slices/ProductsSlice
 */
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { httpDelete, httpGet, httpPost, httpPut } from '../utils';

const productsAdapter = createEntityAdapter();

const initialState = productsAdapter.getInitialState({
    status: "not_loaded",
    error: null
});

const baseUrl = "http://localhost:3004";

/**
 * Busca todos os produtos do servidor.
 * @async
 * @function fetchProducts
 * @returns {Promise<Object[]>} Lista de produtos recuperada do servidor.
 */
export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
    return await httpGet(`${baseUrl}/products`);
});

/**
 * Adiciona um novo produto no servidor.
 * 
 * @async
 * @function addProductServer
 * @param {Object} product - Dados do produto a ser adicionado.
 * @param {Function} getState - Função para acessar o estado atual do Redux.
 * @returns {Promise<Object>} Produto adicionado com sucesso.
 */
export const addProductServer = createAsyncThunk("products/addProductServer", async (product, { getState }) => {
    return await httpPost(`${baseUrl}/products`, product, { headers: { 'Authorization': `Bearer ${getState().logins.token}` } });
});

/**
 * Atualiza um produto existente no servidor.
 * 
 * @async
 * @function updateProductServer
 * @param {Object} product - Dados do produto a ser atualizado.
 * @param {Function} getState - Função para acessar o estado atual do Redux.
 * @returns {Promise<Object>} Produto atualizado com sucesso.
 */
export const updateProductServer = createAsyncThunk("products/updateProductServer", async (product, { getState }) => {
    return await httpPut(`${baseUrl}/products/${product.id}`, product, { headers: { 'Authorization': `Bearer ${getState().logins.token}` } });
});

/**
 * Remove um produto do servidor.
 * 
 * @async
 * @function removeProductServer
 * @param {string} productId - ID do produto a ser removido.
 * @param {Function} getState - Função para acessar o estado atual do Redux.
 * @returns {Promise<string>} ID do produto removido.
 */
export const removeProductServer = createAsyncThunk("products/removeProductServer", async (productId, { getState }) => {
    await httpDelete(`${baseUrl}/products/${productId}`, { headers: { 'Authorization': `Bearer ${getState().logins.token}` } });
    return productId;
});

/**
 * Slice do Redux para gerenciar o estado dos produtos.
 */
export const productSlice = createSlice({
    name: 'products',
    initialState: initialState,
    extraReducers: builder => {
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.status = "loaded";
            productsAdapter.setAll(state, action.payload);
        });
        builder.addCase(fetchProducts.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        });
        builder.addCase(addProductServer.fulfilled, (state, action) => {
            state.status = "saved";
            productsAdapter.addOne(state, action.payload);
        });
        builder.addCase(addProductServer.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(updateProductServer.fulfilled, (state, action) => {
            state.status = "saved";
            productsAdapter.upsertOne(state, action.payload);
        });
        builder.addCase(updateProductServer.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(removeProductServer.fulfilled, (state, action) => {
            state.status = "deleted";
            productsAdapter.removeOne(state, action.payload);
        });
        builder.addCase(removeProductServer.pending, (state) => {
            state.status = "loading";
        });
    }
});

export default productSlice.reducer;

/**
 * Seletores para acessar os dados dos produtos.
 */
export const {
    selectAll: selectAllProducts,
    selectById: selectProductsById,
    selectIds: selectProductsIds
} = productsAdapter.getSelectors(state => state.products);
