import React from "react";

const Chats = ({
  isFocused,
  setIsFocused,
  setSearchChats,
  getChatData,
  setShowPopup,
  setReplyPopup,
  setChatTitle,
  selectedChatHandler,
}) => {
  return (
    <main>
      <nav className=" fixed w-full flex items-center justify-between px-4 h-16 rounded-t-4xl border-r-2 border-[#4E6766] bg-[#FFDBDB] ">
        {!isFocused && (
          <h4 className=" ml-20 tracking-wider bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text TalkyTalk text-2xl font-black">
            TalkyTalk
          </h4>
        )}

        <div
          className={`border-2 border-yellow-500 bg-gray-200 transition-[width] duration-300 ease-in-out hover:w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg ${
            isFocused ? "w-full" : "w-[12%]"
          }`}
        >
          <i className="ri-find-replace-line"></i>
          <input
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="appearance-none border-none w-full bg-transparent p-0 m-0 focus:outline-none"
            type="text"
            value={searchChats}
            onChange={(e) => setSearchChats(e.target.value)}
            placeholder="Search"
          />
        </div>
      </nav>
      {foundChats.map((chat, idx) => {
        const isSelected = selectedChatId === chat?._id;

        let chatData = getChatData(chat);

        return (
          <button
            onClick={() => {
              setShowPopup(false);
              setReplyPopup(false);
              setChatTitle({ ...chat });
              selectedChatHandler(chat._id);
            }}
            key={idx}
            className={`flex chats justify-start hover:cursor-pointer  gap-4 border-2 border-[#4E6766]  w-full rounded-2xl  p-2 ${
              isSelected ? "bg-red-500!" : " "
            } `}
          >
            <div className="w-14 rounded-full aspect-square">
              <img
                className="object-cover rounded-full w-full h-full"
                src={chatData?.image?.url || profileImg}
                alt="profil picture"
              />
            </div>
            <div>
              <h2 className=" font-semibold ">
                {chatData?.username || chatData?.chatName}
              </h2>
            </div>
          </button>
        );
      })}
      <div
        ref={addMemberRef}
        className="flex fixed w-[23%] z-30 top-180 h-1/4 items-center justify-center bg-yellow-300 rounded-4xl"
      >
        <AddMembers
          setSearchNewMembelPanel={setSearchNewMembelPanel}
          setcreateChat={setcreateChat}
          setCreateGroupPanel={setCreateGroupPanel}
        />
      </div>
      <div
        ref={searchNewMemberRef}
        className=" w-[23%] fixed h-[682px] rounded-4xl top-180 px-2 pt-[3%] z-30 overflow-x-hidden bg-red-400"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <CreatePersonalChatPanel
          user={user}
          setFoundChats={setFoundChats}
          setSearchNewMembelPanel={setSearchNewMembelPanel}
        />
      </div>

      <div
        ref={addToGroupRef}
        className=" w-[23%] fixed h-[682px] top-180 rounded-4xl z-30  bg-red-400"
      >
        <AddTOGroup
          chatTitle={chatTitle}
          setAddToGroupPanel={setAddToGroupPanel}
        />
      </div>

      <div
        ref={removeFromGroupRef}
        className=" w-[23%] fixed h-[98.5%] top-180 rounded-4xl z-30  bg-red-400"
      >
        <RemoveFromGroup
          chatTitle={chatTitle}
          setRemoveFromGroupPanel={setRemoveFromGroupPanel}
        />
      </div>

      <div ref={createGroupRef} className="fixed top-180 z-30 w-[23%]  h-[98%]">
        <CreategroupPanel
          user={user}
          setCreateGroupPanel={setCreateGroupPanel}
          setFoundChats={setFoundChats}
        />
      </div>

      <div
        ref={videoReqRef}
        className="h-40 w-60 rounded-2xl bg-green-400 fixed border-2 border-gray-500 -right-60 top-20"
      >
        <VideoReqPanel setVideoReqPanel={setVideoReqPanel} />
      </div>

      <div
        ref={aboutRef}
        className=" rounded-2xl  border-2 bg-green-400 border-gray-500 fixed -right-50 top-20"
      >
        <AboutPanel
          foundChats={foundChats}
          setFoundChats={setFoundChats}
          user={user}
          setAddToGroupPanel={setAddToGroupPanel}
          setRemoveFromGroupPanel={setRemoveFromGroupPanel}
          chatTitle={chatTitle}
          setChatRenamePanel={setChatRenamePanel}
          setAboutPanel={setAboutPanel}
        />
      </div>

      <div className="w-[70%] px-2 -top-18 right-5 fixed">
        <ChatRename
          chatTitle={chatTitle}
          setChatRenamePanel={setChatRenamePanel}
          chatRenameRef={chatRenameRef}
        />
      </div>

      <button
        type="button"
        onClick={() => {
          setcreateChat(true);
        }}
        className="bg-blue-700 aspect-square hover:cursor-pointer z-20 absolute text-black text-3xl bottom-2 left-72 flex items-center justify-center rounded-full h-[50px]"
      >
        <i className="ri-add-line"></i>
      </button>

      <div
        className="flex items-start justify-start mt-16 pt-4 gap-4 h-full flex-col w-full rounded-b-4xl  bg-[#FFDBDB] border-r-2 border-[#4E6766] overflow-x-hidden px-4 "
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      ></div>
    </main>
  );
};

export default Chats;
