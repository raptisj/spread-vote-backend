const { Router } = require('express');
const podcastController = require('../controllers/podcastController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.get('/podcasts', podcastController.all_podcasts);
router.get('/podcasts/:id', podcastController.single_podcast);
router.post('/podcasts', podcastController.create_podcast);
router.patch('/podcasts/:id', requireAuth, podcastController.update_podcast);

module.exports = router;
