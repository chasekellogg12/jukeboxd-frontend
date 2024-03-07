// if we have some information we want the component to remember/save (like how many times a button is clicked), we use useState
import { useCallback, useEffect, useState } from 'react';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import TrackSearch from '../components/TrackSearch';
import TrackService from '../services/TrackService';
//import './SettingsPage.css';
import TopFour from '../components/TopFour';

// export default means that this is the main component in this file
    // if we want to use this component in another file, we include this 

// this is the page where we make calls to Spotify API, not TopFour.js
// in TopFour.js, we simply GET to our own backend with our top 4 track

// in this file, we take a song name. Then we find it's song id (search for it). Then we take this song id, find info about the song (name, year, artist, album cover) save this info in our repository, and display it.

// tracks should be their own entity in the backend that are created anytime someone adds them as a Top4 on this page or anytime someone makes a review about them. This entity will have:
    // String trackId
    // String name
    // String artist
    // String album
    // String year
    // String genre
    // String albumCoverArt
    // List<Post> reviews (IN TrackDTO, this will be List<Long> where every element is a postId)

// we need to update Post and PostDTO to have:
    // Track reviewSubject (for Post) and TrackBasicInfo reviewSubjectTrackId

// we need to update MyUser and MyUserDTO to have:
    // List<TrackBasicInfo> topFour (FOR MYUSER) and List<TrackBasicInfo> topFourTrackIds (FOR MY USER DTO)


