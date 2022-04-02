import { Modal, Box, Avatar, Typography } from "@mui/material";
import * as React from "react";

import style from '../../styleEngine'

export default function ModalProfile(props){
    const tempOpen = React.useRef(props.open)
    const [open, setOpen] = React.useState(tempOpen.current);
    const handleClose = () => {
      setOpen(false);
      props.handleModalClose(false);
    }

    React.useEffect(() => {
        setOpen(props.open)
        tempOpen.current = props.open
    }, [props.open])

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style.modalProfile}>
                <Box sx={style.profileHeader}>
                    <Box>
                        <Avatar></Avatar>
                        <Box>
                            <Typography>name</Typography>
                            <Typography>id</Typography>
                        </Box>
                    </Box>
                    <Box>
                        <Box>
                            <Typography>React</Typography>
                            <Typography>0</Typography>
                        </Box>
                        <Box>
                            <Typography>Post</Typography>
                            <Typography>0</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={style.profileBody}>
                    <Box sx={style.profileSidebar.active}>
                        <Box>ข้อมูลทั่วไป</Box>
                        <Box>ขั้นสูง</Box>
                        <Box>ออกจากระบบ</Box>
                    </Box>
                    <Box sx={style.profileInfo.active}>
                        <Box>
                            <Box>Created at</Box>
                            <Box>2 April 2022</Box>
                        </Box>
                        <Box>
                            <Box>E-mail</Box>
                            <Box>yourname@example.com</Box>
                        </Box>
                    </Box>
                    <Box sx={style.profileAdv.active}>
                        <Box></Box>
                        <Box>ลบบัญชี</Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
}