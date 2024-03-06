// do the GET request for all post information in this component. Pass what you get to the post component.

import { useState, useEffect, useCallback } from 'react';
import PostService from '../services/PostService';
import Post from './Post';
//import './PostWall.css';

// give PostWall a prop (list of user) to indicate which user's posts it should ask the backend for
    // on profile, this prop should be a user. 
    // on the homepage, this prop should be 


export default function PostWall(props) { 
    console.log('logged in user:', props.passedData[1])
    //const listOfUsers = Array.isArray(props.passedData) ? props.passedData[0] : [];
    //console.log(loggedInUserInfo)
    const [listOfPosts, setListOfPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const maxPosts = props.maxPosts ? props.maxPosts : false;
    const sectionName = props.sectionName ? props.sectionName : false;
    const [totalPosts, setTotalPosts] = useState(0);

    const showPosts = useCallback(async () => { // showPosts is only recreated when listOfUsers changes
        //e.preventDefault();
        try {
            if (!Array.isArray(props.passedData)) { // if the listOfUsers we're getting is empty, display all the posts (this means that we're on the homepage)
                const posts = await PostService.getAllPosts();
                const sortedPosts = sectionName === 'Popular Reviews' ? posts.sort((a, b) => a.usernamesWhoLiked.length - b.usernamesWhoLiked.length) : posts;
                setListOfPosts(maxPosts ? sortedPosts.slice(-1*maxPosts) : sortedPosts);
            } 
            else {
                const posts = await PostService.getCertainPosts(props.passedData[0]); // give this a list of Users and receive a list of Posts made by those users
                setTotalPosts(posts.length)
                const sortedPosts = sectionName === 'Popular Reviews' ? posts.sort((a, b) => a.usernamesWhoLiked.length - b.usernamesWhoLiked.length) : posts;
                setListOfPosts(maxPosts ? sortedPosts.slice(-1*maxPosts) : sortedPosts);
            } 
        } catch(error) {
            console.error('Error displaying posts', error);
        }
        setIsLoading(false)
    }, [props.passedData, maxPosts, sectionName]);
    
    useEffect(() => {
        showPosts();
    }, [showPosts]);
    
    if (isLoading) return <div>Loading...</div>

    const handleLikeClick = async (postId) => {
        try {
            await PostService.createLike(localStorage.getItem('jwtToken'), postId);
            showPosts();
            console.log('like created');
        } catch (error) {
            console.error('Error creating like');
        }
    }
    
    return (
        
        <div className='flex-col reviews'>
            {sectionName && 
                <div className='flex justify-between w-full section-title-container'>
                    <span className='text-lg text-white abrilfatface'>{sectionName}</span>
                    {totalPosts > 2 && <button className='text-sm text-sh-grey'onClick={() => props.onSeeMore(3)}>See More</button>}
                </div>
            }   
            <div className='flex-col space-y-3 post-wall-container'>
                {/* {console.log(loggedInUserInfo) // THIS IS NORMAL WHEN LOGGEDINUSERINFO IS FROM HOME, BUT UNDEFINED WHEN FROM PROFILE} */}
                {listOfPosts && listOfPosts.slice().reverse().map(post => ( // for every user in the list of users, put its name in its own div 
                    <Post key={post.postId} passedData={[post, Array.isArray(props.passedData) ? props.passedData[1] : props.passedData]} onLikeClick={handleLikeClick}/>
                ))}
                {!listOfPosts && <div>No posts found.</div>}
            </div>
        </div>
    )
}