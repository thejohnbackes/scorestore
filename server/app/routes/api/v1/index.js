'use strict';
var router = require('express').Router();
module.exports = router;


router.use('/order', require('./orders/order'));
router.use('/orders', require('./orders/orders'));
router.use('/user/:userId/order', require('./orders/userOrder'));
