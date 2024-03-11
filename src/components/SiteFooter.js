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
        <div className='sticky z-40 flex flex-col items-center w-full mt-10 space-y-3 text-xs text-dark-purple bg-c-grey min-h-16 poppins'>
            <div className='flex items-center justify-evenly app-content'>
                <span>Contact</span>
                <span>Portfolio</span>
                <span>Resume</span>
                <span>LinkedIn</span>
            </div>
            <div className='flex justify-start'>
                <span>©️ Jukeboxd. Made by Chase Kellogg.</span>
            </div>

        </div>
    )
}