const { OAuth2Client } = require('google-auth-library')
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const loginComGoogle = async (credential) => {
    // 1) Verifica a assinatura do token com as chaves públicas do Google
    const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,   // confere se o token é PARA NÓS
    });

    const payload = ticket.getPayload();
    const { sub, email, name, email_verified } = payload;

    // console.log(payload);
    

    if (!email_verified) {
        throw new Error('EMAIL_NAO_VERIFICADO');
    }

    // 2) Procura o usuário: primeiro pelo google_id, depois pelo email
    let usuario = await Usuario.findOne({ where: { google_id: sub } });

    if (!usuario) {
        usuario = await Usuario.findOne({ where: { email } });

        if (usuario) {
            // Já existia com senha -> vincula a conta do Google
            usuario.google_id = sub;
            await usuario.save();
        } else {
            // Primeiro acesso -> cria sem senha
            usuario = await Usuario.create({
                nome: name, email, google_id: sub, perfil: 'aluno'
            });
        }
    }

    if (!usuario.foto && picture) {
        usuario.foto = picture;
        await usuario.save();
    }

    // 3) Emite o NOSSO token, igual ao login por senha
    const token = jwt.sign(
        { id: usuario.id, perfil: usuario.perfil },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return { token, usuario: { id: usuario.id, nome: usuario.nome, foto: usuario.foto } };
};

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

module.exports = { login, loginComGoogle };