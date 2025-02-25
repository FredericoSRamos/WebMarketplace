/**
 * Arquivo de configuração do Passport para autenticação de usuários
 * utilizando estratégias Local (login com username e senha) e JWT (autenticação baseada em token).
 */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Users = require('./models/users'); // Modelo de usuários
var JwtStrategy = require('passport-jwt').Strategy; // Estratégia JWT
var ExtractJwt = require('passport-jwt').ExtractJwt; // Extrair token JWT do cabeçalho
var jwt = require('jsonwebtoken'); // Biblioteca para gerar e verificar JWT

var config = require('./config'); // Configurações, incluindo chave secreta para JWT

// Usando a estratégia Local do Passport para autenticação de usuários
passport.use(new LocalStrategy(Users.authenticate())); // Autentica usuário com a estratégia local (username e senha)
passport.serializeUser(Users.serializeUser()); // Serializa o usuário
passport.deserializeUser(Users.deserializeUser()); // Desserializa o usuário

/**
 * Função para gerar um token JWT para um usuário.
 * 
 * @param {Object} user - O usuário para o qual o token será gerado
 * @returns {string} - Token JWT assinado
 */
exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 }); // Token expira em uma hora
};

var opts = {}; // Opções para a estratégia JWT
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // Extrai o token do cabeçalho "Authorization"
opts.secretOrKey = config.secretKey; // A chave secreta para verificar o token

// Usando a estratégia JWT do Passport para autenticação baseada em token
exports.jwtPassport = passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log("JWT payload: ", jwt_payload); // Debug: Exibe o conteúdo do JWT
    try {
        // Procurando o usuário no banco de dados com o id extraído do JWT
        const user = await Users.findOne({ _id: jwt_payload._id });
        if (user) {
            return done(null, user); // Usuário encontrado, autenticado
        } else {
            return done(null, false); // Usuário não encontrado, falha na autenticação
        }
    } catch (err) {
        return done(err, false); // Erro ao verificar o token ou usuário
    }
}));

/**
 * Middleware que verifica se o usuário está autenticado com JWT.
 * Ele rejeita a requisição se o token não for válido ou não estiver presente.
 */
exports.verifyUser = passport.authenticate('jwt', { session: false });

/**
 * Middleware que verifica se o usuário é um administrador.
 * Permite o acesso apenas para administradores.
 */
exports.verifyAdmin = (req, res, next) => {
    if (req.user && req.user.admin) {
        next(); // Se for admin, permite a execução do próximo middleware
    } else {
        var err = new Error('Apenas administradores podem realizar esta ação!'); // Mensagem de erro
        err.status = 403; // Status de "Proibido"
        return next(err); // Passa o erro para o próximo middleware (geralmente, um manipulador de erros)
    }
};
