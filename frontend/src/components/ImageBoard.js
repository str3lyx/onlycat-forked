import * as React from 'react'
import ImagePost from './ImagePost'
import { Grid } from '@mui/material'
import config from '../config';

const axios = require('axios')

function ImageBoard(props) {
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    axios.get(`${config.apiUrlPrefix}/data/post`)
      .then((res) => {
        setData(res.data)
        // console.log("board ", res.data)
      })
  }, [])

  return (
    <Grid container spacing={2}
      sx={{ bgcolor: '#000000', width: '90%', padding: '20px', boxSizing: 'border-box' }}
      m='auto'
    >
      {
        data.map((data) => {
          return (
            <Grid item xs={3} key={"GridImagePost-" + data._id}>
              <ImagePost postId={data._id} user={props.user} />
            </Grid>
          )
        })
      }
    </Grid>
  )
}

export default ImageBoard