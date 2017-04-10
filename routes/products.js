const express  = require('express');
const _ = require('lodash');
const router = express.Router();
const ProductService = require('../services/productService');
const APIError = require('../lib/apiError');
const Sequelize = require('sequelize');

router.post('/', (req, res, next) => {
    return ProductService.create(req.body)
        .then(product => {
            if (req.accepts('text/html')) {
                return res.redirect('/products/' + product.id);
            }
            if (req.accepts('application/json')) {
                return res.status(201).send(product);
            }
        })
        .catch(Sequelize.ValidationError, err => {
            res.status(400).json(err.errors[0].message);   // responds with validation errors
        });
});

router.get('/', (req, res, next) => {
    ProductService.find(req.query)
    .then(products => {
        if (req.accepts('text/html')){
            return res.render('products', {products: products});
        }
        if (req.accepts('application/json')) {
          return res.status(200).send(products);
        }
    })
    .catch(next);
});

router.delete('/', (req, res) => {
    ProductService.delete()
    .then(() => {
        res.status(204).send();
    })
    .catch(function (err) {
        res.status(500).send(err);
    });
});

router.get('/add', (req, res, next) => {
    const product = (req.session.product) ? req.session.product : {};
    const err = (req.session.err) ? req.session.err : null;
    if (!req.accepts('text/html')) {
       return next(new APIError(406, 'Not valid type for asked resource'));
    }
    req.session.product = null;
    req.session.err = null;
    res.render('newProduct', {product, err});
});

router.get('/edit/:id', (req, res, next) => {
    const product = (req.session.product) ? req.session.product : {};
    const err = (req.session.err) ? req.session.err : null;
    if (!req.accepts('text/html')) {
        return next(new APIError(406, 'Not valid type for asked resource'));
    }
    ProductService.findOneByQuery({id: req.params.id})
        .then(product => {
            if (!product){
                return next(new APIError(404, 'No product found with id' + req.params.id));
            }
            return res.render('editProduct', {product, err});
        })
        .catch(next);
});

router.get('/:id', (req, res, next) => {
    if (!req.accepts('text/html') && !req.accepts('application/json')){
        return next(new APIError(406, 'Not valid type for asked resource'));
    }
    ProductService.findOneByQuery({id: req.params.id})
    .then(product => {
        if (!product){
            return next(new APIError(404, `id ${req.params.id} not found`));
        }
        if (req.accepts('text/html')) {
            return res.render('product', {product: product});
        }
        if (req.accepts('application/json')) {
            return res.status(200).send(product);
        }
    })
    .catch(next);
});

router.put('/:id', (req, res, next) => {
    ProductService.updateById(req.params.id, req.body)
    .then(result => {
        if (req.accepts('text/html')){
            return res.redirect('/products/' + req.params.id);
        }
        if (req.accepts('application/json')) {
            return res.status(201).send(result);
        }
    })
    .catch(next);
});

router.delete('/:id', (req, res) => {
    ProductService.delete({id: req.params.id})
    .then(() => {
        res.status(204).send();
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

router.get('/type/:type', (req, res) => {
    ProductService.find({type: {$like: `%${req.params.type}%`}})
    .then(products => {
        res.status(200).send(products);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send(err);
    });
});

module.exports = router;
