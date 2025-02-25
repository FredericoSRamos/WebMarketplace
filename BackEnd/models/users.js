/**
 * Mongoose schema for the User model, designed to work with Passport Local Mongoose.
 * This schema defines the structure of the user data stored in the database, including 
 * authentication-related fields and any custom user properties.
 * @module models/users
 */

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

/**
 * The User schema defines the structure of the data that will be stored in the User collection.
 * It includes fields for authentication (like username and password) provided by Passport Local Mongoose.
 * Additionally, it includes a custom field for determining if the user has administrative privileges.
 * 
 * @constructor
 * @param {Object} user - The data related to the user.
 * @param {boolean} [user.admin=false] - A flag indicating whether the user has admin privileges. 
 *                                      Default value is `false` meaning the user is not an admin.
 *                                      This field helps in managing user access control within the application.
 */
var userSchema = new Schema({
    admin: {
        type: Boolean,
        default: false
    }
});

/**
 * This plugin integrates the Passport Local Mongoose functionality into the User schema.
 * It automatically adds fields for username, password, and methods to handle user authentication,
 * such as hashing and verification of passwords. This integration simplifies user management.
 * 
 * @function
 */
userSchema.plugin(passportLocalMongoose);

/**
 * The User model is created using the Mongoose schema and will represent the User collection in the database.
 * The model provides methods to interact with the database such as creating, reading, updating, and deleting users,
 * and also handles user authentication via Passport Local Mongoose.
 * 
 * @type {mongoose.Model}
 */
var Users = mongoose.model('User', userSchema);

// Export the Users model to be used in other parts of the application.
module.exports = Users;
