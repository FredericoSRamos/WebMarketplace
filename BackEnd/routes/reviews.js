/**
 * Define as rotas de manipulação de avaliações, permitindo operações CRUD (Create, Read, Update, Delete) em avaliações.
 * As rotas são protegidas por autenticação, sendo necessário que o usuário esteja autenticado para acessar os endpoints.
 * 
 * @module routes/reviews
 */

var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const Reviews = require('../models/reviews');
var authenticate = require('../authenticate');
const { getIo } = require('../socket');

const io = getIo();

router.use(bodyParser.json());

/**
 * Rota para listar todas as avaliações ou criar uma nova avaliação.
 * 
 * @name GET /reviews
 * @function
 * @memberof module:routes/reviews
 * @param {Object} req - O objeto de requisição HTTP.
 * @param {Object} res - O objeto de resposta HTTP.
 * @param {Function} next - Função de callback para o próximo middleware.
 * @returns {void} Retorna todas as avaliações ou uma mensagem de erro.
 */
router.route('/')
  .get(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const review = await Reviews.find({});
      res.statusCode = 200;
      res.json(review);
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.json({});
    }
  })
  /**
   * Rota para criar uma nova avaliação, protegida por autenticação.
   * 
   * @name POST /reviews
   * @function
   * @memberof module:routes/reviews
   * @param {Object} req - O objeto de requisição HTTP que contém os dados da nova avaliação.
   * @param {Object} res - O objeto de resposta HTTP.
   * @param {Function} next - Função de callback para o próximo middleware.
   * @returns {void} Retorna a avaliação criada ou uma mensagem de erro.
   */
  .post(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const review = await Reviews.create(req.body);
      io.emit('reviewUpdated');
      res.statusCode = 200;
      res.json(review);
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.json({});
    }
  });

/**
 * Rota para acessar, atualizar ou excluir uma avaliação específica.
 * 
 * @name GET /reviews/:id
 * @function
 * @memberof module:routes/reviews
 * @param {Object} req - O objeto de requisição HTTP.
 * @param {Object} res - O objeto de resposta HTTP.
 * @param {Function} next - Função de callback para o próximo middleware.
 * @returns {void} Retorna a avaliação encontrada ou uma mensagem de erro.
 */
router.route('/:id')
  .get(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const review = await Reviews.findById(req.params.id);
      if (review != null) {
        res.statusCode = 200;
        res.json(review);
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
   * Rota para atualizar uma avaliação específica.
   * 
   * @name PUT /reviews/:id
   * @function
   * @memberof module:routes/reviews
   * @param {Object} req - O objeto de requisição HTTP que contém os dados da avaliação a ser atualizada.
   * @param {Object} res - O objeto de resposta HTTP.
   * @param {Function} next - Função de callback para o próximo middleware.
   * @returns {void} Retorna a avaliação atualizada ou uma mensagem de erro.
   */
  .put(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const review = await Reviews.findByIdAndUpdate(req.params.id, {
        $set: req.body
      }, {
        new: true
      });
      io.emit('reviewUpdated');
      res.statusCode = 200;
      res.json(review);
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.json({});
    }
  })
  /**
   * Rota para excluir uma avaliação específica.
   * 
   * @name DELETE /reviews/:id
   * @function
   * @memberof module:routes/reviews
   * @param {Object} req - O objeto de requisição HTTP.
   * @param {Object} res - O objeto de resposta HTTP.
   * @param {Function} next - Função de callback para o próximo middleware.
   * @returns {void} Retorna o id da avaliação excluída ou uma mensagem de erro.
   */
  .delete(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const response = await Reviews.findByIdAndDelete(req.params.id);
      io.emit('reviewUpdated');
      res.statusCode = 200;
      res.json(response);
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.json({});
    }
  });

module.exports = router;
