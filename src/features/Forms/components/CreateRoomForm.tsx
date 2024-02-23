'use client'

import React, { useState } from 'react';

import { Socket } from 'socket.io-client'; // Assuming you're using socket.io-client
import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/navigation';

interface RoomData {
    name: string;
    roomId: string;
    userId: string;
    host: boolean;
    presenter: boolean;
}

interface CreateRoomFormProps {
    uuid: () => string; // Assuming uuid is a function that returns a string
    socket: Socket;
    setUser: (user: RoomData) => void;
}

const CreateRoomForm: React.FC<CreateRoomFormProps> = ({ uuid, socket, setUser }) => {
    const [roomId, setRoomId] = useState<string>(uuid());
    const [name, setName] = useState<string>('');

    const router = useRouter()
    const handleCreateRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const roomData: RoomData = {
            name,
            roomId,
            userId: uuid(),
            host: true,
            presenter: true,
        };
        setUser(roomData);
        router.push(`/${roomId}`);
        socket.emit('userJoined', roomData);
    };

    return (
        <form className="form col-md-12 mt-5">
            <div className="form-group">
                <input
                    type="text"
                    className="form-control my-2"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-group border ">
                <div className="input-group d-flex align-items-center justify-content-center">
                    <input
                        type="text"
                        value={roomId}
                        className="form-control my-2 border-0"
                        disabled
                        placeholder="Generate room code"
                    />
                    <div className="input-group-append">
                        <button className="btn btn-primary btn-sm me-1" type="button" onClick={() => setRoomId(uuid())}>
                            Generate
                        </button>
                        <button className="btn btn-outline-danger btn-sm me-2" type="button">Copy</button>
                    </div>
                </div>
            </div>
            <button type='button' onClick={handleCreateRoom} className="btn btn-primary mt-4 btn-block form-control">Generate Room</button>
        </form>
    );
};

export default CreateRoomForm;
