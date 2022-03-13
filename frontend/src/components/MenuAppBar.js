import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import FacebookLogin from 'react-facebook-login';
import axios from 'axios';


export default function MenuAppBar() {
    const [auth, setAuth] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleChange = (event) => {
        setAuth(event.target.checked);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const responseFacebook = async (response) => {
        if (response.accessToken) {
            // console.log('login with accessToken= ' + response.accessToken)
            let result = await axios.post('http://localhost:5000/api/login', {
                token: response.accessToken
            })
            // console.log(result.data)
            sessionStorage.setItem('access_token', result.data.access_token)
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Switch
                            checked={auth}
                            onChange={handleChange}
                            aria-label="login switch"
                        />
                    }
                    label={auth ? 'Logout' : 'Login'}
                />
            </FormGroup>
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
                                <MenuItem onClick={handleClose}>โปรไฟล์</MenuItem>
                                <MenuItem onClick={handleClose}>ออกจากระบบ</MenuItem>
                            </Menu>
                        </div>
                    ) : <FacebookLogin
                        appId="1076064602954449"
                        autoLoad={true}
                        textButton="เข้าสู่ระบบด้วย facebook"
                        // fields="id,name,email,picture"
                        callback={responseFacebook} />
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}