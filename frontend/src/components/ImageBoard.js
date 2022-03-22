import * as React from 'react'
import ImagePost from './ImagePost'
import { Grid } from '@mui/material'

const axios = require('axios')

function ImageBoard(props) {
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    axios.get(`${process.env['REACT_APP_BACKEND_URL']}/api/data`)
      .then((res) => {
        setData(res.data)
      })
  }, [])

  return (
    <Grid container spacing={2}
      sx={{ bgcolor: '#000000', width: '90%', padding: '20px', boxSizing: 'border-box' }}
      m='auto'
    >
      {
        data.map((img_name) => {
          return (
            <Grid item xs={3}>
              <ImagePost key={img_name} img={img_name} user={props.user} />
            </Grid>
          )
        })
      }
    </Grid>
  )
}

export default ImageBoard