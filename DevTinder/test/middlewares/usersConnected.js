const connectionRequest = require('../models/connectionRequest');

const usersConnected = async (input) => {
    const { userId, targetUserId } = input;

    console.log("inputs:", userId, targetUserId);

    const res = await connectionRequest.findOne({
        status: "accepted",
        $or: [
            {
                fromUserId: userId,
                toUserId: targetUserId
            },
            {
                fromUserId: targetUserId,
                toUserId: userId
            }
        ]
    });

    console.log("output:", res);

    return !!res;
};

module.exports = usersConnected;