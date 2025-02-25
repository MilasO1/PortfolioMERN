import { createLogger, format as _format, transports as _transports } from "winston";

const logger = createLogger({
    level: "info",
    format: _format.json(),
    defaultMeta: { service: "user-service" },
    transports: [
      new _transports.File({ filename: "error.log", level: "error" }),
      new _transports.Console(),
    ]
  });

  export default logger;