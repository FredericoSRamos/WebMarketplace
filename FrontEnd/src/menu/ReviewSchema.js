/**
 * Define o esquema de validação para as avaliações utilizando a biblioteca Yup.
 * O esquema valida os campos de "nota" (rate) e "mensagem" (message) de uma avaliação.
 * Também define valores padrão para os campos "vendedor" (seller) e "comprador" (buyer).
 * Utiliza a configuração de locale em português (pt-BR) para mensagens de erro personalizadas.
 * 
 * @module menu/ReviewSchema
 */
import { number, object, setLocale, string } from "yup";
import { ptForm } from "yup-locale-pt";

// Configura o locale para português (pt-BR) nas mensagens de erro.
setLocale(ptForm);

/**
 * Esquema de validação para uma avaliação.
 * @type {object}
 * @property {number} rate - A nota da avaliação, um número entre 0 e 10.
 * @property {string} message - A mensagem do comprador sobre o produto ou serviço.
 * @property {string} seller - O nome do vendedor, usado para preencher automaticamente.
 * @property {string} buyer - O nome do comprador, usado para preencher automaticamente.
 */
export let reviewSchema = object().shape({
    rate: number()
        .required("A nota é obrigatória.")  // Mensagem personalizada caso a nota não seja preenchida.
        .min(0, "A nota deve ser maior ou igual a 0.")  // Validação para mínimo de 0.
        .max(10, "A nota deve ser menor ou igual a 10.")  // Validação para máximo de 10.
        .default(0)  // Define o valor padrão para 0 caso não seja fornecido.
        .typeError("Insira uma nota válida."),  // Mensagem de erro personalizada se o valor não for um número.
    message: string()
        .required("A mensagem é obrigatória.")  // Mensagem obrigatória do comprador.
        .max(300, "A mensagem deve ter no máximo 300 caracteres.")  // Validação do comprimento máximo da mensagem.
        .default(""),  // Define o valor padrão como uma string vazia caso não seja preenchido.
    seller: string()
        .default(""),  // Valor padrão para o vendedor (não obrigatório).
    buyer: string()
        .default("")  // Valor padrão para o comprador (não obrigatório).
});
