const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const User = require('../models/userModel')

//@desc Register new user
//@route POST /api/users
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  //Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password

  const salt = await bcrypt.genSalt(10)

  const hashedPassword = await bcrypt.hash(password, salt)

  // Create User

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  if (!user) {
    res.status(400)
    throw new Error('Invalid user data')
  }

  res.status(201).json(_.pick(user, ['id', 'name', 'email']))
})

//@desc Authenticate a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Chech for user email

  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    const userData = _.pick(user, ['id', 'name', 'email'])
    const token = generateToken(user._id)

    console.log(userData)
    res.status(200).json({ ...userData, token })
  } else {
    res.status(400)
    throw new Error('Invalid incredentials')
  }
})

//@desc Get user data
//@route GET /api/users/me
//@access private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  res.json(_.pick(user, ['id', 'name', 'email']))
})

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '10m',
  })
}

module.exports = { registerUser, loginUser, getMe }
