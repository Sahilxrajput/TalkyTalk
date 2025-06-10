import React, { useEffect, useState } from "react";
import Coffee from "../assets/pic/Coffee.svg";
import pookie from "../assets/pic/pookie.png";
import cloud from "../assets/pic/cloud.png";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "remixicon/fonts/remixicon.css";
import { Link, useNavigate } from "react-router-dom";
import CursorFollower from "../components/CursorFollower";
import BatteryStatus from "../components/BatteryStatus";

const Landingpage = () => {
  const [hoveringText, setHoveringText] = useState(false);

  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen flex items-center justify-center overflow-hidden relative bg-[#B4D2BA]">
      <div className="flex gap-12 items-baseline">
        <h1
          onMouseEnter={() => setHoveringText(true)}
          onMouseLeave={() => setHoveringText(false)}
          className="text-6xl underline-offset-6 border-b-2 welcome"
        >
          Welcome
        </h1>
        <h1
          onMouseEnter={() => setHoveringText(true)}
          onMouseLeave={() => setHoveringText(false)}
          className="text-3xl welcome border-b-2"
        >
          to
        </h1>
        <h1
          onMouseEnter={() => setHoveringText(true)}
          onMouseLeave={() => setHoveringText(false)}
          style={{ textShadow: "3px 2px 0px #CBB931" }}
          className="text-8xl border-b-2 text-[#33261D] talkytalk"
        >
          TalkyTalk
        </h1>
      </div>

      <div className="icons absolute top-4 right-6 flex gap-3 text-2xl">
        <a href="https://github.com/Sahilxrajput">
          <i className="ri-github-fill"></i>
        </a>
        <a href="https://www.linkedin.com/in/sahil-rajput3417/">
          <i className="ri-linkedin-box-fill"></i>
        </a>
        <a href="https://www.instagram.com/sahil.env/">
          <i className="ri-instagram-line"></i>
        </a>
        <a href="https://x.com/SaahilxRajput">
          <i className="ri-twitter-x-fill"></i>
        </a>
      </div>

      <div className="flex absolute justify-between w-1/4 bottom-16">
        <Link
          to="/home"
          onMouseEnter={() => setHoveringText(true)}
          onMouseLeave={() => setHoveringText(false)}
          className="rounded-sm w-36 h-12 border-2 border-[#33261D] font-semibold flex items-center justify-center bg-[#334E58] text-[#B4D2BA] text-xl"
        >
          Go To Home
        </Link>
        <Link
          to="/signup"
          onMouseEnter={() => setHoveringText(true)}
          onMouseLeave={() => setHoveringText(false)}
          className="rounded-sm w-36 h-12 border-2 border-[#33261D] font-semibold flex items-center justify-center bg-[#334E58] text-[#B4D2BA] text-xl"
        >
          Signup
        </Link>
      </div>

      <div className="absolute top-6 w-1/4 left-6 welcome h-12  text-[#33261D] text-xl">
        <h1
          className=" align-middle "
          onMouseEnter={() => setHoveringText(true)}
          onMouseLeave={() => setHoveringText(false)}
        >
          Made with{" "}
          <i className="ri-heart-pulse-fill text-red-600 heart-beat "></i> by{" "}
          <a
            className="hover:underline"
            href="https://www.linkedin.com/in/sahil-rajput3417/"
          >
            Sahil Rajput
          </a>
        </h1>
      </div>
      <div
        className="absolute bottom-22 font-semibold right-20  bg-red- flex items-center justify-between rounded-lg"
        onMouseEnter={() => setHoveringText(true)}
        onMouseLeave={() => setHoveringText(false)}
      >
        Battery Status
      </div>
      <div
        className="w-40 h-12 absolute bottom-8 right-8 bg-gray-200 rounded-lg overflow-hidden mb-2"
        onMouseEnter={() => setHoveringText(true)}
        onMouseLeave={() => setHoveringText(false)}
      >
        <BatteryStatus />
      </div>
      <CursorFollower hovering={hoveringText} />
    </div>
  );
};

export default Landingpage;
