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
        setData(res.data)
        // console.log("board ", res.data)
      })
  }, [props.searchData])

  return (
    <Box
      position="absolute"
      sx={{backgroundColor:"#000000", width: '90%', minHeight: `calc(100% - ${style.topbar.main.height})`, boxSizing: 'border-box'}}
      mx="5%"
      px="20px"
      py="20px"
    >
      <Grid container spacing={2}
        sx={{ width: '100%' }}
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
    </Box>
  )
}

export default ImageBoard