const { Router } = require('express');
const guestController = require('../controllers/guestController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.get('/podcasts/:podId/guests', guestController.all_guests);
router.get('/podcasts/:podId/guests/:id', guestController.single_guest);
router.post('/guests/create', requireAuth, guestController.create_guest);
router.post('/podcasts/:podId/guests/create/fetch', requireAuth, guestController.fetch_twitter_data);
router.patch('/podcasts/:podId/guests/create/fetch', requireAuth, guestController.fetch_update_twitter_data);
router.patch('/guests/up-vote/:id', requireAuth, guestController.upVote_guest);
router.patch('/guests/un-vote/:id', requireAuth, guestController.unVote_guest);
router.patch('/podcasts/:podId/vote-category', requireAuth, guestController.vote_category);

module.exports = router;
