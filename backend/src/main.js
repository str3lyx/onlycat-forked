const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const crypto = require('crypto')
const config = require('../config');
const { expressLogger, logger } = require('./logger')
const mongoose = require('./db')

// this secret only use for development use(require('crypto').randomBytes(64).toString('hex'))
const TOKEN_SECRET = config.TOKEN_SECRET
const app = express()
const port = process.env['SERVER_PORT'] || 5000

app.use(cors())
app.use('/img', express.static('public'))
app.use(expressLogger);

const only_cat_data = {
    'mabin_canny_stage_09': {
        img: 'http://localhost:5000/img/mabin_canny_09.png',
        author: '',
        caption: '',
        date: '',
        tags: [],
        reaction: {
            like: 0,
            dislike: 0
        }
    },
    'mabin_canny_stage_08': {
        img: 'http://localhost:5000/img/mabin_canny_09.png',
        author: '',
        caption: '',
        date: '',
        tags: [],
        reaction: {
            like: 0,
            dislike: 0
        }
    }
}

const users = {
    placeholder : {
        name: '',
        picture: '',
        date: '',
        account: {
            facebook: ''
        },
        reaction : {
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
    else
        res.send(JSON.stringify(Object.keys(only_cat_data)))
})

app.get('/api/data/reactions', (req, res) => {
    let img = req.query.img
    // image not found
    if (!only_cat_data[img]) {
        res.sendStatus(404)
        return
    }
    // send json of reaction of the target image
    res.send(JSON.stringify(only_cat_data[img].reaction))
    console.log(only_cat_data[img].reaction)
})

app.post('/api/react', bodyParser.json(), (req, res) => {
    let img = req.body.img
    let reaction = req.body.reaction
    // image not found
    if (!only_cat_data[img]) {
        res.sendStatus(404)
        return
    }
    only_cat_data[img].reaction.like += reaction.like
    only_cat_data[img].reaction.dislike += reaction.dislike
    console.log(only_cat_data)
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
    let data = {
        id: result.data.id,
        username: result.data.name,
        email: result.data.email,
        picture: result.data.picture,
        date: new Date()
    }

    // check data in database
    let index = isUserRegistered(data.id, 'facebook')
    if(index == null)
    {
        let name = crypto.createHash('sha256').update(JSON.stringify(data)).digest('base64')
        users[name] = {
            name: data.username,
            picture: data.picture,
            date: data.date,
            account: {
                facebook: data.id
            },
            reaction : {
                like: [],
                dislike: []
            },
            upload: []
        }
        index = name
    }

    let access_token = jwt.sign({id: index}, TOKEN_SECRET, { expiresIn: '3h' })
    res.send({ access_token })
})

app.get('/api/info', authenticated, (req, res) => {
    res.send(users[req.data.id])
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// ----------------------------- utils ----------------------------------------- //

function isUserRegistered(acc_id, tag)
{
    for(let index in users)
    {
        if(users[index].account[tag] === acc_id)
            return Object.keys(users)[index]
    }
    return null
}