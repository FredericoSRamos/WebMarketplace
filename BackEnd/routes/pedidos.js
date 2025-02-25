/**
 * Define as rotas de manipulação de pedidos, permitindo operações CRUD (Create, Read, Update, Delete) em pedidos.
 * As rotas são protegidas por autenticação, sendo necessário que o usuário esteja autenticado para acessar os endpoints.
 * 
 * @module routes/pedidos
 */

var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const Pedidos = require('../models/pedidos');
var authenticate = require('../authenticate');
const { getIo } = require('../socket');

const io = getIo();

router.use(bodyParser.json());

/**
 * Rota para listar todos os pedidos ou criar um novo pedido.
 * 
 * @name GET /pedidos
 * @function
 * @memberof module:routes/pedidos
 * @param {Object} req - O objeto de requisição HTTP.
 * @param {Object} res - O objeto de resposta HTTP.
 * @param {Function} next - Função de callback para o próximo middleware.
 * @returns {void} Retorna todos os pedidos ou uma mensagem de erro.
 */
router.route('/')
  .get(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const pedido = await Pedidos.find({});
      res.statusCode = 200;
      res.json(pedido);
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.json({});
    }
  })
  /**
   * Rota para criar um novo pedido.
   * 
   * @name POST /pedidos
   * @function
   * @memberof module:routes/pedidos
   * @param {Object} req - O objeto de requisição HTTP que contém os dados do novo pedido.
   * @param {Object} res - O objeto de resposta HTTP.
   * @param {Function} next - Função de callback para o próximo middleware.
   * @returns {void} Retorna o pedido criado ou uma mensagem de erro.
   */
  .post(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const pedido = await Pedidos.create(req.body);
      io.emit('pedidoUpdated');
      res.statusCode = 200;
      res.json(pedido);
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.json({});
    }
  });

/**
 * Rota para acessar, atualizar ou excluir um pedido específico.
 * 
 * @name GET /pedidos/:id
 * @function
 * @memberof module:routes/pedidos
 * @param {Object} req - O objeto de requisição HTTP.
 * @param {Object} res - O objeto de resposta HTTP.
 * @param {Function} next - Função de callback para o próximo middleware.
 * @returns {void} Retorna o pedido encontrado ou uma mensagem de erro.
 */
router.route('/:id')
  .get(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const pedido = await Pedidos.findById(req.params.id);
      if (pedido != null) {
        res.statusCode = 200;
        res.json(pedido);
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
   * Rota para atualizar um pedido específico.
   * 
   * @name PUT /pedidos/:id
   * @function
   * @memberof module:routes/pedidos
   * @param {Object} req - O objeto de requisição HTTP que contém os dados do pedido a ser atualizado.
   * @param {Object} res - O objeto de resposta HTTP.
   * @param {Function} next - Função de callback para o próximo middleware.
   * @returns {void} Retorna o pedido atualizado ou uma mensagem de erro.
   */
  .put(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const pedido = await Pedidos.findByIdAndUpdate(req.params.id, {
        $set: req.body
      }, {
        new: true
      });
      io.emit('pedidoUpdated');
      res.statusCode = 200;
      res.json(pedido);
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.json({});
    }
  })
  /**
   * Rota para excluir um pedido específico.
   * 
   * @name DELETE /pedidos/:id
   * @function
   * @memberof module:routes/pedidos
   * @param {Object} req - O objeto de requisição HTTP.
   * @param {Object} res - O objeto de resposta HTTP.
   * @param {Function} next - Função de callback para o próximo middleware.
   * @returns {void} Retorna o id do pedido excluído ou uma mensagem de erro.
   */
  .delete(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const response = await Pedidos.findByIdAndDelete(req.params.id);
      io.emit('pedidoUpdated');
      res.statusCode = 200;
      res.json(response.id);
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.json({});
    }
  });

module.exports = router;
