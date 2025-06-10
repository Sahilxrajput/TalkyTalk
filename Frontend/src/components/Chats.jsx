import React from 'react'

const Chat = ({foundChats}) => {

  
  
  return (
    <>
      {foundChats.map((chat,idx) => (
        <div key={idx} className="flex justify-start gap-4 w-full rounded-2xl bg-amber-500 p-2 ">
          <div className="w-14 rounded-full bg-red-400 aspect-square">
            <img className="object-cover rounded-full w-full h-full" src="https://i.guim.co.uk/img/media/53e33368ee15c494000585b83fbeefc16e6de41e/0_197_3500_2100/master/3500.jpg?width=465&dpr=1&s=none&crop=none" alt="profil" />
          </div>
          <div>
            <h2>{chat.chatName}</h2>
          </div>
        </div>
      ))}
    </>
  )
}

export default Chat