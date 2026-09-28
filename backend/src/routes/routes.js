const express = require('express');
const usuarioRoutes = require('./UsuarioRoutes');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

router.use('/usuarios', usuarioRoutes);
router.post('/login', AuthController.login);

module.exports = router;