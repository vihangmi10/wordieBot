import express from 'express';
const router = express.Router();

import botStatus from './botStatus';
import searchWord from './searchWord';

router.use('/status', botStatus);
router.use('/search',searchWord);

export default router;
