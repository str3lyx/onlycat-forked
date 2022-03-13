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

    const handleLogout = () => {
        sessionStorage.removeItem('access_token')
        setAuth(false)
        handleClose()
    }

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
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                                {/* <Box
                                    component="img"
                                    sx={{
                                        height: 233,
                                        width: 350,
                                        maxHeight: { xs: 233, md: 167 },
                                        maxWidth: { xs: 350, md: 250 },
                                    }}
                                    alt="The house from the offer."
                                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
                                /> */}
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
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
                                <MenuItem onClick={handleGetInfo}>โปรไฟล์</MenuItem>
                                <MenuItem onClick={handleLogout}>ออกจากระบบ</MenuItem>
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
            </AppBar>
        </Box>
    );
}