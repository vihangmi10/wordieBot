import requestBot from '../utils/requestBot';
require('dotenv').config();

const getBotStatus = async (req, res) => {
    let endpoint = 'status';
    try{
        return await requestBot(endpoint);
    } catch (e) {
        console.log('Error getting status ---- ', e);
    }
};


export default getBotStatus;
