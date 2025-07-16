import React, { useEffect, useRef, useState } from "react";
import { CgArrowLeft } from "react-icons/cg";
import axios from "axios";
import dp from "../assets/dp.png";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../Redux/userSlice";
import { BsEmojiSunglasses } from "react-icons/bs";
import { IoIosImages } from "react-icons/io";
import { FiSend } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import { serverUrl } from "../main";
import { setMessages } from "../Redux/messageSlice";

function MessageArea() {
  let { selectedUser, userData, socket } = useSelector((state) => state.user);
  let dispatch = useDispatch();

  let [showPicker, setShowPicker] = useState(false);
  let [input, setInput] = useState("");
  let [frontendImage, setFrontendImage] = useState(null);
  let [backendImage, setBackendImage] = useState(null);
  let image = useRef();
  let { messages } = useSelector((state) => state.message);

  const handleImage = (e) => {
    let file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSendImage = async (e) => {
    e.preventDefault();
    if (input.length == 0 && backendImage == null) {
      return null;
    }
    try {
      let formData = new FormData();
      formData.append("message", input);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      let result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );
      dispatch(setMessages([...messages, result.data]));
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    } catch (error) {
      console.log(`send message error ${error}`);
    }
  };

  const onEmojiClick = (emojiData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
    setShowPicker(false);
  };

  useEffect(() => {
    socket.on("newMessage", (mess) => {
      dispatch(setMessages([...messages, mess]));
    });
    return () => socket.off("newMessage");
  }, [messages, setMessages]);
  return (
    <div
      className={`lg:w-[70%] w-full h-full   bg-slate-200 border-l-2 ${
        selectedUser ? "flex" : "hidden"
      } border-slate-300  lg:flex`}
    >
      {selectedUser && (
        <div className="w-full h-[100vh] flex flex-col">
          <div className="w-full h-[80px] bg-[#4dc3ea] rounded-b-[30px] shadow-gray-400 shadow-lg flex pl-[10px] pr-[20px]  flex-row justify-start items-center gap-[20px]">
            <CgArrowLeft
              className="w-[30px] h-[30px] cursor-pointer text-[white]"
              onClick={() => {
                dispatch(setSelectedUser(null));
              }}
            />
            <div className="w-[40px] h-[40px] rounded-full shadow-lg shadow-gray-400  relative cursor-pointer overflow-hidden flex justify-center items-center ">
              <img src={selectedUser?.image || dp} alt="" />
            </div>
            <h1 className="font-semibold text-[20px] text-gray-700">
              {selectedUser?.name || "user"}
            </h1>
          </div>

          <div className="w-full  h-[76vh] lg:h-[70vh]  relative mt-[10px] px-[20px]  overflow-auto gap-[10px]">
            {showPicker && (
              <div className="absolute lg:bottom-[40px] bottom-[0] left-[20px] lg:left-[30px]">
                <EmojiPicker
                  width={250}
                  height={350}
                  className="shadow-lg z-50"
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}

            {messages &&
              messages?.map((mes) =>
                mes.sender == userData._id ? (
                  <SenderMessage image={mes.image} message={mes.message} />
                ) : (
                  <ReceiverMessage image={mes.image} message={mes.message} />
                )
              )}
          </div>
        </div>
      )}

      {!selectedUser && (
        <div className=" w-full h-full flex justify-center items-center flex-col">
          <h1 className="font-bold text-[50px] text-gray-700">
            Welcome to Chatify
          </h1>
          <div className="font-semibold text-[20px] text-gray-700">
            Chat Friendly
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="w-full lg:w-[70%] h-[100px]  fixed bottom-[20px]  flex justify-center items-center">
          <form
            className="w-[95%] lg:max-w-[65%] relative max-w-[90%] h-[60px] bg-[#20c7ff] rounded-full flex items-center px-[20px] py-[5px] gap-[20px]"
            onSubmit={handleSendImage}
          >
            {frontendImage && (
              <img
                src={frontendImage}
                alt=""
                className="w-[80px] absolute bottom-[70px] rounded-lg right-[20px]"
              />
            )}
            <div
              onClick={() => {
                setShowPicker((prev) => !prev);
              }}
            >
              <BsEmojiSunglasses className="w-[25px] h-[25px] text-gray-800 cursor-pointer" />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={image}
              hidden
              onChange={handleImage}
            />
            <input
              type="text"
              placeholder="message"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              className="w-full h-full px-[5px] outline-none border-0 text-[19px] text-white placeholder:text-white"
            />
            <div
              onClick={() => {
                image.current.click();
              }}
            >
              <IoIosImages className="w-[25px] h-[25px] text-gray-800 cursor-pointer" />
            </div>
            {(input.length != 0 || backendImage != null) && (
              <button>
                <FiSend className="w-[25px] h-[25px] text-gray-800 cursor-pointer" />
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default MessageArea;
