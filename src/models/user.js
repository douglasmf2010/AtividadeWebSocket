const connection = require('../config/database.js');
const {DataTypes} = require('sequelize');

const usuario = connection.define("usuario", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefone:{
        type: DataTypes.string,
        allowNull: false
    },
    senha:{
        type: DataTypes.string,
        allowNull: true,
    }
},
    {
        tableName: "usuario",
        timestamps: true
    }
);//sasasaadwada

module.exports = usuario;
