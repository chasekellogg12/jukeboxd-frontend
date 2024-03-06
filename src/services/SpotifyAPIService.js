import axios from 'axios';
// this file does the service of making HTTP requests
// IMPORTANT NOTE:
    // SpotifyAPI only allows like 180 requests to the API per minute. 
    // For this reason, we should only request on time when we have to and then save the data that they give us

// INSTEAD OF RE-GETTING A TOKEN EVERY TIME, JUST GET A TOKEN FOR SOMEONE WHEN THEY LOGIN AND STORE IT IN LOCALSTORAGE.
// WHEN AN HOUR RUNS OUT, REFRESH THIS TOKEN
const SpotifyAPIService = { // 
    getSongs: async (topFourIds) => {
        try {
            const token = await axios.post('https://accounts.spotify.com/api/token', 
                'grant_type=client_credentials&client_id=c3ce4c1f311246d6b0bce7de8fcbb9dc&client_secret=46c0d99e82a3403e841ec9d38ce3436d'
            , {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })
            
            const response = await axios.get(`https://api.spotify.com/v1/tracks?ids=${topFourIds}`, {
                headers: {
                    'Authorization': `Bearer ${token.data.access_token}`
                }
            });
            return response.data.tracks;
        } catch(error) {
            console.error('Error getting songs from spotify api.');
            throw error;
        }
    },
    searchTracks: async(query) => {
        try {
            const token = await axios.post('https://accounts.spotify.com/api/token', 
            'grant_type=client_credentials&client_id=c3ce4c1f311246d6b0bce7de8fcbb9dc&client_secret=46c0d99e82a3403e841ec9d38ce3436d'
        , {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
            headers: {
                'Authorization': `Bearer ${token.data.access_token}`
            }
        });
        return response.data.tracks;
        } catch (error) {
            console.error('Error searching for content')
        }
    }
};
export default SpotifyAPIService;