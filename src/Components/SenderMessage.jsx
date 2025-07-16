import React, { useEffect, useRef } from "react";
import dp from "../assets/dp.png";
import { useSelector } from "react-redux";
function SenderMessage({ image, message }) {
  let scroll = useRef();
  let { userData } = useSelector((state) => state.user);
  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  const handleScroll = () => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex items-end gap-4 mb-5">
      {/* Avatar on the right */}

      {/* Message bubble */}
      <div
        ref={scroll}
        className={`max-w-[80%] px-5 py-3 bg-[#20c7ff] text-white text-base rounded-2xl rounded-tr-none relative ml-auto break-words ${
          message && message.length >= 30 ? "break-words" : ""
        }`}
      >
        {/* Image in message (optional) */}
        {image && (
          <img
            src={image}
            alt="attachment"
            className="w-24 rounded-lg mb-2"
            onLoad={handleScroll}
          />
        )}
        {/* Message text */}
        {message && <span>{message}</span>}
      </div>
      <div className="w-10 h-10 rounded-full shadow-md overflow-hidden">
        <img
          src={userData.image || dp}
          alt="avatar"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default SenderMessage;
