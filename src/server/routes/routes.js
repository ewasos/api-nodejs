'use strict'

const express = require('express')
const ProductCtrl = require('../controllers/product')
const api = express.Router()

api.use(express.static('public'))
api.get('/product', ProductCtrl.getProducts)
api.get('/product/homme', ProductCtrl.getProductsHommes)
api.get('/product/femme', ProductCtrl.getProductsFemmes)
api.get('/product/enfant', ProductCtrl.getProductsEnfants)
api.get('/product/moinCher', ProductCtrl.getMoinCher)
api.get('/product/:productId', ProductCtrl.getProduct)
api.post('/product', ProductCtrl.saveProduct)
api.put('/product/:productId', ProductCtrl.updateProduct)
api.delete('/product/:productId', ProductCtrl.deleteProduct)

module.exports = api