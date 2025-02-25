/**
 * Esquema de validação para os dados do pagamento.
 * @module Pedidos/PagamentoSchema
 */
import { object, setLocale, string } from "yup";
import { ptForm } from "yup-locale-pt";
setLocale(ptForm);

/**
 * Este esquema valida os dados relacionados ao pagamento, incluindo
 * o endereço, a opção de envio e a forma de pagamento.
 * 
 * @type {object}
 * @property {string} endereco - O endereço do pagamento.
 *   - Deve ser preenchido (obrigatório).
 *   - Deve conter no mínimo 12 caracteres.
 * @property {string} opcaoEnvio - A opção de envio escolhida.
 *   - Deve ser preenchida (obrigatório).
 * @property {string} formaPagamento - A forma de pagamento escolhida.
 *   - Deve ser preenchida (obrigatório).
 */
export let PagamentoSchema  = object().shape({
    endereco: string().min(12, "O endereço deve ter no mínimo 12 caracteres"),
    opcaoEnvio: string().required("Selecione uma opção de envio."),
    formaPagamento: string().required("Selecione uma forma de pagamento."),
  });