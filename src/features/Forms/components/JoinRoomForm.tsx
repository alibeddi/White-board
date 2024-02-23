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

interface JoinRoomFormProps {
    uuid: () => string; // Assuming uuid is a function that returns a string
    socket: Socket; // Use the appropriate type for your socket
    setUser: (user: any) => void; // Specify the correct type for your user
}

const JoinRoomForm: React.FC<JoinRoomFormProps> = ({ uuid, socket, setUser }) => {
    const [roomId, setRoomId] = useState<string>('');
    const [name, setName] = useState<string>('');
    const router = useRouter()

    const handleJoinRoom = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Construct the room data object
        const roomData = {
            name,
            roomId,
            userId: uuid(), // Generate a new userId for this session
            host: false,
            presenter: false,
        };

        setUser(roomData); // Set the user data with the new room information
        router.push(`/${roomId}`); // Navigate to the room's page
        socket.emit('userJoined', roomData); // Emit the userJoined event with the room data
    };

    return (
        <form className="form col-md-12 mt-5" onSubmit={handleJoinRoom}>
            <div className="form-group">
                <input
                    type="text"
                    className="form-control my-2"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    className="form-control my-2 border"
                    placeholder="Enter room code"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-primary mt-4 btn-block form-control">Join Room</button>
        </form>
    );
};

export default JoinRoomForm;


