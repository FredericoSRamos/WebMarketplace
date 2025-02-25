/**
 * Mongoose schema for the Review model. 
 * This schema defines the structure of the review data stored in the database,
 * including details about the review message, rating, related order, and the buyer and seller involved.
 * 
 * @module models/reviews
 */

var mongoose = require('mongoose');
var normalize = require('normalize-mongoose');

/**
 * The Review schema defines the structure of the data associated with customer reviews.
 * It contains fields for the review message, rating, order ID, and the identities of the buyer and seller.
 * 
 * @constructor
 * @param {Object} review - The review data.
 * @param {string} review.message - The content of the review message. This is a required field.
 * @param {number} review.rate - The rating given by the buyer, typically on a scale from 1 to 5. This is a required field.
 * @param {mongoose.Types.ObjectId} review.orderId - The ID of the related order, referencing a specific 'Pedido' document.
 * @param {string} review.seller - The name or identifier of the seller being reviewed. This is a required field.
 * @param {string} review.buyer - The name or identifier of the buyer leaving the review. This is a required field.
 */
const reviewSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pedido'  // References the 'Pedido' model, linking the review to a specific order.
    },
    seller: {
        type: String,
        required: true
    },
    buyer: {
        type: String,
        required: true
    }
});

/**
 * The normalize plugin is applied to the schema to ensure consistent formatting and behavior
 * of the schema's data when interacting with the database. This can help in maintaining
 * uniform field names and data structure throughout the application.
 * 
 * @function
 */
reviewSchema.plugin(normalize);

/**
 * The Reviews model is created using the Mongoose schema and will represent the Review collection in the database.
 * This model provides methods to interact with the database such as creating, reading, updating, and deleting reviews.
 * It allows for storing and retrieving reviews related to orders, including associating them with the buyer and seller.
 * 
 * @type {mongoose.Model}
 */
var Reviews = mongoose.model('Review', reviewSchema);

// Export the Reviews model to be used in other parts of the application.
module.exports = Reviews;
