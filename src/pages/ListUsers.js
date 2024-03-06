import { useState, useEffect } from 'react';
import UserService from '../services/UserService';

const ListUsers = () => {
    // when this page is opened, make a GET request to get a list of all the Users
    const [listOfUsers, setListOfUsers] = useState([]);

    useEffect(() => {
        showUsers();
    }, []);
    
    const showUsers = async () => {
        //e.preventDefault();
        try {
            const users = await UserService.getAllUsernames(); // should give a list of usernames
            setListOfUsers(users);
        } catch(error) {
            console.error('Error displaying users', error);
        }
    };

    return (
        <div className='list-of-users'> 
            {listOfUsers.map(user => ( // for every user in the list of users, put its name in its own div
                <div key={user}>{user}</div>
            ))}
        </div>
    )
}
export default ListUsers;