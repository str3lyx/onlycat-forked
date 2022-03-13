import React from 'react'
import mabin from './assets/img/mabin_canny_09.png'
import ImagePost from './ImagePost';
import MenuAppBar from './components/MenuAppBar'
import axios from 'axios';

axios.interceptors.request.use(function (config) {
  const token = sessionStorage.getItem('access_token')
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
}, function (err) {
  return Promise.reject(err)
})

function App() {

  return (
    <div>
      <MenuAppBar />
      <ImagePost img="mabin_canny_stage_09" url={mabin} />
    </div>
  );
}

export default App;
