'use client'

import React, { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

import CreateRoomForm from "./components/CreateRoomForm";
import JoinRoomForm from "./components/JoinRoomForm";

const server = 'http://localhost:5000'
const connectionOptions = {
    "force new connection": true,
    reconnectionAttempts: Infinity,
    timeout: 10000,
    transports: ["websocket"],
};

// Define the props type
interface FormsProps {

}

const Forms: React.FC<FormsProps> = () => {
    const [user, setUser] = useState({})

    const socket = io(server, connectionOptions)
    useEffect(() => {
        socket.on('user-joined', (data: any) => {
            if (data.success) {
                setUser(data.user)
            } else {
                alert(data.message)
            }
        })
    }, [])
    const uuid = () => {
        let s4 = () => {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4());
    }
    return (
        <div className="row flex gap-24 h-full pt-5">
            <div className="col-md-4 mt-5 form-box border p-5 border-blue rounded-2 mx-auto flex flex-col items-center">
                <h1 className="text-primary fw-bold">Create Room</h1>
                <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser} />
            </div>
            <div className="col-md-4 mt-5 form-box border p-5 border-blue rounded-2 mx-auto flex flex-col items-center">
                <h1 className="text-primary fw-bold">Join Room</h1>
                <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser} />
            </div>
        </div>
    );
};

export default Forms;
