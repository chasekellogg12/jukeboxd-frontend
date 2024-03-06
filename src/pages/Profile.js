import { useState, useEffect } from 'react';
import UserService from '../services/UserService';

const Profile = () => {
    // when this page is opened, make a GET request with the JWT token in the header to get the User's name and display it
    const [username, setUsername] = useState('');

    useEffect(() => {
        handleUsername();
    }, []);
    
    const handleUsername = async () => {
        //e.preventDefault();
        try {
            const user = await UserService.getUsername();
            setUsername(user);
            console.log(user);
        } catch(error) {
            console.error('Error displaying profile page', error);
        }
    };

    return (
        <div className='Profile-Name'>
            <h1>
                This is {username}'s profile!
            </h1>
        </div>
    )
}
export default Profile;