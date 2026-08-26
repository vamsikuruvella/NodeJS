import { useEffect, useRef, useState } from "react";
import phoneIcon from "../assets/phone-down-svgrepo-com.svg";
import { createSocketConnection } from "../appStore/socket";
import {
    createPeerConnection,
    closePeerConnection
} from "../appStore/peerConnection";

const CallWin = ({ fromUser, toUser, onHangUp }) => {
    const [isCalling, setIsCalling] = useState(true);
    const [remoteStream, setRemoteStream] = useState(null);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const streamRef = useRef(null);

    const {
        _id,
        firstName,
        lastName,
        emailId,
    } = toUser;

    const hangUp = () => {
        console.log("📞 Hangup triggered");

        // Stop local camera + microphone
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
            });

            streamRef.current = null;
        }

        // Close WebRTC connection
        closePeerConnection();

        onHangUp();
    };

    // --------------------------------
    // Attach remote stream to video
    // --------------------------------

    useEffect(() => {
        if (!remoteVideoRef.current || !remoteStream) {
            return;
        }

        console.log("🎥 Attaching remote stream to video");

        remoteVideoRef.current.srcObject = remoteStream;

        remoteVideoRef.current
            .play()
            .catch(err => {
                console.log("Remote video play error:", err);
            });

    }, [remoteStream]);

    // --------------------------------
    // Start call
    // --------------------------------

    useEffect(() => {

        const startCall = async () => {

            console.log("🚨 START CALL EXECUTED");

            const socket = createSocketConnection();

            const pc = createPeerConnection();

            // --------------------------------
            // Get local camera + microphone
            // --------------------------------

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

            streamRef.current = stream;

            // Display local video
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            // Add tracks to PeerConnection
            stream.getTracks().forEach(track => {

                pc.addTrack(track, stream);

                console.log(
                    "Added local track:",
                    track.kind
                );
            });

            // --------------------------------
            // Receive remote video/audio
            // --------------------------------

            pc.ontrack = (event) => {

                console.log(
                    "🎥 REMOTE TRACK RECEIVED:",
                    event.track.kind
                );

                const stream = event.streams[0];

                if (stream) {
                    setRemoteStream(stream);
                }
            };

            // --------------------------------
            // ICE
            // --------------------------------

            pc.onicecandidate = (event) => {

                if (event.candidate) {

                    console.log(
                        "🧊 Sending ICE candidate"
                    );

                    socket.emit("iceCandidate", {
                        fromUser: fromUser._id,
                        toUser: toUser._id,
                        candidate: event.candidate
                    });
                }
            };

            // --------------------------------
            // Data channel
            // --------------------------------

            const dc =
                pc.createDataChannel("channel");

            window.dcp1 = dc;

            dc.onopen = () => {

                console.log(
                    "📡 Data channel opened"
                );

                console.log(
                    "Peer 1 channel:",
                    dc.id
                );
            };

            dc.onmessage = (event) => {

                console.log(
                    "From Peer 2:",
                    event.data
                );
            };

            // --------------------------------
            // Connection state
            // --------------------------------

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

            // --------------------------------
            // Create OFFER
            // --------------------------------

            const offer =
                await pc.createOffer();

            await pc.setLocalDescription(
                offer
            );

            console.log(
                "📤 Sending offer"
            );

            socket.emit("call", {
                status: "ping",
                fromUser,
                toUser,
                offer: pc.localDescription
            });
        };

        startCall();

        // --------------------------------
        // Cleanup
        // --------------------------------

        return () => {

            console.log(
                "🧹 CallWin cleanup"
            );

            if (streamRef.current) {

                streamRef.current
                    .getTracks()
                    .forEach(track => {
                        track.stop();
                    });

                streamRef.current = null;
            }
        };

    }, []);

    return (
        <>
            {isCalling && (
                <div>

                    <h3 className="font-bold text-lg">
                        Calling
                        <span className="loading loading-dots loading-sm" />
                    </h3>

                    <div className="flex flex-col items-center">

                        <p className="m-1">
                            {firstName} {lastName}
                        </p>

                        <p className="m-1">
                            {emailId}
                        </p>

                        <div className="flex gap-4">

                            {/* LOCAL VIDEO */}

                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-60 rounded-box bg-black"
                            />

                            {/* REMOTE VIDEO */}

                            {remoteStream && (
                                <video
                                    ref={remoteVideoRef}
                                    autoPlay
                                    playsInline
                                    className="w-60 rounded-box bg-black"
                                />
                            )}

                        </div>

                    </div>
                </div>
            )}

            <div className="modal-action">

                <button
                    type="button"
                    className="btn btn-active btn-error"
                    onClick={hangUp}
                >
                    <img
                        src={phoneIcon}
                        alt="Hang up"
                        className="w-6 h-6"
                    />
                </button>

            </div>
        </>
    );
};

export default CallWin;