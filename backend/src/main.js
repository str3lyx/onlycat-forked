const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const multer = require('multer');
const upload = multer();

const config = require('../config');
const { expressLogger, logger } = require('./logger')
const models = require('./db')

// this secret only use for development use(require('crypto').randomBytes(64).toString('hex'))
const TOKEN_SECRET = config.TOKEN_SECRET
const app = express()
const port = process.env['SERVER_PORT'] || 5000

app.use(cors())
app.use('/img', express.static('public'))
app.use(expressLogger);
app.use(bodyParser.json())

const authenticated = (req, res, next) => {
    const auth_header = req.headers['authorization']
    const token = auth_header && auth_header.split(' ')[1]
    if (!token) return res.sendStatus(401)
    jwt.verify(token, TOKEN_SECRET, (err, data) => {
        if (err) return res.sendStatus(403)
        req.data = {
            ...req.data,
            userId: data.id
        }
        next()
    })
}


app.get('/api/data/post/:_id?', async (req, res) => {
    let post = null;
    if (req.params._id) {
        post = await models.Post.findById(req.params._id).populate('author').exec()
        post = { post, imageBase64: post.image.binData.toString('base64') }
        // logger.debug(post)
    } else {
        // logger.debug(req.query.search.replace(/\s+/g, '|'))
        if (req.query.search) {
            post = await models.Post.find({ caption: { "$regex": req.query.search.replace(/\s+/g, '|'), "$options": "i" } }).exec()
        } else
            post = await models.Post.find({}, '_id').exec()
        // logger.debug("all", post)
    }

    if (post == null) {
        res.status(404).send()
        return
    }
    res.send(post)
}
)

app.get('/api/random/cat', async (req, res) => {
    let result = await axios.get('https://api.thecatapi.com/v1/images/search?format=json&limit=1')
    // logger.info(result.data[0])
    res.send(result.data[0].url)
})

app.post('/api/react', [authenticated, bodyParser.json()], async (req, res) => {
    let postId = req.body.postId
    let reaction = req.body.reaction
    const post = await models.Post.findById(postId).exec()
    // image not found
    if (!post) {
        res.sendStatus(404)
        return
    }

    const userId = req.data.userId
    const user = await models.User.findById(userId).exec()

    if (reaction == 'like') {
        if (!post.reaction.like.includes(user._id)) { // like
            logger.info(user.name + " like post " + "(id:" + post._id + ")")
            post.reaction.like.push(user._id)
            user.reaction.like.push(post._id)
            if (post.reaction.disLike.includes(user._id)) { // remove dislike if have
                let userIndex = post.reaction.disLike.indexOf(user._id)
                let postIndex = user.reaction.disLike.indexOf(post._id)
                post.reaction.disLike.splice(userIndex, 1);
                user.reaction.disLike.splice(postIndex, 1);
            }
        } else { // unlike
            logger.info(user.name + " unlike post " + "(id:" + post._id + ")")
            let userIndex = post.reaction.like.indexOf(user._id)
            let postIndex = user.reaction.like.indexOf(post._id)
            post.reaction.like.splice(userIndex, 1);
            user.reaction.like.splice(postIndex, 1);
        }
    } else if (reaction == 'dislike') {
        if (!post.reaction.disLike.includes(user._id)) { // dislike
            logger.info(user.name + " dislike post " + "(id:" + post._id + ")")
            post.reaction.disLike.push(user._id)
            user.reaction.disLike.push(post._id)
            if (post.reaction.like.includes(user._id)) { // remove like if have
                let userIndex = post.reaction.like.indexOf(user._id)
                let postIndex = user.reaction.like.indexOf(post._id)
                post.reaction.like.splice(userIndex, 1);
                user.reaction.like.splice(postIndex, 1);
            }
        } else { // undislike
            logger.info(user.name + " undislike post " + "(id:" + post._id + ")")
            let userIndex = post.reaction.disLike.indexOf(user._id)
            let postIndex = user.reaction.disLike.indexOf(post._id)
            post.reaction.disLike.splice(userIndex, 1);
            user.reaction.disLike.splice(postIndex, 1);
        }
    }
    post.save()
    user.save()
    res.sendStatus(200)
})

app.post('/api/login', async (req, res) => {
    let token = req.body.token
    let result = await axios.get('https://graph.facebook.com/me', {
        params: {
            fields: 'id,name,email,picture',
            access_token: token
        }
    })

    if (!result.data.id) {
        res.sendStatus(403)
        return
    }

    // found user data
    var data = {
        id: result.data.id,
        name: result.data.name,
        email: result.data.email,
        picture: result.data.picture,
    }

    // check data in database
    let user = await models.User.findOne({ id: data.id }).exec() // find by auth id
    if (user != null) {
        // return db id
        let access_token = jwt.sign({ id: user._id }, TOKEN_SECRET, { expiresIn: '3h' })
        res.send({ access_token })
    } else {
        models.User.create({
            id: data.id,
            name: data.name,
            email: data.email,
            pictureUrl: data.picture.data.url,
            createdAt: new Date(),
        }, function (err, result) {
            if (err) {
                logger.error(err);
                res.status(500).send()
            } else {
                logger.info("Created user To database Name: " + result.name + " (id: " + result._id + " )");
                let access_token = jwt.sign({ id: result._id }, TOKEN_SECRET, { expiresIn: '3h' })
                res.send({ access_token })
            }
        })
    }
})
app.post('/api/upload/image', authenticated, upload.single('file'), async (req, res) => {
    const user = await models.User.findOne({ _id: req.data.userId }).exec()
    let img = req.file
    models.Post.create({
        author: user._id,
        caption: req.body.caption,
        image: { binData: img.buffer, contentType: img.mimetype, fileName: img.originalname }
    }, function (err, result) {
        if (err) {
            logger.error(err);
            res.status(500).send()
        } else {
            logger.info("Saved image To database by " + user.name + " (id: " + result._id + " )");
            res.send({ ok: 1 });
        }
    })
})

app.get('/api/info', authenticated, async (req, res) => {
    const user = await models.User.findOne({ _id: req.data.userId }).exec()
    if (!user) {
        res.sendStatus(401)
        return
    }
    res.send(user)
})

app.listen(port, () => {
    logger.info(`Example app listening on port ${port}`)
})

// ----------------------------- utils ----------------------------------------- //

// function isUserRegistered(acc_id, tag) {
//     for (let index of Object.keys(users)) {
//         if (users[index].account[tag] === acc_id)
//             return index
//     }
//     return null
// }