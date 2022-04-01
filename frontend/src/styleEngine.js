const topbar = {
    main: {
        positon: 'sticky',
        display: 'flex',
        height: '64px',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        boxSizing: 'border-box'
    },
    toolbar: {
        display: 'flex',
        width: '98%',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box'
    }
}

const mainLogo = {
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: 30
}

const searchBar = {
    main: {
        width: '30%'
    },
    input: {
        backgroundColor: 'white'
    }
}

const style = {
    topbar: topbar,
    mainLogo: mainLogo,
    searchBar: searchBar,
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
    },
    btnUpload: {
        mx: 1,
        backgroundColor: "#00cc52",
        '&:hover': {
            backgroundColor: '#00ba4b',
        }
    },
    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '',
        boxShadow: 24,
        p: 5,
    },
    dashBoard: {
        backgroundColor:"#000000",
        width: '90%',
        minHeight: `calc(100% - ${topbar.main.height})`,
        boxSizing: 'border-box',
        marginTop: topbar.main.height,
        mx: '5%',
        py: '10px'
    },
    post: {
        cardBorder: { borderRadius: '12px', backgroundColor: '#3d3d3d' },
        cardDetail: {
            main: {
                display: 'flex',
                padding: '7px',
                boxSizing: 'border-box',
                justifyContent: 'flex-start',
                alignItems: 'flex-end'
            },
            picture: {width: '50px', height: '50px', marginRight: '7px'},
            author: { color: '#ffffff', fontWeight: 600 },
            date: { color: '#cecece', fontSize: 10 }
        }
    }
}

export default style