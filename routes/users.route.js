const express = require('express');
const router = express.Router();
const multer = require('multer');

const usersControllers = require('../controllers/users.controller');
const verifiyToken = require('../middlewares/verifiyToken');

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  }
})

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split('/')[0];
  if (imageType === 'image') {
    return cb(null, true);
  } else {
    return cb("the file must be an image only", false);
  }
}

const upload = multer({storage: diskStorage, fileFilter });

router.route('/')
  .get(verifiyToken, usersControllers.getAllUsers)

router.route('/register')
  .post(upload.single('avatar') ,usersControllers.register);

router.route('/login')
  .post(usersControllers.login);

module.exports = router;