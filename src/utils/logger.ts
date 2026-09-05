import winston from 'winston';
import path from 'path';

// Define the log file path
const logDir = path.join(process.cwd(), 'logs');

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.json()
    ),
    transports: [
        // Write error logs to logs/error.log
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error' }),
            // Write all logs (info, warn, error) to logs/combined.log
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log')
        }),
    ],
});

// If you're not in production, also output logs to the terminal console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}