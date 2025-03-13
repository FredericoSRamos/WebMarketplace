var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const dynamoDB = require('../routes/dynamoDB');
var authenticate = require('../authenticate');
const { getIo } = require('../socket');
const { v4: uuidv4 } = require('uuid');

const io = getIo();

router.use(bodyParser.json());

/**
 * List all orders or create a new order
 * 
 * GET /pedidos and POST /pedidos
 */
router.route('/')
  .get(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const params = {
        TableName: 'CargoshopOrders',
      };

      const data = await dynamoDB.scan(params).promise();
      res.statusCode = 200;
      res.json(data.Items);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to retrieve orders" });
    }
  })
  .post(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const newOrder = {
        id: uuidv4(),
        endereco: req.body.endereco,
        opcaoEnvio: req.body.opcaoEnvio,
        formaPagamento: req.body.formaPagamento,
        idProduto: req.body.idProduto,
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        NomeVendedor: req.body.NomeVendedor,
        comprador: req.body.comprador,
        status: req.body.status,
      };

      const params = {
        TableName: 'CargoshopOrders',
        Item: newOrder,
      };

      await dynamoDB.put(params).promise();
      io.emit('pedidoUpdated');
      res.statusCode = 200;
      res.json(newOrder);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to create order" });
    }
  });

/**
 * Get, update, or delete a specific order by its ID
 * 
 * GET /pedidos/:id, PUT /pedidos/:id, DELETE /pedidos/:id
 */
router.route('/:id')
  .get(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const params = {
        TableName: 'CargoshopOrders',
        Key: {
          id: req.params.id,
        },
      };

      const data = await dynamoDB.get(params).promise();
      if (data.Item) {
        res.statusCode = 200;
        res.json(data.Item);
      } else {
        res.statusCode = 404;
        res.json({ error: "Order not found" });
      }
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to retrieve order" });
    }
  })
  .put(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const params = {
        TableName: 'CargoshopOrders',
        Key: {
          id: req.params.id,
        },
        UpdateExpression: 'set #endereco = :endereco, #opcaoEnvio = :opcaoEnvio, #formaPagamento = :formaPagamento, #name = :name, #price = :price, #image = :image, #NomeVendedor = :NomeVendedor, #comprador = :comprador, #status = :status',
        ExpressionAttributeNames: {
          '#endereco': 'endereco',
          '#opcaoEnvio': 'opcaoEnvio',
          '#formaPagamento': 'formaPagamento', 
          '#name': 'name',
          '#price': 'price',
          '#image': 'image',
          '#NomeVendedor': 'NomeVendedor',
          '#comprador': 'comprador',
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':endereco': req.body.endereco,
          ':opcaoEnvio': req.body.opcaoEnvio,
          ':formaPagamento': req.body.formaPagamento,
          ':name': req.body.name,
          ':price': req.body.price,
          ':image': req.body.image,
          ':NomeVendedor': req.body.NomeVendedor,
          ':comprador': req.body.comprador,
          ':status': req.body.status,
        },
        ReturnValues: 'ALL_NEW',
      };

      const data = await dynamoDB.update(params).promise();

      io.emit('pedidoUpdated'); 

      res.statusCode = 200;
      res.json(data.Attributes);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to update order" });
    }
  })
  .delete(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const params = {
        TableName: 'CargoshopOrders',
        Key: {
          id: req.params.id,
        },
      };

      const data = await dynamoDB.delete(params).promise();
      io.emit('pedidoUpdated');
      res.statusCode = 200;
      res.json({ id: req.params.id });
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to delete order" });
    }
  });

module.exports = router;