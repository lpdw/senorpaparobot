var express = require('express');
var router = express.Router();
var async = require('async');
var request = require('request');
const _ = require('lodash');
const ProductService = require('../services/productService');
const APIError = require('../lib/apiError');

// recieving a command
router.post('/', function(req, res, next) {

    async.every(req.body.data,function(test,callback){
        ProductService.checkItem(test)
            .then((result) => {
                if (!result) {
                    console.log('not result');
                    return callback('Element non trouvé');
                } else {
                    return callback(null,result);
                }
            })
    }, function(err, result) {
        if(result){
            let p = new Promise((resolve, reject) => {
                request({
                    url: "http://127.0.0.1:8001/test",
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
            p.then( product => {
                    return res.status(200).json(product);
                }
            ).catch()

        }
    });
});



module.exports = router;
