import { useEffect, useContext } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Logout(){
    const userContext = useContext(UserContext);
    useEffect(function(){
        const logout = async function(){
            userContext.setUserContext(null);
            const res = await fetch("http://localhost:3001/user/logout");
        }
        logout();
    }, []);

    return (
        <Navigate replace to="/map" />
    );
}

export default Logout;