var express = require('express');
var router = express.Router();
var async = require('async');
var request = require('request');
const _ = require('lodash');
const ProductService = require('../services/productService');
const APIError = require('../lib/apiError');

// recieving a command
router.post('/', function(req, res, next) {
    if (req.accepts('application/json')) {
    async.every(req.body.data,function(test,callback){
        ProductService.checkItem(test)
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
            let p = new Promise((resolve, reject) => {
                request({
                    url: "http://localhost:8001/commands",
                    method: "POST",
                    json: true,
                    headers: {
                        "content-type": "application/json",
                        'authorization': "lpdw-2016"
                    },
                    body: req.body
                }, (error, response, body) => {
                    if (error) {
                        return reject(error)
                    }
                    return resolve(response);
                })
            });
            p.then( product =>
                {
                    return res.status(200).json(product);
                }
            ).catch()

        }
    });
    } else {
        return res.status(406).json("bad accept request");
    }
});



module.exports = router;
