const promiseAdapter = require('./promiseAdapter');
const clientService = require('./clientService');

exports.sendSMS = async(from, to, message) =>{
    try {
        if(!process.env.SMS_MICROSERVICE_BASE_URL){
            throw new Error('Environment variable SMS_MICROSERVICE_BASE_URL not set');
        }
        
        if(!to){
            throw new Error('Missing param : to');
        }

        if(!message){
            throw new Error('Missing param : message');
        }

        let url = process.env.SMS_MICROSERVICE_BASE_URL +'/sms/send'; 
        let result = await clientService.restRequest(
            'POST',
            url,
            {
                "from": from,
                "to": to,
                "message": message
            },
            {
                "Content-Type": "application/json",
                "Authorization": process.env.SMS_MICROSERVICE_ACCESSTOKEN
            },
            false
        );
        return result;
    } catch (error) {
        return promiseAdapter.reject(error);
    }
}