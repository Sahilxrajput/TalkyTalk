import React from 'react'
import axios from "axios";


const SearchUsersBox = () => {

     const sendMessageHandler = async (e) => {
        try {
          e.preventDefault();
          if (latestMessage.trim()) {
            const response = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/users`
          , { withCredentials: true }   );
            if(response.status == 200)
    
            console.log(response.data);
            console.log("hii");
            console.log(import.meta.env.VITE_BASE_URL);
          }
        } catch (err) {
          console.log("API error:", err);
        }
      };

  return (
    <div>SearchUsersBox</div>
  )
}

export default SearchUsersBox