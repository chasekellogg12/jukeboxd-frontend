import axios from 'axios'
// this file does the service of making HTTP requests

const PostService = { // UserService is an object that contains the asynchronous method createUser
    // you give createUser a name, email. It attempts to get a response from backend when giving these in a post request via axios.
        // if it gets this response, return its data 
        // otherwise (it catches an error), throw error to console
    createPost: async (jwtToken, postText, postSubject) => {
        try {
            const id = postSubject.id;
            const name = postSubject.name;
            const artist = postSubject.artists[0].name;
            const album = postSubject.album.name;
            const year = postSubject.album.release_date.slice(0, 4);
            const albumCoverArt = postSubject.album.images[0].url;
            
            await axios.post('https://jukeboxd-4502c9ba8f0c.herokuapp.com/post/addPost', {postText, id, name, artist, album, year, albumCoverArt}, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });
        } catch(error) {
            console.error('Error creating post.');
            throw error;
        }
    },
    getAllPosts: async() => {
        try {
            const response = await axios.get('https://jukeboxd-4502c9ba8f0c.herokuapp.com/post/allPosts'); // give it a page number
            return response.data;
        } catch(error) {
            console.error('Error getting all posts');
            throw error;
        }
    },
    getCertainPosts: async(listOfUsers) => {
        try {
            const response = await axios.post('https://jukeboxd-4502c9ba8f0c.herokuapp.com/post/certainPosts', {listOfUsers}); // give it a set of users and a page number returns a list of posts
            return response.data;
        } catch(error) {
            console.error('Error getting certain posts');
            throw error;
        }
    },
    createLike: async(jwtToken, postId) => {
        try {
            await axios.post('https://jukeboxd-4502c9ba8f0c.herokuapp.com/like/createLike', {postId}, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });
            console.log('like created in backend')
        } catch(error) {
            console.error('Error liking post');
            throw error;
        }
    }
};
export default PostService;