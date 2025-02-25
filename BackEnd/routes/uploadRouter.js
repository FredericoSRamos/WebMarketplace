/**
 * Roteador para o upload de imagens.
 * Permite o envio de imagens (somente tipos `.jpg`, `.jpeg`, `.png`, `.gif`).
 * Apenas usuários autenticados, com permissões de administrador, podem acessar as rotas de upload.
 * 
 * @module routes/uploadRouter
 */

const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');

// Configuração do armazenamento do multer (onde as imagens serão salvas)
const storage = multer.diskStorage({
    /**
     * Define o diretório de destino para o upload das imagens.
     * 
     * @param {Object} req - O objeto de requisição HTTP.
     * @param {Object} file - O arquivo enviado.
     * @param {Function} cb - Função de callback para definir o destino.
     */
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Diretório onde as imagens serão armazenadas
    },
    /**
     * Define o nome do arquivo a ser salvo.
     * 
     * @param {Object} req - O objeto de requisição HTTP.
     * @param {Object} file - O arquivo enviado.
     * @param {Function} cb - Função de callback para definir o nome do arquivo.
     */
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Usa o nome original do arquivo
    }
});

// Filtro para garantir que apenas imagens sejam enviadas
const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false); // Erro se o arquivo não for uma imagem
    }
    cb(null, true); // Aceita o arquivo se for uma imagem
};

// Criação da instância do multer com as configurações de armazenamento e filtro
const upload = multer({ storage: storage, fileFilter: imageFileFilter });

// Definição do roteador para uploads de imagens
const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

/**
 * Rota para manipular as imagens enviadas via POST.
 * 
 * @name POST /imageUpload
 * @function
 * @memberof module:routes/uploadRouter
 * @param {Object} req - O objeto de requisição HTTP que contém o arquivo de imagem.
 * @param {Object} res - O objeto de resposta HTTP.
 * @returns {Object} Retorna os dados do arquivo enviado no formato JSON.
 */
uploadRouter.route('/')
    .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /imageUpload');
    })
    /**
     * Rota para realizar o upload de uma imagem.
     * Requer que o usuário esteja autenticado.
     * 
     * @name POST /imageUpload
     * @function
     * @memberof module:routes/uploadRouter
     * @param {Object} req - O objeto de requisição HTTP que contém o arquivo de imagem.
     * @param {Object} res - O objeto de resposta HTTP.
     * @returns {Object} Retorna os dados do arquivo enviado no formato JSON.
     */
    .post(authenticate.verifyUser, upload.single('imageFile'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file); // Retorna os dados do arquivo enviado
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /imageUpload');
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /imageUpload');
    });

module.exports = uploadRouter;
