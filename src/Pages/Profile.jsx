import React, { useRef, useState } from "react";
import dp from "../assets/dp.png";
import { MdArrowBack, MdOutlinePhotoCamera } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import { serverUrl } from "../main";
import { setUserData } from "../Redux/userSlice";
import { toast } from "react-toastify";

function Profile() {
  let { userData } = useSelector((state) => state.user);
  let [name, setName] = useState(userData?.name || "");
  let [frontendImage, setFrontendImage] = useState(userData?.image || dp);
  let [backendImage, setBackendImage] = useState("");
  let [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  let image = useRef();
  let dispatch = useDispatch();

  const handleImage = (e) => {
    let file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    try {
      console.log("pfile");
      setLoading(true); // Start loading spinner or disable form
      let formData = new FormData();
      formData.append("name", name);

      if (backendImage) {
        formData.append("image", backendImage);
      }
      console.log(serverUrl);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        serverUrl + `/api/user/profile`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("pfile");
      dispatch(setUserData(response.data)); // Update Redux/user state
      setLoading(false);
      navigate("/"); // Redirect to home
    } catch (error) {
      setLoading(false);
      console.error(
        "handleProfile error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-200 flex flex-col justify-center items-center gap-[40px] relative">
      <MdArrowBack
        className="w-[30px] h-[30px] absolute left-10 top-6 text-gray-800 cursor-pointer"
        onClick={() => [navigate("/")]}
      />
      <div
        className="w-[200px] h-[200px] rounded-full border-3 border-[#20c7ff] shadow-lg shadow-gray-400  relative cursor-pointer overflow-hidden flex justify-center items-center z-[10]"
        onClick={() => {
          image.current.click();
        }}
      >
        <div className="w-[100%] h-[100%] overflow-hidden flex justify-center items-center object-center">
          <img src={frontendImage} alt="" className=" w-[100%] h-[100%]" />
        </div>
        <div className="w-[35px] h-[35px] absolute bottom-6 right-5 bg-[#20c7ff] shadow-gray-400 shadow-lg rounded-full flex justify-center items-center overflow-visible">
          <MdOutlinePhotoCamera className="absolute bottom-1 right-1 text-gray-700 w-[25px] h-[25px] cursor-pointer z-[20]" />
        </div>
      </div>
      <form
        onSubmit={handleProfile}
        className="w-[95%]  max-w-[500px] flex flex-col justify-center items-center gap-[20px] "
      >
        <input
          type="file"
          accept="image/*"
          hidden
          ref={image}
          onChange={handleImage}
        />
        <input
          type="text"
          placeholder="Enter your name"
          className="w-[90%] h-[50px] outline-none border-[2px] border-[#20c7ff] px-[20px] py-[10px] bg-white shadow-gray-400 shadow-lg rounded-lg text-gray-500 text-[19px]"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          type="text"
          readOnly
          className="w-[90%] h-[50px] outline-none border-[2px] border-[#20c7ff] px-[20px] py-[10px] bg-white shadow-gray-400 shadow-lg rounded-lg text-gray-500 text-[19px]"
          value={userData.userName}
        />
        <input
          type="email"
          readOnly
          className="w-[90%] h-[50px] outline-none border-[2px] border-[#20c7ff] px-[20px] py-[10px] bg-white shadow-gray-400 shadow-lg rounded-lg text-gray-500 text-[19px]"
          value={userData.email}
        />
        <button
          className=" px-[20px] py-[10px] bg-[#20c7ff] shadow-gray-400 shadow-lg rounded-2xl text-[20px] font-semibold text-gray-900 w-[200px] mt-[20px] cursor-pointer hover:shadow-inner hover:text-[21px] "
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
