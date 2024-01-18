const coursesControllers = require('../controllers/courses.controller');

const express = require('express');

const router = express.Router();

const {validationSchema} = require('../middlewares/validation.schema');
const verifiyToken = require('../middlewares/verifiyToken');
const allowedTo = require('../middlewares/allowedTo');
const userRoles = require('../utils/userRoles');

router.route('/')
  .get(coursesControllers.getAllCourses)
  .post(verifiyToken, validationSchema(), coursesControllers.addCourse)

router.route('/:courseId')
  .get(coursesControllers.getCourse)
  .patch(coursesControllers.updateCourse)
  .delete(verifiyToken, allowedTo(userRoles.ADMIN, userRoles.MANAGER), coursesControllers.deleteCourse)

module.exports = router;