const express = require('express');
const usuarioRoutes = require('./UsuarioRoutes');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

router.use('/usuarios', usuarioRoutes);
router.post('/login', AuthController.login);

router.post('/auth/google', AuthController.loginGoogle);

module.exports = router;