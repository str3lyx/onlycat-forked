import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import axios from 'axios';

export default function MenuAppBar() {
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
        let result = await axios.get('http://localhost:5000/api/info')
        console.log(result.data)
    }

    const handleSetInfo = async () => {
        let result = await axios.get('http://localhost:5000/api/info')
        // console.log(result.data)
        setuserName(result.data.username)
        setuserImagePath(result.data.picture.data.url)
    }

    const handleLogout = () => {
        sessionStorage.removeItem('access_token')
        setAuth(false)
        handleClose()
    }

    React.useEffect(() => {
        if (auth) {
            handleSetInfo()
        }
    }, [auth])

    const responseFacebook = async (response) => {
        if (response.accessToken) {
            // console.log('login with accessToken= ' + response.accessToken)
            let result = await axios.post('http://localhost:5000/api/login', {
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
                        <div>
                            <IconButton
                                size="small"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <Box
                                    px={2}
                                    component="img"
                                    sx={{
                                        height: 50,
                                        width: 50,
                                        maxHeight: { xs: 233, md: 167 },
                                        maxWidth: { xs: 350, md: 250 },
                                    }}
                                    alt="user profile picture"
                                    src={userImagePath}
                                />
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
                        </div>
                    ) : <FacebookLogin
                        appId="1076064602954449"
                        callback={responseFacebook}
                        render={renderProps => (
                            <Button variant="outlined" color="white" onClick={renderProps.onClick}>เข้าสู่ระบบด้วย facebook</Button>
                        )}
                    />
                    }
                </Toolbar>
            </AppBar >
        </Box >
    );
}