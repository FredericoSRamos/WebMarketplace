/**
 * Define as rotas para a página inicial da aplicação Express.
 * Esta rota renderiza a página inicial com um título dinâmico.
 * 
 * @module routes/index
 */

var express = require('express');
var router = express.Router();

/**
 * Rota para a página inicial da aplicação.
 * 
 * @name GET /
 * @function
 * @memberof module:routes/home
 * @param {Object} req - O objeto de requisição HTTP.
 * @param {Object} res - O objeto de resposta HTTP.
 * @param {Function} next - Função de callback para o próximo middleware.
 * @returns {void} Renderiza a página inicial com o título especificado.
 */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
