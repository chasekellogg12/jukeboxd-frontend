import axios from 'axios'
// this file does the service of making HTTP requests

const UserService = { // UserService is an object that contains the asynchronous method createUser
    // you give createUser a name, email. It attempts to get a response from backend when giving these in a post request via axios.
        // if it gets this response, return its data 
        // otherwise (it catches an error), throw error to console
    createUser: async (name, email, username, password) => { // takes User's info as parameters, gives this info to the backend, then returns the JWT token
        try {
            const response = await axios.post('https://jukeboxd-4502c9ba8f0c.herokuapp.com/api/register', {name, email, username, password}); // sends these things in the body of the request
            return response.data; // the response is a ResponseEntity<JwtRespose>. response.data is a JwtRespose, which is a String that is the users token
        } catch(error) {
            console.error('Error creating user', error);
            throw error;
        }
    },
    updateUser: async(jwtToken, name, email, avatar) => {
        try {
            await axios.post('https://jukeboxd-4502c9ba8f0c.herokuapp.com/api/loggedInUserInfo', {name, email, avatar}, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });
        } catch (error) {
            console.error('Error updating user', error);
            throw error;
        }
    },
    loginUser: async (username, password) => {
        const base64Credentials = btoa(`${username}:${password}`);
        try {
            const response = await axios.post('https://jukeboxd-4502c9ba8f0c.herokuapp.com/api/authenticate', {username, password}, { // put the Authorization: 'Basic'... in the body instead it's more secure. We dont even need to use Basic. Just create a token the same way u did in /api/register
                headers: {
                    'Authorization': `Basic ${base64Credentials}`
                }
            });
            return response.data;
        } catch(error) {
            console.error('Error logging in', error);
            throw error;
        }
    },
    newLoginUser: async (username, password) => {
        try {
            const response = await axios.post('https://jukeboxd-4502c9ba8f0c.herokuapp.com/api/authenticate', {username, password});
            return response.data;
        } catch(error) {
            console.error('Error logging in', error);
            throw error;
        }
    },
    getLoggedInUserInfo: async (jwtToken) => { // takes the JWT token as a parameter, gives this JWT token to the backend, then returns a String of the User's username if successful
        try {
            const response = await axios.get('https://jukeboxd-4502c9ba8f0c.herokuapp.com/api/loggedInUserInfo', {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });
            return response.data; 
        } catch(error) {
            console.error('Error getting username', error);
            throw error;
        }
    },
    getUserInfo: async (thisUsername) => {
        try {
            const response = await axios.post('https://jukeboxd-4502c9ba8f0c.herokuapp.com/api/userInfo', {thisUsername});
            return response.data;
        } catch(error) {
            console.error('Error getting user info', error);
            throw error;
        }
    },
    getAllUsernames: async () => { // no authentication required
        try {
            // axios.get returns a promise that you have to await on.
            // if this promise resolves, it becomes a response object
            // this response object has .data (for data), .status (for HTTP status code), .headers (for headers)
            const response = await axios.get('https://jukeboxd-4502c9ba8f0c.herokuapp.com/api/allUsernames', {
                //maxRedirects: 0, // Set maxRedirects to 0 to prevent automatic redirection
            }); 
            return response.data;
        } catch(error) {
            console.error('Error displaying users from service', error);
            throw error;
        }
    },
    followUser: async (jwtToken, follower, followed) => {
        try {
            const newUserInfo = await axios.post('https://jukeboxd-4502c9ba8f0c.herokuapp.com/api/follow', {follower, followed}, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            })
            console.log('User successfully followed');
            return newUserInfo.data;
        } catch (error) {
            console.error('Error following user', error);
            throw error;
        }
    },
    unfollowUser: async (jwtToken, followerUsername, followingUsername) => {
        try {
            await axios.post(`https://jukeboxd-4502c9ba8f0c.herokuapp.com/api/deleteFollow/${followerUsername}/${followingUsername}`, {}, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            })
            console.log('User successfully unfollowed');
            return
        } catch (error) {
            console.error('Error unfollowing user', error);
            throw error;
        }
    }
};
export default UserService;