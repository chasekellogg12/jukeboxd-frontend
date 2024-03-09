import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
//import './UserProfile.css';
import PostWall from "../components/PostWall";
import ListFollowers from "../components/ListFollowers";
import TopFour from "../components/TopFour";
import ListActivity from "../components/ListActivity";
import logo from "../assets/font/logo512.png";

const UserProfile = () => {
    
    const { thisUsername } = useParams();
    const [loggedInUserInfo, setLoggedInUserInfo] = useState(false);
    // console.log(loggedInUserInfo)
    const [thisUserInfo, setThisUserInfo] = useState(null);
    const [displaySection, setDisplaySection] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const listOfUsers = [thisUsername];
    const [thisUserFollowers, setThisUserFollowers] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [listType, setListType] = useState(0);

    const openPopup = (type) => {
        setListType(type);
        setIsPopupOpen(true);
    }

    const closePopup = () => {
        setIsPopupOpen(false);
    }


    const navigate = useNavigate();

    const findProfileUserInfo = useCallback(async () => { // we should take this and make it so that every component recognizes this
        try {
            const thisUser = await UserService.getUserInfo(thisUsername);
            setThisUserInfo(thisUser);
            setThisUserFollowers(thisUser.followersBasicInfo.map(basicInfo => basicInfo.username));
            console.log(thisUser);
        } catch(error) {
            console.error('Error getting user info', error);
        }
        // for every user in thisUserInfo's following list, get its username and see if it matches loggedInUserInfo's username. If it does, then .some will return true
        
        //setLoggedInFollowsThis(thisUserInfo.followers.some(user => user.username === loggedInUserInfo.username));
        
        // get the list of thisUser's followers from thisUserInfo. If loggedInUserName is in the list of followers, set loggedInFollowsThis to true
            // change getLoggedInUserInfo to return 
        
        setLoading(false);
    }, [thisUsername]);
    
    useEffect(() => { // when you load the page, determine if we're logged in or not. If we are, use displayLoggedIn(). Else, displayNotLoggedIn()
        // console.log('this user:', thisUsername);
        
        const checkLoginStatus = async () => { // we should take this and make it so that every component recognizes this
            if (localStorage.getItem('jwtToken')) {
                try {
                    const user = await UserService.getLoggedInUserInfo(localStorage.getItem('jwtToken')); // we can also do this one time when the user is authenticated and save the user data in storage
                    setLoggedInUserInfo(user);
                } catch(error) {
                    console.error('Error getting username', error);
                }
            }
            setLoading2(false);
        };
        //if (loggedInUsername === thisUsername) setLoggedInProfile(true); // need to account for if the user types in /profile/ (with empty string) THIS COULD BE AN ISSUE BECAUSE ITS IN AN ASYNCRONOUS FUNCTION
        checkLoginStatus();
        findProfileUserInfo();
        // console.log(loggedInUserInfo)
        
    }, [findProfileUserInfo]);

    if (loading || loading2) return <div>Loading...</div>

    const handleFollow = async () => {
        // make a PUT request to update the follower's following list AND to update the followee's follower list. This requires authentication.
        // give the String username of each guy instead of their info
        try {
            await UserService.followUser(localStorage.getItem('jwtToken'), loggedInUserInfo.username, thisUserInfo.username);
            // then we should refresh the page. Don't return anything.
            //setThisUserInfo(newUserInfo);
            findProfileUserInfo();
            //navigate(0);

        } catch(error) {
            console.error('Error handling following', error);
        }
    }
    
    // profile container has 3 things in a column and centered:
        // header container has 2 things left to right
            // an avatar
            // a header-info-container has 2 things left to right space-between:
                // author-name-container has 2 things in a column:
                    // Name
                    // Username
                // follower-following-posts-container has 3 things left to right:
                    // number of posts
                    // followers
                    // following
        
        // buttons container has 4 things left to right (just like the navbar):
            // profile, recent activity, reviews, likes
        
        // sections contianer has things in a column depending on what displaySection is
    return (
        <div className='flex flex-col items-center justify-center space-y-6 profile-container'>
            <div className='flex items-center justify-between w-full p-4 text-white rounded-lg header-container bg-b-blue'>
                <div className='flex items-center space-x-4 avatar-name-container'>
                    <div className='avatar'>
                        <div
                        id='avatar'
                        className='w-1/6 drop-shadow-xl'>
                            <div className='w-40 h-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2'>
                                <img src={logo} alt='Profile Pic' />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col author-name-container'>
                        <span className='text-3xl abrilfatface'>{thisUserInfo.name}</span>
                        <span className='italic text-h-grey'>@{thisUserInfo.username}</span>
                    </div>
                    <div>

                        {loggedInUserInfo && !thisUserFollowers.includes(loggedInUserInfo.username) && loggedInUserInfo.username !== thisUserInfo.username && 
                            <button className='follow-button bg-b-green rounded-lg px-2 py-1 pt-1.5 hover:bg-green-600' onClick={() => handleFollow()}>Follow</button>
                        }
                        {loggedInUserInfo.username === thisUserInfo.username &&
                            <button className='edit-profile-button bg-b-green rounded-lg px-2 py-1 pt-1.5 hover:bg-green-600' onClick={() => navigate('/settings')}>Edit Profile</button>
                        }
                    </div>
                </div>
                
                <div className='flex mr-6 space-x-4 header-info-container text-hov-blue'> 
                    <button className='flex-col abrilfatface hover:text-white' onClick={() => openPopup(0)}>
                        <div>{thisUserInfo.followingBasicInfo.length}</div> 
                        <div>Following</div>
                    </button>
                    <button className='flex-col abrilfatface hover:text-white' onClick={() => openPopup(1)}>
                        <div>{thisUserInfo.followersBasicInfo.length}</div> 
                        <div>Followers</div>
                    </button>
                </div>
            </div>
            <div className='flex justify-around w-full p-4 text-white rounded-lg buttons-container bg-b-blue'>
                <button className='abrilfatface' onClick={() => setDisplaySection(1)} style={{ color: displaySection === 1 ? 'white' : '#9ab' }}>Profile</button>
                <button className='abrilfatface' onClick={() => setDisplaySection(2)} style={{ color: displaySection === 2 ? 'white' : '#9ab' }}>Recent Activity</button>
                <button className='abrilfatface' onClick={() => setDisplaySection(3)} style={{ color: displaySection === 3 ? 'white' : '#9ab' }}>Reviews</button>
                <button className='abrilfatface' onClick={() => setDisplaySection(4)} style={{ color: displaySection === 4 ? 'white' : '#9ab' }}>Likes</button>
            </div>
            <div className='flex-col w-full p-4 rounded-lg sections-container bg-b-blue'>
                {displaySection === 1 && 
                    <div className='flex-col space-y-6 section'>
                        <div className='flex-col top-four-section'>
                            <span className='text-lg italic text-hov-blue abrilfatface'>Favorite Tracks</span>
                            <TopFour passedData={thisUserInfo.topFour}/> 
                        </div>
                        <div className='recent-reviews'>
                            <PostWall passedData={listOfUsers.length > 0 ? [listOfUsers, loggedInUserInfo] : loggedInUserInfo} maxPosts={2} sectionName={'Recent Reviews'} onSeeMore={setDisplaySection}/>
                        </div>
                        
                        
                        <PostWall passedData={listOfUsers.length > 0 ? [listOfUsers, loggedInUserInfo] : loggedInUserInfo} maxPosts={2} sectionName={'Popular Reviews'} onSeeMore={setDisplaySection}/>
                    </div>}
                {displaySection === 2 && <ListActivity passedData={thisUserInfo.recentActivity}/>}  
                {displaySection === 3 && <PostWall passedData={listOfUsers.length > 0 ? [listOfUsers, loggedInUserInfo] : loggedInUserInfo} />}
                {/* {displaySection === 4 && <ListFollowers passedData={thisUserInfo.followingBasicInfo}></ListFollowers>}
                {displaySection === 5 && <ListFollowers passedData={thisUserInfo.followersBasicInfo}></ListFollowers>} */}
                {/* {displaySection === 4 && <PostWall passedData={listOfUsers.length > 0 ? [listOfUsers, loggedInUserInfo] : loggedInUserInfo} />} */}
                {listType === 1 ? <ListFollowers passedData={thisUserInfo.followersBasicInfo} isOpen={isPopupOpen} onClose={closePopup}/> : <ListFollowers passedData={thisUserInfo.followingBasicInfo} isOpen={isPopupOpen} onClose={closePopup}/>}
            </div>
        </div>
    );
}; 
export default UserProfile;