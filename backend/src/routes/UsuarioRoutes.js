const express = require('express')
const router = express.Router()
const usuarioController = require('../controllers/UsuarioController')

router.get('/usuarios', usuarioController.buscarUsuarios)

module.exports = router