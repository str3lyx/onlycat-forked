
const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const config = require('../config');
const { logger } = require('./logger');

const { DB: { host, port, name } } = config;
const connection_uri = `mongodb://${host}:${port}/${name}`;
var db = mongoose.connection;
const connectMongodb = () => {
    mongoose.connect(connection_uri, (error) => {
        if (error) {
            logger.error('Error in MongoDB connection: ' + error);
            mongoose.disconnect();
        }
    })
};
db.on('disconnected', function () {
    logger.error('MongoDB disconnected!');
    connectMongodb()
});
db.on('reconnected', function () {
    logger.info('MongoDB reconnected!');
});
db.on('connected', function () {
    logger.info('MongoDB connected!');
});
db.on('connecting', function () {
    logger.debug('connecting to MongoDB...');
});
connectMongodb()

const User = model("User", Schema({
    id: { type: String, required: true }, // id from oauth
    name: { type: String, required: true },
    email: { type: String, required: true },
    pictureUrl: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now() },
    reaction: {
        like: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
        disLike: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
    },
}))

// const ReactionSchema = Schema({ like: { type: Schema.Types.ObjectId, ref: 'User' }, disLike: { type: Schema.Types.ObjectId, ref: 'User' } })
const Post = model("Post", Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String },
    reaction: {
        like: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        disLike: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    image: { type: { binData: Buffer, contentType: String, fileName: String, }, required: true },
    createdAt: { type: Date, required: true, default: Date.now() },
    updatedAt: { type: Date, required: true, default: Date.now() },
}))

module.exports = { User, Post };