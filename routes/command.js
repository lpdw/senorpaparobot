var express = require('express');
var router = express.Router();
const _ = require('lodash');
const ProductService = require('../services/productService');
const APIError = require('../lib/apiError');

// recieving a command
router.get('/', function(req, res, next) {

    ProductService.checkCommand(req.query)
    .then(result => {
      // if the json format is correct
      if(req.accepts('application/json')) {
        // if the stock wannot answer to the command : return false & code error
        if (result) {
          return set.status(200).send(id_command);
        }
      }
      res.status(500).send();
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});



module.exports = router;
