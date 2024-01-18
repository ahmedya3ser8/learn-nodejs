const UserModel = require('../models/user.model');
const httpStatusText = require('../utils/httpStatusText');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// get all users
const getAllUsers = async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const users = await UserModel.find({}, {"__v": false, password: false}).limit(limit).skip(skip)
  res.status(200).json({status: httpStatusText.SUCCESS, data: {users}});
}

// register users
const register = async (req, res) => {
  const {firstName, lastName, email, password, role} = req.body;

  // if user email exists
  const existUserEmail = await UserModel.findOne({email: email});

  if (existUserEmail) {
    return res.status(400).json({status: httpStatusText.ERROR, data: null, message: 'user already exists', code: 400});
  }
  // hashing password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename
  })

  // generate token
  const token = await generateToken({email: newUser.email, id: newUser._id, role: newUser.role});
  newUser.token = token;

  await newUser.save();

  res.status(201).json({status: httpStatusText.SUCCESS, data: {user: newUser}});

}

// login users
const login = async (req, res) => {
  const {email, password} = req.body;

  if (!email && !password) {
    return res.status(400).json({status: httpStatusText.ERROR, data: null, message: 'email and password are required', code: 400});
  }
  
  const user = await UserModel.findOne({email: email});
  if (!user) {
    return res.status(400).json({status: httpStatusText.ERROR, data: null, message: 'user not found', code: 400});
  }

  const matchedPassword = await bcrypt.compare(password, user.password);
  
  if (user && matchedPassword) {
    // logged in successfully
    const token = await generateToken({email: user.email, id: user._id, role: user.role});
    res.status(200).json({status: httpStatusText.SUCCESS, data: {token}});
  } else {
    return res.status(400).json({status: httpStatusText.ERROR, data: null, message: 'something wrong', code: 400});
  }
}

module.exports = {
  getAllUsers,
  register,
  login
}
