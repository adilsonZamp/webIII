const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

const login = async (email, senha) => {
    const usuario = await Usuario.scope('comSenha').findOne({ where: { email } });
    if (!usuario) throw new Error('CREDENCIAIS_INVALIDAS');

    const confere = await bcrypt.compare(senha, usuario.senha);
    if (!confere) throw new Error('CREDENCIAIS_INVALIDAS');

    const token = jwt.sign(
        { id: usuario.id, perfil: usuario.perfil },    // payload
        process.env.JWT_SECRET,                        // chave secreta
        { expiresIn: process.env.JWT_EXPIRES_IN }      // validade
    );

    return { token, usuario: { id: usuario.id, nome: usuario.nome } };
};

module.exports = { login };