import { useEffect, useState } from 'react';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import SpotifyAPIService from '../services/SpotifyAPIService';
import './TrackSearch.css';
import logo from '../assets/font/logo512.png'

export default function NewName(props) { 
    const [searchQuery, setSearchQuery] = useState('');
    const [areResultsShown, setAreResultsShown] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [toBeSentUp, SetToBeSentUp] = useState(false);
    const [name, setName] = useState(props.currUser.name);

    const navigate = useNavigate();

    useEffect(() => {

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault(); // the post request was finalized AFTER the default action of refreshing the page occurred, so this prevents the default
        try {
            await UserService.updateUser(localStorage.getItem('jwtToken'), name, props.currUser.email, props.currUser.avatar);
            props.resetProfile();
            props.onClose();

            console.log('User updated.'); // ok so now we have their token. Now, we can redirect the user to /list-users. make a GET request to /home
        } catch(error) {
            console.error('Error creating user', error);
        }

    };

    return (
        <>
            {props.isOpen && (
            <div onClick={props.onClose} className='fixed top-0 left-0 z-40 flex items-center justify-center w-full h-full bg-gray-700 bg-opacity-50 text-h-grey'>
                <div onClick={(e) => e.stopPropagation()} className='z-50 flex flex-col items-center w-1/3 p-6 space-y-3 text-center align-middle border rounded-lg shadow-lg min-w-96 bg-c-grey text-clip text-balance'>
                    <h1 className='text-xl text-white abrilfatface'>Change Your Name</h1>
                    <form onSubmit={handleSubmit}> 
                        <label className='space-x-2'>
                            <input maxLength='15' className='p-1 rounded-md text-c-grey' type='text' value={name} onChange={(e) => setName(e.target.value)} />
                            <button type='submit'> Save </button>
                        </label>
                    </form>
                    <button onClick={props.onClose} className='text-sm'>Close</button>
                </div>
            </div>
            )}
        </>
    );
}