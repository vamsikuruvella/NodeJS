const socket = require('socket.io');
const crypto = require('crypto');
const Chat = require('../models/chat');
const usersConnect =  require("../middlewares/chatValidation");

function generateRoomId(userId1, userId2) {
    const sortedIds = [userId1, userId2].sort(); // Sort the IDs to ensure consistent order
    const combinedIds = sortedIds.join('__'); // Combine the sorted IDs into a single string
    return crypto.createHash('sha256').update(combinedIds).digest('hex'); // Generate a SHA-256 hash of the combined string
}

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:5174", "https://urban-space-xylophone-jw9v9gv54rvc5xg-3000.app.github.dev/", "https://urban-space-xylophone-jw9v9gv54rvc5xg-5173.app.github.dev/", "https://urban-space-xylophone-jw9v9gv54rvc5xg-5174.app.github.dev/"],
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Handle incoming joinChat events from clients
        socket.on('joinChat',async ({ firstName, userId, targetUserId }) => {
            const connected = await usersConnect({userId, targetUserId })
            if(!connected){
                console.log("Users not connected");
                return;
            }
            const room = generateRoomId(userId, targetUserId); // Create a unique room name based on user IDs
            console.log(`User ${firstName} (${userId}) joined room: ${room}`);
            socket.join(room); // Join the room
        });
        // Handle incoming messages from clients
        socket.on('sendMessage', async ({ firstName, userId, targetUserId, text, timestamp }) => {
            const connected = await usersConnect({userId, targetUserId })
            if(!connected){
                console.log("Users not connected");
                return;
            }
            console.log(`Message from ${firstName} (${userId}) to ${targetUserId}: ${text}`);
            // save message to DB
            try {
                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] }
                });
                if (!chat) {
                    chat = await Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    })
                }
                chat.messages.push({
                    senderId: userId,
                    receiverId: targetUserId,
                    text
                });
                await chat.save();
                const room = generateRoomId(userId, targetUserId); // Create a unique room name based on user IDs
                io.to(room).emit('messageReceived', { firstName, userId, targetUserId, text, timestamp }); // Broadcast the message to the room
            } catch (err) {
                console.log("Error saving message to DB: ", err);
            }

        });
        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });

};
module.exports = { initializeSocket };