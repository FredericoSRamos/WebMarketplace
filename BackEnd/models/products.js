/**
 * Mongoose schema for the Product model. 
 * This schema defines the structure of the product data stored in the database,
 * including details about the product's name, price, description, category, seller, and image.
 * 
 * @module models/products
 */

var mongoose = require('mongoose');
var normalize = require('normalize-mongoose');

/**
 * The Product schema defines the structure of the data associated with products in the system.
 * It contains fields for the product name, price, description, category, seller, and product image.
 * 
 * @constructor
 * @param {Object} product - The product data.
 * @param {string} product.name - The name of the product. This is a required field.
 * @param {number} product.price - The price of the product. This is a required field.
 * @param {string} product.description - A detailed description of the product. This is a required field.
 * @param {string} product.category - The category to which the product belongs. This is a required field.
 * @param {string} product.seller - The name or identifier of the seller offering the product. This is a required field.
 * @param {string} product.image - A URL or path to the product image. This is a required field.
 */
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    seller: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

/**
 * The normalize plugin is applied to the schema to ensure consistent formatting and behavior
 * of the schema's data when interacting with the database. This helps in maintaining a uniform
 * field naming convention and data structure across the application.
 * 
 * @function
 */
productSchema.plugin(normalize);

/**
 * The Products model is created using the Mongoose schema and will represent the Product collection in the database.
 * This model provides methods to interact with the database such as creating, reading, updating, and deleting products.
 * It allows for storing and retrieving product details, including information about pricing, category, and seller.
 * 
 * @type {mongoose.Model}
 */
var Products = mongoose.model('Product', productSchema);

// Export the Products model to be used in other parts of the application.
module.exports = Products;
