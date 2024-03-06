// if we have some information we want the component to remember/save (like how many times a button is clicked), we use useState
import { useState } from 'react';
import PostService from '../services/PostService';
import { useNavigate } from 'react-router-dom';
import TrackSearch from '../components/TrackSearch';
import Header from '../components/Header';
import logo from '../assets/font/logo512.png';

export default function CreatePostPage() { 
    const [postText, setPostText] = useState('');
    const navigate = useNavigate();
    const [postSubject, setPostSubject] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => {
        setIsPopupOpen(true);
    }

    const closePopup = () => {
        setIsPopupOpen(false);
    }

    const handleSubmit = async (e) => {
        // with axios, we can use .catch, .finally, or .then (callback methods)
            // for .then: axios will return a promise. If this is successful, then it will return an event which can then
            // be used as a parameter for a function (this is all inside the parenthesis)

            // for .catch: if something goes wrong, it will return this event
        e.preventDefault(); // the post request was finalized AFTER the default action of refreshing the page occurred, so this prevents the default
        
        // attempt to create a user (see UserService.js) then log its data
        try {
            await PostService.createPost(localStorage.getItem('jwtToken'), postText, postSubject); // returns nothing. We're just making the post and adding it to the JPA repository.

            navigate('/');

            console.log('Post added to backend.'); // ok so now we have their token. Now, we can redirect the user to /list-users. make a GET request to /home
        } catch(error) {
            console.error('Error adding post to backend', error);
        }
    };

    const handlePostSubject = async (track) => {
        setPostSubject(track)
        console.log(track.name)
    }

    return ( // typical form

        <div className='flex flex-col items-center justify-center text-h-grey'>
            <div className='flex flex-col items-center justify-center w-2/5 p-4 border rounded-lg create-post-container border-h-grey'>
                {!postSubject ? 
                    <div className='flex flex-col items-center'>
                        <h3 className='mb-3 text-xl text-white abrilfatface'>What track do you want to review?</h3>
                        <button className='px-2 py-1 text-white rounded-lg bg-b-green hover:bg-green-600 poppins' onClick={() => openPopup()}>Select Track</button>
                    </div> :
                    <div className='flex flex-col items-center space-y-6'>
                        <div className='flex flex-col items-center space-y-2'>
                            <h3 className='text-xl text-white abrilfatface'>Review of...</h3>
                            <div className='flex items-center justify-center space-x-3 track-container'>
                                {postSubject.album ? <img className='w-1/6 border rounded-md border-h-grey hover:border-b-green'src={postSubject.album.images[0].url} alt='coverart'></img> : <img className='w-1/6 border rounded-md border-h-grey hover:border-b-green' src={logo} alt='coverart'></img>}
                                <div className='flex flex-col items-start justify-start'>
                                    <div className='flex items-center space-x-1 title'>
                                        <div className='text-white'>{postSubject.name}</div>
                                        {postSubject.explicit && <div className='flex flex-col items-center px-1 py-0 text-xs text-center text-gray-700 rounded-sm bg-h-grey'>E</div>}
                                    </div>
                                    <div className='text-sm italic'>{postSubject.artists ? postSubject.artists[0].name : ''}</div>
                                </div>
                            </div>
                            <button className='px-2 py-1 text-sm text-white bg-orange-400 rounded-lg change-track-button hover:bg-orange-500' onClick={() => openPopup()}>Change Track</button>
                        </div>
                        <form onSubmit={handleSubmit} className='flex items-center justify-center w-full space-x-2'> 
                            <textarea placeholder='Share your thoughts with the world...'className='w-2/3 p-2 rounded-md resize-none text-c-grey' value={postText} onChange={(e) => setPostText(e.target.value)} />
                            <button type='submit' className='px-2 py-1 text-white rounded-lg bg-b-green hover:bg-green-600'> 
                                Post 
                            </button>
                        </form>
                    </div>
                }
                <TrackSearch isOpen={isPopupOpen} onClose={closePopup} passUp={handlePostSubject}/>
                
            </div>
        </div>

        // <>
        //     {!postSubject && <div>
        //         <h3>What track do you want to review?</h3>
        //         <button className='bg-gray-700' onClick={() => openPopup()}>Add Track</button>
        //     </div>}
            
        //     {postSubject && <div>
        //         <h1>Create Post</h1>
        //         <h3>Review of {postSubject.name}</h3>
        //         <button className='add-track-button' onClick={() => openPopup()}>Change Track</button>
        //         <form onSubmit={handleSubmit}> 
        //             <label>
        //                 <textarea value={postText} onChange={(e) => setPostText(e.target.value)} />
        //             </label>
        //             <br />
        //             <button type='submit'> 
        //                 Submit 
        //             </button>
        //         </form>
        //     </div>}
        //     <TrackSearch isOpen={isPopupOpen} onClose={closePopup} passUp={handlePostSubject}/>
        // </>   
    );
}