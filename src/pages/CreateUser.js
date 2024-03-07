// if we have some information we want the component to remember/save (like how many times a button is clicked), we use useState
import { useState } from 'react';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// export default means that this is the main component in this file
    // if we want to use this component in another file, we include this 
export default function CreateUser({ updateHeader }) { 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const validChars = 'abcdefghijklmnopqrstuvwxyz_1234567890';

    const navigate = useNavigate();

    // have a format checker that takes = email, username, and passwords
    
    const formatChecker = () => {
        for (let i = 0; i < username.length; i++) {
            if (!validChars.includes(username[i])) {
                return 'Error: Username contains invalid characters!';
            }
        }
        if (username.length < 3) {
            return 'Error: Your username must be at least 3 characters long!';
        }
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(email)) {
            return 'Error: Your email is invalid!';
        }
        if (password1 !== password2) {
            return 'Error: Your passwords do not match!';
        }
        if (password1.length < 8) {
            return 'Error: Your password must be at least 8 characters long';
        }
        return ''; // return an empty string if there are no errors
    }
    
    const handleSubmit = async (e) => {
        // with axios, we can use .catch, .finally, or .then (callback methods)
            // for .then: axios will return a promise. If this is successful, then it will return an event which can then
            // be used as a parameter for a function (this is all inside the parenthesis)

            // for .catch: if something goes wrong, it will return this event
        e.preventDefault(); // the post request was finalized AFTER the default action of refreshing the page occurred, so this prevents the default

        const formatError = formatChecker();
        if (formatError) {
            toast.error(formatError, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        
        // attempt to create a user (see UserService.js) then log its data
        try {
            const token = await UserService.createUser(name, email, username, password1);

            localStorage.setItem('jwtToken', token.token);

            // Call the updateHeader callback to trigger a re-render of the Header component
            updateHeader();
            
            navigate('/');

            console.log('User created.'); // ok so now we have their token. Now, we can redirect the user to /list-users. make a GET request to /home
        } catch(error) {
            if (error.response && error.response.status === 409) {
                toast.error(error.response.data, {
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


            <div className='flex flex-col items-center justify-center text-h-grey abrilfatface'>
                <div className='flex flex-col items-center justify-center w-3/5 p-4 border rounded-lg login-container border-h-grey'>
                    <form onSubmit={handleSubmit} className='flex flex-col items-center space-y-3'> 
                        <label>
                            <h3>Name</h3>
                            <input className='p-1 text-black rounded-md poppins' maxLength='15' type='text' value={name} onChange={(e) => setName(e.target.value)} />
                        </label>
                        <label>
                            <h3>Email</h3>
                            <input className='p-1 text-black lowercase rounded-md poppins' maxLength='30' type='text' value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} />
                        </label>
                        <label>
                            <h3>Username</h3>
                            <input className='p-1 text-black lowercase rounded-md poppins' maxLength='15' type='text' value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} />
                        </label>
                        <label>
                            <h3>Password</h3>
                            <input className='p-1 text-black rounded-md poppins' maxLength='15' type='password' value={password1} onChange={(e) => setPassword1(e.target.value)} />
                        </label>
                        <label>
                            <h3>Confirm Password</h3>
                            <input className='p-1 text-black rounded-md poppins' maxLength='15' type='password' value={password2} onChange={(e) => setPassword2(e.target.value)} />
                        </label>

                        <button type='submit' className='w-1/2 px-2 py-1 text-white rounded-lg bg-b-green hover:bg-green-600 poppins'> 
                            Sign Up 
                        </button>
                    </form>
                </div>
            </div>
    );
}