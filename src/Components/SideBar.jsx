import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.png";
import { MdSearch } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { CgLogOut } from "react-icons/cg";
import axios from "axios";
import { serverUrl } from "../main";
import {
  setSearchData,
  setSelectedUser,
  setUserData,
} from "../Redux/userSlice";
import { useNavigate } from "react-router";

function SideBar() {
  let { userData, otherUsers, selectedUser, onlineUsers, searchData } =
    useSelector((state) => state.user);
  let [searchShow, setSearchShow] = useState(false);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let [input, setInput] = useState("");
  const handleSearch = async () => {
    try {
      let result = await axios.get(
        serverUrl + `/api/user/search?query=${input}`,
        { withCredentials: true }
      );
      dispatch(setSearchData(result.data));
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log("handle logout error");
    }
  };

  useEffect(() => {
    if (input) {
      handleSearch();
    }
  }, [input]);

  return (
    <div
      className={`lg:w-[30%] w-full h-full overflow-hidden bg-slate-200 relative lg:block ${
        !selectedUser ? "block" : "hidden"
      }`}
    >
      <div className="w-full h-[34vh] lg:h-[38vh] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-md flex pl-[10px] pr-[20px] items-start flex-col  justify-center  ">
        <h1 className="font-bold text-[30px] text-white">Chatify</h1>
        <div className=" w-full flex justify-between items-center">
          <h1 className="text-gray-900 font-medium text-[19px]">
            Hii ,
            <span className="text-[25px] text-gray-950 font-bold">
              {userData.name || "User"}
            </span>
          </h1>
          <div
            className="w-[60px] h-[60px] rounded-full border-2 border-[#20c7ff] shadow-lg shadow-gray-400  relative cursor-pointer overflow-hidden flex justify-center items-center "
            onClick={() => {
              navigate("/profile");
            }}
          >
            <img src={userData.image || dp} alt="" />
          </div>
        </div>
        {searchShow && (
          <form className="w-full h-[50px] rounded-full bg-white cursor-pointer overflow-hidden flex justify-start items-center px-[10px] transition-all duration-10000 mt-[5px] relative">
            <MdSearch className="w-[25px] h-[25px] overflow-hidden" />
            <input
              type="text"
              placeholder="Search user"
              className="outline-none w-full h-full px-[10px] py-[5px] text-[16px]"
              onChange={(e) => {
                setInput(e.target.value);
              }}
              value={input}
            />
            <RxCross2
              className="w-[25px] h-[25px] overflow-hidden"
              onClick={() => {
                setSearchShow(false);
              }}
            />
          </form>
        )}

        {!searchShow && (
          <div className="flex justify-start items-center gap-[10px] overflow-scroll">
            <div
              className="w-[50px] h-[50px] rounded-full bg-white  relative cursor-pointer overflow-hidden flex justify-center items-center "
              onClick={() => {
                setSearchShow(true);
              }}
            >
              <MdSearch className="w-[25px] h-[25px]" />
            </div>

            {otherUsers?.map(
              (user) =>
                onlineUsers?.includes(user._id) && (
                  <div
                    className="relative rounded-full "
                    onClick={() => {
                      dispatch(setSelectedUser(user));
                    }}
                  >
                    <div className="w-[50px] h-[50px] rounded-full border-2 border-[#20c7ff] relative cursor-pointer overflow-hidden flex justify-center items-center ">
                      <img src={user.image || dp} alt="" />
                    </div>
                    <span className="w-[12px] h-[12px] rounded-full bg-green-300 absolute bottom-[2px] right-0 shadow-md shadow-gray-300"></span>
                  </div>
                )
            )}
          </div>
        )}
      </div>
      {input.length > 0 && (
        <div className="flex w-full px-[10px] py-[5px] h-[250px] overflow-y-auto flex-col gap-[10px] absolute top-[38%] z-100 justify-center items-center bg-white">
          {searchData?.map((user) => (
            <div
              className="w-full  h-[50px] flex justify-start items-center gap-[20px] bg-white  hover:bg-[#7fe5ff] border-b-1"
              onClick={() => {
                dispatch(setSelectedUser(user));
                setInput("");
                setSearchShow(false);
              }}
            >
              <div className="relative rounded-full shadow-md shadow-gray-400  ">
                <div className="w-[50px] h-[50px] rounded-full border-2 border-[#20c7ff] relative cursor-pointer overflow-hidden flex justify-center items-center ">
                  <img src={user.image || dp} alt="" />
                </div>
                {onlineUsers?.includes(user._id) && (
                  <span className="w-[12px] h-[12px] rounded-full bg-green-300 absolute bottom-[2px] right-0 shadow-md shadow-gray-300"></span>
                )}
              </div>

              <h1 className="font-semibold text-[20px] text-gray-700">
                {user.name || user.userName}
              </h1>
            </div>
          ))}
        </div>
      )}
      <div
        className="w-[60px] h-[60px] rounded-full  shadow-lg bg-[#20c7ff] shadow-gray-400  cursor-pointer overflow-hidden flex justify-center items-center absolute bottom-5 left-4  "
        onClick={() => {
          handleLogout();
        }}
      >
        <CgLogOut className="w-[25px] h-[25px]" />
      </div>

      <div className=" w-full h-[50%]  overflow-auto flex flex-col gap-[10px] px-[10px] mt-[10px] items-center  cursor-pointer">
        {otherUsers?.map((user) => (
          <div
            className="w-[95%] h-[60px] flex justify-start items-center gap-[20px] bg-white shadow-gray-500 shadow-lg rounded-[20px] hover:bg-[#7fe5ff]"
            onClick={() => {
              dispatch(setSelectedUser(user));
            }}
          >
            <div className="relative rounded-full flex justify-center items-center ">
              <div className="w-[50px] h-[50px] rounded-full border-2 border-[#20c7ff] relative cursor-pointer overflow-hidden flex justify-center items-center ml-[10px]">
                <img src={user.image || dp} alt="" />
              </div>
              {onlineUsers?.includes(user._id) && (
                <span className="w-[12px] h-[12px] rounded-full bg-green-300 absolute bottom-[2px] right-0 shadow-md shadow-gray-300"></span>
              )}
            </div>

            <h1 className="font-semibold text-[20px] text-gray-700">
              {user.name || user.userName}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideBar;
