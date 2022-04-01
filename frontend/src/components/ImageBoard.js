import * as React from 'react'
import ImagePost from './ImagePost'
import { Grid, Box } from '@mui/material'
import config from '../config';

const axios = require('axios')

function ImageBoard(props) {
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    axios.get(`${config.apiUrlPrefix}/data/post?search=${props.searchData}`)
      .then((res) => {
        setData(res.data)
        // console.log("board ", res.data)
      })
  }, [props.searchData])

  return (
    <Grid container spacing={2}
      sx={{ bgcolor: '#000000', width: '90%', padding: '20px', boxSizing: 'border-box' }}
      m='auto'
    >
      {
        data.length > 0 ? (
          data.map((data) => {
            <Grid item xs={3} key={"GridImagePost-" + data._id}>
              <ImagePost postId={data._id} user={props.user} />
            </Grid>
          })
        ):(
          <Grid item xs={12} key='noData'>
            <Box sx={{color: '#ffffff'}}>ดูเหมือนว่าจะยังไม่มีคนโพสต์อะไรลงเลยนะ</Box>
          </Grid>
        )
      }
    </Grid>
  )
}

export default ImageBoard