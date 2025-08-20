// Middleware for centralized error handling
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || "Server Error",
  });
};

// Export error handler middleware
