import request from 'request-promise';
require('dotenv').config();

const reqBot = async (reqOptions) => {
    let response;
    let options = {
        method: reqOptions.method || 'GET',
        uri:  process.env.API_URL + reqOptions.endpoint,
        headers: {'x-api-key': process.env.X_API_KEY}
    };
    try {
        console.log('THE OPTIONS ARE ---- ', options);
         response = await request(options);
    } catch (e) {
        console.log('Error --- ', e);

    }

    return response;
};

export default reqBot;
