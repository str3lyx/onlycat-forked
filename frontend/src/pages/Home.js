import * as React from 'react'
import ImagePost from '../components/ImagePost'
import { Grid, Box, Button } from '@mui/material'
import config from '../config';
import style from '../styleEngine.js'
import UploadIcon from '@mui/icons-material/Upload';

const axios = require('axios')

export default function Home(props) {
  const [data, setData] = React.useState([])
  const [cache, setCache] = React.useState([])

  React.useEffect(() => {
    axios.get(`${config.apiUrlPrefix}/data/post?search=`)
    .then((res) => {
      setCache(res.data)
    })
  }, [])

  React.useEffect(() => {
    axios.get(`${config.apiUrlPrefix}/data/post?search=${props.searchData}`)
      .then((res) => {
        setData(splitArray(res.data))
      })
  }, [props.searchData])

  return (
    <Box
      position="absolute"
      sx={style.dashBoard}
    >
      {
        cache.length > 0 ? 
          isEmpty(data) ? (
            <Box sx={style.zeroPost}>
              <Box sx={{fontSize: "5vmax", mb: "2vh"}}>(╯°□°）╯︵ ┻━┻</Box>
              <Box>เราไม่พบโพสต์ที่ตรงตามการค้นหาของคุณ</Box>
              <Box>ลองตรวจการสะกดของคุณดู เผื่อคุณอาจจะพิมพ์ผิดก็ได้ (¯―¯٥)</Box>
            </Box>
          ) :
          <Grid container spacing="15px" sx={{px: "15px"}}>
            {
              data.map((col,index) => {
                return renderColumn(col, index, props.user)
              })
            }
          </Grid>
         :
        <Box sx={style.zeroPost}>
          <Box sx={{fontSize: "5vmax", mb: "2vh"}}>¯\_(ツ)_/¯</Box>
          <Box>ดูเหมือนว่าจะยังไม่มีคนโพสต์อะไรลงเลยนะ!!! รอสักครู่</Box>
          {props.user && <Box sx={{display:"flex", alignItems: "center"}}>
            หรือจะเป็นคนแรกที่โพสต์ สร้างโพสต์ได้ที่
            <Button
              variant="contained" startIcon={<UploadIcon />}
              size="medium"
              aria-label="upload cat image here"
              aria-haspopup="false"
              sx={style.btnUpload}
              disabled
            >
              โพสต์ใหม่
            </Button>
          </Box>}
        </Box>
      }
    </Box>
  )
}

function splitArray(arr)
{
  var cols = [[],[],[],[]]
  for(var i in arr)
  {
    cols[i%4].push(arr[i])
  }
  return cols
}

function renderColumn(col, i, user)
{
  return <Grid key={i} item xs={3}>
    <Grid container spacing="15px">
    {
      col.map((data, index) => {
        return <Grid key={index} item xs={12}>
          <ImagePost postId={data._id} user={user} />
        </Grid>
      })
    }
    </Grid>
  </Grid>
}

function isEmpty(cols)
{
  for(var col of cols)
  {
    if(col.length > 0) return false
  }
  return true
}