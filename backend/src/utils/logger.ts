import logger from "pino";
import dayjs from "dayjs";

const inTest = process.env.NODE_ENV === "test";

export const log = logger({
  ...(!inTest && { transport: { target: "pino-pretty" } }),
  base: {
    pid: false,
  },
  timeStamp: () => `"time": "${dayjs().format()}`,
});
