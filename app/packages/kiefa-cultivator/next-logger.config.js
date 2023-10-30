const pino = require("pino");

const logger = (defaultConfig) =>
  pino({
    ...defaultConfig,
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
  });

module.exports = {
  logger,
};
