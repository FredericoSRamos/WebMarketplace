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
 * Route to list all products or create a new product.
 * 
 * @name GET /products
 * @function
 * @memberof module:routes/products
 */
router.route('/')
  .get(async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const params = {
        TableName: 'CargoshopProducts'
      };
      const data = await dynamoDB.scan(params).promise();
      res.statusCode = 200;
      res.json(data.Items);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to retrieve products" });
    }
  })
  /**
   * Route to create a new product.
   * 
   * @name POST /products
   * @function
   * @memberof module:routes/products
   */
  .post(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const newProduct = {
        id: uuidv4(),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        seller: req.body.seller,
        image: req.body.image,
      };

      const params = {
        TableName: 'CargoshopProducts',
        Item: newProduct
      };
      await dynamoDB.put(params).promise();

      io.emit('productUpdated');
      res.statusCode = 200;
      res.json(newProduct);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to create product" });
    }
  });

/**
 * Route to access, update, or delete a specific product.
 * 
 * @name GET /products/:id
 * @function
 * @memberof module:routes/products
 */
router.route('/:id')
  .get(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const params = {
        TableName: 'CargoshopProducts',
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
        res.json({ error: "Product not found" });
      }
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to get product" });
    }
  })
  /**
   * Route to update a specific product.
   * 
   * @name PUT /products/:id
   * @function
   * @memberof module:routes/products
   */
  .put(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const params = {
        TableName: 'CargoshopProducts',
        Key: {
          id: req.params.id
        },
        UpdateExpression: 'set #name = :name, #price = :price, #description = :description, #category = :category, #seller = :seller, #image = :image',
        ExpressionAttributeNames: {
          '#name': 'name',
          '#price': 'price',
          '#description': 'description',
          '#category': 'category',
          '#seller': 'seller',
          '#image': 'image'
        },
        ExpressionAttributeValues: {
          ':name': req.body.name,
          ':price': req.body.price,
          ':description': req.body.description,
          ':category': req.body.category,
          ':seller': req.body.seller,
          ':image': req.body.image
        },
        ReturnValues: 'ALL_NEW'
      };

      const result = await dynamoDB.update(params).promise();
      io.emit('productUpdated');
      res.statusCode = 200;
      res.json(result.Attributes);
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to update product" });
    }
  })
  /**
   * Route to delete a specific product.
   * 
   * @name DELETE /products/:id
   * @function
   * @memberof module:routes/products
   */
  .delete(authenticate.verifyUser, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const params = {
        TableName: 'CargoshopProducts',
        Key: {
          id: req.params.id
        }
      };

      await dynamoDB.delete(params).promise();
      io.emit('productUpdated');
      res.statusCode = 200;
      res.json({ id: req.params.id });
    } catch (err) {
      console.log(err);
      res.statusCode = 500;
      res.json({ error: "Failed to delete product" });
    }
  });

module.exports = router;