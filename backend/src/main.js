const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')

const app = express()
app.use(cors())
const port = 5000

const only_cat_data = {
    'mabin_canny_stage_09' : {
        reaction: {
            like: 0,
            dislike: 0
        }
    }
}

app.get('/api/data/reactions', (req, res) => {
    let img = req.query.img
    // image not found
    if(!only_cat_data[img])
    {
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
    if(!only_cat_data[img])
    {
        res.sendStatus(404)
        return
    }
    only_cat_data[img].reaction.like += reaction.like
    only_cat_data[img].reaction.dislike += reaction.dislike
    console.log(only_cat_data)
    res.sendStatus(200)
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})