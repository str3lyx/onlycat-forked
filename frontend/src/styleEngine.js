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
    border: 'none',
    boxShadow: 24,
    position: "relative",
    upload: {
        height: "87%",
        backgroundColor: "#f3f3f3",
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
        px: "25px",
        py: "10px",
        boxSizing: 'border-box',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    }
}

const uploader = {
    main: {
        height: `calc(${modal.height}/2)`,
        boxSizing: 'border-box',
        borderRadius: '12px',
        cursor: 'pointer',
        marginBottom: '20px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    description: {
        display: 'flex',
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        color: "#838383",
        position: "absolute",
        zIndex: 2,
        backgroundColor: "rgba(255,255,255,0.8)"
    },
    image: {
        position: 'absolute',
        zIndex: 1,
        height: '100%',
    },
    active: {
        maxWidth: '100%',
        "& img": {
            height: '100%',
            width: 'auto'
        },
        "& .upload-description": {
            display: 'none'
        },
        "&:hover .upload-description": {
            display: 'flex'
        }
    },
    disactive: {
        width: `calc(${modal.width} - 2*${modal.upload.px})`,
        border: '5px dashed red',
        display: 'block'
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
            width: "100%",
            height: "25%",
            border: '2px solid #0000ff',
            overflowX: 'none',
            overflowY: 'scroll',
            resize: 'none',
            fontSize: '2.4vmin',
            borderRadius: "12px",
            padding: "10px",
            boxSizing: "border-box"
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
        },
        setBtn: {
            main: {
                height: "13%",
                padding: "0px",
                width: "100%",
                border: 'none',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff",
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
            },
            btnPost: {
                height: "100%",
                borderTopLeftRadius: "0px",
                borderTopRightRadius: "0px",
                borderBottomLeftRadius: "0px",
                borderBottomRightRadius: "12px",
                width: "50%",
                backgroundColor: "#0a5706",
                color: "#ffffff",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: '120%',
                '&:hover': {
                    color: "#0a5706",
                    border: "2px solid #0a5706",
                    backgroundColor: "#bbffb8"
                }
            },
            btnCancel: {
                height: "100%",
                borderTopLeftRadius: "0px",
                borderTopRightRadius: "0px",
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "0px",
                width: "50%",
                backgroundColor: "#ffffff",
                color: "#ff0000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: '120%',
                borderTop: "2px solid #ff0000",
                '&:hover': {
                    border: "2px solid #ff0000",
                    backgroundColor: "#ffb8b8"
                }
            }
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