import React from "react";

const VideoReqPanel = ({setVideoReqPanel}) => {
  return (
    <>
    <div className="flex items-center justify-center">
      <i
        onClick={() => {setVideoReqPanel(false)}}
        className="text-2xl -mb-4 text-center text-gray-700 font-semibold  ri-arrow-down-wide-fill"
        ></i>
        </div>
      <div className="flex h-36 p-2 gap-8 justify-center items-end">
        <button className="py-2 px-4 bg-red-700 rounded-lg font-semibold text-white">
          Ignore
        </button>
        <button className="py-2 px-10  bg-green-700 rounded-lg font-semibold text-white">
          Call
        </button>
      </div>
    </>
  );
};

export default VideoReqPanel;
