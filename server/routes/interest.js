const router=require('express').Router();
const {addInterest}=require('../controllers/interest');

router.post('/',addInterest);

module.exports=router;