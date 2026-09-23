const { DataTypes, Model } = require('sequelize')
const bcrypt = require('bcrypt')
const { sequelize } = require('../instances/mysql')

class usuario extends Model { }

usuario.init (
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,            
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        foto: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
        }
    },
    {
        sequelize,
        modelName: 'Usuario',
        tableName: 'usuarios',
        timestamps: true
    }
);

module.exports = Usuario