// do the GET request for all post information in this component. Pass what you get to the post component.

import { useState, useEffect, useCallback, useRef } from 'react';
import PostService from '../services/PostService';
import Post from './Post';
//import './PostWall.css';

// give PostWall a prop (list of user) to indicate which user's posts it should ask the backend for
    // on profile, this prop should be a user. 
    // on the homepage, this prop should be 


export default function PostWall(props) { 
    const [listOfPosts, setListOfPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const maxPosts = props.maxPosts ? props.maxPosts : false;
    const sectionName = props.sectionName ? props.sectionName : false;
    const [totalPosts, setTotalPosts] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const bottomRef = useRef(null);

    const showPosts = useCallback(async () => { // showPosts is only recreated when listOfUsers changes
        //e.preventDefault();
        try {
            let posts = [];
            setPageNumber(0);
            if (!Array.isArray(props.passedData)) { // if the listOfUsers we're getting is empty, display all the posts (this means that we're on the homepage)
                posts = await PostService.getAllPosts(); // should instead be getPostsFromPage -> if the parameter is 1, it gives you the first 10 posts. If it's 2, it gives posts 11 - 20 etc
                const sortedPosts = sectionName === 'Popular Reviews' ? posts.sort((a, b) => a.usernamesWhoLiked.length - b.usernamesWhoLiked.length) : posts;
                posts = maxPosts ? sortedPosts.slice(-1 * maxPosts) : sortedPosts;
                //setListOfPosts(maxPosts ? sortedPosts.slice(-1*maxPosts) : sortedPosts);
                // put all these posts into pages. Then below, go thru these pages and display them
            } 
            else {
                posts = await PostService.getCertainPosts(props.passedData[0]); // give this a list of Users and receive a list of Posts made by those users
                setTotalPosts(posts.length)
                const sortedPosts = sectionName === 'Popular Reviews' ? posts.sort((a, b) => a.usernamesWhoLiked.length - b.usernamesWhoLiked.length) : posts;
                posts = maxPosts ? sortedPosts.slice(-1 * maxPosts) : sortedPosts;
                //setListOfPosts(maxPosts ? sortedPosts.slice(-1*maxPosts) : sortedPosts); // the backend should be sorting them. The frontend should only be asking for a certain page.
            } 
            // Make every 4 posts in listOfPosts a sublist that can be accessed via a 2d array
            const postsInPages = [];
            if (posts) {
                posts = posts.reverse();
                for (let i = 0; i < posts.length; i += 4) {
                    postsInPages.push(posts.slice(i, i + 4));
                }
            }
            setListOfPosts(postsInPages);
        } catch(error) {
            console.error('Error displaying posts', error);
        }
        setIsLoading(false)
    }, [props.passedData, maxPosts, sectionName]);
    
    useEffect(() => {
        showPosts();
        // everytime 'pageNumber' is changed, refresh the element so that a new page of posts are loaded in
    }, [showPosts]);
    
    // Function to handle page changes
    const changePage = (increment) => {
        setPageNumber(prevPageNumber => prevPageNumber + increment);
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    
    if (isLoading) return <div>Loading...</div>

    const handleLikeClick = async (postId) => {
        try {
            await PostService.createLike(localStorage.getItem('jwtToken'), postId);
            showPosts();
            props.onRefreshProfile();
        } catch (error) {
            console.error('Error creating like');
        }
    }

    const handleDeleteLikeClick = async (username, postId) => {
        try {
            await PostService.deleteLike(localStorage.getItem('jwtToken'), username, postId);
            props.onRefreshProfile();
            showPosts();
        } catch (error) {
            console.error('Error removing like');
        }
    }

    const handleDeletePost = async(postId) => {
        try {
            await PostService.deletePost(localStorage.getItem('jwtToken'), postId);
            showPosts();
            console.log('post deleted');
            props.onRefreshProfile();
        } catch (error) {
            console.error('Error deleting post');
        }
    }
    
    return (
        
        <div className='flex-col reviews'>
            {sectionName && 
                <div className='flex justify-between w-full section-title-container'>
                    <span className='text-lg italic text-hov-blue abrilfatface'>{sectionName}</span>
                    {totalPosts > 2 && <button className='text-sm text-sh-grey'onClick={() => props.onSeeMore(3)}>See More</button>}
                </div>
            }   
            <div className='flex-col space-y-3 post-wall-container'>
                {/* {console.log(loggedInUserInfo) // THIS IS NORMAL WHEN LOGGEDINUSERINFO IS FROM HOME, BUT UNDEFINED WHEN FROM PROFILE} */}
                {listOfPosts.length === 0 && 
                    <div className='w-full flex flex-col justify-center p-1 m-1 border rounded-lg shadow hover:shadow-lg post-container border-[#4950D5] bg-c-grey text-sh-grey shadow-sh-grey'>
                        <div className='flex justify-center my-6 text-lg'>Nothing here yet!</div>
                    </div>
                }
                {listOfPosts.length !== 0 && listOfPosts[pageNumber].slice().map(post => ( // for every user in the list of users, put its name in its own div 
                    <Post key={post.postId} passedData={[post, Array.isArray(props.passedData) ? props.passedData[1] : props.passedData]} onLikeClick={handleLikeClick} onDeleteLikeClick={handleDeleteLikeClick} onDeleteClick={handleDeletePost}/>
                ))}
                {!sectionName && <div ref={bottomRef} className='flex justify-end w-full pr-2 space-x-3 page-iteration-container text-sh-grey'>
                    {pageNumber > 0 ? 
                        <button onClick={() => changePage(-1)} className='italic hover:text-dark-purple'>Previous</button> :
                        <button className='italic text-dark-purple'>Previous</button>
                    }
                    {pageNumber < listOfPosts.length - 1 ?
                        <button onClick={() => changePage(1)} className='italic hover:text-dark-purple'>Next</button> :
                        <button className='italic text-dark-purple'>Next</button>
                    }
                </div>
                }
            </div>
        </div>
    )
}