/**
 * Esquema de validação para o login, utilizando o Yup.
 * @module users/LoginSchema
 */
import { object, setLocale, string } from "yup";
import { ptForm } from "yup-locale-pt";

setLocale(ptForm);

/**
 * O schema define as regras de validação para o nome de usuário e a senha:
 * - O nome de usuário deve ser uma string com pelo menos 4 caracteres e no máximo 40.
 * - A senha deve ser uma string com pelo menos 8 caracteres e no máximo 20.
 * @constant
 * @type {Object}
 */
export let loginSchema = object().shape({
    username: string().required().min(4).max(40).default(""),
    password: string().required().min(8).max(20).default("")
});
