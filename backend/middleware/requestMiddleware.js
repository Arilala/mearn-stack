const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}

const notFoundHandler = (req, res, next) => {
  const message = 'response not found'

  res.status(404).json({
    message,
    path: req.baseUrl,
    method: req.method,
  })
}

module.exports = { errorHandler, notFoundHandler }
