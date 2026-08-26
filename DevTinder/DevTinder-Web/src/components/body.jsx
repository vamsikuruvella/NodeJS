import { Outlet } from 'react-router-dom'
import Navbar from './NavBar'
import Footer from './footer'
import axios from 'axios'
import { BASE_URL } from './constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../appStore/userSlice';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { createSocketConnection } from '../appStore/socket';
import CallWin from './CallWin';
import Callincoming from './Callincoming';
import { createPeerConnection, getPeerConnection, closePeerConnection } from "../appStore/peerConnection";


const Body = () => {
    console.log("Body rendered");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.user);
    const [isCalling, showisCalling] = useState(false);
    const [fromUser, setfromUser] = useState(null);
    const [toUser, settoUser] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const fetchUser = async () => {
        try {
            if (userData.user) {
                return;
            }
            const res = await axios.get(
                BASE_URL + "/profile/view",
                { withCredentials: true }
            );
            dispatch(addUser(res.data));
        } catch (err) {
            console.log("Error fetchUser: " + err);
            if (err.status === 400 || err.status === 401) {
                navigate("/login");
            }
        }
    };
    useEffect(() => {
        console.log("🔥 SOCKET EFFECT SETUP", userData?.user?._id);
        console.log("Socket useEffect running");
        console.log("user id:", userData?.user?._id);
        if (!userData?.user?._id) return;

        const socket = createSocketConnection();

        console.log("Listening for call events...");

        socket.on("incomingCall" + userData.user._id, async (data) => {
            console.log("from user data: " + data.fromUser);
            if (data.status === "ping") {
                const pc = createPeerConnection();
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                stream.getTracks().forEach(track => {
                    pc.addTrack(track, stream);
                });
                pc.ontrack = (event) => {
                    console.log("🎥 Track received:", event.track.kind);

                    const stream = event.streams[0];
                    setRemoteStream(stream);

                    console.log("Remote stream:", window.remoteStream);
                };
                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit("iceCandidate", {
                            fromUser: data.toUser,
                            toUser: data.fromUser,
                            candidate: event.candidate
                        });
                    }
                };

                pc.ondatachannel = (event) => {
                    const dc = event.channel;
                    window.dcp2 = dc;
                    console.log("📡 Data channel received:", dc.label);

                    dc.onopen = () => {
                        console.log("📡 Peer 2 data channel opened");
                        console.log("Peer 2 channel ID:", dc.id);
                        console.log("📡 Data channel opened");

                        dc.send("Hello from Peer 2!");
                    };

                    dc.onmessage = (event) => {
                        console.log("From Peer 1:", event.data);
                    };
                };

                pc.oniceconnectionstatechange = () => {
                    console.log(
                        "🧊 ICE state:",
                        pc.iceConnectionState
                    );
                };

                pc.onconnectionstatechange = () => {
                    console.log(
                        "🔗 WebRTC state:",
                        pc.connectionState
                    );
                };

                await pc.setRemoteDescription(data.offer);

                console.log("Offer received and remote description set");

                const answer = await pc.createAnswer();

                console.log("Line 73 " + JSON.stringify(answer));

                await pc.setLocalDescription(answer);
                console.log("Peer 2 senders:",
                    pc.getSenders().map(s => s.track?.kind)
                );

                console.log("Answer SDP:", pc.localDescription.sdp);
                socket.emit("answer", {
                    fromUser: data.toUser,
                    toUser: data.fromUser,
                    answer: pc.localDescription
                });
                setfromUser(data.fromUser);
                settoUser(data.toUser);
                showisCalling(true);
            }
            console.log("🔥 CALL EVENT RECEIVED:", data);
        });

        socket.on("incomingAnswer" + userData.user._id, async (data) => {
            const pc = getPeerConnection();

            console.log(
                "Before setting answer:",
                pc.signalingState
            );

            await pc.setRemoteDescription(data.answer);

            console.log(
                pc.getReceivers().map(receiver => ({
                    kind: receiver.track?.kind,
                    state: receiver.track?.readyState
                }))
            );

            console.log("Peer 1: Answer set");
        });

        socket.on("iceCandidate" + userData.user._id, async (data) => {
            console.log("🧊 ICE");

            const pc = getPeerConnection();

            await pc.addIceCandidate(data.candidate);
        });

        return () => {
            console.log("🔥 Body socket effect CLEANUP");
            socket.off("incomingCall" + userData.user._id);
            socket.off("incomingAnswer" + userData.user._id);
        };
    }, [userData?.user?._id]);

    useEffect(() => {
        console.log("Body useEffect");
        fetchUser();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                <Outlet />

                {isCalling && (
                    // <div className="toast">
                    <dialog open className="modal ">
                        <div className="modal-box fixed right-5 bottom-5 w-96 max-w-[calc(100vw-2rem)]">
                            <Callincoming
                                fromUser={fromUser}
                                remoteStream={remoteStream}
                            />
                        </div>
                    </dialog>
                    // </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Body