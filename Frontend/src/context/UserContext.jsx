import React, { createContext, useState } from 'react';


// Create the context
export const UserDataContext = createContext();

// Create a provider component
const UserContext = ({ children }) => {
  const [user, setUser] = useState({
    _id:'',
    firstName: '',
    lastName: '',
    url:'',
    filename:'',
    username: '',   
    email: '',
    age: null,
    gender: '',
    bio: '',
  });

  // Function to update user data
//   const updateUser = (newUserData) => {
//     setUser((prevUser) => ({ ...prevUser, ...newUserData }));
//   };

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext