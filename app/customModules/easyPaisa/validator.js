const customError = require('./customError');

exports.validationRequired = function (params, required) {

    try {
        var validationObj = { invalid: false, message: '' };
        required.some(function (element, index) {
            validationObj = {};
            validationObj.invalid = params[element] === undefined || params[element] === "";
            validationObj.message = element;
            return validationObj.invalid;
        });
    
        if (validationObj.invalid) {
            return validationObj;
        } else {
            //now check for empty values
            return required.some(function (element, index) {
                validationObj = {};
                validationObj.invalid = params[element].length === 0;
                validationObj.message = element;
                return validationObj.invalid;
            });
        }
    } catch (error) {
        return { invalid: true, message: 'Unknown validation error' };
    }
    

}

exports.isSanitisedString = function(str){
    try {
        
        if (/[\t\r\n]|(--[^\r\n]*)|(\/\*[\w\W]*?(?=\*)\*\/)/gi.test(str)) {
            //validation failed
            return false
        }else{
            return true
        }
    } catch (error) {
        return false
    }
}

exports.isValidMSISDN = async function(msisdn){
    try {
        if(!msisdn){
            throw new customError('INVALID_MSISDN', 'Invalid msisdn');
        }

        if(!Number.isInteger(Number(msisdn))){
            throw new customError('INVALID_MSISDN', 'Invalid msisdn format');
        }

        if( !exports.isSanitisedString (msisdn)){
            throw new customError('INVALID_MSISDN', 'Invalid msisdn format');
        }
        
        if(msisdn.substr(0,2) !== '03' ){
            throw new customError('INVALID_MSISDN', 'Invalid msisdn format. Number must start with 03...');
        }

        if(msisdn.length > 11 || msisdn.length < 9 ){
            throw new customError('INVALID_MSISDN', 'Invalid msisdn format')
        }

        return new Promise( ( resolve, reject) => {
            return resolve(true);
        }) 

    } catch (error) {
        return new Promise( ( resolve, reject) => {
            return reject(error);
        }) 
    }
}

exports.escapeCharacter =  (str) => {
    try {
        let retval = str.replace(/[;\\\\/:*?\"<>|@&',%]/gi, "")
        return retval;
    } catch (error) {
        return error;
    }

}