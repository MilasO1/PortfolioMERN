import axios from 'axios';
import asyncHandler from 'express-async-handler';
import { stringify } from 'qs';

export const verifyRecaptcha = asyncHandler(async (req, res, next) => {
    const { recaptcha } = req.body;
    
    if (!recaptcha) {
        return next({
            status: 400,
            message: "Missing recaptcha token"
        });
    }
    
    if (!process.env.RECAPTCHA_SECRET_KEY) {
        console.error('RECAPTCHA_SECRET_KEY is not defined');
        return next({
            status: 500,
            message: "Server configuration error"
        });
    }
    
    try {
        const response = await axiospost(
            'https://www.google.com/recaptcha/api/siteverify',
            stringify({
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: recaptcha
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                timeout: 5000
            }
        );
        
        if (!response.data || !response.data.success) {
            return next({
                status: 400,
                message: "reCAPTCHA verification failed"
            });
        }
        
        next();
    } catch (error) {
        console.error('reCAPTCHA verification error:', error.message);
        return next({
            status: 500,
            message: "Failed to verify reCAPTCHA"
        });
    }
});

export default { verifyRecaptcha } ;