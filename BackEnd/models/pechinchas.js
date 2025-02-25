/**
 * Mongoose schema for the Pechincha model.
 * This schema defines the structure of the pechincha (bargain) data stored in the database,
 * including details about the discount, buyer, seller, related product, image, and status of the deal.
 * 
 * @module models/pechinchas
 */

var mongoose = require('mongoose');
var normalize = require('normalize-mongoose');

/**
 * The Pechincha schema defines the structure of the data associated with a bargain or discount offer.
 * It contains fields for the discount value, buyer and seller information, a reference to the related product,
 * the image associated with the offer, and the current status of the bargain (e.g., pending, accepted, etc.).
 * 
 * @constructor
 * @param {Object} pechincha - The bargain offer data.
 * @param {number} pechincha.descount - The discount percentage or value offered. This is a required field.
 * @param {string} pechincha.buyer - The name or identifier of the buyer interested in the product. This is a required field.
 * @param {string} pechincha.seller - The name or identifier of the seller offering the discount. This is a required field.
 * @param {mongoose.Types.ObjectId} pechincha.idProduct - The ID of the related product being offered at a discount.
 * @param {string} pechincha.image - A URL or path to the image representing the product or offer. This is a required field.
 * @param {string} [pechincha.status="pendente"] - The current status of the bargain. Default is "pendente" (pending).
 *                                              The status helps track whether the offer is still under negotiation or has been finalized.
 */
const pechinchaSchema = new mongoose.Schema({
    descount: {
        type: Number,
        required: true
    },
    buyer: {
        type: String,
        required: true
    },
    seller: {
        type: String,
        required: true
    },
    idProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'  // References the 'Product' model, linking the bargain to a specific product.
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pendente'  // Default status is 'pendente' (pending), indicating the deal is yet to be completed.
    }
});

/**
 * The normalize plugin is applied to the schema to ensure consistent formatting and behavior
 * of the schema's data when interacting with the database. It helps in managing the data structure
 * and keeps the field names and types consistent across the application.
 * 
 * @function
 */
pechinchaSchema.plugin(normalize);

/**
 * The Pechinchas model is created using the Mongoose schema and will represent the Pechincha collection in the database.
 * This model provides methods to interact with the database such as creating, reading, updating, and deleting pechinchas.
 * It allows for tracking and managing discount offers between buyers and sellers, linking them to specific products and their status.
 * 
 * @type {mongoose.Model}
 */
var Pechinchas = mongoose.model('Pechincha', pechinchaSchema);

// Export the Pechinchas model to be used in other parts of the application.
module.exports = Pechinchas;
