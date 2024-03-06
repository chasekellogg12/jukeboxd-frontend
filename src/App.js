import CreateUser from './pages/CreateUser';
import ListUsers from './pages/ListUsers';
import Home from './pages/Home';
import Login from './pages/Login';
import Header from './components/Header';
import CreatePostPage from './pages/CreatePostPage';
import UserProfile from './pages/UserProfile';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { React, useState } from 'react';
import './App.css';
import SettingsPage from './pages/SettingsPage';

// we need a global variable that has the JWT token. If the user is not authenticated, this will have ' ' 

const App = () => {
  const [headerKey, setHeaderKey] = useState(0);

  const updateHeader = () => {
    // Increment the key to trigger a re-render of the Header component
    setHeaderKey((prevKey) => prevKey + 1);
  };

  return ( // if a user can't see a page when they are logged in or logged out, redirect home accordingly
    <BrowserRouter>
      <div className='App bg-c-grey poppins'>
        <Header key={headerKey} updateHeader={updateHeader}/>
        <div className='py-5'>
            <Routes>
              <Route path='/' element={<Home updateHeader={updateHeader}/>}></Route>
              <Route path='/create-user' element={localStorage.getItem('jwtToken') ? <Navigate to='/'/> : <CreateUser updateHeader={updateHeader}/>}></Route>
              <Route path='/login' element={localStorage.getItem('jwtToken') ? <Navigate to='/'/> : <Login updateHeader={updateHeader}/>}></Route>
              <Route path='/create-post' element={localStorage.getItem('jwtToken') ? <CreatePostPage/> : <Navigate to='/'/>}></Route>
              <Route path='/list-users' element={<ListUsers />}></Route>
              <Route path="/profile/:thisUsername" element={<UserProfile/>} />
              <Route path='/settings' element={localStorage.getItem('jwtToken') ? <SettingsPage/> : <Navigate to='/'/>}></Route>
            </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
export default App;
