/**
 * Define as rotas de manipulação de pechinchas, permitindo operações CRUD (Create, Read, Update, Delete) em pechinchas.
 * As rotas são protegidas por autenticação, sendo necessário que o usuário esteja autenticado para acessar os endpoints.
 * 
 * @module routes/pechinchas
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
 * Rota para listar todas as pechinchas ou criar uma nova pechincha.
 * 
 * @name GET /pechinchas
 * @function
 * @memberof module:routes/pechinchas
 */
router.route('/')
  .get(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const params = {
        TableName: 'CargoshopPechinchas'
      };

      const data = await dynamoDB.scan(params).promise();
      res.statusCode = 200;
      res.json(data.Items);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to retrieve pechinchas" });
    }
  })
  /**
   * Rota para criar uma nova pechincha.
   * 
   * @name POST /pechinchas
   * @function
   * @memberof module:routes/pechinchas
   */
  .post(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const productParams = {
        TableName: 'CargoshopProducts',
        Key: {
          id: req.body.idProduct
        }
      };
      const data = (await dynamoDB.get(productParams).promise()).Item;
      const newPechincha = {
        id: uuidv4(),
        productId: data.id,
        discount: req.body.descount,
        image: data.image,
        price: data.price,
        buyer: req.body.buyer,
        seller: data.seller,
        pstatus: req.body.pstatus
      };

      const params = {
        TableName: 'CargoshopPechinchas',
        Item: newPechincha
      };
      await dynamoDB.put(params).promise();

      io.emit('pechinchaUpdated');
      res.statusCode = 200;
      res.json(newPechincha);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to create pechincha" });
    }
  });

/**
 * Rota para acessar, atualizar ou excluir uma pechincha específica.
 * 
 * @name GET /pechinchas/:id
 * @function
 * @memberof module:routes/pechinchas
 */
router.route('/:id')
  .get(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const params = {
        TableName: 'CargoshopPechinchas',
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
        res.json({ error: "Pechincha not found" });
      }
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to get pechincha" });
    }
  })
  /**
   * Rota para atualizar uma pechincha específica.
   * 
   * @name PUT /pechinchas/:id
   * @function
   * @memberof module:routes/pechinchas
   */
  .put(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const pechinchaId = req.params.id;

      const { productId, discount, price, buyer, seller, pstatus } = req.body;

      const productParams = {
        TableName: 'CargoshopProducts',
        Key: {
          id: productId
        }
      };

      const productData = (await dynamoDB.get(productParams).promise()).Item;
      if (!productData) {
        res.statusCode = 404;
        return res.json({ error: "Product not found" });
      }

      const params = {
        TableName: 'CargoshopPechinchas',
        Key: {
          id: pechinchaId
        },
        UpdateExpression: 'set productId = :productId, discount = :discount, price = :price, buyer = :buyer, seller = :seller, image = :image, pstatus = :pstatus',
        ExpressionAttributeValues: {
          ':productId': productId,
          ':discount': discount,
          ':price': price,
          ':buyer': buyer,
          ':seller': seller,
          ':image': productData.image,
          ':pstatus': pstatus
        },
        ReturnValues: 'ALL_NEW'
      };

      const result = await dynamoDB.update(params).promise();

      io.emit('pechinchaUpdated');

      res.statusCode = 200;
      res.json(result.Attributes);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to update pechincha" });
    }
  })
  /**
   * Rota para excluir uma pechincha específica.
   * 
   * @name DELETE /pechinchas/:id
   * @function
   * @memberof module:routes/pechinchas
   */
  .delete(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const params = {
        TableName: 'CargoshopPechinchas',
        Key: {
          id: req.params.id
        }
      };

      await dynamoDB.delete(params).promise();
      io.emit('pechinchaUpdated');
      res.statusCode = 200;
      res.json({ id: req.params.id });
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to delete pechincha" });
    }
  });

module.exports = router;