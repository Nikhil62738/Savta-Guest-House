// 404 handler
export function notFound(req, res, next) {
  res.status(404).json({ message: `Not found - ${req.originalUrl}` })
}

// Central error handler
export function errorHandler(err, req, res, next) {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  if (process.env.NODE_ENV !== 'production') console.error(err)
  res.status(status).json({
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  })
}
