const Usuario = require('../models/Usuario');
const usuarioService = require('../services/usuarioService');
const bcrypt = require('bcrypt');

const buscarUsuarios = async (req, res) => {
	try {
		const usuarios = await usuarioService.obterTodosUsuarios();
		res.status(200).json({ data: usuarios });
	} catch (err) {
		res.status(500).json({ err: 'Erro interno ao buscar usuarios' });
	}
};

const novoUsuario = async (req, res) => {
	try {
		const { nome, email, senha } = req.body;

		if (!nome || !email || !senha) return res.status(400).json({ err: 'Dados inválidos' });

		const hash = await bcrypt.hash(senha, 10)

		const usuario = await usuarioService.inserirUsuario(nome, email, hash);
		res.status(201).json(usuario);
	} catch (err) {
		console.error(err);
		res.status(500).json({ err: 'Erro interno ao criar usuario' });
	}
};

const buscarUsuarioPorID = async (req, res) => {
	const { id } = req.params;

	try {
		const usuario = await usuarioService.buscarUsuarioPorID(id);

		if (!usuario) {
			return res.status(404).json({
				err: 'Usuário não encontrado'
			});
		}

		res.status(200).json(usuario);
	} catch (error) {
		console.error(error);
		res.status(500).json({ err: 'Erro interno ao buscar usuario' });
	}
};

const deletarUsuario = async (req, res) => {
	const { id } = req.params;

	try {
		const deletado = await usuarioService.deletarUsuario(id);

		if (deletado != 1) {
			return res.status(200).json("Usuario não deletado", deletado);
		}

		res.status(200).json("Usuario deletado");
	} catch (error) {
		console.error(error);
		res.status(500).json({ err: 'Erro interno ao deletar usuario' });
	}
}

const alterarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, senha } = req.body;

        const dados = {};

        if (nome !== undefined) dados.nome = nome;
        if (email !== undefined) dados.email = email;
        if (senha !== undefined) dados.senha = senha;

        if (Object.keys(dados).length === 0) {
            return res.status(400).json({
                err: 'Nenhum dado para alterar'
            });
        }

        const alterados = await usuarioService.alterarUsuario(id, dados);

        if (alterados === 0) {
            return res.status(404).json({
                err: 'Usuário não encontrado'
            });
        }

        return res.status(200).json({
            message: 'Usuário alterado com sucesso'
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            err: 'Erro interno ao alterar usuário'
        });
    }
};

module.exports = { buscarUsuarios, novoUsuario, buscarUsuarioPorID, deletarUsuario, alterarUsuario }