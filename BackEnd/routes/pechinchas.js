/**
 * Define as rotas de manipulação de pechinchas, permitindo operações CRUD (Create, Read, Update, Delete) em pechinchas.
 * As rotas são protegidas por autenticação, sendo necessário que o usuário esteja autenticado para acessar os endpoints.
 * 
 * @module routes/pechinchas
 */

var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const Pechinchas = require('../models/pechinchas');
var authenticate = require('../authenticate');
const { getIo } = require('../socket');

const io = getIo();

router.use(bodyParser.json());

/**
 * Rota para listar todas as pechinchas ou criar uma nova pechincha.
 * 
 * @name GET /pechinchas
 * @function
 * @memberof module:routes/pechinchas
 * @param {Object} req - O objeto de requisição HTTP.
 * @param {Object} res - O objeto de resposta HTTP.
 * @param {Function} next - Função de callback para o próximo middleware.
 * @returns {void} Retorna todas as pechinchas ou uma mensagem de erro.
 */
router.route('/')
  .get(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const pechincha = await Pechinchas.find({});
      res.statusCode = 200;
      res.json(pechincha);
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.json({});
    }
  })
  /**
   * Rota para criar uma nova pechincha.
   * 
   * @name POST /pechinchas
   * @function
   * @memberof module:routes/pechinchas
   * @param {Object} req - O objeto de requisição HTTP que contém os dados da nova pechincha.
   * @param {Object} res - O objeto de resposta HTTP.
   * @param {Function} next - Função de callback para o próximo middleware.
   * @returns {void} Retorna a pechincha criada ou uma mensagem de erro.
   */
  .post(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const pechincha = await Pechinchas.create(req.body);
      io.emit('pechinchaUpdated');
      res.statusCode = 200;
      res.json(pechincha);
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.json({});
    }
  });

/**
 * Rota para acessar, atualizar ou excluir uma pechincha específica.
 * 
 * @name GET /pechinchas/:id
 * @function
 * @memberof module:routes/pechinchas
 * @param {Object} req - O objeto de requisição HTTP.
 * @param {Object} res - O objeto de resposta HTTP.
 * @param {Function} next - Função de callback para o próximo middleware.
 * @returns {void} Retorna a pechincha encontrada ou uma mensagem de erro.
 */
router.route('/:id')
  .get(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const pechincha = await Pechinchas.findById(req.params.id);
      if (pechincha != null) {
        res.statusCode = 200;
        res.json(pechincha);
      } else {
        let err = {};
        res.statusCode = 404;
        res.json(err);
      }
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.json({});
    }
  })
  /**
   * Rota para atualizar uma pechincha específica.
   * 
   * @name PUT /pechinchas/:id
   * @function
   * @memberof module:routes/pechinchas
   * @param {Object} req - O objeto de requisição HTTP que contém os dados da pechincha a ser atualizada.
   * @param {Object} res - O objeto de resposta HTTP.
   * @param {Function} next - Função de callback para o próximo middleware.
   * @returns {void} Retorna a pechincha atualizada ou uma mensagem de erro.
   */
  .put(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const pechincha = await Pechinchas.findByIdAndUpdate(req.params.id, {
        $set: req.body
      }, {
        new: true
      });
      io.emit('pechinchaUpdated');
      res.statusCode = 200;
      res.json(pechincha);
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.json({});
    }
  })
  /**
   * Rota para excluir uma pechincha específica.
   * 
   * @name DELETE /pechinchas/:id
   * @function
   * @memberof module:routes/pechinchas
   * @param {Object} req - O objeto de requisição HTTP.
   * @param {Object} res - O objeto de resposta HTTP.
   * @param {Function} next - Função de callback para o próximo middleware.
   * @returns {void} Retorna o id da pechincha excluída ou uma mensagem de erro.
   */
  .delete(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const response = await Pechinchas.findByIdAndDelete(req.params.id);
      io.emit('pechinchaUpdated');
      res.statusCode = 200;
      res.json(response.id);
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.json({});
    }
  });

module.exports = router;
