const express = require('express');
const router = express.Router();
const async = require('async');
const request = require('request');
const _ = require('lodash');
const ProductService = require('../services/productService');
const APIError = require('../lib/apiError');

// recieving a command
router.post('/', function(req, res, next) {
    if (req.accepts('application/json')) {
    async.every(req.body.data,function(data,callback){
        ProductService.checkItem(data)
            .then((result) => {

                if (!result) {
                    return callback('Element non trouvé');
                } else {

                    return callback(null,result);
                }
            })
    }, function(err, result) {
        if(err){
            return res.status(400).send('Une ou plusieurs ressources ne sont pas disponibles');
        }
        if(result){
            async.every(req.body.data,function(element,callback){
                ProductService.findByQuery(element)
                    .then((result) => {
                        result.dataValues.quantity -= element.quantity;
                        ProductService.updateById(element.id, result.dataValues)
                            .then(result => {
                                if (!result) {
                                    return callback('Element non trouvé');
                                } else {

                                    return callback(null,result);
                                }
                            });
                    })
            }, function(err, result) {
                if(err){
                    return res.status(400).send('La quantité demandé n\'request plus disponible');
                }
                if(result){

                    let p = new Promise((resolve, reject) => {
                        request({
                            url: "https://eat-delivery.herokuapp.com/commands",
                            method: "POST",
                            json: true,
                            headers: {
                                "content-type": "application/json"
                            },
                            body: req.body
                        }, (error, response, body) => {
                            if (error) {
                                return reject(error)
                            }
                            return resolve(response.body);
                        })
                    });
                    p.then( product =>
                        {
                            return res.status(200).json(product);
                        }
                    ).catch()

                }
            });
        }
    });
    } else {
        return res.status(406).json("bad accept request");
    }
});



module.exports = router;
