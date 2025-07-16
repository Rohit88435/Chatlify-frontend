import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser, setUserData } from "../Redux/userSlice";
import { serverUrl } from "../main";

function Login() {
  let navigate = useNavigate();
  let [showpassword, setShowPassword] = useState(false);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [err, setErr] = useState("");
  let dispatch = useDispatch(); // set data

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result = await axios.post(
        serverUrl + "/api/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      dispatch(setSelectedUser(null));

      setLoading(false);
      setErr("");
      toast.success("Login successfully");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
      setErr(error?.response?.data?.message);
      setLoading(false);
      console.log("handleLogin error");
      setEmail("");
      setPassword("");
    }
  };
  return (
    <div className="w-full h-[100vh] bg-slate-200 flex justify-center items-center rounded-lg">
      <div className="w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px] ">
        <div className="w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex justify-center items-center ">
          <h1 className="text-gray-600 font-bold text-[30px]">
            Login To <span className="text-white">Chatify</span>
          </h1>
        </div>
        <form
          className="w-full flex flex-col gap-[30px] items-center"
          onSubmit={handleLogin}
        >
          <input
            type="email"
            placeholder="email"
            required
            className="w-[90%] h-[50px] outline-none border-[2px] border-[#20c7ff] px-[20px] py-[10px] bg-white shadow-gray-400 shadow-lg rounded-lg text-gray-700 text-[19px]"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <div className="w-[90%] h-[50px] flex justify-between items-center   border-[2px] border-[#20c7ff] bg-white  shadow-gray-400 shadow-lg rounded-lg overflow-hidden">
            <input
              type={showpassword ? "text" : "password"}
              required
              placeholder="password"
              className=" w-[90%] px-[20px] py-[10px] outline-none  text-gray-700 text-[19px]"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <span
              className="w-[10%] font-semibold text-[#6ebbe1]  cursor-pointer mr-[10px]"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
            >
              {!showpassword ? "Show" : "Hidden"}
            </span>
          </div>
          {err && <p className="text-[red]">{"*" + err + "*"}</p>}
          <button
            className=" px-[20px] py-[10px] bg-[#20c7ff] shadow-gray-400 shadow-lg rounded-2xl text-[20px] font-semibold text-[white] w-[200px] mt-[20px] cursor-pointer hover:shadow-inner hover:text-[21px] "
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          <p className="text-gray-700 font-medium">
            Create your account?
            <span
              className="text-[#20c7ff] font-semibold hover:underline cursor-pointer transition-all  "
              onClick={() => {
                navigate("/signup");
              }}
            >
              {" Sign up "}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
