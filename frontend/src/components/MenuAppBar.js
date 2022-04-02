import * as React from 'react';
import { AppBar, Box, IconButton, Toolbar, Typography, Button, MenuItem, Menu, Avatar, TextField, InputAdornment, Link, Tooltip } from '@mui/material';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import SearchIcon from '@mui/icons-material/Search';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import OauthPopup from 'react-oauth-popup';
import Modal from '@mui/material/Modal';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';

import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import axios from 'axios';
import config from '../config';
import style from '../styleEngine.js'
import UploadButton from './upload/UploadButton';

export default function MenuAppBar(props) {
    const [auth, setAuth] = React.useState(sessionStorage.getItem('access_token') != null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [userImagePath, setuserImagePath] = React.useState("");
    const [userName, setuserName] = React.useState("");

    const [openAuthModal, setOpenAuthModal] = React.useState(false);
    const handleOpenAuthModal = () => setOpenAuthModal(true);
    const handleCloseAuthModal = () => setOpenAuthModal(false);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleGetInfo = async () => {
        let result = await axios.get(`${config.apiUrlPrefix}/info`)
        console.log("INFO: ", result.data)
    }

    const handleSetInfo = () => {
        axios.get(`${config.apiUrlPrefix}/info`)
            .then((result) => {
                props.userData(result.data)
                setuserName(result.data.name)
                setuserImagePath(result.data.pictureUrl)
            })
            .catch((err) => {
                // handleLogout()
            })
    }

    const handleLogout = () => {
        sessionStorage.removeItem('access_token')
        setAuth(false)
        handleClose()
        window.location.reload(false) // (false for refresh and using cached)
    }

    const handleSearchData = (e) => {
        // console.log("key: ", e.key)
        if (e.key === "Enter") { // Enter pressed
            props.setSearchData(e.target.value)
        }
    }

    const randomCat = () => {
        axios.get(`${config.apiUrlPrefix}/random/cat`)
            .then((res) => {
                window.open(res.data)
            }).catch((err) => {
                alert('เกิดข้อผิดผลาด โปรดลองใหม่อีกครั้ง')
            })
    }
    React.useEffect(() => {
        if (auth) {
            handleSetInfo()
        }
    }, [auth])

    const onSuccessPSUOauth = async (code, params) => {
        // console.log(">>>>> a code", code, params);
        let result = await axios.post(`${config.apiUrlPrefix}/login/psu`, { code })
        sessionStorage.setItem('access_token', result.data.access_token)
        setAuth(true)
        window.location.reload()
    }
    const onClosePSUOauth = () => {
        // do nothing..
    };

    const responseFacebook = async (response) => {
        if (response.accessToken) {
            // console.log('login with accessToken= ' + response.accessToken)
            let result = await axios.post(`${config.apiUrlPrefix}/login`, {
                token: response.accessToken
            })
            // console.log(result.data)
            sessionStorage.setItem('access_token', result.data.access_token)
            setAuth(true)
            window.location.reload()
        }
    }

    return (
        <AppBar sx={style.topbar.main} >
            <Toolbar
                sx={style.topbar.toolbar}>
                <Typography variant="h6" component="div">
                    <Link href="/" color="inherit" sx={style.mainLogo}>
                        ONLY CAT
                    </Link>
                </Typography>
                <TextField
                    sx={style.searchBar.main}
                    variant="outlined"
                    id="search-outlined-textarea"
                    size='small'
                    placeholder="แคปชั่น cat big brown"
                    onKeyUp={handleSearchData}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        style: style.searchBar.input
                    }}
                />
                <Box>
                    <Tooltip title="คลิกเพื่อเปิดสุ่มรูปน้องแมว">
                        <Button
                            variant="contained" startIcon={<ShuffleIcon />}
                            aria-label="randome cat button"
                            aria-haspopup="false"
                            sx={style.btnRandom}
                            onClick={randomCat}
                        >
                            สุ่มรูปน้องแมว
                        </Button>
                    </Tooltip>
                    {auth ? (
                        <>
                            <UploadButton />
                            <IconButton
                                size="small"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <Avatar
                                    alt={userName}
                                    src={userImagePath}
                                    sx={style.userProfile.pic}
                                >
                                    {userName[0]} {/* สำหรับเมื่อไม่สามารถโหลดรูปได้ */}
                                </Avatar>
                                <Typography variant="h6" component="div" sx={style.userProfile.name} >
                                    {userName}
                                </Typography>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem style={style.userProfile.submenu.main}>
                                    <Link href="/" underline="none" sx={{ color: 'black' }}>
                                        <DashboardIcon sx={{ mr: 1 }} />แดชบอร์ด
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleGetInfo} style={style.userProfile.submenu.main} >
                                    <Link href="/profile" underline="none" sx={{ color: 'black' }}>
                                        <AccountCircleIcon sx={{ mr: 1 }} />โปรไฟล์
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleLogout} sx={style.userProfile.submenu.main}>
                                    <LogoutIcon sx={{ mr: 1 }} /> ออกจากระบบ
                                </MenuItem>
                            </Menu>
                        </>
                    ) :
                        <>
                            <Button variant="outlined" color="white" onClick={handleOpenAuthModal}>เข้าสู่ระบบ</Button>
                            <Modal
                                open={openAuthModal}
                                onClose={handleCloseAuthModal}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 400,
                                    height: 200,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    bgcolor: 'background.paper',
                                    border: '2px solid #FFFFFF',
                                    borderRadius: "0.5rem",
                                    boxShadow: 24,
                                    p: 5,
                                    pb: 6
                                }}>
                                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>ONLY CAT</Typography>
                                    <Typography variant="h6"> เข้าสู่ระบบ </Typography>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        gap: 3,
                                        mt: 3
                                    }}>
                                        <FacebookLogin
                                            appId={config.FACEBOOK_APP_ID}
                                            callback={responseFacebook}
                                            render={renderProps => (<Button variant="outlined" onClick={renderProps.onClick}>
                                                <FacebookRoundedIcon sx={style.btnFbLogin} /> เข้าสู่ระบบด้วย Facebook
                                            </Button>
                                            )}
                                        />
                                        <Button variant="outlined" color="red" >
                                            <OauthPopup
                                                url={`${config.PSUOauth.authorizeURL}?client_id=${config.PSUOauth.clientId}&redirect_uri=${config.PSUOauth.redirectURI}&response_type=code&state=${config.PSUOauth.state}`}
                                                onCode={onSuccessPSUOauth}
                                                onClose={onClosePSUOauth}
                                            >
                                                เข้าสู่ระบบด้วย PSU passport
                                            </OauthPopup>
                                        </Button>
                                    </Box>
                                </Box>
                            </Modal>
                        </>
                    }
                </Box>
            </Toolbar>
        </AppBar >
    );
}