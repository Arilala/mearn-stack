const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const colorsTheme = require('./config/colorsTheme')

colors.setTheme(colorsTheme)

const fileUpload = require('express-fileupload')

const {
  errorHandler,
  notFoundHandler,
} = require('./middleware/requestMiddleware')
const connectDB = require('./config/db')
global.BASEDIR = __dirname
const port = process.env.PORT || 5000
connectDB()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extends: true }))

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  }),
)

app.use('/api/goals', require('./routes/goalRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('*', notFoundHandler)
app.use(errorHandler)

app.listen(port, () =>
  console.log(
    `Server started on port ${port}`.info,
    `http://localhost:${port}`.custom,
  ),
)
