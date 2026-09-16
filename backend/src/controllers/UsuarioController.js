const usuariosService = require('../services/UsuarioService')

const buscarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.obterTodosUsuarios()
        res.status(200).json({data: usuarios})
    } catch (error) {
        res.status(500).json({error: "Erro interno no servidor"})
    }
}

module.exports = {
    buscarUsuarios
}