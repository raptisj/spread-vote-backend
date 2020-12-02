const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  const token = req.header('token');

  // check token exists & is
  if (token) {
    jwt.verify(token, 'secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message, 'msg');

        res.status(401).send('Access Denied');
      } else {
        req.user = decodedToken;
        next();
      }
    });
  }
};

module.exports = { requireAuth };
