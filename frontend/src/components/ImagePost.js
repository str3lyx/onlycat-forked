import * as React from 'react'
import { Typography, Avatar, Button, Box, Grid } from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import config from '../config';
import style from '../styleEngine'

const axios = require('axios')

function ImagePost(props) {
  const [react, setReactData] = React.useState('')
  const [postData, setPostData] = React.useState(null)

  React.useEffect(() => {
    updateData()
  }, [])

  const onBtnReaction_click = (react) => {
    if (sessionStorage.getItem('access_token') == null) {
      alert('คุณยังไม่ได้ login')
      return
    }
    var data = { postId: props.postId, reaction: react }
    // console.log(data)
    axios.post(`${config.apiUrlPrefix}/react`, data)
      .then((res) => {
        updateData()
      })
      .catch((err) => { })
  }

  const updateData = () => {
    // get image and user data
    axios.get(`${config.apiUrlPrefix}/data/post/${props.postId}`)
      .then((res) => {
        // console.log(res.data)
        setPostData(res.data)
        setReactData('')

        // highlight like and dislike pressed button
        if (props.user) {
          if (res.data.post.reaction.like.includes(props.user._id)) {
            setReactData('like')
          }
          if (res.data.post.reaction.disLike.includes(props.user._id)) {
            setReactData('dislike')
          }
        }
      }).catch((err) => { })
  }

  return (
    <Box mx={0} my={0} sx={style.post.cardBorder}>
      {postData &&
        <Box sx={style.post.cardDetail.main}>
          <Box>
            <Avatar
              sx={style.post.cardDetail.picture}
              alt={getAuthorName(postData)}
              src={getAuthorProfilePic(postData)}
            >
              { postData.post.author ? (postData.post.author.pictureUrl === '' ? postData.post.author.name[0] : '') : '?' }
            </Avatar>
          </Box>
          <Box>
            <Typography sx={style.post.cardDetail.author}>{getAuthorName(postData)}</Typography>
            <Typography sx={style.post.cardDetail.date}>{"โพสวันที่: " + getPostDate(postData)}</Typography>
            <Typography sx={style.post.cardDetail.date}>{"เวลา: " + getPostTime(postData)}</Typography>
          </Box>
        </Box>
      }
      <Box
        component="img"
        src={postData ? `data:${postData.post.image.contentType};base64,${postData.imageBase64}` : ''}
        alt=""
        sx={{ width: '100%', height: 'auto' }}
      />
      <Typography
        sx={{ color: '#FFFFFF' }}
        px={1}
      >
        {postData ? postData.post.caption : ''}
      </Typography>
      <Grid container>
        <Grid item xs={6}>
          <Button
            onClick={(e) => onBtnReaction_click('like')}
            sx={{
              backgroundColor: '#4d4d4d',
              color: `${react === 'like' ? '#00ff00' : '#ffffff'}`,
              width: '100%',
              borderTopLeftRadius: 0, borderTopRightRadius: 0,
              borderBottomLeftRadius: '12px', borderBottomRightRadius: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            mx={0}
          >
            <ThumbUpIcon />
            <Typography mx={1}>
              {postData ? postData.post.reaction.like.length : 0}
            </Typography>
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            onClick={(e) => onBtnReaction_click('dislike')}
            sx={{
              backgroundColor: '#4d4d4d',
              color: `${react === 'dislike' ? '#ff0000' : '#ffffff'}`,
              width: '100%',
              borderTopLeftRadius: 0, borderTopRightRadius: 0,
              borderBottomLeftRadius: 0, borderBottomRightRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            mx={0}
          >
            <ThumbDownIcon />
            <Typography mx={1}>
              {postData ? postData.post.reaction.disLike.length : 0}
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Box >
  )
}

export default ImagePost

// -------------------------------------------------------------------------------- //

function getAuthorName(postData)
{
  if(!postData.post.author) return 'Unknown User'
  if(postData.post.author.name === '' || !postData.post.author.name) return '\u00a0'; // &nbsp
  return postData.post.author.name
}

function getAuthorProfilePic(postData)
{
  if(!postData.post.author) return ''
  if(!postData.post.author.pictureUrl) return ''
  return postData.post.author.pictureUrl
}

function getPostDate(postData)
{
  if(!postData.post.author) return '-----'
  return new Date(postData.post.author.createdAt).toLocaleDateString()
}

function getPostTime(postData)
{
  if(!postData.post.author) return '-----'
  return new Date(postData.post.author.createdAt).toLocaleTimeString()
}