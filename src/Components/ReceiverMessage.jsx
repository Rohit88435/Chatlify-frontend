import React, { useEffect, useRef } from "react";
import dp from "../assets/dp.png";
import { useSelector } from "react-redux";
function ReceiverMessage({ image, message }) {
  let scroll = useRef();
  let { selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message, image]);

  const handleScroll = () => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="flex items-start gap-[20px] overflow-auto flex-wrap mb-[10px]">
      <div className="w-[40px] h-[40px] rounded-full shadow-lg shadow-gray-400  cursor-pointer overflow-hidden flex justify-center items-center gap-[10px]">
        <img src={selectedUser?.image || dp} alt="" />
      </div>
      <div
        ref={scroll}
        className={`max-w-[80%] px-5 py-3 bg-[#20c7ff] text-white text-base rounded-2xl rounded-tl-none relative mr-auto break-words ${
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
    </div>
  );
}

export default ReceiverMessage;
