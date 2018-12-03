import express from 'express';

import botStatus from '../handlers/statusHandler';

const router = express.Router();

router.get('/', async (req, res)=> {
    try{
        let response = await botStatus(req, res);
        res.status(200).send(response);
    }catch (e) {
        res.status(500).send(e);
    }


});
export default router;
