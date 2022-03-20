
const winston = require('winston');
const expressWinston = require('express-winston');

const expressLogger = expressWinston.logger({ // default level is info
    transports: [
        new winston.transports.Console({
            level: 'info'
        })
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    // format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    meta: false,
    msg: "Express {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}",
    // expressFormat: true, // override all msg, if true above config "msg" wont work
    colorize: true,
    ignoreRoute: function (req, res) { return false; }
})

const logger = winston.createLogger({
    level: 'error', // for production
    format: winston.format.json(),
    // defaultMeta: { service: 'user-service' },
    transports: [
        // dont write to file (for now)
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }))
    logger.level = 'debug'
}

module.exports = { logger, expressLogger };