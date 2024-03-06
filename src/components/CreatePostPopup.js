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
    import PostService from '../services/PostService';

    import TrackSearch from './TrackSearch';
    
    export default function CreatePostPopup(props) { 
        const [toBeSentUp, SetToBeSentUp] = useState(false);
        const [isSearchOpen, setIsSearchOpen] = useState(true);
        const [postText, setPostText] = useState('');
        const [postTrack, setPostTrack] = useState(false);
        const navigate = useNavigate();
    
        useEffect(() => {
    
        }, [])

        const closeSearch = () => {
            setIsSearchOpen(false);
        }


        const handleSubmit = async (e) => {
            // with axios, we can use .catch, .finally, or .then (callback methods)
                // for .then: axios will return a promise. If this is successful, then it will return an event which can then
                // be used as a parameter for a function (this is all inside the parenthesis)

                // for .catch: if something goes wrong, it will return this event
            e.preventDefault(); // the post request was finalized AFTER the default action of refreshing the page occurred, so this prevents the default
            
            // attempt to create a user (see UserService.js) then log its data
            try {
                await PostService.createPost(localStorage.getItem('jwtToken'), postText); // returns nothing. We're just making the post and adding it to the JPA repository.

                navigate('/');

                console.log('Post added to backend.'); // ok so now we have their token. Now, we can redirect the user to /list-users. make a GET request to /home
            } catch(error) {
                console.error('Error adding post to backend', error);
            }
        };

        const handleTrackSet = async (track) => {
            setPostTrack(track)
            console.log(track.name)
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
                {props.isCreateOpen && 
                    <>
                        <TrackSearch isOpen={isSearchOpen} onClose={closeSearch} passUp={handleTrackSet}/>
                        {!isSearchOpen && 
                            <div className='create-popup-container poppins'>
                                <h1>Create Post</h1>
                                <form onSubmit={handleSubmit}> 
                                    <h3>Post: {postTrack.name}</h3>
                                    <label>
                                        <textarea value={postText} onChange={(e) => setPostText(e.target.value)} />
                                    </label>
                                    <br />
                                    <button type='submit'> 
                                        Submit 
                                    </button>
                                </form>
                            </div>}
                    </>}
            </>
        );
    }