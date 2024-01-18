const httpStatusText = require('../utils/httpStatusText');

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      return next(res.status(400).json({status: httpStatusText.ERROR, data: null, message: 'this role is not authorized', code: 401}))
    }
    next();
  }
}