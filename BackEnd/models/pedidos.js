/**
 * Exporta o modelo de pedidos.
 * 
 * @module models/pedidos
 */
var mongoose = require('mongoose');
var normalize = require('normalize-mongoose');

/**
 * Schema de Pedido para armazenar informações sobre pedidos realizados.
 *
 * @typedef {Object} Pedido
 * @property {string} endereco - Endereço de entrega do pedido.
 * @property {string} opcaoEnvio - Opção de envio escolhida para o pedido.
 * @property {string} formaPagamento - Forma de pagamento utilizada no pedido.
 * @property {mongoose.Schema.Types.ObjectId} idProduto - Referência ao ID do produto relacionado ao pedido.
 * @property {string} [name] - Nome do produto (opcional).
 * @property {number} [price] - Preço do produto (opcional).
 * @property {string} [image] - Imagem do produto (opcional).
 * @property {string} [NomeVendedor] - Nome do vendedor (opcional).
 * @property {string} [comprador] - Nome do comprador (opcional).
 * @property {string} [status] - Status do pedido (opcional).
 */

/**
 * Define o esquema de pedido.
 * 
 * O esquema define os campos para armazenar informações sobre o pedido, como endereço, opção de envio, 
 * forma de pagamento, entre outros, e utiliza o plugin normalize para tratar as validações do Mongoose.
 * 
 * @type {mongoose.Schema}
 */
const pedidoSchema = new mongoose.Schema({
    endereco: {
        type: String,
        required: true
    },
    opcaoEnvio: {
        type: String,
        required: true
    },
    formaPagamento: {
        type: String,
        required: true
    },
    idProduto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    name: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    NomeVendedor: {
        type: String,
        required: false
    },
    comprador: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    }
});

/**
 * Aplica o plugin normalize no esquema de pedido, que ajuda a normalizar as validações do Mongoose.
 */
pedidoSchema.plugin(normalize);

/**
 * Modelo de Pedido baseado no esquema `pedidoSchema`.
 * 
 * @type {mongoose.Model<Pedido>}
 */
var Pedidos = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedidos;
