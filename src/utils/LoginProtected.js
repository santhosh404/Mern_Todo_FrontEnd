import React, {useState, useEffect} from 'react';
import { useNavigate, Outlet } from 'react-router-dom'




export default function LoginProtected(props) {
    const navigate = useNavigate()
    console.log(props);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    function checkUserToken () {
        const token = localStorage.getItem("accessToken")
        if(token) {
            setIsLoggedIn(true)
            navigate('/home')
        }
        setIsLoggedIn(false)
    }

    useEffect(() => {
        checkUserToken()
    }, [isLoggedIn])
    return (
        <div>
        {
            !isLoggedIn ? <Outlet /> : null
        }
        </div>
    )
}   