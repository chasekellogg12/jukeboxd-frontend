import { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import PostWall from '../components/PostWall';
import { useNavigate } from 'react-router-dom';
import background from '../assets/font/backsplash.jpeg';
import "../styles/home.css";
import { set } from 'date-fns';

const Home = ({ updateHeader }) => {
    // have buttons that direct us to the CreateUser page or the ListUser page
    const [greeting, setGreeting] = useState(null);
    const [loggedInUserInfo, setLoggedInUserInfo] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true)
    const [listOfUsers, setListOfUsers] = useState([]); // Initialize listOfUsers state
    const [feedType, setFeedType] = useState(0);
    const [showAll, setShowAll] = useState(true);
    //const [token, setToken] = useState(null)

    const navigate = useNavigate();

    useEffect(() => { // when you load the page, determine if we're logged in or not. If we are, use displayLoggedIn(). Else, displayNotLoggedIn()
        //setToken(localStorage.getItem('jwtToken'))
        const checkLoginStatus = async () => { // we should take this and make it so that every component recognizes this
            if (localStorage.getItem('jwtToken')) {
                try {
                    const user = await UserService.getLoggedInUserInfo(localStorage.getItem('jwtToken')); // we can also do this one time when the user is authenticated and save the user data in storage
                    setLoggedInUserInfo(user)
                    setGreeting(
                        <div className='flex-col items-center m-6 text-5xl tracking-wide text-center text-white poppins'>
                            <h1>Welcome back, {user.name}.</h1>
                        </div>
                    );
                } catch(error) {
                    console.error('Error getting username', error);
                }
            } else {
                setGreeting(
                <div className='flex-col items-center m-4 space-y-4 text-5xl font-bold tracking-wide text-white poppins'>
                    <div className='space-x-2.5 flex-col text-center'>
                        {/* <span className='h-grey'>Welcome to</span>
                        <span className=' bg-clip-text bg-gradient-to-r from-hov-blue via-dark-purple to-hov-blue'>Jukeboxd</span> */}
                        <div>Track music you’ve listened to.</div>
                        <div>Tell your friends what’s good.</div>
                    </div>
                    
                    <div className='flex justify-center p-1 space-x-10 text-3xl font-semibold'>
                        <button className='px-3 py-2 pb-2.5 rounded-md bg-gradient-to-r from-orange-400 to-dark-purple hover:from-dark-purple hover:to-dark-purple'onClick={() => navigate("/create-user")}>
                            Sign Up - It's Free
                        </button>
                    </div>
                </div>
                );
            }
            setIsLoading(false)
        };

        checkLoginStatus();
    }, [listOfUsers]);

    const changeFeed = (type) => {
        setFeedType(type);
        if (type === 1) {
            setShowAll(false);
            let followingUsernames = [];
            loggedInUserInfo.followingBasicInfo.map(following => followingUsernames.push(following.username));
            
            setListOfUsers(followingUsernames); // listOfUsers needs to be a list of strings
        } else {
            setShowAll(true);
        }
    }

    if (isLoading) return <div>Loading...</div>
    
    return (
        <div className='flex flex-col items-center'>
            <div
                className="started-backdrop block md:h-[550px] md:mt-[-10%] md:max-h-[550px] md:w-[850px] md:m-auto max-h-[250px] h-[250px] justify-center"
                style={{
                backgroundImage: `url(https://th.bing.com/th/id/OIG3.vODywcOaLE6vPBCreyBm?w=1024&h=1024&rs=1&pid=ImgDetMain)`,
                }}>
            </div>
            <div
                className="flex 
                flex-col 
                items-center 
                relative 
                mt-[5%]
                md:mt-[-15%] 
                gap-2 
                z-40">
                    <div className='flex justify-center mb-3 welcome-message'>
                        {greeting}
                    </div>
            </div>
            {/* readd w-3/5 */}
            <div className='flex-col items-center w-full home-container'>
                
                {/* Pass listOfUsers to PostWall only if it's not empty */}
                <div className='flex flex-col justify-center recent-posts'>
                    {localStorage.getItem('jwtToken') && 
                        <div className='flex items-start justify-center w-full mb-4 space-x-10 poppins'> 
                            {feedType === 0 ? <button className='inline-block text-orange-700 drop-shadow(0 10px 8px rgb(251 146 60 / .50))'>All Users</button> : <button onClick={() => changeFeed(0)} className='text-orange-400 hover:text-orange-700'>All Users</button>}
                            {feedType === 0 ? <button onClick={() => changeFeed(1)} className='text-orange-400 hover:text-orange-700'>Following</button> : <button className='text-orange-700'>Following</button>}
                        </div>
                    }
                    <div className='text-lg italic text-hov-blue poppins'>Recent reviews on Jukeboxd...</div>
                    <PostWall passedData={!showAll ? [listOfUsers, loggedInUserInfo] : loggedInUserInfo} />
                </div>
            </div>
        </div>
    )
};
export default Home;
