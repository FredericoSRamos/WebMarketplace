var express = require('express');
var path = require('path');
var logger = require('morgan');
var passport = require('passport');

const cors = require('./routes/cors');

const { setupSocket } = require('./socket');

var app = express();
var http = require('http');

var server = http.createServer(app);

setupSocket(server);

var productsRouter = require('./routes/products');
var pechinchasRouter = require('./routes/pechinchas');
var pedidosRouter = require('./routes/pedidos');
var reviewsRouter = require('./routes/reviews');
var usersRouter = require('./routes/users');
const uploadRouter = require('./routes/uploadRouter');

// Configuração de CORS
app.use(cors.corsWithOptions);
app.options('*', cors.corsWithOptions);

// Configuração de middlewares
app.use(logger('dev')); // Logger de requisições HTTP
app.use(express.json()); // Parser para dados JSON
app.use(express.urlencoded({ extended: false })); // Parser para dados URL-encoded

// Inicialização do Passport (para autenticação)
app.use(passport.initialize());

// Configuração de rotas
app.use('/users', usersRouter);
app.use(express.static(path.join(__dirname, 'public'))); // Pasta pública para arquivos estáticos
app.use('/images', express.static(path.join(__dirname, 'public/images'))); // Rota para imagens

// Definição das rotas principais
app.use('/products', productsRouter);
app.use('/pechinchas', pechinchasRouter);
app.use('/pedidos', pedidosRouter);
app.use('/reviews', reviewsRouter);
app.use('/imageUpload', uploadRouter);

server.listen(5000, () => {});

module.exports = app;
