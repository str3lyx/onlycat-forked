
const mongoose = require('mongoose');
const { model, Schema } = mongoose;
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