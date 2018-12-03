import request from 'request-promise';
require('dotenv').config();

const reqBot = async (endpoint) => {
    let response;
    let options = {
        uri:  process.env.API_URL + endpoint,
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
