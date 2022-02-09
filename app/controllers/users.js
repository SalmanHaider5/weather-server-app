const { sign, verify } = require('jsonwebtoken');
const dbModels = require('../models/dbModel');
const { generateResponse } = require('../services/apiResponseService');

exports.createUser = async () => {
    try{
        const { Users } = await dbModels.Models();
        const usersCount = await Users.count();
        const userId = parseInt(usersCount) + 1;
        const userKey = sign({ userId }, 'new-user');
        const user = await Users.create({ id: userId, key: userKey});
        user.userExisted = true;
        const response = generateResponse('200', 'User created', '', user);
        return response;
    }catch(error){
        let response = apiResponseService.generateResponse('412', error.message , '', {} );
        return response;
    }
}

exports.validateUser = async user => {
    const { Users } = await dbModels.Models();
    const data = await Users.findOne({ where: { key: user } })
    return data ? true : false;
}