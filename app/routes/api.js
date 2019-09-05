var express = require('express');
var router = express.Router();
const context = require('../utils/context'); 
const cacheModel = require('../models/cacheModel');

const apiResponseService = require('../services/apiResponseService');

router.get('/', async function (req, res) {
    try {
        let traceID = context.vars.get('req:x-requestID');
        await cacheModel.setValueInRedisCache('redis-testkey',{requestID:traceID}, 60);
        let response = apiResponseService.generateResponse('200', 'API Router functional', '', {id: traceID} );
        res.send( response);
    } catch (error) {
        let response = apiResponseService.generateResponse('412', error.message , '', {} );
        res.send(response);
    }
});




module.exports = router;