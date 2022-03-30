
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
    level: 'info', // for production
    format: winston.format.json(),
    // defaultMeta: { service: 'user-service' },
});

if (process.env.NODE_ENV !== 'production') {
    logger.level = 'debug'
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }))
} else {
    logger.add(new winston.transports.File({ filename: 'log/error.log', level: 'error' }))
    logger.add(new winston.transports.File({ filename: 'log/out.log', level: 'info' }))
}

module.exports = { logger, expressLogger };