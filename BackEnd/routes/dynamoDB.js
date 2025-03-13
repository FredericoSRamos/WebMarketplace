const AWS = require('aws-sdk');
var config = require('../config');

AWS.config.update({
  region: "us-east-2",
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDB;