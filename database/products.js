'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Products', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {notEmpty: {msg: "-> Missing name"}}
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {notEmpty: {msg: "-> Missing quantity"}}
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {notEmpty: {msg: "-> Missing type"}}
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {notEmpty: {msg: "-> Missing price"}}
        },
    });
};