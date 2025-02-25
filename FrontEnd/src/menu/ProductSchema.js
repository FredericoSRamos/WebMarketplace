/**
 * Esquema de validação para os dados do produto.
 * 
 * Este esquema valida as informações necessárias para cadastrar ou atualizar um produto, incluindo nome, descrição, preço, categoria e vendedor.
 * Ele utiliza a biblioteca `yup` para validação.
 * 
 * @module menu/ProductSchema
 */
import { number, object, setLocale, string } from "yup";
import { ptForm } from "yup-locale-pt";

// Define o locale para a validação de mensagens em português.
setLocale(ptForm);

/**
 * Este esquema valida os dados de um produto.
 * 
 * @type {object} 
 * @property {string} name - Nome do produto.
 *   - Deve ser preenchido (obrigatório).
 *   - Não pode exceder 100 caracteres.
 *   - Valor padrão é uma string vazia ("").
 * 
 * @property {string} description - Descrição do produto.
 *   - Deve ser preenchido (obrigatório).
 *   - Não pode exceder 300 caracteres.
 *   - Valor padrão é uma string vazia ("").
 * 
 * @property {number} price - Preço do produto.
 *   - Deve ser preenchido (obrigatório).
 *   - Deve ser um número válido.
 *   - Valor padrão é 0.
 * 
 * @property {string} category - Categoria do produto.
 *   - Não é obrigatório.
 * 
 * @property {string} seller - Nome do vendedor.
 *   - Valor padrão é uma string vazia ("").
 */
export let productSchema = object().shape({
    name: string().required().max(100).default(""),
    description: string().required().max(300).default(""),
    price: number().required().typeError("Informe um preço válido.").default(0),
    category: string(),
    seller: string().default("")
});
