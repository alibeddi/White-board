import "./index.css";

import CreateRoomForm from "./components/CreateRoomForm";
import JoinRoomForm from "./components/JoinRoomForm";
import React from 'react';
import { Socket } from 'socket.io-client';

// Define the props type
interface FormsProps {
    uuid: () => string;
    socket: Socket; // Assuming you're using socket.io-client
    setUser: (user: any) => void; // Replace 'any' with a more specific type as needed
}

const Forms: React.FC<FormsProps> = ({ uuid, socket, setUser }) => {
    return (
        <div className="row h-100 pt-5">
            <div className="col-md-4 mt-5 form-box border p-5 border-primary rounded-2 mx-auto d-flex flex-column align-items-center">
                <h1 className="text-primary fw-bold">Create Room</h1>
                <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser} />
            </div>
            <div className="col-md-4 mt-5 form-box border p-5 border-primary rounded-2 mx-auto d-flex flex-column align-items-center">
                <h1 className="text-primary fw-bold">Join Room</h1>
                <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser} />
            </div>
        </div>
    );
};

export default Forms;
