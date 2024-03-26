import axios from 'axios'
// this file does the service of making HTTP requests

const TrackService = { // UserService is an object that contains the asynchronous method createUser
    // you give createUser a name, email. It attempts to get a response from backend when giving these in a post request via axios.
        // if it gets this response, return its data 
        // otherwise (it catches an error), throw error to console
    addTrackToTop4: async (jwtToken, songToBeChanged, track) => { // takes a bunch of info about the track and a index position (0, 1, 2, or 3). In the backend, if we don't already have this track ID in our database, add it. Then, edit the user's top 4
        try {
            const id = track.id;
            const name = track.name;
            const artist = track.artists[0].name;
            const album = track.album.name;
            const year = track.album.release_date.slice(0, 4);
            const albumCoverArt = track.album.images[0].url;

            console.log('id', id);
            console.log('name', name);
            console.log('artist', artist);
            console.log('album', album);
            console.log('year', year);
            console.log('albumCoverArt', albumCoverArt);

            await axios.post('https://jukeboxd-4502c9ba8f0c.herokuapp.com/track/updateUserTop4', {songToBeChanged, id, name, artist, album, year, albumCoverArt}, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });
        } catch(error) {
            console.error('Error updating users top 4.');
            throw error;
        }
    },
    getRand10Tracks: async() => {
        try {
            const response = await axios.get('https://jukeboxd-4502c9ba8f0c.herokuapp.com/track/getRand10');
            return response.data;
        } catch(error) {
            console.log('Error getting random 10 tracks');
            throw error;
        }
    }
};
export default TrackService;