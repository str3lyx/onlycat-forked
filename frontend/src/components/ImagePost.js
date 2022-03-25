import * as React from 'react'
import { Typography, Avatar, Button, Box, Grid } from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import config from '../config';

const axios = require('axios')

function ImagePost(props) {
  const [userData, setUserData] = React.useState(null)
  const [imgData, setImgData] = React.useState(null)

  React.useEffect(() => {
    updateData()
  }, [])

  const onBtnReaction_click = (react) => {
    if (sessionStorage.getItem('access_token') == null) {
      alert('คุณยังไม่ได้ login')
      return
    }
    var data = { img: props.img, reaction: react }
    console.log(data)
    axios.post(`${config.apiUrlPrefix}/react`, data)
      .then((res) => {
        updateData()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const updateData = () => {
    // get image and user data
    axios.get(`${config.apiUrlPrefix}/data?img=${props.img}`)
      .then((res) => {
        console.log(res)
        setImgData(res.data)

        // get author's user data
        axios.get(`${config.apiUrlPrefix}/data?user=${res.data.author}`)
          .then((res2) => {
            setUserData(res2.data)
          })
          .catch((err) => { })
      })
      .catch((err) => { })
  }

  return (
    <Box mx={0} my={0} sx={{ borderRadius: '12px', backgroundColor: '#3d3d3d' }}>
      {userData ?
        <Grid container width="100%" px={1} spacing={1} marginBottom={1}>
          <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Avatar
              alt={userData.name}
              src={userData.picture}
            >
              {userData.picture === '' ? userData.name[0] : ''}
            </Avatar>
          </Grid>
          <Grid item xs={10} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="div">
              <Typography
                sx={{ color: '#ffffff', fontWeight: 600 }}
              >
                {userData.name === '' || !userData.name ? '\u00a0' : userData.name}
              </Typography>
              <Typography
                sx={{ color: '#cecece', fontSize: 10 }}
              >
                {imgData.date === '' || !imgData.date ? '\u00a0' : imgData.date}
              </Typography>
            </Box>
          </Grid>
        </Grid> : ''}
      <Box
        component="img"
        src={imgData ? imgData.img : ''}
        alt=""
        sx={{ width: '100%', height: 'auto' }}
      />
      <Typography
        sx={{ color: '#FFFFFF' }}
        px={1}
      >
        {imgData ? imgData.caption : ''}
      </Typography>
      <Grid container>
        <Grid item xs={6}>
          <Button
            onClick={(e) => onBtnReaction_click('like')}
            sx={{
              backgroundColor: '#4d4d4d', color: '#ffffff', width: '100%',
              borderTopLeftRadius: 0, borderTopRightRadius: 0,
              borderBottomLeftRadius: '12px', borderBottomRightRadius: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            mx={0}
          >
            <ThumbUpIcon />
            <Typography mx={1}>
              {imgData ? imgData.reaction.like.length : 0}
            </Typography>
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            onClick={(e) => onBtnReaction_click('dislike')}
            sx={{
              backgroundColor: '#4d4d4d', color: '#ffffff', width: '100%',
              borderTopLeftRadius: 0, borderTopRightRadius: 0,
              borderBottomLeftRadius: 0, borderBottomRightRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            mx={0}
          >
            <ThumbDownIcon />
            <Typography mx={1}>
              {imgData ? imgData.reaction.dislike.length : 0}
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ImagePost