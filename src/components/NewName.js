// this track search appears as a popup either when creating a post or when adding to your top 4 in settings.
// Here's how it works:
// the user gives this search a string. We give this string to the spotify API search.
    // the spotify API search returns:
        // an array 20 track objects that match this string
        // we go through these 20 objects and display their Name, Artist, and Year. Each will be a button.
        // when the user clicks on one of them, we then send this track to the parent which will then send its info to our backend (and update the User and Post entities in the backend to reflect this)
            // then, we will give the track info back to the parent component of this 
                // ex: (if the parent component was 'SettingsPage', it will give a method as a prop called 'passUp()' which takes a track object as parameter)
                // we will call this method with the chosen track as parameter, which will send it back up to the parent. This method will also close the popup.

// what is the point of having all this in our backend??
    // Because after doing so, we only need to make calls to the Spotify API when searching. 
    // When displaying a Post or displaying a UserProfile, we can just make a call to our own backend to get info about the Post's subject or the User's top 4

    // if we have some information we want the component to remember/save (like how many times a button is clicked), we use useState
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
            await UserService.updateUser(localStorage.getItem('jwtToken'), name, props.currUser.email);
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
                    <h1 className='text-lg text-white abrilfatface'>Enter Your New Name</h1>
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