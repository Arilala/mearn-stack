const asyncHandler = require('express-async-handler')

const Goal = require('../models/goalModel')
const User = require('../models/userModel')
//@desc Get goals
//@route GET /api/goals
//@access private
const getGoals = asyncHandler(async (req, res, next) => {
  const goals = await Goal.find({ user: req.user.id })

  res.status(200).json(goals)
})

//@desc Set goal
//@route POST /api/goals
//@access private
const setGoal = asyncHandler(async (req, res, next) => {
  if (!req.body.text) {
    res.status(404)
    throw new Error('Please add a text field')
  }

  const goal = await Goal.create({
    text: req.body.text,
    user: req.user.id,
  })

  res.status(200).json(goal)
})

//@desc Update goal
//@route PUT /api/goals/:id
//@access private
const updateGoal = asyncHandler(async (req, res, next) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(400)
    throw new Error('Gaol not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const updateGoal = await Goal.findOneAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updateGoal)
})

//@desc Delete goal
//@route DELETE /api/goals/:id
//@access private
const deleteGoal = asyncHandler(async (req, res, next) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(400)
    throw new Error('Gaol not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await goal.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
}
