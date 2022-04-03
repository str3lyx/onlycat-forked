import * as React from 'react'
import {Modal, Box, Button, Typography} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import axios from 'axios';
import config from '../../config';
import style from '../../styleEngine'

export default function ModalUpload(props) {

  const tempOpen = React.useRef(props.open)
  const [open, setOpen] = React.useState(tempOpen.current);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [preview, setPreview] = React.useState("")
  const [caption, setCaption] = React.useState("");


  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setCaption("");
    setPreview("");
    props.handleClose(false);
  }

  React.useEffect(() => {
    setOpen(props.open)
    tempOpen.current = props.open
  }, [props.open])

  const submitForm = (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedFile.type.match(/image.*/)) {
      alert('อนุญาติเฉพาะรูปภาพเท่านั้น')
      return
    }
    let formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("caption", caption);
    // for (var key of formData.entries()) {
    // }
    axios
      .post(`${config.apiUrlPrefix}/upload/image`, formData)
      .then((res) => {
        alert("อัพโหลดสำเร็จ");
        window.location.reload()
      })
      .catch((err) => {
        alert("เกิดข้อผิดผลาด: " + err.data)
      });
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style.modal}>
          <Box sx={style.modal.upload}>
            <Box variant="contained" component="label">
              <Box style={style.upload.main.main} sx={selectedFile ? style.upload.main.active : style.upload.main.disactive}>
                <img sx={style.upload.main.image} src={preview} alt=""/>
                <Box sx={style.upload.main.description} className="upload-description">
                  <CloudUploadIcon sx={{fontSize: '20vmin'}}/>
                  <Typography sx={{fontSize: "80%"}}>คลิกเพื่ออัพโหลดรูปของคุณ</Typography>
                </Box>
              </Box>
              <input
                type="file"
                accept="image/*"
                id="upload-button-file"
                name="file"
                onChange={(e) => {
                  setSelectedFile(e.target.files[0])
                  setPreview(URL.createObjectURL(e.target.files[0]))
                }}
                hidden
              />
            </Box>
            <textarea placeholder="คุณมีแคปชั่นจะลงให้กับรูปนี้" onInput={(e) => setCaption(e.target.value)} style={style.upload.caption}></textarea>
          </Box>
          <Box sx={style.upload.setBtn.main}>
            <Button onClick={handleClose} sx={style.upload.setBtn.btnCancel}>ยกเลิก</Button>
            <Button onClick={submitForm} sx={style.upload.setBtn.btnPost}>โพสต์เลย !!!</Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}