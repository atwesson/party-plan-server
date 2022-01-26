const { DataTypes } = require("sequelize");
const db = require("../db");

const Parties = db.define("parties", {
    name: {
        type: DataTypes.STRING,
        allowNull: true , 
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true , 
    },
    time: {
        type: DataTypes.STRING,
        allowNull: true , 
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true , 
    },
    public: {
        type: DataTypes.BOOLEAN,
        allowNull: true , 
    },
    owner:{
        type: DataTypes.INTEGER
    }
});


module.exports = Parties;