const promiseAdapter = require('./promiseAdapter');
const clientService = require('./clientService');
const logger = require('../../utils/logger');

/**
 * Deducts amount from customer's balance 
 * @param {string} refID - ReferenceID. or Corelation ID
 * @param {string} msisdn 
 * @param {float} amount - Amount in Rupees
 * @param {string} remarks - e.g. BI remarks PREFIX-OFFERNAME-PRICE-VALIDITYDAYS e.g  'BUNDLEGIFT-' + saleResult.name + '-' + updatedPrice + '-' + saleResult.Offer_Days
 * @returns {object} {statusCode, message}
 */
exports.deductFromBalance = async(refID, msisdn, amountInRs, remarks) =>{
    try {
        
        /*
        return promiseAdapter.resolve({
            statusCode: "200",
            message: "Success",
            data: {}
        })
*/

        const url = `${process.env.SERVICE_CUSTOM_ALLOWANCE_POSTING_BASE_URL}/chargingposting/charge`;

        _headers = {
            'content-type': 'application/json',
            'Authorization' : process.env.SERVICE_CUSTOM_ALLOWANCE_POSTING_ACCESSTOKEN
        }
        
        _body = {
            msisdn: msisdn,
            remarks: remarks,
            amount: amountInRs
        }

        let result = await clientService.restRequest(
            'POST', url, _body, _headers, false
        )

        logger.debug('charging api success response ' + JSON.stringify(result));
        
        return result;
    } catch (error) {
        logger.error('Deduct from balance error'+ JSON.stringify({code: error.code || 'NA', message: error.message}));
        return promiseAdapter.reject(error);
    }
}

/** 
 * @typedef allowances[] {array} - Array of objects
 * @property {string} allowances.label - The label @example "Offnet minutes"
 * @property {string} allowances.measure_unit @example "mbs"
 * @property {string} allowances.id - subaccount @example "5128"
 * @property {number} allowances.allowance - allowance @example 30
 */

/** 
 * @param {string} validityInDays  - Allowances validity in days
 * @param {allowances[]} allowances
 * @param {string} remarks_prefix - Remarks used for BO reporting 
 * @returns {Object} - statusCode and message object
*/
exports.postAllowances = async (refID, msisdn, validityInDays, allowances, remarks_prefix, additionalInfo = 0) => {
    try {
        const url = `${process.env.SERVICE_CUSTOM_ALLOWANCE_POSTING_BASE_URL}/chargingposting/allowances/post`;

        logger.debug('Posting url is ' + url);
        
        _headers = {
            "content-type": "application/json",
            "authorization": `${process.env.SERVICE_CUSTOM_ALLOWANCE_POSTING_ACCESSTOKEN}`,
            "requestId": refID,
        };

        _body = {
            "validity": validityInDays,
            "msisdn": msisdn,
            "allowances":allowances,
            "remarks_prefix": remarks_prefix,
            "additionalInfo": additionalInfo
        }

        let result = await clientService.restRequest('POST', url, _body, _headers, false);

        logger.debug('Posting api success response' + JSON.stringify(result))
        return result
    } catch (error) {
        logger.error('Post allowance error'+ JSON.stringify({code: error.code || 'NA', message: error.message}));
       
        return promiseAdapter.reject(error);
    }
}
