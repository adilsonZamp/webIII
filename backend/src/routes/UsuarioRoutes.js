const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController');
 
router.get('/', usuarioController.buscarUsuarios);
router.get('/buscar/:id', usuarioController.buscarUsuarioPorID);
router.post('/criar', usuarioController.novoUsuario);
router.post("/excluir/:id", usuarioController.deletarUsuario);
router.patch('/:id', usuarioController.alterarUsuario);

module.exports = router;