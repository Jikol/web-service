import pino from "pino";
import type { Logger } from "pino";
import pretty from "pino-pretty";

const stream = pretty({
  colorize: true
});

const log: Logger = pino(
  {
    level: "info"
  },
  stream
);

export default log;
