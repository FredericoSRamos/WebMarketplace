/**
 * Define as rotas de manipulação de avaliações, permitindo operações CRUD (Create, Read, Update, Delete) em avaliações.
 * As rotas são protegidas por autenticação, sendo necessário que o usuário esteja autenticado para acessar os endpoints.
 * 
 * @module routes/reviews
 */

var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
const { getIo } = require('../socket');
const dynamoDB = require('../routes/dynamoDB');
const { v4: uuidv4 } = require('uuid');

const io = getIo();

router.use(bodyParser.json());

/**
 * Rota para listar todas as avaliações ou criar uma nova avaliação.
 * 
 * @name GET /reviews
 * @function
 * @memberof module:routes/reviews
 */
router.route('/')
  .get(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const params = {
        TableName: 'CargoshopReviews'
      };

      const data = await dynamoDB.scan(params).promise();
      res.statusCode = 200;
      res.json(data.Items);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to retrieve reviews" });
    }
  })
  /**
   * Rota para criar uma nova avaliação, protegida por autenticação.
   * 
   * @name POST /reviews
   * @function
   * @memberof module:routes/reviews
   */
  .post(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const newReview = {
        id: uuidv4(),
        orderId: req.body.orderId,
        buyer: req.body.buyer,
        seller: req.body.seller,
        rate: req.body.rate,
        message: req.body.message
      };

      const params = {
        TableName: 'CargoshopReviews',
        Item: newReview
      };
      await dynamoDB.put(params).promise();

      io.emit('reviewUpdated');
      res.statusCode = 200;
      res.json(newReview);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to create review" });
    }
  });

/**
 * Rota para acessar, atualizar ou excluir uma avaliação específica.
 * 
 * @name GET /reviews/:id
 * @function
 * @memberof module:routes/reviews
 */
router.route('/:id')
  .get(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const params = {
        TableName: 'CargoshopReviews',
        Key: {
          id: req.params.id
        }
      };

      const data = await dynamoDB.get(params).promise();
      if (data.Item) {
        res.statusCode = 200;
        res.json(data.Item);
      } else {
        res.statusCode = 404;
        res.json({ error: "Review not found" });
      }
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to get review" });
    }
  })
  /**
   * Rota para atualizar uma avaliação específica.
   * 
   * @name PUT /reviews/:id
   * @function
   * @memberof module:routes/reviews
   */
  .put(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const reviewId = req.params.id;

      const { orderId, buyer, seller, rate, message } = req.body;

      const params = {
        TableName: 'CargoshopReviews',
        Key: {
          id: reviewId,
        },
        UpdateExpression: 'set orderId = :orderId, buyer = :buyer, seller = :seller, rate = :rate, message = :message',
        ExpressionAttributeValues: {
          ':orderId': orderId,
          ':buyer': buyer,
          ':seller': seller,
          ':rate': rate,
          ':message': message
        },
        ReturnValues: 'ALL_NEW',
      };

      const result = await dynamoDB.update(params).promise();

      io.emit('reviewUpdated');

      res.statusCode = 200;
      res.json(result.Attributes);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to update review" });
    }
  })
  /**
   * Rota para excluir uma avaliação específica.
   * 
   * @name DELETE /reviews/:id
   * @function
   * @memberof module:routes/reviews
   */
  .delete(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const params = {
        TableName: 'CargoshopReviews',
        Key: {
          id: req.params.id
        }
      };

      await dynamoDB.delete(params).promise();
      io.emit('reviewUpdated');
      res.statusCode = 200;
      res.json({ id: req.params.id });
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to delete review" });
    }
  });

module.exports = router;