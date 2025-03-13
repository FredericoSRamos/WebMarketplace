/**
 * Roteador de autenticação para registro, login e logout de usuários.
 * 
 * @module routes/users
 */

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const dynamoDB = require('../routes/dynamoDB');
const bcrypt = require('bcrypt');

router.use(bodyParser.json());

/**
 * Rota para o registro de um novo usuário.
 * 
 * @name POST /signup
 * @function
 * @memberof module:routes/users
 */
router.post('/signup', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username: username,
            password: hashedPassword,
            admin: false,
        };

        const params = {
            TableName: 'CargoshopUsers',
            Item: newUser,
        };

        await dynamoDB.put(params).promise();

        const token = authenticate.getToken({ username: username, admin: false });

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ username: username, token: token });
    } catch (err) {
        console.log(err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ message: err.message || 'Falha no registro' });
    }
});

/**
 * Rota para realizar o login de um usuário.
 * 
 * @name POST /login
 * @function
 * @memberof module:routes/users
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const params = {
            TableName: 'CargoshopUsers',
            Key: { username: username },
        };

        const data = await dynamoDB.get(params).promise();

        if (!data.Item) {
            return res.status(401).json({ message: 'Usuário ou senha incorretos!' });
        }

        const user = data.Item;

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Usuário ou senha incorretos!' });
        }

        const token = authenticate.getToken({ username: user.username, admin: user.admin });

        res.status(200).json({
            username: user.username,
            token: token,
            admin: user.admin,
        });
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
 */
router.get('/logout', (req, res) => {
    res.status(200).json({ message: "Deslogado com sucesso!" });
});

module.exports = router;