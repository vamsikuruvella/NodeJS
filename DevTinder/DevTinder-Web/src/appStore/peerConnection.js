let peerConnection = null;

export const createPeerConnection = () => {
    if (!peerConnection) {
        peerConnection = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302"
                }
            ]
        });
    }

    return peerConnection;
};

export const getPeerConnection = () => {
    return peerConnection;
};

export const closePeerConnection = () => {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
};