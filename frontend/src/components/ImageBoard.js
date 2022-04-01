import * as React from 'react'
import ImagePost from './ImagePost'
import { Grid, Box } from '@mui/material'
import config from '../config';
import style from '../styleEngine.js'

const axios = require('axios')

function ImageBoard(props) {
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    axios.get(`${config.apiUrlPrefix}/data/post?search=${props.searchData}`)
      .then((res) => {
        setData(splitArray(res.data))
        // console.log("board ", res.data)
      })
  }, [props.searchData])

  return (
    <Box
      position="absolute"
      sx={style.dashBoard}
    >
      {
        data.length > 0 ? (
          <Grid container spacing="15px" sx={{px: "15px"}}>
            <Grid item xs={3}>
              {
                data[0].map((data) => {
                  return <ImagePost postId={data._id} user={props.user} />
                })
              }
            </Grid>
            <Grid item xs={3}>
              {
                data[1].map((data) => {
                  return <ImagePost postId={data._id} user={props.user} />
                })
              }
            </Grid>
            <Grid item xs={3}>
              {
                data[2].map((data) => {
                  return <ImagePost postId={data._id} user={props.user} />
                })
              }
            </Grid>
            <Grid item xs={3}>
              {
                data[3].map((data) => {
                  return <ImagePost postId={data._id} user={props.user} />
                })
              }
            </Grid>
          </Grid>
        ) : <Box sx={{color: '#ffffff'}}>ดูเหมือนว่าจะยังไม่มีคนโพสต์อะไรลงเลยนะ</Box>
      }
    </Box>
  )
}

export default ImageBoard

function splitArray(arr)
{
  var cols = [[],[],[],[]]
  for(var i in arr)
  {
    cols[i%4].push(arr[i])
  }
  return cols
}