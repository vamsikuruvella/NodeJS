const connectionRequest = require('../models/connectionRequest');

const usersConnected = async (input)=>{
    const { firstName, userId, targetUserId } = input;
    const res = await connectionRequest.findOne({
        fromUserId: userId,
        toUserId: targetUserId,
        status:"accepted",
    })
    if(!res){
        return false;
    }
    return true;
}
module.exports = usersConnected;