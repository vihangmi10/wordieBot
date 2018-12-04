import requestBot from '../utils/requestBot';
require('dotenv').config();

const getBotStatus = async () => {
    let options = {
        endpoint: 'status',
    };
    try{
        return await requestBot(options);
    } catch (e) {
        console.log('Error getting status ---- ', e);
    }
};


export default getBotStatus;
