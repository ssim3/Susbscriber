const errorMiddleware = (err, req, res, next) => {
  try {

    let error = { ...err };
    error.message = err.message;

    console.log(err);

    // Mongoose bad ObjectId 
    if (err.name === 'CastError') {
      const message = 'Resource not found';
      error = new Error(message);
      error.statusCode = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
      const message = 'Duplicate field value entered';
      error = new Error(message);
      error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({ success : false, error : error.message || 'Server Error'});

  } catch (error) {
    next(error)
  }
}

export default errorMiddleware;