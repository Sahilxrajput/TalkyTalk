import React, { useEffect, useRef } from 'react'
import './chatShowArea.css'

const ChatShowArea = ({messages}) => {

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messages]);

  return (
    <div className="border-red-500 p-2 border-2 overflow-x-hidden flex flex-col items-end h-8/10 " style={{scrollbarWidth: "none", msOverflowStyle: "none"}}>
       {messages.map((msg, index) => (
        <div key={index} >
           <div className=' chat-bubble ' ref={messagesEndRef}>
           {msg}
            </div> 
        </div>
      ))}
    </div>  )
}

export default ChatShowArea