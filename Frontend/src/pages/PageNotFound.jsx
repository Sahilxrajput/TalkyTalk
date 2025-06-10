import React from "react";
// import BgImg from "../assets/404-error.png";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center w-screen">
        {/* <div
      className=" bg-cover bg-center h-[500px] w-[500px]"
      style={{ backgroundImage: `url(${BgImg})` }}
    ></div> */}
    <Link
            to="/home"
            className=" font-semibold  bg-gray-300 p-4 rounded-xl border-2 text-[#D30C7B]"
          >
            Return Home
          </Link>
    </div>
  );
};

export default PageNotFound;
