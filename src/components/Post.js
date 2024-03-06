//import './Post.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostService from '../services/PostService';
import { formatDistanceToNow } from 'date-fns';
import logo from '../assets/font/logo512.png';
import thumbsUp from '../assets/font/thumbsUp.png';
import thumbsUpFilled from '../assets/font/thumbsUpFilled.png';


export default function Post(props) {
    const { postId, author, datePosted, text, usernamesWhoLiked, stringUsernamesWhoLiked, postSubjectBasicInfo } = props.passedData[0];
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
        try {
            props.onLikeClick(postId) 
        } catch(error) {
            console.log('Error creating like in post component')
        }
    }

    if (isLoading) return <div>Loading...</div>
    // infintaly console logging 'undefined'
    // post-container should have three things in a column:
        // header-container will have 2 things left to right
            // cover-art-container
            // header-info-container will have 3 things in a column:
                // post-date
                // author-info-container will have 2 things left to right:
                    // circular-avatar
                    // user's name
                // Song-name-container will have 2 things left to right:
                    // song-name
                    // song-release-date
        // text-container
        // Like-container

    // post-container has 2 things in a column:
        // content-container (8/9 of the div's height) has 2 things left to right:
            // cover art (1/6 of the div's width)
            // info container (5/6 of the div's width) has 3 things in a column:
                // Song name ()
                // Name
                // text

        // likes container (1/9th of the div's height) has 2 things left to right with justify-space:
            // likes
            // date
    return (
        <div className=' post-container flex flex-col justify-between border border-sh-grey p-1 m-1 bg-c-grey text-sh-grey rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.1)]'>
            <div className='flex content-container'>
                <div className='w-1/6 m-2 cover-art-container'>
                    <img src={postSubjectBasicInfo.albumCoverArt} alt='track cover art' style={{borderRadius: '8px'}}></img>
                </div>

                <div className='flex flex-col justify-center w-3/4 m-2 break-all whitespace-normal info-container'>
                    <div className='flex items-baseline song-name-container'>
                        <span className='text-2xl font-extrabold text-white song-name'>{postSubjectBasicInfo.name}</span>
                        <span className='pl-1 text-sm font-thin song-release-date'>{postSubjectBasicInfo.year}</span>
                    </div>
                    <div className='flex mb-6 text-sm artist-name'>
                        <span>{postSubjectBasicInfo.artist}</span>
                    </div>
                    <div className='flex items-center mb-4 author-container'>
                        {/* <div className='avatar'></div> */}
                            <div className='mr-2 rounded-full w-7 h-7 ring ring-offset-base-100 ring-offset-2'>
                                <img
                                    src={logo}
                                    alt='Profile pic'
                                />
                            </div>
                        <span className='text-white post-author-name' style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${author.username}`)}>{author.name}</span>
                    </div>
                    <div className='flex post-text'>
                        <p>{text}</p>
                    </div>
                </div>
            </div>

            <div className='flex justify-between m-2 extra-container'>
                <div className='flex items-center likes-container'>
                    {(loggedInUserInfo && !hasLiked) ?
                        <button className='w-5 h-5 like-button' onClick={handleLikeClick}>
                            <img src={thumbsUp} alt='Like icon'></img>
                        </button> :
                        <button className='w-5 h-5 like-button'>
                            <img src={thumbsUpFilled} alt='Filled icon'></img>
                        </button>
                    } 
                    <span className='ml-2 text-sm text-sh-grey'>{usernamesWhoLiked.length}</span>
                </div>
                <span className='text-sm italic font-light post-date'>{relativeTime}</span>
            </div>
        </div>
    );
}