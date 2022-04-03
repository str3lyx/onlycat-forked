import { Modal, Box, Avatar, Typography, Button } from "@mui/material";
import * as React from "react";
import CloseIcon from '@mui/icons-material/Close';

import style from '../../styleEngine'

export default function ModalProfile(props){
    const tempOpen = React.useRef(props.open)
    const tempUser = React.useRef(props.user)
    const [user, setUser] = React.useState(tempUser.current)
    const [open, setOpen] = React.useState(tempOpen.current);
    const handleClose = () => {
      setOpen(false);
      setUser({name:'',pictureUrl:'',_id:'',reaction:{like:[],disLike:[]}, createdAt: '', email: ''});
      props.handleModalClose(false);
    }

    React.useEffect(() => {
        setOpen(props.open)
        tempOpen.current = props.open
        setUser(props.user)
        tempUser.current = props.user
    }, [props.open, props.user])

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style.modalProfile}>
                <CloseIcon onClick={handleClose} sx={style.btnClose}/>
                <Box sx={style.profileHeader}>
                    <Box sx={style.profileHeader.pic}>
                        <Avatar sx={style.profileHeader.pic.avatar} alt="" src={user.pictureUrl}></Avatar>
                        <Box sx={style.profileHeader.pic.text}>
                            <Typography sx={style.profileHeader.pic.text.name}>{user.name}</Typography>
                            <Typography sx={style.profileHeader.pic.text.id}>ID: {user._id}</Typography>
                        </Box>
                    </Box>
                    <Box sx={style.profileHeader.stat}>
                        <Box sx={style.profileHeader.stat.react}>
                            <Typography sx={{fontSize: "1.8vmin"}}>React</Typography>
                            <Typography sx={{fontSize: "6vmin", fontWeight: "bold"}}>{user.reaction.like.length + user.reaction.disLike.length}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={style.profileBody}>
                    <Box sx={style.profileSidebar.active}>
                        <Box sx={style.profileSidebar.active.menu}>ข้อมูลทั่วไป</Box>
                        <Button onClick={() => {if(props.logout != null) props.logout()}} sx={style.profileSidebar.active.lastMenu}>ออกจากระบบ</Button>
                    </Box>
                    <Box sx={style.profileInfo.active}>
                        <Box sx={style.profileInfo.info}>
                            <Typography sx={{fontSize: "3vmin", fontWeight: "bold"}}>อีเมล</Typography>
                            <Typography sx={{fontSize: "2vmin", color: "#3b3b3b"}}>{user.email}</Typography>
                        </Box>
                        <Box sx={style.profileInfo.info}>
                            <Typography sx={{fontSize: "3vmin", fontWeight: "bold"}}>วันที่เปิดบัญชี</Typography>
                            <Typography sx={{fontSize: "2vmin", color: "#3b3b3b"}}>{new Date(user.createdAt).toLocaleDateString()}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
}