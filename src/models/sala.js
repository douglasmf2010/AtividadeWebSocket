const connection = require('../config/database.js');
const { DataTypes } = require('sequelize');

const Sala = connection.define(
  'Sala',
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
  },
  {
    tableName: 'sala',
    timestamps: true,
  },
);
Sala.sync({ alter: true });
module.exports = Sala;
