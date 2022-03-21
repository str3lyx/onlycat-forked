import * as React from 'react'
const axios = require('axios')

function ImagePost(props)
{
  const [imgUrl, setImgUrl] = React.useState('')
  const [reaction, setReaction] = React.useState({ like: 0, dislike: 0 })

  React.useEffect(() => {
    updateData()
  }, [])
  
  const onBtnLike_click = (e) => {
    if(sessionStorage.getItem('access_token') == null)
    {
      alert('คุณยังไม่ได้ login')
      return
    }
    console.log(props.user)
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
    if(sessionStorage.getItem('access_token') == null)
    {
      alert('คุณยังไม่ได้ login')
      return
    }
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
    axios.get(`http://localhost:5000/api/data?img=${props.img}`)
      .then((res) => {
        console.log(res)
        setImgUrl(res.data.img)
      })
      .catch((err) => {})
    
    axios.get(`http://localhost:5000/api/data/reactions?img=${props.img}`)
      .then((res) => {
        setReaction(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <div>
      <img src={imgUrl} alt="" />
      <div>
        <button onClick={onBtnLike_click}>Like: {reaction.like}</button>
        <button onClick={onBtnDislike_click}>Dislike: {reaction.dislike}</button>
      </div>
    </div>
  )
}

export default ImagePost