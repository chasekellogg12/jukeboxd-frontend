// if we have some information we want the component to remember/save (like how many times a button is clicked), we use useState
import { useState } from 'react';
import PostService from '../services/PostService';
import { useNavigate } from 'react-router-dom';
import TrackSearch from '../components/TrackSearch';
import Header from '../components/Header';
import logo from '../assets/font/logo512.png';
import StarRating from '../components/StarRating';
import { WavyBackground } from '../components/WavyBackground';

export default function CreatePostPage() { 
    const [postText, setPostText] = useState('');
    const navigate = useNavigate();
    const [postSubject, setPostSubject] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [rating, setRating] = useState(0);

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
            await PostService.createPost(localStorage.getItem('jwtToken'), postText, postSubject, rating); // returns nothing. We're just making the post and adding it to the JPA repository.

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
        <>
            <WavyBackground backgroundFill={'#070c1b'} containerClassName={'flex flex-col items-center justify-center text-h-grey abrilfatface'} className={'flex flex-col items-center justify-center w-3/5 p-4 border rounded-lg login-container border-dark-purple bg-c-grey'}>
                {!postSubject ? 
                    <div className='flex flex-col items-center'>
                        <h3 className='mb-3 text-xl text-center text-white abrilfatface'>What track do you want to review?</h3>
                        <button className='px-2 py-1 text-white rounded-lg bg-hov-blue hover:bg-dark-purple poppins' onClick={() => openPopup()}>Select Track</button>
                    </div> :
                    <div className='flex flex-col items-center space-y-6'>
                        <div className='flex flex-col items-center space-y-2'>
                            <h3 className='text-xl text-white abrilfatface'>Review of...</h3>
                            <div className='flex items-center justify-center space-x-3 track-container'>
                                {postSubject.album ? <img className='w-1/6 border rounded-md border-hov-blue hover:border-orange-400'src={postSubject.album.images[0].url} alt='coverart'></img> : <img className='w-1/6 border rounded-md border-h-grey hover:border-b-green' src={logo} alt='coverart'></img>}
                                <div className='flex flex-col items-start justify-start'>
                                    <div className='flex items-center space-x-1 title'>
                                        <div className='text-white'>{postSubject.name}</div>
                                        {postSubject.explicit && <div className='flex flex-col items-center px-1 py-0 text-xs text-center text-gray-700 rounded-sm bg-h-grey'>E</div>}
                                    </div>
                                    <div className='text-sm italic poppins'>{postSubject.artists ? postSubject.artists[0].name : ''}</div>
                                </div>
                                <svg className='cursor-pointer hover:stroke-dark-purple' onClick={() => openPopup()} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#40bcf4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="bevel"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
                            </div>
                        </div>
                        <StarRating size={'text-3xl'} settingRating={setRating}/>
                        <form onSubmit={handleSubmit} className='flex items-center justify-center w-full space-x-2 poppins'> 
                            <textarea placeholder='Share your thoughts with the world...'className='w-2/3 p-2 rounded-md resize-none text-c-grey' value={postText} onChange={(e) => setPostText(e.target.value)} />
                            <button type='submit' className='px-2 py-1 text-white rounded-lg bg-hov-blue hover:bg-dark-purple'> 
                                Post 
                            </button>
                        </form>
                    </div>
                }
            </WavyBackground>
            <TrackSearch isOpen={isPopupOpen} onClose={closePopup} passUp={handlePostSubject}/>
        </>
    );
}