import React from 'react'
import "remixicon/fonts/remixicon.css";


const AboutPanel = ({setAboutPanel, chatTitle}) => {

const handleBlock = async () => {
  // await axios.post("/user/block", {
  //   blockerId: currentUser._id,
  //   blockedId: otherUser._id,
  // });
  console.log(chatTitle);
  
};

const handleUnblock = async () => {
  await axios.post("/user/unblock", {
    blockerId: currentUser._id,
    blockedId: otherUser._id,
  });
};



  return (
    <div className='flex flex-col justify-between px-4 pb-2 h-full w-full items-center '>
         <i
        onClick={() => {setAboutPanel(false)}}
        className="text-2xl -mb-4 text-center text-gray-700 font-semibold  ri-arrow-down-wide-fill"
        ></i>
        <button className='bg-blue-800 flex justify-center gap-2 items-center text-white border-1 p-2 w-full rounded-xl'><i className="ri-user-smile-line"></i>View</button>
        <button className='bg-gray-500 flex justify-center gap-2 items-center text-white border-1 p-2 w-full rounded-xl'><i className="ri-delete-bin-6-line"></i>Clear Chat</button>
        <button className='bg-red-600 flex justify-center gap-2 items-center text-white border-1 p-2 w-full text-lg rounded-xl'><i className="ri-spam-line"></i>Block</button>
        <button onClick={handleBlock} className='bg-red-600 flex justify-center gap-2 items-center text-white border-1 p-2 w-full text-lg rounded-xl'><i className="ri-door-open-line"></i>Exit Chat</button>
    </div>
  )
}

export default AboutPanel