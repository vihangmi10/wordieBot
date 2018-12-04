import express from 'express';

import searchWord from '../handlers/searchWord';
const router = express.Router();

router.get('/', async (req, res)=> {
    try{
        let wordMeaning = await searchWord(req);
        res.status(200).send(wordMeaning);
    } catch (e) {
        console.log('Error --- ', e);
    }


});
export default router;