import React, {useState, useEffect} from 'react'
const axios = require('axios')

function ImagePost(props)
{
  const [reaction, setReaction] = useState({ like: 0, dislike: 0 })
  
  const onBtnLike_click = (e) => {
    const data = {img: props.img, reaction: {like: 1, dislike: 0}}
    axios.post('http://localhost:5000/api/react', data)
      .then((res) => {
        updateData()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const onBtnDislike_click = (e) => {
    const data = {img: props.img, reaction: {like: 0, dislike: 1}}
    axios.post('http://localhost:5000/api/react', data)
      .then((res) => {
        updateData()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const updateData = () => {
    axios.get(`http://localhost:5000/api/data/reactions?img=${props.img}`)
      .then((res) => {
        setReaction(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    updateData()
  })

  return (
    <div>
      <img src={props.url} alt="" />
      <div>
        <button onClick={onBtnLike_click}>Like: {reaction.like}</button>
        <button onClick={onBtnDislike_click}>Dislike: {reaction.dislike}</button>
      </div>
    </div>
  )
}

export default ImagePost