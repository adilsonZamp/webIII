const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController');
const { autenticar, autorizar } = require('../middleware/AuthMiddleware');

//publicas
router.post('/criar', usuarioController.novoUsuario);

//protegidas
router.get('/', autenticar, usuarioController.buscarUsuarios);
router.get('/buscar/:id', autenticar, usuarioController.buscarUsuarioPorID);
router.post("/excluir/:id", autenticar, autorizar('admin'), usuarioController.deletarUsuario);
router.patch('/:id', autenticar, usuarioController.alterarUsuario);

module.exports = router;