const connection = require('../config/database.js');
const { DataTypes } = require('sequelize');

const Usuario = connection.define(
  'usuario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    telefone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'usuario',
    timestamps: true,
  },
);
Usuario.sync({alter: true})
module.exports = Usuario;
