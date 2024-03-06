import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = () => {
        setIsLoggedIn(true);
    }

    const logoutUser = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('jwtToken');
    }

    const authContextValue = { // any component with the authContext can use these 2 methods or this 1 boolean variable
        login,
        logoutUser,
        isLoggedIn,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
