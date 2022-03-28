const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const crypto = require('crypto')
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

const only_cat_data = {
    'mabin_canny_stage_09': {
        img: `${config.imgUrlPrefix}/mabin_canny_09.png`,
        author: 'placeholder',
        caption: 'test #rrr#',
        date: new Date(),
        reaction: {
            like: [],
            dislike: []
        }
    },
    'mabin_canny_stage_08': {
        img: `${config.imgUrlPrefix}/mabin_canny_09.png`,
        author: '',
        caption: 'test',
        date: '',
        reaction: {
            like: [],
            dislike: []
        }
    }
}

const users = {
    placeholder: {
        id: 'placeholder',
        name: 'MABIN',
        picture: `${config.imgUrlPrefix}/mabin_canny_09.png`,
        email: '',
        date: '',
        account: {
            facebook: ''
        },
        reaction: {
            like: [],
            dislike: []
        },
        upload: []
    }
}

const authenticated = (req, res, next) => {
    const auth_header = req.headers['authorization']
    const token = auth_header && auth_header.split(' ')[1]
    if (!token) return res.sendStatus(401)
    jwt.verify(token, TOKEN_SECRET, (err, data) => {
        if (err) return res.sendStatus(403)

        req.data = {
            id: data.id
        }
        next()
    })
}

app.get('/api/data', (req, res) => {
    if (Object.keys(only_cat_data).find(data => data === req.query.img))
        res.send(JSON.stringify(only_cat_data[req.query.img]))
    else if (Object.keys(users).find(data => data === req.query.user))
        res.send(JSON.stringify(users[req.query.user]))
    else
        res.send(JSON.stringify(Object.keys(only_cat_data)))
})

app.post('/api/react', [authenticated, bodyParser.json()], (req, res) => {
    let img = req.body.img
    let reaction = req.body.reaction
    // image not found
    if (!only_cat_data[img]) {
        res.sendStatus(404)
        return
    }

    let id = req.data.id
    // handle like and dislike of image
    for (let key of Object.keys(only_cat_data[img].reaction)) {
        let index = only_cat_data[img].reaction[key].findIndex(uid => uid == id)
        if (key != reaction) {
            if (index >= 0) only_cat_data[img].reaction[key].splice(index, 1)
        }
        else {
            if (index >= 0) only_cat_data[img].reaction[key].splice(index, 1)
            else only_cat_data[img].reaction[key].push(id)
        }
    }

    // handle user like and dislike record
    for (let key of Object.keys(users[id].reaction)) {
        let index = users[id].reaction[key].findIndex(ina => ina == img)
        if (key != reaction) {
            if (index >= 0) users[id].reaction[key].splice(index, 1)
        }
        else {
            if (index >= 0) users[id].reaction[key].splice(index, 1)
            else users[id].reaction[key].push(img)
        }
    }
    res.sendStatus(200)
})

app.post('/api/login', bodyParser.json(), async (req, res) => {
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
        username: result.data.name,
        email: result.data.email,
        picture: result.data.picture,
    }

    // check data in database
    let user = await models.User.findOne({ id: data.id }).exec()
    if (user == null) {
        user = new models.User({
            id: data.id,
            username: data.username,
            email: data.email,
            picture_url: data.picture.data.url,
            createdAt: new Date(),
        })
        user.save()

    }
    // console.log(user.id, user._id)

    let access_token = jwt.sign({ id: user.id }, TOKEN_SECRET, { expiresIn: '3h' })
    res.send({ access_token })
})

app.get('/api/info', authenticated, async (req, res) => {
    const user = await models.User.findOne({ id: req.data.id }).exec()
    res.send(user)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// ----------------------------- utils ----------------------------------------- //

function isUserRegistered(acc_id, tag) {
    for (let index of Object.keys(users)) {
        if (users[index].account[tag] === acc_id)
            return index
    }
    return null
}