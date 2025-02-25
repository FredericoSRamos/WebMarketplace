/**
 * Configura o middleware de CORS (Cross-Origin Resource Sharing) para uma aplicação Express.
 * Este módulo exporta duas opções:
 * 1. `cors`: Permite todas as requisições CORS.
 * 2. `corsWithOptions`: Permite requisições CORS apenas para origens especificadas em uma lista de permissões.
 * 
 * @module routes/cors
 */

const express = require('express');
const cors = require('cors');

/**
 * Lista de URLs permitidas para realizar requisições CORS.
 * 
 * @constant {string[]} whitelist
 */
const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://localhost:3004', 'http://localhost:5000'];

/**
 * Função de delegação que configura as opções de CORS com base na origem da requisição.
 * Verifica se a origem está na lista de permissões e ajusta as configurações de CORS dinamicamente.
 * 
 * @function corsOptionsDelegate
 * @param {Object} req - Objeto da requisição.
 * @param {Function} callback - Função de callback para definir as opções de CORS.
 */
var corsOptionsDelegate = (req, callback) => {
    console.log('Origin:', req.header('Origin'));
    var corsOption;

    // Verifica se a origem está na lista de permissões
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOption = {
            origin: true
        };
    } else {
        corsOption = {
            origin: false
        };
    }
    callback(null, corsOption);
};

/**
 * Middleware que permite todas as requisições CORS.
 * 
 * @type {Function}
 */
exports.cors = cors();

/**
 * Middleware que permite requisições CORS somente para origens na lista de permissões.
 * 
 * @type {Function}
 */
exports.corsWithOptions = cors(corsOptionsDelegate);
