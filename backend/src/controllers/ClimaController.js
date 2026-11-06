const climaService = require('../services/ClimaService');

const buscarClimaAtual = async (req, res) => {
    try {
        const clima = await climaService.buscarClima();
        return res.status(200).json(clima);
    } catch (error) {
        console.error('Erro ao buscar e salvar clima:', error);
        return res.status(error.statusCode || 500).json({
            err: error.statusCode === 502
                ? 'Não foi possível obter os dados da Open-Meteo.'
                : 'Não foi possível salvar as condições atuais do tempo.',
        });
    }
};

module.exports = { buscarClimaAtual };
