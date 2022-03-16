const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const jwt = require('jsonwebtoken')
// this secret only use for development use(require('crypto').randomBytes(64).toString('hex'))
const TOKEN_SECRET = 'this-is-my-secret-for-development'
const app = express()
const port = 5000

app.use(cors())

const only_cat_data = {
    'mabin_canny_stage_09': {
        reaction: {
            like: 0,
            dislike: 0
        }
    }
}

const authenticated = (req, res, next) => {
    const auth_header = req.headers['authorization']
    const token = auth_header && auth_header.split(' ')[1]
    if (!token) return res.sendStatus(401)
    jwt.verify(token, TOKEN_SECRET, (err, data) => {
        if (err) return res.sendStatus(403)
        req.data = {
            username: data.username,
            email: data.email,
            picture: data.picture
        }
        next()
    })
}

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
    let data = {
        username: result.data.name,
        email: result.data.email,
        picture: result.data.picture
    }
    let access_token = jwt.sign(data, TOKEN_SECRET, { expiresIn: '3h' })
    res.send({ access_token })
})

app.get('/api/info', authenticated, (req, res) => {
    res.send(req.data)
})


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})