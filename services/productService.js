'use strict'
const db = require('../database');

exports.find = (query = {}) => {
    return db.Products.findAll({
        where: query
    });
};

exports.create = (product) => {
    const model = db.Products.build(product);
    return model.validate()
        .then(err => {
            if (err) {
                return Promise.reject(err);
            }
            return model.save();
        })
        ;
};

exports.findOneByQuery = query => {
    return db.Products.findOne({ where: query });
};

exports.delete = (query = {}) => {
    return db.Products.destroy({
        where: query
    });
};

exports.updateById = (id, dataToUpdate) => {
    return db.Products.update(dataToUpdate, { where: { id }, returning: true });
};

// check if the asked products & quantities are in database
exports.checkCommand = query => {
    return null;
};
