import React from "react";
import SideBar from "../Components/SideBar";
import MessageArea from "../Components/MessageArea";
import getMessage from "../CustomHooks/getMessage";

function Home() {
  return (
    <div className="flex w-full h-[100vh]">
      <SideBar />
      <MessageArea />
    </div>
  );
}

export default Home;
