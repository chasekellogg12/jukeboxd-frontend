import { useEffect, useState } from 'react';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import SpotifyAPIService from '../services/SpotifyAPIService';
import './TrackSearch.css';
//import defaultPic from '../assets/font/logo512.png'
import { toast } from 'react-toastify';

export default function NewAvatar(props) { 
    const [searchQuery, setSearchQuery] = useState('');
    const [areResultsShown, setAreResultsShown] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [toBeSentUp, SetToBeSentUp] = useState(false);
    const defaultPic = 'https://i.imgur.com/GBqcras.png';
    const [readyToSave, setReadyToSave] = useState(false);

    const [avatar, setAvatar] = useState(props.currUser.avatar === 'https://i.imgur.com/GBqcras.png' ? '' : props.currUser.avatar);
    const [preview, setPreview] = useState(props.currUser.avatar === 'https://i.imgur.com/GBqcras.png' ? defaultPic : props.currUser.avatar);

    const navigate = useNavigate();

    useEffect(() => {

    }, [])

    const handleImageChange = (e) => {
        // const newAvatar = e.target.value;
        // setAvatar(newAvatar);
        e.preventDefault();
        const newAvatar = avatar; // Get the current avatar URL from the state
    
        // Create a new Image object
        const img = new Image();
        img.onload = () => {
            setReadyToSave(true);
            setPreview(newAvatar); // Set the preview if the image loads successfully
        }
        
        img.onerror = () => {
            // Set to defaultPic and show toast error if there's an error loading the image
            setReadyToSave(false);
            setPreview(defaultPic);
            toast.error("Error: The image link you entered is not valid.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        };
        img.src = newAvatar; // Set the image source, which triggers the loading
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault(); // the post request was finalized AFTER the default action of refreshing the page occurred, so this prevents the default
        if (preview === defaultPic) {
            toast.error("Error: Upload a valid image link first.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        
        try {
            await UserService.updateUser(localStorage.getItem('jwtToken'), props.currUser.name, props.currUser.email, preview);
            props.resetProfile();
            props.onClose();

            console.log('User updated.'); // ok so now we have their token. Now, we can redirect the user to /list-users. make a GET request to /home
        } catch(error) {
            console.error('Error changing profile pic', error);
        }

    };

    return (
        <>
            {props.isOpen && (
            <div onClick={props.onClose} className='fixed top-0 left-0 z-40 flex items-center justify-center w-full h-full bg-gray-700 bg-opacity-50 text-h-grey'>
                <div onClick={(e) => e.stopPropagation()} className='z-50 flex flex-col items-center w-1/3 p-6 space-y-3 text-center align-middle border rounded-lg shadow-lg min-w-96 bg-c-grey text-clip text-balance'>
                    <h1 className='text-xl text-white abrilfatface'>Change Your Profile Picture</h1>
                    <div
                        id='avatar'
                        className='flex items-center justify-center w-full pb-2 drop-shadow-xl'>
                            <div className='w-40 h-40 rounded-full ring ring-dark-purple'>
                                <img className='w-40 h-40 rounded-full' src={preview} alt='Profile Pic' />
                            </div>
                    </div>
                    
                    <form className='w-full' onSubmit={handleImageChange}> 
                        <label className='space-x-2 '>
                            <input className='p-1 rounded-md w-60 text-c-grey placeholder:italic placeholder:text-slate-400' placeholder="Enter a valid image link..." type='text' value={avatar} onChange={(e) => setAvatar(e.target.value)} />
                            <button type='submit'> Upload </button>
                        </label>
                    </form>
                    <button onClick={handleSubmit}> Save </button>
                    <button onClick={props.onClose} className='text-sm'>Close</button>
                </div>
            </div>
            )}
        </>
    );
}