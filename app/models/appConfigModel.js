const dbModel = require('../models/dbModel');
const promiseAdapter = require('../adapters/promiseAdapter');


exports.updateConfig = async function (configType, configData, locale){

    try {
        let models = await dbModel.Models();
        let result = await models.appConfiguration.update(
            {
              'configData' : JSON.stringify(configData)
            },
            {
                where : {
                    'configType' : configType,
                    'locale' : locale || 'EN'
                }
            }
        );

        return result;
    } catch (error) {
        return promiseAdapter.reject({ 'code': error.code || 100, 'message': error.message })
    }
}

exports.getConfig = async function(configType){
    try {
        let models = await dbModel.Models();
        let result = await models.appConfiguration.findOne(
            {
                where: {
                    'configType': configType
                }
            }
        );
        if(result && result.dataValues){
            result.dataValues.configData = JSON.parse(result.dataValues.configData); 
            return result.dataValues;
        }else{
            return false;
        }
        
    } catch (error) {
        return false;
    }
}