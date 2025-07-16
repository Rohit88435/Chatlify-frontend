import React, { use, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../Redux/userSlice";
import { serverUrl } from "../main";
function Signup() {
  let navigate = useNavigate();
  let [showpassword, setShowPassword] = useState(false);
  let [userName, setUserName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [err, setErr] = useState("");
  let dispatch = useDispatch(); // set data

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(serverUrl);
      let result = await axios.post(
        serverUrl + "/api/auth/signup",
        {
          userName,
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setLoading(false);
      setErr("");
      toast.success("Signup successfully");
      setUserName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
      setLoading(false);
      console.log("handleSignup error");
      setErr(error?.response?.data?.message);
      setEmail("");
      setPassword("");
      setUserName("");
    }
  };
  return (
    <div className="w-full h-[100vh] bg-slate-200 flex justify-center items-center rounded-lg">
      <div className="w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px] ">
        <div className="w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex justify-center items-center ">
          <h1 className="text-gray-600 font-bold text-[30px]">
            Welcome to <span className="text-white">Chatify</span>
          </h1>
        </div>
        <form
          className="w-full flex flex-col gap-[20px] items-center"
          onSubmit={handleSignup}
        >
          <input
            type="text"
            placeholder="username"
            required
            className="w-[90%] h-[50px] outline-none border-[2px] border-[#20c7ff] px-[20px] py-[10px] bg-white shadow-gray-400 shadow-lg rounded-lg text-gray-700 text-[19px]"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
          <input
            type="email"
            required
            placeholder="email"
            className="w-[90%] h-[50px] outline-none border-[2px] border-[#20c7ff] px-[20px] py-[10px] bg-white shadow-gray-400 shadow-lg rounded-lg text-gray-700 text-[19px]"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <div className="w-[90%] h-[50px] flex justify-between items-center   border-[2px] border-[#20c7ff] bg-white  shadow-gray-400 shadow-lg rounded-lg overflow-hidden">
            <input
              type={showpassword ? "text" : "password"}
              placeholder="password"
              required
              className=" w-[90%] px-[20px] py-[10px] outline-none  text-gray-700 text-[19px]"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <span
              className="w-[10%] font-semibold text-[#6ebbe1]  cursor-pointer mr-[15px]"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
            >
              {!showpassword ? "Show" : "Hidden"}
            </span>
          </div>
          {err && <p className="text-[red]">{"*" + err + "*"}</p>}
          <button
            className=" px-[20px] py-[10px] bg-[#20c7ff] shadow-gray-400 shadow-lg rounded-2xl text-[20px] font-semibold text-[white] w-[200px] mt-[10px] cursor-pointer hover:shadow-inner hover:text-[21px] "
            disabled={loading}
          >
            {loading ? "Loading.." : "Sign up"}
          </button>
          <p className="text-gray-700 font-medium">
            Already have an account?
            <span
              className="text-[#20c7ff] font-semibold hover:underline cursor-pointer transition-all  "
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
