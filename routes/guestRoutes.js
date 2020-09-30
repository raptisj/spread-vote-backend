const { Router } = require('express');
const guestController = require('../controllers/guestController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.get('/guests', guestController.all_guests);
router.get('/guests/:id', guestController.single_guest);
router.post('/guests/create', requireAuth, guestController.create_guest);
router.post('/guests/create/fetch', requireAuth, guestController.fetch_twitter_data);
router.patch('/guests/up-vote/:id', requireAuth, guestController.upVote_guest);
router.patch('/guests/un-vote/:id', requireAuth, guestController.unVote_guest);

module.exports = router;
