import React from 'react'
import mabin from './assets/img/mabin_canny_09.png'
import ImagePost from './ImagePost';
import MenuAppBar from './components/appbar'

function App() {

  return (
    <div>
      <MenuAppBar />
      <ImagePost img="mabin_canny_stage_09" url={mabin} />
    </div>
  );
}

export default App;
