/**
 * Roteador de autenticação para registro, login e logout de usuários.
 * 
 * @module routes/users
 */

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const authenticate = require('../authenticate');
const Users = require('../models/users');

// Middleware para uso do bodyParser
router.use(bodyParser.json());

/**
 * Rota para o registro de um novo usuário.
 * 
 * @name POST /signup
 * @function
 * @memberof module:routes/users
 * @param {Object} req - O objeto de requisição HTTP contendo os dados do novo usuário (username e password).
 * @param {Object} res - O objeto de resposta HTTP.
 * @returns {Object} Retorna um JSON contendo o nome de usuário, ID e token de autenticação.
 */
router.post('/signup', (req, res, next) => {
    Users.register(new Users({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ message: err.message || 'Falha no registro' });
        } else {
            const token = authenticate.getToken({ _id: user._id });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ username: user.username, id: user._id, token: token });
        }
    });
});

/**
 * Rota para realizar o login de um usuário.
 * 
 * @name POST /login
 * @function
 * @memberof module:routes/users
 * @param {Object} req - O objeto de requisição HTTP com o nome de usuário e senha.
 * @param {Object} res - O objeto de resposta HTTP.
 * @returns {Object} Retorna um JSON contendo o nome de usuário, ID, token de autenticação e se o usuário é administrador.
 */
router.post('/login', async (req, res) => {
    try {
        const user = await Users.findOne({ username: req.body.username });

        if (!user || (await user.authenticate(req.body.password)).user === false) {
            return res.status(401).json({ message: 'Usuário ou senha incorretos!' });
        }

        const token = authenticate.getToken({ _id: user._id });

        res.status(200).json({ username: user.username, id: user._id, token: token, admin: user.admin });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

/**
 * Rota para realizar o logout de um usuário.
 * 
 * @name GET /logout
 * @function
 * @memberof module:routes/users
 * @param {Object} req - O objeto de requisição HTTP.
 * @param {Object} res - O objeto de resposta HTTP.
 * @returns {Object} Retorna uma mensagem de sucesso de logout.
 */
router.get('/logout', (req, res) => {
    res.status(200).json({ message: "Deslogado com sucesso!" });
});

module.exports = router;
