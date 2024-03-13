// if we have some information we want the component to remember/save (like how many times a button is clicked), we use useState
import { useState } from 'react';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { WavyBackground } from '../components/WavyBackground';

export default function Login({ updateHeader }) { 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        // with axios, we can use .catch, .finally, or .then (callback methods)
            // for .then: axios will return a promise. If this is successful, then it will return an event which can then
            // be used as a parameter for a function (this is all inside the parenthesis)

            // for .catch: if something goes wrong, it will return this event
        e.preventDefault(); // the post request was finalized AFTER the default action of refreshing the page occurred, so this prevents the default
        
        // attempt to create a user (see UserService.js) then log its data
        try {
            const token = await UserService.newLoginUser(username, password);

            localStorage.setItem('jwtToken', token.token);

            // Call the updateHeader callback to trigger a re-render of the Header component
            updateHeader();

            navigate('/');

            console.log('User logged in.'); // ok so now we have their token. Now, we can redirect the user to /list-users. make a GET request to /home
        } catch(error) {
            if (error.response && error.response.status === 401) {
                toast.error("Error: Your username and password combination is incorrect!", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                // Handle other types of errors
                toast.error("An error occurred!");
            }
        }

    };

    return ( // have an input box for name
    // for onChange={(e) => setName(e.target.value)} [asynchronous function]:
        // here, when the input box changes, this is an event known as e
        // you then pass in the function setName, which takes e as a parameter
            // e is an object that contains information about an even that occurred
            // e.target is the HTML element that triggered the event (the form element inpout box)
            // e.target.value is the current value of the form element when the event occurred 
            <WavyBackground backgroundFill={'#070c1b'} containerClassName={'flex flex-col items-center justify-center text-h-grey abrilfatface'} className={'flex flex-col items-center justify-center w-3/5 p-4 border rounded-lg login-container border-dark-purple bg-c-grey'}>
            {/* <div className='flex flex-col items-center justify-center text-h-grey abrilfatface'>
                <div className='flex flex-col items-center justify-center w-3/5 p-4 border rounded-lg login-container border-h-grey'> */}
                    <form onSubmit={handleSubmit} className='flex flex-col items-center space-y-3'> 
                        <label>
                            <h3>Username</h3>
                            <input className='p-1 text-black lowercase rounded-md poppins' maxLength='15' type='text' value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} />
                        </label>
                        <label>
                            <h3>Password</h3>
                            <input className='p-1 text-black rounded-md poppins' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </label>
                        <button type='submit' className='w-1/2 px-2 py-1 text-white rounded-lg bg-hov-blue hover:bg-dark-purple poppins'> 
                            Login
                        </button>
                    </form>
                {/* </div>
            </div> */}
        </WavyBackground>
    );
}