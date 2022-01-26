const { DataTypes } = require("sequelize");
const db = require("../db");

const Items = db.define("items", {
    name: {
        type: DataTypes.STRING,
        allowNull: true , 
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: true , 
    },
    who: {
        type: DataTypes.STRING,
        allowNull: true , 
    },
    done: {
        type: DataTypes.BOOLEAN,
        allowNull: true , 
    },
    partyID:{
        type: DataTypes.INTEGER,
    },
    owner:{
        type: DataTypes.INTEGER
    }

});

module.exports = Items;