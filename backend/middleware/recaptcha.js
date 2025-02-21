const axios = require('axios');
const asyncHandler = require('express-async-handler');
const qs = require('qs');

const verifyRecaptcha = asyncHandler(async (req, res, next) => {
    const { recaptcha } = req.body;

    if (!recaptcha) {
        return next({
            status: 400,
            message: "Missing recaptcha"
        });
    }

    try {
        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            qs.stringify({
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: recaptcha
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        if (!response.data.success) {
            return next({
                status: 400,
                message: "Invalid recaptcha"
            });
        }

        next();
    } catch (error) {
        next(error);
    }
});

module.exports = verifyRecaptcha;