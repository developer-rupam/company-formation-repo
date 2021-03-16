import { createLogger, format, transport, transports } from "winston";
import { join } from "path";

export const Logger = createLogger({
  level: "info",
  transports: [
    new transports.Console({ level: "info", format: format.simple() }),
    new transports.File({
      level: "info",
      filename: join(__dirname, "/../../", "logs/combined.log"),
      format: format.combine(format.prettyPrint(), format.json({ space: 4 }), format.timestamp())
    }),
    new transports.File({
      level: "error",
      filename: join(__dirname, "/../../", "logs/error.log"),
      format: format.combine(format.prettyPrint(), format.json({ space: 4 }), format.timestamp())
    })
  ]
});
