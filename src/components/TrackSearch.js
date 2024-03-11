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
import logo from '../assets/font/logo512.png';

export default function TrackSearch(props) { 
    const [searchQuery, setSearchQuery] = useState('');
    const [areResultsShown, setAreResultsShown] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [toBeSentUp, SetToBeSentUp] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

    }, [])

    const displayResults = () => {
        setAreResultsShown(true);
    }

    const removeResults = () => {
        setAreResultsShown(false);
    }

    const handleSearch = async (e) => {
        e.preventDefault(); // the post request was finalized AFTER the default action of refreshing the page occurred, so this prevents the default
        try {
            const results = await SpotifyAPIService.searchTracks(searchQuery);
            setSearchResults(results.items);
            displayResults(); // have display results rerender the component

            console.log('Search successful'); // ok so now we have their token. Now, we can redirect the user to /list-users. make a GET request to /home
        } catch(error) {
            console.error('Error searching', error);
        }

    };

    const handleSelect = async (track) => {
        removeResults();
        try {
            await props.passUp(track);
            props.onClose(); // close this popup
        } catch(error) {
            console.error('Error passing up track to parent')
        }
    }

    return ( // have an input box for name
    // for onChange={(e) => setName(e.target.value)} [asynchronous function]:
        // here, when the input box changes, this is an event known as e
        // you then pass in the function setName, which takes e as a parameter
            // e is an object that contains information about an even that occurred
            // e.target is the HTML element that triggered the event (the form element inpout box)
            // e.target.value is the current value of the form element when the event occurred 

        // ensure that this div (which is a popup container) is scrollable. If its size gets past a certain point, you should be able to scroll thru it
        <>
            {props.isOpen && (
            <div onClick={props.onClose} className='fixed top-0 left-0 z-40 flex items-center justify-center w-full h-full bg-gray-700 bg-opacity-50 text-h-grey'>
                <div onClick={(e) => e.stopPropagation()} className='z-50 flex flex-col items-center w-1/3 p-6 space-y-3 border rounded-lg shadow-lg  min-w-96 bg-c-grey'>
                    <h1 className='text-lg text-white abrilfatface'>Find a Track</h1>
                    <form onSubmit={handleSearch}> 
                        <label className='space-x-2'>
                            <input className='p-1 rounded-md text-c-grey' type='text' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            <button type='submit'> Search </button>
                        </label>
                        
                    </form>
                    <button onClick={props.onClose} className='text-sm'>Close</button>
                    {areResultsShown && (
                        <div className='overflow-auto max-h-96'>
                            {searchResults.map(track => ( // for every track, get it's album cover art image 
                                <div key={track.id} className='mb-2.5'>
                                    <button className='flex items-center space-x-3 text-sm rounded-md hover:bg-dark-purple' onClick={() => handleSelect(track)}>
                                        {track.album ? <img className='w-1/12 ml-0.5 rounded-md'src={track.album.images[0].url} alt='coverart'></img> : <img src={logo} alt='coverart'></img>}
                                        <div className='flex flex-col items-start justify-start'>
                                            <div className='flex items-center space-x-1 title'>
                                                <div className='text-white'>{track.name}</div>
                                                {track.explicit && <div className='flex flex-col items-center px-1 py-0 text-xs text-center text-gray-700 rounded-sm bg-h-grey'>E</div>}
                                            </div>
                                            <div className='text-sm italic'>{track.artists ? track.artists[0].name : ''}</div>
                                        </div>

                                        
                                        {/* {track.name} {track.album && track.album.release_date.slice(0, 4) ? track.album.release_date.slice(0, 4) : ''} {track.artists  ? track.artists[0].name : ''} */}
                                    </button>
                                </div>
                        ))}
                        </div>
                    )}
                </div>
            </div>
            )}
        </>
    );
}