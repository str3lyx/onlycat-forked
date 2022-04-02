import * as React from 'react';

import UploadIcon from '@mui/icons-material/Upload';
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button';

import style from '../styleEngine'
import ModalUpload from './upload/ModalUpload';

export default function UploadButton(props) {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = (open) => {setOpen(open)}

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
          โพสต์ใหม่
        </Button>
      </Tooltip>
      <ModalUpload open={open} handleClose={handleClose} />
    </>)
}