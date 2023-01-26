const router=require('express').Router();
const cons=require('../controllers/user');
const mids=require('../middlewares/protect');

router.post('/',cons.addUser);
router.post('/login',cons.login);
router.delete('/',cons.deleteUser);
router.put('/:id/interest',mids.protect,cons.addOrRemoveInterest);
router.get('/',mids.protect,cons.getUserDetails);
router.get('/events',mids.protect,cons.getAllEvents);
router.get('/events/suggestions',mids.protect,cons.suggestEvents);
router.put('/event/:id',mids.protect,cons.registerForEvent);
router.get('/events/registered',mids.protect,cons.fetchRegisteredEvents);

module.exports=router;