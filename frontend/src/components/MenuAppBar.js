import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import Avatar from '@mui/material/Avatar';

import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import axios from 'axios';
import config from '../config';
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
                handleLogout()
                window.location.reload()
            })
    }

    const handleLogout = () => {
        sessionStorage.removeItem('access_token')
        setAuth(false)
        handleClose()
        window.location.reload(false) // (false for refresh and using cached)
    }

    React.useEffect(() => {
        if (auth) {
            handleSetInfo()
        }
    }, [auth])

    const responseFacebook = async (response) => {
        if (response.accessToken) {
            // console.log('login with accessToken= ' + response.accessToken)
            let result = await axios.post(`${config.apiUrlPrefix}/login`, {
                token: response.accessToken
            })
            // console.log(result.data)
            sessionStorage.setItem('access_token', result.data.access_token)
            setAuth(true)
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Only Cat
                    </Typography>
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
                                    sx={{ width: 50, height: 50, mx: 1 }}
                                >
                                    {userName[0]} {/* สำหรับเมื่อไม่สามารถโหลดรูปได้ */}
                                </Avatar>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} >
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
                                <MenuItem onClick={handleGetInfo} style={{ width: 200 }}>โปรไฟล์</MenuItem>
                                <MenuItem onClick={handleLogout} style={{ width: 200 }}>ออกจากระบบ</MenuItem>
                            </Menu>
                        </>
                    ) : <FacebookLogin
                        appId={config.FACEBOOK_APP_ID}
                        callback={responseFacebook}
                        render={renderProps => (<Button variant="outlined" color="white" onClick={renderProps.onClick}>
                            <FacebookRoundedIcon sx={{ mr: 1 }} /> เข้าสู่ระบบด้วย Facebook
                        </Button>
                        )}
                    />
                    }
                </Toolbar>
            </AppBar >
        </Box >
    );
}