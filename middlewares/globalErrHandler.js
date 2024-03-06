const globalErrHandler = (err, _req, res, _next) => {
  const statuscode = (err.statusCode = err.statusCode || 500);
  const status = (err.status = err.status || "error");
  const message = err.message;
  const stack = err.stack;

  res.status(statuscode).json({
    status,
    message,
    stack,
  });
};

module.exports = globalErrHandler;
