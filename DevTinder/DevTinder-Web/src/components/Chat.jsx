import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from './constants';
import { addUser } from '../appStore/userSlice';
import { useState } from 'react';
import { createSocketConnection } from '../appStore/socket';
import { formatDistanceToNow } from "date-fns";


const Chat = () => {
    const { targetUserId } = useParams(); // Get the targetUserId from the URL parameters
    const [messages, setMessages] = useState([]); // Sample messages for demonstration
    const [newMessage, setNewMessage] = useState(''); // State to hold the new message input
    const user = useSelector((store) => store.user.user);
    const userId = user?._id; // Get the current user's ID from the Redux store

    const fetchChatMessages = async () => {
        const res = await axios.get(BASE_URL+"/chat/"+targetUserId,{withCredentials:true });
        console.log(res.data);

        const chatMessages = res?.data?.messages.map((msg)=>{
            return {text:msg.text,timestamp:msg.createdAt,firstName:msg.senderId.firstName, userId:msg.senderId._id}
        })
        setMessages(chatMessages);
    }
    useEffect(()=>{
        if(messages.length) return;
        fetchChatMessages();
    },[])
    useEffect(() => {
        if (!userId) return; // If userId is not available, do not proceed
        const socket = createSocketConnection();
        // As soon as the component mounts, emit an event to join the chat room for the target user
        socket.emit('joinChat', { firstName: user.firstName, userId, targetUserId }); // Join the chat room for the target user

        socket.on('messageReceived', ({ firstName, userId, targetUserId, text, timestamp }) => {
            setMessages((messages)=>[...messages, { firstName, userId, targetUserId, text, timestamp }]);
        });
        return () => {
            socket.disconnect(); // Clean up the socket connection when the component unmounts
        };
    }, [userId, targetUserId]); // Re-run the effect if userId or targetUserId changes

    if (!user) {
        return <div>Loading...</div>;
    }

    const sendMessage = () => {
        if (newMessage.trim() === '') return; // Do not send empty messages
        const socket = createSocketConnection();
        socket.emit('sendMessage', {
            firstName: user.firstName,
            userId, targetUserId, text: newMessage, timestamp: new Date() // Include a timestamp for the message
        }); // Emit the sendMessage event to the server
        // setMessages([...messages, { text: newMessage, userId, targetUserId, timestamp: new Date() }]); // Update the local messages state with the new message
        setNewMessage(''); // Clear the input field after sending the message
    }
    return (<div className="w-1/2 mx-auto border border-grey-600 mt-5 h-135 flex flex-col justify-between p-4 rounded-lg shadow-lg bg-base-200">
        <h1 className="text-4xl p-5 border-b">Chat </h1>
        <div className="flex-grow overflow-y-auto p-4">
            {/* Chat content goes here */}
            {messages.length === 0 ? (
                <p>No messages yet. Start the conversation!</p>
            ) : (
                console.log(userId, messages),
                messages.map((message, index) => {
                    if (userId == message.userId) {
                        return (
                            <div key={index} className="chat chat-end">
                                <div className="chat-header">
                                    You
                                    <time className="text-xs opacity-50">
                                        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                                    </time>
                                </div>

                                <div className="chat-bubble">
                                    {message.text}
                                </div>

                                <div className="chat-footer opacity-50">
                                    Sent
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={index} className="chat chat-start">
                            <div className="chat-header">
                                {message.firstName}
                                <time className="text-xs opacity-50">
                                    {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                                </time>
                            </div>

                            <div className="chat-bubble">
                                {message.text}
                            </div>

                            <div className="chat-footer opacity-50">
                                Sent
                            </div>
                        </div>
                    );
                })
            )}
        </div>
        <div>
            <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} type="text" placeholder="Type a message..." className="input input-bordered w-full" />
            <button onClick={sendMessage} className="btn btn-primary mt-2">Send</button>
        </div>
    </div>)
}

export default Chat