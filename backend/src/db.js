
const mongoose = require('mongoose');
const config = require('../config');

const { DB: { host, port, name } } = config;
const connection_uri = `mongodb://${host}:${port}/${name}`;
mongoose.connect(connection_uri, function (error) {
    if (error) {
        console.log('mongodb error')
    } else {
        console.log('mongodb connected')
    }
});

module.exports = mongoose;