import axios from "axios";
import { serverUrl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers } from "../Redux/userSlice";
import { useEffect } from "react";

const getOtherUser = async () => {
  let dispatch = useDispatch();
  let { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let result = await axios.get(serverUrl + "/api/user/users", {
          withCredentials: true,
        });
        dispatch(setOtherUsers(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);
};

export default getOtherUser;
