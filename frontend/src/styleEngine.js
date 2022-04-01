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

const modal = {
    mx: "auto",
    my: "20vh",
    width: "45vw",
    height: "60vh",
    bgcolor: 'background.paper',
    border: '',
    borderRadius: '12px',
    boxShadow: 24,
    padding: 3,
    boxSizing: 'border-box',
}

const uploader = {
    active: {
        height: `calc(${modal.height}/2)`,
        boxSizing: 'border-box',
        position: 'relative',
        cursor: 'pointer',
        //backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    },
    disactive: {
        width: '100%',
        height: `calc(${modal.height}/2)`,
        border: '5px dashed red',
        boxSizing: 'border-box',
        borderRadius: '12px',
        cursor: 'pointer'
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
    modal: modal,
    upload: {
        main: uploader,
        caption: {
            main: {
                width: "100%",
            },
            input: {
                backgroundColor: '#ff0000'
            }
        },
        fileName: {
            position: 'absolute',
            left: 0,
            bottom: 0,
            wordWrap: "break-word",
            display: "inline-block",
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#ffffff',
            padding: "3px"
        }
    },
    dashBoard: {
        backgroundColor:"#000000",
        width: '90%',
        minHeight: `calc(100vh - ${topbar.main.height})`,
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
        },
        cardCaption: {
            color: '#FFFFFF',
            padding: '3px'
        },
        cardReaction: {
            main: {
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            },
            btnLike: {
                main: {
                    backgroundColor: '#4d4d4d',
                    color: '#ffffff',
                    width: '50%',
                    borderTopLeftRadius: 0, borderTopRightRadius: 0,
                    borderBottomLeftRadius: '12px', borderBottomRightRadius: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    wordWrap: "break-word"
                },
                active: {
                    backgroundColor: '#4d4d4d',
                    color: '#00ff00',
                    width: '50%',
                    borderTopLeftRadius: 0, borderTopRightRadius: 0,
                    borderBottomLeftRadius: '12px', borderBottomRightRadius: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    wordWrap: "break-word"
                }
            },
            btnDislike: {
                main: {
                    backgroundColor: '#4d4d4d',
                    color: '#ffffff',
                    width: '50%',
                    borderTopLeftRadius: 0, borderTopRightRadius: 0,
                    borderBottomLeftRadius: 0, borderBottomRightRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    wordWrap: "break-word"
                },
                active: {
                    backgroundColor: '#4d4d4d',
                    color: '#ff0000',
                    width: '50%',
                    borderTopLeftRadius: 0, borderTopRightRadius: 0,
                    borderBottomLeftRadius: 0, borderBottomRightRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    wordWrap: "break-word"
                }
            }
        }
    }
}

export default style