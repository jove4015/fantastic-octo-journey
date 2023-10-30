import pino from "pino";

const logger = (requestId?: string) => {
  if (!requestId) {
    requestId = Math.random().toString(36).substring(2, 9);
  }
  return pino({
    level: process.env.PINO_LOG_LEVEL || "info",
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
    mixin() {
      return {
        requestId,
      };
    },
  });
};

export { logger };
