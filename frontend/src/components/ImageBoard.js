import * as React from 'react'
import ImagePost from './ImagePost'
import Box from '@mui/material/Box'

const axios = require('axios')

function ImageBoard()
{
  const [data, setData] = React.useState([])

  React.useEffect( async () => {
    axios.get('http://localhost:5000/api/data')
        .then((res) => {
          setData(res.data)
        })
  }, [])

  return (
    <Box 
      sx={{bgcolor: '#000000', width: '90%', padding: '20px', boxSizing: 'border-box'}}
      m='auto'
    >
    {
      data.map(img_name => <ImagePost key={img_name} img={img_name}/>)
    }
    </Box>
  )
}

export default ImageBoard