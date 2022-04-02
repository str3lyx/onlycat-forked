import * as React from 'react';
import { AppBar, Box, IconButton, Toolbar, Typography, Button, MenuItem, Menu, Avatar, TextField, InputAdornment, Link, Tooltip } from '@mui/material';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import SearchIcon from '@mui/icons-material/Search';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import OauthPopup from 'react-oauth-popup';

import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import axios from 'axios';
import config from '../config';
import style from '../styleEngine.js'
import UploadButton from './UploadButton';

export default function MenuAppBar(props) {
    const [auth, setAuth] = React.useState(sessionStorage.getItem('access_token') != null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [userImagePath, setuserImagePath] = React.useState("");
    const [userName, setuserName] = React.useState("");

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
                                <MenuItem onClick={handleGetInfo} style={style.userProfile.submenu.main}>โปรไฟล์</MenuItem>
                                <MenuItem onClick={handleLogout} sx={style.userProfile.submenu.main}>ออกจากระบบ</MenuItem>
                            </Menu>
                        </>
                    ) :
                        <>
                            <FacebookLogin
                                appId={config.FACEBOOK_APP_ID}
                                callback={responseFacebook}
                                render={renderProps => (<Button variant="outlined" color="white" onClick={renderProps.onClick}>
                                    <FacebookRoundedIcon sx={style.btnFbLogin} /> เข้าสู่ระบบด้วย Facebook
                                </Button>
                                )}
                            />
                            <Button variant="outlined" color="white" >
                                <OauthPopup
                                    url={`${config.PSUOauth.authorizeURL}?client_id=${config.PSUOauth.clientId}&redirect_uri=${config.PSUOauth.redirectURI}&response_type=code&state=${config.PSUOauth.state}`}
                                    onCode={onSuccessPSUOauth}
                                    onClose={onClosePSUOauth}
                                >
                                    login psu passport
                                </OauthPopup>
                            </Button>
                        </>
                    }
                </Box>
            </Toolbar>
        </AppBar>
    );
}