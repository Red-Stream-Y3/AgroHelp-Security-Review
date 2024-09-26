/**
 * This file is used to log info to a file
 * Three log levels exist: info, warning, error
 */

import fs from 'fs';
import path from 'path';

export const LOG = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
};
const __dirname = path.resolve();

const log = (level, message) => {
  const logMessage = `${new Date().toISOString()} [${level.toUpperCase()}]: ${message}\n`;

  const logPath = path.join(__dirname, '../logs');
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
  }

  const logFile = path.join(logPath, `${level}.log`);
  fs.appendFileSync(logFile, logMessage);
  console.log(logMessage);
};

const info = (message) => {
  log(LOG.INFO, message);
};

const warning = (message) => {
  log(LOG.WARNING, message);
};

const error = (message) => {
  log(LOG.ERROR, message);
};

export default { info, warning, error };
