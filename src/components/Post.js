//import './Post.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostService from '../services/PostService';
import { formatDistanceToNow } from 'date-fns';
import logo from '../assets/font/logo512.png';
import thumbsUp from '../assets/font/thumbsUp.png';
import thumbsUpFilled from '../assets/font/thumbsUpFilled.png';
import { toast } from 'react-toastify';
import StarRating from './StarRating.js';


export default function Post(props) {
    const { postId, author, datePosted, text, usernamesWhoLiked, stringUsernamesWhoLiked, postSubjectBasicInfo, rating } = props.passedData[0];
    const [ linkUsername, setLinkUsername ] = useState(null);
    const [ linkName, setLinkName ] = useState(null); 
    const loggedInUserInfo = props.passedData[1];
    const [ hasLiked, setHasLiked ] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const jsDate = new Date(datePosted);
    const relativeTime = formatDistanceToNow(jsDate, { addSuffix: true });

    const navigate = useNavigate();
    // have a boolean to determine if a user is logged in. have a boolean to determine if logged in user has already liked a post. If no to either, don't display the like button.
    // add a loading

    useEffect(() => { 
        // console.log(loggedInUserInfo) // loggedInUserInfo is undefined when given from userProfile for some reason
        if (stringUsernamesWhoLiked.includes(loggedInUserInfo.username)) {
            setHasLiked(true)
        }

        setIsLoading(false)
    }, [loggedInUserInfo, stringUsernamesWhoLiked]) // play around with this so that a like updates the post

    const handleLikeClick = async () => {
        if (!loggedInUserInfo) {
            toast.error("Error: You must be signed in to like a post!", {
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
            props.onLikeClick(postId) 
        } catch(error) {
            console.log('Error creating like in post component')
        }
    }

    const handleDeleteLikeClick = async () => {
        try {
            setHasLiked(false);
            props.onDeleteLikeClick(loggedInUserInfo.username, postId);
        } catch(error) {
            console.log('Error deleting like in post component')
        }
    }

    const handleDeleteClick = async () => {
        try {
            props.onDeleteClick(postId);
        } catch(error) {
            console.log('Error deleting post in component');
        }
    }

    if (isLoading) return <div>Loading...</div>

    return (
        <div id={props.postId} className='flex flex-col justify-between m-1 p-1 border rounded-lg shadow hover:shadow-lg post-container border-[#4950D5] bg-c-grey text-sh-grey shadow-sh-grey'>
            <div className='flex items-center m-1 content-container'>
                <div className='mx-2 mt-1 mr-4 w-36 cover-art-container'>
                    <img src={postSubjectBasicInfo.albumCoverArt} alt='track cover art' style={{borderRadius: '8px'}}></img>
                </div>

                <div className='flex flex-col justify-center w-3/4 break-all whitespace-normal info-container'>
                    <div className='flex items-baseline song-name-container'>
                        <span className='text-2xl font-extrabold text-white song-name abrilfatface'>{postSubjectBasicInfo.name}</span>
                        <span className='pl-1 text-sm font-thin song-release-date'>{postSubjectBasicInfo.year}</span>
                    </div>
                    <div className='flex mb-6 text-sm artist-name'>
                        <span>{postSubjectBasicInfo.artist}</span>
                    </div>
                    <div className='flex items-center mb-4 ml-3 author-container'>
                        {/* <div className='avatar'></div> */}
                            <div onClick={() => navigate(`/profile/${author.username}`)} className='mr-2 rounded-full cursor-pointer w-7 h-7 ring-2 ring-dark-purple'>
                                <img
                                    className='rounded-full w-7 h-7'
                                    src={author.avatar}
                                    alt='Profile pic'
                                />
                            </div>
                        <span className='mr-4 text-sm text-white post-author-name' style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${author.username}`)}>{author.name}</span>
                        <StarRating fixedRating={rating} size={'text-lg'}/>
                    </div>
                    <div className='flex mt-2 post-text'>
                        <p>{text}</p>
                    </div>
                </div>
            </div>

            <div className='flex justify-between m-2 extra-container'>
                <div className='flex items-center likes-container'>
                    {(!hasLiked) ?
                        <button className='w-5 h-5 like-button' onClick={handleLikeClick}>
                            <svg className='hover:stroke-hov-blue' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C6AEF2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="bevel"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                        </button> :
                        <button className='w-5 h-5 like-button' onClick={handleDeleteLikeClick}>
                            {/* <img src={thumbsUpFilled} alt='Filled icon'></img> */}
                            <svg className='stroke-hov-blue' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="bevel"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                        </button>
                    } 
                    <div className={`mt-1.5 ml-1.5 text-sm ${!hasLiked ? 'text-sh-grey' : 'text-hov-blue'} mr-4`}>{usernamesWhoLiked.length}</div>
                    {loggedInUserInfo && author.username === loggedInUserInfo.username && <svg className='cursor-pointer hover:stroke-orange-400' onClick={handleDeleteClick} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C6AEF2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="bevel"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>}
                </div>
                <div className='flex items-center text-xs italic font-light align-text-bottom post-date inter'>{relativeTime}</div>
            </div>
        </div>
        // have a button that only the author can see. When pressed, make post request to bakcend with JWT token and postId signaling to remove the post.
    );
}