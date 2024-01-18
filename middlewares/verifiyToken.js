const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');

const verifiyToken = async (req, res, next) => {
  const authHeaders = req.headers['Authorization'] || req.headers['authorization']
  if (!authHeaders) {
    return res.status(400).json({status: httpStatusText.ERROR, data: null, message: 'token is required', code: 401});
  }
  const token = authHeaders.split(' ')[1]
  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.currentUser = currentUser;
    next();
  } catch (error) {
    return res.status(400).json({status: httpStatusText.ERROR, data: null, message: 'invalid token', code: 401}); 
  }
}

module.exports = verifiyToken;