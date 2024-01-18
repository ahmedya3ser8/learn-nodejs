const { validationResult } = require('express-validator');
const CourseModel = require('../models/course.model');
const httpStatusText = require('../utils/httpStatusText');

const getAllCourses = async (req, res) => {
  const query = req.query;
  const limit = query.limit || 5;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const courses = await CourseModel.find({}, {"__v": false}).limit(limit).skip(skip); // query filter ---> price: {$gt: 800} ------- projection --> {"__v: false"}
  res.status(200).json({status: httpStatusText.SUCCESS, data: {courses}});
}

const getCourse = async (req, res) => {
  try {
    const course = await CourseModel.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({status: httpStatusText.FAIL, data: {course: null}});
    }
    return res.status(200).json({status: httpStatusText.SUCCESS, data: {course}});
  } catch (error) {
    return res.status(400).json({status: httpStatusText.ERROR, message: {error} })
  }
}

const addCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({status: httpStatusText.ERROR, data: null, message: errors.array(), code: 400});
  }
  const newCourse = new CourseModel(req.body);
  await newCourse.save();
  res.status(201).json({status: httpStatusText.SUCCESS, data: {course: newCourse}});
}

const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await CourseModel.updateOne({_id: req.params.courseId}, {$set: {...req.body}})
    if (!updatedCourse) {
      return res.status(404).json({status: httpStatusText.FAIL, data: {course: null}});
    }
    return res.status(200).json({status: httpStatusText.SUCCESS, data: {course: updatedCourse}});  
  } catch (error) {
    return res.status(400).json({status: httpStatusText.ERROR, data: {error}});
  }
}

const deleteCourse = async (req, res) => {
  await CourseModel.deleteOne({_id: req.params.courseId})
  res.status(200).json({status: httpStatusText.SUCCESS, data: null});
}

module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
}