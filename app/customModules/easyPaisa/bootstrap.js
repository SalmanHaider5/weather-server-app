const promiseAdapter = require('./promiseAdapter');
const clientService = require('./clientService');
const validator = require('./validator');

/** 
 * Deduct amount from Easypaisa Mobile account
 * @param {string} mobile_account - the account number to deduct money from (msisdn format)
 * @returns {object} - {statusCode: 200, message: } or error reject promise
 * 
*/
exports.deductFromEPMA = async (refID, msisdn, amountInRs, email, ipnAction, appVersion, channel, mobile_account) => {
    try {
        
        _headers = {
            "content-type": "application/json",
            "Authorization": process.env.PAYMENTSERVICE_APIKEY,
            "requestId": refID,
            "channel": channel
        };

        _body = {
            msisdn : msisdn,
            orderID : refID,
            amount : amountInRs,
            email : email || `${msisdn}@telenor.com.pk`,
            ipnAction: ipnAction,
            appVersion : appVersion || 'WEB', 
            channel : channel , 
            mobile_account : mobile_account // mobile_account will be same as msisdn
        };

        let url = `${process.env.PAYMENTSERVICE_BASE_URL}/easypaisa/ma/deduct`;

        let result = await clientService.restRequest('POST', url, _body, _headers, false, 120000 );

        return result;

    } catch (error) {
        return promiseAdapter.reject(error);
    }
}

/**  
 * @returns {boolean} - or reject error object if statusCode is not 200 @example reject promise {statusCode: 412, message: erorr message}
*/
exports.validateCCTransaction =  async ( msisdn, orderID, amount, ipnAction, channel ) => {
    try {
        _headers = {
            "content-type": "application/json",
            "Authorization": process.env.PAYMENTSERVICE_APIKEY,
            "requestId": orderID,
            "channel": channel
        };

        _body = {
            "msisdn": msisdn,
            "orderID": orderID,
            "amount": amount,
            "ipnAction": ipnAction,
            "channel": channel
        }

        let url = `${process.env.PAYMENTSERVICE_BASE_URL}/easypaisa/cc/validate`;

        let result = await clientService.restRequest('POST', url, _body, _headers, false );

        if(result.statusCode === '200'){
            return promiseAdapter.resolve(true)
        }
        

    } catch (error) {
        return promiseAdapter.reject(error);
    }
}