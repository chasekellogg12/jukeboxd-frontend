import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import './TrackSearch.css';


export default function Header({ updateHeader }) { // we need to re-render the header when create account happens 

    const [token, setToken] = useState(localStorage.getItem('jwtToken'));
    const [loggedIn, setLoggedIn] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const navigate = useNavigate();

    const openCreate = () => {
        setIsPopupOpen(true);
        console.log('open')
    }

    const closeCreate = () => {
        setIsPopupOpen(false);
        console.log('close')
    }
    
    useEffect(() => { // when you load the header component, determine if we're logged in or not. If we are, display 'Logout' at the end of the banner. Else, display 'Sign up' and 'Login'
        if (token) setLoggedIn(true);      
    }, [token]);

    const handleLogout = () => {
        // Remove jwtToken from localStorage on logout
        localStorage.removeItem('jwtToken');
        setToken(null);
        navigate('/'); // when logged out, navigate to the homepage
        navigate(0); // this refreshes a page that you are navigated to (so that it properly changes from "Welcome, User" to "You are not logged in")
    };

    const handleProfile = async () => {
        // Remove jwtToken from localStorage on logout
        try {
            const user = await UserService.getLoggedInUserInfo(token);
            navigate(`/profile/${user.username}`);
        } catch (error) {
            console.error('Error getting username');
        }
    };
    
    return (
        <div className='z-40 flex items-center justify-center bg-transparent min-h-16 text-h-grey poppins'>
            <div className='flex items-center justify-between w-full'>
                <button onClick={() => navigate("/")}>
                    Home
                </button>
                <ul className="flex space-x-6">
                    {/* <li>
                        <button onClick={() => navigate("/list-users")}>
                            List Users
                        </button>
                    </li> */}
                    {loggedIn &&     // clicking this should bring up popup
                        <li>
                            <button onClick={() => navigate('/create-post')}>
                                Create Post
                            </button>
                        </li>
                    }
                    {loggedIn && 
                        <li>
                            <button onClick={() => handleProfile()}>
                                Profile
                            </button>
                        </li>
                    }  
                    {loggedIn && 
                        <li>
                            <button onClick={() => handleLogout()}>
                                Logout
                            </button>
                        </li>
                    }   
                    {!loggedIn &&    
                        <li>
                            <button onClick={() => navigate("/login")}>
                                Login
                            </button>
                        </li>
                    }
                    {!loggedIn &&    
                        <li>
                            <button onClick={() => navigate("/create-user")}>
                                Sign Up
                            </button>
                        </li>
                    }

                </ul>
            </div>
        </div>
    )
}