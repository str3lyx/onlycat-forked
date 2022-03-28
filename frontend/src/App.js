import * as React from 'react'
import axios from 'axios';
import MenuAppBar from './components/MenuAppBar'
import ImageBoard from './components/ImageBoard';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

  const [user, setUserData] = React.useState(null)

  const userData = (data) => {
    setUserData(data)
    // console.log(data)
  }

  return (
    <ThemeProvider theme={theme}>
      <MenuAppBar userData={userData} />
      <ImageBoard user={user} />
    </ThemeProvider>
  );
}

export default App;
