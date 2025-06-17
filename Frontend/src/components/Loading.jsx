import React from "react";
import '../assets/style/signup.css'

const Loading = ({bg}) => {
  return (
    <span className="flex items-end px-4 circle-loader gap-2 h-5">
      <span className={`h-2.5 w-2.5 rounded-full ${bg ? bg : 'bg-[#b3d3e8]'}`}></span>
      <span className={`h-2.5 w-2.5 rounded-full ${bg ? bg : 'bg-[#b3d3e8]'}`}></span>
      <span className={`h-2.5 w-2.5 rounded-full ${bg ? bg : 'bg-[#b3d3e8]'}`}></span>
    </span>
  );
};

export default Loading;
