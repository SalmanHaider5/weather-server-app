const request = require('request');
const customError = require('./customError');

/**
* @params {integer} timeout - set timeout length in milliseconds
* @params {string} useProxy - set true for external network calls via forward proxy
* @returns {Object} - returns 200 response object or reject error if not 200 
*/

exports.restRequest = function (method, endpoint, requestBody, headers, useProxy, timeout ){
    //returns json on success or error message
    return new Promise((resolve, reject) => {
        try {
            let proxy = useProxy ? process.env.FORWARD_PROXY: '';
            let options = {
                url: endpoint,
                method: method,
                headers: headers,
                body: JSON.stringify(requestBody),
                timeout: timeout || 10000, //10 seconds timeout
                proxy: proxy,
                time: true
            }

            request(options, function (error, response, body) {
                try {
                    if (error) {
                        throw new customError(error.code || '412' , error.message);
                    } else if (response.statusCode != 200) {
                        throw new customError( response.statusCode, response.statusMessage);
                    } else {
                        let responseBody = JSON.parse(body);
                        if( responseBody.statusCode !== "200"){
                            throw new customError(responseBody.statusCode, responseBody.message);
                        }else{
                            return resolve(responseBody);
                        }
                    }
                } catch (error) {
                    return reject(error);        
                }
            })
            
        } catch (error) {
                return reject (error);
        }
    })
}


