/**
 * Adaptador de Reviews que gerencia o estado normalizado das reviews no Redux
 * @module slices/ReviewsSlice
 */
import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { httpDelete, httpGet, httpPost, httpPut } from "../utils";

const reviewsAdapter = createEntityAdapter();

const initialState = reviewsAdapter.getInitialState({
    status: "not_loaded",
    error: null
});

const baseUrl = "http://localhost:3004";

/**
 * Busca todas as avaliações do servidor.
 * 
 * @async
 * @function fetchReviews
 * @param {Function} getState - Função para acessar o estado atual do Redux.
 * @returns {Promise<Object[]>} Lista de avaliações recuperadas do servidor.
 */
export const fetchReviews = createAsyncThunk("reviews/fetchReviews", async (_, { getState }) => {
    return await httpGet(`${baseUrl}/reviews`, { headers: { 'Authorization': `Bearer ${getState().logins.token}` } });
});

/**
 * Adiciona uma nova avaliação no servidor.
 * 
 * @async
 * @function addReviewServer
 * @param {Object} review - Dados da avaliação a ser adicionada.
 * @param {Function} getState - Função para acessar o estado atual do Redux.
 * @returns {Promise<Object>} Avaliação adicionada com sucesso.
 */
export const addReviewServer = createAsyncThunk("reviews/addReviewServer", async (review, { getState }) => {
    return await httpPost(`${baseUrl}/reviews`, review, { headers: { 'Authorization': `Bearer ${getState().logins.token}` } });
});

/**
 * Atualiza uma avaliação existente no servidor.
 * 
 * @async
 * @function updateReviewServer
 * @param {Object} review - Dados da avaliação a ser atualizada.
 * @param {Function} getState - Função para acessar o estado atual do Redux.
 * @returns {Promise<Object>} Avaliação atualizada com sucesso.
 */
export const updateReviewServer = createAsyncThunk("reviews/updateReviewServer", async (review, { getState }) => {
    return await httpPut(`${baseUrl}/reviews/${review.id}`, review, { headers: { 'Authorization': `Bearer ${getState().logins.token}` } });
});

/**
 * Remove uma avaliação do servidor.
 * 
 * @async
 * @function removeReviewServer
 * @param {string} reviewId - ID da avaliação a ser removida.
 * @param {Function} getState - Função para acessar o estado atual do Redux.
 * @returns {Promise<string>} ID da avaliação removida.
 */
export const removeReviewServer = createAsyncThunk("reviews/removeReviewServer", async (reviewId, { getState }) => {
    await httpDelete(`${baseUrl}/reviews/${reviewId}`, { headers: { 'Authorization': `Bearer ${getState().logins.token}` } });
    return reviewId;
});

/**
 * Slice do Redux para gerenciar o estado das avaliações.
 */
export const reviewSlice = createSlice({
    name: 'reviews',
    initialState: initialState,
    extraReducers: builder => {
        builder.addCase(fetchReviews.fulfilled, (state, action) => {
            state.status = "loaded";
            reviewsAdapter.setAll(state, action.payload);
        });
        builder.addCase(fetchReviews.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(fetchReviews.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        });
        builder.addCase(addReviewServer.fulfilled, (state, action) => {
            state.status = "saved";
            reviewsAdapter.addOne(state, action.payload);
        });
        builder.addCase(addReviewServer.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(updateReviewServer.fulfilled, (state, action) => {
            state.status = "saved";
            reviewsAdapter.upsertOne(state, action.payload);
        });
        builder.addCase(updateReviewServer.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(removeReviewServer.fulfilled, (state, action) => {
            state.status = "deleted";
            reviewsAdapter.removeOne(state, action.payload);
        });
        builder.addCase(removeReviewServer.pending, (state) => {
            state.status = "loading";
        });
    }
});

export default reviewSlice.reducer;

/**
 * Seletores para acessar os dados das avaliações.
 */
export const {
    selectAll: selectAllReviews,
    selectById: selectReviewsById,
    selectIds: selectReviewsIds
} = reviewsAdapter.getSelectors(state => state.reviews);
