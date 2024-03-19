import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
//import './UserProfile.css';
import PostWall from "../components/PostWall";
import ListFollowers from "../components/ListFollowers";
import TopFour from "../components/TopFour";
import ListActivity from "../components/ListActivity";
import logo from "../assets/font/logo512.png";
import TrackService from "../services/TrackService";
import TrackSearch from "../components/TrackSearch";
import NewName from "../components/NewName";
import NewAvatar from "../components/NewAvatar";

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
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [songToBeChanged, setSongToBeChanged] = useState(0);
    const [isChangeNameOpen, setIsChangeNameOpen] = useState(false);
    const [isChangeAvatarOpen, setIsChangeAvatarOpen] = useState(false);

    const openPopup = (type) => {
        setListType(type);
        setIsPopupOpen(true);
    }

    const closePopup = () => {
        setIsPopupOpen(false);
    }

    const openSearchPopup = (index) => {
        setSongToBeChanged(index);
        setIsSearchOpen(true);
    }

    const closeSearchPopup = () => {
        setIsSearchOpen(false);
    }

    const openChangeNamePopup = () => {
        setIsChangeNameOpen(true);
    }

    const closeChangeNamePopup = () => {
        setIsChangeNameOpen(false);
    }

    const openChangeAvatarPopup = () => {
        setIsChangeAvatarOpen(true);
    }

    const closeChangeAvatarPopup = () => {
        setIsChangeAvatarOpen(false);
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


    const handleUnfollow = async () => {
        try {
            await UserService.unfollowUser(localStorage.getItem('jwtToken'), loggedInUserInfo.username, thisUserInfo.username);
            // then we should refresh the page. Don't return anything.
            //setThisUserInfo(newUserInfo);
            findProfileUserInfo();
            //navigate(0);

        } catch(error) {
            console.error('Error handling following', error);
        }
    }
    
    const addTrackToBackend = async (track) => { // add the track to OUR backend if it's not already there. Then, set change the topFourSongs array and update the backend with it.
        try {
            await TrackService.addTrackToTop4(localStorage.getItem('jwtToken'), songToBeChanged, track);
            findProfileUserInfo();
            //showPosts();
            console.log('Track added to OUR backend');
        } catch (error) {
            console.error('Error adding track to our backend');
        }
    };

    return (
        <div className='flex flex-col items-center justify-center mt-10 space-y-6 profile-container'>
            <div className='flex items-center justify-between w-full p-4 text-white rounded-lg header-container bg-b-blue group'>
                <TrackSearch isOpen={isSearchOpen} onClose={closeSearchPopup} passUp={addTrackToBackend}/>
                <NewName isOpen={isChangeNameOpen} onClose={closeChangeNamePopup} currUser={loggedInUserInfo} resetProfile={findProfileUserInfo}/>
                <NewAvatar isOpen={isChangeAvatarOpen} onClose={closeChangeAvatarPopup} currUser={loggedInUserInfo} resetProfile={findProfileUserInfo}/>
                <div className='flex items-center space-x-4 avatar-name-container'>
                    <div className='relative avatar'>
                        <div
                        id='avatar'
                        className='w-1/6 drop-shadow-xl'>
                            <div className='w-40 h-40 rounded-full ring ring-dark-purple'>
                                <img className='w-40 h-40 rounded-full' src={thisUserInfo.avatar} alt='Profile Pic' />
                            </div>
                        </div>
                        {loggedInUserInfo && loggedInUserInfo.username === thisUserInfo.username &&
                            <svg onClick={() => openChangeAvatarPopup()} className='absolute items-center justify-center hidden p-1 rounded-lg cursor-pointer -top-1 -right-1 group-hover:flex bg-c-grey stroke-hov-blue'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C6AEF2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="bevel">
                                <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                                <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                            </svg>}
                    </div>
                    <div className='flex flex-col author-name-container text-clip'>
                        <div className='relative text-3xl abrilfatface'>
                            <div>{thisUserInfo.name}</div>
                            {loggedInUserInfo && loggedInUserInfo.username === thisUserInfo.username &&
                            <svg onClick={() => openChangeNamePopup()} className='absolute items-center justify-center hidden p-1 rounded-lg cursor-pointer -top-3 -right-5 group-hover:flex bg-c-grey stroke-hov-blue'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C6AEF2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="bevel">
                                <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                                <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                            </svg>}
                        </div>
                        <div className='italic text-h-grey'>@{thisUserInfo.username}</div>
                    </div>
                    <div>
                        {loggedInUserInfo && !thisUserFollowers.includes(loggedInUserInfo.username) && loggedInUserInfo.username !== thisUserInfo.username && 
                            <button className='follow-button bg-hov-blue rounded-lg px-2 py-1 pt-1.5 hover:bg-blue-600' onClick={() => handleFollow()}>Follow</button>
                        }
                        {loggedInUserInfo && thisUserFollowers.includes(loggedInUserInfo.username) && loggedInUserInfo.username !== thisUserInfo.username && 
                            <button className='follow-button bg-blue-600 rounded-lg px-2 py-1 pt-1.5 hover:bg-hov-blue' onClick={() => handleUnfollow()}>Unfollow</button>
                        }
                        {/* {loggedInUserInfo.username === thisUserInfo.username &&
                            <button className='edit-profile-button bg-orange-400 rounded-lg px-2 py-1 pt-1.5 hover:bg-orange-600' onClick={() => navigate('/settings')}>Edit Profile</button>
                        } */}
                    </div>
                </div>
                
                <div className='flex mr-6 space-x-4 header-info-container text-h-grey'> 
                    <button className='flex-col poppins hover:text-dark-purple' onClick={() => openPopup(0)}>
                        <div>{thisUserInfo.followingBasicInfo.length}</div> 
                        <div>Following</div>
                    </button>
                    <button className='flex-col poppins hover:text-dark-purple' onClick={() => openPopup(1)}>
                        <div>{thisUserInfo.followersBasicInfo.length}</div> 
                        <div>Followers</div>
                    </button>
                </div>
            </div>
            <div className='flex justify-around w-full p-4 rounded-lg text-hov-blue buttons-container bg-b-blue'>
                <button className='poppins ' onClick={() => setDisplaySection(1)} style={{ color: displaySection === 1 ? '#FFA726' : '#4950D5' }}>Profile</button>
                <button className='poppins' onClick={() => setDisplaySection(2)} style={{ color: displaySection === 2 ? '#FFA726' : '#4950D5' }}>Recent Activity</button>
                <button className='poppins' onClick={() => setDisplaySection(3)} style={{ color: displaySection === 3 ? '#FFA726' : '#4950D5' }}>Reviews</button>
                {/* <button className='poppins' onClick={() => setDisplaySection(4)} style={{ color: displaySection === 4 ? '#FFA726' : '#4950D5' }}>Likes</button> */}
            </div>
            <div className='flex-col w-full p-4 rounded-lg sections-container bg-b-blue'>
                {displaySection === 1 && 
                    <div className='flex-col space-y-6 section'>
                        <div className='flex-col top-four-section'>
                            <span className='text-lg italic text-hov-blue poppins'>Favorite Tracks</span>
                            <TopFour passedData={thisUserInfo.topFour} loggedInUser={loggedInUserInfo} thisUser={thisUserInfo} openSearch={openSearchPopup}/> 
                        </div>
                        <div className='recent-reviews'>
                            <PostWall passedData={listOfUsers.length > 0 ? [listOfUsers, loggedInUserInfo] : loggedInUserInfo} maxPosts={2} sectionName={'Recent Reviews'} onSeeMore={setDisplaySection} onRefreshProfile={findProfileUserInfo}/>
                        </div>
                        
                        
                        <PostWall passedData={listOfUsers.length > 0 ? [listOfUsers, loggedInUserInfo] : loggedInUserInfo} maxPosts={2} sectionName={'Popular Reviews'} onSeeMore={setDisplaySection} onRefreshProfile={findProfileUserInfo}/>
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