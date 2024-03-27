import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import './TrackSearch.css';
import logo from '../assets/font/newLogo.png';
import logo2 from '../assets/font/logo2.png';


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
        <div className='z-30 sticky flex items-center justify-center text-[#C6AEF2]  bg-gradient-to-b from-c-grey via-c-grey min-h-16 poppins'>
            <div className='flex items-center justify-between w-full'>
                <button className='flex space-x-0.25 italic text-white abrilfatface' onClick={() => navigate("/")}>
                    <img className='rounded-full w-7 mr-[-3.5%]' src={logo2}></img>
                    <div className='p-1 text-3xl text-transparent abrilfatface bg-clip-text bg-gradient-to-r from-h-grey via-dark-purple to-h-grey hover:from-dark-purple hover:to-dark-purple'>ukeboxd</div>
                </button>
                <ul className="flex space-x-6">
                    {/* <li>
                        <button onClick={() => navigate("/list-users")}>
                            List Users
                        </button>
                    </li> */}
                    {loggedIn &&     // clicking this should bring up popup
                        <li>
                            <button id='createPostButtonId' className='hover:text-[#4950D5]' onClick={() => navigate('/create-post')}>
                                Create Post
                            </button>
                        </li>
                    }
                    {loggedIn && 
                        <li>
                            <button className='hover:text-[#4950D5]' onClick={() => handleProfile()}>
                                Profile
                            </button>
                        </li>
                    }  
                    {loggedIn && 
                        <li>
                            <button className='hover:text-[#4950D5]' onClick={() => handleLogout()}>
                                Logout
                            </button>
                        </li>
                    }   
                    {!loggedIn &&    
                        <li>
                            <button className='hover:text-[#4950D5]' onClick={() => navigate("/login")}>
                                Login
                            </button>
                        </li>
                    }
                    {!loggedIn &&    
                        <li>
                            <button className='hover:text-[#4950D5]' onClick={() => navigate("/create-user")}>
                                Sign Up
                            </button>
                        </li>
                    }

                </ul>
            </div>
        </div>
    )
}