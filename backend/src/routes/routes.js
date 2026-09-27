const express = require('express');
const usuarioRoutes = require('./UsuarioRoutes');

const router = express.Router();

router.use('/usuarios', usuarioRoutes);

module.exports = router;