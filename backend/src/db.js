
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
    console.log('MongoDB connected!');
});
db.on('connecting', function () {
    logger.debug('connecting to MongoDB...');
});
connectMongodb()

const Users = model("User", Schema({
    _id: Schema.Types.ObjectId,
    username: { type: String, required: true },
    email: { type: String, required: true },
    picture: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now() },
}))

const ReactionSchema = Schema({ like: { type: Number, default: 0 }, disLike: { type: Number, default: 0 } })
const Posts = model("Post", Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String },
    reactions: [ReactionSchema],
    image: { type: { binData: Buffer, contentType: String }, required: true },
    createdAt: { type: Date, required: true, default: Date.now() },
    updatedAt: { type: Date, required: true, default: Date.now() },
}))

module.exports = { Users, Posts };