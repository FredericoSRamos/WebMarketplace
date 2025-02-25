/**
 * Esquema de validação para os dados do pedido.
 * @module Pedidos/PedidoSchema
 */
import { object, setLocale, string } from "yup";
import { ptForm } from "yup-locale-pt";
setLocale(ptForm);


/**
 * Este esquema valida os dados relacionados ao endereço do pedido
 * 
 * @type {object} 
 * @property {string} endereco - O endereço do pedido.
 *   - Deve ser preenchido (obrigatório).
 *   - Deve conter no máximo 200 caracteres.
 *   - Deve conter no mínimo 10 caracteres.
 */

export let PedidoSchema = object().shape({
  endereco: string().required("Campo endereço é obrigatório").max(200, "O endereço pode ter no máximo 200 caracteres.")
    .min(10, "O endereço deve ter pelo menos 10 caracteres."),
});