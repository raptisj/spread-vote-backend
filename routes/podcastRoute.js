const { Router } = require('express');
const podcastController = require('../controllers/podcastController');

const router = Router();

router.get('/podcasts', podcastController.all_podcasts);
router.get('/podcasts/:id', podcastController.single_podcast);
router.post('/podcasts', podcastController.create_podcast);

module.exports = router;
