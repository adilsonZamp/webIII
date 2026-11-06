const express = require('express');
const usuarioRoutes = require('./UsuarioRoutes');
const AuthController = require('../controllers/AuthController');
const ClimaController = require('../controllers/ClimaController');

const router = express.Router();

router.use('/usuarios', usuarioRoutes);
router.post('/login', AuthController.login);

router.post('/auth/google', AuthController.loginGoogle);
router.get('/clima', ClimaController.buscarClimaAtual);

module.exports = router;