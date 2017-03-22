'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Products', {
        name: {
            type: DataTypes.STRING,
            validate: {notEmpty: {msg: "-> Missing name"}}
        },
        quantity: {
            type: DataTypes.INTEGER,
            validate: {notEmpty: {msg: "-> Missing quantity"}}
        },
        type: {
            type: DataTypes.STRING,
            validate: {notEmpty: {msg: "-> Missing type"}}
        },
        price: {
            type: DataTypes.INTEGER,
            validate: {notEmpty: {msg: "-> Missing price"}}
        },
    });
};