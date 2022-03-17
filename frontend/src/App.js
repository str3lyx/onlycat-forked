import React from 'react'
import axios from 'axios';
import MenuAppBar from './components/MenuAppBar'
import ImagePost from './ImagePost';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import mabin from './assets/img/mabin_canny_09.png'

const theme = createTheme({
  palette: {
    white: {
      main: '#FFFFFF',
    },
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#eeffff',
      main: '#bbdefb',
      dark: '#8aacc8',
      contrastText: '#000',
    },
  },
  typography: {
    button: {
      textTransform: 'none' // แก้ตัวอักษรถูก render เป็นพิมพ์ใหญ่เอง
    }
  }
});

axios.interceptors.request.use(function (config) {
  const token = sessionStorage.getItem('access_token')
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
}, function (err) {
  return Promise.reject(err)
})

function App() {

  return (
    <ThemeProvider theme={theme}>
      <MenuAppBar />
      <ImagePost img="mabin_canny_stage_09" url={mabin} />
    </ThemeProvider>
  );
}

export default App;
