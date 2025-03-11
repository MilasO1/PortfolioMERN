import morgan from "morgan";
import logger from "../config/logger.js";

const morganMiddleware = morgan((tokens, req, res) => {
    const logData = {
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        contentLength: tokens.res(req, res, "content-length"),
        ip: tokens["remote-addr"](req, res),
        userAgent: tokens["user-agent"](req, res),
    };
    return JSON.stringify(logData);
}, {
    stream: {
        write: (message) => {
            logger.info(message.trim());
        },
    },
});

export default morganMiddleware;