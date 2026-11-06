'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('clima_atual', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            cidade: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            estado: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            pais: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            latitude: {
                type: Sequelize.DECIMAL(9, 6),
                allowNull: false,
            },
            longitude: {
                type: Sequelize.DECIMAL(9, 6),
                allowNull: false,
            },
            temperatura: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
            },
            umidade_relativa: {
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
            },
            sensacao_termica: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
            },
            precipitacao: {
                type: Sequelize.DECIMAL(7, 2),
                allowNull: false,
            },
            codigo_tempo: {
                type: Sequelize.SMALLINT.UNSIGNED,
                allowNull: false,
            },
            velocidade_vento: {
                type: Sequelize.DECIMAL(7, 2),
                allowNull: false,
            },
            dia: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            observado_em: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });

        await queryInterface.addIndex('clima_atual', ['cidade', 'estado'], {
            unique: true,
            name: 'clima_atual_cidade_estado_unique',
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('clima_atual');
    },
};
