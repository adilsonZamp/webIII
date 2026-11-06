const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../instances/mysql');

class ClimaAtual extends Model { }

ClimaAtual.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        cidade: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        estado: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        pais: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DECIMAL(9, 6),
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DECIMAL(9, 6),
            allowNull: false,
        },
        temperatura: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        umidade_relativa: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false,
        },
        sensacao_termica: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        precipitacao: {
            type: DataTypes.DECIMAL(7, 2),
            allowNull: false,
        },
        codigo_tempo: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false,
        },
        velocidade_vento: {
            type: DataTypes.DECIMAL(7, 2),
            allowNull: false,
        },
        dia: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        observado_em: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'ClimaAtual',
        tableName: 'clima_atual',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['cidade', 'estado'],
            },
        ],
    }
);

module.exports = ClimaAtual;
