import * as React from 'react'

export default function NotFound() {
    React.useEffect(() => {
        window.location = '/'
    }, [])
    return <></>
}