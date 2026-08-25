import { useEffect, useState } from "react";
import phoneIcon from "../assets/phone-down-svgrepo-com.svg";
import { createSocketConnection } from '../appStore/socket';
import { createPeerConnection } from "../appStore/peerConnection";

const CallWin = ({ fromUser, toUser, onHangUp }) => {
    const [isCalling, showisCalling] = useState(true);
    const { _id, firstName, lastName, emailId, about, age, gender, photoUrl } = toUser;
    const cur_id = fromUser._id;
    const cur_firstName = fromUser.firstName;
    const cur_lastName = fromUser.lastName;
    const cur_emailId = fromUser.emailId;
    const cur_about = fromUser.about;
    const cur_age = fromUser.age;
    const cur_gender = fromUser.gender;
    const cur_photoUrl = fromUser.photoUrl;
    const hangUp = () => {
        const video = document.querySelector("video");
        video.remove();
        onHangUp();
        return;
    };
    useEffect(() => {
        const startCall = async () => {
            console.log("🚨 START CALL EXECUTED");
            console.log("CallWin mounted");
            console.log("Calling:", _id, "to:", cur_id);

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            const video = document.querySelector("video");

            console.log(video);
            video.autoplay = true;
            video.playsInline = true;
            video.muted = true;

            video.style.background = "black";

            video.srcObject = stream;

            const socket = createSocketConnection();

            const pc = await handleWebRTC(socket);


            socket.emit("call", {
                status: "ping",
                fromUser: fromUser,
                toUser: toUser,
                offer: pc.localDescription
            });

            console.log("call event emitted");
        };

        startCall();

    }, []);

    const handleWebRTC = async (socket) => {
        const peerConnection = createPeerConnection();
        console.log("HandleWebRTC triggered");
        peerConnection.onicecandidate = (event) => {

            console.log("🧊 onicecandidate fired:", event.candidate);

            if (event.candidate) {

                console.log("🧊 Sending ICE candidate");

                socket.emit("iceCandidate", {
                    fromUser: fromUser._id,
                    toUser: toUser._id,
                    candidate: event.candidate
                });
            } else {
                console.log("🧊 ICE gathering complete");
            }
        };

        const dc = peerConnection.createDataChannel("channel");
        window.dcp1 = dc;

        console.log("Created DC:", dc);
        console.log("Initial ID:", dc.id);

        dc.onopen = () => {
            console.log("📡 Data channel opened");
            console.log("Peer 1 ID:", dc.id);
            console.log("Peer 1 state:", dc.readyState);

            dc.send("Hello from Peer 1!");
        };

        dc.onmessage = (event) => {
            console.log("From Peer 2:", event.data);
        };

        peerConnection.onicegatheringstatechange = () => {
            console.log(
                "🧊 ICE gathering state:",
                peerConnection.iceGatheringState
            );
        };

        const offer = await peerConnection.createOffer();
        console.log(
            "Before offer:",
            peerConnection.iceGatheringState
        );

        console.log(
            "Before setLocalDescription:",
            peerConnection.iceGatheringState
        );

        await peerConnection.setLocalDescription(offer);

        console.log(
            "After setLocalDescription:",
            peerConnection.iceGatheringState
        );
        return peerConnection;
    }
    return <>
        {isCalling && <div><h3 className="font-bold text-lg">Calling<span className="loading loading-dots loading-sm"></span></h3>
            <div className="flex flex-col items-center">
                
                <p className="m-1">
                    {firstName}{" "}{lastName}
                </p>
                <p className="m-1">{emailId}</p>
                <video className="w-80 rounded-box"></video>
                <div>

                </div>
            </div></div>}
        <div className="modal-action">
            

            <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-active btn-error" onClick={hangUp}>
                    <img
                        src={phoneIcon}
                        alt="Call"
                        className="w-6 h-6"
                    />
                </button>
            </form>
        </div>
    </>
}

export default CallWin;