// TrackBasicInfo has String name, String trackId, and String album cover art
export default function SettingsPage() { 
    const [username, setUsername] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [topFourSongs, setTopFourSongs] = useState([]); // to be an array of TrackBasicInfo
    const [songToBeChanged, setSongToBeChanged] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const openPopup = (songIndex) => {
        setSongToBeChanged(songIndex);
        setIsPopupOpen(true);
    }

    const closePopup = () => {
        setIsPopupOpen(false);
    }

    const getLoggedInInfo = useCallback( async () => {
        try {
            const loggedInUserInfo = await UserService.getLoggedInUserInfo(localStorage.getItem('jwtToken'));
            setUsername(loggedInUserInfo.username);
            setName(loggedInUserInfo.name);
            setEmail(loggedInUserInfo.email);
            setTopFourSongs(loggedInUserInfo.topFour);
            setIsLoading(false);
        } catch (error) {
            console.error('Error getting user info for settings')
        }
    }, []);
    
    useEffect(() => {
        getLoggedInInfo()
    }, [getLoggedInInfo])

    const handleSubmit = async (e) => {
        // with axios, we can use .catch, .finally, or .then (callback methods)
            // for .then: axios will return a promise. If this is successful, then it will return an event which can then
            // be used as a parameter for a function (this is all inside the parenthesis)

            // for .catch: if something goes wrong, it will return this event
        e.preventDefault(); // the post request was finalized AFTER the default action of refreshing the page occurred, so this prevents the default
        
        // attempt to create a user (see UserService.js) then log its data
        try {
            await UserService.updateUser(localStorage.getItem('jwtToken'), name, email);
            
            //navigate(`/profile/${username}`);

            console.log('User updated.'); // ok so now we have their token. Now, we can redirect the user to /list-users. make a GET request to /home
        } catch(error) {
            console.error('Error creating user', error);
        }

    };

    const addTrackToBackend = async (track) => { // add the track to OUR backend if it's not already there. Then, set change the topFourSongs array and update the backend with it.
        try {
            await TrackService.addTrackToTop4(localStorage.getItem('jwtToken'), songToBeChanged, track);
            getLoggedInInfo();
            //showPosts();
            console.log('Track added to OUR backend');
        } catch (error) {
            console.error('Error adding track to our backend');
        }
    };

    if (isLoading) {
        return (<div>Loading...</div>)
    }

    // settings-container has 3 things in a column. All items are centered.:
        // 'USER SETTINGS'
        // form settings-info-container has 3 things in a column:
            // name entry field
            // email entry field
            // submit button
        // edit-top-four-container has 2 things left-to-right
            // top-four-track-info has 4 thigns in a column:
                // 'Favorite Track 1: Rocky Theme' Change...
            // top-four (component)
    
    return ( // have an input box for name
    // for onChange={(e) => setName(e.target.value)} [asynchronous function]:
        // here, when the input box changes, this is an event known as e
        // you then pass in the function setName, which takes e as a parameter
            // e is an object that contains information about an even that occurred
            // e.target is the HTML element that triggered the event (the form element inpout box)
            // e.target.value is the current value of the form element when the event occurred 

        // the 4 movies are set with a button next to them to change them. Hitting this button opens the popup with just 'Pick a favorite track' and a textbox.
            // typing in this textbox brings up search results with the song name and its year. Clicking on a search result 
            <div className='flex flex-col items-center justify-center settings-page text-h-grey'>
                <div className='flex flex-col items-center justify-center w-full p-4 space-y-4 border rounded-lg settings-container border-h-grey'>
                    <div className='text-xl text-white title abrilfatface'>User Settings</div>
                    <form className='flex flex-col items-center justify-center space-y-3 settings-info-container'>
                        <label className='space-x-2 space-y-1'>
                            <div>Name</div> 
                            <input className='p-1 rounded-md' type='text' value={name} onChange={(e) => setName(e.target.value)} />
                        </label>
                        <label className='space-x-2 space-y-1'>
                            <div>Email</div>
                            <input className='p-1 rounded-md' type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </label>
                        <button type='submit' className='flex submit-button bg-b-green px-1.5 items-center rounded-lg text-white hover:bg-green-600'> Save </button>
                    </form>
                    <TopFour passedData={topFourSongs}/>
                    <div className='flex justify-around w-full top-four-track-info'>
                        <div className='flex flex-col items-center justify-center'>
                            <span className='text-center abrilfatface'>Favorite Track 1</span>
                            <span className='text-center'>{topFourSongs[0].name}</span>
                            <button className='px-2 py-1 text-sm text-white bg-orange-400 rounded-lg change-track-button hover:bg-orange-500' onClick={() => openPopup(0)}>Change</button>
                        </div>
                        <div className='flex flex-col items-center justify-center'>
                            <span className='text-center abrilfatface'>Favorite Track 2</span>
                            <span className='text-center'>{topFourSongs[1].name}</span>
                            <button className='px-2 py-1 text-sm text-white bg-orange-400 rounded-lg change-track-button hover:bg-orange-500' onClick={() => openPopup(1)}>Change</button>
                        </div>
                        <div className='flex flex-col items-center justify-center'>
                            <span className='text-center abrilfatface'>Favorite Track 3</span>
                            <span className='text-center'>{topFourSongs[2].name}</span>
                            <button className='px-2 py-1 text-sm text-white bg-orange-400 rounded-lg change-track-button hover:bg-orange-500' onClick={() => openPopup(2)}>Change</button>
                        </div>
                        <div className='flex flex-col items-center justify-center'>
                            <span className='text-center abrilfatface'>Favorite Track 4</span>
                            <span className='text-center'>{topFourSongs[3].name}</span>
                            <button className='px-2 py-1 text-sm text-white bg-orange-400 rounded-lg change-track-button hover:bg-orange-500' onClick={() => openPopup(3)}>Change</button>
                        </div>
                    </div>
                </div>
                <TrackSearch isOpen={isPopupOpen} onClose={closePopup} passUp={addTrackToBackend}/>
            </div>
            
            
            
            // <div className='settings-container'>
            //     <h1>User Settings</h1>
            //     <form onSubmit={handleSubmit}> 
            //         <div className='input-section'>
            //             <label>
            //                 <h3>Name: </h3>
            //                 <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
            //             </label>
            //             <label>
            //                 <h3>Email: </h3>
            //                 <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
            //             </label>
            //         </div>
            //         <button type='submit'> Submit </button>
            //     </form>
            //     <br />
                            
            //         <div className='tracks-section'>
            //             <h3>Favorite Track 1: {topFourSongs[0].name}</h3>
            //             <button className='change-track-button' onClick={() => openPopup(0)}>Change</button>

            //             <h3>Favorite Track 2: {topFourSongs[1].name}</h3>
            //             <button className='change-track-button' onClick={() => openPopup(1)}>Change</button>

            //             <h3>Favorite Track 3: {topFourSongs[2].name}</h3>
            //             <button className='change-track-button' onClick={() => openPopup(2)}>Change</button>

            //             <h3>Favorite Track 4: {topFourSongs[3].name}</h3>
            //             <button className='change-track-button' onClick={() => openPopup(3)}>Change</button>
            //         </div>
            //     <TrackSearch isOpen={isPopupOpen} onClose={closePopup} passUp={addTrackToBackend}/>
            // </div>
    );
}