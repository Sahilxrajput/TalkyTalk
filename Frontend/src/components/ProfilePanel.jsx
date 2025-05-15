import React from 'react'
import "remixicon/fonts/remixicon.css";


const ProfilePanel = ({setProfilePanel}) => {
  return (
     <div className="h-screen pt-[15%]">
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

      {/* <div
        className="flex h-screen w-full mt-12 overflow-y-auto overflow-x-hidden flex-col gap-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {foundUsers.map((user, idx) => {
          const isSelected = selectedUserId === user._id;

          return (
            <div
            onClick={() => selectedUserHandler(user._id)}    
              key={idx}
              className={` h-16 py-2 w-full px-6 flex justify-between items-center rounded-2xl ${
                isSelected ? "bg-red-500 " : "bg-yellow-400"
              }`}
            >
              <div className="flex flex-col items-start ">
                <div className="flex justify-start items-center gap-2">
                  <h2>
                    {user.firstName} {user.lastName}
                  </h2>
                  {user.gender === "male" ? (
                    <i className="text-[#2986cc] ri-men-fill"></i>
                  ) : (
                    <i className="text-[#c90076] ri-women-fill"></i>
                  )}
                </div>
                <h4>{user.username}</h4>
              </div>
              {isSelected ? (
                 <button 
                 type="submit"
                 onClick={(e)=>{
                  e.stopPropagation();
                  setAddFriend(prev => [...prev, user._id]);
                  submitHandler(user)}}
                 className="bg-blue-700 flex justify-between text-sm -mr-2 items-center p-2 rounded-lg">Chat<i class="ri-sparkling-fill"></i></button>       
                 ) : (
                <i class="ri-user-add-fill"></i>
              )}
            </div>
          );
        })}
      </div> */}
    </div>
  )
}

export default ProfilePanel