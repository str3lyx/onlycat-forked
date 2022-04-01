import * as React from 'react';
import Modal from '@mui/material/Modal';
import UploadIcon from '@mui/icons-material/Upload';
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';

import axios from 'axios';
import config from '../config';
import style from '../styleEngine'

export default function UploadButton(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {setOpen(false); setSelectedFile(null); setcaption(""); }

  const [selectedFile, setSelectedFile] = React.useState(null);
  const [caption, setcaption] = React.useState("");

  const submitForm = (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedFile.type.match(/image.*/)) {
      alert('อนุญาติเฉพาะรูปภาพเท่านั้น')
      return
    }
    let formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("caption", e.target.caption.value);
    // for (var key of formData.entries()) {
    //   console.log(key[0] + ', ' + key[1]);
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
      <Tooltip title="สร้างโพสต์ของน้องแมว">
        <Button
          variant="contained" startIcon={<UploadIcon />}
          size="medium"
          aria-label="upload cat image here"
          aria-haspopup="false"
          sx={style.btnUpload}
          onClick={handleOpen}
        >
          โพสใหม่
        </Button>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style.modal}>
          <Box
            variant="contained"
            component="label"
          >
            {
              selectedFile ? <Box style={{backgroundImage: `url(${URL.createObjectURL(selectedFile)})`}} sx={style.upload.main.active}>
                <Box sx={style.upload.fileName}>{selectedFile ? selectedFile.name : ""}</Box>
              </Box> : <Box sx={style.upload.main.disactive} >{"อัพโหลดรูปภาพ"}</Box>
            }
            <input
              type="file"
              accept="image/*"
              id="upload-button-file"
              name="file"
              onChange={(e) => {
                setSelectedFile(e.target.files[0])
              }}
              hidden
            />
          </Box>
          {
            selectedFile && <Box sx={{ mt: '6px', color: '#0000ff' }} style={{ wordWrap: "break-word" }}>คุณยังสามารถเปลี่ยนไฟล์ที่เลือกได้โดยการกดที่รูปภาพอีกครั้ง</Box>
          }
          <TextField
            sx={style.upload.caption}
            variant="filled"
            id="caption-input"
            name="caption"
            onChange={setcaption}
            style={style.upload.main}
          />
          <Button style={{ position: 'absolute', right: 20, bottom: 10 }} variant="outlined" color="success" size="large" endIcon={<SendIcon />} type="submit">โพส</Button>
        </Box>
      </Modal>
    </>)
}