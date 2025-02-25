/**
 * Define as rotas de manipulação de produtos, permitindo operações CRUD (Create, Read, Update, Delete) em produtos.
 * As rotas são protegidas por autenticação, sendo necessário que o usuário esteja autenticado para acessar os endpoints.
 * 
 * @module routes/products
 */

var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const Products = require('../models/products');
var authenticate = require('../authenticate');
const { getIo } = require('../socket');

const io = getIo();

router.use(bodyParser.json());

/**
 * Rota para listar todos os produtos ou criar um novo produto.
 * 
 * @name GET /products
 * @function
 * @memberof module:routes/products
 * @param {Object} req - O objeto de requisição HTTP.
 * @param {Object} res - O objeto de resposta HTTP.
 * @param {Function} next - Função de callback para o próximo middleware.
 * @returns {void} Retorna todos os produtos ou uma mensagem de erro.
 */
router.route('/')
  .get(async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const product = await Products.find({});
      res.statusCode = 200;
      res.json(product);
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.json({});
    }
  })
  /**
   * Rota para criar um novo produto, protegida por autenticação.
   * 
   * @name POST /products
   * @function
   * @memberof module:routes/products
   * @param {Object} req - O objeto de requisição HTTP que contém os dados do novo produto.
   * @param {Object} res - O objeto de resposta HTTP.
   * @param {Function} next - Função de callback para o próximo middleware.
   * @returns {void} Retorna o produto criado ou uma mensagem de erro.
   */
  .post(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const product = await Products.create(req.body);
      io.emit('productUpdated');
      res.statusCode = 200;
      res.json(product);
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.json({});
    }
  });

/**
 * Rota para acessar, atualizar ou excluir um produto específico.
 * 
 * @name GET /products/:id
 * @function
 * @memberof module:routes/products
 * @param {Object} req - O objeto de requisição HTTP.
 * @param {Object} res - O objeto de resposta HTTP.
 * @param {Function} next - Função de callback para o próximo middleware.
 * @returns {void} Retorna o produto encontrado ou uma mensagem de erro.
 */
router.route('/:id')
  .get(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const product = await Products.findById(req.params.id);
      if (product != null) {
        res.statusCode = 200;
        res.json(product);
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
   * Rota para atualizar um produto específico.
   * 
   * @name PUT /products/:id
   * @function
   * @memberof module:routes/products
   * @param {Object} req - O objeto de requisição HTTP que contém os dados do produto a ser atualizado.
   * @param {Object} res - O objeto de resposta HTTP.
   * @param {Function} next - Função de callback para o próximo middleware.
   * @returns {void} Retorna o produto atualizado ou uma mensagem de erro.
   */
  .put(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const product = await Products.findByIdAndUpdate(req.params.id, {
        $set: req.body
      }, {
        new: true
      });
      io.emit('productUpdated');
      res.statusCode = 200;
      res.json(product);
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.json({});
    }
  })
  /**
   * Rota para excluir um produto específico.
   * 
   * @name DELETE /products/:id
   * @function
   * @memberof module:routes/products
   * @param {Object} req - O objeto de requisição HTTP.
   * @param {Object} res - O objeto de resposta HTTP.
   * @param {Function} next - Função de callback para o próximo middleware.
   * @returns {void} Retorna o id do produto excluído ou uma mensagem de erro.
   */
  .delete(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const response = await Products.findByIdAndDelete(req.params.id);
      io.emit('productUpdated');
      res.statusCode = 200;
      res.json(response.id);
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.json({});
    }
  });

module.exports = router;
