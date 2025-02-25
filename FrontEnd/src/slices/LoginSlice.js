/**
 * Slice Redux para gerenciar o estado de autenticação do usuário (login, logout e cadastro).
 *
 * @module slices/loginSlice
 */
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { httpPost, httpGet } from '../utils';

/**
 * Adaptador para gerenciar o estado das entidades relacionadas ao login.
 */
const loginAdapter = createEntityAdapter();

/**
 * Estado inicial do slice de login.
 * @type {Object}
 * @property {string} status - Estado da autenticação (e.g., "not_logged_in", "logged_in").
 * @property {number} error - Código de erro (0: nenhum erro, 1: erro no cadastro, 2: erro no login).
 * @property {string|null} token - Token de autenticação do usuário.
 * @property {string|null} username - Nome de usuário autenticado.
 */
const initialState = loginAdapter.getInitialState({
    status: "not_logged_in",
    error: 0,
    admin: false,
    token: null,
    username: null
});

/**
 * URL base para as requisições relacionadas ao usuário.
 * @constant
 * @type {string}
 */
const baseUrl = "http://localhost:3004";

/**
 * Thunk para autenticar um usuário no servidor.
 *
 * @async
 * @function loginServer
 * @param {Object} login - Dados de login do usuário (e.g., username e password).
 * @returns {Promise<Object>} Resposta do servidor contendo o token e username.
 */
export const loginServer = createAsyncThunk("users/loginServer", async (login) => {
    return await httpPost(`${baseUrl}/users/login`, login);
});

/**
 * Thunk para cadastrar um novo usuário no servidor.
 *
 * @async
 * @function signupServer
 * @param {Object} userData - Dados do usuário a ser cadastrado.
 * @returns {Promise<Object>} Resposta do servidor contendo o token e username.
 */
export const signupServer = createAsyncThunk("users/signinServer", async (userData) => {
    return await httpPost(`${baseUrl}/users/signup`, userData);
});

/**
 * Thunk para desconectar o usuário no servidor.
 *
 * @async
 * @function logoutServer
 * @returns {Promise<void>} Resposta do servidor confirmando o logout.
 */
export const logoutServer = createAsyncThunk("users/logoutServer", async () => {
    return await httpGet(`${baseUrl}/users/logout`);
});

/**
 * Slice que gerencia as ações e estado relacionados ao login do usuário.
 */
export const loginSlice = createSlice({
    name: 'logins',
    initialState: initialState,
    extraReducers: builder => {
        builder.addCase(loginServer.fulfilled, (state, action) => {
            state.status = "logged_in";
            loginAdapter.addOne(state, action.payload);
            state.error = 0;
            state.token = action.payload.token;
            state.username = action.payload.username;
            state.admin = action.payload.admin;
        });
        builder.addCase(loginServer.pending, (state, action) => {
            state.error = 0;
        });
        builder.addCase(loginServer.rejected, (state, action) => {
            state.error = 2;
        });
        builder.addCase(signupServer.fulfilled, (state, action) => {
            state.status = "logged_in";
            loginAdapter.addOne(state, action.payload);
            state.error = 0;
            state.token = action.payload.token;
            state.username = action.payload.username;
        });
        builder.addCase(signupServer.pending, (state, action) => {
            state.error = 0;
        });
        builder.addCase(signupServer.rejected, (state, action) => {
            state.error = 1;
        });
        builder.addCase(logoutServer.fulfilled, (state) => {
            state.status = "not_logged_in";
            loginAdapter.removeOne(state);
            state.admin = false;
            state.token = null;
            state.username = null;
        });
    }
});

export default loginSlice.reducer;

/**
 * Seletores gerados automaticamente pelo adaptador de login.
 * @typedef {Object} LoginSelectors
 * @property {Function} selectAll - Retorna todos os registros de login.
 */
export const {
    selectAll: selectAllLogins
} = loginAdapter.getSelectors(state => state.logins);
