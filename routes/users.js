import express from 'express';

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('SOmething...');
  res.json({users: [{name: 'Timmy'}]})
});

export default router;

