import "./App.css";
import io from "socket.io-client";
import { Route, Routes } from "react-router-dom";
import Forms from "./components/Forms";
import RoomPage from "./pages/RoomPage";
import { useEffect,useState } from "react";
const server='http://localhost:5000'
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};
const socket=io(server,connectionOptions)
const App = () => {
const [user,setUser]=useState({})
useEffect(()=>{
  socket.on('user-joined',(data)=>{
    if(data.success){
      setUser(data.user)
    }else{
      alert(data.message)
    }
  })
} ,[])
  const uuid = () => {
    let s4=()=>{
      return(((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return(s4()+s4()+"-"+s4()+"-"+s4()+"-"+s4()+"-"+s4()+s4()+s4());
  }
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser}/>} />
        <Route path="/:roomId" element={<RoomPage />} />
      </Routes>
    </div>
  );
};
export default App;