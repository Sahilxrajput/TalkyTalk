import React from 'react'
import "remixicon/fonts/remixicon.css";


const ProfilePanel = ({setProfilePanel}) => {
  return (
      <div className="flex w-full flex-col justify-center">
        <div
          className=" flex flex-col items-center justify-start  gap-8 rounded-4xl w-full bg-red-400 z-50 h-full left-0 top-0"
        >
          <i
          onClick={()=>setProfilePanel(false)}
            className="text-2xl  text-gray-700 font-semibold ri-arrow-down-wide-fill"
          ></i>
          <div className='h-32 rounded-full bg-green-400 aspect-square '>
            <img  className="w-full h-full  rounded-full object-cover" src="https://i.guim.co.uk/img/media/53e33368ee15c494000585b83fbeefc16e6de41e/0_197_3500_2100/master/3500.jpg?width=465&dpr=1&s=none&crop=none" alt="" />
          </div>

          {/* /////bio////////// */}
          <div className="border-2 w-[80%] border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
          <i className="ri-quill-pen-ai-fill text-[#D30C7B]"></i>
          <input
            name="bio"
            className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
            type="text"
            placeholder="Bio"
            onChange={(e) => changeHandler(e)}
          />
        </div>
          <div className="border-2 w-[80%] border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
          <i className="ri-quill-pen-ai-fill text-[#D30C7B]"></i>
          <input
            name="First name"
            className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
            type="text"
            placeholder="First Name"
            onChange={(e) => changeHandler(e)}
          />
        </div>
          <div className="border-2 w-[80%] border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
          <i className="ri-quill-pen-ai-fill text-[#D30C7B]"></i>
          <input
            name="Last Name"
            className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
            type="text"
            placeholder="Last Name"
            onChange={(e) => changeHandler(e)}
          />
        </div>
          <div className="border-2 w-[80%] border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
          <i className="ri-quill-pen-ai-fill text-[#D30C7B]"></i>
          <input
            name="username"
            className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
            type="text"
            placeholder="username"
            onChange={(e) => changeHandler(e)}
          />
        </div>
          {/* <div className="border-2 w-[80%] border-yellow-500 flex items-center justify-start  gap-2 px-3 py-2 rounded-lg">
          <i className="ri-quill-pen-ai-fill text-[#D30C7B]"></i>
          <input
            name="password"
            className="appearance-none border-none w-[90%] bg-transparent p-0 m-0 focus:outline-none"
            type="password"
            placeholder="password"
            onChange={(e) => changeHandler(e)}
          />
        </div> */}
        </div>
    </div>
  )
}

export default ProfilePanel