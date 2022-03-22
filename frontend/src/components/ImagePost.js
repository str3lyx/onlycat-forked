import * as React from 'react'
import { Typography, Avatar, Button, Box } from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import '../css/utils.css'
const axios = require('axios')

function ImagePost(props)
{
  const [userData, setUserData] = React.useState(null)
  const [imgData, setImgData] = React.useState(null)

  React.useEffect(() => {
    updateData()
  }, [])
  
  const onBtnReaction_click = (react) => {
    if(sessionStorage.getItem('access_token') == null)
    {
      alert('คุณยังไม่ได้ login')
      return
    }
    var data = {img: props.img, reaction: react}
    console.log(data)
    axios.post('http://localhost:5000/api/react', data)
      .then((res) => {
        updateData()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const updateData = () => {
    // get image and user data
    axios.get(`http://localhost:5000/api/data?img=${props.img}`)
    .then((res) => {
      console.log(res)
      setImgData(res.data)

      // get author's user data
      axios.get(`http://localhost:5000/api/data?user=${res.data.author}`)
      .then((res2) => {
        setUserData(res2.data)
      })
      .catch((err) => {})
    })
    .catch((err) => {})
  }

  return (
    <Box component="span">
      <Box
        component="div"
        sx={{display: 'flex'}}
      >
        {userData ? <>
          <Avatar
            alt={userData.name}
            src={userData.picture}
          >
            {userData.picture === '' ? userData.name[0] : ''}
          </Avatar>
          <Box component="div" mx={1}>
            <Typography
              sx={{color: '#ffffff'}}
            >
              {userData.name}
            </Typography>
            <Typography
              sx={{color: '#cecece'}}
            >
              {imgData.date}
            </Typography>
          </Box>
        </> : ''}
      </Box>
      <Typography
        sx={{color: '#FFFFFF'}}
      >
        {imgData ? imgData.caption : ''}
      </Typography>
      <Box
        component="img"
        src={imgData ? imgData.img : ''}
        alt=""
        sx={{width:'256px', height:'auto'}}
      />
      <Box component="div" sx={{display: 'flex'}}>
        <Button
          onClick={(e) => onBtnReaction_click('like')}
          sx={{backgroundColor: '#4d4d4d', color: '#ffffff'}}
          width='auto'
          mx={0}
          className='center-content-flex'
        >
          <ThumbUpIcon />
          <Typography mx={1}>
            {imgData ? imgData.reaction.like.length : 0}
          </Typography>
        </Button>
        <Button
          onClick={(e) => onBtnReaction_click('dislike')}
          sx={{backgroundColor: '#4d4d4d', color:'#ffffff'}}
          width='auto'
          mx={0}
          className='center-content-flex'
        >
          <ThumbDownIcon />
          <Typography mx={1}>
            {imgData ? imgData.reaction.dislike.length : 0}
          </Typography>
        </Button>
      </Box>
    </Box>
  )
}

export default ImagePost