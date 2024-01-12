const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  //* Get token from header
  const token = req.headers.authorization;
  if (token) {
    console.log('user verified');
  }

  //* Check if not token
  if (!token) {
    console.log('not verified');
    return res.status(401).json({ msg: 'No token, autiorization denied' });
  }
  //* Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
