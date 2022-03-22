
const mongoose = require('mongoose');
const config = require('../config');
const { logger } = require('./logger');

const { DB: { host, port, name } } = config;
const connection_uri = `mongodb://${host}:${port}/${name}`;
mongoose.connect(connection_uri, function (error) {
    if (error) {
        logger.error('mongodb connect error')
    } else {
        logger.debug('mongodb connected')
    }
});

module.exports = mongoose;