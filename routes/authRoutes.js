const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.post('/signup/', authController.signup);
router.post('/login/', authController.login);
router.post('/logout/', authController.logout);
router.get('/user/', requireAuth, authController.get_user);
router.patch('/user/guest/add/', requireAuth, authController.update_user);
router.patch('/user/guest/remove/', requireAuth, authController.remove_user_guest);

module.exports = router;
