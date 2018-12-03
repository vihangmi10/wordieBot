import express from 'express';

import searchWord from '../handlers/searchWord';
const router = express.Router();

router.get('/', async (req, res)=> {
    let wordMeaning = await searchWord(req);

});
export default router;