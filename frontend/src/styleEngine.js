const style = {
    topbar: {
        main: {
            display: 'flex',
            height: '64px',
            alignItems: 'center',
            justifyContent: 'center'
        },
        toolbar: {
            display: 'flex',
            width: '98%',
            height: '100%',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    },
    mainLogo: {
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: 30
    },
    searchBar: {
        main: {
            width: '30%'
        },
        input: {
            backgroundColor: 'white'
        }
    },
    btnRandom: {
        mx: 1,
        backgroundColor: "#ca88cb",
        color: '#FFFFFF',
        '&:hover': {
            backgroundColor: '#be73bf',
        }
    },
    userProfile: {
        pic: {
            width: '50px',
            height: '50px',
            mx: 1
        },
        name: {
            flexGrow: 1
        },
        submenu: {
            main: {
                width: 200
            }
        }
    },
    btnFbLogin: {
        mr: 1
    }
}

export default style