const path = require("path");

const { createLogger, transports, format } = require("winston");

const natoursLogger = createLogger({
  format: format.combine(
    format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
    format.align(),
    format.printf((i) => `${i.level}: ${[i.timestamp]}: ${i.message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(__dirname, "/success.log"),
      level: "info",
      format: format.combine(
        format.printf((i) =>
          i.level === "info" ? `${i.level}: ${i.timestamp} ${i.message}` : ""
        )
      ),
    }),
    new transports.File({
      filename: path.join(__dirname, "/error.log"),
      level: "error",
      format: format.combine(
        format.printf((i) =>
          i.level === "error" ? `${i.level}: ${i.timestamp} ${i.message}` : ""
        )
      ),
    }),
  ],
});

module.exports = { natoursLogger };
