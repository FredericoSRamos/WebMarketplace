/**
 * Esquema de validação para os dados da pechincha.
 * @module menu/PechinchaSchema
 */
import { number, object, setLocale, string } from "yup";
import { ptForm } from "yup-locale-pt";

// Define o locale para o idioma português
setLocale(ptForm);

/**
 * Este esquema valida os dados relacionados à pechincha.
 * 
 * @type {object} 
 * @property {number} descount - O valor do desconto oferecido pelo comprador.
 *   - Deve ser um número válido.
 *   - Deve ser obrigatório e ter um valor mínimo de 1.
 *   - Caso o valor não seja numérico, uma mensagem de erro será exibida.
 *   - O valor padrão é 0.
 * @property {string} buyer - O comprador da pechincha.
 *   - Este campo é uma string e por padrão está vazio.
 */
export let pechinchaSchema = object().shape({
    descount: number()
        .required("Informe uma pechincha válida.")  // Mensagem de erro personalizada
        .min(1, "O desconto deve ser no mínimo 1.")  // Valida o valor mínimo do desconto
        .typeError("Informe uma pechincha válida.")  // Mensagem de erro caso o tipo não seja numérico
        .default(0),  // Valor padrão é 0 caso o campo não seja preenchido

    buyer: string()
        .default(""),  // Valor padrão é uma string vazia caso o comprador não seja informado
});
