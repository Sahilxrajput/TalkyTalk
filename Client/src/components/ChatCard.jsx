import React from "react";
import Loading from "./Loading";

const ChatCard = ({ idx, user, isSelected, onSelect}) => {
  return (
    <div
      onClick={() => onSelect(user._id)}
      key={idx}
      className={`hover:shadow-xl duration-125 ease-in h-16 py-2 w-full px-2 hover:cursor-pointer flex justify-between items-center border border-[#37392e] rounded-2xl ${
        isSelected && "bg-[#28afb0] text-white"
      }`}
    >
      <div className="h-full w-full flex gap-4">
        <div className="h-full rounded-full aspect-square border-[#19647e] border">
          <img
            className="object-cover rounded-full w-full h-full"
            src={user.image.url}
            alt=""
          />
        </div>
        <div className="flex flex-col items-start ">
          <div className="flex justify-start items-center gap-2">
            <h2>
              {user.firstName} {user.lastName}
            </h2>
          </div>
          <h4>{user.username}</h4>
        </div>
      </div>
      {isSelected ? (
        <i class="ri-user-minus-line text-red-700 font-semibold "></i>
      ) : (
        <i className="ri-user-add-fill text-blue-600"></i>
      )}
    </div>
  );
};

export default ChatCard;
