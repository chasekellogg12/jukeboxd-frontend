import { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import PostWall from '../components/PostWall';
import { useNavigate } from 'react-router-dom';
import "../styles/home.css";

const Home = ({ updateHeader }) => {
    // have buttons that direct us to the CreateUser page or the ListUser page
    const [greeting, setGreeting] = useState(null);
    const [loggedInUserInfo, setLoggedInUserInfo] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true)
    const [listOfUsers, setListOfUsers] = useState([]); // Initialize listOfUsers state
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
                        <div className='flex-col items-center m-6 text-5xl text-white abrilfatface'>
                            <h1>Welcome, {user.name}!</h1>
                        </div>
                    );
                } catch(error) {
                    console.error('Error getting username', error);
                }
            } else {
                setGreeting(
                <div className='flex-col items-center m-6 text-5xl text-white abrilfatface'>
                    <h1 className='h-grey'>Welcome to Jukeboxd!</h1>
                    <div className='flex justify-center space-x-2'>
                        <button className='text-h-grey hover:text-hov-blue'onClick={() => navigate("/create-user")}>
                            Sign Up
                        </button>
                        <span> or </span>
                        <button className='text-h-grey hover:text-hov-blue' onClick={() => navigate("/login")}>
                            Login
                        </button>
                    </div>
                </div>
                );
            }
            setIsLoading(false)
        };

        checkLoginStatus();
    }, []);

    if (isLoading) return <div>Loading...</div>
    
    return (
        <div className='flex flex-col items-center'>
            <div
                className="started-backdrop block md:h-[650px] md:mt-[-5%] md:max-h-[650px] md:w-[950px] md:m-auto max-h-[250px] h-[250px]"
                style={{
                backgroundImage: `url(https://a.ltrbxd.com/resized/sm/upload/tx/hy/xj/lw/sanctuary-2023-1200-1200-675-675-crop-000000.jpg?v=b1d98010cd)`,
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
                z-50">
                    <div className='flex justify-center welcome-message '>
                        {greeting}
                    </div>
            </div>
            <div className='flex-col items-center w-3/5 home-container'>
                
                {/* Pass listOfUsers to PostWall only if it's not empty */}
                <div className='flex justify-center recent-posts'>
                    <PostWall passedData={listOfUsers.length > 0 ? [listOfUsers, loggedInUserInfo] : loggedInUserInfo} />
                </div>
            </div>
        </div>
    )
};
export default Home;
