const request = require('request');
const customError = require('./customError');

exports.restRequest = function (method, endpoint, requestBody, headers, useProxy ){
    //returns json on success or error message
    return new Promise((resolve, reject) => {
        try {
            let proxy = useProxy ? process.env.FORWARD_PROXY: '';
            let options = {
                url: endpoint,
                method: method,
                headers: headers,
                body: JSON.stringify(requestBody),
                timeout: 10000, //10 seconds timeout
                proxy: proxy,
                time: true
            }

            request(options, function (error, response, body) {
                try {
                    if (error) {
                        throw new Error(error.message);
                    } else if (response.statusCode != 200) {
                        throw new Error(response.statusMessage);
                    } else {
                        let responseBody = JSON.parse(body);
                        if( responseBody.statusCode !== "200"){
                            throw new customError(responseBody.statusCode, responseBody.message);
                        }else{
                            return resolve(true);
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


