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
            {
              data.map((col) => {
                return renderColumn(col, props.user)
              })
            }
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

function renderColumn(col, user)
{
  return <Grid item xs={3}>
    <Grid container spacing="15px">
    {
      col.map((data) => {
        return <Grid item xs={12}>
          <ImagePost postId={data._id} user={user} />
        </Grid>
      })
    }
    </Grid>
  </Grid>
}