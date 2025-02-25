const errorHandler =(err, req, res, next) => {
    console.error(`errorHandler : ${err.stack}`);

    const statusCode = err.statusCode || 500;

    const message = err.message || 'Internal Server Error';

    const errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';

    res.status(statusCode).json({
        success: false,
        message,
        code : errorCode,
        stack: err.stack
     })

};

export default errorHandler;