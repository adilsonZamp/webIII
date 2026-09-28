const { where } = require('sequelize');
const Usuario = require('../models/Usuario');

const obterTodosUsuarios = async () => {
    return await Usuario.findAll({ attributes: { exclude: ['senha'] } });
};

const inserirUsuario = async (nome, email, senha) => {
    return await Usuario.create({ nome, email, senha });
}

const buscarUsuarioPorID = async (id) => {
    return await Usuario.findByPk(id, { attributes: { exclude: ['senha'] } });
}

const deletarUsuario = async (id) => {
    return await Usuario.destroy({ where: { id } });
}

const alterarUsuario = async (id, dados) => {
    const [alterados] = await Usuario.update(dados, { where: { id } });

    return alterados;
};

module.exports = { obterTodosUsuarios, inserirUsuario, buscarUsuarioPorID, deletarUsuario, alterarUsuario }