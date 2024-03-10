import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import './TrackSearch.css';
import logo from '../assets/font/newLogo.png';
import logo2 from '../assets/font/logo2.png';
import '../App.css';


export default function SiteFooter() { // we need to re-render the header when create account happens 

    const [token, setToken] = useState(localStorage.getItem('jwtToken'));
    const [loggedIn, setLoggedIn] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const navigate = useNavigate();

    
    return (
        <div className=' z-40 sticky flex items-center justify-center text-[#C6AEF2] bg-c-grey min-h-16 abrilfatface w-full'>
            yo
            <div className='flex items-center justify-between w-full'>
                yo
            </div>
        </div>
    )
}